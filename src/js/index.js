$(document).ready(function () {
  //Form open close
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

  // Validator
  const form = document.querySelector("#register-form");
  const username = document.querySelector("#register-name");
  const email = document.querySelector("#register-email");
  const password = document.querySelector("#register-password");
  const password2 = document.querySelector("#register-repeat-password");
  let formTest = [false, false, false, false];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputs();
    if (request() === true) {
      location.reload();
    }
  });

  function request() {
    let result = true;
    formTest.forEach((test) => {
      if (test === false) {
        result = false;
      }
    });
    return result;
  }

  const setError = (el, msg, name) => {
    const inputControl = el.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = msg;
    inputControl.classList.add("error");
    formTest[name] = false;
  };

  const setSucces = (el, name) => {
    const inputControl = el.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = "";
    inputControl.classList.remove("error");
    formTest[name] = true;
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
      setError(username, "Unesite ime i prezime", 0);
    } else {
      setSucces(username, 0);
    }

    if (emailValue === "") {
      setError(email, "Email je potreban", 1);
    } else if (!isValidEmail(emailValue)) {
      setError(email, "Unesite validnu email adresu", 1);
    } else {
      setSucces(email, 1);
    }

    if (passwordValue === "") {
      setError(password, "Unesite sifru", 2);
    } else if (passwordValue.length < 8) {
      setError(password, "Sifra mora da imam minimum 8 karaktera", 2);
    } else {
      setSucces(password, 2);
    }

    if (password2Value === "") {
      setError(password2, "Molim vas potvrdite sifru", 3);
    } else if (password2Value !== passwordValue) {
      setError(password2, "Sifre se ne poklapaju", 3);
    } else {
      setSucces(password2, 3);
    }
  };
});
