
import React from 'react';
import { UserProfile } from '../types';

interface NotificationDrawerProps {
  userProfile?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onActivityClick: (id: string) => void;
  requests: any[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  userProfile,
  isOpen, 
  onClose, 
  onActivityClick, 
  requests,
  onAccept,
  onDecline
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-surface-dark border-l border-border-dark z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <header className="p-6 border-b border-border-dark flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary fill-1">notifications</span> Activity Feed
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {/* AI Recommendations Section */}
            <section className="bg-primary/5 rounded-3xl p-5 border border-primary/20 relative overflow-hidden group">
               <div className="absolute -top-4 -right-4 size-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
               <div className="flex items-center justify-between mb-4 relative z-10">
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                   <span className="material-symbols-outlined text-xs fill-1 animate-pulse">auto_awesome</span> AI Personalized
                 </span>
               </div>
               <div className="space-y-3 relative z-10">
                 <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-primary/30 cursor-pointer transition-all" onClick={() => onActivityClick('3')}>
                   <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-primary">
                     <span className="material-symbols-outlined text-xl">restaurant</span>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-white">Authentic Maldivian Dinner</p>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Match based on Food interest</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-primary/30 cursor-pointer transition-all" onClick={() => onActivityClick('4')}>
                   <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-primary">
                     <span className="material-symbols-outlined text-xl">explore</span>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-white">Hulhumalé Cycle Tour</p>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Match based on Adventure</p>
                   </div>
                 </div>
               </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">person_add</span> Activity Requests
                </span>
                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{requests.length}</span>
              </div>
              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-50">
                  <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                  <p className="text-xs font-medium">No pending requests</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="bg-card-dark/30 border border-border-dark rounded-xl p-4 mb-3 animate-in fade-in slide-in-from-right-4">
                    <div className="flex gap-3 mb-3">
                      <img src={req.avatar} className="size-10 rounded-full object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 leading-snug">
                          <span className="font-bold text-white">{req.userName}</span> wants to join <span className="text-primary font-bold">{req.activityTitle}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">{req.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onAccept(req.id)}
                        className="flex-1 bg-primary text-white text-[10px] font-bold py-2 rounded-lg hover:bg-accent transition-all uppercase"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => onDecline(req.id)}
                        className="flex-1 bg-slate-800 text-slate-400 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-700 transition-all uppercase"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">info</span> System Updates
                </span>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-xl border border-border-dark/50">
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Keep your profile updated to increase your chance of being accepted into activities!
                </p>
              </div>
            </section>
          </div>

          <footer className="p-6 border-t border-border-dark bg-slate-900/50">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-xl transition-all border border-border-dark uppercase tracking-widest">Settings & Privacy</button>
          </footer>
        </div>
      </aside>
    </>
  );
};

export default NotificationDrawer;