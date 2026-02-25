
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, size = 20 }) => {
  const isEditable = !!onRatingChange;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={isEditable ? () => onRatingChange(ratingValue) : undefined}
            className={`transition-colors duration-200 ${isEditable ? 'cursor-pointer' : 'cursor-default'}`}
            aria-label={`Rate ${ratingValue} stars`}
          >
            <Star
              size={size}
              className={
                ratingValue <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-500'
              }
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
