const themeToggle = document.getElementById('theme-toggle');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');

// Load theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');

    // Reapply dark mode styling to tasks
    Array.from(todoList.children).forEach(task => {
        if (document.body.classList.contains('dark-mode')) {
            task.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--bg-dark');
            task.style.color = getComputedStyle(document.body).getPropertyValue('--text-light');
        } else {
            task.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--bg-light');
            task.style.color = getComputedStyle(document.body).getPropertyValue('--text-dark');
        }
    });
});


function addTask(title, description, priority, dueDate) {
    const task = document.createElement('li');
    task.className = 'task';
    task.dataset.priority = priority;
    task.innerHTML = `
        <div>
            <strong>${title}</strong>
            <small>${description}</small>
            <span>Due: ${new Date(dueDate).toLocaleDateString('en-US')}</span>
        </div>
        <button class="delete">&times;</button>
    `;

    // Swipe-to-delete (mobile)
    let touchStartX = 0;
    task.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    task.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 100) {
            removeTask(task);
        }
    });

    // Delete button (desktop)
    task.querySelector('.delete').addEventListener('click', () => removeTask(task));

    todoList.appendChild(task);
    saveTasks();
}

function removeTask(task) {
    task.classList.add('removing');
    setTimeout(() => {
        task.remove();
        saveTasks();
    }, 300);
}

function saveTasks() {
    const tasks = Array.from(todoList.children).map(task => ({
        title: task.querySelector('strong').textContent,
        description: task.querySelector('small').textContent,
        priority: task.dataset.priority,
        dueDate: task.querySelector('span').textContent.replace('Due: ', '')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => addTask(task.title, task.description, task.priority, task.dueDate));
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const dueDate = document.getElementById('due-date').value;
    addTask(title, description, priority, dueDate);
    todoForm.reset();
});

loadTasks();
