import { Box, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { GLASS_CARD } from '@/components/glass-styles';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <Box
      as="section"
      id={id}
      scrollMarginTop="56px"
      mb={12}
      {...GLASS_CARD}
      p={{ base: 5, md: 7 }}
    >
      <Heading size="xl" color="white" mb={5}>
        {title}
      </Heading>
      <Box
        color="whiteAlpha.850"
        lineHeight="tall"
        fontSize={{ base: 'md', md: 'lg' }}
        overflowWrap="anywhere"
        wordBreak="break-word"
      >
        {children}
      </Box>
    </Box>
  );
}
