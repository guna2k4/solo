const DailyQuests = () => {
    const [quests, setQuests] = React.useState(() => {
        const savedQuests = localStorage.getItem('dailyQuests');
        if (savedQuests) {
            return JSON.parse(savedQuests);
        }
        return generateDailyQuests();
    });

    function generateDailyQuests() {
        const questTemplates = [
            { text: "Do 50 pushups", xp: 50, type: "workout" },
            { text: "Run 2km", xp: 70, type: "workout" },
            { text: "Plan your meals for tomorrow", xp: 30, type: "meal" },
            { text: "Learn 5 new English words", xp: 40, type: "knowledge" },
            { text: "Complete homework assignment", xp: 60, type: "homework" }
        ];

        return questTemplates.map(quest => ({
            ...quest,
            id: Date.now() + Math.random(),
            completed: false
        }));
    }

    React.useEffect(() => {
        // Check if quests need to be reset (4 AM)
        const now = new Date();
        const lastReset = localStorage.getItem('lastQuestReset');
        const resetTime = new Date();
        resetTime.setHours(4, 0, 0, 0);

        if (!lastReset || new Date(lastReset) < resetTime) {
            const newQuests = generateDailyQuests();
            setQuests(newQuests);
            localStorage.setItem('lastQuestReset', now.toISOString());
        }

        localStorage.setItem('dailyQuests', JSON.stringify(quests));
    }, [quests]);

    const completeQuest = (questId) => {
        setQuests(quests.map(quest => {
            if (quest.id === questId && !quest.completed) {
                // Add XP to the system
                const currentXp = JSON.parse(localStorage.getItem('xp') || '0');
                localStorage.setItem('xp', JSON.stringify(currentXp + quest.xp));
                
                return { ...quest, completed: true };
            }
            return quest;
        }));
    };

    return (
        <div className="quest-popup">
            <h3>Daily Quests</h3>
            <ul className="quest-list">
                {quests.map(quest => (
                    <li key={quest.id} className={`quest-item ${quest.completed ? 'completed' : ''}`}>
                        <span>{quest.text} (+{quest.xp} XP)</span>
                        {!quest.completed && (
                            <button 
                                className="btn"
                                onClick={() => completeQuest(quest.id)}
                            >
                                Complete
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};