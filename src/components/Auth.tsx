import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldAlert, Mail, Lock, Loader2 } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Verifique seu email para confirmar o cadastro!');
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 font-mono selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-emerald-500/10 blur-[60px] pointer-events-none"></div>

        <div className="flex items-center justify-center gap-3 mb-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-md opacity-50 rounded-full"></div>
            <ShieldAlert className="w-10 h-10 text-emerald-400 relative z-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            SPY<span className="text-emerald-500">SCALE</span>
          </h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">{error}</div>}
          {message && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm text-center">{message}</div>}

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">EMAIL DE ACESSO</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                placeholder="agente@spyscale.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">SENHA DE SEGURANÇA</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'INICIAR SESSÃO' : 'CRIAR CREDENCIAL')}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            {isLogin ? 'Não tem uma credencial? Criar agora.' : 'Já possui acesso? Fazer login.'}
          </button>
        </div>
      </div>
    </div>
  );
}
