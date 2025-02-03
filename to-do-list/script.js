const listContainer = document.getElementById("task-list");
listContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-button")) {
        const listItem = event.target.parentNode;
        const taskText = listItem.querySelector("span:not(.delete-button)").textContent;

        if (confirm("Are you sure about deleting the task '" + taskText + "'?")) {
            listItem.remove();
            saveData();
        }
    }
});
listContainer.addEventListener("change", function(event) {
    if (event.target.type === "checkbox") {
        const listItem = event.target.parentNode;
        listItem.classList.toggle("completed");

        const deleteButton = listItem.querySelector(".delete-button");

        if (event.target.checked) {
            if (!deleteButton) {
                const deleteButton = document.createElement("span");
                deleteButton.textContent = "X";
                deleteButton.classList.add("delete-button");
                listItem.appendChild(deleteButton);
            }
        } else {
            if (deleteButton) {
                deleteButton.remove();
            }
        }
        saveData();
    }
});

document.getElementById("new-task").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById("new-task");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const taskList = document.getElementById("task-list");
        const newTask = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", function() {
            newTask.classList.toggle("completed");
            handleCheckboxChange(checkbox, newTask);
        });
        newTask.appendChild(checkbox);

        const taskTextSpan = document.createElement("span");
        taskTextSpan.textContent = taskText;
        newTask.appendChild(taskTextSpan);

        const timeSpan = document.createElement("span");
        timeSpan.classList.add("time-elapsed");
        newTask.appendChild(timeSpan);

        taskList.appendChild(newTask);
        taskInput.value = "";
        saveData();

        updateTimeElapsed(timeSpan);

        setInterval(function() {
            updateTimeElapsed(timeSpan);
        }, 60000);
    }
}
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showlist() {
    listContainer.innerHTML = localStorage.getItem("data") || "";

    const timeSpans = document.querySelectorAll('.time-elapsed');
    timeSpans.forEach(timeSpan => {
        updateTimeElapsed(timeSpan);

        setInterval(function() {
            updateTimeElapsed(timeSpan);
        }, 60000);
    });
}

function updateTimeElapsed(timeSpan) {
    const creationTime = timeSpan.dataset.creationTime || Date.now();
    timeSpan.dataset.creationTime = creationTime;

    const now = Date.now();
    const timeDiff = now - creationTime;

    const minutes = Math.round(timeDiff / (1000 * 60));
    const hours = Math.round(timeDiff / (1000 * 60 * 60));
    const days = Math.round(timeDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.round(timeDiff / (1000 * 60 * 60 * 24 * 7));
    const months = Math.round(timeDiff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.round(timeDiff / (1000 * 60 * 60 * 24 * 365));

    let elapsedText;
    if (minutes < 60) {
        elapsedText = `${minutes} minutes`;
    } else if (hours < 24) {
        elapsedText = `${hours} hours`;
    } else if (days < 7) {
        elapsedText = `${days} days`;
    } else if (weeks < 4) {
        elapsedText = `${weeks} weeks`;
    } else if (months < 12) {
        elapsedText = `${months} months`;
    } else {
        elapsedText = `${years} years`;
    }
    timeSpan.textContent = elapsedText;
}
showlist();