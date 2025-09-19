// store/slices/authSlice.js
import api from "@/app/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk for login

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/auth/login", formData);
            localStorage.setItem("token", data.token);
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const loadUserFromToken = createAsyncThunk(
    "auth/loadUserFromToken",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/auth/user");
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

//update info
export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.patch("/auth/user/update-info", formData);
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

//update password
export const updatePassword = createAsyncThunk(
    "auth/updatePassword",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.put("/auth/user/update-password", formData);
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);


const initialState = {
    user: null,   // store user object
    token: null,  // store JWT or session token
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        resetStateAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(loadUserFromToken.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
            });

    },
});

export const { resetStateAuth } = authSlice.actions;
export default authSlice.reducer;
