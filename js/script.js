console.log("Script loaded successfully");

let listtodo = [];

function validateForm() {
    const taskInput = document.getElementById("task-input");
    const dueDateInput = document.getElementById("due-date-input");

    if (taskInput.value === "") {
        alert("Please enter a task.");
        return false;
    }
    if (dueDateInput.value === "") {
        alert("Please enter a due date.");
        return false;
    } else {
        addtodo(taskInput.value, dueDateInput.value);

    addTask(taskInput, dueDateInput);
}

function addtodo(task, dueDate) {        
    listtodo.push(task);
    console.log("task"), task);
}