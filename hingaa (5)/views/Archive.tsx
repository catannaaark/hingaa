
import React, { useState, useMemo } from 'react';

interface ArchiveProps {
  onActivityClick: (id: string) => void;
}

const Archive: React.FC<ArchiveProps> = ({ onActivityClick }) => {
  const [selectedDay, setSelectedDay] = useState(10);
  const [viewMode, setViewMode] = useState<'Calendar' | 'List' | 'Map'>('Calendar');
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const calendarDays = useMemo(() => {
    return [
      { day: 25, prev: true }, { day: 26, prev: true }, { day: 27, prev: true }, { day: 28, prev: true }, { day: 29, prev: true }, { day: 30, prev: true }, { day: 1 },
      { day: 2 }, { day: 3, hasIcon: true, type: 'daily' }, { day: 4, hasImg: true, img: 'https://picsum.photos/seed/arch1/200/200', type: 'daily' }, { day: 5, hasIcon: true, type: 'daily' }, { day: 6, hasIcon: true, type: 'daily' }, { day: 7, hasIcon: true, type: 'daily' }, { day: 8, hasIcon: true, type: 'daily' },
      { day: 9, hasIcon: true, type: 'daily' }, { day: 10, hasImg: true, img: 'https://picsum.photos/seed/cycle/400/400', type: 'weekly' }, { day: 11, hasIcon: true, type: 'daily' }, { day: 12, hasIcon: true, type: 'daily' }, { day: 13, hasIcon: true, type: 'daily' }, { day: 14, hasIcon: true, type: 'daily' }, { day: 15, hasIcon: true, type: 'daily' },
      { day: 16, hasIcon: true, type: 'daily' }, { day: 17, hasImg: true, img: 'https://picsum.photos/seed/weekly2/200/200', type: 'weekly' }, { day: 18, hasIcon: true, type: 'daily' }, { day: 19, hasIcon: true, type: 'daily' }, { day: 20, hasIcon: true, type: 'daily' }, { day: 21, hasIcon: true, type: 'daily' }, { day: 22, hasIcon: true, type: 'daily' }
    ];
  }, []);

  const selectedActivity = {
    id: 'archive_cycle_1',
    title: 'Hulhumalé Cycle Tour',
    time: '5:00 PM',
    location: 'Phase 2',
    image: 'https://picsum.photos/seed/cycle/600/400',
    participants: 5,
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden font-sans">
      <header className="h-20 bg-background-dark border-b border-border-dark px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h2 className="text-2xl font-black text-white tracking-tight">Archive</h2>
          <div className="flex bg-slate-900 border border-border-dark rounded-xl p-1">
            {(['Calendar', 'List', 'Map'] as const).map(view => (
              <button 
                key={view} 
                onClick={() => setViewMode(view)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${viewMode === view ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="bg-slate-900 border border-border-dark px-6 py-2 rounded-xl text-slate-300 font-semibold text-[11px] flex items-center gap-2">
             December 2024 <span className="material-symbols-outlined text-base">expand_more</span>
           </button>
           <button className="size-10 bg-slate-900 border border-border-dark rounded-xl flex items-center justify-center text-slate-400">
             <span className="material-symbols-outlined">filter_list</span>
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">{d}</div>
            ))}
            {calendarDays.map((item, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedDay(item.day)}
                className={`min-h-[140px] border border-border-dark rounded-2xl p-4 transition-all relative overflow-hidden group cursor-pointer 
                  ${item.prev ? 'bg-transparent opacity-30' : 'bg-surface-dark hover:border-primary/50'}
                  ${selectedDay === item.day ? 'border-primary ring-1 ring-primary/20' : ''}`}
              >
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className={`text-xs font-bold ${selectedDay === item.day ? 'text-white' : 'text-slate-600 group-hover:text-slate-300'}`}>{item.day}</span>
                  {(selectedDay === item.day || item.hasIcon) && <div className={`size-1.5 rounded-full ${selectedDay === item.day ? 'bg-primary shadow-[0_0_10px_#8f1d17]' : 'bg-slate-700'}`}></div>}
                </div>
                {item.hasImg && (
                  <div className="absolute inset-0 p-1">
                    <img src={item.img} className="w-full h-full object-cover rounded-xl" alt="" />
                    <div className="absolute top-2 right-2 size-2 bg-emerald-500 rounded-full border border-surface-dark"></div>
                  </div>
                )}
                {item.hasIcon && !item.hasImg && (
                  <div className="flex items-center justify-center h-full opacity-20 group-hover:opacity-40 transition-opacity">
                    <span className="material-symbols-outlined text-xl">event_available</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="w-[450px] border-l border-border-dark bg-[#0d1117] p-10 flex flex-col">
          <header className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Selected Date</p>
              <h3 className="text-3xl font-black text-white tracking-tight">Dec {selectedDay}, 2024</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">1 activity recorded</p>
            </div>
            <button onClick={() => setSelectedDay(0)} className="text-slate-600 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          {selectedDay === 10 || selectedDay === 4 || selectedDay === 17 ? (
            <div className="bg-[#1c2128] border border-border-dark rounded-[2rem] overflow-hidden flex flex-col group hover:border-primary/30 transition-all cursor-pointer shadow-2xl">
              <div className="h-44 relative" onClick={() => onActivityClick(selectedActivity.id)}>
                <img src={selectedActivity.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-4 left-4">
                   <span className="bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-md tracking-tight">Completed</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors" onClick={() => onActivityClick(selectedActivity.id)}>{selectedActivity.title}</h4>
                <div className="space-y-1 mb-6">
                  <p className="flex items-center gap-2 text-[11px] font-semibold text-slate-500"><span className="material-symbols-outlined text-base">schedule</span> {selectedActivity.time}</p>
                  <p className="flex items-center gap-2 text-[11px] font-semibold text-slate-500"><span className="material-symbols-outlined text-base">location_on</span> {selectedActivity.location}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                   <div className="flex -space-x-2">
                      {[1, 2].map(i => (
                        <img key={i} src={`https://picsum.photos/seed/${i + 50}/100/100`} className="size-8 rounded-full border-2 border-[#1c2128]" alt="" />
                      ))}
                      <div className="size-8 rounded-full bg-slate-800 border-2 border-[#1c2128] flex items-center justify-center text-[9px] font-bold text-slate-500">+4</div>
                   </div>
                   <button 
                    onClick={() => onActivityClick(selectedActivity.id)}
                    className="text-primary hover:underline text-[11px] font-bold tracking-tight"
                   >
                     View memories
                   </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
               <span className="material-symbols-outlined text-6xl mb-4">event_busy</span>
               <p className="text-sm font-bold tracking-tight">No activities recorded</p>
            </div>
          )}

          <div className="mt-auto flex flex-col items-center gap-4 py-8 border-t border-border-dark border-dashed">
            <span className="material-symbols-outlined text-slate-700 text-4xl">photo_library</span>
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Past memories</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Archive;
