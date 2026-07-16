import { Box, Flex } from '@chakra-ui/react';
import { GuidePageShell } from './GuidePageShell';
import { HowItsBuiltContent } from './HowItsBuiltContent';
import { TableOfContents, TocItem } from './TableOfContents';

const TOC_ITEMS: TocItem[] = [
  { id: 'start-here', label: 'Start here' },
  { id: 'what-youll-build', label: "What you'll build" },
  { id: 'architecture', label: 'Architecture' },
  { id: 'why-its-built', label: "Why it's built this way" },
  { id: 'repo-guide', label: 'Repository guide' },
  { id: 'video-guide', label: 'Video guide' },
  { id: 'go-deeper', label: 'Go deeper' },
  { id: 'where-next', label: 'Where to go next' },
];

export function HowItsBuiltPage() {
  return (
    <GuidePageShell>
      <Flex
        w="100%"
        minW={0}
        maxW="100%"
        gap={{ base: 0, lg: 10 }}
        align="flex-start"
        direction={{ base: 'column', lg: 'row' }}
      >
        <TableOfContents items={TOC_ITEMS} />
        <Box w="100%" flex={1} minW={0} maxW={{ lg: '720px' }}>
          <HowItsBuiltContent />
        </Box>
      </Flex>
    </GuidePageShell>
  );
}
