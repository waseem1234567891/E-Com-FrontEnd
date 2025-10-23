import React, { useContext } from "react";
import { AuthContext } from "../../context/-AuthContext";
import GuestCheckout from "./GuestCheckout";
import UserCheckout from "./UserCheckout";

const CheckoutPage = () => {
  const { userId } = useContext(AuthContext);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {userId ? <UserCheckout /> : <GuestCheckout />}
    </div>
  );
};

export default CheckoutPage;
