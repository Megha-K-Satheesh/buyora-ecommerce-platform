



import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiSend, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  addUserMessage,
  clearChatFromServer,
  fetchHistory,
  sendMessage
} from "../../Redux/slices/chatBotSlice";
import { showError, showSuccess } from "./Toastify";

const ChatWidget = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chatBot);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  const toggleChat = () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please login to use Nyra AI Chatbot"
      });
      return;
    }

    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      dispatch(fetchHistory());
    }
  }, [isOpen, dispatch, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        text: "Please login to continue chatting with Nyra"
      });
      return;
    }

    if (!input.trim()) return;

    dispatch(addUserMessage(input));
    dispatch(sendMessage(input));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleClearChat = async () => {
    if (!isAuthenticated) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to clear the chat history?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(clearChatFromServer()).unwrap();
        showSuccess("Chat cleared successfully");
      } catch (err) {
        showError("Failed to clear chat");
      }
    }
  };

  const formatChatDate = (dateStr) => {
    const msgDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();

    today.setHours(0, 0, 0, 0);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const msgDay = new Date(msgDate);
    msgDay.setHours(0, 0, 0, 0);

    if (msgDay.getTime() === today.getTime()) return "Today";
    if (msgDay.getTime() === yesterday.getTime()) return "Yesterday";

    return msgDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = new Date(msg.createdAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-pink-700 transition z-50"
      >
        {isOpen ? <FiX size={26} /> : <FiMessageCircle size={26} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-white rounded-2xl z-50 shadow-2xl flex flex-col overflow-hidden">

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-600 font-bold">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base">Nyra</span>
                <span className="text-xs text-pink-100">
                  Your Buyora Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleClearChat}>
                <FiTrash2 size={18} />
              </button>
              <button onClick={toggleChat}>
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* GUEST MESSAGE UI */}
          {!isAuthenticated ? (
            <div className="flex flex-1 items-center justify-center text-center p-6 text-gray-600">
              Please login to use Nyra AI Chatbot
            </div>
          ) : (
            <>
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-3">

                {Object.keys(groupedMessages).map((dateKey) => (
                  <div key={dateKey}>
                    <div className="flex justify-center my-2 text-xs text-gray-500">
                      {formatChatDate(dateKey)}
                    </div>

                    {groupedMessages[dateKey].map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-xl max-w-[75%] text-sm shadow ${
                            msg.type === "user"
                              ? "bg-pink-100 text-black"
                              : "bg-white text-black"
                          }`}
                        >
                          <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                          <div className="text-[10px] text-gray-500 text-right mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-xl text-xs shadow bg-white">
                      Nyra is typing...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef}></div>
              </div>

              <div className="p-3 flex items-center bg-gray-50">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message"
                  className="flex-1 p-3 rounded-full focus:outline-none text-sm bg-white"
                />
                <button
                  onClick={handleSend}
                  className="ml-2 bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition"
                >
                  <FiSend />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
