import {create} from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

const API_URL = `${import.meta.env.DB_API}/api/auth`;

export const useAuthStore = create((set) => ({

    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    isVerified: false,

    signup: async (email, password, name) => {
        set({isLoading: true, error: null});

        try {
            
            const response = await axios.post(`${API_URL}/signup`, {email, password, name});

            Cookies.set("token", response.data.user.token);

            set({user: response.data.user, isAuthenticated: true, isLoading: false, isVerified: response.data.user.isVerified});

        } catch (error) {
            
            set({error : error.response.data.message || "Error Sigin up", isLoading: false});
            throw error;
        }
    },

    login: async (email, password) => {
        set({isLoading: true, error: null});

        try {
            
            const response = await axios.post(`${API_URL}/login`, {email, password});
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false,
                isVerified: response.data.user.isVerified,
            })

            Cookies.set("token", response.data.user.token);
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error logging in", isLoading: false
            });
            throw error;
        }
    },

    logout: async () => {
        set({isLoading: true, error: null});

        try {
            await axios.post(`${API_URL}/logout`);
            Cookies.remove("token");

            set({user: null, isAuthenticated: false, isLoading: false});
        } catch (error) {
            set({error: error.response.data.message || "Error logging out", isLoading: false});
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({isLoading: true, error: null});

        try {
            const response = await axios.post(`${API_URL}/verify-email`, {code});

            set({user: response.data.user, isAuthenticated: true, isLoading: false,isVerified: response.data.user.isVerified});
        } catch (error) {
            set({error: error.response.data.message || "Error verifying email", isLoading: false});
            throw error;
        }

    },

    checkAuth: async () => {
        set({isCheckingAuth: true});

        try {
            const response = await axios.get(`${API_URL}/check-auth`, {withCredentials: true, headers: {
                token: Cookies.get("token")
            }});
            set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false, isVerified: response.data.user.isVerified});
        } catch (error) {
            set({isCheckingAuth: false, error: null, isAuthenticated: false});
        }

    },

    forgotPassword : async (email) => {

        set({isLoading: true, error: null});

        try {
            await axios.post(`${API_URL}/forgot-password`, {email});
            set({isLoading: false});
        } catch (error) {
            set({error: error.response.data.message || "Error sending email", isLoading: false});
            throw error;
        }
    },

    resetPassword : async (token, password) => {
        console.log("Token at Reset Password", token);

        set({isLoading: true, error: null});

        try {
            await axios.post(`${API_URL}/reset-password/${token}`, {password});
            set({isLoading: false});
        } catch (error) {
            set({error: error.response.data.message || "Error resetting password", isLoading: false});
            throw error;
        }
    }
}))

