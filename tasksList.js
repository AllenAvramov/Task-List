//-- Global Tasks storage array
let tasks = [];

//--Priority order Values for sorting
const priorityOrder = {
    'High': 3,
    'Normal': 2,
    'Low': 1
};


// Function to add new task
function addTask() {
    const taskNameInput = document.getElementById('taskNameInput');
    const prioritySelect = document.getElementById('prioritySelect');

    //--No Input name--
    if (taskNameInput.value === '') {
        alert('Please enter a task name');
        return;
    }

    //--Create new Task Object
    const newTask = {
        id: crypto.randomUUID(),
        name: taskNameInput.value,
        priority: prioritySelect.value,
        status: 'Pending'
    };

    tasks.push(newTask);
    displayTasks();

    //--Clean Inputs 
    taskNameInput.value = '';
    prioritySelect.value = 'Normal';
}


function applySorting() {
    const prioritySortSelect = document.getElementById('prioritySortSelect').value;

    let sortedTasks = [...tasks];

    if (prioritySortSelect === 'highToLow') {
        sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (prioritySortSelect === 'lowToHigh') {
        sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    

    displayTasks(sortedTasks);
}


function applyStatusFilter() {
    const statusPending = document.getElementById('statusPending').checked;
    const statusInwork = document.getElementById('statusInwork').checked;
    const statusFinishwork = document.getElementById('statusFinishwork').checked;

    const filteredTasks = tasks.filter(task => {
        if (task.status === 'Pending' && statusPending) return true;
        if (task.status === 'In Work' && statusInwork) return true;
        if (task.status === 'Finished' && statusFinishwork) return true;
        return false;
    });

    displayTasks(filteredTasks);
}

//--display Task with default global all tasks
function displayTasks(tasksToRender = tasks) {
    //Get Table
    const taskList = document.getElementById('taskList');
    // Clear existing rows Content for rerender data
    taskList.innerHTML = ''; 
    
    tasksToRender.forEach((task) => {
        let priorityClass = '';
        if (task.priority === 'Low') priorityClass = 'priority-low';
        if (task.priority === 'Normal') priorityClass = 'priority-normal';
        if (task.priority === 'High') priorityClass = 'priority-high';

        let statusClass = '';
        if (task.status === 'Pending') statusClass = 'status-pending';
        if (task.status === 'In Work') statusClass = 'status-in-work';
        if (task.status === 'Finished') statusClass = 'status-finished';


        const row = `
            <tr class="${priorityClass}">
                <td>${task.id.substr(0, 8)}</td>
                <td>${task.name}</td>
                <td>
                    <span class="badge bg-secondary">
                        ${task.priority}
                    </span>
                </td>
                <td>
                    <span class="badge ${statusClass} dropdown-toggle" 
                          data-bs-toggle="dropdown" 
                          aria-expanded="false">
                        ${task.status}
                    </span>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="changeStatus('${task.id}', 'Pending')">Pending</a></li>
                        <li><a class="dropdown-item" href="#" onclick="changeStatus('${task.id}', 'In Work')">In Work</a></li>
                        <li><a class="dropdown-item" href="#" onclick="changeStatus('${task.id}', 'Finished')">Finished</a></li>
                    </ul>
                </td>
                <td>
                    <button onclick="deleteTask('${task.id}')" class="btn btn-danger btn-sm">
                        Delete
                    </button>
                </td>
            </tr>
        `;
        taskList.innerHTML += row;
    });
}


function changeStatus(taskId, newStatus) {
    tasks = tasks.map(task => {
        if (task.id === taskId)
            return {...task, status: newStatus}
        return task;
    })
    displayTasks();
}


// Function to delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    displayTasks();
}

// Initial render
renderTasks();
