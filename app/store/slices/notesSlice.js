import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/utils/api';

// Get all notes
export const fetchNotes = createAsyncThunk(
    'notes/fetchNotes',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/notes');
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Delete a note
export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/notes/${id}`);
            dispatch(fetchNotes());
            return { id };
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Create a note
export const createNote = createAsyncThunk(
    'notes/createNote',
    async (content, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.post('/notes', { content });
            dispatch(fetchNotes());
            return res.data.note || res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Update a note
export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ id, content }, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.patch(`/notes/${id}`, { content });
            dispatch(fetchNotes());
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [],
        loading: false,
        error: null
    },
    reducers: {
        resetStateNotes: (state) => {
            state.notes = [];
            state.loading = false;
            state.error = null;
        }

    },
    extraReducers: builder => {
        builder
            .addCase(fetchNotes.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload.notes;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteNote.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateNote.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.loading = false;

            })
            .addCase(updateNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createNote.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetStateNotes } = notesSlice.actions;
export default notesSlice.reducer;
