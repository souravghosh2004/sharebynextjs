import apiClient from "./index.api.js";

export const uploadFiles = async (files, receiverId = null,advancedOptions =null) => {
  const response = await apiClient.post(
    "/files/get-pre-signed-url",
    {
      files,
      receiverId,
      advancedOptions
    }
  );

  return response.data;
};


export const updateStatus = async(uniqueCode,status)=>{
  const response = await apiClient.post("/files/update-status", {uniqueCode,status});

  return response.data;
}


export const getFilesByCode = async (uniqueCode, password = null) => {
  try {
    // ✅ Add password to query params if provided
    const config = password ? { params: { password } } : {};

    const response = await apiClient.get(`/user/fetch-files/${uniqueCode}`, config);
    // URL becomes: /user/fetch-files/CODE123?password=secret123

    return response.data;
  } catch (error) {
    console.error("Error fetching files by code:", error);
    // ✅ Return the error response data so the UI can read 'isPasswordProtected'
    return error.response ? error.response.data : { success: false, message: "Network Error" };
  }
};


export const loginUser =  async (email, password) => {
  try {
    const response = await apiClient.post("/user/login",{email,password});
    return response.data;
    
  } catch (error) {
    console.log(error.response.data ||  "problem in login...")
    return error.response.data;
  }
}


export const tempUserCreate = async (email, password, fullName) => {
  try {
    const response = await apiClient.post("/user/temp/create-user",{email, password, fullName});
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.log(err.response.data)
    return err.response.data;
  }
}

export const createNewUser = async (email, otp) => {
  try {
    const response = await apiClient.post("/user/create/new-user",{email, otp})
    return response.data;
  } catch (err) {
    return err.response.data;
  }
} 





