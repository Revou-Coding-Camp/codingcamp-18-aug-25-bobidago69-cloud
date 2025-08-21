console.log("Script loaded successfully");

let listtodo = [];

// Function form input
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
    }
}

// Function to add a new todo
function addtodo(task, dueDate) {        
    listtodo.push({
        task: task, 
        dueDate: dueDate
    });
    console.log("task added"), task;
    console.log(listtodo);

    rendertodolist();
}

// Function to render the todo list
function rendertodolist() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the existing list


    for (let i = 0; i < listtodo.length; i++) {
        taskList.innerHTML += `<li class="border-b py-2">${listtodo[i].task} - due: ${listtodo[i].dueDate}</li>`;   
}
}

// Function to Delete all todos
function deletaAll() {
    listtodo = [];
    console.log("All tasks deleted");
    
    rendertodolist();
}

// Function to filter todos
function filter() {
}   
    
        