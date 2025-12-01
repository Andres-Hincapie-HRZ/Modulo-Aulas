import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, FileText, Save, CheckCircle, Trophy, Target, Calendar, TrendingUp, Star, Zap, Clock, Flame, Crown, Medal, Sparkles, BookOpen, Brain, Rocket, Gift } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { calculateLevel, getLevelProgress, getNextLevelXp, BADGES } from '../lib/gamification';

export default function StudentDashboard({ onClassClick }) {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('challenges');

  // Datos de ejemplo épicos
  const weeklyChallenge = {
    title: "🎯 Desafío Semanal: Maestro del Conocimiento",
    description: "Completa 5 lecciones esta semana",
    progress: 3,
    total: 5,
    reward: 500,
    deadline: "Termina en 3 días",
    icon: "🏆"
  };

  const dailyQuests = [
    { id: 1, title: "Completa una lección de Matemáticas", xp: 50, completed: true, icon: "📐" },
    { id: 2, title: "Responde 10 preguntas correctamente", xp: 30, completed: true, icon: "✅" },
    { id: 3, title: "Estudia por 20 minutos", xp: 40, completed: false, icon: "⏰" },
    { id: 4, title: "Ayuda a un compañero", xp: 25, completed: false, icon: "🤝" },
    { id: 5, title: "Revisa tus errores del día anterior", xp: 35, completed: false, icon: "🔍" }
  ];

  const leaderboard = [
    { rank: 1, name: "María González", xp: 2850, avatar: "👩‍🎓", streak: 15, isMe: false },
    { rank: 2, name: "Carlos Ruiz", xp: 2720, avatar: "👨‍🎓", streak: 12, isMe: false },
    { rank: 3, name: user.name, xp: 2450, avatar: user.avatar || "👨‍🎓", streak: 8, isMe: true },
    { rank: 4, name: "Ana Martínez", xp: 2380, avatar: "👩‍🎓", streak: 10, isMe: false },
    { rank: 5, name: "Luis Pérez", xp: 2150, avatar: "👨‍🎓", streak: 7, isMe: false }
  ];

  const achievements = [
    { id: 1, name: "Primera Victoria", icon: "🎯", unlocked: true, rarity: "común" },
    { id: 2, name: "Racha de Fuego", icon: "🔥", unlocked: true, rarity: "raro" },
    { id: 3, name: "Cerebro Brillante", icon: "🧠", unlocked: true, rarity: "épico" },
    { id: 4, name: "Maestro Matemático", icon: "📐", unlocked: false, rarity: "legendario" },
    { id: 5, name: "Genio Científico", icon: "🔬", unlocked: false, rarity: "legendario" },
    { id: 6, name: "Estrella Literaria", icon: "📚", unlocked: true, rarity: "raro" },
    { id: 7, name: "Explorador Curioso", icon: "🔭", unlocked: true, rarity: "común" },
    { id: 8, name: "Campeón Semanal", icon: "👑", unlocked: false, rarity: "épico" }
  ];

  const subjects = [
    { id: 1, name: "Matemáticas", icon: "📐", color: "from-blue-500 to-cyan-500", progress: 75, level: 8, xp: 1250 },
    { id: 2, name: "Ciencias", icon: "🔬", color: "from-green-500 to-emerald-500", progress: 60, level: 6, xp: 890 },
    { id: 3, name: "Español", icon: "📚", color: "from-purple-500 to-pink-500", progress: 85, level: 10, xp: 1580 },
    { id: 4, name: "Historia", icon: "🏛️", color: "from-orange-500 to-red-500", progress: 45, level: 4, xp: 620 },
    { id: 5, name: "Inglés", icon: "🌍", color: "from-indigo-500 to-blue-500", progress: 70, level: 7, xp: 1100 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.enrollment.getStudentClasses(user.id);
        setClasses(response.classes || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const stats = user.stats || { xp: 2450, level: 12, badges: [], coins: 850 };
  const progress = getLevelProgress(stats.xp);
  const nextLevelXp = getNextLevelXp(stats.level);

  const studentStats = {
    completedTasks: 24,
    totalTasks: 30,
    streak: 8,
    rank: 3
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando tu dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Gamification Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="relative group">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl border-4 border-white/30 backdrop-blur-sm shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-300">
              {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user.avatar || '👨‍🎓'}</span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg animate-bounce">
              Nv. {stats.level}
            </div>
            <div className="absolute -top-2 -left-2 bg-orange-500 text-white rounded-full p-2 shadow-lg">
              <Flame size={16} />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">¡Hola, {user.name.split(' ')[0]}! 👋</h1>
                <p className="text-indigo-100 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-sm">
                    <Zap size={14} className="text-yellow-300" />
                    Nivel {stats.level}
                  </span>
                  <span className="text-sm">• Aprendiz Genial</span>
                  <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-sm">
                    <Flame size={14} className="text-orange-300" />
                    {studentStats.streak} días
                  </span>
                </p>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <span className="text-4xl font-bold">{stats.xp}</span>
                <span className="text-sm text-indigo-200"> / {nextLevelXp} XP</span>
              </div>
            </div>

            <div className="relative">
              <div className="h-5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 transition-all duration-1000 ease-out relative shadow-lg"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30"></div>
                </div>
              </div>
              <p className="text-xs text-indigo-200 mt-2 flex items-center justify-between">
                <span>🎯 {nextLevelXp - stats.xp} XP para el siguiente nivel</span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <p className="text-xs text-indigo-200 mb-1">Monedas</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <span className="text-yellow-300">🪙</span> {stats.coins || 0}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <p className="text-xs text-indigo-200 mb-1">Gemas</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <span className="text-cyan-300">💎</span> {Math.floor(stats.xp / 100)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white p-3 rounded-xl">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{studentStats.streak}</p>
              <p className="text-xs text-orange-600 font-medium">Días de Racha 🔥</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 text-white p-3 rounded-xl">
              <Crown size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">#{studentStats.rank}</p>
              <p className="text-xs text-yellow-600 font-medium">Ranking Global</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 text-white p-3 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{studentStats.completedTasks}</p>
              <p className="text-xs text-green-600 font-medium">Tareas Completadas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 text-white p-3 rounded-xl">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.unlocked).length}</p>
              <p className="text-xs text-purple-600 font-medium">Logros Desbloqueados</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'challenges', label: '🎯 Desafíos', icon: Target },
          { id: 'subjects', label: '📚 Materias', icon: BookOpen },
          { id: 'leaderboard', label: '🏆 Ranking', icon: Trophy },
          { id: 'achievements', label: '⭐ Logros', icon: Sparkles },
          { id: 'shop', label: '🛒 Tienda', icon: Gift },
          { id: 'classes', label: '🏫 Clases', icon: GraduationCap }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium transition-all whitespace-nowrap rounded-t-lg ${selectedTab === tab.id
              ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'challenges' && (
        <div className="space-y-6">
          {/* Weekly Challenge */}
          <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-4xl">{weeklyChallenge.icon}</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                      {weeklyChallenge.deadline}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{weeklyChallenge.title}</h3>
                  <p className="text-white/90">{weeklyChallenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl font-bold">
                    +{weeklyChallenge.reward} XP
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso</span>
                  <span className="font-bold">{weeklyChallenge.progress}/{weeklyChallenge.total}</span>
                </div>
                <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                    style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Daily Quests */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              Misiones Diarias
            </h3>
            <div className="grid gap-3">
              {dailyQuests.map(quest => (
                <Card key={quest.id} className={`p-4 transition-all ${quest.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${quest.completed ? 'grayscale opacity-50' : ''}`}>
                      {quest.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${quest.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {quest.title}
                      </h4>
                      <p className="text-sm text-slate-500">+{quest.xp} XP</p>
                    </div>
                    {quest.completed ? (
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <CheckCircle size={20} />
                      </div>
                    ) : (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Completar
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map(subject => (
            <Card key={subject.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className={`h-32 bg-gradient-to-br ${subject.color} relative p-5 flex items-end`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute top-4 right-4 text-6xl opacity-20">
                  {subject.icon}
                </div>
                <div className="relative z-10 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl">{subject.icon}</span>
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                      Nivel {subject.level}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{subject.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-600">Progreso del Curso</span>
                  <span className="text-sm font-bold text-slate-700">{subject.progress}%</span>
                </div>
                <ProgressBar value={subject.progress} max={100} className="h-2 mb-4" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Zap size={16} className="text-yellow-500" />
                    {subject.xp} XP ganados
                  </span>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    Continuar →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-6 text-center text-white">
            <Trophy size={48} className="mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-2">Tabla de Clasificación Semanal</h3>
            <p className="text-white/90">Compite con tus compañeros y alcanza la cima</p>
          </div>

          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <Card key={player.rank} className={`p-4 transition-all ${player.isMe ? 'bg-blue-50 border-blue-300 border-2 shadow-lg' : 'hover:shadow-md'}`}>
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full ${player.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      player.rank === 2 ? 'bg-slate-300 text-slate-700' :
                        player.rank === 3 ? 'bg-orange-400 text-orange-900' :
                          'bg-slate-100 text-slate-600'
                    }`}>
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                  </div>
                  <div className="text-4xl">{player.avatar}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {player.name}
                      {player.isMe && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">TÚ</span>}
                    </h4>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Flame size={14} className="text-orange-500" />
                      {player.streak} días de racha
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{player.xp}</p>
                    <p className="text-xs text-slate-500">XP</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'achievements' && (
        <div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-center text-white mb-6">
            <Sparkles size={48} className="mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-2">Colección de Logros</h3>
            <p className="text-white/90">Has desbloqueado {achievements.filter(a => a.unlocked).length} de {achievements.length} logros</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(achievement => {
              const rarityColors = {
                común: 'from-slate-400 to-slate-500',
                raro: 'from-blue-400 to-blue-600',
                épico: 'from-purple-500 to-pink-600',
                legendario: 'from-yellow-400 to-orange-500'
              };

              return (
                <Card
                  key={achievement.id}
                  className={`p-6 text-center transition-all relative overflow-hidden ${achievement.unlocked
                      ? 'border-2 shadow-lg hover:scale-105'
                      : 'opacity-40 grayscale'
                    }`}
                  style={{
                    borderColor: achievement.unlocked ? '#fbbf24' : '#e5e7eb'
                  }}
                >
                  {achievement.unlocked && (
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColors[achievement.rarity]}`}></div>
                  )}
                  <div className="text-5xl mb-3 transform transition-transform group-hover:scale-110">
                    {achievement.icon}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{achievement.name}</h4>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${achievement.rarity === 'legendario' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                      achievement.rarity === 'épico' ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' :
                        achievement.rarity === 'raro' ? 'bg-blue-500 text-white' :
                          'bg-slate-400 text-white'
                    }`}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                  {achievement.unlocked && (
                    <div className="mt-2">
                      <CheckCircle size={16} className="inline text-green-500" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {selectedTab === 'shop' && (
        <div>
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-6 text-center text-white mb-6">
            <Gift size={48} className="mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-2">Tienda de Recompensas</h3>
            <p className="text-white/90">Canjea tus monedas por increíbles premios</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-2xl font-bold">
              <span>Tu saldo:</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">🪙 {stats.coins || 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 1, name: "Avatar Épico", price: 500, icon: "🦸", rarity: "épico", description: "Personaliza tu perfil" },
              { id: 2, name: "Boost de XP x2", price: 300, icon: "⚡", rarity: "raro", description: "Duplica XP por 1 hora" },
              { id: 3, name: "Escudo Protector", price: 200, icon: "🛡️", rarity: "común", description: "Protege tu racha" },
              { id: 4, name: "Cofre Misterioso", price: 1000, icon: "🎁", rarity: "legendario", description: "Sorpresa garantizada" },
              { id: 5, name: "Tema Premium", price: 400, icon: "🎨", rarity: "raro", description: "Cambia la apariencia" },
              { id: 6, name: "Mascota Virtual", price: 600, icon: "🐱", rarity: "épico", description: "Tu compañero de estudio" }
            ].map(item => {
              const canAfford = (stats.coins || 0) >= item.price;
              const rarityColors = {
                común: 'from-slate-400 to-slate-500',
                raro: 'from-blue-400 to-blue-600',
                épico: 'from-purple-500 to-pink-600',
                legendario: 'from-yellow-400 to-orange-500'
              };

              return (
                <Card key={item.id} className={`p-6 text-center transition-all hover:scale-105 ${!canAfford && 'opacity-60'}`}>
                  <div className={`h-2 bg-gradient-to-r ${rarityColors[item.rarity]} rounded-t-lg -mt-6 -mx-6 mb-4`}></div>
                  <div className="text-6xl mb-3">{item.icon}</div>
                  <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-yellow-600">🪙 {item.price}</span>
                  </div>
                  <Button 
                    className={`w-full ${canAfford ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-slate-400 cursor-not-allowed'}`}
                    disabled={!canAfford}
                  >
                    {canAfford ? 'Comprar' : 'Insuficiente'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {selectedTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(cls => (
            <Card
              key={cls.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500 overflow-hidden"
              onClick={() => onClassClick && onClassClick(cls.id)}
            >
              <div className={`h-28 ${cls.settings?.color || 'bg-blue-500'} relative p-4 flex flex-col justify-between`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 flex justify-between items-start text-white">
                  <span className="bg-black/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                    {cls.code}
                  </span>
                  <span className="text-3xl">{cls.settings?.icon || '📚'}</span>
                </div>
                <h3 className="relative z-10 text-white font-bold text-xl leading-tight">{cls.title}</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                  <span>👨‍🏫 {cls.term || 'Profesor'}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                  <span>Progreso</span>
                  <span>{cls.progress || 0}%</span>
                </div>
                <ProgressBar value={cls.progress || 0} max={100} color="blue" className="mt-1 h-1.5" />
              </div>
            </Card>
          ))}
          {classes.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              <GraduationCap size={48} className="mx-auto mb-4 text-slate-300" />
              <p>No estás inscrito en ninguna clase aún.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
