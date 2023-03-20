class Users {
  userId = "";
  username = "";
  email = "";
  password = "";
  apiUrl = "http://localhost:8080/api";

  // *Napravi korisnika
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
        $(".verification").removeClass("hidden");
        $(".register").addClass("hidden");
      } else {
        alert("mail je vec iskoriscen");
      }
    });
  }

  // *Uloguj korisnika
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
      .then((response) => response.json())
      .then((data) => {
        let cookie = new Cookies();
        cookie.create(data);
        window.location.href = "adminPage.html";
      });
  }

  verify(verCode) {
    let data = {
      name: this.username,
      email: this.email,
      password: this.password,
      code: verCode,
    };

    data = JSON.stringify(data);

    fetch(this.apiUrl + "/user/verify", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        let cookie = new Cookies();
        cookie.create(data);
        window.location.href = "adminPage.html";
      });
  }
}
