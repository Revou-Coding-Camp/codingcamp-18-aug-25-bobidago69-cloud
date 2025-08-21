console.log ("Hello, World!");

let Listtodo = [];

function validateForm() {
    const taskinput = document.getElementById("task-input");
    const duedateinput = document.getElementById("due-date-input");

    if (textinput.value === "") {
        alert("Please enter a task.");
        return false;
    }

    // If the input is valid, you can proceed with form submission or further processing
    console.log("Valid input:", todoText);
    return true;
}
function addTodo(task, dueDate) {
    Listtodo.push(task);
    console.log ("Task added:", task);
    console.log (listtodo);
    }
}   