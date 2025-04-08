const HomeworkReminder = () => {
    const [homework, setHomework] = React.useState(() => {
        const savedHomework = localStorage.getItem('homework');
        return savedHomework ? JSON.parse(savedHomework) : [];
    });
    const [newHomework, setNewHomework] = React.useState({ 
        subject: '', 
        description: '',
        dueDate: ''
    });

    React.useEffect(() => {
        localStorage.setItem('homework', JSON.stringify(homework));
    }, [homework]);

    const addHomework = (e) => {
        e.preventDefault();
        if (!newHomework.subject || !newHomework.description || !newHomework.dueDate) return;

        setHomework([...homework, {
            id: Date.now(),
            ...newHomework,
            completed: false
        }]);
        setNewHomework({ subject: '', description: '', dueDate: '' });
    };

    const toggleHomework = (id) => {
        setHomework(homework.map(item => 
            item.id === id ? {...item, completed: !item.completed} : item
        ));
    };

    return (
        <div className="card">
            <h2>Homework Reminders</h2>
            <form onSubmit={addHomework} className="input-group">
                <input
                    type="text"
                    value={newHomework.subject}
                    onChange={(e) => setNewHomework({...newHomework, subject: e.target.value})}
                    placeholder="Subject"
                />
                <input
                    type="text"
                    value={newHomework.description}
                    onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
                    placeholder="Description"
                />
                <input
                    type="date"
                    value={newHomework.dueDate}
                    onChange={(e) => setNewHomework({...newHomework, dueDate: e.target.value})}
                />
                <button type="submit" className="btn">Add Homework</button>
            </form>
            <ul className="homework-list">
                {homework.map(item => (
                    <li key={item.id} className="homework-item">
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleHomework(item.id)}
                        />
                        <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                            {item.subject} - {item.description} (Due: {item.dueDate})
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};