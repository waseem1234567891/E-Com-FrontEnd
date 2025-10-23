import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import { AuthContext } from "../context/-AuthContext";
import OrderDetails1 from "./OrderDetails1";
import { useUserUl } from "../context/UserUIContext";


const OrderDetailForUser = () => {
  const { orderId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const{activeTab,setActiveTab}=useUserUl(); // context-driven tab


  useEffect(() => {
    if (token) {
      OrderService.getOrderByOrderId(orderId, token)
        .then(res => setOrder(res.data))
        .catch(err => {
          console.error(err);
          navigate(-1); // fallback
        });
    }
  }, [orderId, token, navigate]);

  const handleBack = () => {
    setActiveTab("orders");
    navigate("/dashboard");
  };

  return <OrderDetails1 order={order} showItems={true} onBack={handleBack} />;
};

export default OrderDetailForUser;
