import { Box, Button, Flex, Input, InputGroup } from '@chakra-ui/react';
import { RobotGlyph } from './RobotGlyph';

interface SearchInputBarProps {
  query: string;
  hybrid: boolean;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onHybridToggle: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SearchInputBar({
  query,
  hybrid,
  loading,
  onQueryChange,
  onHybridToggle,
  onSubmit,
}: SearchInputBarProps) {
  return (
    <Box as="form" onSubmit={onSubmit} aria-label="Search form" w="100%">
      <Box
        position="relative"
        w="100%"
        isolation="isolate"
        borderRadius="full"
        borderWidth="1px"
        borderColor={hybrid ? 'rgba(96, 165, 250, 0.55)' : 'rgba(255,255,255,0.26)'}
        bg={hybrid ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255,255,255,0.24)'}
        backdropFilter="blur(22px) saturate(170%)"
        boxShadow={
          hybrid
            ? 'inset 0 1px 0 rgba(255,255,255,0.45), 0 10px 34px rgba(0,0,0,0.22), 0 0 0 1px rgba(96, 165, 250, 0.38), 0 0 0 2px rgba(59, 130, 246, 0.22), 0 0 46px rgba(59, 130, 246, 0.40), 0 0 96px rgba(37, 99, 235, 0.28)'
            : 'inset 0 1px 0 rgba(255,255,255,0.50), 0 10px 34px rgba(0,0,0,0.22)'
        }
        _before={{
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'full',
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.02) 100%)',
          mixBlendMode: 'screen',
          opacity: hybrid ? 0.85 : 0.75,
        }}
        transition="border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease"
        _focusWithin={{
          borderColor: hybrid ? 'rgba(147, 197, 253, 0.80)' : 'rgba(255,255,255,0.40)',
          boxShadow: hybrid
            ? 'inset 0 1px 0 rgba(255,255,255,0.60), 0 0 0 3px rgba(96, 165, 250, 0.24), 0 0 0 5px rgba(59, 130, 246, 0.18), 0 0 58px rgba(59, 130, 246, 0.42), 0 0 128px rgba(37, 99, 235, 0.30), 0 12px 40px rgba(0,0,0,0.26)'
            : 'inset 0 1px 0 rgba(255,255,255,0.65), 0 0 0 3px rgba(255,255,255,0.16), 0 12px 40px rgba(0,0,0,0.26)',
          bg: hybrid ? 'rgba(59, 130, 246, 0.22)' : 'rgba(255,255,255,0.28)',
        }}
      >
        <InputGroup
          w="100%"
          endElement={
            <Flex align="center" h="100%" pr={2}>
              <Button
                type="button"
                size="sm"
                borderRadius="full"
                h="40px"
                minW="40px"
                px={0}
                color="white"
                borderWidth="1px"
                borderColor={hybrid ? 'rgba(255,255,255,0.35)' : 'whiteAlpha.200'}
                bg={hybrid ? 'blue.500' : 'rgba(15, 23, 42, 0.92)'}
                boxShadow="0 8px 18px rgba(0,0,0,0.18)"
                _hover={{
                  bg: hybrid ? 'blue.400' : 'rgba(30, 41, 59, 0.98)',
                  borderColor: 'whiteAlpha.300',
                  boxShadow: '0 10px 22px rgba(0,0,0,0.22)',
                }}
                _active={{
                  bg: hybrid ? 'blue.600' : 'blackAlpha.800',
                  boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
                }}
                _focusVisible={{
                  boxShadow: '0 0 0 3px rgba(255,255,255,0.22)',
                }}
                onClick={onHybridToggle}
                disabled={loading}
                aria-pressed={hybrid}
                aria-label={hybrid ? 'Vector and text search on' : 'Turn on vector and text search'}
              >
                <RobotGlyph />
              </Button>
            </Flex>
          }
        >
          <Input
            w="100%"
            minH={{ base: '56px', sm: '60px' }}
            pr={{ base: '3.75rem', sm: '4.25rem' }}
            pl={{ base: 5, sm: 7 }}
            py={4}
            placeholder="What sort of things do you want to see?"
            _placeholder={{
              color: hybrid ? 'rgba(191, 219, 254, 0.70)' : 'rgba(255, 255, 255, 0.62)',
              fontSize: 'md',
            }}
            color={hybrid ? 'rgba(219, 234, 254, 0.95)' : 'rgba(255, 255, 255, 0.92)'}
            textShadow="0 1px 2px rgba(0, 0, 0, 0.35)"
            style={{
              caretColor: hybrid ? 'rgba(219, 234, 254, 0.95)' : 'rgba(255, 255, 255, 0.92)',
            }}
            fontSize={{ base: 'md', sm: 'lg' }}
            fontWeight="normal"
            textAlign="left"
            border="none"
            borderRadius="full"
            boxShadow="none"
            outline="none"
            bg="transparent"
            _focus={{ border: 'none', boxShadow: 'none', outline: 'none' }}
            _focusVisible={{ border: 'none', boxShadow: 'none', outline: 'none' }}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            disabled={loading}
            aria-label="Search images"
          />
        </InputGroup>
      </Box>
    </Box>
  );
}
