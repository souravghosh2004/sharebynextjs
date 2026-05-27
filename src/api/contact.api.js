import apiClient from "./index.api.js";
export const submitContact = async (data) => {
    try {
        const res = await apiClient.post("/contact", data);
        return res.data;
    } catch (err) {
        return err.response.data;
    }
};
