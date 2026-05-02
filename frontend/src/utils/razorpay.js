import Swal from "sweetalert2";


export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-script";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


export const openRazorpay = async ({
  data,
  dispatch,
  verifyPayment,
  paymentFailed,
  navigate,
  selectedAddress,
  addresses,
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) return;

  const selectedAddr = addresses.find(a => a._id === selectedAddress);

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
      } catch (err) {
        await dispatch(
          paymentFailed({
            orderId: data.order._id,
            reason: "Verification failed",
          })
        ).unwrap();

        Swal.fire({
    icon: "info",
    title: "Payment Failed",
    text: "Your order was not completed. You can retry payment from your order page.",
    confirmButtonText: "OK",
  });
  navigate("/product/cart");
      }
    },

    modal: {
      ondismiss: async function () {
        try {
          await dispatch(
            paymentFailed({
              orderId: data.order._id,
              reason: "User closed payment window",
            })
          ).unwrap();

            Swal.fire({
    icon: "info",
    title: "Payment Failed",
    text: "Your order was not completed. You can retry payment from your order page.",
    confirmButtonText: "OK",
  });
  navigate("/product/cart");
        } catch (err) {
          console.log(err);
        }
      },
    },

    prefill: {
      name: selectedAddr?.fullName || "",
      contact: selectedAddr?.phone || "",
      email: selectedAddr?.email || "",
    },

    theme: {
      color: "#ec4899",
    },
  };

  const razor = new window.Razorpay(options);

  razor.on("payment.failed", async function (response) {
    try {
      await dispatch(
        paymentFailed({
          orderId: data.order._id,
          reason: response.error?.description || "Payment failed",
        })
      ).unwrap();

      Swal.fire({
    icon: "info",
    title: "Payment Failed",
    text: "Your order was not completed and has been cancelled. Please place the order again.",
    confirmButtonText: "OK",
  });
  navigate("/product/cart");
    } catch (err) {
      console.log(err);
    }
  });

  razor.open();
};
