const WorkoutTracker = () => {
    const [workouts, setWorkouts] = React.useState(() => {
        const savedWorkouts = localStorage.getItem('workouts');
        return savedWorkouts ? JSON.parse(savedWorkouts) : [];
    });
    const [newWorkout, setNewWorkout] = React.useState({ exercise: '', sets: '', reps: '' });

    React.useEffect(() => {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }, [workouts]);

    const addWorkout = (e) => {
        e.preventDefault();
        if (!newWorkout.exercise || !newWorkout.sets || !newWorkout.reps) return;

        setWorkouts([...workouts, {
            id: Date.now(),
            ...newWorkout,
            date: new Date().toLocaleDateString()
        }]);
        setNewWorkout({ exercise: '', sets: '', reps: '' });
    };

    return (
        <div className="card">
            <h2>Workout Tracker</h2>
            <form onSubmit={addWorkout} className="input-group">
                <input
                    type="text"
                    value={newWorkout.exercise}
                    onChange={(e) => setNewWorkout({...newWorkout, exercise: e.target.value})}
                    placeholder="Exercise name"
                />
                <input
                    type="number"
                    value={newWorkout.sets}
                    onChange={(e) => setNewWorkout({...newWorkout, sets: e.target.value})}
                    placeholder="Sets"
                />
                <input
                    type="number"
                    value={newWorkout.reps}
                    onChange={(e) => setNewWorkout({...newWorkout, reps: e.target.value})}
                    placeholder="Reps"
                />
                <button type="submit" className="btn">Add Workout</button>
            </form>
            <ul className="workout-list">
                {workouts.map(workout => (
                    <li key={workout.id} className="workout-item">
                        {workout.exercise} - {workout.sets} sets x {workout.reps} reps ({workout.date})
                    </li>
                ))}
            </ul>
        </div>
    );
};