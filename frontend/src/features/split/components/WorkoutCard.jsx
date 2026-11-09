import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkoutCard({ dayName, muscleGroups, dayId }) {
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    navigate(dayId ? `/workout/log?splitDayId=${dayId}` : "/workout/log");
  };

  return (
    <div
      className="p-5 rounded-[16px] flex items-center justify-between shadow-2xl relative overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Background Accent Blur */}
      <div 
        className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "var(--color-primary)" }}
      />
      
      <div className="flex flex-col relative z-10">
        <h3
          className="text-xl font-extrabold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {dayName || "Workout"}
        </h3>
        <p
          className="text-xs font-bold uppercase tracking-wider mt-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {muscleGroups || "General"}
        </p>
      </div>

      <button
        onClick={handleStartWorkout}
        className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "black",
          boxShadow: "0 4px 14px rgba(245, 158, 11, 0.3)",
        }}
      >
        <span>Start</span>
        <Play size={16} fill="black" />
      </button>
    </div>
  );
}
