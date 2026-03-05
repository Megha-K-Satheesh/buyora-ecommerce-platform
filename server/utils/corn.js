 const cron = require("node-cron");
// const Order = require("../models/Order");

const Order = require("../models/Order");

// const updateDeliveryStatus = async () => {
//   const now = new Date();

//   // Get all orders that still have items not yet delivered
//   const orders = await Order.find({ 'items.status': { $in: ['PLACED', 'CONFIRMED', 'SHIPPED'] } });

//   for (let order of orders) {
//     let changed = false;

//     order.items.forEach(item => {
//       if (item.status === "PLACED" && item.confirmAt && item.confirmAt <= now) {
//         item.status = "CONFIRMED";
//         changed = true;
//       }
//       if (item.status === "CONFIRMED" && item.shippedAt && item.shippedAt <= now) {
//         item.status = "SHIPPED";
//         changed = true;
//       }
//       if (item.status === "SHIPPED" && item.deliveredAt && item.deliveredAt <= now) {
//         item.status = "DELIVERED";
//         changed = true;
//       }
//     });

//     if (changed) {
//       await order.save();
//     }
//   }

//   console.log("Cron: Order statuses updated", new Date());
// };

// // Schedule cron job
// const scheduleDeliveryCron = () => {
//   // run every minute for demo purposes
//   cron.schedule('* * * * *', () => {
//     updateDeliveryStatus();
//   });
// };

// module.exports = { scheduleDeliveryCron, updateDeliveryStatus };



// const updateDeliveryStatus = async () => {
//   const now = new Date();

//   const orders = await Order.find({
//     "items.status": { 
//       $in: ["PLACED", "CONFIRMED", "SHIPPED"] 
//     }
//   });

//   for (let order of orders) {
//     let changed = false;

   
//     for (let item of order.items) {

//       if (
//         item.status === "PLACED" &&
//         item.confirmAt &&
//         item.confirmAt <= now
//       ) {
//         item.status = "CONFIRMED";
//         changed = true;
//       }

//       if (
//         item.status === "CONFIRMED" &&
//         item.shippedAt &&
//         item.shippedAt <= now
//       ) {
//         item.status = "SHIPPED";
//         changed = true;
//       }

//       if (
//         item.status === "SHIPPED" &&
//         item.deliveredAt &&
//         item.deliveredAt <= now
//       ) {
//         item.status = "DELIVERED";
//         changed = true;
//       }
//     }

//     if (changed) {

//       const statuses = order.items.map(item => item.status);

//       const allDelivered = statuses.every(s => s === "DELIVERED");
//       const allCancelled = statuses.every(s => s === "CANCELLED");
//       const allReturned = statuses.every(s => s === "RETURNED");
//       const allRefunded = statuses.every(s => s === "REFUNDED");
//       const someReturnRequested = statuses.includes("RETURN_REQUESTED");

//       if (allRefunded) {
//         order.orderStatus = "REFUNDED";
//       }
//       else if (allReturned) {
//         order.orderStatus = "RETURNED";
//       }
//       else if (someReturnRequested) {
//         order.orderStatus = "RETURN_REQUESTED";
//       }
//       else if (allDelivered) {
//         order.orderStatus = "DELIVERED";
//       }
//       else if (allCancelled) {
//         order.orderStatus = "CANCELLED";
//       }
//       else if (statuses.includes("SHIPPED")) {
//         order.orderStatus = "SHIPPED";
//       }
//       else if (statuses.includes("CONFIRMED")) {
//         order.orderStatus = "CONFIRMED";
//       }
//       else {
//         order.orderStatus = "PLACED";
//       }

//       await order.save();
//     }
//   }

//   console.log("✅ Cron: Order statuses synced", new Date());
// };


// // Schedule cron job
// const scheduleDeliveryCron = () => {
//   // run every minute for demo purposes
//   cron.schedule('* * * * *', () => {
//     updateDeliveryStatus();
//   });
// };
//  module.exports = { scheduleDeliveryCron, updateDeliveryStatus };






const updateDeliveryStatus = async () => {
  try {
    const now = new Date();

    const orders = await Order.find({
      "items.status": { $in: ["PLACED", "CONFIRMED", "SHIPPED"] }
    });

    for (let order of orders) {
      let changed = false;

      for (let item of order.items) {

        // PLACED CONFIRMED
        if (
          item.status === "PLACED" &&
          item.confirmAt &&
          item.confirmAt <= now
        ) {
          item.status = "CONFIRMED";
          changed = true;
        }

        // CONFIRMED  SHIPPED
        if (
          item.status === "CONFIRMED" &&
          item.shippedAt &&
          item.shippedAt <= now
        ) {
          item.status = "SHIPPED";
          changed = true;
        }

        // SHIPPED DELIVERED
        if (
          item.status === "SHIPPED" &&
          item.deliveredAt &&
          item.deliveredAt <= now
        ) {
          item.status = "DELIVERED";
          changed = true;
        }
      }

      if (changed) {
        syncOrderStatus(order); 
        await order.save();
      }
    }

    console.log("Cron: Delivery statuses updated at", new Date());
  } catch (error) {
    console.error(" Cron Error:", error.message);
  }
};


const scheduleDeliveryCron = () => {
  cron.schedule("* * * * *", () => {
    updateDeliveryStatus();
  });

  console.log(" Delivery cron scheduled (runs every minute)");
};

module.exports = {
  scheduleDeliveryCron,
  updateDeliveryStatus
};
