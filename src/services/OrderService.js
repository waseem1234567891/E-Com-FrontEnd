import axios from 'axios';

const API_URL = "http://localhost:8989/orders";


//checkout order
 const checkout= async (payload,token) => {
  //const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  return axios.post(`${API_URL}/addorder`,payload, config );

  
};
//update order
 const updateOrderStatus= async (id,status,token) => {
  //const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  };
  const data = { status };
  return axios.put(`${API_URL}/updateorderstatus/${id}`,data, config );

  
};


const getAllOrders= async (token)=>{
   //const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.get(`${API_URL}/getallorders`,config);

};

const OrderService={
  checkout,getAllOrders,updateOrderStatus
}

export default OrderService;

