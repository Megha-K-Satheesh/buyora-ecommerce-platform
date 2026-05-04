

import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/ui/Footer";
import {
  addMessage,
  fetchHistory
} from "../../../Redux/slices/userChatSlice";
import { listenMessages, sendMessage } from "../../../utils/socket";

const UserRealtimeChat = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.userChat);
const navigate = useNavigate()
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);





useEffect(() => {
  const cleanup = listenMessages((msg) => {
    dispatch(addMessage(msg));
  });

  return cleanup;
}, [dispatch]);



  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage({
      type: "send_message",
      text: message,
    });



    setMessage("");
  };

 

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatChatDate = (dateStr) => {
    const msgDate = new Date(dateStr);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const msgDay = new Date(msgDate);
    msgDay.setHours(0, 0, 0, 0);

    if (msgDay.getTime() === today.getTime()) return "Today";
    if (msgDay.getTime() === yesterday.getTime()) return "Yesterday";

    return msgDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDateKey = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const key = getDateKey(msg.createdAt);

    if (!acc[key]) {
      acc[key] = {
        label: formatChatDate(msg.createdAt),
        messages: [],
      };
    }

    acc[key].messages.push(msg);

    return acc;
  }, {});

  return (
    <>
      {/* <Navbar /> */}

      <div className="h-screen w-full flex flex-col bg-bg-main ">

        <div className="flex  items-center justify-between px-4 py-3 bg-bg-muted">
        




<div className="fixed top-0 left-0 w-full z-50 flex items-center px-4 py-3 bg-primary shadow-sm border-b border-primary">

  <button
    onClick={() => navigate(-1)}
    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition"
  >
    <IoChevronBack className="text-2xl text-white" />
  </button>

  <span className="ml-2 text-lg md:text-2xl font-semibold text-white">
    Buyora Support
  </span>

</div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden mt-25">

          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 flex flex-col gap-2">

            {Object.values(groupedMessages).map((group, idx) => (
              <div key={idx} className="flex flex-col gap-2 lg:mx-60">

                <div className="flex justify-center my-2">
                  <span className="text-xs bg-bg-muted px-3 py-1 rounded-full text-text-muted ">
                    {group.label}
                  </span>
                </div>

                {group.messages.map((msg, i) => {
                  const isUser = msg.type === "user";

                  return (
                    <div
                      key={i}
                      className={`flex w-full ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          max-w-[85%] sm:max-w-[70%]
                          px-3 sm:px-4 py-2 mt-5
                          text-[15px]
                          shadow-sm break-words

                          ${
                            isUser
                              ? "bg-bg-soft rounded-l-2xl rounded-tr-2xl text-text-primary"
                              : "bg-white rounded-r-2xl rounded-tl-2xl text-text-secondary"
                          }
                        `}
                      >
                        <div className="text-[11px] text-text-muted mb-1">
                          {isUser ? "You" : "Admin"}
                        </div>

                        <div className="text-[15px] leading-snug">
                          {msg.text}
                        </div>

                        <div className="text-[10px] text-gray-400 mt-1 flex justify-end gap-2">
                          <span>{formatTime(msg.createdAt)}</span>

                         
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          <div className="shrink-0 bg-bg-main px-2 sm:px-3 py-2 flex justify-center gap-2">

          
<div className="w-[70%] mb-6 sm:w-[80%] md:w-[75%] bg-bg-soft rounded-full px-3 py-2 flex justify-center">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message"
                className="flex-1 outline-none text-[15px] text-text-primary bg-transparent"
              />

            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`
                w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition
                ${
                  message.trim()
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "bg-bg-soft text-text-light cursor-not-allowed"
                }
              `}
            >
               <FaPaperPlane size={16} />
            </button>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserRealtimeChat;


