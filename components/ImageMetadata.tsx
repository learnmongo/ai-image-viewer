import { Wrap } from '@chakra-ui/react';
import Tags from './Tags';
import Feelings from './Feelings';
import Colors from './Colors';

interface ImageMetadataProps {
  tags?: string[];
  feelings?: string[];
  colors?: string[];
  tagLimit?: number;
  feelingLimit?: number;
  colorLimit?: number;
  tagSize?: 'xs' | 'sm' | 'md';
  feelingSize?: 'xs' | 'sm' | 'md';
  colorSize?: 'sm' | 'md' | 'lg';
}

const ImageMetadata = ({ 
  tags, 
  feelings, 
  colors, 
  tagLimit = 1, 
  feelingLimit = 1, 
  colorLimit = 3,
  tagSize = 'xs',
  feelingSize = 'xs',
  colorSize = 'sm'
}: ImageMetadataProps) => {
  return (
    <Wrap gap={2} align="center">
      <Feelings feelings={feelings} limit={feelingLimit} size={feelingSize} />
      <Tags tags={tags} limit={tagLimit} size={tagSize} />
      <Colors colors={colors} limit={colorLimit} size={colorSize} />
    </Wrap>
  );
};

export default ImageMetadata; 