
import React from 'react';
import { UserProfile } from '../types';
import Logo from './Logo';

interface SidebarProps {
  userProfile: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userProfile, currentView, onNavigate }) => {
  const menuItems = [
    { id: 'discover', label: 'Discover', icon: 'explore' },
    { id: 'my-activities', label: 'My Activities', icon: 'event' },
    { id: 'maps', label: 'Maps', icon: 'map' },
  ];

  const groups = [
    { id: 'yoga', name: 'Yoga Enthusiasts', members: '12 active now', avatar: 'https://picsum.photos/seed/yoga/100/100', active: true },
    { id: 'boardgames', name: "Male' Board Gamers", members: '5 active now', avatar: 'https://picsum.photos/seed/games/100/100', active: true },
    { id: 'diving', name: "Diving Maldives", members: 'Inactive', avatar: 'https://picsum.photos/seed/diving/100/100', active: false },
  ];

  return (
    <aside className="w-72 flex-shrink-0 border-r border-border-dark bg-surface-dark flex flex-col z-20">
      <div className="p-8">
        <div 
          className="flex items-center gap-3 mb-12 cursor-pointer group/logo" 
          onClick={() => onNavigate('discover')}
        >
          <Logo className="size-12" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white group-hover/logo:text-primary transition-colors">Hingaa</h1>
          </div>
        </div>

        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 opacity-40">Main Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-semibold text-sm tracking-tight ${
                currentView === item.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${currentView === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8 border-t border-white/5 flex-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 opacity-40">My Groups</p>
        <div className="space-y-6">
          {groups.map((group) => (
            <div 
              key={group.id} 
              onClick={() => onNavigate('group-chat')}
              className="flex items-center gap-4 px-4 py-2 cursor-pointer group"
            >
              <div className="relative">
                <img className={`size-10 rounded-full object-cover border-2 ${group.active ? 'border-primary/50 opacity-100' : 'border-transparent opacity-30'}`} src={group.avatar} alt={group.name} />
                {group.active && <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-surface-dark rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${group.active ? 'text-slate-200 group-hover:text-white' : 'text-slate-600'}`}>{group.name}</p>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight">{group.members}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 border-t border-white/5 bg-slate-900/10">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('profile')}>
            <img className="size-11 rounded-full object-cover border-2 border-slate-800" src={userProfile.avatar} alt="Profile" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{userProfile.fullName}</p>
              <p className="text-[10px] text-primary font-bold">Pro Member</p>
            </div>
          </div>
          <button onClick={() => onNavigate('settings')} className="text-slate-600 hover:text-white transition-colors">
             <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
