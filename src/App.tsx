import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Shield, Key, Bot, MousePointer, Activity, Settings, LogOut, ChevronRight, ActivitySquare } from 'lucide-react';
import Portal3D from './components/Portal3D';
import './index.css';

// --- Auth Context Simulation ---
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  return { isAuthenticated, login, logout };
};

// ... Omitindo os componentes de Sidebar, Topbar, ToolCard para manter focado nas rotas
const Sidebar = ({ logout }: { logout: () => void }) => (
  <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800">
    <div className="p-6 border-b border-slate-800 flex items-center gap-3">
      <ActivitySquare className="text-cyan-400" size={32} />
      <span className="text-2xl font-bold text-white tracking-wider">YVION</span>
    </div>
    
    <nav className="flex-1 p-4 space-y-2">
      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-cyan-900/30 text-cyan-400 rounded-lg transition-colors hover:bg-cyan-900/50">
        <Activity size={20} />
        <span className="font-medium">Dashboard</span>
      </Link>
      <Link to="/keys" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-white">
        <Key size={20} />
        <span className="font-medium">Minhas Chaves</span>
      </Link>
      <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-white">
        <Settings size={20} />
        <span className="font-medium">Configurações</span>
      </Link>
    </nav>

    <div className="p-4 border-t border-slate-800">
      <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors hover:bg-red-900/30 text-red-400">
        <LogOut size={20} />
        <span className="font-medium">Sair da Conta</span>
      </button>
    </div>
  </aside>
);

const Topbar = () => (
  <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 text-white">
    <h2 className="text-xl font-semibold">Central de Controle</h2>
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/50">
        M
      </div>
      <span className="text-slate-300 font-medium">mayke@gmail.com</span>
    </div>
  </header>
);

const ToolCard = ({ title, icon, active, desc }: { title: string, icon: React.ReactNode, active: boolean, desc: string }) => (
  <div className={`p-6 rounded-xl border ${active ? 'bg-slate-800/50 border-cyan-500/30 hover:border-cyan-400' : 'bg-slate-900 border-slate-800 opacity-50'} transition-all flex flex-col gap-4 group cursor-pointer`}>
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-lg ${active ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
        {icon}
      </div>
      {active ? (
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded uppercase tracking-wider">Ativo</span>
      ) : (
        <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded uppercase tracking-wider">Bloqueado</span>
      )}
    </div>
    <div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
    {active && (
      <div className="mt-auto pt-4 flex items-center text-cyan-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
        Acessar Painel <ChevronRight size={16} />
      </div>
    )}
  </div>
);

const Dashboard = () => (
  <div className="p-8">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta, Mayke!</h1>
      <p className="text-slate-400">Gerencie suas ferramentas e robôs na nuvem Yvion.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ToolCard title="Bot RP Ultimate" icon={<Bot size={24} />} active={true} desc="Automação avançada para interações humanas indetectáveis." />
      <ToolCard title="Auto Clicker West" icon={<MousePointer size={24} />} active={true} desc="Farm e velocidade absoluta sem quebra de segurança." />
      <ToolCard title="Coruja Mística" icon={<Activity size={24} />} active={false} desc="Vigilância preditiva 24/7." />
      <ToolCard title="Yvion TradeBot" icon={<Shield size={24} />} active={false} desc="Algoritmos quantitativos de alta frequência." />
    </div>
  </div>
);

const LoginScreen = ({ login }: { login: () => void }) => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
      <div className="flex justify-center mb-8">
        <ActivitySquare className="text-cyan-400" size={48} />
      </div>
      <h2 className="text-2xl font-bold text-white text-center mb-2">YVION PORTAL</h2>
      <p className="text-slate-400 text-center mb-8">Acesse o ecossistema SaaS.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">E-mail</label>
          <input type="email" defaultValue="mayke@gmail.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Senha</label>
          <input type="password" defaultValue="coisalinda1" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <button onClick={login} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg mt-4 transition-colors">
          Entrar no Sistema
        </button>
      </div>
    </div>
  </div>
);

// --- App Layout ---
function App() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rota Raiz: O Planeta 3D (Portal Mágico) */}
        <Route path="/" element={<Portal3D />} />

        {/* Telas que exigem Login (Dashboard) */}
        <Route path="/dashboard" element={
          !isAuthenticated ? <Navigate to="/login" replace /> : (
            <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
              <Sidebar logout={logout} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto">
                  <Dashboard />
                </main>
              </div>
            </div>
          )
        } />
        
        {/* Tela de Login explícita */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen login={login} />
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
