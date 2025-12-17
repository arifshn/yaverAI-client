import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../features/account/slices/accountSlice";
import { chatSlice } from "../features/chat/slices/chatSlice";
import { petitionSlice } from "../features/petition/slices/petitionSlice";
import { documentSlice } from "../features/document/slices/documentSlice";

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    chat: chatSlice.reducer,
    petition: petitionSlice.reducer,
    document: documentSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
