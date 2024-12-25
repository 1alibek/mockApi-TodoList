const apiUrl = "https://676b9e09bc36a202bb851c2c.mockapi.io/n17/todo"; // MockAPI URL

document.getElementById("addTodoBtn").addEventListener("click", addTodo);
document.getElementById("search").addEventListener("input", searchTodos);

async function loadTodos() {
  try {
    const response = await fetch(apiUrl);
    const todos = await response.json();
    displayTodos(todos);
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

function displayTodos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", todo.completed);
    li.innerHTML = `
      <span>${todo.name}</span>
      <span class="time">${new Date(todo.createdAt).toLocaleString()}</span>
      <button onclick="editTodo(${todo.id})">Edit</button>
      <button onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    todoList.appendChild(li);
  });
}

async function addTodo() {
  const todoText = document.getElementById("todoText").value.trim();
  if (todoText !== "") {
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: todoText,
          completed: false,
          createdAt: new Date().toISOString(),
        }),
      });
      document.getElementById("todoText").value = "";
      loadTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }
}

async function toggleCompletion(todoId) {
  try {
    const response = await fetch(`${apiUrl}/${todoId}`);
    const todo = await response.json();
    const updatedTodo = { ...todo, completed: !todo.completed };
    await fetch(`${apiUrl}/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });
    loadTodos();
  } catch (error) {
    console.error("Error marking todo as completed:", error);
  }
}

async function editTodo(todoId) {
  const newText = prompt("Vazifani tahrirlang:");
  if (newText) {
    try {
      const response = await fetch(`${apiUrl}/${todoId}`);
      const todo = await response.json();
      const updatedTodo = {
        ...todo,
        name: newText,
        createdAt: new Date().toISOString(), 
      };
      await fetch(`${apiUrl}/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });
      loadTodos();
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  }
}

async function deleteTodo(todoId) {
  try {
    await fetch(`${apiUrl}/${todoId}`, {
      method: "DELETE",
    });
    loadTodos();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

function searchTodos(event) {
  const searchTerm = event.target.value.toLowerCase();
  const todoItems = document.querySelectorAll("li");
  todoItems.forEach((item) => {
    const todoText = item.querySelector("span").textContent.toLowerCase();
    if (todoText.includes(searchTerm)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

loadTodos();
