$(document).ready(function () {
  // ?Cookie
  //?========================
  let cookie = new Cookies();
  cookie = cookie.getCookie();
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

  // ?Filter toggle
  //?========================
  $("#filterBtn").click(function () {
    $(".filterList").toggleClass("hidden");
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

  //Const Give Book
  //========================
  const formGiveBook = document.querySelector("#give-book-form");
  const barCode = document.querySelector("#giveBook-barCode");
  let validatorGiveBook = [false];

  //Validator Give Book
  //========================
  formGiveBook.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputsGiveBook();
    if (request(validatorGiveBook) === true) {
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

  //Inputs Give Book
  //========================
  const validateInputsGiveBook = () => {
    const barCodeValue = barCode.value.trim();

    if (barCodeValue === "") {
      setError(barCode, "Unesite bar kod knjige", validatorGiveBook, 0);
    } else {
      setSucces(barCode, validatorGiveBook, 0);
    }
  };

  // *Users list and search
  // *========================
  const userCardTemplate = document.querySelector("[data-users-template]");
  const userCardContainer = document.querySelector("[data-users-cards]");
  const searchInput = document.querySelector("[data-search]");
  let users = [];

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    users.forEach((user) => {
      const isVisible =
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.id.toLowerCase().includes(value);
      user.element.classList.toggle("hidden", !isVisible);
    });
  });

  fetch("http://localhost:8080/api/user/", {
    method: "post",
    headers: {
      authorization: cookie,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      users = data.map((user) => {
        const card = userCardTemplate.content.cloneNode(true).children[0];
        const userName = card.querySelector("[data-UserName]");
        const userEmail = card.querySelector("[data-UserEmail]");
        const btnIdSee = card.querySelector("[data-user-id-see]");
        const btnIdGive = card.querySelector("[data-user-id-give]");
        userName.textContent = user.name;
        userEmail.textContent = user.email;
        btnIdSee.setAttribute("data-user-id-see", user._id);
        btnIdGive.setAttribute("data-user-id-give", user._id);
        userCardContainer.append(card);
        return {
          name: user.name,
          email: user.email,
          id: user._id,
          element: card,
        };
      });
    });
});

// ?Give book section toggle
//?========================
function giveBookOpen(el) {
  $(".give-book-section").removeClass("hidden");
  let userId = el.getAttribute("data-user-id-give");
  let giveBtn = document.querySelector("#giveBook");
  giveBtn.setAttribute("data-user-id", userId);
}

$("#giveBookClose").click(function () {
  $(".give-book-section").addClass("hidden");
  let giveBtn = document.querySelector("#giveBook");
  giveBtn.setAttribute("data-user-id", "");
});

function openUser(el) {
  let userId = el.getAttribute("data-user-id-see");
  let cookie = new Cookies();
  cookie.createUsers(userId);
  window.location.href = "adminUsers.html";
}
