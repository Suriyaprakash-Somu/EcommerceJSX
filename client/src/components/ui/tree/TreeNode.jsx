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
  FiMoreVertical,
} from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";

export default function TreeNode({
  node,
  idKey,
  nameKey,
  createNode,
  updateNode,
  deleteNode,
  FormComponent,
  tag = [],
  openModal,
}) {
  const [expanded, setExpanded] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const nodeId = node[idKey];
  const nodeName = node[nameKey];
  const children = node.children || [];

  const deleteMutation = useAppMutation(() => deleteNode(nodeId), {
    invalidateQueries: Array.isArray(tag) ? tag : [tag],
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setConfirmDeleteOpen(false);
  };

  return (
    <div className="ml-3 border-l border-gray-100 pl-3 my-1">
      <div className="flex items-center py-1.5 hover:bg-gray-50 rounded px-2">
        {/* arrow + label */}
        <div
          className="flex items-center gap-2 cursor-pointer text-gray-700"
          onClick={() => setExpanded((e) => !e)}
        >
          {children.length > 0 ? (
            expanded ? (
              <FiChevronDown className="text-gray-400" />
            ) : (
              <FiChevronRight className="text-gray-400" />
            )
          ) : (
            <span className="w-4" />
          )}
          <span className="select-none">{nodeName}</span>
        </div>

        {/* actions */}
        <div className="flex items-center ml-auto">
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <button
                  onClick={() => {
                    openModal("add", nodeId);
                    setMenuOpen(false);
                  }}
                  className="p-1 rounded hover:bg-blue-50 text-blue-600"
                  title="Add Child"
                >
                  <FiPlus />
                </button>
                <button
                  onClick={() => {
                    setModalType("edit");
                    setModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="p-1 rounded hover:bg-amber-50 text-amber-600"
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => {
                    setConfirmDeleteOpen(true);
                    setMenuOpen(false);
                  }}
                  className="p-1 rounded hover:bg-red-50 text-red-600"
                  disabled={deleteMutation.isPending}
                  title="Delete"
                >
                  {deleteMutation.isPending ? (
                    <ImSpinner2 className="animate-spin" />
                  ) : (
                    <FiTrash2 />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 ml-2"
            title="Actions"
          >
            <FiMoreVertical />
          </button>
        </div>
      </div>

      {/* children with motion */}
      <AnimatePresence initial={false}>
        {expanded && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children.map((child) => (
              <TreeNode
                key={child[idKey]}
                node={child}
                idKey={idKey}
                nameKey={nameKey}
                createNode={createNode}
                updateNode={updateNode}
                deleteNode={deleteNode}
                FormComponent={FormComponent}
                tag={tag}
                openModal={openModal}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit dialog */}
      {modalType === "edit" && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {nodeName}</DialogTitle>
              <DialogDescription>Update this node’s info</DialogDescription>
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

      {/* Delete confirm */}
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
    </div>
  );
}
