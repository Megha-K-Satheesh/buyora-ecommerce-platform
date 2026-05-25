






import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { cancelOrderItem, clearOrderState, downloadInvoice, getSingleOrder, requestReturnItem } from "../../../Redux/slices/orderSlice";
import Loader from "../../../components/ui/Loader";
import Navbar from "../../../components/ui/Navbar";

const SingleOrderPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { singleOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getSingleOrder(orderId));
    return () => dispatch(clearOrderState());
  }, [dispatch, orderId]);

  if (loading) return <div className="text-center mt-10"><Loader/></div>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;
  if (!singleOrder) return null;

  const { items, shippingAddress, orderStatus, paymentStatus, totalAmount } = singleOrder;


const canDownloadInvoice = items.some(item =>
  item.status === "DELIVERED" || item.status === "RETURN_REJECTED"
);

  const handleCancelItem = async (productId) => {
    const { value: reason } = await Swal.fire({
      title: "Cancel Order Item",
      input: "text",
      inputLabel: "Reason for cancellation (optional)",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    });
    if (reason !== undefined) {
      dispatch(cancelOrderItem({ orderId, productId }))
        .unwrap()
        .then(() => {
          Swal.fire("Cancelled!", "Your item has been cancelled.", "success");
          dispatch(getSingleOrder(orderId));
        })
        .catch((err) => {
          Swal.fire("Error!", err || "Failed to cancel item.", "error");
        });
    }
  };

  const handleReturnItem = async (productId) => {
    const { value: reason } = await Swal.fire({
      title: "Request Return",
      input: "text",
      inputLabel: "Reason for return (optional)",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Yes, request return",
    });
    if (reason !== undefined) {
      dispatch(requestReturnItem({ orderId, productId, reason }))
        .unwrap()
        .then(() => {
          Swal.fire("Requested!", "Return request submitted.", "success");
          dispatch(getSingleOrder(orderId));
        })
        .catch((err) => {
          Swal.fire("Error!", err || "Failed to request return.", "error");
        });
    }
  };


  

const handleDownloadInvoice = async (orderId) => {
  try {
    const res = await dispatch(downloadInvoice(orderId)).unwrap();

    const url = window.URL.createObjectURL(new Blob([res]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice.pdf");

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.log(err);
  }
};
  return (
    <>
    <Navbar/>
    <div className="max-w-4xl mx-auto p-6 mt-25">
   
      <div className="mb-6">
        <h2 className="lg:text-2xl text-xl font-bold mb-1 text-text-primary">Order #{singleOrder.orderNumber}</h2>
        <div className="flex flex-wrap gap-4 lg:text-sm text-xs text-text-secondary">
          <span>Status: <span className="font-semibold">{orderStatus}</span></span>
          <span>Payment: <span className="font-semibold">{paymentStatus}</span></span>
        </div>
      </div>

      <div className="space-y-4 mb-6 lg:text-sm text-xs ">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variationId}`}
            className="flex flex-col md:flex-row bg-bg-main rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <img
              src={item.imageUrl?.[0] || "/placeholder.png"}
              alt={item.name}
              className={`w-28 h-auto object-cover rounded-md mb-3 md:mb-0 ${item.status === "CANCELLED" ? "opacity-50" : ""}`}
            />
            <div className="flex-1 md:ml-5 flex flex-col justify-between ">
              <div>
                <h4 className={`font-semibold ${item.status === "CANCELLED" ? "line-through text-text-light" : "text-text-primary"}`}>
                  {item.name}
                </h4>
                <p className={item.status === "CANCELLED" ? "text-text-light" : "text-text-secondary"}>Qty: {item.quantity}</p>
                <p className={`font-semibold mt-1 ${item.status === "CANCELLED" ? "text-text-light" : "text-text-primary"}`}>
                  Price: ₹{item.price * item.quantity}
                </p>
                <p className="mt-1 text-sm text-text-secondary">Status: {item.status}</p>
              </div>

              <div className="mt-2 flex gap-2 justify-end">
                {(item.status === "PLACED" || item.status === "CONFIRMED") && (
                  <button
                    onClick={() => handleCancelItem(item.productId)}
                    className="px-3 py-1 bg-danger text-white rounded-lg hover:bg-danger-hover transition-colors"
                  >
                    Cancel
                  </button>
                )}
                {item.status === "DELIVERED" && (
                  <>
                    <button
                      onClick={() => handleReturnItem(item.productId)}
                      className="px-3 py-1 bg-warning text-white rounded-lg hover:bg-warning transition-colors"
                    >
                      Return
                    </button>
                    <button
                      onClick={() => navigate(`/add-review/${item.productId}`)}
                      className="px-3 py-1 bg-success text-white rounded-lg hover:bg-success transition-colors"
                    >
                      Write Review
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-bg-main p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 lg:text-sm text-xs ">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg text-text-primary">Total Amount: ₹{totalAmount}</p>
          <p className="text-text-secondary">Order Status: {orderStatus}</p>
          <p className="text-text-secondary">Payment Status: {paymentStatus}</p>
        </div>

        <div className="bg-bg-muted p-4 rounded-lg flex-1 md:ml-6">
          <h3 className="font-semibold mb-1 text-text-primary">Shipping Address</h3>
          <p>{shippingAddress.fullName}</p>
          <p>{shippingAddress.addressLine}, {shippingAddress.city} - {shippingAddress.postalCode}</p>
          <p>{shippingAddress.state}</p>
          <p>Phone: {shippingAddress.phone}</p>
        </div>
      </div>

  

      <div className="flex justify-between items-center mt-6">


  <button
    onClick={() => navigate("/all-orders")}
    className="px-5 py-2 bg-primary text-white lg:text-sm text-xs rounded-lg hover:bg-primary-hover transition-colors"
  >
    Back to All Orders
  </button>

 
{canDownloadInvoice && (
  <button
    onClick={() => handleDownloadInvoice(orderId)}
    className="px-5 py-2 bg-green-600 text-white rounded-lg"
  >
    Download Invoice
  </button>
)}

</div>
    </div>
    </>
  );
};

export default SingleOrderPage;
