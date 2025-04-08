const KnowledgeTracker = () => {
    const [activities, setActivities] = React.useState(() => {
        const savedActivities = localStorage.getItem('knowledge');
        return savedActivities ? JSON.parse(savedActivities) : [];
    });
    const [newActivity, setNewActivity] = React.useState({ 
        activity: '', 
        type: 'book',
        duration: ''
    });

    React.useEffect(() => {
        localStorage.setItem('knowledge', JSON.stringify(activities));
    }, [activities]);

    const addActivity = (e) => {
        e.preventDefault();
        if (!newActivity.activity || !newActivity.duration) return;

        setActivities([...activities, {
            id: Date.now(),
            ...newActivity,
            date: new Date().toLocaleDateString()
        }]);
        setNewActivity({ activity: '', type: 'book', duration: '' });
    };

    return (
        <div className="card">
            <h2>Knowledge Improvement</h2>
            <form onSubmit={addActivity} className="input-group">
                <input
                    type="text"
                    value={newActivity.activity}
                    onChange={(e) => setNewActivity({...newActivity, activity: e.target.value})}
                    placeholder="Activity description"
                />
                <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                >
                    <option value="book">Book Reading</option>
                    <option value="speaking">Speaking Practice</option>
                    <option value="learning">Learning</option>
                </select>
                <input
                    type="number"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({...newActivity, duration: e.target.value})}
                    placeholder="Duration (minutes)"
                />
                <button type="submit" className="btn">Add Activity</button>
            </form>
            <ul className="knowledge-list">
                {activities.map(activity => (
                    <li key={activity.id} className="knowledge-item">
                        {activity.activity} - {activity.type} ({activity.duration} mins) - {activity.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};