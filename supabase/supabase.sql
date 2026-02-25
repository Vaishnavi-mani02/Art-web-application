
-- Nebula's Art Gallery Supabase Schema

-- 1. Create Custom Types (Enums)
CREATE TYPE public.product_category AS ENUM ('Painting', 'Sketch', 'Craft', 'Keychain');
CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'collector');

-- 2. Create user_profiles Table
-- This table stores public user data and is linked to the auth.users table.
CREATE TABLE public.user_profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  role user_role NOT NULL DEFAULT 'user'::user_role
);
COMMENT ON TABLE public.user_profiles IS 'Public profile information for each user.';

-- 3. Create products Table
CREATE TABLE public.products (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  category product_category NOT NULL,
  image_url text,
  is_sold_out boolean NOT NULL DEFAULT false,
  artist_note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.products IS 'Stores all the art pieces available in the gallery.';

-- 4. Create reviews Table
CREATE TABLE public.reviews (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.reviews IS 'Stores user reviews for each product.';

-- 5. Set up Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- user_profiles policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- products policies
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products." ON public.products FOR ALL USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
);

-- reviews policies
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews." ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update or delete their own reviews." ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews." ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- 7. Function and Trigger to create a user profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Seed Data for Products
-- This data is based on your constants.tsx file for easy setup.
INSERT INTO public.products (id, name, description, price, category, image_url, is_sold_out) VALUES
('8a1c5d6e-0b7f-4b1e-9b0a-2c3d4e5f6a7b', 'Cosmic Dreamscape', 'A vibrant acrylic painting on a 24x36 inch canvas, depicting a swirling nebula in deep blues, purples, and pinks. Stars are highlighted with metallic silver paint.', 36000.00, 'Painting', 'https://picsum.photos/seed/cosmic/800/600', false),
('1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e', 'Whispering Woods', 'An intricate pencil sketch of an ancient, mystical forest. The detail in the bark and leaves creates a sense of profound tranquility. 18x24 inch on archival paper.', 17600.00, 'Sketch', 'https://picsum.photos/seed/woods/800/600', false),
('c7d8e9f0-a1b2-c3d4-e5f6-a7b8c9d0e1f2', 'Ocean''s Heart', 'A handmade ceramic vase glazed in deep ocean blues and greens, with a unique heart-shaped opening. Perfect for holding a single, precious flower. Approx. 8 inches tall.', 6800.00, 'Craft', 'https://picsum.photos/seed/ocean/800/600', true),
('3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', 'City of Glass', 'An abstract painting using mixed media and resin to create a multi-layered, reflective cityscape. Dominated by cool blues and sharp, geometric lines. 30x30 inch canvas.', 52000.00, 'Painting', 'https://picsum.photos/seed/city/800/600', false),
('e9f0a1b2-c3d4-e5f6-a7b8-c9d0e1f2a3b4', 'Ephemeral Portrait', 'A delicate charcoal sketch capturing a fleeting expression. The use of light and shadow gives the subject an ethereal, ghost-like quality. 16x20 inch.', 14400.00, 'Sketch', 'https://picsum.photos/seed/portrait/800/600', false),
('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', 'Sunstone Amulet', 'A wire-wrapped sunstone pendant on a sterling silver chain. The stone is known for its properties of leadership and joy. A one-of-a-kind wearable art piece.', 9600.00, 'Craft', 'https://picsum.photos/seed/sunstone/800/600', false),
('f1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o', 'Stellar Keychain', 'A miniature hand-painted nebula encased in a durable resin keychain. Each piece is unique and features a tiny, glowing star in the center.', 2000.00, 'Keychain', 'https://picsum.photos/seed/keychain/800/600', false);

