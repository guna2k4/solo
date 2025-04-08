const App = () => {
    return (
        <div className="container">
            <XPSystem />
            <TaskList />
            <WorkoutTracker />
            <MealPlanner />
            <KnowledgeTracker />
            <HomeworkReminder />
            <VoiceRecorder />
            <DailyQuests />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));