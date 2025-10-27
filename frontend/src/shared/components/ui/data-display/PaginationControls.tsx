import { useIntl } from "react-intl";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  hasMore: boolean;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  hasMore,
}: PaginationControlsProps) => {
  const { formatMessage: f } = useIntl();

  return (
    <div className="pagination-controls">
      <button onClick={onPrevPage} disabled={currentPage === 0}>
        {f({ id: "previous" })}
      </button>

      <span>
        {f(
          { id: "page_info" },
          {
            current: currentPage + 1,
            total: totalPages,
          },
        )}
      </span>

      <button onClick={onNextPage} disabled={!hasMore}>
        {f({ id: "next" })}
      </button>
    </div>
  );
};

export default PaginationControls;
