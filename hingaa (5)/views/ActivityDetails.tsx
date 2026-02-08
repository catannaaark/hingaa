
import React, { useState } from 'react';

interface ActivityDetailsProps {
  id: string | null;
  onBack: () => void;
  onOpenMaps: () => void;
  members: any[];
  onJoinRequest: (id: string, title: string) => void;
  isRequested: boolean;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ id, onBack, onOpenMaps, members, onJoinRequest, isRequested }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const activityTitle = "Night Fishing Trip";

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden relative font-sans">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 pb-24 md:pb-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-all text-xs font-bold tracking-widest uppercase">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <div className="flex-1">
            <span className="text-primary text-xs font-bold tracking-widest mb-2 block">Upcoming • Friday, Oct 27</span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">{activityTitle}</h1>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((m, i) => (
                  <img key={i} className="size-8 rounded-full border-2 border-background-dark" src={m.avatar} alt={m.name} />
                ))}
              </div>
              <p className="text-xs text-slate-400 font-bold tracking-tight">{22 - members.length} spots left</p>
            </div>
          </div>
          <div className="flex items-center gap-3 fixed bottom-24 md:relative md:bottom-0 inset-x-4 md:inset-x-0 z-30">
            <button 
              onClick={() => onJoinRequest(id || '1', activityTitle)}
              disabled={isRequested}
              className={`flex-1 md:flex-none px-12 py-4 rounded-full font-bold shadow-xl transition-all text-sm tracking-widest ${isRequested ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-accent text-white shadow-primary/20'}`}
            >
              {isRequested ? 'Pending Approval' : 'Request to Join'}
            </button>
            <button onClick={() => setIsShareModalOpen(true)} className="size-14 flex items-center justify-center rounded-full bg-surface-dark/80 backdrop-blur-md text-slate-300 border border-border-dark"><span className="material-symbols-outlined">share</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          <div className="lg:col-span-8 rounded-[2.5rem] overflow-hidden border border-border-dark h-[400px]">
            <img className="w-full h-full object-cover" src="https://picsum.photos/seed/fishing/1200/800" alt="hero" />
          </div>
          <div className="lg:col-span-4 bg-card-dark rounded-[2.5rem] border border-border-dark overflow-hidden flex flex-col h-[400px]">
             <div className="flex-1 bg-slate-900/50 relative flex items-center justify-center overflow-hidden">
                <img className="absolute inset-0 w-full h-full object-cover opacity-20" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" alt="map" />
                <span className="material-symbols-outlined text-primary text-4xl fill-1 animate-pulse">location_on</span>
             </div>
             <div className="p-6 bg-surface-dark border-t border-border-dark">
                <button onClick={onOpenMaps} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm tracking-widest flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">map</span> Open Map
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
