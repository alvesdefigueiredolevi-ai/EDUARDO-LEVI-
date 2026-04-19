import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Search, ShieldAlert, Target, MapPin, Users, Filter, Zap, ChevronRight, Activity, Crosshair, ExternalLink, Play, Globe, Info, ChevronDown, LogOut, Image as ImageIcon, Download, Wand2, X, Heart, Mail, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function Auth() {
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

interface Winner {
  produto: {
    nome: string;
    categoria: string;
  };
  nomePaginaFacebook: string;
  statusEscala: {
    diasAtivos: string;
    volumeCriativos: string;
  };
  direcionamentos: string[];
  publicoTarget: {
    perfilDemografico: string;
    interesses: string[];
  };
  funil: string;
  gancho: string;
  sugestaoAtaque: string;
  criativoUrl: string;
  tipoCriativo: string;
  adLibraryUrl?: string;
  searchTerm: string;
}

interface SpyScaleResponse {
  winners: Winner[];
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    winners: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          produto: {
            type: Type.OBJECT,
            properties: {
              nome: { type: Type.STRING },
              categoria: { type: Type.STRING }
            }
          },
          nomePaginaFacebook: { type: Type.STRING, description: "Nome da página do Facebook que está veiculando o anúncio" },
          statusEscala: {
            type: Type.OBJECT,
            properties: {
              diasAtivos: { type: Type.STRING },
              volumeCriativos: { type: Type.STRING }
            }
          },
          direcionamentos: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          publicoTarget: {
            type: Type.OBJECT,
            properties: {
              perfilDemografico: { type: Type.STRING },
              interesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          },
          funil: { type: Type.STRING },
          gancho: { type: Type.STRING },
          sugestaoAtaque: { type: Type.STRING },
          criativoUrl: { type: Type.STRING, description: "URL de uma imagem do anúncio. Se não encontrar a real, crie: https://picsum.photos/seed/[palavra-chave-do-produto]/600/600" },
          tipoCriativo: { type: Type.STRING, description: "'imagem' ou 'video'" },
          adLibraryUrl: { type: Type.STRING, description: "URL do anúncio na Biblioteca de Anúncios do Facebook. Se não encontrar, retorne vazio." },
          searchTerm: { type: Type.STRING, description: "Termo exato para busca na Biblioteca de Anúncios do Facebook (Nome da Fanpage ou nome exclusivo do produto)" }
        }
      }
    }
  }
};

const CATEGORIES = ['Geral', 'Infoprodutos', 'E-commerce', 'iGaming', 'Serviços Locais', 'SaaS', 'Dropshipping'];
const COUNTRIES = ['Global', 'Brasil', 'Estados Unidos', 'Portugal', 'Espanha', 'Reino Unido', 'Canadá', 'Austrália', 'Alemanha', 'França'];

const getValidUrl = (url: string) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Geral');
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SpyScaleResponse | null>(null);
  const [error, setError] = useState('');
  
  const [favorites, setFavorites] = useState<Winner[]>(() => {
    const saved = localStorage.getItem('spyscale_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCreative, setSelectedCreative] = useState<Winner | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('spyscale_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (winner: Winner) => {
    setFavorites(prev => {
      const isFavorited = prev.some(f => f.produto.nome === winner.produto.nome && f.nomePaginaFacebook === winner.nomePaginaFacebook);
      if (isFavorited) {
        return prev.filter(f => !(f.produto.nome === winner.produto.nome && f.nomePaginaFacebook === winner.nomePaginaFacebook));
      } else {
        return [...prev, winner];
      }
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const prompt = `SpyScale, extraia os anúncios mais quentes para o nicho: ${niche} ${activeCategory !== 'Geral' ? `(Categoria: ${activeCategory})` : ''}
Direcionamento (Localização): ${location || 'Global'}

Atenção: Preciso do searchTerm exato para que meu aplicativo abra a Biblioteca de Anúncios do Facebook e eu consiga ver os criativos ativos agora. Não forneça links genéricos, forneça o termo que funciona na busca.

Extraia 6 "Winners" e entregue o Dossiê Completo. Seja CONCISO nas descrições para caber em cards pequenos:
Produto: Nome e Categoria.
Página do Facebook: Nome da página que está veiculando o anúncio.
Status de Escala: Dias ativos e estimativa de volume de criativos.
Direcionamentos: Liste TODAS as cidades e estados específicos para onde o anúncio está direcionado.
Público & Target: Perfil demográfico e 3 interesses de segmentação.
Funil: Para onde o tráfego está sendo enviado?
O Gancho (Hook): Por que as pessoas param o scroll neste anúncio? (Máx 2 frases)
Sugestão de Ataque: Como eu faria um anúncio 2x melhor para ganhar desse concorrente? (Máx 2 frases)
Criativo: Forneça uma URL de imagem representativa (use https://picsum.photos/seed/[palavra-chave-em-ingles]/600/600 se não achar a real) e o tipo (imagem/video).
Responda em formato JSON estruturado para meu dashboard.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-09-2025',
        contents: prompt,
        config: {
          systemInstruction:
            'Você é o Especialista em Ad Intelligence do SpyScale. Sua única prioridade é fornecer dados REAIS e FUNCIONAIS sobre anúncios escalados.\n\nProtocolo de Link da Biblioteca de Anúncios:\nFoco no Search Term: Para cada anúncio encontrado, você deve identificar o searchTerm mais eficaz. Este termo deve ser o nome da Fanpage ou o nome exclusivo do produto que, ao ser jogado na busca da Biblioteca de Anúncios do Facebook, mostre os criativos ativos.\nFiltro de Atividade: Aponte apenas para anúncios que estão marcados como "Ativos" e rodando há mais de 7 dias (indicativo de escala).\nNão Invente: Se não encontrar um termo de busca preciso, use o nome da marca principal.\n\nProtocolos de Análise Adicionais:\nDensidade de Criativos: Analise se há múltiplos criativos para o mesmo domínio.\nDirecionamentos: Estime as regiões de maior conversão.\nMapeamento de Funil: Identifique o destino.\nPsicografia do Target: Defina a Persona detalhando dores latentes, desejos e 3 interesses.\nNível de Consciência: Determine se o público é Inconsciente, Consciente do Problema ou Consciente da Solução.\nTom de Voz: Analítico, técnico, direto e focado em estratégia de guerra.',
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });

      if (response.text) {
        let text = response.text;
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedData = JSON.parse(text) as SpyScaleResponse;
        setData(parsedData);
      } else {
        setError('Falha ao extrair dados da inteligência.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro de conexão com o servidor SpyScale.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  const handleModelCreative = async (winner: Winner) => {
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `Crie um criativo de anúncio (advertising creative) para o produto: ${winner.produto.nome}. Estratégia: ${winner.sugestaoAtaque}. Design profissional, focado em alta conversão para redes sociais, sem texto excessivo.`,
      });
      
      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
          setGeneratedImage(imageUrl);
          foundImage = true;
          break;
        }
      }
      if (!foundImage) throw new Error("Imagem não gerada.");
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar imagem modelada. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Crosshair className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                SPYSCALE <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">v2.1</span>
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:block">Competitive Intelligence Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
            </div>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors ml-2"
              title="Sair do Sistema"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-10">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                  activeCategory === cat 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex flex-col md:flex-row items-stretch bg-zinc-900 border border-zinc-800 rounded-xl focus-within:border-emerald-500/50 transition-colors divide-y md:divide-y-0 md:divide-x divide-zinc-800 shadow-xl">
              
              {/* Location Dropdown (Left) */}
              <div className="relative flex-shrink-0 z-50">
                <button
                  type="button"
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="w-full md:w-auto h-full px-6 py-3.5 flex items-center justify-center md:justify-start gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium whitespace-nowrap">{location || 'Global'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLocationOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsLocationOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-50 overflow-hidden"
                      >
                        {COUNTRIES.map(country => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => {
                              setLocation(country === 'Global' ? '' : country);
                              setIsLocationOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${location === country || (!location && country === 'Global') ? 'text-emerald-400 bg-emerald-500/10 font-medium' : 'text-zinc-300'}`}
                          >
                            {country}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Niche Input (Middle) */}
              <div className="flex-1 flex items-center bg-zinc-900/50">
                <div className="pl-4 pr-2 text-zinc-500">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Nicho (ex: Emagrecimento, Finanças)..."
                  className="w-full bg-transparent border-none py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-0"
                  disabled={loading}
                />
              </div>

              {/* Submit Button (Right) */}
              <button
                type="submit"
                disabled={loading || !niche.trim()}
                className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-b-xl md:rounded-r-xl md:rounded-bl-none"
              >
                {loading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    MINERANDO
                  </>
                ) : (
                  <>
                    INFILTRAR
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-400 text-sm"
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </div>

        {/* Tabs: Search vs Favorites */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'search'
                ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            Resultados da Pesquisa
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-white' : ''}`} />
            Favoritos ({favorites.length})
          </button>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && activeTab === 'search' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-cyan-500 rounded-full animate-spin animation-delay-150"></div>
                <div className="absolute inset-4 border-b-2 border-zinc-500 rounded-full animate-spin animation-delay-300"></div>
                <Crosshair className="absolute inset-0 m-auto w-5 h-5 text-emerald-500/50" />
              </div>
              <div className="space-y-2 text-center">
                <p className="text-emerald-400 text-sm font-bold tracking-widest animate-pulse">EXECUTANDO PROTOCOLO SPYSCALE</p>
                <p className="text-zinc-500 text-xs">Mapeando direcionamentos, analisando criativos e extraindo hooks vencedores...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results - Facebook Ads Library Style Grid */}
        <AnimatePresence>
          {((!loading && data && activeTab === 'search') || (activeTab === 'favorites')) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  {activeTab === 'favorites' ? 'Meus Favoritos' : (
                    <>
                      Biblioteca de Anúncios: <span className="text-emerald-400">{niche}</span>
                      {location && <span className="text-zinc-500 text-sm font-normal">em {location}</span>}
                    </>
                  )}
                </h2>
                <div className="text-xs text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                  {activeTab === 'favorites' ? favorites.length : data?.winners.length} resultados
                </div>
              </div>

              {/* Dense Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {(activeTab === 'favorites' ? favorites : data?.winners || []).map((winner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors flex flex-col text-xs shadow-lg"
                  >
                    {/* Header - Identity */}
                    <div className="p-3 flex items-center gap-2 border-b border-zinc-800/50 bg-zinc-900/80 relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700">
                        <span className="text-zinc-400 font-bold text-[10px]">{winner.produto.nome.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h3 className="font-bold text-zinc-200 truncate" title={winner.produto.nome}>{winner.produto.nome}</h3>
                        <p className="text-[10px] text-zinc-500 truncate">{winner.produto.categoria}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(winner);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${
                            favorites.some(f => f.produto.nome === winner.produto.nome && f.nomePaginaFacebook === winner.nomePaginaFacebook) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-zinc-500 hover:text-red-400'
                          }`} 
                        />
                      </button>
                    </div>

                    {/* Status Bar */}
                    <div className="px-3 py-2 bg-zinc-950/40 flex justify-between items-center border-b border-zinc-800/50">
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-medium">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Ativo ({winner.statusEscala.diasAtivos})
                      </span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1" title="Volume de Criativos">
                        <Filter className="w-3 h-3" /> {winner.statusEscala.volumeCriativos}
                      </span>
                    </div>

                    {/* Creative Preview (Image/Video) - Aspect Square for dense grid */}
                    <div 
                      className="relative w-full aspect-square bg-zinc-950 border-b border-zinc-800/50 overflow-hidden group/creative cursor-pointer"
                      onClick={() => setSelectedCreative(winner)}
                    >
                      {winner.tipoCriativo.toLowerCase() === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 group-hover/creative:bg-black/40 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover/creative:bg-black/40 transition-colors z-10 flex items-center justify-center">
                        <div className="opacity-0 group-hover/creative:opacity-100 transform translate-y-4 group-hover/creative:translate-y-0 transition-all duration-300 bg-emerald-500 text-zinc-950 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <ImageIcon className="w-3 h-3" /> Ver Criativo
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 z-20">
                        <span className="text-[9px] font-bold tracking-wider text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded uppercase border border-white/10">
                          {winner.tipoCriativo}
                        </span>
                      </div>
                      <img 
                        src={winner.criativoUrl} 
                        alt={winner.produto.nome} 
                        className="w-full h-full object-cover opacity-90 group-hover/creative:opacity-100 transition-all duration-500 group-hover/creative:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(winner.produto.nome)}/600/600`;
                        }}
                      />
                    </div>

                    {/* Info Body */}
                    <div className="p-3 space-y-3 flex-1 flex flex-col bg-zinc-900">
                      
                      {/* Hook */}
                      <div>
                        <p className="text-[10px] text-zinc-500 mb-0.5 font-medium flex items-center gap-1">
                          <Info className="w-3 h-3" /> Gancho Principal
                        </p>
                        <p className="text-zinc-300 line-clamp-2 leading-relaxed text-[11px]">"{winner.gancho}"</p>
                      </div>

                      {/* Funnel & Location */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-zinc-950/50 p-1.5 rounded border border-zinc-800/50 flex flex-col">
                          <p className="text-[9px] text-zinc-500 uppercase mb-0.5 shrink-0">Funil</p>
                          <p className="text-[10px] text-zinc-300 truncate" title={winner.funil}>{winner.funil}</p>
                        </div>
                        <div className="bg-zinc-950/50 p-1.5 rounded border border-zinc-800/50 flex flex-col h-full">
                          <p className="text-[9px] text-zinc-500 uppercase mb-0.5 shrink-0">Locais</p>
                          <div className="text-[10px] text-zinc-300 overflow-y-auto custom-scrollbar pr-1 flex-1 max-h-[40px]">
                            {winner.direcionamentos.join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Target Audience */}
                      <div>
                        <p className="text-[10px] text-zinc-500 mb-1 font-medium flex items-center gap-1">
                          <Users className="w-3 h-3" /> Público-Alvo
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {winner.publicoTarget.interesses.slice(0, 2).map((interesse, i) => (
                            <span key={i} className="text-[9px] text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/30 truncate max-w-full">
                              {interesse}
                            </span>
                          ))}
                          {winner.publicoTarget.interesses.length > 2 && (
                            <span className="text-[9px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                              +{winner.publicoTarget.interesses.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Attack Suggestion */}
                      <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10 mt-auto">
                        <p className="text-[9px] text-emerald-500 font-bold mb-1 flex items-center gap-1 uppercase tracking-wider">
                          <Zap className="w-3 h-3" /> Sugestão de Ataque
                        </p>
                        <p className="text-zinc-400 line-clamp-2 text-[10px] leading-relaxed">{winner.sugestaoAtaque}</p>
                      </div>

                      {/* Ad Library Button */}
                      <a 
                        href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(winner.searchTerm || winner.nomePaginaFacebook || winner.produto.nome)}&search_type=keyword_unordered&media_type=all`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 bg-[#1877F2] hover:bg-[#1864D9] text-white rounded border border-[#1877F2] transition-colors text-[11px] font-bold group/btn shadow-lg shadow-[#1877F2]/20"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver Anúncio
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Creative Modal */}
      <AnimatePresence>
        {selectedCreative && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setSelectedCreative(null);
                  setGeneratedImage(null);
                }} 
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Left: Images */}
              <div className="w-full md:w-1/2 bg-zinc-950 p-6 flex flex-col items-center justify-center relative border-r border-zinc-800 overflow-y-auto custom-scrollbar">
                 {/* Original Image */}
                 <div className="w-full flex flex-col items-center">
                   <h3 className="text-zinc-400 font-medium mb-3 text-sm flex items-center gap-2">
                     <ImageIcon className="w-4 h-4" /> Criativo Original {selectedCreative.tipoCriativo.toLowerCase() === 'video' ? '(Vídeo)' : ''}
                   </h3>
                   <img 
                     src={selectedCreative.criativoUrl} 
                     alt="Original"
                     className="max-w-full max-h-[40vh] object-contain rounded-lg shadow-lg border border-zinc-800" 
                     referrerPolicy="no-referrer"
                     onError={(e) => {
                       (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(selectedCreative.produto.nome)}/600/600`;
                     }}
                   />
                   <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full justify-center">
                     <button 
                       onClick={() => handleDownload(selectedCreative.criativoUrl, 'criativo-original.jpg')} 
                       className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-white transition-colors"
                     >
                       <Download className="w-4 h-4" /> Baixar Imagem
                     </button>
                     
                     <a
                       href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(selectedCreative.searchTerm || selectedCreative.nomePaginaFacebook || selectedCreative.produto.nome)}&search_type=keyword_unordered&media_type=all`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#1864D9] rounded-lg text-sm text-white transition-colors"
                     >
                       <ExternalLink className="w-4 h-4" /> Ver no FB Ads Library
                     </a>
                   </div>
                 </div>

                 {/* Generated Image */}
                 {generatedImage && (
                   <div className="mt-8 w-full flex flex-col items-center border-t border-zinc-800 pt-8">
                     <h3 className="text-emerald-400 font-bold mb-3 text-sm flex items-center gap-2">
                       <Wand2 className="w-4 h-4" /> Criativo Modelado (IA)
                     </h3>
                     <img 
                       src={generatedImage} 
                       alt="Modelado"
                       className="max-w-full max-h-[40vh] object-contain rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.15)] border border-emerald-500/30" 
                     />
                     <button 
                       onClick={() => handleDownload(generatedImage, 'criativo-modelado.png')} 
                       className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white font-bold transition-colors shadow-lg shadow-emerald-900/20"
                     >
                       <Download className="w-4 h-4" /> Baixar Modelado
                     </button>
                   </div>
                 )}
              </div>

              {/* Right: Info & Actions */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col">
                 <div className="mb-6">
                   <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                     {selectedCreative.produto.categoria}
                   </span>
                   <h2 className="text-2xl font-bold text-white leading-tight">{selectedCreative.produto.nome}</h2>
                 </div>

                 <div className="space-y-6 flex-1">
                   <div>
                     <h4 className="text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                       <Info className="w-4 h-4" /> Gancho Principal
                     </h4>
                     <p className="text-zinc-200 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 text-sm leading-relaxed">
                       "{selectedCreative.gancho}"
                     </p>
                   </div>

                   <div>
                     <h4 className="text-sm font-medium text-emerald-500 mb-2 flex items-center gap-2">
                       <Zap className="w-4 h-4" /> Sugestão de Ataque
                     </h4>
                     <p className="text-emerald-100 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-sm leading-relaxed">
                       {selectedCreative.sugestaoAtaque}
                     </p>
                   </div>
                 </div>
                 
                 <div className="mt-8 p-5 bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                   <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                     <Wand2 className="w-5 h-5" /> Modelagem Automática
                   </h3>
                   <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
                     Nossa IA pode analisar a <strong className="text-zinc-300">Sugestão de Ataque</strong> e gerar um novo criativo de alta conversão baseado neste anúncio, pronto para você usar.
                   </p>
                   <button 
                     onClick={() => handleModelCreative(selectedCreative)}
                     disabled={isGenerating}
                     className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-900/20"
                   >
                     {isGenerating ? (
                       <>
                         <Activity className="w-5 h-5 animate-spin" /> 
                         Gerando Nova Imagem...
                       </>
                     ) : (
                       <>
                         <Wand2 className="w-5 h-5" /> 
                         Modelar Criativo Agora
                       </>
                     )}
                   </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

