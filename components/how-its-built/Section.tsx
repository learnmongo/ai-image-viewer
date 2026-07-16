import { Box, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

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
      scrollMarginTop="24px"
      mb={12}
      bg="rgba(255, 255, 255, 0.10)"
      backdropFilter="blur(16px) saturate(160%)"
      borderWidth="1px"
      borderColor="whiteAlpha.150"
      borderRadius="xl"
      p={{ base: 5, md: 7 }}
    >
      <Heading size="xl" color="white" mb={5}>
        {title}
      </Heading>
      <Box color="whiteAlpha.850" lineHeight="tall" fontSize={{ base: 'md', md: 'lg' }}>
        {children}
      </Box>
    </Box>
  );
}
