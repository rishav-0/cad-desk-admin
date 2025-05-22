import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Generic delete function with confirmation
 * @param {string} collection - Firestore collection name
 * @param {string} id - Document ID to delete
 * @param {function} [onSuccess] - Optional callback after successful delete
 */
export const handleDelete = async ({ collection, id, onSuccess }) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this item?"
  );
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, collection, id));
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};
