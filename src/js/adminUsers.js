$(document).ready(function () {
  // ?Cookie
  //?========================
  let cookies = new Cookies();
  let adminCookie = cookies.getAdmin();
  let cookie = cookies.getCookie();
  let usersCookie = cookies.getUsersCookie();
  if (cookie === "") {
    window.location.href = "/";
  } else {
    fetch("http://34.139.10.111/api/user/isAdmin", {
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
  const bookCardTemplate = document.querySelector("[data-books-template]");
  const bookCardContainer = document.querySelector("[data-books-cards]");

  let data = {
    id: usersCookie,
  };

  let headers = new Headers();
  headers.append("authorization", cookie);
  headers.append("Content-Type", "application/json");

  data = JSON.stringify(data);
  fetch("http://34.139.10.111/api/user/getOne", {
    method: "post",
    headers: headers,
    body: data,
  }).then((response) => {
    if (response.status === 410) {
      let cookie = new Cookies();
      cookie.deleteCookie();
      window.location.href = "index.html";
    } else if (response.status === 200) {
      response.json().then((data) => {
        let userName = document.querySelector(".userName");
        let userEmail = document.querySelector(".userEmail");
        let btnDelete = document.querySelector("#deleteUser");
        let btnGiveBook = document.querySelector("#addBookToUser");
        let adminBtn = document.querySelector("#makeAdmin");
        if (data.admin === true) {
          userName.innerHTML =
            data.name + ' <i class="fa-solid fa-user user-icon"></i>';
          adminBtn.innerText = "Ukloni admina";
          adminBtn.setAttribute("data-admin", true);
        } else {
          userName.innerHTML = data.name;
          adminBtn.innerText = "Napravi admina";
          adminBtn.setAttribute("data-admin", false);
        }
        userEmail.textContent = data.email;
        btnDelete.setAttribute("data-user-id", data._id);
        btnGiveBook.setAttribute("data-user-id-give", data._id);
        adminBtn.setAttribute("data-user-id-admin", data._id);
        data.books.forEach((book) => {
          const card = bookCardTemplate.content.cloneNode(true).children[0];
          const bookName = card.querySelector("[data-BookName]");
          const autorName = card.querySelector("[data-AutorName]");
          const expireCard = card.querySelector("[data-expire]");
          const btn = card.querySelector("[data-button]");
          let bookInfo = book[0];
          let expire = book[1];
          expire = expire.substring(0, 10);
          let date = expire.split("-");
          date = new Date(date[0], date[1] - 1, date[2]).getTime();
          expire = new Date(date + 14 * 24 * 60 * 60 * 1000);
          date = new Date(date);
          let today = new Date();
          if (expire < today) {
            card.classList.add("expired");
          }
          expire = expire.toLocaleString("en-GB");
          bookName.textContent = bookInfo.name;
          autorName.textContent = bookInfo.author;
          expireCard.textContent = expire.substring(0, 10);
          btn.setAttribute("data-book-id", bookInfo._id);
          bookCardContainer.append(card);
        });
      });
    }
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
});

// ?Make admin section toggle
//?========================
function adminSwitch(el) {
  let adminTest = el.getAttribute("data-admin");
  let user = new Users();
  let cookie = new Cookies();
  let id = cookie.getUsersCookie();
  let admin = cookie.getCookie();
  user.userId = id;
  user.cookie = admin;

  if (adminTest === "true") {
    user.removeAdmin();
  } else {
    user.makeAdmin();
  }
}

// ?Give book section toggle
//?========================
function giveBookOpen(el) {
  window.location.href = "adminUsersBooks.html";
}

// *Delete Book From User
// *========================
function deleteBookFromUser(el) {
  const barCode = el.getAttribute("data-book-id");
  let user = new Users();
  let cookies = new Cookies();
  let cookie = cookies.getCookie();
  let usersCookie = cookies.getUsersCookie();
  user.barCode = barCode;
  user.cookie = cookie;
  user.userId = usersCookie;
  user.deleteBookFromUser();
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
