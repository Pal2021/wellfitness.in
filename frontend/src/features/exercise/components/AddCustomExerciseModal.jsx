import { useState } from "react";
import { X, Plus, Info, ChevronDown } from "lucide-react";

export default function AddCustomExerciseModal({ isOpen, onClose, onExerciseCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "CHEST",
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    isCompound: false,
    instructions: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const muscleGroups = ["CHEST", "BACK", "LEGS", "SHOULDERS", "BICEPS", "TRICEPS", "CORE"];
  const equipmentTypes = ["DUMBBELL", "BARBELL", "MACHINE", "CABLE", "BODYWEIGHT", "OTHER"];
  const difficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Exercise name is required");
      return;
    }

    if (formData.imageUrl) {
      try {
        const photoUrl = new URL(formData.imageUrl);
        if (!['http:', 'https:'].includes(photoUrl.protocol)) throw new Error('Invalid photo URL');
      } catch {
        setError('Enter a valid http or https photo URL');
        return;
      }
    }

    try {
      setLoading(true);
      setError("");
      await onExerciseCreated(formData);
      onClose();
      setFormData({
        name: "",
        muscleGroup: "CHEST",
        equipment: "DUMBBELL",
        difficulty: "BEGINNER",
        isCompound: false,
        instructions: "",
        imageUrl: "",
      });
    } catch (err) {
      setError(err.message || "Failed to create exercise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div 
        className="w-[calc(100%-32px)] max-w-lg rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] border flex flex-col max-h-[90vh] transition-colors duration-300"
        style={{ 
          background: 'var(--color-bg-card)',
          borderColor: 'var(--color-border)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div 
          className="pt-[20px] px-[16px] pb-[16px] border-b relative"
          style={{ 
            borderColor: 'var(--color-border)',
            background: 'linear-gradient(to right, var(--color-primary-light), transparent)',
            backgroundOpacity: 0.05
          }}
        >
          <h2 className="text-xl font-bold tracking-tight leading-none" style={{ color: 'var(--color-text-primary)' }}>Create Custom Exercise</h2>
          <p className="text-[13px] mt-[8px] font-medium tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Personalize your library</p>
          
          <button 
            onClick={onClose}
            className="absolute top-[20px] right-[16px] p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form Body Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-[16px] px-[16px] pb-[20px] space-y-[16px]">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] font-medium flex items-center gap-2">
              <Info size={16} />
              {error}
            </div>
          )}

          {/* Exercise Name Field */}
          <div className="flex flex-col">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-[6px] ml-[2px]">Exercise Name</label>
            <input 
              type="text"
              placeholder="e.g. My Heavy Deadlift"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full h-[44px] rounded-[12px] px-[12px] placeholder-gray-500 focus:border-amber-500/50 outline-none transition-all text-sm border"
              style={{ 
                background: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-[16px]">
            {/* Muscle Group */}
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-[6px] ml-[2px]">Muscle Group</label>
              <div className="relative">
                <select 
                  value={formData.muscleGroup}
                  onChange={(e) => setFormData({...formData, muscleGroup: e.target.value})}
                  className="w-full h-[44px] rounded-[12px] px-[12px] appearance-none outline-none focus:border-amber-500/50 transition-all cursor-pointer text-sm border"
                  style={{ 
                    background: 'var(--color-bg-tertiary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {muscleGroups.map(m => <option key={m} value={m} className="bg-white dark:bg-zinc-900">{m}</option>)}
                </select>
                <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Equipment */}
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-[6px] ml-[2px]">Equipment</label>
              <div className="relative">
                <select 
                  value={formData.equipment}
                  onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                  className="w-full h-[44px] rounded-[12px] px-[12px] appearance-none outline-none focus:border-amber-500/50 transition-all cursor-pointer text-sm border"
                  style={{ 
                    background: 'var(--color-bg-tertiary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {equipmentTypes.map(e => <option key={e} value={e} className="bg-white dark:bg-zinc-900">{e}</option>)}
                </select>
                <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[16px]">
             {/* Difficulty */}
             <div className="flex flex-col">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-[6px] ml-[2px]">Difficulty</label>
              <div className="relative">
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full h-[44px] border rounded-[12px] px-[12px] appearance-none outline-none focus:border-amber-500/50 transition-all cursor-pointer text-sm"
                  style={{ 
                    background: 'var(--color-bg-tertiary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {difficulties.map(d => <option key={d} value={d} className="bg-white dark:bg-zinc-900">{d}</option>)}
                </select>
                <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Compound Toggle */}
            <div 
              onClick={() => setFormData({...formData, isCompound: !formData.isCompound})}
              className="flex items-center justify-between py-[12px] px-3 my-[4px] cursor-pointer group rounded-2xl border border-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <div className="flex flex-col">
                <span className="text-[14px] font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>Compound Movement</span>
                <span className="text-[12px] text-gray-500 font-medium">Hits multiple muscle groups</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all relative p-1 ${formData.isCompound ? "bg-amber-500" : "bg-gray-200 dark:bg-zinc-800"}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${formData.isCompound ? "translate-x-6" : "translate-x-0"}`} />
              </div>
            </div>
          </div>

          {/* Optional photo */}
          <div className="flex flex-col">
            <label htmlFor="custom-exercise-image" className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-[6px] ml-[2px]">Photo URL (Optional)</label>
            <input
              id="custom-exercise-image"
              type="url"
              maxLength={500}
              placeholder="https://example.com/exercise.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full h-[44px] rounded-[12px] px-[12px] placeholder-gray-500 focus:border-amber-500/50 outline-none transition-all text-sm border"
              style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            />
          </div>

          {/* Instructions */}
          <div className="flex flex-col">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-[6px] ml-[2px]">Instructions (Optional)</label>
            <textarea 
              placeholder="How to perform this exercise..."
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              className="w-full min-h-[110px] rounded-[12px] p-[12px] placeholder-gray-500 focus:border-amber-500/50 outline-none transition-all resize-none text-sm border"
              style={{ 
                background: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div 
          className="p-[16px] border-t flex gap-[12px]"
          style={{ 
            borderColor: 'var(--color-border)',
            background: 'var(--color-bg-secondary)'
          }}
        >
          <button
            onClick={onClose}
            className="flex-1 h-[48px] rounded-[15px] font-black text-gray-500 border border-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] h-[48px] bg-gradient-to-r from-amber-500 to-orange-600 rounded-[15px] font-black text-black text-xs uppercase tracking-[0.15em] shadow-[0_8px_25px_rgba(245,158,11,0.25)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
            ) : (
              <>
                <Plus size={18} strokeWidth={3} />
                Save Exercise
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
