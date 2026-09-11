import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Check,
  Clock,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  getPolls,
  createPoll,
  deletePoll,
  updatePoll,
  votePoll,
  closePoll,
} from "../../api/pollApi";

function TripPolls({ tripId, isOwner, tripStatus }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");
  const [editingPollId, setEditingPollId] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editOptions, setEditOptions] = useState([]);
  const [editExpiresAt, setEditExpiresAt] = useState("");

  const token = localStorage.getItem("campusTripToken");

  const isTripClosed =
    tripStatus === "Completed" ||
    tripStatus === "Cancelled";

  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Please log in again.");
        return;
      }

      const data = await getPolls(token, tripId);

      setPolls(data.polls || []);
    } catch (err) {
      setError(err.message || "Unable to load polls.");
    } finally {
      setLoading(false);
    }
  }, [token, tripId]);

  useEffect(() => {
    if (tripId) {
      loadPolls();
    }
  }, [tripId, loadPolls]);

  const addOption = () => {
    if (options.length >= 6) return;

    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;

    setOptions(
      options.filter((_, optionIndex) => optionIndex !== index)
    );
  };

  const updateOption = (index, value) => {
    setOptions(
      options.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", ""]);
    setExpiresAt("");
    setShowCreate(false);
  };

  const handleCreatePoll = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanedOptions = options
      .map((option) => option.trim())
      .filter(Boolean);

    if (!question.trim()) {
      setError("Please enter a poll question.");
      return;
    }

    if (cleanedOptions.length < 2) {
      setError("Please provide at least 2 options.");
      return;
    }

    try {
      const data = await createPoll(token, tripId, {
        question: question.trim(),
        options: cleanedOptions,
        expiresAt: expiresAt || null,
      });

      setPolls((current) => [data.poll, ...current]);

      resetForm();

      setMessage("Poll created successfully.");
    } catch (err) {
      setError(err.message || "Unable to create poll.");
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      setError("");
      setMessage("");

      const data = await votePoll(
        token,
        tripId,
        pollId,
        optionId
      );

      setPolls((current) =>
        current.map((poll) =>
          poll._id === pollId ? data.poll : poll
        )
      );

      setMessage(data.message || "Your vote has been recorded.");
    } catch (err) {
      setError(err.message || "Unable to vote.");
    }
  };

  const startEditing = (poll) => {
    setEditingPollId(poll._id);
    setEditQuestion(poll.question);
    setEditOptions(poll.options.map((option) => option.text));
    setEditExpiresAt(
      poll.expiresAt ? new Date(poll.expiresAt).toISOString().slice(0, 16) : ""
    );
    setError("");
    setMessage("");
  };

  const handleUpdatePoll = async (event, pollId) => {
    event.preventDefault();
    const cleanedOptions = editOptions.map((option) => option.trim()).filter(Boolean);
    if (!editQuestion.trim() || cleanedOptions.length < 2) {
      setError("Enter a question and at least 2 options.");
      return;
    }

    try {
      const data = await updatePoll(token, tripId, pollId, {
        question: editQuestion.trim(),
        options: cleanedOptions,
        expiresAt: editExpiresAt || null,
      });
      setPolls((current) =>
        current.map((poll) => (poll._id === pollId ? data.poll : poll))
      );
      setEditingPollId("");
      setMessage(data.message || "Poll updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update poll.");
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm("Delete this poll and all of its votes?")) return;
    try {
      await deletePoll(token, tripId, pollId);
      setPolls((current) => current.filter((poll) => poll._id !== pollId));
      if (editingPollId === pollId) setEditingPollId("");
      setMessage("Poll deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete poll.");
    }
  };

  const handleClosePoll = async (pollId) => {
    try {
      setError("");
      setMessage("");

      const data = await closePoll(
        token,
        tripId,
        pollId
      );

      setPolls((current) =>
        current.map((poll) =>
          poll._id === pollId ? data.poll : poll
        )
      );

      setMessage("Poll closed successfully.");
    } catch (err) {
      setError(err.message || "Unable to close poll.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">
          Loading polls...
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3
              size={22}
              className="text-[#1E3A8A]"
            />

            <h2 className="text-xl font-bold text-gray-800">
              Trip Polls
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Let trip members vote on important decisions.
          </p>
        </div>

        {isOwner && !isTripClosed && (
          <button
            type="button"
            onClick={() => {
              setShowCreate(true);
              setError("");
              setMessage("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800"
          >
            <Plus size={18} />
            Create Poll
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Create Poll */}
      {showCreate && (
        <div className="mt-6 rounded-2xl border bg-blue-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">
              Create a Poll
            </h3>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-gray-500 hover:bg-white"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={handleCreatePoll}
            className="space-y-4"
          >
            {/* Question */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Question
              </label>

              <input
                type="text"
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                placeholder="Where should we eat dinner?"
                maxLength={200}
                className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Options */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Options
              </label>

              <div className="space-y-2">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex w-full min-w-0 gap-2"
                  >
                    <input
                      type="text"
                      value={option}
                      onChange={(event) =>
                        updateOption(
                          index,
                          event.target.value
                        )
                      }
                      placeholder={`Option ${index + 1}`}
                      maxLength={120}
                      className="min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
                    />

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeOption(index)
                        }
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 hover:bg-red-50"
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
                >
                  + Add option
                </button>
              )}
            </div>

            {/* Expiration */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Expiration
              </label>

              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(event) =>
                  setExpiresAt(event.target.value)
                }
                className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 font-semibold text-white hover:bg-blue-800"
              >
                Create Poll
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-white px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Poll List */}
      <div className="mt-6 space-y-5">
        {polls.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <BarChart3
              size={32}
              className="mx-auto text-gray-400"
            />

            <p className="mt-3 font-semibold text-gray-600">
              No polls yet
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Create a poll to let members vote.
            </p>
          </div>
        ) : (
          polls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (total, option) =>
                total + (option.votes || 0),
              0
            );

            const isExpired =
              poll.expiresAt &&
              new Date(poll.expiresAt) <= new Date();

            const isClosed =
              poll.status === "Closed" || isExpired;

            return (
              <div
                key={poll._id}
                className="rounded-2xl border p-5"
              >
                {/* Poll title */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {poll.question}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BarChart3 size={14} />
                        {totalVotes}{" "}
                        {totalVotes === 1
                          ? "vote"
                          : "votes"}
                      </span>

                      {poll.expiresAt && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {isExpired
                            ? "Expired"
                            : new Date(
                                poll.expiresAt
                              ).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isClosed
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isClosed ? "Closed" : "Open"}
                    </span>
                    {isOwner && !isClosed && (
                      <button
                        type="button"
                        onClick={() => startEditing(poll)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        aria-label="Edit poll"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => handleDeletePoll(poll._id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        aria-label="Delete poll"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {editingPollId === poll._id && (
                  <form
                    onSubmit={(event) => handleUpdatePoll(event, poll._id)}
                    className="mt-4 space-y-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 sm:p-4"
                  >
                    <input
                      value={editQuestion}
                      onChange={(event) => setEditQuestion(event.target.value)}
                      maxLength={200}
                      className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      aria-label="Poll question"
                    />
                    <div className="space-y-2">
                      {editOptions.map((option, index) => (
                        <div key={index} className="flex w-full min-w-0 gap-2">
                          <input
                            value={option}
                            onChange={(event) =>
                              setEditOptions((current) =>
                                current.map((value, optionIndex) =>
                                  optionIndex === index ? event.target.value : value
                                )
                              )
                            }
                            maxLength={120}
                            className="min-w-0 flex-1 rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            aria-label={`Poll option ${index + 1}`}
                          />
                          {editOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                setEditOptions((current) =>
                                  current.filter((_, optionIndex) => optionIndex !== index)
                                )
                              }
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500"
                              aria-label={`Remove poll option ${index + 1}`}
                            >
                              <X size={17} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {editOptions.length < 6 && (
                      <button
                        type="button"
                        onClick={() => setEditOptions((current) => [...current, ""])}
                        className="text-xs font-semibold text-blue-600"
                      >
                        + Add option
                      </button>
                    )}
                    <input
                      type="datetime-local"
                      value={editExpiresAt}
                      onChange={(event) => setEditExpiresAt(event.target.value)}
                      className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      aria-label="Poll expiration"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white">
                        Save changes
                      </button>
                      <button type="button" onClick={() => setEditingPollId("")} className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-600">
                        Cancel
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-700">Editing options resets existing votes.</p>
                  </form>
                )}

                {/* Options */}
                <div className="mt-5 space-y-3">
                  {poll.options.map((option) => {
                    const percentage =
                      totalVotes > 0
                        ? Math.round(
                            (option.votes /
                              totalVotes) *
                              100
                          )
                        : 0;
                    const isSelected = poll.selectedOptionId === option._id;

                    return (
                      <div key={option._id}>
                        <button
                          type="button"
                          disabled={
                            isClosed || isTripClosed
                          }
                          onClick={() =>
                            handleVote(
                              poll._id,
                              option._id
                            )
                          }
                          aria-pressed={isSelected}
                          className={`relative w-full overflow-hidden rounded-xl border p-3 text-left transition ${
                            isClosed ||
                            isTripClosed
                              ? "cursor-not-allowed opacity-70"
                              : isSelected
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                : "hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          <div
                            className="absolute inset-y-0 left-0 bg-blue-50"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                          <div className="relative flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 font-medium text-gray-700">
                              {isSelected && <Check size={15} className="text-blue-600" />}
                              {option.text}
                            </span>

                            <span className="font-semibold text-gray-600">
                              {option.votes}{" "}
                              ({percentage}%)
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Owner close button */}
                {isOwner &&
                  !isClosed &&
                  !isTripClosed && (
                    <button
                      type="button"
                      onClick={() =>
                        handleClosePoll(poll._id)
                      }
                      className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline"
                    >
                      <Check size={16} />
                      Close Poll
                    </button>
                  )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default TripPolls;
