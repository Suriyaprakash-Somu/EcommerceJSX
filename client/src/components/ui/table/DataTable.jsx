import React, { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery } from "@/hooks/useAppQuery";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TablePagination from "./TablePagination";
import {
  Plus,
  X,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Settings,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const DataTable = ({
  tag,
  fetchData,
  columnsConfig = [],
  addButtonText = "Add Item",
  AddComponent = null,
  onDelete = false,
  EditComponent = null,
  ViewComponent = null,
  columns,
  setColumns,
  filters,
  title,
  showPagination = true,
  dontShowColumnSelect = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowIdToDelete, setRowIdToDelete] = useState(null);
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  const { data, error, isLoading } = useAppQuery(
    [tag, pagination.pageIndex, pagination.pageSize, sorting, filters],
    () =>
      fetchData({
        pageSize: pagination.pageSize,
        pageIndex: pagination.pageIndex,
        sorting,
        filters,
      }),
    {
      keepPreviousData: true,
      refetchOnMount: true,
      refetchInterval: 60000,
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
    }
  );

  const defaultColumn = {
    cell: ({ getValue }) => <span>{getValue()}</span>,
    enableSorting: false,
  };

  const handleDeleteClick = (id) => {
    setRowIdToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(rowIdToDelete);
      queryClient.invalidateQueries([tag]);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setShowDeleteDialog(false);
      setRowIdToDelete(null);
    }
  };

  const handleEditClick = (row) => {
    setSelectedRowData(row.original);
    setModalType("edit");
    setModalOpen(true);
  };

  const handleViewClick = (row) => {
    setSelectedRowData(row.original);
    setModalType("view");
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedRowData(null);
    setModalType("add");
    setModalOpen(true);
  };

  let actionsColumn = null;
  if (onDelete || EditComponent || ViewComponent) {
    actionsColumn = {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {ViewComponent && (
                <DropdownMenuItem
                  onClick={() => handleViewClick(row)}
                  className="flex items-center gap-2 text-gray-700 focus:text-blue-600"
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </DropdownMenuItem>
              )}
              {EditComponent && (
                <DropdownMenuItem
                  onClick={() => handleEditClick(row)}
                  className="flex items-center gap-2 text-gray-700 focus:text-blue-600"
                >
                  <Edit size={16} />
                  <span>Edit Item</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteClick(row.original.id)}
                    className="flex items-center gap-2 text-red-600 focus:text-red-700"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    };
  }

  const finalColumnsConfig = actionsColumn
    ? [...columnsConfig, actionsColumn]
    : [...columnsConfig];

  const table = useReactTable({
    data: data ? data.rows : [],
    columns: finalColumnsConfig,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: data ? data.rowCount : 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    enableSorting: true,
    columnResizeMode: "onChange",
    state: {
      pagination,
      sorting,
      columnVisibility: columns.reduce((acc, col) => {
        acc[col.value] = col.visible;
        return acc;
      }, {}),
    },
    defaultColumn,
  });

  const handleCheckboxChange = (e, colValue) => {
    const newColumns = columns.map((col) =>
      col.value === colValue ? { ...col, visible: e.target.checked } : col
    );
    setColumns(newColumns);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-red-100 text-red-600 rounded-full mb-4">
            <X size={24} />
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-500 max-w-md">
            There was a problem fetching the requested data. Please try again or
            contact support.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => queryClient.invalidateQueries([tag])}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Table UI */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Manage {title}
            {data && data.rowCount > 0 && (
              <Badge className="ml-3 bg-blue-100 text-blue-700 font-normal">
                {data.rowCount} items
              </Badge>
            )}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {!dontShowColumnSelect && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-md flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Settings size={16} />
                    <span>Columns</span>
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 max-h-64 overflow-y-auto"
                >
                  {columns.map((col) => (
                    <div key={col.value} className="px-2 py-1.5">
                      <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={(e) => handleCheckboxChange(e, col.value)}
                          className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span>{col.label}</span>
                      </label>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {addButtonText && AddComponent && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleAddClick}
              >
                <Plus size={16} />
                {addButtonText}
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <TableHeader table={table} />
            <TableBody table={table} />
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 border-t border-gray-200">
          <TablePagination table={table} showPagination={showPagination} />
        </div>
      </div>

      {/* Dialog: Add/Edit/View */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalType === "edit"
                ? "Edit Item"
                : modalType === "view"
                  ? "View Details"
                  : `Add New ${title}`}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Form to create a new {title}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {modalType === "edit" && EditComponent && (
              <EditComponent
                type="edit"
                editData={selectedRowData}
                onClose={() => setModalOpen(false)}
              />
            )}
            {modalType === "view" && ViewComponent && (
              <ViewComponent
                type="view"
                viewData={selectedRowData}
                onClose={() => setModalOpen(false)}
              />
            )}
            {modalType === "add" && AddComponent && (
              <AddComponent type="add" onClose={() => setModalOpen(false)} />
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700">
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirm Delete */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTable;
