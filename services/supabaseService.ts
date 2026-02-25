
import { supabase } from '../supabase/client';
import { Product, User, Review } from '../types';

// Helper function to get user profile
const getUserProfile = async (userId: string): Promise<User | null> => {
    const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
    
    // Map database snake_case to frontend camelCase
    return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role
    };
};


// --- DATABASE ---

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, reviews(*, user_profiles(full_name))')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  // Map the data to match the frontend's expected types
  return data.map((product: any) => ({
      ...product,
      imageUrl: product.image_url,
      isSoldOut: product.is_sold_out,
      artistNote: product.artist_note,
      reviews: product.reviews.map((review: any) => ({
          ...review,
          author: review.user_profiles.full_name,
          createdAt: review.created_at,
      })),
  }));
};

export const createProduct = async (product: Omit<Product, 'id' | 'reviews'>): Promise<Product> => {
    const { data, error } = await supabase
        .from('products')
        .insert({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image_url: product.imageUrl,
            is_sold_out: product.isSoldOut,
            artist_note: product.artistNote
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        throw error;
    }
    return {
        ...data,
        imageUrl: data.image_url,
        isSoldOut: data.is_sold_out,
        artistNote: data.artist_note,
        reviews: []
    } as Product;
};

export const updateProduct = async (productId: string, updates: { isSoldOut: boolean }): Promise<Product | null> => {
    const { data, error } = await supabase
        .from('products')
        .update({ is_sold_out: updates.isSoldOut })
        .eq('id', productId)
        .select()
        .single();
    
    if (error) {
        console.error(`Error updating product ${productId}:`, error);
        throw error;
    }
    return data as Product;
};

export const createReview = async (productId: string, userId: string, rating: number, comment: string): Promise<Review> => {
    const { data, error } = await supabase
        .from('reviews')
        .insert({ product_id: productId, user_id: userId, rating, comment })
        .select()
        .single();

    if (error) {
        console.error('Error creating review:', error);
        throw error;
    }
    return data as Review;
};


// --- AUTH ---

export const signUp = async (fullName: string, email: string, pass: string): Promise<User | null> => {
    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
            data: {
                full_name: fullName,
            }
        }
    });

    if (error) throw error;
    if (!authData.user) throw new Error('Sign up failed.');

    // The trigger will create the profile, so we fetch it.
    // It might take a moment to be created, so we add a small delay and retry.
    for (let i = 0; i < 3; i++) {
        const profile = await getUserProfile(authData.user.id);
        if (profile) return profile;
        await new Promise(res => setTimeout(res, 500)); // wait 500ms
    }
    
    throw new Error('Could not retrieve user profile after sign up.');
};

export const signIn = async (email: string, pass: string): Promise<User | null> => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
    });
    if (error) throw error;
    if (!authData.user) throw new Error('Sign in failed.');
    
    return getUserProfile(authData.user.id);
};

export const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const checkSession = async (): Promise<User | null> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) return null;

    return getUserProfile(session.user.id);
};
