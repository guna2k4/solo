const DashboardForm = () => {
    const [formData, setFormData] = React.useState({
        type: 'task',
        title: '',
        description: '',
        deadline: '',
        penalty: '2',
        sets: '',
        reps: '',
        duration: '',
        mealType: 'breakfast',
        friendEmail: localStorage.getItem('friendEmail') || ''
    });

    const [tasks, setTasks] = React.useState(() => {
        const savedTasks = localStorage.getItem('allTasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [activeSection, setActiveSection] = React.useState('');

    React.useEffect(() => {
        localStorage.setItem('allTasks', JSON.stringify(tasks));
        if (formData.friendEmail) {
            localStorage.setItem('friendEmail', formData.friendEmail);
        }
    }, [tasks, formData.friendEmail]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.friendEmail) return;

        const now = new Date();
        const task = {
            id: Date.now(),
            ...formData,
            completed: false,
            createdAt: now.toISOString(),
            deadline: formData.deadline || now.toLocaleTimeString(),
            xp: calculateXP(formData.type)
        };

        setTasks([...tasks, task]);
        
        setFormData(prev => ({
            type: 'task',
            title: '',
            description: '',
            deadline: '',
            penalty: '2',
            sets: '',
            reps: '',
            duration: '',
            mealType: 'breakfast',
            friendEmail: prev.friendEmail
        }));

        announceQuest(task);
    };

    const announceQuest = (task) => {
        const msg = new SpeechSynthesisUtterance();
        msg.text = `New quest added: ${task.title}. Worth ${task.xp} XP. Complete by ${task.deadline} or pay $${task.penalty} to ${task.friendEmail}`;
        window.speechSynthesis.speak(msg);
    };

    const readAllQuests = () => {
        const activeQuests = tasks.filter(t => !t.completed);
        if (activeQuests.length === 0) {
            const msg = new SpeechSynthesisUtterance("No active quests available.");
            window.speechSynthesis.speak(msg);
            return;
        }

        activeQuests.forEach((task, index) => {
            setTimeout(() => {
                const msg = new SpeechSynthesisUtterance();
                msg.text = `Quest ${index + 1}: ${task.title}. Due by ${task.deadline}`;
                window.speechSynthesis.speak(msg);
            }, index * 3000);
        });
    };

    const calculateXP = (type) => {
        const xpValues = {
            task: 30,
            workout: 50,
            meal: 20,
            knowledge: 40,
            homework: 60
        };
        return xpValues[type] || 30;
    };

    const completeTask = (taskId) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId && !task.completed) {
                const currentXp = JSON.parse(localStorage.getItem('xp') || '0');
                localStorage.setItem('xp', JSON.stringify(currentXp + task.xp));
                
                const msg = new SpeechSynthesisUtterance(`Quest completed! You earned ${task.xp} XP!`);
                window.speechSynthesis.speak(msg);
                
                return { ...task, completed: true };
            }
            return task;
        }));
    };

    const isTaskOverdue = (task) => {
        if (!task.deadline) return false;
        const now = new Date();
        const deadline = new Date();
        const [hours, minutes] = task.deadline.split(':');
        deadline.setHours(hours, minutes);
        return now > deadline && !task.completed;
    };

    const renderMealButtons = () => {
        if (formData.type !== 'meal') return null;

        const mealTypes = [
            { id: 'breakfast', label: '🌅 Breakfast' },
            { id: 'lunch', label: '🌞 Lunch' },
            { id: 'dinner', label: '🌙 Dinner' },
            { id: 'snack', label: '🍎 Snack' }
        ];

        return (
            <div className="meal-buttons">
                {mealTypes.map(meal => (
                    <button
                        key={meal.id}
                        type="button"
                        className={`meal-button ${formData.mealType === meal.id ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, mealType: meal.id})}
                    >
                        {meal.label}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="dashboard">
            <div className="nav-buttons">
                <button 
                    className={`nav-button ${activeSection === 'quest' ? 'active' : ''}`}
                    onClick={() => setActiveSection(activeSection === 'quest' ? '' : 'quest')}
                >
                    Create New Quest
                </button>
                <button 
                    className={`nav-button ${activeSection === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveSection(activeSection === 'tasks' ? '' : 'tasks')}
                >
                    View All Quests
                </button>
            </div>

            <div className={`section-container ${activeSection === 'quest' ? 'visible' : ''}`}>
                <div className="form-card">
                    <h2>Create New Quest</h2>
                    <div className="friend-email">
                        <input
                            type="email"
                            placeholder="Friend's Email (for penalties)"
                            value={formData.friendEmail}
                            onChange={(e) => setFormData({...formData, friendEmail: e.target.value})}
                            required
                        />
                    </div>
                    <form onSubmit={handleSubmit} className="quest-form">
                        <div className="button-row">
                            <button 
                                type="button" 
                                className={`nav-button ${formData.type === 'workout' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, type: 'workout'})}
                            >
                                Workout
                            </button>
                            <button 
                                type="button" 
                                className={`nav-button ${formData.type === 'knowledge' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, type: 'knowledge'})}
                            >
                                Knowledge
                            </button>
                            <button 
                                type="button" 
                                className={`nav-button ${formData.type === 'meal' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, type: 'meal'})}
                            >
                                Meal
                            </button>
                            <button 
                                type="button" 
                                className={`nav-button ${formData.type === 'homework' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, type: 'homework'})}
                            >
                                Homework
                            </button>
                        </div>

                        {renderMealButtons()}

                        <input
                            type="text"
                            placeholder={formData.type === 'meal' ? `Add ${formData.mealType} item` : "Quest Title"}
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />

                        {formData.type === 'workout' && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Sets"
                                    value={formData.sets}
                                    onChange={(e) => setFormData({...formData, sets: e.target.value})}
                                />
                                <input
                                    type="number"
                                    placeholder="Reps"
                                    value={formData.reps}
                                    onChange={(e) => setFormData({...formData, reps: e.target.value})}
                                />
                            </>
                        )}

                        {formData.type === 'knowledge' && (
                            <input
                                type="number"
                                placeholder="Duration (minutes)"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            />
                        )}

                        <input
                            type="time"
                            value={formData.deadline}
                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                            required
                        />

                        <button type="submit" className="btn submit-btn">Create Quest</button>
                        <button type="button" className="btn" onClick={readAllQuests}>🔊 Read All Quests</button>
                    </form>
                </div>
            </div>

            <div className={`section-container ${activeSection === 'tasks' ? 'visible' : ''}`}>
                <div className="left-column">
                    <h2>Workout & Knowledge</h2>
                    {tasks
                        .filter(task => ['workout', 'knowledge'].includes(task.type))
                        .map(task => (
                            <div 
                                key={task.id} 
                                className={`quest-card ${task.completed ? 'completed' : ''} ${isTaskOverdue(task) ? 'overdue' : ''}`}
                            >
                                <div className="quest-header">
                                    <span className="quest-type">{task.type.toUpperCase()}</span>
                                    <span className="quest-xp">+{task.xp} XP</span>
                                </div>
                                <h3>{task.title}</h3>
                                {task.type === 'workout' && (
                                    <p>{task.sets} sets × {task.reps} reps</p>
                                )}
                                {task.type === 'knowledge' && (
                                    <p>Duration: {task.duration} mins</p>
                                )}
                                <p>Due: {task.deadline}</p>
                                {!task.completed && (
                                    <button 
                                        className="btn complete-btn"
                                        onClick={() => completeTask(task.id)}
                                    >
                                        Complete
                                    </button>
                                )}
                                {isTaskOverdue(task) && !task.completed && (
                                    <div className="penalty-alert">
                                        Pay ${task.penalty} to {task.friendEmail}!
                                    </div>
                                )}
                            </div>
                        ))}
                </div>

                <div className="right-column">
                    <h2>Meals & Homework</h2>
                    {tasks
                        .filter(task => ['meal', 'homework'].includes(task.type))
                        .map(task => (
                            <div 
                                key={task.id} 
                                className={`quest-card ${task.completed ? 'completed' : ''} ${isTaskOverdue(task) ? 'overdue' : ''}`}
                            >
                                <div className="quest-header">
                                    <span className="quest-type">{task.type.toUpperCase()}</span>
                                    <span className="quest-xp">+{task.xp} XP</span>
                                </div>
                                <h3>{task.title}</h3>
                                {task.type === 'meal' && (
                                    <p>Type: {task.mealType}</p>
                                )}
                                <p>Due: {task.deadline}</p>
                                {!task.completed && (
                                    <button 
                                        className="btn complete-btn"
                                        onClick={() => completeTask(task.id)}
                                    >
                                        Complete
                                    </button>
                                )}
                                {isTaskOverdue(task) && !task.completed && (
                                    <div className="penalty-alert">
                                        Pay ${task.penalty} to {task.friendEmail}!
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};