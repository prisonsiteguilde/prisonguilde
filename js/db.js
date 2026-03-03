// js/db.js
import {
  collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { db } from "./firebase.js";

export async function listRecipes() {
  const qy = query(collection(db, "recipes"), orderBy("name", "asc"), limit(1000));
  const snap = await getDocs(qy);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
