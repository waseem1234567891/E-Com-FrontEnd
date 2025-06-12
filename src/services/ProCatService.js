import axios from "axios";

const API_BASE_URL="http://localhost:8989/api/category";

const addCategory=(FormData)=>{
    return axios.post(`${API_BASE_URL}/add`,FormData,{

headers: {
      "Content-Type": "application/json"
    }
    });

};

const getAllCateGory=()=>{
    return axios.get(`${API_BASE_URL}/getAllCate`);
};

const getCategoryById=(proCatGorId)=>{

    return axios.get(`${API_BASE_URL}/getbyid/${proCatGorId}`)

};

const ProCatService={
    addCategory,getAllCateGory,getCategoryById
}
export default ProCatService;