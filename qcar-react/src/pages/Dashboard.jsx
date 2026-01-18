import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MessageSquare, Calendar, FolderKanban, FileText, ShieldCheck, 
  Clock, Heart, Send, User, LogOut, Video, Gamepad2, X, CheckSquare, Radio, Circle
} from 'lucide-react';
import { motion } from 'framer-motion';
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
  
  // --- Master States ---
  const [project, setProject] = useState({ name: "Genesis", progress: 84, broadcast: "System Stable" });
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [gameData, setGameData] = useState({ battleship: Array(25).fill(null), ttt: Array(9).fill(null) });

  const chatEndRef = useRef(null);

  // --- 1. THE MASTER LISTENER ---
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      const { data: state } = await supabase.from('bento_state').select('*').single();
      const { data: taskList } = await supabase.from('bento_tasks').select('*').order('id', { ascending: true });
      const { data: chatLogs } = await supabase.from('bento_chat').select('*').order('created_at', { ascending: true }).limit(20);
      const { data: session } = await supabase.from('game_sessions').select('*').single();

      if (state) setProject({ name: state.project_name, progress: state.progress_percent, broadcast: state.broadcast_message });
      if (taskList) setTasks(taskList);
      if (chatLogs) setMessages(chatLogs);
      if (session) setGameData(session.board_state);
    };

    fetchData();

    const masterChannel = supabase.channel('dashboard-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bento_chat' }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bento_state' }, (payload) => {
        setProject({ name: payload.new.project_name, progress: payload.new.progress_percent, broadcast: payload.new.broadcast_message });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bento_tasks' }, fetchData)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions' }, (payload) => {
        setGameData(payload.new.board_state);
      })
      .subscribe();

    return () => supabase.removeChannel(masterChannel);
  }, [isLoggedIn]);

  // --- 2. GAME LOGIC ---
  const handleGameMove = async (gameType, index, value) => {
    const newBoard = { ...gameData };
    newBoard[gameType][index] = value;
    await supabase.from('game_sessions').update({ board_state: newBoard }).eq('game_type', 'multiplayer_hub');
  };

  // --- 3. UI HELPERS ---
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
          <h1 className="text-white text-3xl font-light tracking-tighter">Welcome, {userName}</h1>
          <div className="flex items-center gap-2 mt-2 italic">
            <Radio size={12} className="text-emerald-500 animate-pulse" />
            <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em]">Live: {project.broadcast}</p>
          </div>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="p-4 bg-[#0d0d0d] border border-zinc-800 rounded-3xl text-zinc-600 hover:text-white transition"><LogOut size={20} /></button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
        
        {/* PROJECT DASH */}
        <AppBox title="Project Focus" icon={FolderKanban} span="md:col-span-2 md:row-span-2">
          <div className="mt-6 flex flex-col h-full justify-between">
            <h2 className="text-6xl font-thin text-white tracking-tighter italic">{project.name}</h2>
            <div className="mb-6">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                <span>Progress</span>
                <span className="text-white">{project.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className="h-full bg-white shadow-[0_0_15px_white]" />
              </div>
            </div>
          </div>
        </AppBox>

        {/* BATTLESHIP GAME */}
        <AppBox title="Battleship" icon={Gamepad2} span="md:col-span-1 md:row-span-2">
          <div className="grid grid-cols-5 gap-1 h-full pb-4">
            {gameData.battleship.map((cell, i) => (
              <div 
                key={i} 
                onClick={() => handleGameMove('battleship', i, 'hit')}
                className={`border border-white/5 rounded-lg flex items-center justify-center cursor-pointer transition ${cell === 'hit' ? 'bg-red-500/20 text-red-500' : 'hover:bg-white/5'}`}
              >
                {cell === 'hit' ? '●' : ''}
              </div>
            ))}
          </div>
        </AppBox>

        {/* MESSENGER */}
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

        {/* TIC TAC TOE */}
        <AppBox title="Tic-Tac-Toe" icon={Gamepad2}>
          <div className="grid grid-cols-3 gap-1 h-full">
            {gameData.ttt.map((cell, i) => (
              <div 
                key={i} 
                onClick={() => handleGameMove('ttt', i, userName === 'Alex' ? 'X' : 'O')}
                className="border border-white/5 rounded-lg flex items-center justify-center text-xs hover:bg-white/5 cursor-pointer"
              >
                {cell}
              </div>
            ))}
          </div>
        </AppBox>

        {/* CHECKLIST */}
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

        {/* UTILITIES */}
        <AppBox title="Vault" icon={ShieldCheck}><div className="text-[10px] opacity-50">Syncing files...</div></AppBox>
        <AppBox title="System Sync" icon={Clock} className="flex items-center justify-center text-3xl font-mono text-white">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </AppBox>

      </div>
    </div>
  );
}
