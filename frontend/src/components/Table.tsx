import { ReactNode } from "react";
import "../styles/table.css";
interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
}: TableProps<T>) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
