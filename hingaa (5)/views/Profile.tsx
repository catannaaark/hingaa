
import React, { useState } from 'react';
import { UserProfile, INTEREST_CATEGORIES } from '../types';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onActivityClick: (id: string) => void;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, setUserProfile, onActivityClick, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(userProfile);

  const calculateAge = (dob: string) => {
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSave = () => {
    setUserProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-background-dark font-sans">
      <div className="h-64 w-full bg-gradient-to-b from-primary/30 to-transparent absolute top-0 left-0 -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-8 pt-20 pb-20">
        <div className="flex justify-end mb-10">
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-6 py-2.5 bg-surface-dark border border-border-dark rounded-full text-white font-bold tracking-tight text-xs shadow-lg active:scale-95 transition-all"
          >
            {isEditing ? 'Save changes' : 'Edit profile'}
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-12 animate-in fade-in duration-700">
          <div className="relative mb-6">
            <div className="w-52 h-52 rounded-full border-8 border-background-dark overflow-hidden shadow-2xl ring-4 ring-primary/20 group">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={userProfile.avatar} alt="Profile" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-4xl">photo_camera</span>
                </div>
              )}
            </div>
          </div>

          {!isEditing ? (
            <>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{userProfile.fullName}</h1>
              <p className="text-xl text-slate-400 font-bold mt-2 tracking-tight">
                {calculateAge(userProfile.birthDate)} years old • {userProfile.gender}
              </p>
              
              <div className="mt-8">
                <button 
                  onClick={() => window.open(`https://instagram.com/${userProfile.instaUsername}`, '_blank')}
                  className="flex items-center gap-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-purple-500/20 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined fill-1">camera</span>
                  @{userProfile.instaUsername}
                </button>
              </div>
            </>
          ) : (
            <div className="w-full max-w-xl space-y-6">
              <input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full bg-surface-dark border-border-dark rounded-2xl p-4 text-white font-bold text-center text-xl" placeholder="Full name" />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={editForm.birthDate} onChange={e => setEditForm({...editForm, birthDate: e.target.value})} className="bg-surface-dark border-border-dark rounded-2xl p-4 text-white font-bold text-sm" />
                <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="bg-surface-dark border-border-dark rounded-2xl p-4 text-white font-bold text-sm appearance-none">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <input type="text" value={editForm.instaUsername} onChange={e => setEditForm({...editForm, instaUsername: e.target.value})} className="w-full bg-surface-dark border-border-dark rounded-2xl p-4 text-white font-bold text-sm" placeholder="Instagram username" />
              <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full bg-surface-dark border-border-dark rounded-2xl p-4 h-32 text-slate-300 font-medium text-sm" placeholder="A little about you..." />
            </div>
          )}
        </div>

        <div className="mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Interests & Vibes</h2>
          <div className="flex flex-wrap gap-4">
            {userProfile.interests.map(id => {
              const cat = INTEREST_CATEGORIES.find(c => c.id === id);
              return cat ? (
                <span key={id} className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
                  <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  {cat.label}
                </span>
              ) : null;
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter mb-8 flex items-center gap-3">
             <span className="material-symbols-outlined text-primary fill-1">auto_awesome</span> Recommended for you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => {
              const activityNames = ["Night Fishing", "Startup Pitch Session"];
              return (
                <div 
                  key={i} 
                  onClick={() => onActivityClick(String(i))}
                  className="bg-surface-dark border border-border-dark rounded-3xl p-6 flex items-center gap-5 hover:border-primary/50 transition-all cursor-pointer group shadow-xl active:scale-[0.98]"
                >
                  <div className="size-20 rounded-2xl bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                    <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{activityNames[i-1]}</h4>
                    <p className="text-xs text-slate-500 font-semibold tracking-tight">Based on your vibes</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
