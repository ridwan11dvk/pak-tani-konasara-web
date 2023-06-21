import React, { FC, useMemo, useState, useEffect, ReactElement } from "react";
import {
    ColumnDef,
    ColumnDefTemplate,
    Table as ReactTable,
    Column as ReactTableColumn,
    Header as ReactTableHeader,
    Cell,
    Row,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    PaginationState,
    TableOptions,
    getPaginationRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues
} from "@tanstack/react-table";
import { BsCheckCircleFill } from "react-icons/bs";
import {
    Table as ChakraTable,
    TableProps as ChakraTableProps,
    TableContainer as ChakraTableContainer,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    ResponsiveValue,
    Box,
    Icon,
    Button,
    HStack,
    Flex,
    Text,
    Select,
    InputGroup,
    InputLeftElement,
    Input
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { IconType } from "react-icons";
import isObject from "lodash/isObject";

import CheckSquare from "@/components/CheckboxSquare";
import { ActionList } from "@/types/form";
import { defaultPerPage } from "@/utils/constant";
import TableLoader from "./TableLoader";

export type Column<DataType extends {}> = {
    key: keyof DataType;
    label?: ColumnDefTemplate<{
        table: ReactTable<DataType>;
        header: ReactTableHeader<DataType, any>;
        column: ReactTableColumn<DataType, any>;
    }>;
    render?: ColumnDefTemplate<{
        table: ReactTable<DataType>;
        column: ReactTableColumn<DataType, any>;
        row: Row<DataType>;
        cell: Cell<DataType, any>;
        getValue: () => any;
        renderValue: () => any;
    }>;
    accessorKey?: any;
};

export type RowAction = {
    label: string;
    icon: IconType | FC;
    onClick?: () => void;
};

export type TableProps<DataType extends {}> = {
    columns: any[];
    data: DataType[];
    isSelectable?: boolean;
    onSelect?: (selectedData: DataType[]) => void;
    rowActions?: RowAction[];
    tableProps?: ChakraTableProps;
    isLoading?: boolean;
    isSorting?: boolean;
    actionButton?: boolean;
    actionMenu?: (val: any) => ReactElement;
    actionList?: ActionList[];
    isValidation?: boolean;
    setQueryParams?: (params: any) => void
    queryParams?: any
    totalPages?: any
    totalData?: number
};

type RowSelection = { [key: number]: boolean };

function TableContainer<DataType extends object>({
    data = [],
    columns: columnsProp = [],
    tableProps = {},
    isSelectable = false,
    isSorting = false,
    onSelect = () => null,
    actionButton,
    actionMenu,
    isValidation = false,
    setQueryParams,
    isLoading,
    totalPages = 1,
    queryParams,
    ...props
}: TableProps<DataType>) {
    const [rowSelection, setRowSelection] = useState<RowSelection>({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageIndex, setPageindex] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPerPage);

    useEffect(() => {
        setQueryParams?.({
            page: pageIndex + 1,
            limit: pageSize
        })
    }, [pageIndex, pageSize])



    const columns = useMemo<ColumnDef<DataType>[]>(() => {
        const tableColumns = columnsProp.map(
            ({ key, label: header, render: cell }) => {
                const column: ColumnDef<DataType> = {
                    id: key as string,
                    accessorKey: key,
                    header: ({ header }) => header.column.id,
                    cell: ({ row, cell }) => {
                        const cellId = cell?.column?.id;
                        if (!cellId) {
                            return;
                        }

                        const rowValue: any = row?.original?.[cellId as keyof DataType]

                        if (typeof rowValue === 'function') {
                            return rowValue?.(row?.original)
                        }

                        // === Render Date type
                        // @ts-expect-error
                        if (isObject(rowValue) && rowValue?.toISOString) {
                            // @ts-expect-error
                            return rowValue.toISOString();
                        }

                        return rowValue;
                    }
                };

                if (header) {
                    column.header = header;
                }

                if (cell) {
                    column.cell = cell;
                }

                return column;
            }
        );

        // Show checkbox for selectable rows
        if (isSelectable) {
            tableColumns.unshift({
                id: "_selectable",
                accessorKey: "_selectable" as keyof DataType,
                header: "",
                cell: ({ row, ...rest }) => {
                    if (isValidation) {
                        const hasInvalid = Object.values(row?._valuesCache).some(
                            (e) => e === "無效" || e === "Invalid"
                        );

                        return !hasInvalid ? <Icon as={BsCheckCircleFill} /> : null;
                    } else {
                        return (
                            <CheckSquare
                                isChecked={row.getIsSelected()}
                                onChange={row.getToggleSelectedHandler()}
                            />
                        );
                    }
                }
            });
        }

        if (actionButton) {
            tableColumns.push({
                id: "_action",
                accessorKey: "_action" as keyof DataType,
                header: "Action",
                cell: ({ row }) => {
                    return actionMenu?.(row?.original);
                }
            });
        }

        return tableColumns;
    }, [columnsProp, isSelectable, actionButton, actionMenu]);

    const table = useReactTable({
        data: data,
        columns,
        enableMultiRowSelection: true,
        state: {
            rowSelection,
            sorting,

        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    });

    useEffect(() => {
        if (isLoading) {
            setRowSelection([])
        }
    }, [isLoading])

    useEffect(() => {
        const selectedData = data.filter(
            (_, index) => rowSelection?.[index as keyof RowSelection] === true
        );
        onSelect?.(selectedData);
    }, [rowSelection]);

    const tableStyle = {
        // boxSizing: "border-box",
        // content: "' '",
        // position: "absolute",
        // left: 1,
        // top: 0,
        // display: "block",
        // boxShadow:
        //   "0px 4px 10px rgba(0, 0, 0, 0.05), 1px 1px 5px rgba(0, 0, 0, 0.06), 0px 0px 2px rgba(0, 0, 0, 0.06)",
        // borderRadius: 9,
        // pointerEvents: "none",
        // h: "full",
        // w: "calc(100% - 5px)"
    };

    if (isLoading) {
        return (
            <TableLoader
                columnSize={columnsProp.length}
                isSelectable={isSelectable}
                hasActions={Boolean(props.rowActions?.length)}
            />
        )
    }

    return (
        <>

            <ChakraTableContainer
                w="full"
                sx={{
                    overflow: "auto",
                    " ::-webkit-scrollbar": {
                        marginTop: "20px",
                        width: "20px"
                    },

                    /* Track */
                    "::-webkit-scrollbar-track": {
                        boxShadow: "inset 0 0 5px grey",
                        borderRadius: "10px"
                    },

                    /* Handle */
                    "::-webkit-scrollbar-thumb": {
                        background: "brands.navy.main",
                        borderRadius: "10px"
                    },

                    /* Handle on hover */
                    "::-webkit-scrollbar-thumb:hover": {
                        background: "brands.navy.main"
                    }
                }}
            >
                <ChakraTable
                    variant="simple"
                    sx={{
                        // borderCollapse: "separate",
                        borderSpacing: "0 8px",
                    }}
                    {...tableProps}
                >
                    <Thead position="relative" bgColor="#F0F5FC" sx={{
                        borderBottom: '1px',
                        borderColor: 'gray'
                    }}>
                        {table.getHeaderGroups().map((headerGroup) => {
                            return (
                                <Tr
                                    key={headerGroup.id}
                                    sx={{
                                        "th:first-of-type:before": tableStyle
                                    }}
                                >
                                    {headerGroup.headers.map((header, index) => {
                                        return (
                                            <Th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                fontSize="14px"
                                                lineHeight="16px"
                                                textTransform="capitalize"
                                                letterSpacing="unset"
                                                border="none"
                                                color="#333333"
                                                py={13}
                                                px={4}
                                                _first={{
                                                    pl: 5
                                                }}
                                                onClick={
                                                    isSorting
                                                        ? header.column.getToggleSortingHandler()
                                                        : undefined
                                                }
                                            >
                                                {
                                                    isSelectable && header.index === 0 && (
                                                        <CheckSquare
                                                            isChecked={Object.keys(rowSelection)?.length === table.getPaginationRowModel().rows.length && Object.keys(rowSelection)?.length > 0}
                                                            onChange={(e) => {
                                                                let isChecked = e.target.checked
                                                                if (isChecked) {
                                                                    let rowSelection: any = {}
                                                                    table.getPaginationRowModel().rows.forEach((el, idx) => {
                                                                        rowSelection[idx] = true
                                                                    })

                                                                    setRowSelection(rowSelection)
                                                                } else {
                                                                    setRowSelection({})
                                                                }

                                                            }}
                                                        />
                                                    )
                                                }
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                {isSorting && header?.id !== "_action" && header?.id !== 'cell' && header?.id !== '_selectable' && (
                                                    <Box as="span" >
                                                        {{
                                                            asc: <ChevronUpIcon boxSize={6} color="brands.black.80" />,
                                                            desc: <ChevronDownIcon boxSize={6} color="brands.black.80" />
                                                        }[header.column.getIsSorted() as string] ?? (
                                                                <ChevronUpIcon boxSize={6} color="brands.black.80" />
                                                            )}
                                                    </Box>
                                                )}
                                            </Th>
                                        )
                                    }
                                    )}
                                </Tr>
                            );
                        })}
                    </Thead>


                    <Tbody>
                        {!data?.length ?
                            <Tr w="100%">
                                <Td>
                                    <Text>No data available !</Text>
                                </Td>
                            </Tr>
                            :
                            table?.getRowModel().rows.map((row, index) => {
                                return (
                                    <Tr
                                        key={row.id}
                                        position="relative"
                                        bg={index % 2 ? '#F0F5FC' : 'white'}
                                        sx={{
                                            "td:first-of-type:before": tableStyle
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell, index) => {
                                            let textAlign: ResponsiveValue<any>;
                                            if (isSelectable && index === 0) {
                                                textAlign = "center";
                                            }

                                            let cellWidth;
                                            if (isSelectable && index === 0) {
                                                cellWidth = "60px";
                                            }

                                            return (
                                                <Td
                                                    key={cell.id}
                                                    fontSize="12px"
                                                    fontWeight="normal"
                                                    lineHeight="14px"
                                                    textTransform="none"
                                                    textAlign={textAlign}
                                                    w={cellWidth}
                                                    letterSpacing="unset"
                                                    border="none"
                                                    py={3}
                                                    px={4}
                                                    _first={{
                                                        pl: 5
                                                    }}
                                                    color={cell.renderValue() === "Invalid" ? "red" : "black"}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </Td>
                                            );
                                        })}
                                    </Tr>
                                )
                            })

                        }
                    </Tbody>


                </ChakraTable>
                <Flex minW="full" flexDirection="row" gap={4} pt={4}>

                    <Button
                        className=""
                        onClick={() => {
                            pageIndex === 0 ? null : setPageindex(0)
                            // table.setPageCount(0)
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </Button>
                    <Button
                        className=""
                        onClick={() => {
                            pageIndex === 0 ? null : setPageindex(pageIndex - 1)
                            // table.setPageCount(pageIndex - 1)
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </Button>
                    <Flex alignItems="center" justifyContent="center" minW="100px" gap={2}>
                        <Text>Page</Text>
                        <Text>
                            {queryParams?.page} of{' '}
                            {totalPages || table.getPageCount()}
                        </Text>
                    </Flex>
                    <Button
                        className=""
                        onClick={() => {
                            pageIndex + 1 === totalPages ? null : setPageindex(pageIndex + 1)
                            table.setPageCount(pageIndex - 1)
                        }}
                        disabled={pageIndex + 1 === totalPages}
                    >
                        {'>'}
                    </Button>
                    <Button
                        className=""
                        onClick={() => pageIndex + 1 === totalPages ? null : setPageindex(totalPages - 1)}
                        disabled={pageIndex + 1 === totalPages}
                    >
                        {'>>'}
                    </Button>

                    {/* <Flex alignItems="center" gap={2}>
                        Go to page:
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                setPageindex(page)
                            }}
                            className="border p-1 rounded w-16"
                        />
                    </Flex> */}
                    <Select
                        maxW="150px"
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[5, 10, 15, 20].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </Select>
                </Flex>
            </ChakraTableContainer>
        </>

    );
}

export default TableContainer;
