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

  console.log(typeof usersCookie);
  console.log(cookie)

  let headers = new Headers();
  headers.append("authorization", cookie);
  headers.append("Content-Type", "application/json");

  data = JSON.stringify(data);
  fetch("http://localhost:8080/api/user/getOne", {
    method: "post",
    headers: headers,
    dody: data,
  })
    .then((response) => console.log(response))
    .then((data) => {});
});
