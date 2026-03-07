// const syncOrderStatus = (order) => {
//   const statuses = order.items.map(item => item.status);

//   if (statuses.every(s => s === "REFUNDED")) {
//     order.orderStatus = "REFUNDED";
//   } 
//   else if (statuses.every(s => s === "RETURNED")) {
//     order.orderStatus = "RETURNED";
//   } 
//   else if (statuses.includes("RETURN_REQUESTED")) {
//     order.orderStatus = "RETURN_REQUESTED";
//   } 
//   else if (statuses.every(s => s === "DELIVERED")) {
//     order.orderStatus = "DELIVERED";
//   } 
//   else if (statuses.every(s => s === "CANCELLED")) {
//     order.orderStatus = "CANCELLED";
//   } 
//   else if (statuses.includes("SHIPPED")) {
//     order.orderStatus = "SHIPPED";
//   } 
//   else if (statuses.includes("CONFIRMED")) {
//     order.orderStatus = "CONFIRMED";
//   } 
//   else {
//     order.orderStatus = "PLACED";
//   }
// };

// module.exports = syncOrderStatus;
const syncOrderStatus = (order) => {

  const totalItems = order.items.length;

  const deliveredItems = order.items.filter(
    item => item.status === "DELIVERED"
  ).length;

  const returnedItems = order.items.filter(
    item => item.status === "RETURN_APPROVED"
  ).length;

  const cancelledItems = order.items.filter(
    item => item.status === "CANCELLED"
  ).length;

  const shippedItems = order.items.filter(
    item => item.status === "SHIPPED"
  ).length;


  if (returnedItems === totalItems) {
    order.orderStatus = "RETURNED";
  }

  else if (returnedItems > 0) {
    order.orderStatus = "PARTIALLY_RETURNED";
  }

  else if (deliveredItems === totalItems) {
    order.orderStatus = "DELIVERED";
  }

  else if (cancelledItems === totalItems) {
    order.orderStatus = "CANCELLED";
  }

  else if (shippedItems > 0) {
    order.orderStatus = "SHIPPED";
  }

  else {
    order.orderStatus = "PLACED";
  }

};

module.exports = syncOrderStatus;
