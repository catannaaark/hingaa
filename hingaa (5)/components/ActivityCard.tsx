
import React from 'react';
import { Activity, ActivityStatus } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onClick: (id: string) => void;
  onJoinRequest?: (id: string, title: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick, onJoinRequest }) => {
  const getAudienceColor = (audience: string) => {
    if (audience === 'Girls Only') return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
    if (audience === 'Boys Only') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <div 
      onClick={() => onClick(activity.id)}
      className="bg-card-dark rounded-2xl overflow-hidden border border-border-dark flex flex-col md:flex-row md:h-64 group hover:border-primary/50 transition-all shadow-xl cursor-pointer"
    >
      <div className="w-full md:w-1/3 h-48 md:h-full relative overflow-hidden">
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={activity.image} alt={activity.title} />
      </div>
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider border flex items-center gap-1 ${
              activity.status === ActivityStatus.OPEN 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              {activity.status === ActivityStatus.OPEN && <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>}
              {activity.status}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider border ${getAudienceColor(activity.audience)}`}>
              {activity.audience}
            </span>
            <span className="text-slate-500 text-[10px] font-bold tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> {activity.time}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[10px] md:text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">calendar_today</span> {activity.date}
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight leading-tight">{activity.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 font-medium">{activity.description}</p>
        
        <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img className="size-8 md:size-10 rounded-full border-2 border-border-dark" src={activity.hostAvatar} alt={activity.hostName} />
            <div>
              <p className="text-[10px] text-slate-500 font-bold">Organized by</p>
              <p className="text-xs md:text-sm font-semibold text-white">{activity.hostName}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
            <div className="text-left sm:text-right">
              <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold justify-start sm:justify-end">
                <span className="material-symbols-outlined text-sm">location_on</span> {activity.location}
              </div>
              <p className={`text-[10px] font-bold ${activity.status === ActivityStatus.OPEN ? 'text-primary' : 'text-amber-500'}`}>
                {activity.participantLimit - activity.participants} spots left
              </p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onJoinRequest?.(activity.id, activity.title); }}
              className={`px-6 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all bg-primary text-white hover:bg-accent shadow-lg shadow-primary/20 text-xs md:text-sm tracking-widest`}
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
