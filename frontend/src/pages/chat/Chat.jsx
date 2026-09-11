import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Send, ChevronDown, MessageSquare, Plus } from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import {
  getTrips,
  getDiscussionMessages,
  createDiscussionMessage,
} from "../../api/authApi";

export default function Chat() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("campusTripCurrentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const loadTrips = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const data = await getTrips(token);
        if (data?.trips?.length) {
          setTrips(data.trips);
          setSelectedTripId(data.trips[0]._id);
        }
      } catch (err) {
        console.error("Failed to load trips:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [navigate]);

  const fetchMessages = async () => {
    const token = localStorage.getItem("campusTripToken");
    if (!token || !selectedTripId) return;

    try {
      const data = await getDiscussionMessages(selectedTripId, token);
      if (data?.messages) {
        const currentUserId = user?._id || user?.id;
        const mapped = data.messages.map((m) => {
          const isMe =
            m.user?._id === currentUserId ||
            m.user?.email === user?.email ||
            m.user?.name === user?.name;
          return {
            _id: m._id,
            sender: m.user?.name || "Member",
            senderAvatar: (m.user?.name || "M")[0].toUpperCase(),
            text: m.message,
            time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe,
          };
        });
        setMessages(mapped);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (!selectedTripId) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [selectedTripId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSending || !selectedTripId) return;

    const token = localStorage.getItem("campusTripToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const sentText = text.trim();
    setText("");

    // Optimistic UI update
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      sender: user?.name || "You",
      senderAvatar: (user?.name || "Y")[0].toUpperCase(),
      text: sentText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      setIsSending(true);
      await createDiscussionMessage(selectedTripId, sentText, token);
      await fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50 flex flex-col h-full">
      <MobileHeader showBack={false} />

      <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold leading-tight text-slate-900">Group Chat</h1>
            {trips.length > 0 ? (
              <div className="relative inline-block max-w-full">
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="text-[11px] font-medium text-blue-600 bg-transparent pr-4 truncate border-none outline-none appearance-none cursor-pointer"
              >
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={11}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none"
              />
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">No active trips</p>
            )}
          </div>
          {selectedTripId && (
            <div className="flex shrink-0 items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              <span className="ml-1 text-[10px] font-medium text-slate-400">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-24 px-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <MessageSquare size={26} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Trips Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Create a trip or join one with an invite code to start group discussions.
            </p>
            <Link
              to="/trips/create"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-md"
            >
              <Plus size={14} />
              <span>Create a Trip</span>
            </Link>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
              <MessageSquare size={22} />
            </div>
            <p className="text-xs font-semibold text-slate-700">No messages yet</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Send the first message to kick off the trip discussion!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                msg.isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!msg.isMe && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 mb-1 shadow-xs">
                  {msg.senderAvatar}
                </div>
              )}

              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 shadow-xs text-xs ${
                  msg.isMe
                    ? "bg-blue-600 text-white rounded-br-xs"
                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-xs"
                }`}
              >
                {!msg.isMe && (
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">
                    {msg.sender}
                  </span>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1 ${
                    msg.isMe ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer Bar */}
      {selectedTripId && (
        <div className="bg-white border-t border-slate-100 px-3 py-2.5 sticky bottom-0 z-20 shadow-xs">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-2 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 transition"
            />
            <button
              type="submit"
              disabled={!text.trim() || isSending}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition active:scale-95 disabled:opacity-40 shadow-sm shadow-blue-500/25 shrink-0"
              aria-label="Send message"
            >
              <Send size={15} className="transform -rotate-12 translate-x-0.5" />
            </button>
          </form>
        </div>
      )}
    </MobileShell>
  );
}
