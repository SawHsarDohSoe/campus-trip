import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ChevronDown,
  Check,
  MoreVertical,
  Plus,
  Trash2,
  CheckSquare,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import {
  getTrips,
  getChecklistItems,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../../api/authApi";

export default function Checklist() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [newItemText, setNewItemText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [, setLoading] = useState(true);

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
          const requestedTrip = location.state?.tripId;
          setSelectedTripId(
            data.trips.some((trip) => trip._id === requestedTrip)
              ? requestedTrip
              : data.trips[0]._id
          );
        }
      } catch (err) {
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [navigate, location.state?.tripId]);

  const fetchItems = async () => {
    const token = localStorage.getItem("campusTripToken");
    if (!token || !selectedTripId) return;

    try {
      const data = await getChecklistItems(token, selectedTripId);
      if (data?.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Failed to load checklist:", err);
    }
  };

  useEffect(() => {
    if (!selectedTripId) {
      setItems([]);
      return;
    }
    fetchItems();
  }, [selectedTripId]);

  const toggleItem = async (item) => {
    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    const updated = !item.completed;
    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i._id === item._id ? { ...i, completed: updated } : i))
    );

    try {
      await updateChecklistItem(item._id, { completed: updated }, token);
    } catch (err) {
      console.error("Failed to update item:", err);
      await fetchItems();
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim() || !selectedTripId) return;

    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    const task = newItemText.trim();
    setNewItemText("");

    try {
      await createChecklistItem(
        {
          tripId: selectedTripId,
          label: task,
        },
        token
      );
      await fetchItems();
    } catch (err) {
      alert(err.message || "Failed to create item.");
    }
  };

  const handleDeleteItem = async (id) => {
    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    try {
      await deleteChecklistItem(id, token);
      setItems((prev) => prev.filter((i) => i._id !== id));
      setActiveMenuId(null);
    } catch (err) {
      alert(err.message || "Failed to delete item.");
    }
  };

  const todoCount = useMemo(() => items.filter((i) => !i.completed).length, [items]);
  const doneCount = useMemo(() => items.filter((i) => i.completed).length, [items]);

  const filteredItems = useMemo(() => {
    if (filter === "To Do") return items.filter((i) => !i.completed);
    if (filter === "Done") return items.filter((i) => i.completed);
    return items;
  }, [items, filter]);

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/50">
      <MobileHeader title="Checklist" showBack backTo={location.state?.from || "/dashboard"} />

      <div className="px-4 sm:px-6 py-4 space-y-4">
        {/* Trip Switcher Dropdown */}
        {trips.length > 0 ? (
          <div className="relative">
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl py-2.5 px-3.5 appearance-none focus:outline-none focus:border-blue-600 shadow-sm"
            >
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-slate-100 text-center">
            <CheckSquare size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">No Trips Created</p>
            <p className="text-[11px] text-slate-400 mt-1">Create a trip to manage your checklists.</p>
            <Link
              to="/trips/create"
              className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Create Trip
            </Link>
          </div>
        )}

        {/* Filter Chips: All, To Do, Done */}
        {selectedTripId && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === "All"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All ({items.length})
            </button>

            <button
              onClick={() => setFilter("To Do")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === "To Do"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              To Do ({todoCount})
            </button>

            <button
              onClick={() => setFilter("Done")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === "Done"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Done ({doneCount})
            </button>
          </div>
        )}

        {/* Add Item Quick Input */}
        {selectedTripId && (
          <form onSubmit={handleAddItem} className="relative flex items-center">
            <input
              type="text"
              placeholder="Add new checklist item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
              aria-label="Add item"
            >
              <Plus size={15} strokeWidth={2.5} />
            </button>
          </form>
        )}

        {/* Items List */}
        {selectedTripId && (
          <div className="space-y-2.5">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400">No items in this checklist filter.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition"
                >
                  <div
                    onClick={() => toggleItem(item)}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer select-none"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                        item.completed
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-300 bg-slate-50 hover:border-blue-400"
                      }`}
                    >
                      {item.completed && <Check size={13} strokeWidth={3} />}
                    </div>

                    <span
                      className={`text-xs font-semibold transition ${
                        item.completed
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      }`}
                    >
                      {item.task || item.name}
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === item._id ? null : item._id)
                      }
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      aria-label="Item options"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {activeMenuId === item._id && (
                      <div className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30">
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </MobileShell>
  );
}
