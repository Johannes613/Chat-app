import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { useUserStore } from "./userStore";

export const usechatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrUserBlocked: false,
  isRecvBlocked: false,
  changeChat: (chatId, user, currentUser) => {
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrUserBlocked: true,
        isRecvBlocked: false,
      });
    } else if (currentUser?.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrUserBlocked: false,
        isRecvBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrUserBlocked: false,
        isRecvBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isRecvBlocked: !state.isCurrUserBlocked }));
  },
}));
