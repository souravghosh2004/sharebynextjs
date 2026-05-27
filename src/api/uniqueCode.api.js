import apiClient from "./index.api.js";

const getAllUniqueCodesDetails = async () =>{
    try {
        const response  = await apiClient.get("/uniqueCode/code-details");
        console.log("getAllUniqueCodesDetails = ",response.data)
        return response.data;
    } catch (err) {
         console.log("getAllUniqueCodesDetails error = ",err.response.data );
         return err.response.data;
    }
}


const deleteFileUsingUniqueCode = async (uniqueCode) => {
    try {
        const response = await apiClient.delete(`/uniqueCode/delete-file/${uniqueCode}`) 
        return response.data;
    } catch (err) {
        return err.response.data;
    }
}

const receiverGetAllCode = async () => {
     try {
        const response = await apiClient.get(`uniqueCode/recevier-all-code`)
        console.log(response)
        return response.data;
    } catch (err) {
        return err.response.data;
    }
}
export {getAllUniqueCodesDetails, deleteFileUsingUniqueCode, receiverGetAllCode}