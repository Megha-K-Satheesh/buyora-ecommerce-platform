


import React, { useCallback, useMemo } from "react";

const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  }, [currentPage, totalPages, onPageChange]);

  const handlePageClick = useCallback(
    (page) => {
      if (page !== currentPage) onPageChange(page);
    },
    [currentPage, onPageChange]
  );

  const pages = useMemo(() => {
    const range = [];
    const delta = 1;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);

    if (left > 2) {
      range.push("left-ellipsis");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("right-ellipsis");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

  if (totalPages === 0) return null;

  return (
    <div className="flex justify-center mt-4 space-x-2 text-xs lg:text-sm">
      <button
        disabled={currentPage === 1}
        onClick={handlePrev}
        className="px-3 py-1 border border-gray-500 rounded disabled:opacity-50"
      >
        Prev
      </button>

      {pages.map((item, index) => {
        if (item === "left-ellipsis" || item === "right-ellipsis") {
          return (
            <span key={index} className="px-2">
              ...
            </span>
          );
        }

        return (
          <button
           key={`${item}-${index}`}
            onClick={() => handlePageClick(item)}
            className={`px-3 py-1 border border-gray-500 rounded ${
              item === currentPage ? "bg-pink-600 text-white" : ""
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={handleNext}
        className="px-3 py-1 border border-gray-500 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
});

export default Pagination;
