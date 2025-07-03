import { Box, Wrap } from '@chakra-ui/react';
import Link from 'next/link';

interface ColorsProps {
  colors?: string[];
  limit?: number;
  size?: 'sm' | 'md' | 'lg';
}

const Colors = ({ 
  colors, 
  limit, 
  size = 'md'
}: ColorsProps) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  const displayColors = limit ? colors.slice(0, limit) : colors;
  
  const sizeMap = {
    sm: '18px',
    md: '24px',
    lg: '32px'
  };

  const swatchSize = sizeMap[size];

  return (
    <Wrap gap={2} align="center">
      {displayColors.map((color: string) => (
        <Link key={color} href={`/color/${encodeURIComponent(color.slice(1))}`}>
          <Box 
            w={swatchSize} 
            h={swatchSize} 
            borderRadius="full" 
            bg={color} 
            border="2px solid white" 
            boxShadow="md"
            title={color} 
            cursor="pointer" 
            _hover={{ transform: 'scale(1.1)' }} 
            transition="transform 0.2s" 
          />
        </Link>
      ))}

    </Wrap>
  );
};

export default Colors; 