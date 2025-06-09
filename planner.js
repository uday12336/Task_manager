document.addEventListener('DOMContentLoaded', () => {
    const plannerDate = document.getElementById('planner-date');
    const plannerDateInput = document.getElementById('planner-date-input');
    const plannerTime = document.getElementById('planner-time');
    const plannerTask = document.getElementById('planner-task');
    const addPlanner = document.getElementById('add-planner');
    const plannerList = document.getElementById('planner-list');
    let plannerTasks = JSON.parse(localStorage.getItem('plannerTasks')) || [];

    function renderPlanner(selectedDate = new Date()) {
        plannerDate.textContent = `Tasks for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
        plannerDateInput.value = selectedDate.toISOString().split('T')[0];
        plannerList.innerHTML = '';
        plannerTasks
            .filter(task => new Date(task.date).toDateString() === selectedDate.toDateString())
            .sort((a, b) => a.time.localeCompare(b.time))
            .forEach((task, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${task.time} - ${task.text}
                    <button onclick="deletePlannerTask(${index})">Delete</button>
                `;
                plannerList.appendChild(li);
            });
    }
    function savePlannerTasks() {
        localStorage.setItem('plannerTasks', JSON.stringify(plannerTasks));
    }
    addPlanner.addEventListener('click', () => {
        const date = plannerDateInput.value;
        const time = plannerTime.value;
        const text = plannerTask.value.trim();
        if (date && time && text) {
            plannerTasks.push({ date: new Date(date).toISOString(), time, text });
            plannerTime.value = '';
            plannerTask.value = '';
            renderPlanner(new Date(date));
            savePlannerTasks();
        }
    });
    plannerTask.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlanner.click();
    });
    plannerDateInput.addEventListener('change', () => {
        renderPlanner(new Date(plannerDateInput.value));
    });
    window.deletePlannerTask = (index) => {
        plannerTasks.splice(index, 1);
        renderPlanner(new Date(plannerDateInput.value));
        savePlannerTasks();
    };
    renderPlanner();
});