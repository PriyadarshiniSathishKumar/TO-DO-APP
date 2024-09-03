document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (storedTasks.length) {
        tasks = storedTasks;
        updateTasksList();
        updateStats();
    }
});

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        updateTasksList();
        updateStats();
        saveTasks();
        taskInput.value = '';  // Clear the input field
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
}

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
}

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text;
    deleteTask(index);
}

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : (completeTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progress');

    progressBar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completeTasks} / ${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blastConfetti();
    }
};

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="edit.png" onClick="editTask(${index})" alt="Edit"/>
                    <img src="bin.png" onClick="deleteTask(${index})" alt="Delete"/>
                </div>
            </div>
        `;
        listItem.querySelector(".checkbox").addEventListener("change", () => toggleTaskComplete(index));
        taskList.appendChild(listItem);
    });
};

document.getElementById("newTask").addEventListener("click", function(e) {
    e.preventDefault();
    addTask();
});

// Confetti effect integration
const fireConfetti = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};

const blastConfetti = () => {
    // Clear previous confetti
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = ''; // Remove any existing canvas

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    const ctx = canvas.getContext('2d');
    confettiContainer.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Adjust the z-index to ensure it's on top
    confettiContainer.style.zIndex = 9999;

    // Execute the confetti function
    fireConfetti();

    // Remove the canvas after 3 seconds
    setTimeout(() => {
        confettiContainer.removeChild(canvas);
    }, 3000); // 3 seconds
};
