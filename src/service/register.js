import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchRegister = async (id) => {
  const conditions = [];

  if (id) {
    conditions.push(where("id", "==", id));
  }

  const q = conditions.length
    ? query(collection(db, "register"), ...conditions)
    : collection(db, "register");

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return data;
};
