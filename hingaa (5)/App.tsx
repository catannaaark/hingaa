
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import NotificationDrawer from './components/NotificationDrawer';
import Discover from './views/Discover';
import MapsView from './views/MapsView';
import MyActivities from './views/MyActivities';
import ActivityDetails from './views/ActivityDetails';
import GroupChat from './views/GroupChat';
import CreateActivity from './views/CreateActivity';
import Settings from './views/Settings';
import Profile from './views/Profile';
import Archive from './views/Archive';
import Onboarding from './views/Onboarding';
import { UserProfile, ActivityStatus } from './types';

const App: React.FC = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('onboarding_complete') === 'true';
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) return JSON.parse(saved);
    return {
      fullName: 'Ahmed Zaeem',
      birthDate: '1995-10-24',
      gender: 'Male',
      instaUsername: 'ahmed_zaeem',
      email: 'ahmed.zaeem@example.mv',
      bio: 'Believer in liberty, justice, and the power of a good debate.',
      avatar: 'https://picsum.photos/seed/lincoln/400/400',
      interests: ['adventure', 'sports', 'food']
    };
  });

  const [currentView, setCurrentView] = useState('discover');
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [requestedActivityIds, setRequestedActivityIds] = useState<string[]>([]);
  const [blockedGroups, setBlockedGroups] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const [activityMembers, setActivityMembers] = useState<Record<string, any[]>>({
    '1': [
      { name: 'Ahmed Hassan', role: 'Organizer', avatar: 'https://picsum.photos/seed/host1/100/100', online: true },
      { name: 'Sara M.', role: 'Verified', avatar: 'https://picsum.photos/seed/SaraM/100/100', online: false },
      { name: 'Ibrahim S.', role: 'Verified', avatar: 'https://picsum.photos/seed/IbrahimS/100/100', online: true }
    ],
    '2': [
      { name: 'Sara M.', role: 'Organizer', avatar: 'https://picsum.photos/seed/host2/100/100', online: true },
      { name: 'Ahmed Zaeem', role: 'Verified', avatar: 'https://picsum.photos/seed/user/100/100', online: true }
    ]
  });

  const [pendingRequests, setPendingRequests] = useState<any[]>([
    { id: 'req_1', userId: 'user_zeen', userName: 'Fathimath Zeen', avatar: 'https://picsum.photos/seed/z1/100/100', activityId: '1', activityTitle: 'Night Fishing', time: '2 mins ago' }
  ]);

  const navigateTo = (view: string, id: string | null = null) => {
    if (view === 'group-chat' && id && blockedGroups.includes(id)) {
      setToast({ message: "You have blocked this group.", type: 'error' });
      return;
    }
    if (view !== currentView) {
      setViewHistory(prev => [...prev, currentView]);
    }
    setCurrentView(view);
    setSelectedActivityId(id);
    setIsNotificationsOpen(false);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const lastView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setCurrentView(lastView);
    } else {
      setCurrentView('discover');
    }
  };

  const handleJoinRequest = (id: string, title: string) => {
    if (requestedActivityIds.includes(id)) return;
    setRequestedActivityIds(prev => [...prev, id]);
    setToast({ 
      message: `Your request to join "${title}" has been sent.`, 
      type: 'success' 
    });
  };

  const handleWithdraw = (id: string) => {
    setRequestedActivityIds(prev => prev.filter(itemId => itemId !== id));
    // Also remove any mock notifications that would have been sent
    setPendingRequests(prev => prev.filter(req => req.activityId !== id));
    setToast({ message: "Request withdrawn and notification cancelled.", type: 'success' });
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    setActivityMembers(prev => ({
      ...prev,
      [request.activityId]: [
        ...(prev[request.activityId] || []),
        { name: request.userName, role: 'Verified', avatar: request.avatar, online: true }
      ]
    }));

    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    setToast({ message: `${request.userName} added to the group!`, type: 'success' });
  };

  const handleDeclineRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    setToast({ message: "Request declined.", type: 'error' });
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboarding_complete', 'true');
    setCurrentView('discover');
  };

  const renderView = () => {
    if (!hasCompletedOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    switch (currentView) {
      case 'discover':
        return <Discover 
          userProfile={userProfile}
          onActivityClick={(id) => navigateTo('activity-details', id)} 
          onCreateClick={() => navigateTo('create-activity')} 
          onJoinRequest={handleJoinRequest} 
          requestedIds={requestedActivityIds}
        />;
      case 'maps':
        return <MapsView onActivityClick={(id) => navigateTo('activity-details', id)} onBack={goBack} />;
      case 'my-activities':
        return <MyActivities 
          onActivityClick={(id) => navigateTo('activity-details', id)} 
          onCreateClick={() => navigateTo('create-activity')} 
          onNavigateToArchive={() => navigateTo('archive')} 
          outgoingRequests={requestedActivityIds} 
          onWithdraw={handleWithdraw} 
          onViewGroup={(id) => navigateTo('group-chat', id)}
        />;
      case 'archive':
        return <Archive 
          onActivityClick={(id) => navigateTo('activity-details', id)} 
        />;
      case 'activity-details':
        return <ActivityDetails 
          id={selectedActivityId} 
          onBack={goBack} 
          onOpenMaps={() => navigateTo('maps')} 
          members={selectedActivityId ? (activityMembers[selectedActivityId] || []) : []} 
          onJoinRequest={handleJoinRequest} 
          isRequested={selectedActivityId ? requestedActivityIds.includes(selectedActivityId) : false}
        />;
      case 'group-chat': {
        const id = selectedActivityId || '1';
        return <GroupChat 
          groupId={id}
          members={activityMembers[id] || []} 
          isAdmin={id === '1'} 
          onLeaveGroup={() => {
            setToast({ message: "You have left the group.", type: 'success' });
            navigateTo('discover');
          }}
          onBlockGroup={(gid) => {
            setBlockedGroups(prev => [...prev, gid]);
            setToast({ message: "Group blocked.", type: 'success' });
            navigateTo('discover');
          }}
          onBack={goBack}
        />;
      }
      case 'create-activity':
        return <CreateActivity userProfile={userProfile} onPublish={() => navigateTo('discover')} onBack={goBack} />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile 
          userProfile={userProfile} 
          setUserProfile={setUserProfile}
          onActivityClick={(id) => navigateTo('activity-details', id)} 
          onBack={goBack}
        />;
      default:
        return <Discover userProfile={userProfile} onActivityClick={(id) => navigateTo('activity-details', id)} onCreateClick={() => navigateTo('create-activity')} onJoinRequest={handleJoinRequest} requestedIds={requestedActivityIds} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background-dark relative font-sans">
      {hasCompletedOnboarding && !isMobile && <Sidebar userProfile={userProfile} currentView={currentView} onNavigate={navigateTo} />}
      
      {hasCompletedOnboarding && (
        <button 
          onClick={() => setIsNotificationsOpen(true)} 
          className={`fixed z-[60] active:scale-95 transition-all flex items-center justify-center shadow-2xl rounded-full bg-surface-dark/90 backdrop-blur-md border border-border-dark text-white
            ${isMobile ? 'bottom-24 left-6 size-12' : 'bottom-10 left-80 size-14'}`}
        >
          <span className="material-symbols-outlined text-2xl fill-1">notifications</span>
          {pendingRequests.length > 0 && <span className="absolute top-0 right-0 size-3 bg-primary rounded-full border-2 border-surface-dark animate-pulse"></span>}
        </button>
      )}

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            <span className="material-symbols-outlined fill-1">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <p className="text-sm font-bold uppercase tracking-tight">{toast.message}</p>
          </div>
        </div>
      )}

      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${hasCompletedOnboarding && isMobile ? 'pb-20' : ''}`}>
        {renderView()}
      </main>

      {hasCompletedOnboarding && isMobile && (
        <BottomNav currentView={currentView} onNavigate={navigateTo} />
      )}

      {hasCompletedOnboarding && <NotificationDrawer 
        userProfile={userProfile}
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        onActivityClick={(id) => navigateTo('activity-details', id)} 
        requests={pendingRequests} 
        onAccept={handleAcceptRequest} 
        onDecline={handleDeclineRequest} 
      />}
    </div>
  );
};

export default App;
