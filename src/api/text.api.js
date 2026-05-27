import apiClient from "./index.api.js";


export const storeTextAPI = async (content, password, expiryDuration, viewLimit) => {
    const response = await apiClient.post('/text/store', { 
        content,
        password,       // ✅ Send Password
        expiryDuration, // ✅ Send Duration (e.g., "01:30")
        viewLimit       // ✅ Send Max Views
    });
    return response.data;
};

export const receiveTextAPI = async (uniqueCode, password = null) => {
    // Axios allows passing query parameters in the 'params' object
    // This will result in: /text/fetch/CODE123?password=secret123
    const config = password ? { params: { password } } : {};
    
    const response = await apiClient.get(`/text/fetch/${uniqueCode}`, config);
    return response.data;
};
