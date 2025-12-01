import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Clock,
  Plus,
  MoreVertical,
  Search,
  GripVertical,
  Edit,
  Trash2,
  BarChart2,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Star,
  Target,
  Zap,
  Brain
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';

export default function TeacherDashboard({ onClassClick }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Datos de ejemplo épicos para profesores
  const teacherStats = {
    totalStudents: 156,
    activeClasses: 8,
    pendingGrades: 23,
    avgClassPerformance: 87
  };

  const recentActivity = [
    { id: 1, type: 'submission', student: 'María González', class: 'Matemáticas 10A', time: 'Hace 5 min', icon: '📝' },
    { id: 2, type: 'question', student: 'Carlos Ruiz', class: 'Física 11B', time: 'Hace 15 min', icon: '❓' },
    { id: 3, type: 'completed', student: 'Ana Martínez', class: 'Química 9C', time: 'Hace 1 hora', icon: '✅' },
    { id: 4, type: 'late', student: 'Luis Pérez', class: 'Matemáticas 10A', time: 'Hace 2 horas', icon: '⏰' }
  ];

  const upcomingClasses = [
    { id: 1, name: 'Matemáticas 10A', time: 'Hoy 8:00 AM', students: 32, room: 'Aula 201', color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'Física 11B', time: 'Hoy 10:30 AM', students: 28, room: 'Lab 3', color: 'from-purple-500 to-pink-500' },
    { id: 3, name: 'Química 9C', time: 'Mañana 9:00 AM', students: 25, room: 'Lab 1', color: 'from-green-500 to-emerald-500' }
  ];

  const topPerformers = [
    { name: 'María González', class: 'Matemáticas 10A', score: 98, trend: 'up', avatar: '👩‍🎓' },
    { name: 'Carlos Ruiz', class: 'Física 11B', score: 96, trend: 'up', avatar: '👨‍🎓' },
    { name: 'Ana Martínez', class: 'Química 9C', score: 94, trend: 'stable', avatar: '👩‍🎓' },
    { name: 'Luis Pérez', class: 'Matemáticas 10A', score: 92, trend: 'up', avatar: '👨‍🎓' }
  ];

  // Cargar clases desde la API
  React.useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await api.classes.getAll();
      setClasses(data);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = e => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    const newClasses = [...classes];
    const draggedClass = newClasses[draggedItem];
    newClasses.splice(draggedItem, 1);
    newClasses.splice(index, 0, draggedClass);
    setClasses(newClasses);
    setDraggedItem(index);
  };

  const handleCreateClass = async () => {
    const name = prompt('Nombre de la nueva clase:');
    if (!name) return;

    try {
      const newClass = await api.classes.create({ name });
      setClasses([...classes, newClass]);
      alert('✅ Clase creada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la clase');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando clases...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl border-4 border-white/30 backdrop-blur-sm">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel Docente</h1>
              <p className="text-indigo-100">Gestiona tus clases y estudiantes de forma eficiente</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Users size={24} className="mb-2 text-blue-200" />
              <p className="text-2xl font-bold">{teacherStats.totalStudents}</p>
              <p className="text-xs text-indigo-200">Estudiantes Totales</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <BookOpen size={24} className="mb-2 text-purple-200" />
              <p className="text-2xl font-bold">{teacherStats.activeClasses}</p>
              <p className="text-xs text-indigo-200">Clases Activas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <FileText size={24} className="mb-2 text-orange-200" />
              <p className="text-2xl font-bold">{teacherStats.pendingGrades}</p>
              <p className="text-xs text-indigo-200">Por Calificar</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <TrendingUp size={24} className="mb-2 text-green-200" />
              <p className="text-2xl font-bold">{teacherStats.avgClassPerformance}%</p>
              <p className="text-xs text-indigo-200">Rendimiento Promedio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'overview', label: '📊 Resumen', icon: BarChart2 },
            { id: 'classes', label: '🏫 Mis Clases', icon: BookOpen },
            { id: 'activity', label: '🔔 Actividad', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium transition-all whitespace-nowrap rounded-lg ${
                selectedTab === tab.id
                  ? 'text-blue-600 bg-blue-50 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar clase..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
          <Button onClick={handleCreateClass} className="shadow-lg hover:shadow-blue-200/50 transition-all">
            <Plus size={20} className="mr-2" /> Crear Clase
          </Button>
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Upcoming Classes */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              Próximas Clases
            </h3>
            <div className="grid gap-4">
              {upcomingClasses.map(cls => (
                <Card key={cls.id} className="p-5 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${cls.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                      📚
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-slate-800">{cls.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {cls.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {cls.students} estudiantes
                        </span>
                        <span className="flex items-center gap-1">
                          🚪 {cls.room}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Iniciar Clase
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="text-yellow-500" />
                Mejores Estudiantes
              </h3>
              <div className="space-y-3">
                {topPerformers.map((student, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="text-2xl">{student.avatar}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{student.score}%</p>
                      <p className="text-xs text-slate-400">
                        {student.trend === 'up' ? '📈' : '➡️'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="text-blue-600" />
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border-l-4 border-blue-200 bg-blue-50/50 rounded-r-lg">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-800">{activity.student}</p>
                      <p className="text-xs text-slate-600">{activity.class}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Classes Tab */}
      {selectedTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, index) => (
          <div
            key={cls.id}
            draggable
            onDragStart={e => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={e => handleDragOver(e, index)}
            className={`transition-all duration-300 transform ${draggedItem === index ? 'scale-105 rotate-2 shadow-2xl z-10' : 'hover:-translate-y-1 hover:shadow-xl'
              }`}
          >
            <Card className="p-0 overflow-hidden h-full flex flex-col border-0 shadow-md group relative">
              <div className="absolute top-2 left-2 z-20 p-2 bg-black/20 rounded-lg text-white opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity backdrop-blur-sm">
                <GripVertical size={20} />
              </div>

              <div
                className={`h-32 ${cls.color} relative cursor-pointer`}
                onClick={() => onClassClick(cls.id)}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl mb-2 drop-shadow-md">{cls.icon}</div>
                  <h2 className="font-bold text-xl leading-tight drop-shadow-md">{cls.name}</h2>
                  <p className="text-white/90 text-sm font-medium">{cls.section}</p>
                </div>
                <button className="absolute top-2 right-2 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-slate-600 text-sm">
                    <Users size={16} className="mr-3 text-blue-500" />
                    <span className="font-medium">{cls.students} Estudiantes</span>
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <Clock size={16} className="mr-3 text-orange-500" />
                    <span>Próxima: Lun 8:00 AM</span>
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <BarChart2 size={16} className="mr-3 text-purple-500" />
                    <span>Progreso: {cls.progress}%</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
                    Ver Calificaciones
                  </button>
                  <div className="flex gap-1">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Archivar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}

          <button
            onClick={handleCreateClass}
            className="h-full min-h-[300px] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
              <Plus size={32} />
            </div>
            <span className="font-bold text-lg">Crear Nueva Clase</span>
          </button>
        </div>
      )}

      {/* Activity Tab */}
      {selectedTab === 'activity' && (
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-500" />
              Tareas Pendientes de Calificar
            </h3>
            <div className="space-y-3">
              {[
                { student: 'María González', task: 'Tarea de Álgebra', class: 'Matemáticas 10A', submitted: 'Hace 2 horas' },
                { student: 'Carlos Ruiz', task: 'Laboratorio de Física', class: 'Física 11B', submitted: 'Hace 5 horas' },
                { student: 'Ana Martínez', task: 'Reporte de Química', class: 'Química 9C', submitted: 'Hace 1 día' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-800">{item.student}</p>
                    <p className="text-sm text-slate-600">{item.task} • {item.class}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.submitted}</p>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Calificar
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Actividad Completada Hoy
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-sm text-slate-600">Tareas Calificadas</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-3xl font-bold text-blue-600">3</p>
                <p className="text-sm text-slate-600">Clases Impartidas</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-3xl font-bold text-purple-600">8</p>
                <p className="text-sm text-slate-600">Mensajes Respondidos</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
