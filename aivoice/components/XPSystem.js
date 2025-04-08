const XPSystem = () => {
    const [xp, setXp] = React.useState(() => {
        const savedXp = localStorage.getItem('xp');
        return savedXp ? JSON.parse(savedXp) : 0;
    });
    const [level, setLevel] = React.useState(() => {
        const savedLevel = localStorage.getItem('level');
        return savedLevel ? JSON.parse(savedLevel) : 1;
    });

    const xpNeededForNextLevel = level * 100;
    const xpPercentage = (xp / xpNeededForNextLevel) * 100;

    const getTitleForLevel = (level) => {
        if (level < 5) return "Rookie Hunter";
        if (level < 10) return "Skilled Hunter";
        if (level < 15) return "Elite Hunter";
        if (level < 20) return "S-Rank Hunter";
        return "Shadow Monarch";
    };

    React.useEffect(() => {
        localStorage.setItem('xp', JSON.stringify(xp));
        localStorage.setItem('level', JSON.stringify(level));

        if (xp >= xpNeededForNextLevel) {
            const newLevel = level + 1;
            setLevel(newLevel);
            setXp(xp - xpNeededForNextLevel);
            
            // Show level up popup
            const popup = document.createElement('div');
            popup.className = 'level-up-popup';
            popup.innerHTML = `
                <h2>LEVEL UP!</h2>
                <p>You are now level ${newLevel}</p>
                <p>${getTitleForLevel(newLevel)}</p>
            `;
            document.body.appendChild(popup);
            
            // Play sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));

            setTimeout(() => {
                popup.remove();
            }, 3000);
        }
    }, [xp, level, xpNeededForNextLevel]);

    return (
        <div className="header">
            <div className="level-display">
                Level {level} - {getTitleForLevel(level)}
            </div>
            <h1>Solo Leveling Tracker</h1>
            <div className="xp-bar-container">
                <div className="xp-bar" style={{ width: `${xpPercentage}%` }}></div>
            </div>
        </div>
    );
};