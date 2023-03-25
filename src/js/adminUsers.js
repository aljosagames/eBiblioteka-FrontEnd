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
      let userName = document.querySelector(".userName");
      let userEmail = document.querySelector(".userEmail");
      let btnDelete = document.querySelector("#deleteUser");
      userName.textContent = data.name;
      userEmail.textContent = data.email;
      btnDelete.setAttribute("data-user-id", data._id);
    });

  $("#deleteUser").click(function () {
    let user = new Users();
    user.userId = usersCookie;
    user.delete(cookie);
  });
});
