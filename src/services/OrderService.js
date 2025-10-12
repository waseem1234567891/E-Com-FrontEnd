import axios from 'axios';

const API_URL = "http://localhost:8989/orders";

// Checkout order
const checkout = async (payload, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await axios.post(`${API_URL}/addorder`, payload, { headers });
    return response.data;
  } catch (err) {
    if (err.response) {
      // Normalize error into something consistent
      const { status, data } = err.response;
      throw {
        status,
        message: data?.message || "Something went wrong",
        raw: data,
      };
    } else {
      throw {
        status: 0,
        message: "Network error. Please try again.",
        raw: err,
      };
    }
  }
};

//Get an order by OrderId

const getOrderByOrderId = async (orderId, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.get(`${API_URL}/${orderId}`, { headers });
};


// Update order
const updateOrderStatus = async (id, status, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.put(`${API_URL}/updateorderstatus/${id}`, { status }, { headers });
};

const cancelAnOrder=async(orderId,token)=>{
   const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.delete(`${API_URL}/${orderId}`,{headers})

};

// Get all orders
const getAllOrders = async (token,page=0,status="",search = "") => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
let url=`${API_URL}/getallorders?page=${page}&size=10`
if(status) url+=`&status=${status}`;
if(search) url+=`&search=${search}`;
  return axios.get(url, { headers });
};
//Get Active order of a user by userId
// Get all orders
const getOrdersByUserId = async (userId,token) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.get(`${API_URL}/user/custom/${userId}`, { headers });
};


const OrderService = { checkout, getAllOrders, updateOrderStatus,cancelAnOrder,getOrderByOrderId,getOrdersByUserId };
export default OrderService;
