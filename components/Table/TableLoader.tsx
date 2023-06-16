import type { FC } from "react";
import { useMemo } from "react";
import {
  Table,
  TableProps,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Box,
  Skeleton
} from "@chakra-ui/react";

type TableLoaderProps = TableProps & {
  columnSize: number;
  isSelectable?: boolean;
  hasActions?: boolean;
};

const TableLoader: FC<TableLoaderProps> = ({
  isSelectable,
  hasActions,
  columnSize = 4,
  ...props
}) => {
  const finalSize = useMemo(() => {
    let size = columnSize;
    if (isSelectable) {
      size++;
    }

    if (hasActions) {
      size++;
    }

    return size;
  }, [columnSize, isSelectable, hasActions]);

  const skeletonProps = {
    w: "full",
    h: "20px",
    fadeDuration: 0.2
  };

  return (
    <TableContainer w="full" position="relative">
      <Box
        pos="absolute"
        w="full"
        h="full"
        bgGradient="linear(to-b, transparent, white)"
        zIndex={10}
      />
      <Table
        sx={{
          borderCollapse: "separate",
          borderSpacing: "0 8px"
        }}
        {...props}
      >
        <Thead>
          <Tr>
            {Array.from({ length: finalSize }).map((_, index) => {
              const isCheckbox = isSelectable && index === 0;

              return (
                <Th
                  key={`loader-th-${index}`}
                  border="none"
                  py={0}
                  px={4}
                  _first={{
                    pl: 5
                  }}
                >
                  {!isCheckbox && (
                    <HStack justifyContent="center" w="full">
                      <Skeleton {...skeletonProps} w="50%" />
                    </HStack>
                  )}
                </Th>
              );
            })}
          </Tr>
        </Thead>

        <Tbody>
          {Array.from({ length: 10 }).map((_, index) => {
            return (
              <Tr
                key={`loader-tr-body-${index}`}
                position="relative"
                sx={{
                  "td:first-of-type:before": {
                    boxSizing: "border-box",
                    content: "' '",
                    position: "absolute",
                    left: 1,
                    top: 0,
                    display: "block",
                    boxShadow:
                      "0px 4px 10px rgba(0, 0, 0, 0.05), 1px 1px 5px rgba(0, 0, 0, 0.06), 0px 0px 2px rgba(0, 0, 0, 0.06)",
                    borderRadius: 9,
                    h: "full",
                    w: "calc(100% - 5px)"
                  }
                }}
              >
                {Array.from({ length: finalSize }).map((_, index) => {
                  let cellWidth = "";
                  const isCheckbox = isSelectable && index === 0;

                  if (isCheckbox) {
                    cellWidth = "60px";
                  }

                  return (
                    <Td
                      key={`loader-td-${index}`}
                      w={cellWidth}
                      border="none"
                      py={3}
                      px={4}
                      _first={{
                        pl: 5
                      }}
                    >
                      <Skeleton w="full" h="20px" />
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TableLoader;
