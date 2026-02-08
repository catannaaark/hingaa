
import React, { useState, useEffect, useMemo } from 'react';
import { Activity, ActivityStatus, UserProfile, AudienceType } from '../types';
import ActivityCard from '../components/ActivityCard';
import { GoogleGenAI, Type } from "@google/genai";

interface DiscoverProps {
  userProfile: UserProfile;
  onActivityClick: (id: string) => void;
  onCreateClick: () => void;
  onJoinRequest: (id: string, title: string) => void;
  requestedIds: string[];
}

const Discover: React.FC<DiscoverProps> = ({ userProfile, onActivityClick, onCreateClick, onJoinRequest, requestedIds }) => {
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'weekend'>('all');
  const [filterAudience, setFilterAudience] = useState<AudienceType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiMatchedIds, setAiMatchedIds] = useState<string[] | null>(null);

  const activities: Activity[] = useMemo(() => [
    {
      id: '1',
      title: 'Night Fishing',
      description: 'Heading out from Male harbor. We have extra reels. Mixed group welcome.',
      date: 'Friday',
      time: '8:00 PM',
      hostName: 'Ahmed Hassan',
      hostAvatar: 'https://picsum.photos/seed/host1/100/100',
      participants: 16,
      participantLimit: 22,
      location: 'Male Harbor',
      status: ActivityStatus.OPEN,
      audience: 'Mixed',
      image: 'https://picsum.photos/seed/fishing/800/600',
      tags: ['Fishing', 'Outdoor', 'Ocean']
    },
    {
      id: '2',
      title: 'Startup Pitch Session',
      description: 'Local founders networking. Strictly business.',
      date: 'Today',
      time: '4:00 PM',
      hostName: 'Sara M.',
      hostAvatar: 'https://picsum.photos/seed/host2/100/100',
      participants: 8,
      participantLimit: 12,
      location: "Male' City",
      status: ActivityStatus.REQUEST,
      audience: 'Mixed',
      image: 'https://picsum.photos/seed/startup/800/600',
      tags: ['Business', 'Networking', 'Tech']
    }
  ], []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setAiMatchedIds(null);
        return;
      }
      setIsAiSearching(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const activityDataSummary = activities.map(a => ({ id: a.id, title: a.title, tags: a.tags, desc: a.description }));
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `User searching: "${searchQuery}". Match against: ${JSON.stringify(activityDataSummary)}. Return matching IDs.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { matches: { type: Type.ARRAY, items: { type: Type.STRING } } } }
          }
        });
        const result = JSON.parse(response.text || '{"matches":[]}');
        setAiMatchedIds(result.matches || []);
      } catch (error) {
        setAiMatchedIds(null);
      } finally {
        setIsAiSearching(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, activities]);

  const filteredActivities = activities.filter(activity => {
    const matchesAudience = filterAudience === 'All' || activity.audience === filterAudience;
    let matchesDate = true;
    if (filterDate === 'today') matchesDate = activity.date === 'Today';
    if (filterDate === 'weekend') matchesDate = activity.date === 'Friday' || activity.date === 'Saturday';

    let matchesSearch = true;
    if (searchQuery.trim()) {
      matchesSearch = aiMatchedIds ? aiMatchedIds.includes(activity.id) : true;
    }
    return matchesSearch && matchesAudience && matchesDate;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden font-sans">
      <header className="min-h-[96px] bg-surface-dark/80 backdrop-blur-md border-b border-border-dark px-4 md:px-8 flex flex-col md:flex-row items-center justify-between sticky top-0 z-10 py-4 gap-4">
        <div className="w-full md:flex-1 md:max-w-2xl relative">
          <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl ${isAiSearching ? 'text-primary animate-pulse' : 'text-slate-500'}`}>
            {isAiSearching ? 'auto_awesome' : 'search'}
          </span>
          <input 
            className="w-full bg-[#0d1117]/50 border border-border-dark rounded-full pl-12 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-200 outline-none font-medium" 
            placeholder="Search vibes..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={onCreateClick} className="hidden lg:flex items-center gap-2 bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/25 transition-all">
          <span className="material-symbols-outlined text-xl">add</span> Create Activity
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="grid grid-cols-1 gap-6 pb-20">
          {filteredActivities.map(activity => (
            <ActivityCard 
              key={activity.id} 
              activity={{
                ...activity,
                status: requestedIds.includes(activity.id) ? ActivityStatus.AWAITING_APPROVAL : activity.status
              }} 
              onClick={onActivityClick} 
              onJoinRequest={onJoinRequest} 
            />
          ))}
          {filteredActivities.length === 0 && (
            <div className="text-center py-20 bg-surface-dark/30 rounded-[2.5rem] border-2 border-dashed border-border-dark">
              <h3 className="text-xl font-bold text-white mb-2">No activities found</h3>
              <button onClick={onCreateClick} className="mt-4 bg-primary px-8 py-3 rounded-xl font-bold text-sm">Create New</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
