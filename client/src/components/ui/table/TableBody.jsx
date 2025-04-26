import React from "react";
import { flexRender } from "@tanstack/react-table";

const TableBody = ({ table }) => {
  if (table.getRowModel().rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={table.getAllLeafColumns().length}
            className="py-16 text-center text-gray-500"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-lg font-medium">No Data Available</p>
              <p className="text-sm text-gray-400">
                No records found to display
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-200">
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className="hover:bg-gray-50 transition-colors duration-150"
        >
          {row.getVisibleCells().map((cell) => {
            const cellClass = cell.column.columnDef.className || "";
            return (
              <td
                key={cell.id}
                className={`px-3 py-2 whitespace-nowrap text-sm text-gray-700 ${cellClass}`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
