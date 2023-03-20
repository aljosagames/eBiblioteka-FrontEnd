$(document).ready(function () {
  let cookie = new Cookies();
  cookie = cookie.getCookie();
  if (cookie === "") {
    window.location.href = "index.html";
  }
  // hamburger menu toggle
  //========================
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

  // Change password section toggle
  //========================
  $("#changePasswordOpen").click(function () {
    event.preventDefault();
    $(".change-password-section").removeClass("hidden");
  });

  $("#changePasswordClose").click(function () {
    $(".change-password-section").addClass("hidden");
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
  })
    .then((response) => response.json())
    .then((data) => {
      books = data.map((book) => {
        const card = bookCardTemplate.content.cloneNode(true).children[0];
        const bookName = card.querySelector("[data-BookName]");
        const autorName = card.querySelector("[data-AutorName]");
        const barCode = card.querySelector("[data-BarCode]");
        bookName.textContent = book.content;
        autorName.textContent = book.name;
        barCode.textContent = 123;
        bookCardContainer.append(card);
        return {
          name: book.content,
          autor: book.name,
          barCode: "123",
          element: card,
        };
      });
    });
});
