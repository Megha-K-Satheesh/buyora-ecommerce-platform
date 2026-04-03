


const detectIntent = (message) => {
  if (!message || typeof message !== "string") return "GENERAL";

  const msg = message.toLowerCase().trim();

 
  const orderStatusKeywords = [
    "status",
    "track",
    "tracking",
    "where is my order",
    "order status",
    "track my order",
    "order update",
    "my order",
    "delivery status",
    "order progress",
    "shipment",
    "shipping"
  ];
  if (orderStatusKeywords.some(keyword => msg.includes(keyword))) {
    return "ORDER_STATUS";
  }


  const orderHistoryKeywords = [
    "history",
    "my orders",
    "previous orders",
    "all orders",
    "order list",
    "recent orders",
    "orders",
    "past orders"
  ];
  if (orderHistoryKeywords.some(keyword => msg.includes(keyword))) {
    return "ORDER_HISTORY";
  }

 
  const cancelKeywords = [
    "cancel",
    "abort order",
    "stop order",
    "change order",
    "modify order"
  ];
  if (cancelKeywords.some(keyword => msg.includes(keyword))) {
    return "CANCEL_ORDER";
  }

  
  const paymentKeywords = [
    "payment",
    "wallet",
    "cod",
    "pay",
    "payment issue",
    "payment failed",
    "pay now",
    "checkout"
  ];
  if (paymentKeywords.some(keyword => msg.includes(keyword))) {
    return "PAYMENT_HELP";
  }


  const refundKeywords = [
    "refund",
    "money back",
    "return status",
    "reimbursement",
    "return item"
  ];
  if (refundKeywords.some(keyword => msg.includes(keyword))) {
    return "REFUND_STATUS";
  }


  const greetingKeywords = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening"
  ];
  if (greetingKeywords.some(keyword => msg.includes(keyword))) {
    return "GREETING";
  }

 
  const helpKeywords = [
    "help",
    "assist",
    "support",
    "what can you do",
    "how to",
    "guide me"
  ];
  if (helpKeywords.some(keyword => msg.includes(keyword))) {
    return "HELP";
  }

 
  const generalOrderKeywords = [
    "order",
    "orders",
    "my order",
    "my orders"
  ];
  if (generalOrderKeywords.some(keyword => msg === keyword || msg.includes(keyword))) {
    return "ORDER_STATUS"; 
  }

  // Default
  return "GENERAL";
};

module.exports = { detectIntent };
