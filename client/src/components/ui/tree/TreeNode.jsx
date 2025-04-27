import { useState } from "react";
import { useAppMutation } from "@/hooks/useAppMutation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import {
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";

export default function TreeNode({
  node,
  idKey,
  nameKey,
  parentIdKey,
  createNode,
  updateNode,
  deleteNode,
  FormComponent,
  tag = [],
  openModal,
}) {
  const [modalType, setModalType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const nodeId = node?.[idKey];
  const nodeName = node?.[nameKey];
  const children = node?.children || [];

  const deleteMutation = useAppMutation(() => deleteNode(nodeId), {
    invalidateQueries: Array.isArray(tag) ? tag : [tag],
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setConfirmDeleteOpen(false);
  };

  return (
    <div className="ml-3 border-l border-gray-100 pl-3 my-1">
      <div className="flex items-center justify-between py-1.5 hover:bg-gray-50 rounded px-2 group transition-colors">
        <div
          className="flex items-center gap-2 cursor-pointer text-gray-700 flex-grow"
          onClick={() => setModalType((prev) => !prev)}
        >
          {children.length > 0 ? (
            modalType ? (
              <FiChevronDown size={14} className="text-gray-400" />
            ) : (
              <FiChevronRight size={14} className="text-gray-400" />
            )
          ) : (
            <span className="w-3.5" />
          )}
          <span className="select-none text-sm">{nodeName}</span>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal("add", nodeId);
            }}
            title="Add Child"
            className="hover:text-blue-600 p-1 rounded hover:bg-blue-50 text-gray-500"
          >
            <FiPlus size={14} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalType("edit");
              setModalOpen(true);
            }}
            title="Edit"
            className="hover:text-amber-600 p-1 rounded hover:bg-amber-50 text-gray-500"
          >
            <FiEdit2 size={14} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDeleteOpen(true);
            }}
            title="Delete"
            disabled={deleteMutation.isPending}
            className="hover:text-red-600 p-1 rounded hover:bg-red-50 text-gray-500"
          >
            {deleteMutation.isPending ? (
              <ImSpinner2 size={14} className="animate-spin" />
            ) : (
              <FiTrash2 size={14} />
            )}
          </button>
        </div>
      </div>

      {modalType && modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {nodeName}</DialogTitle>
              <DialogDescription>
                Update this node's information
              </DialogDescription>
            </DialogHeader>
            <FormComponent
              updateNode={updateNode}
              editData={node}
              onClose={() => setModalOpen(false)}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {modalType && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child[idKey]}
              node={child}
              idKey={idKey}
              nameKey={nameKey}
              parentIdKey={parentIdKey}
              createNode={createNode}
              updateNode={updateNode}
              deleteNode={deleteNode}
              FormComponent={FormComponent}
              tag={tag}
              openModal={openModal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
