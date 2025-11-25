"use client";

import { useEffect, useState, useRef } from 'react';
import WitnessLogo from '@/components/WitnessLogo';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Radio, Send, X } from 'lucide-react';

// Types
type LeaksConfig = {
  title: string;
  description: string;
  main_video_url: string;
};

type EvidencePhoto = {
  id: number;
  url: string;
  caption: string;
  title?: string;
  description?: string;
  gallery?: string[];
  video_url?: string;
  created_at: string;
};

type Comment = {
  id: number;
  content: string;
  created_at: string;
  session_id: string;
};

export default function Home() {
  // System operational - Signal established
  const [config, setConfig] = useState<LeaksConfig>({
    title: "LOADING SIGNAL...",
    description: "Establishing secure connection to the void.",
    main_video_url: ""
  });
  const [photos, setPhotos] = useState<EvidencePhoto[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); // Mobile chat toggle
  const [selectedPhoto, setSelectedPhoto] = useState<EvidencePhoto | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchConfig = async () => {
    const { data } = await supabase.from('leaks_config').select('*').single();
    if (data) setConfig(data);
  };

  const fetchPhotos = async () => {
    const { data } = await supabase.from('evidence_photos').select('*').order('created_at', { ascending: false }); // Newest first
    if (data) {
      setPhotos(data);
      if (data.length > 0) setSelectedPhoto(data[0]);
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: true }).limit(50);
    if (data) setComments(data);
  };

  const subscribeToComments = () => {
    supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          setComments((prev) => [...prev, payload.new as Comment]);
        }
      )
      .subscribe();
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { error } = await supabase.from('comments').insert({
      content: newComment,
      session_id: 'ANON-' + Math.floor(Math.random() * 9999)
    });

    if (!error) {
      setNewComment('');
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchPhotos();
    fetchComments();
    subscribeToComments();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Determine display content (NO FALLBACK to config)
  const displayTitle = selectedPhoto?.title || "SYSTEM OFFLINE";
  const displayDescription = selectedPhoto?.description || selectedPhoto?.caption || "No active signal detected. Waiting for incoming transmission...";

  // Combine main photo + gallery for the grid
  const currentGallery:string[] = selectedPhoto ? [selectedPhoto.url, ...(selectedPhoto.gallery || [])] : [];
        
          return (
            <div className="min-h-screen bg-void-black text-gray-200 font-sans selection:bg-neon-red selection:text-white pb-20">
          
          {/* Header / Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6">
              <WitnessLogo />
            </div>
            <span className="font-bold tracking-widest text-sm text-white uppercase hidden sm:block">Witness Protocol</span>
            <span className="font-bold tracking-widest text-sm text-white uppercase sm:hidden">WITNESS</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${selectedPhoto ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="hidden sm:inline">{selectedPhoto ? 'System Online' : 'System Offline'}</span>
              <span className="sm:hidden">{selectedPhoto ? 'ON' : 'OFF'}</span>
            </div>
            <button
              className="lg:hidden p-2 text-white hover:text-neon-red transition-colors relative"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              {isChatOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                 {!isChatOpen && <span className="absolute top-1 right-1 w-2 h-2 bg-neon-red rounded-full animate-ping" />}
            </button>
          </div>
            </div>
      </header>
              
              {/* Main Layout */}
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

              {/* Left Column: Unified Case File (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

              {/* Case File Card */}
          <article className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-neon-red/5">

            {/* Main Content (Photos) */}
            <div className="p-4 sm:p-6 pb-0">
              <div className="grid grid-cols-1 gap-4">
              {/* Main Selected Photo (Large) */}
                {selectedPhoto ? (
                  <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg group">
                    {selectedPhoto.video_url ? (
                      selectedPhoto.video_url.includes('drive.google.com') ? (
                        <iframe
                          src={selectedPhoto.video_url.replace(/\/view.*/, '/preview')}
                          className="w-full h-full object-contain pointer-events-auto z-20"
                          allow="autoplay; encrypted-media; fullscreen"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={selectedPhoto.video_url}
                          controls
                          autoPlay
                          loop
                          className="w-full h-full object-contain"
                        />
                      )
                    ) : (
                      <img
                        src={selectedPhoto.url}
                        alt={selectedPhoto.title || 'Evidence'}
                        className="w-full h-full object-contain"
                      />
                    )}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-black/50 flex items-center justify-center border border-dashed border-white/10 rounded-lg">
                    <div className="text-center">
                    <Radio className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                      <p className="text-gray-500 font-mono text-sm">NO SIGNAL ACQUIRED</p>
                    </div>
                  </div>
                )}

                {/* Gallery Grid (Current Post's Photos) */}
                {currentGallery.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {currentGallery.map((url, idx) => (
                      <div key={idx} className="aspect-square rounded overflow-hidden border border-white/10 hover:border-neon-red/50 transition-all cursor-pointer">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigation (Other Posts) */}
                {photos.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500 font-mono mb-2 uppercase">Recent Transmissions</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800">
                      {photos.map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => setSelectedPhoto(photo)}
                          className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border transition-all ${selectedPhoto?.id === photo.id ? 'border-neon-red ring-1 ring-neon-red' : 'border-white/10 hover:border-white/50'}`}
                        >
                          <img src={photo.url} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Case Info */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  {selectedPhoto ? (
                    <>
                      <Radio className="w-5 h-5 text-neon-red animate-pulse" />
                      {displayTitle}
                    </>
                  ) : (
                    <span className="text-gray-600">{displayTitle}</span>
                  )}
                </h1>
                {selectedPhoto && (
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                    <span className="text-neon-red">LIVE SIGNAL</span>
                    <span>•</span>
                    <span>ID: #{String(selectedPhoto.id).padStart(3, '0')}</span>
                    <span>•</span>
                    <span className="text-gray-500">{new Date(selectedPhoto.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Description Box */}
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-default">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Briefing</span>
                  <span className="text-[10px] bg-neon-red/20 text-neon-red px-1.5 py-0.5 rounded border border-neon-red/30">CONFIDENTIAL</span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
                  {displayDescription}
                </p>
              </div>
            </div>
          </article>

        </div>

        {/* Right Column: Chat (4 cols) - Mobile Drawer / Desktop Sidebar */}
        <div className={`
          fixed inset-0 z-40 lg:static lg:block lg:col-span-4 lg:h-[calc(100vh-7rem)] lg:sticky lg:top-20
          transition-all duration-300 ease-in-out
          ${isChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'}
        `}>
          {/* Mobile Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsChatOpen(false)}
          />

          {/* Chat Container */}
          <div className="absolute bottom-0 left-0 w-full h-[80vh] lg:h-full lg:static flex flex-col bg-black border-t lg:border border-white/10 rounded-t-2xl lg:rounded-xl overflow-hidden shadow-2xl lg:shadow-none lg:bg-black/40 lg:backdrop-blur-md">

            {/* Chat Header */}
            <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <span className="font-bold text-xs tracking-wider text-white uppercase flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-neon-red" />
                Live Comms
              </span>
              <button onClick={() => setIsChatOpen(false)} className="lg:hidden text-gray-400 p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              {comments.map((comment) => (
                <div key={comment.id} className="text-sm animate-in fade-in slide-in-from-bottom-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-neon-red font-mono opacity-80">{comment.session_id}</span>
                    <span className="text-[10px] text-gray-600 font-mono">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-gray-300 leading-snug break-words text-xs sm:text-sm font-mono">
                    {comment.content}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/60 shrink-0 pb-safe">
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Broadcast message..."
                  className="flex-1 bg-gray-900/50 border border-white/10 rounded px-3 py-3 text-xs text-white focus:outline-none focus:border-neon-red/50 transition-colors placeholder:text-gray-700 font-mono"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-white/5 hover:bg-neon-red hover:text-white text-gray-400 border border-white/10 rounded px-4 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
