const todoForm = document.getElementById('todoForm');
const todoTableBody = document.getElementById('todoTableBody');
const deleteAllBtn = document.getElementById('deleteAllBtn');

let todos = JSON.parse(localStorage.getItem('todos')) || []; 
let currentFilter = 'Pending'; 

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTable(filterStatus = currentFilter) {
  todoTableBody.innerHTML = '';
  let hasData = false; 

  const sortedTodos = todos.slice().reverse();

  sortedTodos.forEach((todo, index) => {
    if (filterStatus && filterStatus !== 'All' && todo.status !== filterStatus) return;

    hasData = true; 
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-2 py-2 w-[400px]">${todo.task}</td>
      <td class="px-2 py-2">${todo.date}</td>
      <td class="px-2 py-2">
        <span class="px-2 py-1 text-xs font-semibold rounded-full 
                    ${todo.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:text-yellow-100' 
                        : 'bg-green-100 text-green-800 dark:bg-green-500 dark:text-green-100'}">
          ${todo.status}
        </span>
      </td>
      <td class="px-2 py-2 flex gap-2">
        <button class="edit px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" title="edit"><i class="bi bi-pencil-square"></i></button>
        <button class="check px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600" title="mark-complete"><i class="bi bi-check-circle-fill"></i></button>
        <button class="delete px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" title="delete"><i class="bi bi-trash"></i></button>
      </td>
    `;

    tr.querySelector('.edit').addEventListener('click', () => {
      const oldTask = todo.task;
      const oldDate = todo.date;

      tr.cells[0].innerHTML = `
        <input type="text" value="${oldTask}" 
          class="edit-task w-full px-2 py-1 border border-gray-300 dark:border-gray-600 
                rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none 
                dark:bg-gray-700 dark:text-gray-100">
      `;
      tr.cells[1].innerHTML = `
        <input type="date" value="${oldDate}" 
          class="edit-date w-full px-2 py-1 border border-gray-300 dark:border-gray-600 
                rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none 
                dark:bg-gray-700 dark:text-gray-100">
      `;

      tr.cells[3].innerHTML = `
        <div class="flex gap-2">
          <button class="save px-3 py-1 bg-green-500 text-white text-sm rounded-lg 
                        hover:bg-green-600 focus:outline-none focus:ring-2 
                        focus:ring-green-400">Simpan</button>
          <button class="cancel px-3 py-1 bg-gray-400 text-white text-sm rounded-lg 
                          hover:bg-gray-500 focus:outline-none focus:ring-2 
                          focus:ring-gray-300">Batal</button>
        </div>
      `;


      tr.querySelector('.save').addEventListener('click', () => {
        const newTask = tr.querySelector('.edit-task').value.trim();
        const newDate = tr.querySelector('.edit-date').value;
        if (newTask && newDate) {
          todo.task = newTask;
          todo.date = newDate;
          todo.status = 'Pending'; 
          saveTodos();
          renderTable();

          showAlert('✅ Task berhasil diperbarui!', 'success');
        } else {
          alert('Task dan tanggal tidak boleh kosong!');
        }
      });

      tr.querySelector('.cancel').addEventListener('click', () => {
        renderTable(); 
      });
    });

    tr.querySelector('.check').addEventListener('click', () => {
      todo.status = 'Completed';
      saveTodos();
      renderTable();
    });

    tr.querySelector('.delete').addEventListener('click', () => {
      if (confirm('Apakah kamu yakin ingin menghapus task ini?')) {

        const originalIndex = todos.findIndex(t => t === todo);
        todos.splice(originalIndex, 1);
        saveTodos();
        renderTable();

        showAlert('✅ Task berhasil dihapus!', 'success');
      }
    });

    todoTableBody.appendChild(tr);
  });

  if (!hasData) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" class="text-lg text-center text-gray-300">No task found</td>`;
    todoTableBody.appendChild(tr);
  }
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskInput = todoForm.task;
    const dateInput = todoForm.tanggal;

    let valid = true;

    taskInput.classList.remove("ring-red-500", "ring-green-500");
    dateInput.classList.remove("ring-red-500", "ring-green-500");

    if (taskInput.value.trim() === "") {
        taskInput.classList.add("ring-red-500");
        valid = false;
    } else {
        taskInput.classList.add("ring-green-500");
    }

    if (dateInput.value === "") {
        dateInput.classList.add("ring-red-500");
        valid = false;
    } else {
        dateInput.classList.add("ring-green-500");
    }

    if (valid) {
        todos.push({ task: taskInput.value.trim(), date: dateInput.value, status: 'Pending' });
        saveTodos();
        todoForm.reset();

        taskInput.classList.remove("ring-green-500", "ring-red-500");
        dateInput.classList.remove("ring-green-500", "ring-red-500");

        renderTable();
        showAlert('✅ Task berhasil ditambahkan!', 'success');
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

deleteAllBtn.addEventListener('click', () => {
  if (confirm('Apakah kamu yakin ingin menghapus semua task?')) {
    todos = [];
    saveTodos();
    renderTable();

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

renderTable();