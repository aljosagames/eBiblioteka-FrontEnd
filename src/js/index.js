$(document).ready(function () {
  // ?Cookie
  //?========================
  let cookie = new Cookies();
  cookie = cookie.getCookie();
  if (cookie !== "") {
    window.location.href = "adminPage.html";
  }
  function preventBack() {
    window.history.forward();
  }
  setTimeout(preventBack(), 0);
  window.onunload = function () {
    null;
  };
  // ?Form open close
  $(".open-btn").click(function () {
    event.preventDefault();
    $(".login").addClass("hidden");
    $(".register").removeClass("hidden");
  });

  $(".close-btn").click(function () {
    event.preventDefault();
    $(".login").removeClass("hidden");
    $(".register").addClass("hidden");
  });

  // *Validator Register
  // *=====================
  const form = document.querySelector("#register-form");
  const username = document.querySelector("#register-name");
  const email = document.querySelector("#register-email");
  const password = document.querySelector("#register-password");
  const password2 = document.querySelector("#register-repeat-password");
  const verForm = document.querySelector("#verification-form");
  const verCode = document.querySelector("#verificationCode");
  let verTest = [false];
  let formTest = [false, false, false, false];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputs();
    if (request(formTest) === true) {
      let user = new Users();
      user.username = username.value;
      user.email = email.value;
      user.password = password.value;
      user.create();

      verForm.addEventListener("submit", (e) => {
        e.preventDefault();

        inputsVer();
        if (request(verTest) === true) {
          user.verify(verCode.value);
        }
      });
    }
  });

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

  const isValidEmail = (email) => {
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
  };

  const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if (usernameValue === "") {
      setError(username, "Unesite ime i prezime", formTest, 0);
    } else {
      setSucces(username, formTest, 0);
    }

    if (emailValue === "") {
      setError(email, "Email je potreban", formTest, 1);
    } else if (!isValidEmail(emailValue)) {
      setError(email, "Unesite validnu email adresu", formTest, 1);
    } else {
      setSucces(email, formTest, 1);
    }

    if (passwordValue === "") {
      setError(password, "Unesite sifru", formTest, 2);
    } else if (passwordValue.length < 3) {
      setError(password, "Sifra mora da imam minimum 8 karaktera", formTest, 2);
    } else {
      setSucces(password, formTest, 2);
    }

    if (password2Value === "") {
      setError(password2, "Molim vas potvrdite sifru", formTest, 3);
    } else if (password2Value !== passwordValue) {
      setError(password2, "Sifre se ne poklapaju", formTest, 3);
    } else {
      setSucces(password2, formTest, 3);
    }
  };

  const inputsVer = () => {
    const verCodeValue = verCode.value.trim();
    if (verCodeValue === "") {
      setError(verCode, "Unesite verifikacioni kod", verTest, 0);
    } else {
      setSucces(verCode, verTest, 0);
    }
  };

  // *Validator Login
  // *=====================
  const formLogin = document.querySelector("#login-form");
  const emailLogin = document.querySelector("#login-email");
  const passwordLogin = document.querySelector("#login-password");
  let users = new Users();
  let validatorLogin = [false, false];

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    inputsLogin();
    if (request(validatorLogin) === true) {
      users.email = emailLogin.value;
      users.password = passwordLogin.value;
      users.login();
    }
  });

  const inputsLogin = () => {
    const emailLoginValue = emailLogin.value.trim();
    const passwordLoginValue = passwordLogin.value.trim();

    if (emailLoginValue === "") {
      setError(emailLogin, "Unesite email adresu", validatorLogin, 0);
    } else if (!isValidEmail(emailLoginValue)) {
      setError(emailLogin, "Unesite validnu email adresu", validatorLogin, 0);
    } else {
      setSucces(emailLogin, validatorLogin, 0);
    }

    if (passwordLoginValue === "") {
      setError(passwordLogin, "Unesite sifru", validatorLogin, 1);
    } else {
      setSucces(passwordLogin, validatorLogin, 1);
    }
  };
});
