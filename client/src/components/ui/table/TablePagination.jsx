import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TablePagination = ({ table, showPagination }) => {
  const pageCount = table.getPageCount() || 1;
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div
      className={
        showPagination
          ? "flex flex-col sm:flex-row justify-between items-center py-4 px-2"
          : "hidden"
      }
    >
      <div className="flex items-center space-x-3 mb-3 sm:mb-0">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {[10, 20, 30, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="p-1.5 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          className="p-1.5 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center">
          <span className="text-sm px-3 py-1 bg-white border border-gray-300 rounded-md min-w-[90px] text-center font-medium">
            {currentPage} of {pageCount}
          </span>
        </div>

        <button
          className="p-1.5 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={16} />
        </button>
        <button
          className="p-1.5 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 01-1.414 0l-4.293-4.293H3a1 1 0 110-2h1.586l4.293-4.293a1 1 0 111.414 1.414L6.414 10l3.293 3.293a1 1 0 010 1.414zm6 0a1 1 0 01-1.414 0l-4.293-4.293H9a1 1 0 110-2h1.586l4.293-4.293a1 1 0 111.414 1.414L12.414 10l3.293 3.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
