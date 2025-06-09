document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTodo = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');
    let todos = JSON.parse(localStorage.getItem('todosArray')) || [];

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${todo.text}
                <button onclick="deleteTodo(${index})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }
    function saveTodos() {
        localStorage.setItem('todosArray', JSON.stringify(todos));
    }
    addTodo.addEventListener('click', () => {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text });
            todoInput.value = '';
            renderTodos();
            saveTodos();
        }
    });
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo.click();
    });
    window.deleteTodo = (index) => {
        todos.splice(index, 1);
        renderTodos();
        saveTodos();
    };
    renderTodos();

    // Timer and Alarm
    const timerDisplay = document.getElementById('timer-display');
    const timerMinutes = document.getElementById('timer-minutes');
    const startTimer = document.getElementById('start-timer');
    const resetTimer = document.getElementById('reset-timer');
    let timerInterval = null;
    let secondsLeft = 0;

    function updateTimerDisplay() {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    startTimer.addEventListener('click', () => {
        if (!timerInterval) {
            const minutes = parseInt(timerMinutes.value) || 0;
            secondsLeft = minutes * 60;
            if (secondsLeft > 0) {
                timerInterval = setInterval(() => {
                    if (secondsLeft <= 0) {
                        clearInterval(timerInterval);
                        timerInterval = null;
                        alert('Timer finished!');
                        return;
                    }
                    secondsLeft--;
                    updateTimerDisplay();
                }, 1000);
                updateTimerDisplay();
            }
        }
    });

    resetTimer.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        secondsLeft = 0;
        updateTimerDisplay();
        timerMinutes.value = '';
    });
});