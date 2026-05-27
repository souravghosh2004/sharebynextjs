import apiClient from "./index.api.js";

const checkAuth = async () => {
    try {
        const response = await apiClient.get("/auth/check-auth");
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "You are not logedIn"
        }
    }
}

const logoutUser = async () => {
    try {
        console.log("logut , response")
        const response = await apiClient.get("/auth/logoutUser");
        console.log("logut , response => ", response)
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Logout Failed."
        }
    }
}

const changePasswordAPI = async (payload) => {
    try {
        const response = await apiClient.patch("/auth/change-password", payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      });
        return response.data;
    } catch (err) {
        console.error("Failed to change password.", err)
        return {
            success: false,
            message: err.response?.data?.message || "Failed to change password."
        }
    }
}

const forgotPasswordAPI = async (email) => {
   try {
        const response = await apiClient.post("/auth/forgot-password", { email });
        console.log("logut , response => ", response)
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Failed to send otp."
        }
    }

}

const resetPasswordAPI = async (payload) => {
    try {
        const response = await apiClient.post("/auth/reset-password", payload);
        console.log("logut , response => ", response)
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Failed to reset password."
        }
    }
}
export { checkAuth, logoutUser, changePasswordAPI , forgotPasswordAPI, resetPasswordAPI}

