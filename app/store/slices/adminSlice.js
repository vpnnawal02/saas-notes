import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/utils/api';

// Get all users related to user's company
export const fetchCompanyUsers = createAsyncThunk(
    'admin/fetchCompanyUsers',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/admin');
            return res.data.users;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Add a member
export const addMember = createAsyncThunk(
    'admin/addMember',
    async (member, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.post('/admin', member);
            dispatch(fetchCompanyUsers());
            return res.data.user;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Update a member
export const updateMember = createAsyncThunk(
    'admin/updateMember',
    async ({ id, updates }, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.patch(`/admin/${id}`, updates);
            dispatch(fetchCompanyUsers());
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Delete a member
export const deleteMember = createAsyncThunk(
    'admin/deleteMember',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/admin/${id}`);
            dispatch(fetchCompanyUsers());
            return { id };
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {
        resetStateAdmin: (state) => {
            state.users = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchCompanyUsers.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchCompanyUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addMember.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMember.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(addMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateMember.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMember.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.users.findIndex(u => u._id === action.payload._id);
                if (idx !== -1) state.users[idx] = action.payload;
            })
            .addCase(updateMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteMember.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMember.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(u => u._id !== action.payload.id);
            })
            .addCase(deleteMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetStateAdmin } = adminSlice.actions;
export default adminSlice.reducer;
