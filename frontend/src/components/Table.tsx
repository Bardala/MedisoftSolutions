import "../styles/table.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FormModal } from "./FormModel";
import { useIntl } from "react-intl";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  expandable?: boolean;
  clickable?: boolean;
  onClick?: (row: T) => void;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  enableActions?: boolean;
  onUpdate?: (row: T) => void;
  onDelete?: (row: T) => void;
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  enableActions = false,
  onUpdate,
  onDelete,
}: TableProps<T>) => {
  const { formatMessage: f } = useIntl();
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<T | null>(null);
  function hasNoExpandableColumns<T>(columns: Column<T>[]): boolean {
    return !columns.some((column) => column.expandable === true);
  }
  const expandableColumns = hasNoExpandableColumns(columns);

  const toggleExpandRow = (rowIndex: number) => {
    setExpandedRowIndex((prevIndex) =>
      prevIndex === rowIndex ? null : rowIndex,
    );
  };

  const handleUpdateClick = (row: T, rowIndex: number) => {
    setRowToEdit(row);
    setExpandedRowIndex(null); // Close any previously expanded row
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (row: T) => {
    if (onDelete) onDelete(row);
  };

  const closeEdit = () => {
    setRowToEdit(null);
    setUpdateModalOpen(false);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns
              .filter((col) => !col.expandable)
              .map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            {enableActions && !expandableColumns && (
              <th className="actions-column">{f({ id: "more" })}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr>
                {columns
                  .filter((col) => !col.expandable)
                  .map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={col.clickable ? "clickable-cell" : ""}
                      tabIndex={col.clickable ? 0 : undefined}
                      onClick={() => col.clickable && col.onClick?.(row)}
                      onKeyDown={(e) => {
                        if (col.clickable && e.key === "Enter")
                          col.onClick?.(row);
                      }}
                      style={{ cursor: col.clickable ? "pointer" : "default" }}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}

                {enableActions && !expandableColumns && (
                  <td className="action-cell">
                    <button
                      onClick={() => toggleExpandRow(rowIndex)}
                      className="expand-icon"
                    >
                      {expandedRowIndex === rowIndex ? "▼" : "▶"}
                    </button>
                  </td>
                )}
              </tr>
              {expandedRowIndex === rowIndex && (
                <tr className="expanded-row">
                  <td
                    colSpan={
                      columns.filter((col) => !col.expandable).length + 1
                    }
                  >
                    <div className="expanded-content">
                      {columns
                        .filter((col) => {
                          return col.expandable;
                        })
                        .map((col, colIndex) => {
                          const value =
                            typeof col.accessor === "function"
                              ? col.accessor(row)
                              : (row[col.accessor] as React.ReactNode);

                          // Only render if there's content to show
                          if (
                            value === null ||
                            value === undefined ||
                            value === ""
                          ) {
                            return null;
                          }

                          return (
                            <div
                              key={colIndex}
                              className={col.clickable ? "clickable-cell" : ""}
                              onClick={() =>
                                col.clickable && col.onClick?.(row)
                              }
                            >
                              <strong>{col.header}:</strong> {value}
                            </div>
                          );
                        })}

                      {enableActions && (
                        <div className="action-buttons">
                          {onUpdate && (
                            <button
                              onClick={() => handleUpdateClick(row, rowIndex)}
                              className="update-button"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => handleDeleteClick(row)}
                              className="delete-button"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {isUpdateModalOpen && rowToEdit === row && (
                <tr className="form-modal-row">
                  <td
                    colSpan={
                      columns.filter((col) => !col.expandable).length + 1
                    }
                  >
                    <FormModal
                      objectToEdit={rowToEdit}
                      onSave={(updatedRow: T) => {
                        if (onUpdate) onUpdate(updatedRow);
                        closeEdit();
                      }}
                      onClose={closeEdit}
                      title="Update Details"
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
