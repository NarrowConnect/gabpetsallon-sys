import { useState } from 'react';
import dogBreedsImage from "@/assets/dog-breeds-collection.jpg";

interface PetBreedImageProps {
  breed?: string;
  className?: string;
  fallbackClassName?: string;
}

const PetBreedImage = ({ breed, className = "w-16 h-16", fallbackClassName }: PetBreedImageProps) => {
  const [imageError, setImageError] = useState(false);

  // Mapear raças para índices específicos da imagem
  const breedImageMap: { [key: string]: string } = {
    'golden retriever': 'Golden Retriever',
    'golden': 'Golden Retriever',
    'pastor alemão': 'German Shepherd',
    'pastor': 'German Shepherd',
    'labrador': 'Labrador',
    'poodle': 'Poodle',
    'bulldog': 'Bulldog',
    'chihuahua': 'Chihuahua',
    'border collie': 'Border Collie',
    'beagle': 'Beagle',
    'yorkshire': 'Yorkshire Terrier',
    'rottweiler': 'Rottweiler',
    'husky': 'Siberian Husky',
    'dachshund': 'Dachshund',
    'salsicha': 'Dachshund',
    'srd': 'Mixed Breed',
    'sem raça definida': 'Mixed Breed',
    'vira-lata': 'Mixed Breed'
  };

  const getBreedIcon = () => {
    if (!breed) return '🐕';
    
    const normalizedBreed = breed.toLowerCase();
    const mappedBreed = breedImageMap[normalizedBreed];
    
    // Ícones específicos para cada raça
    const breedIcons: { [key: string]: string } = {
      'Golden Retriever': '🦮',
      'German Shepherd': '🐕‍🦺',
      'Labrador': '🦮',
      'Poodle': '🐩',
      'Bulldog': '🐕',
      'Chihuahua': '🐕',
      'Border Collie': '🐕‍🦺',
      'Beagle': '🐕',
      'Yorkshire Terrier': '🐕',
      'Rottweiler': '🐕‍🦺',
      'Siberian Husky': '🐺',
      'Dachshund': '🌭',
      'Mixed Breed': '🐕'
    };

    return breedIcons[mappedBreed || ''] || '🐕';
  };

  if (imageError) {
    return (
      <div className={`${className} ${fallbackClassName} bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center border-2 border-blue-200`}>
        <span className="text-2xl" role="img" aria-label={`Ícone da raça ${breed || 'cão'}`}>
          {getBreedIcon()}
        </span>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-full overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center relative`}>
      <img 
        src={dogBreedsImage} 
        alt={`Imagem representativa da raça ${breed || 'cão'}`}
        className="w-full h-full object-cover opacity-80"
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-full" />
      <span className="absolute bottom-1 right-1 text-xs bg-white/80 px-1 rounded-full">
        {getBreedIcon()}
      </span>
    </div>
  );
};

export default PetBreedImage;