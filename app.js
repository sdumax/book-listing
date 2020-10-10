// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger bt-sm delete">delete</td>
    `;
    list.appendChild(row);
  }
  static async clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
}

// Storage Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static async removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Books
document.getElementById("book-form").addEventListener("submit", (e) => {
  // prevent default
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  // Validate
  if (title === "" || author === "" || isbn === "") {
    swal({
      title: "Warning!",
      text: "Please enter all fields",
      icon: "warning",
    });
  } else {
    // Instanciate Book
    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);
    // add book to store
    Store.addBook(book);

    UI.clearFields().then(() => {
      swal({
        title: "Success!",
        text: "New book added to record",
        icon: "success",
      });
    });
  }
});

// Event: Remove a Books
document.getElementById("book-list").addEventListener("click", (e) => {
  // UI.deleteBook(e.target).then(() => {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this book!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      // remove book from UI
      UI.deleteBook(e.target);
      if (
        Store.removeBook(
          e.target.parentElement.previousElementSibling.textContent
        )
      ) {
        swal("Book has been deleted!", {
          icon: "success",
        });
      }

      // remove book from UI
    }
  });
});
