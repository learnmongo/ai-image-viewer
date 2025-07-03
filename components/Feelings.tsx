import { Badge, Wrap } from '@chakra-ui/react';
import Link from 'next/link';

interface FeelingsProps {
  feelings?: string[];
  limit?: number;
  size?: 'xs' | 'sm' | 'md';
}

const Feelings = ({ 
  feelings, 
  limit, 
  size = 'sm'
}: FeelingsProps) => {
  if (!feelings || feelings.length === 0) {
    return null;
  }

  const displayFeelings = limit ? feelings.slice(0, limit) : feelings;

  return (
    <Wrap gap={2} align="center">
      {displayFeelings.map((feeling: string) => (
        <Link key={feeling} href={`/feeling/${encodeURIComponent(feeling)}`}>
          <Badge 
            colorScheme="yellow" 
            fontSize={size} 
            px={3} 
            py={1} 
            cursor="pointer" 
            _hover={{ bg: 'yellow.400' }} 
            transition="background 0.2s"
          >
            {feeling}
          </Badge>
        </Link>
      ))}

    </Wrap>
  );
};

export default Feelings; 