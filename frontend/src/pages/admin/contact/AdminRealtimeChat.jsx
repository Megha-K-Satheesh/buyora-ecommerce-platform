

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

      <div className="flex-1 flex flex-col overflow-hidden bg-bg-soft/30">

        <div className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-10 py-4 flex flex-col gap-3">

          {Object.values(groupedMessages).map((group, idx) => (
            <div key={idx} className="flex flex-col gap-7">

              <div className="flex justify-center my-2">
                <span className="text-xs px-3 py-1 rounded-full  text-text-secondary shadow-sm">
                  {group.label}
                </span>
              </div>

              {group.messages.map((m, i) => {
                const isAdmin = m.type === "admin";

                return (
                  <div
                    key={i}
                    className={`flex w-full ${
                      isAdmin ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[65%] px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md lg:mx-20 break-words ${
                        isAdmin
                          ? "bg-bg-soft text-text-primary rounded-br-sm "
                          : "bg-bg-main text-text-secondary rounded-bl-sm"
                      }`}
                    >

                      <div className="text-[11px] font-medium text-text-muted mb-1 flex justify-between items-center">
                        <span className="px-2 py-[2px] rounded-full bg-primary/10 text-primary text-[10px]">
                          {isAdmin ? "Admin" : "User"}
                        </span>
                      </div>

                      <div className="text-[14px] leading-relaxed">
                        {m.text}
                      </div>

                      <div className="text-[10px] text-text-muted mt-2 text-right">
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

        <div className="shrink-0 px-3 sm:px-6 py-4 bg-bg-main border-t border-border-light flex justify-center">

          <div className="w-full max-w-5xl flex items-center gap-3">

            <div className="flex-1 bg-bg-soft border border-border-light rounded-full px-4 py-3 flex items-center focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all">

              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none text-lg text-text-primary placeholder:text-text-muted"
              />

            </div>

            <button
              onClick={handleReply}
              disabled={!reply.trim()}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                reply.trim()
                  ? "bg-primary text-white hover:scale-105 shadow-md"
                  : "bg-bg-soft text-text-muted cursor-not-allowed"
              }`}
            >
              <FaPaperPlane size={14} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminRealtimeChat;

