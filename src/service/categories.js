import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchCategories = async (category) => {

  const conditions = [];

  if (category) {
    conditions.push(where("category", "==", category));
  }

  const q = conditions.length
    ? query(collection(db, "categories"), ...conditions)
    : collection(db, "categories");

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return data;
};
