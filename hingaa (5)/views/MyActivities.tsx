
import React from 'react';

interface MyActivitiesProps {
  onActivityClick: (id: string) => void;
  onCreateClick: () => void;
  onNavigateToArchive: () => void;
  outgoingRequests: string[];
  onWithdraw: (id: string) => void;
  onViewGroup: (id: string) => void;
}

const MyActivities: React.FC<MyActivitiesProps> = ({ 
  onActivityClick, 
  onCreateClick, 
  onNavigateToArchive,
  outgoingRequests,
  onWithdraw,
  onViewGroup
}) => {
  const stats = [
    { label: 'Total Activities', value: '24' },
    { label: 'Upcoming Activities', value: '3' },
  ];

  const pendingActivity = {
    id: '1',
    title: 'Night Fishing Experience',
    date: 'Dec 24, 8:00 PM',
    location: 'Hulhumalé Marina',
    host: 'Ahmed Hassan',
    hostAvatar: 'https://picsum.photos/seed/host1/100/100',
    image: 'https://picsum.photos/seed/fishing/800/600',
  };

  const upcomingActivity = {
    id: '2',
    title: 'Startup Pitch & Networking',
    date: 'Tomorrow, 4:00 PM',
    location: "Male' City Hub",
    host: 'Sara M.',
    hostAvatar: 'https://picsum.photos/seed/host2/100/100',
    image: 'https://picsum.photos/seed/startup/800/600',
    participants: 8,
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden font-sans">
      <header className="h-20 bg-surface-dark/40 backdrop-blur-md border-b border-border-dark px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex-1 max-w-xl relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            placeholder="Search my activities..." 
            className="w-full bg-slate-900/50 border border-border-dark rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-4 ml-6">
          <button className="size-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined fill-1">notifications</span>
          </button>
          <button 
            onClick={onCreateClick}
            className="bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add</span> Create new
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-surface-dark border border-border-dark rounded-[1.5rem] p-8 flex flex-col justify-between h-36">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-4xl font-black text-white">{s.value}</p>
            </div>
          ))}
          <div 
            onClick={onNavigateToArchive}
            className="bg-surface-dark border border-border-dark rounded-[1.5rem] p-8 flex items-center gap-4 h-36 cursor-pointer group hover:border-primary/30 transition-all"
          >
            <div className="size-14 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-3xl">calendar_month</span>
            </div>
            <p className="text-sm font-bold text-slate-500 group-hover:text-white transition-colors">Archive</p>
          </div>
        </div>

        {outgoingRequests.includes(pendingActivity.id) && (
          <section className="animate-in fade-in slide-in-from-left-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Pending <span className="bg-amber-500/20 text-amber-500 text-[10px] size-5 flex items-center justify-center rounded-full">1</span>
            </h2>
            <div className="bg-[#1c2128] border border-border-dark rounded-3xl overflow-hidden flex h-60 hover:border-slate-700 transition-all">
              <div className="w-2/5 relative cursor-pointer" onClick={() => onActivityClick(pendingActivity.id)}>
                <img src={pendingActivity.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-500 text-white text-[9px] font-bold px-3 py-1 rounded-md uppercase tracking-widest">Pending</span>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1 cursor-pointer hover:text-primary transition-colors" onClick={() => onActivityClick(pendingActivity.id)}>{pendingActivity.title}</h3>
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold mb-6">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span> {pendingActivity.date}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {pendingActivity.location}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-2xl w-fit border border-white/5">
                    <img src={pendingActivity.hostAvatar} className="size-8 rounded-full" alt="" />
                    <div>
                      <p className="text-[8px] font-bold text-slate-500 uppercase">Host</p>
                      <p className="text-xs font-semibold text-slate-200">{pendingActivity.host}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-medium italic">Awaiting approval from host...</p>
                  <button 
                    onClick={() => onWithdraw(pendingActivity.id)}
                    className="px-8 py-3 rounded-xl border border-border-dark text-slate-400 hover:text-white font-bold text-xs transition-all active:scale-95"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Upcoming <span className="bg-primary/20 text-primary text-[10px] size-5 flex items-center justify-center rounded-full">1</span>
          </h2>
          <div className="bg-[#1c2128] border border-border-dark rounded-3xl overflow-hidden flex h-60 hover:border-slate-700 transition-all">
            <div className="w-2/5 relative cursor-pointer" onClick={() => onActivityClick(upcomingActivity.id)}>
              <img src={upcomingActivity.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-4 left-4">
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-md uppercase tracking-widest">Confirmed</span>
              </div>
            </div>
            <div className="flex-1 p-8 flex flex-col">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1 cursor-pointer hover:text-primary transition-colors" onClick={() => onActivityClick(upcomingActivity.id)}>{upcomingActivity.title}</h3>
                <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold mb-6">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span> {upcomingActivity.date}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {upcomingActivity.location}</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-2xl w-fit border border-white/5">
                  <img src={upcomingActivity.hostAvatar} className="size-8 rounded-full" alt="" />
                  <div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">Host</p>
                    <p className="text-xs font-semibold text-slate-200">{upcomingActivity.host}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2 items-center">
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${i + 10}/100/100`} className="size-8 rounded-full border-2 border-[#1c2128]" alt="" />
                  ))}
                  <span className="text-[10px] font-semibold text-slate-500 ml-4">+8 others</span>
                </div>
                <button 
                  onClick={() => onViewGroup(upcomingActivity.id)}
                  className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shadow-xl shadow-primary/10 active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg fill-1">group</span> View group
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Past <span className="bg-slate-800 text-slate-500 text-[10px] size-5 flex items-center justify-center rounded-full">12</span>
          </h2>
          <div className="h-40 bg-surface-dark/20 border border-border-dark border-dashed rounded-3xl flex items-center justify-center">
             <p className="text-slate-600 font-semibold text-[11px] tracking-tight">End of activities</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyActivities;
