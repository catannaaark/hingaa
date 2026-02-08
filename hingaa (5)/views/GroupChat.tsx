
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Member {
  name: string;
  role: string;
  avatar: string;
  online?: boolean;
}

interface GroupChatProps {
  groupId: string;
  members: Member[];
  isAdmin: boolean;
  onLeaveGroup: () => void;
  onBlockGroup: (id: string) => void;
  onBack: () => void;
}

const GroupChat: React.FC<GroupChatProps> = ({ groupId, members, isAdmin, onLeaveGroup, onBlockGroup, onBack }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'block' | 'report' | 'member' | 'recurring' | 'ai-overview' | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const groupImage = "https://picsum.photos/seed/fishing/400/400";

  const handleReport = (type: 'group' | 'member') => {
    const subject = `Report: ${type === 'group' ? 'Group ' + groupId : 'Member ' + selectedMember?.name}`;
    const body = `Reason: ${reportReason}`;
    window.location.href = `mailto:support@hingaa.mv?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setActiveModal(null);
    setReportReason('');
  };

  const messages = [
    { sender: 'Mariyam Sara', text: 'Hey everyone! Are we still on for tonight? 🌅', time: '10:45 AM', avatar: 'https://picsum.photos/seed/sara/100/100', self: false },
    { sender: 'You', text: 'Yes! Meeting at Pier 4 at 8 PM sharp! 🧘‍♂️', time: '11:15 AM', avatar: 'https://picsum.photos/seed/user/100/100', self: true },
    { sender: 'Ibrahim S.', text: 'I might be 5 mins late, just finishing work.', time: '11:20 AM', avatar: 'https://picsum.photos/seed/IbrahimS/100/100', self: false },
  ];

  const handleAiOverview = async () => {
    setActiveModal('ai-overview');
    setIsAiLoading(true);
    setAiSummary(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these chat messages and provide a high-value, very brief "Vibe Check" summary of the current plan and participant mood:\n\n${context}`,
        config: {
          systemInstruction: "You are Hingaa AI. Provide a 2-sentence maximum summary. Use 1-2 relevant emojis. Focus on the 'who, when, where' and the overall mood of the conversation.",
        }
      });
      setAiSummary(response.text || "No summary available.");
    } catch (err) {
      setAiSummary("Failed to generate AI overview. Check your connection.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <div className="flex-1 flex flex-col bg-background-dark">
        <header className="h-20 flex-shrink-0 bg-surface-dark/80 backdrop-blur-md border-b border-border-dark px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="lg:hidden text-slate-400"><span className="material-symbols-outlined">arrow_back</span></button>
            <div className="relative">
              <img className="size-12 rounded-full object-cover border-2 border-primary" src={groupImage} alt="Group" />
              <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-[3px] border-surface-dark rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
                Night Fishing <span className="material-symbols-outlined text-primary text-base fill-1">verified</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{members.length} Members</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`size-10 flex items-center justify-center rounded-full border transition-all ${isSettingsOpen ? 'bg-primary border-primary text-white' : 'bg-slate-800 text-slate-400 border-border-dark'}`}
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 max-w-2xl ${msg.self ? 'flex-row-reverse self-end' : ''}`}>
              <img className="size-10 rounded-full object-cover mt-1" src={msg.avatar} alt={msg.sender} />
              <div className={`flex flex-col gap-1 ${msg.self ? 'items-end' : ''}`}>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{msg.sender} • {msg.time}</span>
                <div className={`p-4 rounded-2xl border ${msg.self ? 'bg-primary border-primary/20 rounded-tr-none text-white' : 'bg-surface-dark border-border-dark rounded-tl-none text-slate-200'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-surface-dark border-t border-border-dark">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <input className="flex-1 bg-slate-900 border-border-dark border rounded-xl py-3 px-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none" placeholder="Send a message..." type="text" />
            <button className="size-12 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><span className="material-symbols-outlined">send</span></button>
          </div>
        </div>
      </div>

      <aside className={`w-80 border-l border-border-dark bg-surface-dark flex flex-col transition-all duration-300 absolute right-0 top-0 h-full z-30 shadow-2xl xl:relative ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full xl:hidden'}`}>
        <header className="p-6 border-b border-border-dark flex items-center justify-between">
          <h3 className="font-bold text-white uppercase tracking-tight">Group Info</h3>
          <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500"><span className="material-symbols-outlined">close</span></button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <section className="text-center">
            <div className="relative inline-block group mb-4">
              <img src={groupImage} className="size-32 rounded-3xl object-cover border-2 border-border-dark group-hover:border-primary transition-all" alt="Group" />
              {isAdmin && (
                <button className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </button>
              )}
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight">Night Fishing</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Public Group</p>
          </section>

          <section className="space-y-3">
            <button 
              onClick={handleAiOverview}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
            >
              <span className="material-symbols-outlined fill-1">auto_awesome</span>
              <span className="text-xs font-black uppercase tracking-widest">AI Vibe Check</span>
            </button>

            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-border-dark text-slate-300 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">{isMuted ? 'notifications_off' : 'notifications'}</span>
                <span className="text-xs font-black uppercase tracking-widest">Mute Notifications</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${isMuted ? 'bg-primary' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 size-3 rounded-full bg-white transition-all ${isMuted ? 'right-1' : 'left-1'}`}></div>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveModal('report')}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-border-dark text-slate-300 hover:text-red-400 transition-all"
            >
              <span className="material-symbols-outlined">report</span>
              <span className="text-xs font-black uppercase tracking-widest">Report Group</span>
            </button>
          </section>

          {isAdmin && (
            <section className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Controls</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setActiveModal('recurring')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-primary">
                  <span className="material-symbols-outlined mb-1">event_repeat</span>
                  <span className="text-[9px] font-black uppercase">Recurring</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-border-dark hover:border-primary transition-all">
                  <span className="material-symbols-outlined mb-1 text-slate-400">add_a_photo</span>
                  <span className="text-[9px] font-black uppercase text-slate-400">Change Photo</span>
                </button>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Members ({members.length})</p>
            <div className="space-y-4">
              {members.map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} className="size-8 rounded-full object-cover" alt="" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{m.name}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{m.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedMember(m); setActiveModal('member'); }}
                    className="text-slate-600 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-6 space-y-4">
            <button onClick={() => setActiveModal('block')} className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/10 font-black text-xs uppercase tracking-widest transition-all">
              Block Group
            </button>
            <button onClick={onLeaveGroup} className="w-full py-4 rounded-2xl bg-white/5 text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
              Leave Group
            </button>
          </div>
        </div>
      </aside>

      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
          <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {activeModal === 'ai-overview' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary fill-1">auto_awesome</span>
                  <h3 className="text-xl font-black text-white uppercase">AI Vibe Check</h3>
                </div>
                {isAiLoading ? (
                  <div className="py-12 flex flex-col items-center gap-4">
                    <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analyzing vibes...</p>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-border-dark rounded-2xl p-6 text-sm text-slate-200 leading-relaxed italic">
                    {aiSummary}
                  </div>
                )}
                <button onClick={() => setActiveModal(null)} className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs">Got it</button>
              </div>
            )}

            {activeModal === 'block' && (
              <div className="text-center space-y-6">
                <span className="material-symbols-outlined text-6xl text-red-500 animate-bounce">block</span>
                <h3 className="text-2xl font-black text-white uppercase">Block Group?</h3>
                <p className="text-slate-400 text-sm">This will remove you from the group and prevent you from joining it again.</p>
                <div className="flex gap-4">
                  <button onClick={() => setActiveModal(null)} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-xs">Cancel</button>
                  <button onClick={() => onBlockGroup(groupId)} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-xs">Yes, Block</button>
                </div>
              </div>
            )}

            {activeModal === 'report' && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white uppercase">Report Issue</h3>
                <textarea 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Why are you reporting this?..."
                  className="w-full bg-slate-900 border border-border-dark rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none h-32"
                />
                <button onClick={() => handleReport('group')} className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs">Submit Report</button>
              </div>
            )}

            {activeModal === 'member' && selectedMember && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                   <img src={selectedMember.avatar} className="size-16 rounded-full" alt="" />
                   <div>
                     <h4 className="text-xl font-black text-white uppercase">{selectedMember.name}</h4>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">{selectedMember.role}</p>
                   </div>
                </div>
                <button onClick={() => handleReport('member')} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-border-dark text-slate-300 uppercase font-black text-[10px] tracking-widest"><span className="material-symbols-outlined">report</span> Report User</button>
                <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-border-dark text-slate-300 uppercase font-black text-[10px] tracking-widest"><span className="material-symbols-outlined">block</span> Block User</button>
                {isAdmin && selectedMember.role !== 'Organizer' && (
                  <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 uppercase font-black text-[10px] tracking-widest"><span className="material-symbols-outlined">person_remove</span> Remove from Group</button>
                )}
                <button onClick={() => setActiveModal(null)} className="w-full py-4 text-slate-500 font-black uppercase text-[10px]">Close</button>
              </div>
            )}

            {activeModal === 'recurring' && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white uppercase">Set Recurring</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {['Daily', 'Weekly', 'Monthly'].map(freq => (
                      <button key={freq} className="py-3 rounded-xl bg-slate-800 border border-border-dark text-[10px] font-black uppercase text-slate-400 hover:border-primary transition-all">{freq}</button>
                    ))}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-2">Repeat Until</label>
                    <input type="date" className="w-full bg-slate-800 border border-border-dark rounded-xl p-4 text-white text-sm" />
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs">Save Settings</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
