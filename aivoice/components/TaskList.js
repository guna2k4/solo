const TaskList = () => {
    const [tasks, setTasks] = React.useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTask, setNewTask] = React.useState('');

    React.useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        
        setTasks([...tasks, {
            id: Date.now(),
            text: newTask,
            completed: false
        }]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed} : task
        ));
    };

    return (
        <div className="card">
            <h2>Daily Tasks</h2>
            <form onSubmit={addTask} className="input-group">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add new task..."
                />
                <button type="submit" className="btn">Add Task</button>
            </form>
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id} className="task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                        />
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};