const syncOrderStatus = (order) => {
  const statuses = order.items.map(item => item.status);

  if (statuses.every(s => s === "REFUNDED")) {
    order.orderStatus = "REFUNDED";
  } 
  else if (statuses.every(s => s === "RETURNED")) {
    order.orderStatus = "RETURNED";
  } 
  else if (statuses.includes("RETURN_REQUESTED")) {
    order.orderStatus = "RETURN_REQUESTED";
  } 
  else if (statuses.every(s => s === "DELIVERED")) {
    order.orderStatus = "DELIVERED";
  } 
  else if (statuses.every(s => s === "CANCELLED")) {
    order.orderStatus = "CANCELLED";
  } 
  else if (statuses.includes("SHIPPED")) {
    order.orderStatus = "SHIPPED";
  } 
  else if (statuses.includes("CONFIRMED")) {
    order.orderStatus = "CONFIRMED";
  } 
  else {
    order.orderStatus = "PLACED";
  }
};

module.exports = syncOrderStatus;
