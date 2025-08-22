console.log("Script loaded successfully");

const todoForm = document.getElementById("todo-form");
const todotablebody = document.getElementById("todos-list-body");
const deleteAllButton = document.getElementById("delete-all-button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "pending";

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function rendertable (filterstatus=currentfilter) {
    todotablebody.innerHTML = "";
    let hasdata = false;

    const sortedTodos = todos.slice().reverse();

    sortedTodos.forEach((todo, index) => {
        if (filterstatus && filterstatus !== "all" && todo.status !== filterstatus) return;
        hasdata = true; 
        const tr=document.createElement("tr");
        tr.innerHTML= `
            <td class=px-4 py-2 text-left">${todo.task}</td>
            <td class="px-4 py-2 text-left">${todo.dueDate}</td>
            <td class="px-4 py-2">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${todo.status === "Pending" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}">${todo.status}</span>
            </td>
            <td class="px-4 py-2 flex gap-2">
                <button class="edit px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" tittle="edit"><i class="bi bi-pencil-square"></i></button>
                <button class="check px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" tittle="mark-completed"><i class="bi bi-check-fill"></i></button>
                <button class="delete px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" tittle="delete"><i class="bi bi-trash"></i>onclick="deleteTodo(${index})">Delete</button>
            </td>
            `;
        tr.querySelector(".edit").addEventListener("click",() => {
            const oldtask = todo.task;
            const olddate = todo.date;

            tr.cells[0].innerHTML = `
                <input type="text" value="${oldtask}"
                    class="edit-task w-full p-2 border rounded-lg ring-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-800 border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition-all duration-200">
            `;
            tr.cells[1].innerHTML = `
                <input type="date" value="${olddate}"
                    class="edit-date w-full p-2 border rounded-lg ring-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-800 border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition-all duration-200">
            `;
            tr.cells[2].innerHTML = `
                <div class="flex gap-2">
                    <button class="save px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" title="save">Save</button>
                    <button class="cancel px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600" title="cancel">Cancel</button>
                </div>
            `;
            tr.querySelector(".save").addEventListener("click", () => {
                const newTask = tr.querySelector(".edit-task").value.trim();
                const newDate = tr.querySelector(".edit-date").value;
                if (newTask && newDate) {
                    todo.task = newTask;
                    todo.dueDate = newDate;
                    todo.status = "Pending"; // Reset status to Pending after edit
                    saveTodos();
                    rendertable();
                } else {
                    alert("Please fill in both fields.");
                }
            });
            tr.querySelector(".cancel").addEventListener("click", () => {
                renderTable();
            });
        });
            tr.querySelector(".check").addEventListener("click", () => {
                todo.status = "Completed";
                saveTodos();
                renderTable();
        });
            tr.querySelector(".delete").addEventListener("click", () => {
                if (confirm("Are you sure you want to delete this todo?")) {
                    todos.splice(index, 1);
                    saveTodos();
                    renderTable();
                }
            });

            todotablebody.appendChild(tr);
        });
        if (!hasdata) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="4" class="text-center text-gray-500">No todos found</td>`;
            todotablebody.appendChild(tr);
        }
    }
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskinput = todoForm.task;
        const dateinput = todoForm.date;

        let valid = true;

        taskinput.classList.remove("border-red-500");
        dateinput.classList.remove("border-red-500");

        if (taskinput.value.trim() === "") {
            taskinput.classList.add("border-red-500");
            valid = false;
        }
        if (dateinput.value === "") {
            dateinput.classList.add("border-red-500");
            valid = false;
        } else {
            dateinput.classList.remove("border-red-500");
        }
        if (valid) {
            todos.push({
                task: taskinput.value.trim(),
                dueDate: dateinput.value,
                status: "Pending"
            });
            saveTodos();
            todoForm.reset();

            taskinput.classList.remove("border-red-500");
            dateinput.classList.remove("border-red-500");

            rendertable();
            showAlert("Todo added successfully!", "success");
        }
    });

    todoForm.task.addEventListener('input', e => {
    const input = e.target;
    input.classList.remove("ring-red-500", "ring-green-500");
    if (!input.value.trim()) input.classList.add("ring-red-500");
    else input.classList.add("ring-green-500");
});

todoForm.tanggal.addEventListener('input', e => {
    const input = e.target;
    input.classList.remove("ring-red-500", "ring-green-500");
    if (!input.value) input.classList.add("ring-red-500");
    else input.classList.add("ring-green-500");
});

function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    
    alertBox.className = "fixed top-15 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-sm px-6 py-4 rounded-lg shadow-lg text-white text-sm font-medium z-50";
    
    if (type === 'success') {
      alertBox.classList.add("bg-green-600");
    } else if (type === 'error') {
      alertBox.classList.add("bg-red-600");
    } else if (type === 'warning') {
      alertBox.classList.add("bg-yellow-600", "text-black");
    }
    
    alertBox.textContent = message;
    alertBox.classList.remove("hidden");

    setTimeout(() => {
      alertBox.classList.add("hidden");
    }, 3000);
}

deleteAllButton.addEventListener('click', () => {
  if (confirm('Apakah kamu yakin ingin menghapus semua task?')) {
    todos = [];
    saveTodos();
    rendertable();

    showAlert('✅ Semua task berhasil dihapus!', 'success');
  }
});

const filterBtn = document.getElementById('filterBtn');
const dropdown = document.querySelector('.dropdown');
const filterDropdown = document.getElementById('filterDropdown');

filterBtn.addEventListener('click', () => {
  filterDropdown.classList.toggle('hidden'); 
});

filterDropdown.querySelectorAll('a').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const status = item.getAttribute('data-status');
      currentFilter = status === 'All' ? null : status;
      renderTable(); 
      filterDropdown.classList.add('hidden'); 
    });
});

window.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      filterDropdown.classList.add('hidden');
    }
});

rendertable();

    

    


                
