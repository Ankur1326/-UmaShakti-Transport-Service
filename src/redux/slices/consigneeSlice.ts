import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "./loadingSlice";

// name, address, city, state, gstin, mobile
interface Consignee {
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

interface ConsigneesState {
    consignees: Consignee[];
    totalConsignees: number;
    currentPage: number;
    totalPages: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ConsigneesState = {
    consignees: [],
    totalConsignees: 0,
    currentPage: 1,
    totalPages: 0,
    status: 'idle',
    error: null,
};

export const fetchConsignees = createAsyncThunk(
    'consignees/fetchConsignees',
    async ({ name, state, currentPage, itemsPerPage }: { name?: string; state?: string; currentPage?: number; itemsPerPage?: number }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            const response = await axios.get('/api/admin/consignee/get', {
                params: { name, state, currentPage, itemsPerPage },
            });

            return {
                consignees: response.data.data.consignees,
                totalConsignees: response.data.data.totalConsignees,
                currentPage: response.data.data.currentPage,
                totalPages: response.data.data.totalPages,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetched consignees');
        } finally {
            dispatch(setLoading(false))
        }
    }
);

export const createConsignee = createAsyncThunk(
    'consignees/createConsignee',
    async (consignee: Omit<Consignee, '_id' | 'createdAt' | 'updatedAt'>, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            const response = await axios.post('/api/admin/consignee/create', consignee);
            if (response.status === 200) {
                toast.success(response.data.message || "Successfully created consignee")
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response.data.message || "Failed")
            return rejectWithValue(error.message || 'Failed to create consignee');
        } finally {
            dispatch(setLoading(false))
        }
    }
);

export const updateConsignee = createAsyncThunk(
    'consignees/updateConsignee',
    async (consignee: Consignee, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            const response = await axios.put(`/api/admin/consignee/update`, consignee);
            // console.log("response : ", response);
            if (response.status === 200) {
                toast.success(response.data.message || "Consignee updated successfully")
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response.data.message || "Failed to update consignee")
            return rejectWithValue(error.message || 'Failed to update consignee');
        } finally {
            dispatch(setLoading(false))
        }
    }
);

export const deleteConsignee = createAsyncThunk(
    'consignees/deleteConsignee',
    async (_id: string, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            await axios.delete(`/api/admin/consignee/delete`, { data: { _id } });
            return { _id };
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete consignee")
            return rejectWithValue(error?.response?.data?.message || 'Failed to delete consignee');
        } finally {
            dispatch(setLoading(false))
        }
    }
);

const consigneesSlice = createSlice({
    name: 'consignees',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchConsignees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchConsignees.fulfilled, (state, action: PayloadAction<any>) => {
                const { consignees, totalConsignees, currentPage, totalPages } = action.payload;
                state.status = 'succeeded';
                state.consignees = consignees;
                state.totalConsignees = totalConsignees;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
            })
            .addCase(fetchConsignees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch consignees';
            })
            .addCase(createConsignee.fulfilled, (state, action: PayloadAction<Consignee>) => {
                state.consignees.push(action.payload);
            })
            .addCase(createConsignee.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to create consignee';
            })
            .addCase(updateConsignee.fulfilled, (state, action: PayloadAction<Consignee>) => {
                const index = state.consignees.findIndex((con) => con._id === action.payload._id);
                if (index !== -1) {
                    state.consignees[index] = action.payload;
                }
            })
            .addCase(updateConsignee.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update consignee';
            })
            .addCase(deleteConsignee.fulfilled, (state, action: PayloadAction<{ _id: string }>) => {
                state.consignees = state.consignees.filter((con) => con._id !== action.payload._id);
            })
            .addCase(deleteConsignee.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete consignee';
            });
    },
});

export default consigneesSlice.reducer