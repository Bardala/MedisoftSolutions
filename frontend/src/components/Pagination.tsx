interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled,
}: PaginationProps) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0 || disabled}
      >
        Previous
      </button>

      <span>
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1 || disabled}
      >
        Next
      </button>
    </div>
  );
};
