import React, { useState } from 'react';
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
