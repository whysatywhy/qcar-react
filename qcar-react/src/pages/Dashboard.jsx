import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MessageSquare, Calendar, FolderKanban, FileText, ShieldCheck, 
  Clock, Heart, Send, User, LogOut, Video, Gamepad2, X, CheckSquare, Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
// 1. Import your Supabase client
import { supabase } from '../lib/supabase'; 

const AppBox = ({ children, title, icon: Icon, span = "col-span-1", className = "" }) => (
  <div className={`${span} bg-[#0d0d0d] border border-zinc-800/60 rounded-[2.5rem] p-6 flex flex-col hover:border-zinc-700/50 transition-all group relative overflow-hidden ${className}`}>
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-zinc-900 rounded-xl group-hover:bg-zinc-800 transition-colors text-zinc-400 group-hover:text-white">
        {Icon && <Icon size={14} />}
      </div>
      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">{title}</h3>
    </div>
    <div className="flex-1 overflow-hidden relative">{children}</div>
  </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Alex");
  const [time, setTime] = useState(new Date());
  
  // --- Live Supabase States ---
  const [project, setProject] = useState({ name: "Genesis", progress: 84, broadcast: "System Stable" });
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const chatEndRef = useRef(null);

  // 2. Load Initial Data & Setup Real-time Subscriptions
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      // Fetch Project State
      const { data: state } = await supabase.from('bento_state').select('*').single();
      if (state) setProject({ name: state.project_name, progress: state.progress_percent, broadcast: state.broadcast_message });

      // Fetch Tasks
      const { data: taskList } = await supabase.from('bento_tasks').select('*').order('id', { ascending: true });
      if (taskList) setTasks(taskList);

      // Fetch Chat (Last 20 messages)
      const { data: chatLogs } = await supabase.from('bento_chat').select('*').order('created_at', { ascending: true }).limit(20);
      if (chatLogs) setMessages(chatLogs);
    };

    fetchData();

    // 3. THE MAGIC: Real-time Channel
    const channel = supabase.channel('bento-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bento_state' }, (payload) => {
        setProject({ name: payload.new.project_name, progress: payload.new.progress_percent, broadcast: payload.new.broadcast_message });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bento_tasks' }, fetchData)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bento_chat' }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [isLoggedIn]);

  // UI Helpers
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const welcomeMessage = useMemo(() => {
    const hr = new Date().getHours();
    const greets = [
      ["Night shift starts.", "The code never sleeps."], ["Dawn of Genesis.", "Morning, Architect."],
      ["Deep work active.", "Morning Sprint."], ["Mid-day Momentum.", "Afternoon grind."],
      ["Evening Refactor.", "Golden hour sync."], ["Night mode on.", "Midnight Oil."]
    ];
    return `${greets[Math.floor(hr / 4)][Math.floor(Math.random() * 2)]}, ${userName}`;
  }, [isLoggedIn]);

  // --- Database Actions ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await supabase.from('bento_chat').insert([{ username: userName, content: chatInput }]);
    setChatInput("");
  };

  const toggleTask = async (id, currentStatus) => {
    await supabase.from('bento_tasks').update({ is_done: !currentStatus }).eq('id', id);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm bg-[#0d0d0d] p-12 border border-zinc-800 rounded-[3rem] text-center">
          <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-zinc-400">Bento OS</h2>
          <input type="text" placeholder="Identity" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-4 outline-none" />
          <button onClick={() => setIsLoggedIn(true)} className="w-full bg-white text-black font-bold py-4 rounded-2xl">Initialize</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6 md:p-10 font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-white text-4xl font-light tracking-tighter">{welcomeMessage}</h1>
          <div className="flex items-center gap-2 mt-2 italic">
            <Radio size={12} className="text-emerald-500 animate-pulse" />
            <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em]">Broadcast: {project.broadcast}</p>
          </div>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="p-4 bg-[#0d0d0d] border border-zinc-800 rounded-3xl text-zinc-600 hover:text-white transition"><LogOut size={20} /></button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
        {/* PROJECT TILE */}
        <AppBox title="Project Focus" icon={FolderKanban} span="md:col-span-2 md:row-span-2">
          <div className="mt-6 flex flex-col h-full justify-between">
            <h2 className="text-6xl font-thin text-white tracking-tighter italic">{project.name}</h2>
            <div className="mb-6">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                <span>Deployment Status</span>
                <span className="text-white">{project.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className="h-full bg-white shadow-[0_0_15px_white]" />
              </div>
            </div>
          </div>
        </AppBox>

        {/* CHAT TILE */}
        <AppBox title="Messenger" icon={MessageSquare} span="md:col-span-1 md:row-span-2">
          <div className="flex flex-col h-full text-[11px]">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
              {messages.map(m => (
                <div key={m.id} className={`p-3 rounded-2xl ${m.username === userName ? 'bg-white text-black ml-4' : 'bg-zinc-900 border border-white/5 mr-4'}`}>
                  <span className="block font-bold text-[8px] opacity-50 uppercase mb-1">{m.username}</span>
                  {m.content}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type..." className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-xl outline-none" />
              <button type="submit" className="p-3 bg-white text-black rounded-xl"><Send size={14}/></button>
            </form>
          </div>
        </AppBox>

        {/* CHECKLIST TILE */}
        <AppBox title="Checklist" icon={CheckSquare} span="md:col-span-1 md:row-span-2">
          <div className="space-y-3">
            {tasks.map(t => (
              <div key={t.id} onClick={() => toggleTask(t.id, t.is_done)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${t.is_done ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700'}`}>
                  {t.is_done && <X size={10} className="text-black" />}
                </div>
                <span className={`text-xs ${t.is_done ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>{t.task_text}</span>
              </div>
            ))}
          </div>
        </AppBox>

        {/* UTILITY TILES */}
        <AppBox title="Meeting" icon={Video}>
          <button onClick={() => window.open('https://meet.google.com/new', '_blank')} className="w-full h-full bg-zinc-900 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:text-black transition">
            <Video size={20} /><span className="text-[9px] font-bold uppercase">Launch Meet</span>
          </button>
        </AppBox>
        <AppBox title="Vault" icon={ShieldCheck}><div className="text-[10px] opacity-50">Syncing files...</div></AppBox>
        <AppBox title="Clock" icon={Clock} className="flex items-center justify-center text-3xl font-mono text-white">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </AppBox>
        <AppBox title="Mood" icon={Heart} className="flex items-center justify-center text-4xl"><motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>🌵</motion.div></AppBox>
      </div>
    </div>
  );
}
