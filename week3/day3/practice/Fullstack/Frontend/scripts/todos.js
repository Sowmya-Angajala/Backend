import { footer } from "../components/footer.js";
import navbar from "../components/navbar.js";
import { baseUrl } from "../components/utlis.js";
document.getElementById("navbar").innerHTML = navbar();
document.getElementById("footer").innerHTML = footer;
const modal = document.getElementById("todo-modal");
const titleInput = document.getElementById("todo-title");
const statusSelect = document.getElementById("todo-status"); // select tag
const statusField = document.querySelector(".status-field"); // div
const modalTitle = document.getElementById("modal-title");
const submitTodo = document.getElementById("submit-btn");

let token = localStorage.getItem("accessToken");

if (!token) {
  /// user didnot login
  alert("User Not Logged In");
  window.location.href = "./login.html";
}
/// make modal functionable

document.getElementById("add-todo-btn").addEventListener("click", () => {
  /// closed Modal will be opened here
  modal.style.display = "flex";
  modalTitle.textContent = "Add Todo";
});

/// Add or Update Todo
submitTodo.addEventListener("click", () => {
  event.preventDefault();

  let method;
  let endPoint;
  let body;
  // common button for both add/update todo
  // console.log(modalTitle.textContent == "Add Todo")
  if (modalTitle.textContent == "Add Todo") {
    //alert("Add Todo Working")
    let title = titleInput.value;
    method = "POST";
    endPoint = "add-todo";
    body = { title };
    // let title = titleInput.value;
    // /// Make fetch request send the data to BE along wit token
  } else {
    /// Update todo here
    //alert("Update Todo Working")
    let todoId = document.getElementById("todo_id").value;
    let title = titleInput.value;
    let status = statusSelect.value;
    method = "PATCH";
    endPoint = `update-todo/${todoId}`;
    body = { title, status };
  }
  console.log(`${baseUrl}/todos/${endPoint}`);
  fetch(`${baseUrl}/todos/${endPoint}`, {
    method: method,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data)
      // once todo added, close the modal & display response message in UI and empty the input tag
      modal.style.display = "none";
      document.getElementById("message").style.color = "green";
      document.getElementById("message").textContent = data.message;
      titleInput.value = "";
      statusField.style.display = "none";
      getData();
    })
    .catch((err) => {
      //console.log(err)
      document.getElementById("message").textContent = err.message;
      document.getElementById("message").style.color = "red";
    });
});

function getData() {
  fetch(`${baseUrl}/todos/alltodos`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayTodos(data.todos);
    })
    .catch((err) => {
      //console.log(err)
      document.getElementById("message").textContent = err.message;
      document.getElementById("message").style.color = "red";
    });
}

getData();

function displayTodos(arr) {
  let container = document.getElementById("container");
  let cards = arr.map((todo) => {
    let card = `<div class='card'>
        <h3>Title: ${todo.title}</h3>
        <h4>Status:${todo.status ? "Completed" : "Pending"}</h4>
        <button onClick='updateTodo(${JSON.stringify(todo)})'>Update</button>
        <button onClick='deleteTodo(${JSON.stringify(
          todo._id
        )})'>Delete</button>
        </div>`;

    return card;
  });

  container.innerHTML = cards.join(" ");
}

window.updateTodo = (todo) => {
  modal.style.display = "flex";
  modalTitle.textContent = "Update Todo";
  statusField.style.display = "block";
  titleInput.value = todo.title;
  statusSelect.value = todo.status;
  // attaching todo._id, which is needed for todo updation
  document.getElementById("todo_id").value = todo._id;
  // to work the update, we need to send the id
  // how to send the id
};
///

window.deleteTodo = (id) => {
  //alert("Delete Button is working")
  //console.log(id)

  fetch(`${baseUrl}/todos/delete-todo/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("message").style.color = "green";
      document.getElementById("message").textContent = data.message;
      getData();
    })
    .catch((err) => {
      //console.log(err)
      document.getElementById("message").textContent = err.message;
      document.getElementById("message").style.color = "red";
    });
};
