



import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import {
  addIncomingMessage,
  fetchChatByUser
} from "../../../Redux/slices/admin/adminChatSlice";
import {
  listenAdminMessages,
  sendAdminReply,
} from "../../../utils/adminSocket";

const AdminRealtimeChat = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.adminChat);

  const [reply, setReply] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (userId) dispatch(fetchChatByUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const cleanup = listenAdminMessages((msg) => {
      if (!msg) return;

     

      if (msg.userId !== userId) return;

      dispatch(
        addIncomingMessage({
          type: msg.senderRole,
          text: msg.text,
          createdAt: msg.createdAt,
        })
      );
    });

    return cleanup;
  }, [dispatch, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  const handleReply = () => {
    if (!reply.trim()) return;

    sendAdminReply({
      userId,
      text: reply,
    });

    setReply("");
  };



  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
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

  const groupedMessages = activeChat.reduce((acc, msg) => {
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
    <div className="h-screen w-full flex flex-col bg-bg-main">
      <AdminOutletHead heading={"USER CHAT"} />


      <div className="flex-1 flex flex-col overflow-hidden ">
        <div className="flex-1 overflow-y-auto  sm:px-4 py-3 flex flex-col gap-2  ">
          {Object.values(groupedMessages).map((group, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="flex justify-center my-2">
                <span className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600">
                  {group.label}
                </span>
              </div>

              {group.messages.map((m, i) => {
                const isAdmin = m.type === "admin";

                return (
                  <div
                    key={i}
                    className={`flex w-full px-40 ${
                      isAdmin ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 text-[15px] shadow-sm break-words ${
                        isAdmin
                          ? "bg-bg-soft rounded-l-2xl rounded-tr-2xl text-text-primary"
                          : "bg-white rounded-r-2xl rounded-tl-2xl text-text-secondary"
                      }`}
                    >
                      <div className="text-[11px] text-text-muted mb-1">
                        {isAdmin ? "You" : "User"}
                      </div>

                      <div className="text-[15px] leading-snug">
                        {m.text}
                      </div>

                      <div className="text-[10px] text-gray-400 mt-1 text-right">
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        <div className="shrink-0  px-2 sm:px-3 py-2 flex justify-center gap-2">
         
          <div className="w-[70%] sm:w-[80%] md:w-[75%] bg-bg-soft rounded-full px-3 py-2 flex justify-center">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message"
              className="flex-1 outline-none text-[15px] text-text-primary"
            />
          </div>

          <button
            onClick={handleReply}
            disabled={!reply.trim()}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition ${
              reply.trim()
                ? "bg-primary text-white hover:bg-primary-hover"
                : "bg-bg-soft text-text-light cursor-not-allowed"
            }`}
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRealtimeChat;



