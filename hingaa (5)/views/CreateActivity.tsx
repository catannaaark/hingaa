
import React, { useState } from 'react';
import { AudienceType, UserProfile, INTEREST_CATEGORIES } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface CreateActivityProps {
  userProfile: UserProfile;
  onPublish: () => void;
  onBack: () => void;
}

const CreateActivity: React.FC<CreateActivityProps> = ({ userProfile, onPublish, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: 'Mixed' as AudienceType,
    interest: 'food',
    date: '',
    time: '',
    location: '',
    participantLimit: 5,
    imageUrl: ''
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handlePublish = () => {
    if (!formData.title || !formData.description) return;
    onPublish();
  };

  const generateActivityWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const userContext = `
        Organizer: ${userProfile.fullName}
        Gender: ${userProfile.gender}
        Bio: ${userProfile.bio}
        Interests: ${userProfile.interests.join(', ')}
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `User Request: "${aiPrompt}".\n\nUser Context:\n${userContext}`,
        config: {
          systemInstruction: `You are an AI architect for "Hingaa", the Maldives' premier social activity platform. 
          Your goal is to transform a vague user idea into a complete, professional activity listing. Return valid JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              interest: { type: Type.STRING },
              audience: { type: Type.STRING },
              date: { type: Type.STRING },
              time: { type: Type.STRING },
              location: { type: Type.STRING },
              participantLimit: { type: Type.INTEGER },
              imageKeywords: { type: Type.STRING },
              error: { type: Type.STRING }
            }
          }
        },
      });

      const result = JSON.parse(response.text || '{}');
      
      if (result.error) {
        setAiError(result.error);
      } else {
        const keywords = result.imageKeywords || result.title || 'activity';
        const dynamicImageUrl = `https://picsum.photos/seed/${encodeURIComponent(keywords)}/1200/800`;

        setFormData({
          title: result.title || '',
          description: result.description || '',
          audience: (result.audience as AudienceType) || 'Mixed',
          interest: result.interest || 'food',
          date: result.date || '',
          time: result.time || '',
          location: result.location || '',
          participantLimit: result.participantLimit || 5,
          imageUrl: dynamicImageUrl
        });
        setAiPrompt('');
      }
    } catch (error) {
      console.error("AI Generation failed", error);
      setAiError("AI generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-32">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Create Activity</h2>
          </header>

          <div className="bg-[#161b22] border border-border-dark rounded-3xl p-6 mb-10 shadow-2xl">
            <textarea 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-transparent border-none text-slate-400 font-medium text-lg placeholder:text-slate-600 focus:ring-0 resize-none min-h-[100px]"
              placeholder="What are you planning? (e.g., A night fishing trip next Friday for 5 people)"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                AI Assisted
              </div>
              <button 
                onClick={generateActivityWithAI}
                disabled={isGenerating || !aiPrompt.trim()}
                className="bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                {isGenerating ? (
                   <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-sm fill-1">auto_awesome</span>
                )}
                Magic Fill
              </button>
            </div>
            {aiError && (
              <p className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-widest">{aiError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Activity Title</label>
                <input 
                  className="w-full bg-[#161b22] border border-border-dark rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:border-primary transition-all font-medium uppercase tracking-tight" 
                  placeholder="Give your activity a catchy name" 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Category</label>
                <div className="relative">
                  <select 
                    value={formData.interest}
                    onChange={(e) => setFormData({...formData, interest: e.target.value})}
                    className="w-full bg-[#161b22] border border-border-dark rounded-2xl p-4 text-sm text-slate-300 focus:border-primary transition-all font-medium appearance-none uppercase"
                  >
                    {INTEREST_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Description</label>
                <textarea 
                  className="w-full bg-[#161b22] border border-border-dark rounded-2xl p-4 min-h-[160px] text-sm text-slate-300 placeholder:text-slate-600 focus:border-primary transition-all font-medium" 
                  placeholder="Tell people more about what's happening..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Date & Time</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input className="w-full bg-[#161b22] border border-border-dark rounded-2xl p-4 text-sm text-slate-300 font-medium" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="flex-1">
                    <input className="w-full bg-[#161b22] border border-border-dark rounded-2xl p-4 text-sm text-slate-300 font-medium" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Participant Limit</label>
                <div className="flex items-center bg-[#161b22] border border-border-dark rounded-2xl h-[58px] overflow-hidden">
                  <button onClick={() => setFormData(p => ({...p, participantLimit: Math.max(1, p.participantLimit - 1)}))} className="w-16 h-full flex items-center justify-center text-slate-500 hover:text-white transition-all"><span className="material-symbols-outlined">remove</span></button>
                  <div className="flex-1 text-center font-bold text-lg text-white">{formData.participantLimit}</div>
                  <button onClick={() => setFormData(p => ({...p, participantLimit: p.participantLimit + 1}))} className="w-16 h-full flex items-center justify-center text-slate-500 hover:text-white transition-all"><span className="material-symbols-outlined">add</span></button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Location Search</label>
                <div className="relative group mb-4">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">location_on</span>
                  <input 
                    className="w-full bg-[#161b22] border border-border-dark rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-300 placeholder:text-slate-600 focus:border-primary transition-all font-medium uppercase" 
                    placeholder="Search island or beach..." 
                    type="text" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </div>
                <div className="aspect-video bg-[#0d1117] rounded-3xl border border-border-dark relative overflow-hidden flex items-center justify-center group">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-opacity group-hover:opacity-30" alt="map" />
                  <div className="relative size-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                     <span className="material-symbols-outlined text-primary text-2xl fill-1">location_on</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                     <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{formData.location || 'Hulhumalé, Male\' City'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-background-dark/95 backdrop-blur-md border-t border-border-dark p-6 z-[60] flex justify-end items-center max-w-5xl mx-auto w-full">
        <button 
          onClick={handlePublish} 
          className="bg-primary hover:bg-accent text-white px-10 h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-primary/10 flex items-center gap-3"
        >
          Publish Activity
          <span className="material-symbols-outlined text-lg">rocket_launch</span>
        </button>
      </div>
    </div>
  );
};

export default CreateActivity;
