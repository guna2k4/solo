const MealPlanner = () => {
    const [meals, setMeals] = React.useState(() => {
        const savedMeals = localStorage.getItem('meals');
        return savedMeals ? JSON.parse(savedMeals) : [];
    });
    const [newMeal, setNewMeal] = React.useState({ name: '', type: 'breakfast' });

    React.useEffect(() => {
        localStorage.setItem('meals', JSON.stringify(meals));
    }, [meals]);

    const addMeal = (e) => {
        e.preventDefault();
        if (!newMeal.name) return;

        setMeals([...meals, {
            id: Date.now(),
            ...newMeal,
            date: new Date().toLocaleDateString()
        }]);
        setNewMeal({ name: '', type: 'breakfast' });
    };

    return (
        <div className="card">
            <h2>Meal Planner</h2>
            <form onSubmit={addMeal} className="input-group">
                <input
                    type="text"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                    placeholder="Meal name"
                />
                <select
                    value={newMeal.type}
                    onChange={(e) => setNewMeal({...newMeal, type: e.target.value})}
                >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                </select>
                <button type="submit" className="btn">Add Meal</button>
            </form>
            <ul className="meal-list">
                {meals.map(meal => (
                    <li key={meal.id} className="meal-item">
                        {meal.name} - {meal.type} ({meal.date})
                    </li>
                ))}
            </ul>
        </div>
    );
};