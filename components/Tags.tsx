import { Badge, Wrap } from '@chakra-ui/react';
import Link from 'next/link';

interface TagsProps {
  tags?: string[];
  limit?: number;
  size?: 'xs' | 'sm' | 'md';
}

const Tags = ({ 
  tags, 
  limit, 
  size = 'sm'
}: TagsProps) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = limit ? tags.slice(0, limit) : tags;

  return (
    <Wrap gap={2} align="center">
      {displayTags.map((tag: string) => (
        <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
          <Badge 
            colorScheme="yellow" 
            fontSize={size} 
            px={3} 
            py={1} 
            cursor="pointer" 
            _hover={{ bg: 'yellow.400' }} 
            transition="background 0.2s"
          >
            {tag}
          </Badge>
        </Link>
      ))}

    </Wrap>
  );
};

export default Tags; 