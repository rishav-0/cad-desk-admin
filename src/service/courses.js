import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchCourses = async (category,title,difficulty,price) => {

  const conditions = [];

  if (category) {
    conditions.push(where("category", "==", category));
  }

  if (title) {
    conditions.push(where("title", "==", title));
  }
  if (difficulty) {
    conditions.push(where("difficulty", "==", difficulty));
  }
  if (price) {
    conditions.push(where("price", "==", price));
  }

  const q = conditions.length
    ? query(collection(db, "courses"), ...conditions)
    : collection(db, "courses");

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return data;
};
