import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "./loadingSlice";

// name, address, city, state, gstin, mobile
interface Consigner {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstin: string;
    mobile: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface ConsignersState {
    consigners: Consigner[];
    totalConsigners: number;
    currentPage: number;
    totalPages: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ConsignersState = {
    consigners: [],
    totalConsigners: 0,
    currentPage: 1,
    totalPages: 0,
    status: 'idle',
    error: null,
};

export const fetchConsigners = createAsyncThunk(
    'consigners/fetchConsigners',
    async ({ name, state, currentPage, itemsPerPage }: { name?: string; state?: string; currentPage?: number; itemsPerPage?: number }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            const response = await axios.get('/api/admin/consigner/get', {
                params: { name, state, currentPage, itemsPerPage },
            });

            return {
                consigners: response.data.data.consigners,
                totalConsigners: response.data.data.totalConsigners,
                currentPage: response.data.data.currentPage,
                totalPages: response.data.data.totalPages,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetched consigners');
        } finally {
            dispatch(setLoading(false))
        }
    }
);

export const createConsigner = createAsyncThunk(
    'consigners/createConsigner',
    async (consigner: Omit<Consigner, '_id' | 'createdAt' | 'updatedAt'>, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            const response = await axios.post('/api/admin/consigner/create', consigner);
            if (response.status === 200) {
                toast.success(response.data.message || "Successfully created consigner")
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response.data.message || "Failed")
            return rejectWithValue(error.message || 'Failed to create consigner');
        } finally {
            dispatch(setLoading(false))
        }
    }
);

export const updateConsigner = createAsyncThunk(
    'consigners/updateConsigner',
    async (consigner: Consigner, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            const response = await axios.put(`/api/admin/consigner/update`, consigner);
            // console.log("response : ", response);
            if (response.status === 200) {
                toast.success(response.data.message || "Consigner updated successfully")
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response.data.message || "Failed to update consigner")
            return rejectWithValue(error.message || 'Failed to update consigner');
        } finally {
            dispatch(setLoading(false))
        }
    }
);

export const deleteConsigner = createAsyncThunk(
    'consigners/deleteConsigner',
    async (_id: string, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            await axios.delete(`/api/admin/consigner/delete`, { data: { _id } });
            return { _id };
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete consigner")
            return rejectWithValue(error?.response?.data?.message || 'Failed to delete consigner');
        } finally {
            dispatch(setLoading(false))
        }
    }
);

const consignersSlice = createSlice({
    name: 'consigners',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchConsigners.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchConsigners.fulfilled, (state, action: PayloadAction<any>) => {
                const { consigners, totalConsigners, currentPage, totalPages } = action.payload;
                state.status = 'succeeded';
                state.consigners = consigners;
                state.totalConsigners = totalConsigners;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
            })
            .addCase(fetchConsigners.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch consigners';
            })
            .addCase(createConsigner.fulfilled, (state, action: PayloadAction<Consigner>) => {
                state.consigners.push(action.payload);
            })
            .addCase(createConsigner.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to create consigner';
            })
            .addCase(updateConsigner.fulfilled, (state, action: PayloadAction<Consigner>) => {
                const index = state.consigners.findIndex((con) => con._id === action.payload._id);
                if (index !== -1) {
                    state.consigners[index] = action.payload;
                }
            })
            .addCase(updateConsigner.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update consigner';
            })
            .addCase(deleteConsigner.fulfilled, (state, action: PayloadAction<{ _id: string }>) => {
                state.consigners = state.consigners.filter((con) => con._id !== action.payload._id);
            })
            .addCase(deleteConsigner.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete consigner';
            });
    },
});

export default consignersSlice.reducer