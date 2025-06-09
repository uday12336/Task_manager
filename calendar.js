document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('current-month-year');
    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    let plannerTasks = JSON.parse(localStorage.getItem('plannerTasks')) || [];

    function renderCalendar() {
        calendar.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYear.textContent = `${currentDate.toLocaleString('en-US', { month: 'long' })} ${year}`;

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'header');
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day');
            calendar.appendChild(emptyDay);
        }
        for (let i = 1; i <= lastDate; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;
            const dateStr = new Date(year, month, i).toDateString();
            if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                dayElement.classList.add('today');
            }
            if (plannerTasks.some(task => new Date(task.date).toDateString() === dateStr)) {
                dayElement.style.background = '#f1c40f';
                dayElement.style.color = 'white';
            }
            dayElement.addEventListener('click', () => alert(`Tasks for ${dateStr}:\n${plannerTasks.filter(task => new Date(task.date).toDateString() === dateStr).map(task => `${task.time} - ${task.text}`).join('\n') || 'No tasks'}`));
            calendar.appendChild(dayElement);
        }
    }
    renderCalendar();
    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});