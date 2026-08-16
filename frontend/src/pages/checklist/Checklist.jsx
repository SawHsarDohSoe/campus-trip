import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklistItems,
  getTrips,
  updateChecklistItem,
} from "../../api/authApi";

function Checklist() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [items, setItems] = useState([]);

  const [tripId, setTripId] = useState("");

  const [newItem, setNewItem] = useState("");

const [editingItemId, setEditingItemId] = useState(null);
const [editingLabel, setEditingLabel] = useState("");

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

  const completedCount = useMemo(
    () =>
      items.filter((item) => item.completed).length,
    [items]
  );

  const progress = items.length
    ? Math.round(
        (completedCount / items.length) * 100
      )
    : 0;

  useEffect(() => {
    const loadChecklist = async () => {
      try {
        const token =
          localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const tripsData = await getTrips(token);

        setTrips(tripsData.trips);

        if (tripsData.trips.length > 0) {
          const firstTrip = tripsData.trips[0];

          setTripId(firstTrip._id);

          const checklistData =
            await getChecklistItems(
              token,
              firstTrip._id
            );

          setItems(checklistData.items);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadChecklist();
  }, [navigate]);

  const handleTripChange = async (event) => {
    const selectedTripId = event.target.value;

    setTripId(selectedTripId);

    try {
      const token =
        localStorage.getItem("campusTripToken");

      const data = await getChecklistItems(
        token,
        selectedTripId
      );

      setItems(data.items);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleItem = async (item) => {
    try {
      const token =
        localStorage.getItem("campusTripToken");

      const data = await updateChecklistItem(
        item._id,
        {
          completed: !item.completed,
        },
        token
      );

      setItems((current) =>
        current.map((currentItem) =>
          currentItem._id === item._id
            ? data.item
            : currentItem
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const addItem = async (event) => {
    event.preventDefault();

    const label = newItem.trim();

    if (!label || !tripId) return;

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem("campusTripToken");

      const data = await createChecklistItem(
        {
          tripId,
          label,
        },
        token
      );

      setItems((current) => [
        ...current,
        data.item,
      ]);

      setNewItem("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (itemId) => {
    const confirmed = window.confirm(
      "Delete this checklist item?"
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("campusTripToken");

      await deleteChecklistItem(
        itemId,
        token
      );

      setItems((current) =>
        current.filter(
          (item) => item._id !== itemId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const startEdit = (item) => {
  setEditingItemId(item._id);
  setEditingLabel(item.label);
  setError("");
};

const cancelEdit = () => {
  setEditingItemId(null);
  setEditingLabel("");
};

const saveEdit = async (itemId) => {
  const label = editingLabel.trim();

  if (!label) {
    setError("Checklist item cannot be empty.");
    return;
  }

  try {
    setSaving(true);
    setError("");

    const token = localStorage.getItem("campusTripToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const data = await updateChecklistItem(
      itemId,
      { label },
      token
    );

    setItems((current) =>
      current.map((item) =>
        item._id === itemId
          ? data.item
          : item
      )
    );

    setEditingItemId(null);
    setEditingLabel("");
  } catch (error) {
    setError(error.message);
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">
            Loading checklist...
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
        <div>
          <p className="text-sm font-semibold text-blue-700">
            CampusTrip
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
            Packing Checklist
          </h1>

          <p className="mt-2 text-gray-500">
            Keep the essentials organized before your campus trip.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        {/* Trip selector */}
        {trips.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow-lg">

            <label className="mb-2 block font-medium text-gray-700">
              Select Trip
            </label>

            <select
              value={tripId}
              onChange={handleTripChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#1E3A8A] md:max-w-lg"
            >
              {trips.map((trip) => (
                <option
                  key={trip._id}
                  value={trip._id}
                >
                  {trip.title} — {trip.destination}
                </option>
              ))}
            </select>

          </section>
        )}

        {/* Progress + Add */}
        <section className="grid gap-6 lg:grid-cols-3">

          <div className="rounded-3xl bg-[#E5F6FD] p-7 shadow-lg lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <p className="font-medium text-gray-600">
                  Packing progress
                </p>

                <p className="mt-2 text-4xl font-bold text-[#1E3A8A]">
                  {progress}%
                </p>
              </div>

              <CheckCircle2
                className="text-[#1E3A8A]"
                size={42}
              />

            </div>

            <div className="mt-7 h-3 overflow-hidden rounded-full bg-white">

              <div
                className="h-full rounded-full bg-[#1E3A8A] transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-3 text-sm text-gray-600">
              {completedCount} of {items.length} items ready
            </p>

          </div>

          <form
            onSubmit={addItem}
            className="rounded-3xl bg-white p-6 shadow-lg"
          >

            <h2 className="text-xl font-bold text-[#1E3A8A]">
              Add an item
            </h2>

            <input
              required
              value={newItem}
              onChange={(event) =>
                setNewItem(event.target.value)
              }
              placeholder="e.g. Umbrella"
              className="mt-5 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
            />

            <button
              type="submit"
              disabled={saving || !tripId}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />

              {saving
                ? "Adding..."
                : "Add to checklist"}
            </button>

          </form>

        </section>

        {/* Checklist */}
        <section className="max-w-3xl rounded-3xl bg-white p-7 shadow-lg md:p-8">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A]">
                Your trip essentials
              </h2>

              <p className="mt-1 text-gray-500">
                Check items as you prepare.
              </p>
            </div>

            <CheckCircle2
              className="text-[#1E3A8A]"
              size={28}
            />

          </div>

          {items.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-[#E5F6FD] p-8 text-center">

              <p className="font-semibold text-gray-800">
                Your checklist is empty.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first item above.
              </p>

            </div>
          ) : (
            <div className="mt-6 divide-y divide-gray-100">

              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 py-4"
                >

                  <button
                    type="button"
                    onClick={() =>
                      toggleItem(item)
                    }
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                      item.completed
                        ? "border-[#1E3A8A] bg-[#1E3A8A] text-white"
                        : "border-gray-300 hover:border-[#1E3A8A]"
                    }`}
                    aria-label={`Mark ${item.label} as ${
                      item.completed
                        ? "incomplete"
                        : "complete"
                    }`}
                  >
                    {item.completed && "✓"}
                  </button>

                  {editingItemId === item._id ? (
  <div className="flex flex-1 items-center gap-2">
    <input
      type="text"
      value={editingLabel}
      onChange={(event) =>
        setEditingLabel(event.target.value)
      }
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          saveEdit(item._id);
        }

        if (event.key === "Escape") {
          cancelEdit();
        }
      }}
      autoFocus
      className="flex-1 rounded-xl border border-blue-300 px-3 py-2 text-gray-700 outline-none focus:border-[#1E3A8A]"
    />

    <button
      type="button"
      onClick={() => saveEdit(item._id)}
      disabled={saving}
      className="rounded-xl bg-[#1E3A8A] px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {saving ? "..." : "Save"}
    </button>

    <button
      type="button"
      onClick={cancelEdit}
      className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
    >
      Cancel
    </button>
  </div>
) : (
  <>
    <p
      className={`flex-1 ${
        item.completed
          ? "text-gray-400 line-through"
          : "text-gray-700"
      }`}
    >
      {item.label}
    </p>

    <div className="flex items-center gap-2">
      

      <div className="flex items-center gap-2">
  <button
    type="button"
    onClick={() => startEdit(item)}
    className="rounded-xl border border-blue-200 p-2 text-[#1E3A8A] hover:bg-blue-50"
    aria-label={`Edit ${item.label}`}
  >
    <Pencil size={17} />
  </button>

  <button
    type="button"
    onClick={() => deleteItem(item._id)}
    className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
    aria-label={`Delete ${item.label}`}
  >
    <Trash2 size={17} />
  </button>
</div>
    </div>
  </>
)}

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Checklist;
