import { GLASS_CARD_NESTED } from '@/components/glass-styles';
import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

const CELL_BORDER = 'whiteAlpha.150';
const HEADER_BG = 'rgba(255, 255, 255, 0.08)';
const ROW_HOVER_BG = 'rgba(255, 255, 255, 0.06)';

interface GlassTableProps {
  children: ReactNode;
  mb?: number | string;
  my?: number | string;
}

export function GlassTable({ children, mb, my }: GlassTableProps) {
  return (
    <Box
      w="100%"
      maxW="100%"
      overflowX="auto"
      mb={mb}
      my={my}
      css={{ WebkitOverflowScrolling: 'touch' }}
    >
      <Box {...GLASS_CARD_NESTED} display="inline-block" minW="max-content">
        <Box as="table" minW="max-content" borderCollapse="collapse" bg="transparent" fontSize="sm">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export function GlassTableHeader({ children }: { children: ReactNode }) {
  return (
    <Box as="thead" bg={HEADER_BG}>
      {children}
    </Box>
  );
}

export function GlassTableBody({ children }: { children: ReactNode }) {
  return <Box as="tbody">{children}</Box>;
}

export function GlassTableRow({ children }: { children: ReactNode }) {
  return (
    <Box as="tr" bg="transparent" _hover={{ bg: ROW_HOVER_BG }} transition="background 0.15s ease">
      {children}
    </Box>
  );
}

interface GlassTableColumnHeaderProps {
  children: ReactNode;
  whiteSpace?: string;
}

export function GlassTableColumnHeader({ children, whiteSpace }: GlassTableColumnHeaderProps) {
  return (
    <Box
      as="th"
      color="white"
      fontWeight="semibold"
      textAlign="left"
      borderBottomWidth="1px"
      borderColor={CELL_BORDER}
      py={3}
      px={4}
      whiteSpace={whiteSpace}
    >
      {children}
    </Box>
  );
}

interface GlassTableCellProps {
  children: ReactNode;
  fontWeight?: string;
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  whiteSpace?: string;
}

export function GlassTableCell({
  children,
  fontWeight,
  fontFamily,
  fontSize = 'sm',
  color = 'whiteAlpha.900',
  whiteSpace,
}: GlassTableCellProps) {
  return (
    <Box
      as="td"
      color={color}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
      fontSize={fontSize}
      whiteSpace={whiteSpace}
      borderBottomWidth="1px"
      borderColor={CELL_BORDER}
      py={3}
      px={4}
      verticalAlign="top"
      bg="transparent"
    >
      {children}
    </Box>
  );
}
