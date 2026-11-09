import { useState, useEffect } from "react";
import { ChevronLeft, Dumbbell, Clock, Activity, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getWorkoutHistory } from "../../../services/apiClient";

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWorkoutHistory();
      // The backend returns a PagedResponse, so actual data is in response.data.data
      setHistory(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load workout history:", err);
      setError("Failed to load your past workouts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "--";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} min`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="min-h-screen pb-24 md:pb-10 font-sans flex flex-col"
      style={{
        background: "linear-gradient(180deg, #111111 0%, #000000 100%)",
        color: "var(--color-text-primary)",
      }}
    >
      <div className="w-full flex-grow flex flex-col">
        {/* Header Section */}
        <header
          className="sticky top-0 z-20 px-5 py-5 md:px-8 backdrop-blur-2xl"
          style={{
            background: "rgba(0,0,0,0.85)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="p-2 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all"
            >
              <ChevronLeft size={24} style={{ color: "var(--color-primary)" }} />
            </button>
            <h1 className="flex-1 text-center font-bold text-lg md:text-2xl tracking-wide uppercase">
              Workout History
            </h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col px-5 py-6 md:px-8 md:py-10">
          {/* Error State */}
          {error && !loading && (
            <div
              className="p-5 rounded-2xl flex items-start gap-4 mb-6"
              style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
            >
              <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold tracking-wide">Error Loading History</p>
                <p className="text-sm mt-1 mb-4 opacity-90">{error}</p>
                <button
                  onClick={loadHistory}
                  className="px-5 py-2 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-95 text-white"
                  style={{ background: "#ef4444" }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
             <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
             </div>
          )}

          {/* Empty History State */}
          {!loading && !error && history.length === 0 && (
            <div className="flex-1 flex items-center justify-center py-8">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 md:px-10 md:py-16 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-5 flex items-center justify-center">
                  <Clock size={32} style={{ color: "var(--color-text-secondary)" }} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide">No History Yet</h2>
                <p className="text-sm text-white/60 mb-8 max-w-xs mx-auto">
                  You haven't completed a workout yet. Start a session to build your history!
                </p>
                <button
                  onClick={() => navigate("/workout")}
                  className="px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "var(--color-primary)",
                    color: "black",
                  }}
                >
                  Track Workout
                </button>
              </div>
            </div>
          )}

          {/* History List */}
          {!loading && !error && history.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {history.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-[16px] shadow-2xl relative transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Top Row: Title & Date */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {session.splitDayLabel || "Freestyle Workout"}
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-secondary)" }}>
                        {formatDate(session.startTime)}
                      </p>
                    </div>
                    {session.status === "COMPLETED" ? (
                      <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider text-green-400 bg-green-400/10 border border-green-400/20">
                        FINISHED
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider text-yellow-400 bg-yellow-400/10 border border-yellow-400/20">
                        {session.status}
                      </span>
                    )}
                  </div>

                  {/* Bottom Row: Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <Clock size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Time</span>
                      </div>
                      <span className="font-semibold text-white/90">
                        {calculateDuration(session.startTime, session.endTime)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <Dumbbell size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Volume</span>
                      </div>
                      <span className="font-semibold text-white/90">
                        {session.totalVolumeKg ? `${session.totalVolumeKg} kg` : "0 kg"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <Activity size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Sets</span>
                      </div>
                      <span className="font-semibold text-white/90">
                        {session.sets?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
