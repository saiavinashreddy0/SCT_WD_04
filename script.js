let tasks = [];
let currentFilter = 'all';

const todoForm = document.getElementById('todoForm');
const taskTextInput = document.getElementById('taskText');
const taskDateTimeInput = document.getElementById('taskDateTime');
const submitBtn = document.getElementById('submitBtn');
const editingTaskId = document.getElementById('editingTaskId');
const taskList = document.getElementById('taskList');
const filterTabs = document.querySelectorAll('.tab-btn');

// Initialize event handling
todoForm.addEventListener('submit', handleTaskSubmit);
filterTabs.forEach(tab => tab.addEventListener('click', handleFilterChange));

function handleTaskSubmit(e) {
    e.preventDefault();

    const text = taskTextInput.value.trim();
    const dateTime = taskDateTimeInput.value;
    const taskId = editingTaskId.value;

    if (taskId) {
        // Edit Mode: Update existing object array profile
        tasks = tasks.map(task => task.id === taskId ? { ...task, text, dateTime } : task);
        submitBtn.textContent = 'Add Task ⚡';
        editingTaskId.value = '';
    } else {
        // Build Mode: Push fresh structured item context
        const newTask = {
            id: Date.now().toString(),
            text,
            dateTime,
            completed: false
        };
        tasks.push(newTask);
    }

    todoForm.reset();
    renderTasks();
}

function toggleTaskComplete(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    renderTasks();
}

function startEditTask(id) {
    const targetTask = tasks.find(task => task.id === id);
    if (!targetTask) return;

    taskTextInput.value = targetTask.text;
    taskDateTimeInput.value = targetTask.dateTime;
    editingTaskId.value = targetTask.id;
    submitBtn.textContent = 'Update ✓';
    taskTextInput.focus();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function handleFilterChange(e) {
    filterTabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.getAttribute('data-filter');
    renderTasks();
}

function formatDisplayDate(dateTimeString) {
    if (!dateTimeString) return '';
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
}

function renderTasks() {
    taskList.innerHTML = '';

    // Filter array mapping segments safely
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<li class="empty-alert">No records found within this track.</li>`;
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-card ${task.completed ? 'completed-state' : ''}`;
        
        li.innerHTML = `
            <div class="task-details">
                <span class="task-title">${task.text}</span>
                <span class="task-schedule">⏱ ${formatDisplayDate(task.dateTime)}</span>
            </div>
            <div class="task-actions">
                <button class="action-btn btn-complete" onclick="toggleTaskComplete('${task.id}')" title="Mark Completed">✓</button>
                <button class="action-btn btn-edit" onclick="startEditTask('${task.id}')" title="Edit Item">✎</button>
                <button class="action-btn btn-delete" onclick="deleteTask('${task.id}')" title="Purge Record">✕</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}