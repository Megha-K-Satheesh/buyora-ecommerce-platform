



const syncOrderStatus = (order) => {

  const totalItems = order.items.length;

  const deliveredItems = order.items.filter(item => item.status === "DELIVERED").length;
  const returnedItems = order.items.filter(item => item.status === "RETURNED").length;
  const returnRequestedItems = order.items.filter(item => item.status === "RETURN_REQUESTED").length;
  const returnApprovedItems = order.items.filter(item => item.status === "RETURN_APPROVED").length;
  const returnRejectedItems = order.items.filter(item => item.status === "RETURN_REJECTED").length;

  const cancelledItems = order.items.filter(item => item.status === "CANCELLED").length;
  const shippedItems = order.items.filter(item => item.status === "SHIPPED").length;
  const confirmedItems = order.items.filter(item => item.status === "CONFIRMED").length;

  // FULL STATES

  if (returnedItems === totalItems) {
    order.orderStatus = "RETURNED";
  }

  else if (returnApprovedItems === totalItems) {
    order.orderStatus = "RETURN_APPROVED";
  }

  else if (cancelledItems === totalItems) {
    order.orderStatus = "CANCELLED";
  }

  else if (deliveredItems + returnRejectedItems === totalItems) {
    order.orderStatus = "DELIVERED";
  }

  else if (shippedItems === totalItems) {
    order.orderStatus = "SHIPPED";
  }

  else if (confirmedItems === totalItems) {
    order.orderStatus = "CONFIRMED";
  }

  // PARTIAL STATES

  else if (returnedItems > 0) {
    order.orderStatus = "PARTIALLY_RETURNED";
  }

  else if (returnApprovedItems > 0) {
    order.orderStatus = "PARTIALLY_RETURN_APPROVED";
  }

  else if (returnRequestedItems > 0) {
    order.orderStatus = "PARTIALLY_RETURN_REQUESTED";
  }

  else if (deliveredItems > 0) {
    order.orderStatus = "PARTIALLY_DELIVERED";
  }

  else if (shippedItems > 0) {
    order.orderStatus = "PARTIALLY_SHIPPED";
  }

  else if (confirmedItems > 0) {
    order.orderStatus = "PARTIALLY_CONFIRMED";
  }

  else {
    order.orderStatus = "PLACED";
  }

};

module.exports = syncOrderStatus;



