import { Box, Text } from '@chakra-ui/react';

interface SearchSuggestHybridProps {
  onEnableHybrid: () => void;
}

export function SearchSuggestHybrid({ onEnableHybrid }: SearchSuggestHybridProps) {
  return (
    <Text
      mt={4}
      textAlign="center"
      fontSize="sm"
      lineHeight="tall"
      color="whiteAlpha.900"
      textShadow="0 1px 2px rgba(0,0,0,0.45)"
    >
      No keyword matches.{' '}
      <Box
        as="button"
        display="inline"
        font="inherit"
        fontWeight="semibold"
        color="white"
        textDecoration="underline"
        textUnderlineOffset="3px"
        cursor="pointer"
        bg="transparent"
        border="none"
        p={0}
        m={0}
        verticalAlign="baseline"
        _hover={{ color: 'blue.200' }}
        _focusVisible={{ outline: '2px solid', outlineColor: 'whiteAlpha.700', outlineOffset: '2px' }}
        onClick={onEnableHybrid}
      >
        Enable vector + text search
      </Box>
      .
    </Text>
  );
}
