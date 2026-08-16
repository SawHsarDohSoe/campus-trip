import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
  Wallet,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getTrips,
  updateExpense,
} from "../../api/authApi";

const currency = new Intl.NumberFormat("en-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

function Budget() {
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [formData, setFormData] = useState({
    tripId: "",
    name: "",
    category: "Transportation",
    amount: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBudget = async () => {
      try {
        const token = localStorage.getItem("campusTripToken");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const tripsData = await getTrips(token);

        setTrips(tripsData.trips);

        if (tripsData.trips.length > 0) {
          const firstTrip = tripsData.trips[0];

          setFormData((current) => ({
            ...current,
            tripId: firstTrip._id,
          }));

          const expensesData = await getExpenses(
            token,
            firstTrip._id
          );

          setExpenses(expensesData.expenses);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBudget();
  }, []);

  const selectedTrip = trips.find(
    (trip) => trip._id === formData.tripId
  );

  const totalBudget = selectedTrip?.budget ?? 0;

  const spent = useMemo(
    () =>
      expenses.reduce(
        (total, expense) => total + expense.amount,
        0
      ),
    [expenses]
  );

  const remaining = totalBudget - spent;

  const usage =
    totalBudget > 0
      ? Math.min((spent / totalBudget) * 100, 100)
      : 0;

  const handleTripChange = async (event) => {
    const tripId = event.target.value;

    setFormData((current) => ({
      ...current,
      tripId,
    }));

    try {
      const token = localStorage.getItem("campusTripToken");

      const data = await getExpenses(token, tripId);

      setExpenses(data.expenses);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

const handleEdit = (expense) => {
  setEditingExpense(expense);

  setFormData({
    tripId: expense.trip?._id || formData.tripId,
    name: expense.name || "",
    category: expense.category || "Other",
    amount: expense.amount ?? "",
  });

  setError("");
  setIsFormOpen(true);
};

 const handleSubmit = async (event) => {
  event.preventDefault();

  const amount = Number(formData.amount);

  if (
    !formData.tripId ||
    !formData.name.trim() ||
    !amount ||
    amount <= 0
  ) {
    return;
  }

  try {
    setSaving(true);
    setError("");

    const token = localStorage.getItem("campusTripToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      amount,
      date: editingExpense?.date || new Date().toISOString(),
    };

    if (editingExpense) {
      const data = await updateExpense(
        editingExpense._id,
        payload,
        token
      );

      setExpenses((current) =>
        current.map((expense) =>
          expense._id === editingExpense._id
            ? data.expense
            : expense
        )
      );
    } else {
      const data = await createExpense(
        {
          tripId: formData.tripId,
          ...payload,
        },
        token
      );

      setExpenses((current) => [
        data.expense,
        ...current,
      ]);
    }

    setFormData((current) => ({
      ...current,
      name: "",
      category: "Transportation",
      amount: "",
    }));

    setEditingExpense(null);
    setIsFormOpen(false);
  } catch (error) {
    setError(error.message);
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm(
      "Delete this expense?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("campusTripToken");

      await deleteExpense(expenseId, token);

      setExpenses((current) =>
        current.filter(
          (expense) => expense._id !== expenseId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">
            Loading budget...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-8 p-6 pt-20 md:p-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <p className="text-sm font-semibold text-blue-700">
              CampusTrip
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
              Trip Budget
            </h1>

            <p className="mt-2 text-gray-500">
              Track your trip spending and keep every expense on plan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            disabled={trips.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={20} />
            Add Expense
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        {/* Trip Selector */}
        {trips.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow-lg">

            <label className="mb-2 block font-medium text-gray-700">
              Select Trip
            </label>

            <select
              value={formData.tripId}
              onChange={handleTripChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#1E3A8A] md:max-w-lg"
            >
              {trips.map((trip) => (
                <option key={trip._id} value={trip._id}>
                  {trip.title} — {trip.destination}
                </option>
              ))}
            </select>

          </section>
        )}

        {/* Summary */}
        <section className="grid gap-6 lg:grid-cols-3">

          <div className="rounded-3xl bg-[#1E3A8A] p-7 text-white shadow-lg lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-blue-100">
                  Total trip budget
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {currency.format(totalBudget)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 p-4">
                <Wallet size={30} />
              </div>

            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#A8D6FF] transition-all"
                style={{ width: `${usage}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-sm text-blue-100">
              <span>{Math.round(usage)}% used</span>

              <span>
                {currency.format(spent)} spent
              </span>
            </div>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Remaining budget
            </p>

            <p
              className={`mt-2 text-4xl font-bold ${
                remaining >= 0
                  ? "text-[#1E3A8A]"
                  : "text-red-600"
              }`}
            >
              {currency.format(remaining)}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Available for the rest of the trip.
            </p>

          </div>

        </section>

        {/* Expenses */}
        <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A]">
                Recent expenses
              </h2>

              <p className="mt-1 text-gray-500">
                Expenses saved in your CampusTrip account.
              </p>
            </div>

            <ReceiptText
              className="text-[#1E3A8A]"
              size={28}
            />

          </div>

          <div className="mt-6 divide-y divide-gray-100">

            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {expense.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {expense.category} ·{" "}
                      {new Date(
                        expense.date
                      ).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    <p className="text-lg font-bold text-[#1E3A8A]">
                      {currency.format(expense.amount)}
                    </p>

                    <div className="flex items-center gap-2">
                       <button
                          type="button"
                          onClick={() => handleEdit(expense)}
                          className="rounded-xl border border-blue-200 p-3 text-[#1E3A8A] hover:bg-blue-50"
                          aria-label={`Edit ${expense.name}`}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(expense._id)}
                          className="rounded-xl border border-red-200 p-3 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${expense.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                  </div>

                </div>
              ))
            ) : (
              <div className="py-10 text-center">

                <ReceiptText
                  className="mx-auto text-gray-300"
                  size={40}
                />

                <p className="mt-4 text-gray-500">
                  No expenses yet.
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Add an expense to start tracking your spending.
                </p>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* Add Expense Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >

           <h2 className="text-2xl font-bold text-[#1E3A8A]">
            {editingExpense ? "Edit Expense" : "Add an Expense"}
          </h2>

            <p className="mt-2 text-sm text-gray-500">
              {editingExpense
                ? "Update this expense in your trip budget."
                : "This expense will be saved to your account."}
            </p>

            <div className="mt-6 space-y-4">

              <input
                required
                value={formData.name}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    name: event.target.value,
                  })
                }
                placeholder="Expense name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />

              <select
                value={formData.category}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    category: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
              >
                <option>Transportation</option>
                <option>Accommodation</option>
                <option>Food</option>
                <option>Activities</option>
                <option>Other</option>
              </select>

              <input
                required
                min="1"
                type="number"
                value={formData.amount}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    amount: event.target.value,
                  })
                }
                placeholder="Amount (THB)"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />

            </div>

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingExpense(null);
                  setFormData((current) => ({
                    ...current,
                    name: "",
                    category: "Transportation",
                    amount: "",
                  }));
                }}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingExpense
                    ? "Save Changes"
                    : "Save Expense"}
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}

export default Budget;