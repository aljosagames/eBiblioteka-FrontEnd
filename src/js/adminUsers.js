$(document).ready(function () {
  // ?Cookie
  //?========================
  let cookies = new Cookies();
  let cookie = cookies.getCookie();
  let usersCookie = cookies.getUsersCookie();
  if (cookie === "") {
    window.location.href = "/";
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

  // ?Add book section toggle
  //?========================
  $("#addBookOpen").click(function () {
    event.preventDefault();
    $(".add-book-section").removeClass("hidden");
  });

  $("#addBookClose").click(function () {
    $(".add-book-section").addClass("hidden");
  });

  // ?Change password section toggle
  //?========================
  $("#changePasswordOpen").click(function () {
    event.preventDefault();
    $(".change-password-section").removeClass("hidden");
  });

  $("#changePasswordClose").click(function () {
    $(".change-password-section").addClass("hidden");
  });

  // ?Log out
  //?========================
  $("#logOut").click(function (el) {
    event.preventDefault();
    let cookie = new Cookies();
    cookie.deleteCookie();
    window.location.href = "index.html";
  });

  // *Get User
  //*========================
  let data = {
    id: usersCookie,
  };

  let headers = new Headers();
  headers.append("authorization", cookie);
  headers.append("Content-Type", "application/json");

  data = JSON.stringify(data);
  fetch("http://localhost:8080/api/user/getOne", {
    method: "post",
    headers: headers,
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let userName = document.querySelector(".userName");
      let userEmail = document.querySelector(".userEmail");
      let btnDelete = document.querySelector("#deleteUser");
      let btnGiveBook = document.querySelector("#addBookToUser");
      userName.textContent = data.name;
      userEmail.textContent = data.email;
      btnDelete.setAttribute("data-user-id", data._id);
      btnGiveBook.setAttribute("data-user-id-give", data._id);
    });

  $("#deleteUser").click(function () {
    let user = new Users();
    user.userId = usersCookie;
    user.delete(cookie);
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

  //Const Change Password
  //========================
  const formChangePassord = document.querySelector("#change-password-form");
  const changePassword = document.querySelector("#changePassword-password");
  const changePasswordRepeat = document.querySelector(
    "#changePassword-repeat-password"
  );
  let validatorChangePassword = [false, false];

  //Validator Change Password
  //========================
  formChangePassord.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputsChangePassword();
    if (request(validatorChangePassword) === true) {
      location.reload();
    }
  });

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

  //Inputs Change Password
  //========================
  const validateInputsChangePassword = () => {
    const passwordValue = changePassword.value.trim();
    const passwordRepeatValue = changePasswordRepeat.value.trim();

    if (passwordValue === "") {
      setError(changePassword, "Unesite sifru", validatorChangePassword, 0);
    } else if (passwordValue.length < 8) {
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
    } else if (passwordRepeatValue !== passwordValue) {
      setError(
        changePasswordRepeat,
        "Sifre se ne poklapaju",
        validatorChangePassword,
        1
      );
    } else {
      setSucces(changePasswordRepeat, validatorChangePassword, 1);
    }
  };
});

// ?Give book section toggle
//?========================
function giveBookOpen(el) {
  window.location.href = "adminUsersBooks.html";
}