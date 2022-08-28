// {
//     id: string | number,
//     title: string,
//     author: string,
//     year: number,
//     isComplete: boolean,
//   }

const todos = [];
const RENDER_EVENT = "render-todo";
const STORAGE_KEY = "TODO_APPS";
const SAVED_EVENT = "saved-todo";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findTodo(todoId) {
  for (todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function generateId() {
  return +new Date();
}

function addTodo() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isCompleted = isCompleteChecked();
  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, title, author, year, isCompleted);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function isCompleteChecked() {
  const isCheckComplete = document.getElementById("inputBookIsComplete");
  if (isCheckComplete.checked) {
    return true;
  }
  return false;
}

function generateId() {
  return +new Date();
}

// document.addEventListener(RENDER_EVENT, function () {
//   console.log(todos);
// });

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
  if (todoTarget === -1) return;
  todos.splice(todoTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeTodo(todoObject) {
  const { id, title, author, year, isCompleted } = todoObject;

  const titleValue = document.createElement("h3");
  titleValue.innerText = "Judul: " + title;
  titleValue.classList.add("bookList");

  const authorValue = document.createElement("p");
  authorValue.innerText = "Penulis: " + author;

  const yearValue = document.createElement("p");
  yearValue.innerText = "Tahun: " + year;

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(titleValue, authorValue, yearValue);
  article.setAttribute("id", `todo-${id}`);

  const divAction = document.createElement("div");
  divAction.classList.add("action");
  article.append(divAction);

  if (isCompleted) {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Belum selesai di Baca";
    checkButton.classList.add("green");
    checkButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });
    const rBookText = document.createElement("button");
    rBookText.innerText = "Hapus Buku";
    rBookText.classList.add("red");
    rBookText.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });
    article.append(checkButton, rBookText);
    divAction.append(checkButton, rBookText);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Sudah Selesai";
    checkButton.classList.add("green");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });
    const rBookText = document.createElement("button");
    rBookText.innerText = "Hapus Buku";
    rBookText.classList.add("red");
    rBookText.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });
    article.append(checkButton, rBookText);
    divAction.append(checkButton, rBookText);
  }
  return article;
}

const cariJudul = document.getElementById("searchBookTitle");
cariJudul.addEventListener("keyup", searchJudul);

function searchJudul(e) {
  const cariJudul = e.target.value.toLowerCase();
  let bookList = document.querySelectorAll(".book_item");

  bookList.forEach((item) => {
    const itemValue = item.textContent.toLowerCase();
    if (e.keyCode == 13) {
      e.preventDefault;
    }
    if (itemValue.indexOf(cariJudul) != -1) {
      item.setAttribute("style", "display: block;");
    } else {
      item.setAttribute("style", "display: none !important;");
    }
  });
  if (e.keyCode == 13) e.preventDefault;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompletedTODOList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});
