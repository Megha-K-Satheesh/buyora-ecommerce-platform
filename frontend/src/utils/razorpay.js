export const openRazorpay = ({
  data,
  dispatch,
  verifyPayment,
  navigate,
  selectedAddress,
  addresses,
}) => {
  const selectedAddr = addresses.find(
    (a) => a._id === selectedAddress
  );

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: data.amount,
    currency: data.currency,
    name: "BUYORA",
    description: "Order Payment",
    order_id: data.razorpayOrderId,

    handler: async function (response) {
      try {
        await dispatch(
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: data.order._id,
          })
        ).unwrap();

        navigate(`/order-success/${data.order._id}`);
      } catch (error) {
        alert("Payment verification failed",error);
      }
    },

    prefill: {
      name: selectedAddr?.fullName,
      contact: selectedAddr?.phone,
    },

    theme: {
      color: "#ec4899",
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
};
