import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { AuthContext } from "../../../context/-AuthContext";
import { useAdminUI } from "../../../context/AdminUIContext";
import OrderDetails1 from "../../../components/OrderDetails1";

const OrderDetailForAdmin = () => {
  const { orderId } = useParams();
  const { token } = useContext(AuthContext);
  const { setActiveMenu } = useAdminUI();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (token) {
      OrderService.getOrderByOrderId(orderId, token)
        .then(res => setOrder(res.data))
        .catch(err => {
          console.error(err);
          setActiveMenu("orders");
          navigate("/admin-dashboard/orders", { replace: true });
        });
    }
  }, [orderId, token, navigate, setActiveMenu]);

  const handleBack = () => {
    setActiveMenu("orders");
    navigate("/admin-dashboard/orders");
  };

  return <OrderDetails1 order={order} showItems={true} onBack={handleBack} />;
};

export default OrderDetailForAdmin;
