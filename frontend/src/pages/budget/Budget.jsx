import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Menu,
  ChevronDown,
  Plus,
  Train,
  Hotel,
  Utensils,
  Receipt,
  X,
  Trash2,
  Wallet,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import {
  getTrips,
  getExpenses,
  createExpense,
  deleteExpense,
} from "../../api/authApi";

export default function Budget() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "Transportation",
  });

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
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [navigate]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("campusTripToken");
    if (!token || !selectedTripId) return;

    try {
      const data = await getExpenses(token, selectedTripId);
      if (data?.expenses) {
        setExpenses(data.expenses);
      }
    } catch (err) {
      console.error("Failed to load expenses:", err);
    }
  };

  useEffect(() => {
    if (!selectedTripId) {
      setExpenses([]);
      return;
    }
    fetchExpenses();
  }, [selectedTripId]);

  const activeTrip = trips.find((t) => t._id === selectedTripId);
  const totalBudget = activeTrip?.budget || 0;

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const percentSpent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount || !selectedTripId) return;

    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    try {
      await createExpense(
        {
          tripId: selectedTripId,
          name: newExpense.name,
          amount: Number(newExpense.amount),
          category: newExpense.category,
        },
        token
      );
      setNewExpense({ name: "", amount: "", category: "Transportation" });
      setShowModal(false);
      await fetchExpenses();
    } catch (err) {
      alert(err.message || "Failed to add expense.");
    }
  };

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    try {
      await deleteExpense(id, token);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete expense.");
    }
  };

  const getExpenseIcon = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("hotel") || cat.includes("accom")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Hotel size={18} />
        </div>
      );
    }
    if (cat.includes("food") || cat.includes("dining")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Utensils size={18} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        <Train size={18} />
      </div>
    );
  };

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/50">
      {/* Top Header */}
      <div className="bg-white px-5 pt-3 pb-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-700 transition"
            aria-label="Back"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Budget</h1>
        </div>

        <button className="text-slate-500 hover:text-slate-800 p-1.5">
          <Menu size={18} />
        </button>
      </div>

      <div className="px-5 py-4 space-y-4">
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
            <Wallet size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">No Trips Created</p>
            <p className="text-[11px] text-slate-400 mt-1">Create a trip to manage your travel budget.</p>
            <Link
              to="/trips/create"
              className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Create Trip
            </Link>
          </div>
        )}

        {/* Total Budget Card */}
        {selectedTripId && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Budget</span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                {formatCurrency(totalBudget)}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Expenses
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {formatCurrency(totalSpent)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Remaining
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {formatCurrency(remainingBudget)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${percentSpent}%` }}
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{percentSpent}% spent</span>
                <span>{100 - percentSpent}% left</span>
              </div>
            </div>
          </div>
        )}

        {/* Expenses List Section */}
        {selectedTripId && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Expenses List</h3>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-sm shadow-blue-500/30 transition active:scale-95"
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {expenses.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400">No expenses recorded yet.</p>
                </div>
              ) : (
                expenses.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition group"
                  >
                    <div className="flex items-center gap-3">
                      {getExpenseIcon(item.category)}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.category || "Expense"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(item.amount)}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(item._id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition p-1"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Expense</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Expense Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Train Ticket"
                  value={newExpense.name}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Amount (THB)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 800"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Transportation">Transportation</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Food">Food & Dining</option>
                  <option value="Activity">Activity / Tickets</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MobileShell>
  );
}