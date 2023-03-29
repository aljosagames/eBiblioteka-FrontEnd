$(document).ready(function () {
  // ?Cookie
  //?========================
  let cookies = new Cookies();
  let cookie = cookies.getCookie();
  let usersCookie = cookies.getUsersCookie();
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
      } else if (response.status === 200) {
        window.location.href = "adminPage.html";
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

  // Change password section toggle
  //========================
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
      user.userId = usersCookie;
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

  //*Inputs Change Password
  //*========================
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

  // *Books list
  // *========================
  const bookCardTemplate = document.querySelector("[data-books-template]");
  const bookCardContainer = document.querySelector("[data-books-cards]");

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
  }).then((response) => {
    if (response.status === 410) {
      let cookie = new Cookies();
      cookie.deleteCookie();
      window.location.href = "index.html";
    } else if (response.status === 200) {
      response.json().then((data) => {
        data.books.forEach((book) => {
          const card = bookCardTemplate.content.cloneNode(true).children[0];
          const bookName = card.querySelector("[data-BookName]");
          const autorName = card.querySelector("[data-AutorName]");
          const expireCard = card.querySelector("[data-expire]");
          let bookInfo = book[0];
          let expire = book[1];
          expire = expire.substring(0, 10);
          let date = expire.split("-");
          date = new Date(date[0], date[1] - 1, date[2]).getTime();
          expire = new Date(date + 14 * 24 * 60 * 60 * 1000).toLocaleString(
            "en-GB"
          );
          date = new Date(date).toLocaleString("en-GB");
          bookName.textContent = bookInfo.name;
          autorName.textContent = bookInfo.author;
          expireCard.textContent = expire.substring(0, 10);
          bookCardContainer.append(card);
        });
      });
    }
  });
});

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
