import React, { useMemo, useState } from 'react';
import { Plus, Check, Trash2, Star, Clock, Calendar as CalendarIcon, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoStats from '../components/TodoStats';
import TodoFilter from '../components/TodoFilter';
import '../styles/Todo.css';

const TodoListPage = () => {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Proje sunumunu hazırla', completed: false, category: 'work', type: 'important', date: 'Bugün', column: 'important' },
        { id: 2, text: 'Uçak biletlerini al', completed: false, category: 'travel', type: 'upcoming', date: 'Yarın', column: 'upcoming' },
        { id: 3, text: 'Annemle kahve iç', completed: true, category: 'social', type: 'normal', date: 'Dün', column: 'other' },
        { id: 4, text: 'Market alışverişi', completed: false, category: 'other', type: 'normal', date: 'Bugün', column: 'other' },
        { id: 5, text: 'Doğum günü hediyesi al', completed: false, category: 'special', type: 'upcoming', date: 'Haftaya', column: 'upcoming' },
    ]);

    const [newTask, setNewTask] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskColumn, setNewTaskColumn] = useState('upcoming');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [ganttTasks, setGanttTasks] = useState([
        { id: 'g1', name: 'Proje taslak', start: '2024-03-01', end: '2024-03-05', color: '#8b5cf6' },
        { id: 'g2', name: 'Görsel revizyon', start: '2024-03-04', end: '2024-03-08', color: '#ec4899' },
    ]);
    const [ganttForm, setGanttForm] = useState({ name: '', start: '', end: '' });
    const [selectedColor, setSelectedColor] = useState('#8b5cf6');
    const [rgb, setRgb] = useState({ r: 139, g: 92, b: 246 });

    const handleToggleCategory = (catId) => {
        if (selectedCategories.includes(catId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== catId));
        } else {
            setSelectedCategories([...selectedCategories, catId]);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now(),
            text: newTask,
            description: newTaskDescription,
            completed: false,
            category: 'other',
            type: newTaskColumn === 'upcoming' ? 'upcoming' : newTaskColumn === 'important' ? 'important' : 'normal',
            date: 'Bugün',
            column: newTaskColumn
        };

        setTasks([task, ...tasks]);
        setNewTask('');
        setNewTaskDescription('');
        setNewTaskColumn('upcoming');
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedTask(null);
        setDragOverColumn(null);
    };

    const handleDragOver = (e, column) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(column);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e, targetColumn) => {
        e.preventDefault();
        if (draggedTask && draggedTask.column !== targetColumn) {
            setTasks(tasks.map(task =>
                task.id === draggedTask.id ? { ...task, column: targetColumn } : task
            ));
        }
        setDraggedTask(null);
        setDragOverColumn(null);
    };

    const filteredTasks = tasks.filter(task => {
        if (selectedCategories.length === 0) return true;
        return selectedCategories.includes(task.category);
    });

    const incompleteTasks = filteredTasks.filter(t => !t.completed);
    const completedTasks = filteredTasks.filter(t => t.completed);

    const upcomingTasks = incompleteTasks.filter(t => t.column === 'upcoming');
    const importantTasks = incompleteTasks.filter(t => t.column === 'important');
    const otherTasks = incompleteTasks.filter(t => t.column === 'other');

    const columns = [
        { id: 'upcoming', title: 'Yaklaşan Görevler', tasks: upcomingTasks, icon: Clock, color: '#ef4444' },
        { id: 'important', title: 'Önemli Görevler', tasks: importantTasks, icon: Star, color: '#f59e0b' },
        { id: 'other', title: 'Diğer Görevler', tasks: otherTasks, icon: CalendarIcon, color: '#3b82f6' },
    ];

    const quickColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    const updateRgbFromHex = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        setRgb({ r, g, b });
    };

    const hexFromRgb = (r, g, b) =>
        '#' +
        [r, g, b]
            .map((c) => {
                const h = c.toString(16);
                return h.length === 1 ? '0' + h : h;
            })
            .join('');

    const adjustColorBrightness = (hex, percent) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + percent));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + percent));
        const b = Math.max(0, Math.min(255, (num & 0x0000ff) + percent));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    };

    const datesForTimeline = useMemo(() => {
        if (ganttTasks.length === 0) return [];
        const dates = ganttTasks.flatMap((t) => [new Date(t.start), new Date(t.end)]);
        const min = new Date(Math.min(...dates));
        const max = new Date(Math.max(...dates));
        const days = Math.ceil((max - min) / (1000 * 60 * 60 * 24)) + 1;
        return Array.from({ length: days }, (_, i) => {
            const d = new Date(min);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [ganttTasks]);

    const minDate = useMemo(() => {
        if (ganttTasks.length === 0) return null;
        return new Date(Math.min(...ganttTasks.map((t) => new Date(t.start))));
    }, [ganttTasks]);

    const handleGanttSubmit = (e) => {
        e.preventDefault();
        if (!ganttForm.name.trim() || !ganttForm.start || !ganttForm.end) return;
        if (new Date(ganttForm.start) > new Date(ganttForm.end)) {
            return;
        }
        const newTask = {
            id: `g-${Date.now()}`,
            name: ganttForm.name.trim(),
            start: ganttForm.start,
            end: ganttForm.end,
            color: selectedColor,
        };
        setGanttTasks((prev) => [...prev, newTask]);
        setGanttForm({ name: '', start: '', end: '' });
    };

    const handleDeleteGantt = (id) => {
        setGanttTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const handleRgbChange = (channel, value) => {
        const val = Number(value);
        const next = { ...rgb, [channel]: val };
        setRgb(next);
        const hex = hexFromRgb(next.r, next.g, next.b);
        setSelectedColor(hex);
    };

    return (
        <div className="todo-container">
            <div className="todo-main">
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Görevlerim</h1>

                <form onSubmit={handleAddTask} className="kanban-add-task-form">
                    <div className="kanban-form-row">
                        <input
                            type="text"
                            className="kanban-input"
                            placeholder="Görev başlığı"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            required
                        />
                        <select
                            className="kanban-select"
                            value={newTaskColumn}
                            onChange={(e) => setNewTaskColumn(e.target.value)}
                        >
                            <option value="upcoming">Yaklaşan Görevler</option>
                            <option value="important">Önemli Görevler</option>
                            <option value="other">Diğer Görevler</option>
                        </select>
                    </div>
                    <textarea
                        className="kanban-textarea"
                        placeholder="Görev açıklaması (opsiyonel)"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                    <button type="submit" className="kanban-add-btn">
                        <Plus size={20} />
                        Görev Ekle
                    </button>
                </form>

                <div className="kanban-board">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className={`kanban-column ${column.id} ${dragOverColumn === column.id ? 'drag-over' : ''}`}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            <div className="kanban-column-header" style={{ borderColor: column.color }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <column.icon size={20} style={{ color: column.color }} />
                                    <h2 style={{ color: column.color }}>{column.title}</h2>
                                </div>
                                <span className="kanban-task-count">{column.tasks.length}</span>
                            </div>
                            <div className="kanban-tasks-container">
                                <AnimatePresence>
                                    {column.tasks.length === 0 ? (
                                        <div className="kanban-empty-state">Henüz görev yok</div>
                                    ) : (
                                        column.tasks.map(task => (
                                            <KanbanCard
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleComplete}
                                                onDelete={deleteTask}
                                                onDragStart={handleDragStart}
                                                onDragEnd={handleDragEnd}
                                            />
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>

                {completedTasks.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <div className="task-group-title" style={{ opacity: 0.7 }}>
                            <Check size={18} /> Tamamlananlar ({completedTasks.length})
                        </div>
                        <div className="task-list">
                            {completedTasks.map(task => (
                                <TaskItem key={task.id} task={task} onToggle={toggleComplete} onDelete={deleteTask} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-white/50 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="w-full lg:w-1/3 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white grid place-items-center shadow-lg">
                                        📊
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">Gantt Şeması</p>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Zaman Çizelgesi</h2>
                                    </div>
                                </div>

                                <form onSubmit={handleGanttSubmit} className="space-y-3">
                                    <input
                                        type="text"
                                        value={ganttForm.name}
                                        onChange={(e) => setGanttForm({ ...ganttForm, name: e.target.value })}
                                        placeholder="Görev adı"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="date"
                                            value={ganttForm.start}
                                            onChange={(e) => setGanttForm({ ...ganttForm, start: e.target.value })}
                                            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                        <input
                                            type="date"
                                            value={ganttForm.end}
                                            onChange={(e) => setGanttForm({ ...ganttForm, end: e.target.value })}
                                            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            {quickColors.map((c) => (
                                                <button
                                                    type="button"
                                                    key={c}
                                                    onClick={() => {
                                                        setSelectedColor(c);
                                                        updateRgbFromHex(c);
                                                    }}
                                                    className={`w-10 h-10 rounded-xl shadow-md border-2 ${selectedColor === c ? 'scale-110 border-slate-900' : 'border-transparent'}`}
                                                    style={{ background: c, transition: 'all 0.2s ease' }}
                                                />
                                            ))}
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 space-y-2 shadow-inner">
                                            <div className="h-12 rounded-xl border border-slate-200 dark:border-slate-700" style={{ background: selectedColor }} />
                                            <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                {['r', 'g', 'b'].map((channel) => (
                                                    <div key={channel} className="space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="uppercase">{channel}</span>
                                                            <span>{rgb[channel]}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="255"
                                                            value={rgb[channel]}
                                                            onChange={(e) => handleRgbChange(channel, e.target.value)}
                                                            className="w-full accent-indigo-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:scale-[1.01] active:scale-[0.98] transition"
                                    >
                                        <Plus size={18} /> Görev ekle
                                    </button>
                                </form>
                            </div>

                            <div className="w-full lg:w-2/3 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-white/50 dark:border-slate-800 shadow-inner p-4 overflow-x-auto">
                                {ganttTasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                                        <div className="text-4xl mb-2">📊</div>
                                        İlk Gantt görevini ekle.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-[180px_1fr] gap-0 border-b border-slate-200 dark:border-slate-800">
                                            <div className="font-semibold text-slate-700 dark:text-slate-200 px-3 py-2 bg-white/70 dark:bg-slate-900/80 rounded-tl-xl">
                                                Görev
                                            </div>
                                            <div className="min-w-[640px]">
                                                <div className="grid" style={{ gridTemplateColumns: `repeat(${datesForTimeline.length}, minmax(60px, 1fr))` }}>
                                                    {datesForTimeline.map((d, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="text-center text-[11px] font-semibold text-slate-500 border-r border-slate-100 dark:border-slate-800 py-2"
                                                        >
                                                            {d.getDate()}/{d.getMonth() + 1}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {ganttTasks.map((task) => {
                                            const startOffset = minDate ? Math.ceil((new Date(task.start) - minDate) / (1000 * 60 * 60 * 24)) : 0;
                                            const duration =
                                                Math.ceil((new Date(task.end) - new Date(task.start)) / (1000 * 60 * 60 * 24)) + 1;
                                            const darker = adjustColorBrightness(task.color, -25);
                                            return (
                                                <div key={task.id} className="grid grid-cols-[180px_1fr] gap-0 items-center">
                                                    <div className="flex items-center justify-between px-3 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 rounded-l-xl">
                                                        <div>
                                                            <div className="font-semibold text-slate-800 dark:text-white">{task.name}</div>
                                                            <div className="text-xs text-slate-500">
                                                                📅 {duration} gün · {task.start} - {task.end}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteGantt(task.id)}
                                                            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                                                        >
                                                            Sil
                                                        </button>
                                                    </div>
                                                    <div className="relative min-w-[640px] border-b border-slate-200 dark:border-slate-800 py-4">
                                                        <div className="absolute inset-y-0 left-0 right-0 bg-[repeating-linear-gradient(90deg,#fafafa,#fafafa_60px,#f5f5f5_60px,#f5f5f5_120px)] dark:bg-[repeating-linear-gradient(90deg,#0f172a,#0f172a_60px,#111827_60px,#111827_120px)] rounded-r-xl" />
                                                        <div
                                                            className="absolute h-9 rounded-lg shadow-md flex items-center px-3 text-white text-sm font-semibold cursor-pointer overflow-hidden"
                                                            style={{
                                                                left: `calc(${startOffset} * 60px)`,
                                                                width: `calc(${duration} * 60px)`,
                                                                background: `linear-gradient(135deg, ${task.color} 0%, ${darker} 100%)`,
                                                            }}
                                                        >
                                                            <span className="relative z-10">{task.name}</span>
                                                            <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition duration-500 hover:translate-x-[100%]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="todo-sidebar">
                <TodoStats total={filteredTasks.length} completed={completedTasks.length} />
                <TodoFilter selectedCategories={selectedCategories} onToggleCategory={handleToggleCategory} />
            </div>
        </div>
    );
};

const KanbanCard = ({ task, onToggle, onDelete, onDragStart, onDragEnd }) => {
    return (
        <motion.div
            className="kanban-card"
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -2 }}
            style={{ borderLeftColor: task.column === 'upcoming' ? '#ef4444' : task.column === 'important' ? '#f59e0b' : '#3b82f6' }}
        >
            <div className="kanban-card-header">
                <div
                    className={`kanban-checkbox ${task.completed ? 'completed' : ''}`}
                    onClick={() => onToggle(task.id)}
                >
                    {task.completed && <Check size={14} color="white" />}
                </div>
                <GripVertical size={16} className="kanban-drag-handle" />
            </div>
            <h3 className={`kanban-card-title ${task.completed ? 'completed' : ''}`}>
                {task.text}
            </h3>
            {task.description && (
                <p className="kanban-card-description">{task.description}</p>
            )}
            <div className="kanban-card-footer">
                <div className="kanban-card-meta">
                    <CalendarIcon size={12} />
                    <span>{task.date}</span>
                </div>
                <button
                    className="kanban-delete-btn"
                    onClick={() => onDelete(task.id)}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </motion.div>
    );
};

const TaskItem = ({ task, onToggle, onDelete }) => {
    return (
        <motion.div
            className={`task-item ${task.type}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            layout
        >
            <div
                className={`task-checkbox ${task.completed ? 'completed' : ''}`}
                onClick={() => onToggle(task.id)}
            >
                {task.completed && <Check size={16} color="white" />}
            </div>

            <div className="task-content">
                <div className={`task-text ${task.completed ? 'completed' : ''}`}>
                    {task.text}
                </div>
                <div className="task-meta">
                    <div className="task-tag">
                        <CalendarIcon size={12} /> {task.date}
                    </div>
                    <div className="task-tag" style={{ textTransform: 'capitalize' }}>
                        #{task.category === 'work' ? 'Çalışma' :
                            task.category === 'travel' ? 'Seyahat' :
                                task.category === 'special' ? 'Özel' :
                                    task.category === 'social' ? 'Sosyal' : 'Diğer'}
                    </div>
                </div>
            </div>

            <div className="task-actions">
                <div className="action-btn delete" onClick={() => onDelete(task.id)}>
                    <Trash2 size={18} />
                </div>
            </div>
        </motion.div>
    );
};

export default TodoListPage;
