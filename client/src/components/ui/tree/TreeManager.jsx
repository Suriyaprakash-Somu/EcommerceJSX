import { useState } from "react";
import { useAppQuery } from "@/hooks/useAppQuery";
import TreeNode from "./TreeNode";
import { Button } from "@/components/ui/Button";
import { FiPlus } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function TreeManager({
  title = "Manage Tree",
  fetchTree,
  createNode,
  updateNode,
  deleteNode,
  FormComponent,
  tag,
  idKey = "id",
  nameKey = "name",
  parentIdKey = "parent_id",
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [parentId, setParentId] = useState(null); // for root or child

  const { data, isLoading, error } = useAppQuery(tag, fetchTree);

  const handleAddRootClick = () => {
    setParentId(null);
    setModalType("add");
    setModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm max-w-2xl mx-auto flex justify-center">
        <div className="animate-pulse text-gray-500">Loading tree...</div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
        <div className="bg-red-50 p-3 rounded-md text-red-500 border border-red-100 text-sm">
          Error loading tree: {error.message || "Please try again later"}
        </div>
      </div>
    );

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        <Button
          onClick={handleAddRootClick}
          variant={modalOpen && modalType === "add" ? "outline" : "default"}
          size="sm"
          className="transition-all flex items-center gap-1 text-sm"
        >
          <FiPlus size={16} />
          {modalOpen && modalType === "add" ? "Cancel" : "Add Root"}
        </Button>
      </div>

      <div className="mt-2">
        {data?.length ? (
          data.map((node) => (
            <TreeNode
              key={node[idKey]}
              node={node}
              idKey={idKey}
              nameKey={nameKey}
              parentIdKey={parentIdKey}
              createNode={createNode}
              updateNode={updateNode}
              deleteNode={deleteNode}
              FormComponent={FormComponent}
              tag={tag}
              openModal={(type, parent) => {
                setModalType(type);
                setParentId(parent);
                setModalOpen(true);
              }}
            />
          ))
        ) : (
          <div className="text-center p-6 text-gray-400 bg-gray-50 rounded-md text-sm">
            No items found. Create a root item to get started.
          </div>
        )}
      </div>

      {/* Add Root Dialog */}
      <Dialog
        open={modalOpen && modalType === "add"}
        onOpenChange={setModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {title}</DialogTitle>
            <DialogDescription>Create a new node</DialogDescription>
          </DialogHeader>
          <FormComponent
            createNode={createNode}
            parentId={parentId}
            onClose={() => setModalOpen(false)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
