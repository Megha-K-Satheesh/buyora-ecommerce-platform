



const mongoose = require("mongoose");
const Order = require("../models/Order");
const { ErrorFactory } = require("../utils/errors");
const { detectIntent } = require("../utils/intent");
const fetch = require("node-fetch");
const Chat = require("../models/Chat");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

class ChatService {
  static buildPrompt(context) {
    return `
You are an intelligent and friendly AI assistant for an e-commerce fashion platform called Buyora. Your name is Nyra.

About Buyora:
- Buyora is a modern online shopping platform focused on fashion and lifestyle.
- Founded in 2025.
- Categories include: Men's wear, Women's wear, Kids wear, Footwear, Accessories, and Lifestyle products.
- Buyora offers trendy, affordable, and high-quality products.
- The platform provides a smooth shopping experience with easy returns and fast delivery.

Your Role:
- Act like a professional customer support assistant of Buyora.
- Be friendly, polite, and helpful.
- Keep answers clear and easy to understand.
- Help users with orders, products, returns, refunds, and general queries.

Capabilities:
- Answer questions about Buyora (company, products, services).
- Help users track orders and understand order status.
- Suggest products or categories if user asks.
- Explain return, refund, and shipping policies.
- Handle complaints politely.

Rules:
- Always respond as a Buyora assistant (never say you are AI or Gemini).
- Do not say "I don’t know Buyora".
- If information is not available, say: "Please contact our support team for more details."
- Keep responses short, helpful, and user-friendly.
- Use a conversational tone like a real support agent.

Tone:
- Friendly, like Myntra or Flipkart support.
- Slightly casual but professional.

Example style:
User: What is Buyora?
Answer: Buyora is a fashion and lifestyle shopping platform where you can explore trendy clothing, footwear, and accessories at affordable prices.

User: Can I return a product?
Answer: Yes! Buyora offers an easy return policy. You can return eligible items within 7 days of delivery.

Now answer the user's query accordingly.

${context}
`;
  }

  static async safeAI(prompt) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts.map(p => p.text).join("") || "No response from AI";
    } catch (err) {
      console.error("Gemini error FULL:", err);
      return "Sorry, something went wrong. Please try again later.";
    }
  }

  static getItemSummary(items) {
    return items.map(item => `- ${item.name} x${item.quantity} (₹${item.price})`).join("\n");
  }

  static async processMessage(userId, message) {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw ErrorFactory.validation("Invalid user ID");
    if (!message) throw ErrorFactory.validation("Message is required");

    await Chat.create({ userId, sender: "user", message });

    const intent = detectIntent(message);
    let reply = "";

    switch (intent) {
      case "ORDER_STATUS": {
        const order = await Order.findOne({ userId }).sort({ createdAt: -1 }).lean();
        if (!order) reply = "You don’t have any orders yet.";
        else {
          const prompt = this.buildPrompt(`
Explain the order clearly.

Order Number: ${order.orderNumber}
Order Status: ${order.orderStatus}
Payment Status: ${order.paymentStatus}

Items:
${this.getItemSummary(order.items)}
`);
          reply = await this.safeAI(prompt);
        }
        break;
      }

      case "ORDER_HISTORY": {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();
        if (!orders.length) reply = "No order history found.";
        else {
          const summary = orders.map(o => `Order ${o.orderNumber} - ${o.orderStatus} - ₹${o.totalAmount}`).join("\n");
          reply = await this.safeAI(this.buildPrompt(`Summarize the user's recent orders:\n${summary}`));
        }
        break;
      }

      case "CANCEL_ORDER": {
        const order = await Order.findOne({ userId }).sort({ createdAt: -1 });
        if (!order) reply = "No orders found to cancel.";
        else {
          const cancellableStatuses = ["PLACED", "CONFIRMED", "PENDING_PAYMENT"];
          const cancellableItems = order.items.filter(i => cancellableStatuses.includes(i.status));
          if (!cancellableItems.length) reply = "No items in this order can be cancelled.";
          else {
            cancellableItems.forEach(item => { item.status = "CANCELLED"; item.cancelReason = "Cancelled via chatbot"; });
            order.orderStatus = order.items.every(i => i.status === "CANCELLED") ? "CANCELLED" : "PARTIALLY_CANCELLED";
            await order.save();
            reply = "Your order items have been cancelled successfully.";
          }
        }
        break;
      }

      case "PAYMENT_HELP":
        reply = await this.safeAI(this.buildPrompt(`
Explain payment options:
- Cash on Delivery (COD)
- Online Payment (Razorpay)
- Wallet

Also explain what to do if payment fails.
`));
        break;

      case "REFUND_STATUS": {
        const order = await Order.findOne({ userId }).sort({ createdAt: -1 }).lean();
        if (!order) reply = "No orders found.";
        else {
          const refundedItems = order.items.filter(i => i.refundStatus !== "NONE");
          if (!refundedItems.length) reply = "No refunds found for your recent order.";
          else {
            reply = await this.safeAI(this.buildPrompt(`
Explain the refund status to the user:

Order Number: ${order.orderNumber}

Refund Details:
${refundedItems.map(i => `- ${i.name} : ${i.refundStatus} (₹${i.refundAmount})`).join("\n")}
`));
          }
        }
        break;
      }

      case "GREETING":
        reply = await this.safeAI(this.buildPrompt("User greeted you. Respond warmly and offer help."));
        break;

      case "HELP":
        reply = await this.safeAI(this.buildPrompt(`
Explain what you can help with:
- Track orders
- Order history
- Cancel items/orders
- Refund status
- Payment help
`));
        break;

      default:
        reply = await this.safeAI(this.buildPrompt(`Answer the user query:\n${message}`));
    }

    await Chat.create({ userId, sender: "bot", message: reply });
    return reply;
  }

  static async getChatHistory(userId) {
    const chats = await Chat.find({ userId }).sort({ createdAt: 1 }).lean();
    const grouped = {};
    chats.forEach(chat => {
      const date = new Date(chat.createdAt).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push({ text: chat.message, createdAt: chat.createdAt, type: chat.sender });
    });
    return grouped;
  }

  static async clearChat(userId) {
    await Chat.deleteMany({ userId });
    return "Chat cleared successfully";
  }
}

module.exports = ChatService;
