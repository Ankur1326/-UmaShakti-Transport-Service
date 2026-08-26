import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loadingReducer from "./slices/loadingSlice"
import consignerReducer from "./slices/consignerSlice"
import consigneeReducer from "./slices/consigneeSlice"
export const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        consigners: consignerReducer,
        consignees: consigneeReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
