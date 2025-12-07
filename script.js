let tasks = [
    {
        id: 1,
        name: "Melhorar consulta SQL na rota api GET /tasks",
        tag: "backend",
        isComplete: false,
        createdAt: new Date().toLocaleDateString('pt-BR')
    },
    {
        id: 2,
        name: "Corrigir chamada de função botão de enviar tarefa",
        tag: "frontend",
        isComplete: false,
        createdAt: new Date().toLocaleDateString('pt-BR')
    },
    {
        id: 3,
        name: "Testar nova funcionalidade de qualificação de tarefa",
        tag: "tester",
        isComplete: false,
        createdAt: new Date().toLocaleDateString('pt-BR')
    }
];

/**
 * Salva tarefas no localStorage
 * @param {Array} tasksToSave - Array de tarefas
 */
function setTasksInLocalStorage(tasksToSave) {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasksToSave));
        console.log('Tarefas salvas no localStorage:', tasksToSave);
    } catch (error) {
        console.error('Erro ao salvar tarefas no localStorage:', error);
    }
}

/**
 * Recupera tarefas do localStorage
 * @returns {Array} - Array de tarefas ou array vazio
 */
function getTasksFromLocalStorage() {
    try {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks);
            console.log('Tarefas recuperadas do localStorage:', parsedTasks);
            return parsedTasks;
        }
        return [];
    } catch (error) {
        console.error('Erro ao recuperar tarefas do localStorage:', error);
        return [];
    }
}

/**
 * Atualiza o status de conclusão de uma tarefa
 * @param {Number} taskId - ID da tarefa
 */
function updateTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].isComplete = !tasks[taskIndex].isComplete;
        setTasksInLocalStorage(tasks);
        renderTasks();
        updateTaskCounter();
        console.log(`Tarefa ${taskId} atualizada:`, tasks[taskIndex]);
    } else {
        console.warn(`Tarefa com ID ${taskId} não encontrada`);
    }
}

/**
 * Adiciona uma nova tarefa
 */
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const tagInput = document.getElementById('tagInput');

    const taskName = taskInput.value.trim();
    const tagName = tagInput.value.trim();

    if (!taskName || !tagName) {
        alert('Por favor, preencha o nome da tarefa e a etiqueta');
        return;
    }

    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        name: taskName,
        tag: tagName,
        isComplete: false,
        createdAt: new Date().toLocaleDateString('pt-BR')
    };

    tasks.push(newTask);
    setTasksInLocalStorage(tasks);
    renderTasks();
    updateTaskCounter();

    // Limpar inputs
    taskInput.value = '';
    tagInput.value = '';
    taskInput.focus();

    console.log('Nova tarefa adicionada:', newTask);
}

/**
 * Renderiza a lista de tarefas no DOM
 */
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state"><p>Nenhuma tarefa adicionada. Crie uma nova tarefa para começar!</p></div>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.isComplete ? 'completed' : ''}`;
        li.id = `task-${task.id}`;

        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        const taskHeader = document.createElement('div');
        taskHeader.className = 'task-header';

        const taskTitle = document.createElement('h3');
        taskTitle.className = 'task-title';
        taskTitle.textContent = task.name;

        taskHeader.appendChild(taskTitle);

        const taskFooter = document.createElement('div');
        taskFooter.className = 'task-footer';

        const taskTag = document.createElement('span');
        taskTag.className = 'task-tag';
        taskTag.textContent = task.tag;

        const taskDate = document.createElement('p');
        taskDate.className = 'task-date';
        taskDate.textContent = `Criado em: ${task.createdAt}`;

        taskFooter.appendChild(taskTag);
        taskFooter.appendChild(taskDate);

        taskContent.appendChild(taskHeader);
        taskContent.appendChild(taskFooter);

        // Botão de conclusão ou check
        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn btn-complete';
        completeBtn.id = `complete-btn-${task.id}`;

        if (task.isComplete) {
            const img = document.createElement('img');
            img.src = 'assets/checked.png';
            img.alt = 'Tarefa concluída';
            img.style.width = '20px';
            img.style.height = '20px';
            completeBtn.appendChild(img);
            completeBtn.classList.add('icon-only');
        } else {
            completeBtn.textContent = 'Concluir';
        }

        completeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateTask(task.id);
        });

        li.appendChild(taskContent);
        li.appendChild(completeBtn);

        tasksList.appendChild(li);
    });
}

/**
 * Atualiza o contador de tarefas concluídas
 */
function updateTaskCounter() {
    const completedCount = tasks.filter(task => task.isComplete).length;
    const completedCountElement = document.getElementById('completedCount');
    const completedLabelElement = document.getElementById('completedLabel');

    completedCountElement.textContent = completedCount;
    completedLabelElement.textContent = completedCount === 1 ? 'tarefa concluída' : 'tarefas concluídas';
}


/**
 * Inicializa a aplicação
 */
function initApp() {
    // Recuperar tarefas do localStorage
    const storedTasks = getTasksFromLocalStorage();

    if (storedTasks.length > 0) {
        tasks = storedTasks;
    } else {
        // Se não há tarefas no localStorage, salvar as iniciais
        setTasksInLocalStorage(tasks);
    }

    // Renderizar tarefas
    renderTasks();
    updateTaskCounter();

    // Event listeners
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const tagInput = document.getElementById('tagInput');

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addTask);
    }

    // Permitir adicionar tarefa pressionando Enter no input
    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }

    if (tagInput) {
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }

    console.log('Aplicação inicializada com sucesso');
}

// ========================================
// EXECUTAR INICIALIZAÇÃO AO CARREGAR O DOM
// ========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
