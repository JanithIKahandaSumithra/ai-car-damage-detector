import { useState } from 'react';

const ImageDisplay = ({ imageData, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  const renderImage = (imageData) => {
    if (!imageData) return null;
    
    // Return as-is if it's already a complete data URL
    if (imageData.startsWith('data:image')) {
      return imageData;
    }
    
    // For legacy base64 strings without prefix
    try {
      if (imageData.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)) {
        return `data:image/jpeg;base64,${imageData}`;
      }
    } catch (error) {
      console.error('Error processing base64 image:', error);
    }
    
    // Return original if none of the above match
    return imageData;
  };

  if (hasError) {
    return (
      <div className="mt-2 bg-gray-100 rounded-md p-4 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  const imageUrl = renderImage(imageData);
  if (!imageUrl) {
    return (
      <div className="mt-2 bg-gray-100 rounded-md p-4 flex items-center justify-center">
        <span className="text-gray-500 text-sm">No image provided</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Damage"
      className={`mt-2 h-48 w-auto object-cover rounded-lg ${className}`}
      onError={(e) => {
        console.error('Image load error');
        setHasError(true);
      }}
    />
  );
};

export default ImageDisplay;