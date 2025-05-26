import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchBanners = async (title) => {

  const conditions = [];


  if (title) {
    conditions.push(where("title", "==", title));
  }
 

  const q = conditions.length
    ? query(collection(db, "banners"), ...conditions)
    : collection(db, "banners");

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return data;
};
