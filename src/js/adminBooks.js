$(document).ready(function () {
  // ?Cookie
  //?========================
  let cookie = new Cookies();
  let adminCookie = cookie.getAdmin();
  cookie = cookie.getCookie();
  if (cookie === "") {
    window.location.href = "/";
  } else {
    fetch("http://localhost:8080/api/user/isAdmin", {
      method: "post",
      headers: {
        authorization: cookie,
      },
    }).then((response) => {
      if (response.status === 410) {
        let cookie = new Cookies();
        cookie.deleteCookie();
        window.location.href = "index.html";
      } else if (response.status === 403) {
        window.location.href = "userBooksHave.html";
      } else if (response.status === 200) {
      }
    });
  }
  function preventBack() {
    if (cookie === "") {
      window.history.forward();
    }
  }
  setTimeout(preventBack(), 0);
  window.onunload = function () {
    null;
  };
  // ?hamburger menu toggle
  //?========================
  $(".nav-toggle").click(function () {
    $(".main-nav").toggleClass("is-open");
    $(".hamburger").toggleClass("is-open");
  });

  $(".btn-books").click(function () {
    event.preventDefault();
    $(".iBooks").toggleClass("fa-angle-down");
    $(".iBooks").toggleClass("fa-angle-up");
    $(".ulBooks").toggleClass("hidden");
  });

  $(".btn-acc").click(function () {
    event.preventDefault();
    $(".iAcc").toggleClass("fa-angle-down");
    $(".iAcc").toggleClass("fa-angle-up");
    $(".ulAcc").toggleClass("hidden");
  });

  // Add book section toggle
  //========================
  $("#addBookOpen").click(function () {
    event.preventDefault();
    $(".add-book-section").removeClass("hidden");
  });

  $("#addBookClose").click(function () {
    $(".add-book-section").addClass("hidden");
  });

  // Change password section toggle
  //========================
  $("#changePasswordOpen").click(function () {
    event.preventDefault();
    $(".change-password-section").removeClass("hidden");
  });

  $("#changePasswordClose").click(function () {
    $(".change-password-section").addClass("hidden");
  });

  // ?Loug out
  //?========================
  $("#logOut").click(function (el) {
    event.preventDefault();
    let cookie = new Cookies();
    cookie.deleteCookie();
    window.location.href = "index.html";
  });

  //Validators
  //========================
  function request(validator) {
    let result = true;
    validator.forEach((test) => {
      if (test === false) {
        result = false;
      }
    });
    return result;
  }

  const setError = (el, msg, validator, name) => {
    const inputControl = el.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = msg;
    inputControl.classList.add("error");
    validator[name] = false;
  };

  const setSucces = (el, validator, name) => {
    const inputControl = el.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = "";
    inputControl.classList.remove("error");
    validator[name] = true;
  };
  //Const Add Book
  //========================
  const formAddBook = document.querySelector("#add-book-form");
  const bookName = document.querySelector("#addBook-BookName");
  const bookAutor = document.querySelector("#addBook-AutorName");
  const count = document.querySelector("#addBook-Count");
  let validatorAddBook = [false, false, false];

  //Validator Add Book
  //========================
  formAddBook.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputsAddBook();
    if (request(validatorAddBook) === true) {
      let book = new Books();
      book.name = bookName.value;
      book.author = bookAutor.value;
      book.count = count.value;
      book.cookie = cookie;
      book.create();
    }
  });

  //*Const Add More books
  //*========================
  const formAddMoreBooks = document.querySelector("#add-more-books-form");
  const bookCount = document.querySelector("#bookAddCount");
  let validatorAddMoreBooks = [false];

  //*Validator Add More Books
  //*========================
  formAddMoreBooks.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputsAddMoreBooks();
    if (request(validatorAddMoreBooks) === true) {
      let barCode = document.querySelector("[data-addMoreBook-id]");
      let books = new Books();
      books.count = parseInt(bookCount.value);
      books.cookie = cookie;
      books.barCode = barCode.getAttribute("data-addMoreBook-id");
      books.addMoreBooks();
    }
  });

  // * Const Remove More books
  //*========================
  const formRemoveMoreBooks = document.querySelector("#remove-more-books-form");
  const removeBookCount = document.querySelector("#bookRemoveCount");
  let validatorRemoveMoreBooks = [false];

  // *Validator Remove More books
  //*========================
  formRemoveMoreBooks.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputsRemoveMoreBooks();
    if (request(validatorRemoveMoreBooks) === true) {
      let barCode = document.querySelector("[data-removeMoreBook-id]");
      let books = new Books();
      books.count = parseInt(removeBookCount.value);
      books.cookie = cookie;
      books.barCode = barCode.getAttribute("data-removeMoreBook-id");
      books.removeMoreBooks();
    }
  });

  // *Const Change Password
  // *========================
  const formChangePassord = document.querySelector("#change-password-form");
  const changePassword = document.querySelector("#changePassword-password");
  const changePasswordRepeat = document.querySelector(
    "#changePassword-repeat-password"
  );
  let validatorChangePassword = [false, false];
  const verForm = document.querySelector("#verification-form");
  const verCode = document.querySelector("#verificationCode");
  let verTest = [false];

  // *Validator Change Password
  //*========================
  formChangePassord.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputsChangePassword();
    if (request(validatorChangePassword) === true) {
      let user = new Users();
      let oldPassword = changePassword.value;
      let changedPassword = changePasswordRepeat.value;
      user.cookie = cookie;
      user.userId = adminCookie;
      user.password = oldPassword;
      user.updatePassword();

      verForm.addEventListener("submit", (e) => {
        e.preventDefault();

        inputsVer();
        if (request(verTest) === true) {
          user.password = changedPassword;
          user.barCode = verCode.value;
          user.verifyUpdatePassword();
        }
      });
    }
  });

  const inputsVer = () => {
    const verCodeValue = verCode.value.trim();
    if (verCodeValue === "") {
      setError(verCode, "Unesite verifikacioni kod", verTest, 0);
    } else {
      setSucces(verCode, verTest, 0);
    }
  };

  //Inputs Add Book
  //========================
  const validateInputsAddBook = () => {
    const nameValue = bookName.value.trim();
    const autorValue = bookAutor.value.trim();
    const countValue = count.value.trim();

    if (nameValue === "") {
      setError(bookName, "Unesite ime knjige", validatorAddBook, 0);
    } else {
      setSucces(bookName, validatorAddBook, 0);
    }

    if (autorValue === "") {
      setError(bookAutor, "Unesite ime i prezime autora", validatorAddBook, 1);
    } else {
      setSucces(bookAutor, validatorAddBook, 1);
    }

    if (countValue === "") {
      setError(count, "Unesite barKod", validatorAddBook, 2);
    } else {
      setSucces(count, validatorAddBook, 2);
    }
  };

  //*Inputs Add More Books
  //*========================
  const validateInputsAddMoreBooks = () => {
    const bookCountValue = bookCount.value.trim();
    let number = parseInt(bookCountValue);

    if (bookCountValue === "") {
      setError(bookCount, "Unesite broj knjiga", validatorAddMoreBooks, 0);
    } else if (Number.isNaN(number) === true) {
      setError(bookCount, "Unos mora da bude broj", validatorAddMoreBooks, 0);
    } else {
      setSucces(bookCount, validatorAddMoreBooks, 0);
    }
  };

  //*Inputs Remove More Books
  //*========================
  const validateInputsRemoveMoreBooks = () => {
    const removeBookCountValue = removeBookCount.value.trim();
    let number = parseInt(removeBookCountValue);

    if (removeBookCountValue === "") {
      setError(
        removeBookCount,
        "Unesite broj knjiga",
        validatorRemoveMoreBooks,
        0
      );
    } else if (Number.isNaN(number) === true) {
      setError(
        removeBookCount,
        "Unos mora da bude broj",
        validatorRemoveMoreBooks,
        0
      );
    } else {
      setSucces(removeBookCount, validatorRemoveMoreBooks, 0);
    }
  };

  //Inputs Change Password
  //========================
  const validateInputsChangePassword = () => {
    const passwordValue = changePassword.value.trim();
    const passwordRepeatValue = changePasswordRepeat.value.trim();

    if (passwordValue === "") {
      setError(changePassword, "Unesite sifru", validatorChangePassword, 0);
    } else if (passwordValue.length < 3) {
      setError(
        changePassword,
        "Sifra mora da imam minimum 8 karaktera",
        validatorChangePassword,
        0
      );
    } else {
      setSucces(changePassword, validatorChangePassword, 0);
    }

    if (passwordRepeatValue === "") {
      setError(
        changePasswordRepeat,
        "Molim vas potvrdite sifru",
        validatorChangePassword,
        1
      );
    } else if (passwordRepeatValue.length < 3) {
      setError(
        changePasswordRepeat,
        "Sifra mora da imam minimum 8 karaktera",
        validatorChangePassword,
        1
      );
    } else {
      setSucces(changePasswordRepeat, validatorChangePassword, 1);
    }
  };

  // *Books list and Search
  // *========================
  const bookCardTemplate = document.querySelector("[data-books-template]");
  const bookCardContainer = document.querySelector("[data-books-cards]");
  const searchInput = document.querySelector("[data-search]");
  let books = [];

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    books.forEach((book) => {
      const isVisible =
        book.name.toLowerCase().includes(value) ||
        book.autor.toLowerCase().includes(value) ||
        book.barCode.toLowerCase().includes(value);
      book.element.classList.toggle("hidden", !isVisible);
    });
  });

  fetch("http://localhost:8080/api/book/", {
    method: "post",
    headers: {
      authorization: cookie,
    },
  }).then((response) => {
    if (response.status === 410) {
      let cookie = new Cookies();
      cookie.deleteCookie();
      window.location.href = "index.html";
    } else {
      response.json().then((data) => {
        books = data.map((book) => {
          console.log(book);
          const card = bookCardTemplate.content.cloneNode(true).children[0];
          const bookName = card.querySelector("[data-BookName]");
          const autorName = card.querySelector("[data-AutorName]");
          const bookCount = card.querySelector("[data-BookCount]");
          const barCode = card.querySelector("[data-BarCode]");
          if (book.visibility === false) {
            card.classList.add("zero-books");
          }
          bookName.textContent = book.name;
          autorName.textContent = book.author;
          bookCount.textContent = "Broj knjiga: " + book.bookCount;
          barCode.textContent = book._id;
          bookCardContainer.append(card);
          return {
            name: book.name,
            autor: book.author,
            barCode: book._id,
            element: card,
          };
        });
      });
    }
  });
});

// *Delete book
// *========================
function deleteBook(el) {
  const parent = el.parentElement;
  const barCode = parent.querySelector("[data-BarCode]").innerText;
  let cookie = new Cookies();
  cookie = cookie.getCookie();
  let book = new Books();
  book.barCode = barCode;
  book.cookie = cookie;
  book.delete();
}

// *Add more books
// *========================
$("#addMoreBooksClose").click(function () {
  event.preventDefault();
  $(".add-more-books").addClass("hidden");
  const addMoreBookBtn = document.querySelector("[data-addMoreBook-id]");
  addMoreBookBtn.setAttribute("data-addMoreBook-id", "");
});

function addMoreBooks(el) {
  const parent = el.parentElement;
  const bookId = parent.querySelector("[data-BarCode]").innerText;
  const addMoreBookBtn = document.querySelector("[data-addMoreBook-id]");
  addMoreBookBtn.setAttribute("data-addMoreBook-id", bookId);
  $(".add-more-books").removeClass("hidden");
}

// *Remove more books
// *========================
$("#removeMoreBooksClose").click(function () {
  event.preventDefault();
  $(".remove-more-books").addClass("hidden");
  const removeMoreBookBtn = document.querySelector("[data-removeMoreBook-id]");
  removeMoreBookBtn.setAttribute("data-removeMoreBook-id", "");
});

function removeMoreBooks(el) {
  const parent = el.parentElement;
  const bookId = parent.querySelector("[data-BarCode]").innerText;
  const removeMoreBookBtn = document.querySelector("[data-removeMoreBook-id]");
  removeMoreBookBtn.setAttribute("data-removeMoreBook-id", bookId);
  $(".remove-more-books").removeClass("hidden");
}

// *Hide show password
//*========================
function hidePassword(el) {
  let parentSpan = el.parentElement;
  let parentDiv = parentSpan.parentElement;
  let input = parentDiv.querySelector("input");
  let eye = el.nextElementSibling;
  eye.setAttribute("data-hidden", "false");
  el.setAttribute("data-hidden", "true");
  input.type = "password";
}

function showPassword(el) {
  let parentSpan = el.parentElement;
  let parentDiv = parentSpan.parentElement;
  let input = parentDiv.querySelector("input");
  let eye = el.previousElementSibling;
  eye.setAttribute("data-hidden", "false");
  el.setAttribute("data-hidden", "true");
  input.type = "text";
}
