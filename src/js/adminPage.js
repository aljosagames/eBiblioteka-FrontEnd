$(document).ready(function () {
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

  // Filter toggle
  //========================
  $("#filterBtn").click(function () {
    $(".filterList").toggleClass("hidden");
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

  //Validator
  const form = document.querySelector("#add-book-form");
  const bookName = document.querySelector("#addBook-BookName");
  const bookAutor = document.querySelector("#addBook-AutorName");
  const barKod = document.querySelector("#addBook-BarKod");
  let formTest = [false, false, false];

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

  const validateInputs = () => {
    const nameValue = bookName.value.trim();
    const autorValue = bookAutor.value.trim();
    const barKodValue = barKod.value.trim();

    if (nameValue === "") {
      setError(bookName, "Unesite ime knjige", 0);
    } else {
      setSucces(bookName, 0);
    }

    if (autorValue === "") {
      setError(bookAutor, "Unesite ime i prezime autora", 1);
    } else {
      setSucces(bookAutor, 1);
    }

    if (barKodValue === "") {
      setError(barKod, "Unesite barKod", 2);
    } else {
      setSucces(barKod, 2);
    }
  };
});
