import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  refreshApp: false,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      set({ currentUser: docSnap.data(), isLoading: false });
    } else {
      set({ currentUser: null, isLoading: false });
    }
    try {
    } catch (error) {
      set({ currentUser: null, isLoading: false });
    }
  },
  triggerRefresh: () => set((state) => ({ refreshApp: !state.refreshApp })),
}));
