



import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addMessage,
  fetchHistory,
} from "../../../Redux/slices/userChatSlice";
import { listenMessages, sendMessage } from "../../../utils/socket";

const ChatMessage = memo(({ msg, isUser, formatTime }) => {
  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          group relative
          max-w-[88%] sm:max-w-[78%] md:max-w-[68%] lg:max-w-[56%]
          px-4 py-3
          rounded-3xl
          break-words
          shadow-sm
          transition-all duration-200
          ${
            isUser
              ? "bg-primary text-white rounded-br-md"
              : "bg-white text-text-primary rounded-bl-md border border-gray-100"
          }
        `}
      >
        <div
          className={`text-[11px] font-medium mb-1 ${
            isUser ? "text-white/70" : "text-text-muted"
          }`}
        >
          {isUser ? "You" : "Support"}
        </div>

        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {msg.text}
        </p>

        <div
          className={`mt-2 flex items-center justify-end text-[11px] ${
            isUser ? "text-white/70" : "text-gray-400"
          }`}
        >
          {formatTime(msg.createdAt)}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

const DateSeparator = memo(({ label }) => {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="sticky top-0 z-10">
        <span className="rounded-full border border-gray-50 bg-white/90 px-4 py-1 text-[11px] font-medium text-text-muted shadow-md backdrop-blur">
          {label}
        </span>
      </div>
    </div>
  );
});

DateSeparator.displayName = "DateSeparator";

const EmptyState = memo(() => {
  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-soft">
          <FaPaperPlane className="text-xl text-primary" />
        </div>

        <h3 className="text-lg font-semibold text-text-primary">
          No messages yet
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Start a conversation with Buyora Support.
        </p>
      </div>
    </div>
  );
});

EmptyState.displayName = "EmptyState";

const LoadingState = memo(() => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex items-center gap-3 text-text-muted">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium">Loading messages...</span>
      </div>
    </div>
  );
});

LoadingState.displayName = "LoadingState";

const UserRealtimeChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { messages = [], loading } = useSelector(
    (state) => state.userChat
  );

  const [message, setMessage] = useState("");

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

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
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;

    sendMessage({
      type: "send_message",
      text: message.trim(),
    });

    setMessage("");
  }, [message]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const formatTime = useCallback((dateStr) => {
    const d = new Date(dateStr);

    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatChatDate = useCallback((dateStr) => {
    const msgDate = new Date(dateStr);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const msgDay = new Date(msgDate);
    msgDay.setHours(0, 0, 0, 0);

    if (msgDay.getTime() === today.getTime()) {
      return "Today";
    }

    if (msgDay.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }

    return msgDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const getDateKey = useCallback((dateStr) => {
    const d = new Date(dateStr);

    d.setHours(0, 0, 0, 0);

    return d.getTime();
  }, []);

  const groupedMessages = useMemo(() => {
    return messages.reduce((acc, msg) => {
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
  }, [messages, formatChatDate, getDateKey]);

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden bg-bg-main">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-primary shadow-md">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 active:scale-95"
              aria-label="Go back"
            >
              <IoChevronBack className="text-2xl" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-primary shadow-sm">
                B
              </div>

              <div className="flex flex-col">
                <h1 className="text-base font-semibold text-white sm:text-lg">
                  Buyora Support
                </h1>

                <p className="text-xs text-white/80">
                  Your Buyora Team
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-hidden pt-[76px]">
          <section
            className="
              flex-1 overflow-y-auto scroll-smooth
              px-3 py-3 sm:px-5
            "
            aria-label="Chat messages"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-1">
              {loading ? (
                <LoadingState />
              ) : messages.length === 0 ? (
                <EmptyState />
              ) : (
                Object.values(groupedMessages).map((group, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-8 pb-6"
                  >
                    <DateSeparator label={group.label} />

                    {group.messages.map((msg, i) => {
                      const isUser = msg.type === "user";

                      return (
                        <ChatMessage
                          key={`${msg.createdAt}-${i}`}
                          msg={msg}
                          isUser={isUser}
                          formatTime={formatTime}
                        />
                      );
                    })}
                  </div>
                ))
              )}

              <div ref={bottomRef} />
            </div>
          </section>

          <div className="border-t border-gray-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-5">
            <div className="mx-auto flex w-full max-w-5xl items-end gap-3">
              <div
                className="
                  flex flex-1 items-end rounded-3xl
                  border border-gray-200 bg-bg-soft
                  px-4 py-2
                  transition-all duration-200
                  focus-within:border-primary
                  focus-within:ring-4
                  focus-within:ring-primary/10
                "
              >
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  aria-label="Message input"
                  className="
                    max-h-[120px] min-h-[24px]
                    w-full resize-none overflow-y-auto
                    bg-transparent
                    text-[15px] text-text-primary
                    outline-none
                    placeholder:text-text-muted
                  "
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!message.trim()}
                aria-label="Send message"
                className={`
                  flex h-12 w-12 shrink-0 items-center justify-center rounded-full
                  transition-all duration-200
                  active:scale-95
                  ${
                    message.trim()
                      ? "bg-primary text-white shadow-md hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg"
                      : "cursor-not-allowed bg-bg-soft text-text-light"
                  }
                `}
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default UserRealtimeChat;
