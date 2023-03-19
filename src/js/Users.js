class Users {
  userId = "";
  username = "";
  email = "";
  password = "";
  apiUrl = "http://localhost:8080/api";

  create() {
    let data = {
      name: this.username,
      email: this.email,
      password: this.password,
    };

    data = JSON.stringify(data);

    fetch(this.apiUrl + "/user/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    }).then((response) => {
      if (response.status === 201) {
        alert("radi");
      } else {
        alert("mail je vec iskoriscen");
      }
    });
  }

  login() {
    let data = {
      email: this.email,
      password: this.password,
    };

    data = JSON.stringify(data);

    fetch(this.apiUrl + "/user/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => console.log(response))
      .then((data) => {
        // let cookie = new Cookies();
        // cookie.create(data);
        // window.location.href = "adminPage.html";
      });
  }
}
