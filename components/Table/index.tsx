import TableContainer, { TableProps } from "./TableContainer";
import TableLoader from "./TableLoader";

export * from "./TableContainer";

export default function Table<DataType extends object>(
  props: TableProps<DataType>
) {
  // if (props.isLoading) {
  //   return (
  //     <TableLoader
  //       columnSize={props.columns.length}
  //       isSelectable={props.isSelectable}
  //       hasActions={Boolean(props.rowActions?.length)}
  //     />
  //   );
  // }

  return <TableContainer {...props} />;
}
