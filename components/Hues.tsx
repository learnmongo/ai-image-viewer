import { Badge, Wrap } from '@chakra-ui/react';
import Link from 'next/link';

interface HuesProps {
  hues?: string[];
  limit?: number;
  size?: 'xs' | 'sm' | 'md';
}

const Hues = ({ 
  hues, 
  limit, 
  size = 'sm'
}: HuesProps) => {
  if (!hues || hues.length === 0) {
    return null;
  }

  const displayHues = limit ? hues.slice(0, limit) : hues;

  return (
    <Wrap gap={2} align="center">
      {displayHues.map((hue: string) => (
        <Link key={hue} href={`/hue/${encodeURIComponent(hue)}`}>
          <Badge 
            colorScheme="yellow" 
            fontSize={size} 
            px={3} 
            py={1} 
            cursor="pointer" 
            _hover={{ bg: 'yellow.400' }} 
            transition="background 0.2s"
          >
            {hue}
          </Badge>
        </Link>
      ))}

    </Wrap>
  );
};

export default Hues; 