
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ActivityStatus } from '../types';

interface MapsViewProps {
  onActivityClick: (id: string) => void;
  onBack: () => void;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'social' | 'sightseeing' | 'food' | 'sports';
  title: string;
  description?: string;
  uri?: string;
  isActive?: boolean;
  hasUpdate?: boolean;
}

const MapsView: React.FC<MapsViewProps> = ({ onActivityClick, onBack }) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>([
    { id: '1', lat: 40, lng: 55, type: 'social', title: 'Friday Night Meetup', isActive: true },
    { id: '2', lat: 35, lng: 45, type: 'sightseeing', title: 'Sunset Island Tour', hasUpdate: true },
    { id: '3', lat: 60, lng: 48, type: 'food', title: 'Sunset Beach Dinner' },
  ]);

  const categories = [
    { id: 'All', label: 'All', count: markers.length },
    { id: 'sightseeing', label: 'Sightseeing', count: 6, icon: 'wb_sunny' },
    { id: 'social', label: 'Social', count: 12, icon: 'chat' },
    { id: 'food', label: 'Food', count: 4, icon: 'restaurant' },
    { id: 'sports', label: 'Sports', count: 2, icon: 'fitness_center' },
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSelectedMarker(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let lat = 4.1755;
      let lng = 73.5093;
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find 5 popular ${query} activities or hangout spots in the Maldives. Provide details for each.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng
              }
            }
          }
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const newMarkers: MapMarker[] = chunks
        .filter(chunk => chunk.maps)
        .map((chunk, index) => {
          const randomLat = 30 + Math.random() * 40;
          const randomLng = 30 + Math.random() * 40;
          
          return {
            id: `api_${index}`,
            lat: randomLat,
            lng: randomLng,
            type: query.toLowerCase().includes('food') ? 'food' : 'social',
            title: chunk.maps?.title || 'Unknown Place',
            uri: chunk.maps?.uri,
            description: response.text?.substring(0, 100) + '...',
          };
        });

      if (newMarkers.length > 0) {
        setMarkers(newMarkers);
      }
    } catch (error) {
      console.error("Maps search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const getMarkerIcon = (type: MapMarker['type']) => {
    switch (type) {
      case 'social': return 'group';
      case 'sightseeing': return 'sailing';
      case 'food': return 'restaurant';
      case 'sports': return 'fitness_center';
      default: return 'place';
    }
  };

  return (
    <div className="flex-1 relative flex flex-col bg-[#0d1117] overflow-hidden font-sans">
      {/* Search Overlay */}
      <div className="absolute top-28 inset-x-0 z-30 px-8 flex justify-center pointer-events-none">
        <div className="w-full max-w-xl bg-surface-dark/90 backdrop-blur-xl border border-border-dark rounded-2xl shadow-2xl pointer-events-auto flex items-center p-2">
          <span className={`material-symbols-outlined ml-3 text-slate-500 ${isSearching ? 'text-primary animate-pulse' : ''}`}>
            {isSearching ? 'auto_awesome' : 'search'}
          </span>
          <input 
            type="text" 
            placeholder="Search activities or places..." 
            className="flex-1 bg-transparent border-none text-white text-sm px-4 focus:ring-0 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-2 text-slate-500 hover:text-white">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Bar Filters */}
      <div className="absolute top-8 inset-x-0 z-20 flex items-center justify-between px-8 pointer-events-none">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pointer-events-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveFilter(cat.id);
                if (cat.id !== 'All') handleSearch(cat.label);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeFilter === cat.id
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-surface-dark/60 backdrop-blur-md border-border-dark text-slate-400 hover:text-white'
              }`}
            >
              {cat.icon && <span className="material-symbols-outlined text-sm">{cat.icon}</span>}
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        <div className="bg-surface-dark/60 backdrop-blur-md border border-border-dark rounded-full px-4 py-2 flex items-center gap-3 pointer-events-auto">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://picsum.photos/seed/${i + 100}/100/100`} className="size-6 rounded-full border border-surface-dark" alt="" />
            ))}
          </div>
          <p className="text-[10px] font-black text-white uppercase tracking-widest">
            <span className="text-emerald-400">120+</span> People Online
          </p>
        </div>
      </div>

      {/* Map Content - Styled Dark Google Maps Background */}
      <div className="flex-1 relative bg-[#090c10] overflow-hidden">
        {/* Google Maps Background Layer */}
        <div className="absolute inset-0 z-0 grayscale contrast-[1.2] brightness-[0.7] opacity-60">
           <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src="https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=Male,Maldives&t=k&z=14&ie=UTF8&iwloc=B&output=embed"
            className="filter invert-[0.9] hue-rotate-[180deg]"
          />
        </div>

        {/* Dynamic Markers */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            onClick={() => setSelectedMarker(marker)}
            style={{ top: `${marker.lat}%`, left: `${marker.lng}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
          >
            {marker.isActive && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
                ACTIVE
              </div>
            )}
            <div className={`size-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              selectedMarker?.id === marker.id 
                ? 'bg-primary shadow-[0_0_25px_#8f1d17] scale-110' 
                : 'bg-primary/20 border-2 border-primary/40 hover:border-primary'
            }`}>
              <span className={`material-symbols-outlined text-2xl ${selectedMarker?.id === marker.id ? 'text-white' : 'text-primary'}`}>
                {getMarkerIcon(marker.type)}
              </span>
              {marker.hasUpdate && (
                <div className="absolute -top-0.5 -right-0.5 size-3 bg-white rounded-full border-2 border-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              )}
            </div>
          </div>
        ))}

        {/* Map UI Buttons */}
        <div className="absolute bottom-10 right-8 flex flex-col gap-3 z-20">
          <div className="flex flex-col bg-surface-dark/80 backdrop-blur-md border border-border-dark rounded-xl overflow-hidden shadow-2xl">
            <button className="size-12 flex items-center justify-center text-slate-400 hover:text-white border-b border-border-dark"><span className="material-symbols-outlined">add</span></button>
            <button className="size-12 flex items-center justify-center text-slate-400 hover:text-white"><span className="material-symbols-outlined">remove</span></button>
          </div>
          <button className="size-12 bg-surface-dark/80 backdrop-blur-md border border-border-dark rounded-xl flex items-center justify-center text-primary shadow-2xl hover:text-white">
            <span className="material-symbols-outlined fill-1">near_me</span>
          </button>
        </div>

        {/* Floating Back Button (Mobile) */}
        <button 
          onClick={onBack}
          className="lg:hidden absolute top-8 left-8 size-12 bg-surface-dark/80 backdrop-blur-md border border-border-dark rounded-full flex items-center justify-center text-white z-30"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        {/* Selected Activity Popup */}
        {selectedMarker && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-40 animate-in slide-in-from-bottom-8 duration-300">
            <div className="bg-[#12161b] border border-border-dark rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
              
              <button 
                onClick={() => setSelectedMarker(null)}
                className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <div className="text-center relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Hingaa</h3>
                <p className="text-primary text-base font-black uppercase tracking-tight mb-4">
                  {selectedMarker.title}
                </p>
                {selectedMarker.description && (
                  <p className="text-[10px] text-slate-500 font-bold mb-6 line-clamp-2 uppercase tracking-widest">{selectedMarker.description}</p>
                )}

                <div className="space-y-4">
                  <button 
                    onClick={() => onActivityClick(selectedMarker.id)}
                    className="w-full py-4 bg-primary hover:bg-accent text-white font-black text-sm uppercase tracking-widest rounded-3xl shadow-xl shadow-primary/30 transition-all active:scale-95"
                  >
                    Request to Join
                  </button>
                  {selectedMarker.uri && (
                    <a 
                      href={selectedMarker.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-black text-xs uppercase tracking-widest rounded-3xl border border-border-dark transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">open_in_new</span>
                      Open in Maps
                    </a>
                  )}
                  <button 
                    onClick={() => onActivityClick(selectedMarker.id)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-black text-xs uppercase tracking-widest rounded-3xl border border-border-dark transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapsView;
