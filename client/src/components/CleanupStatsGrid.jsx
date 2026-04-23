import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString();
};

export default function CleanupStatsGrid() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/cleanup-events`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const summary = useMemo(() => {
    const totalEvents = events.length;
    const totalKg = events.reduce(
      (acc, event) => acc + Number(event.totalKgCollected || 0),
      0
    );
    const uniqueLocations = new Set(events.map((event) => event.location)).size;

    return {
      totalEvents,
      totalKg,
      uniqueLocations
    };
  }, [events]);

  if (loading) {
    return (
      <div className="rounded-xl border border-amber-100 bg-white p-6 text-slate-600">
        Loading cleanup stats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Events</p>
          <h3 className="mt-1 text-3xl font-bold text-slate-800">{summary.totalEvents}</h3>
        </article>

        <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Plastic Collected</p>
          <h3 className="mt-1 text-3xl font-bold text-slate-800">
            {summary.totalKg.toFixed(1)} kg
          </h3>
        </article>

        <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Locations</p>
          <h3 className="mt-1 text-3xl font-bold text-slate-800">
            {summary.uniqueLocations}
          </h3>
        </article>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <article
            key={event._id}
            className="rounded-xl border border-amber-100 bg-amber-50 p-5"
          >
            <p className="text-xs uppercase tracking-wide text-emerald-700">Cleanup Event</p>
            <h4 className="mt-2 text-lg font-semibold text-slate-800">{event.location}</h4>
            <p className="mt-2 text-sm text-slate-600">Date: {formatDate(event.date)}</p>
            <p className="mt-1 text-sm text-slate-600">
              Plastic Collected:{" "}
              <span className="font-semibold text-slate-800">
                {Number(event.totalKgCollected).toFixed(1)} kg
              </span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
