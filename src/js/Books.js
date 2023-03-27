class Books {
  name = "";
  author = "";
  barCode = "";
  count = "";
  userId = "";
  cookie = "";
  apiUrl = "http://localhost:8080/api";

  // *Napravi knjigu
  create() {
    let data = {
      name: this.name,
      author: this.author,
      bookCount: this.count,
    };

    let headers = new Headers();
    headers.append("Authorization", this.cookie);
    headers.append("Content-Type", "application/json");

    data = JSON.stringify(data);

    fetch(this.apiUrl + "/book/create", {
      method: "post",
      headers: headers,
      body: data,
    })
      .then((response) => {
        if (response.status === 201) {
          location.reload();
        } else if (response.status === 410) {
          let cookie = new Cookies();
          cookie.deleteCookie();
          window.location.href = "index.html";
        }
      })
      .then((data) => {});
  }

  //* Obrisi knjigu
  delete() {
    let data = {
      id: this.barCode,
    };

    let headers = new Headers();
    headers.append("authorization", this.cookie);
    headers.append("Content-Type", "application/json");

    data = JSON.stringify(data);

    fetch(this.apiUrl + "/book/delete", {
      method: "delete",
      headers: headers,
      body: data,
    }).then((response) => {
      if (response.status === 201) {
        location.reload();
      } else if (response.status === 410) {
        let cookie = new Cookies();
        cookie.deleteCookie();
        window.location.href = "index.html";
      }
    });
  }

  //*Get book
  async get() {
    let data = {
      id: this.barCode,
    };

    let headers = new Headers();
    headers.append("Authorization", this.cookie);
    headers.append("Content-Type", "application/json");

    data = JSON.stringify(data);

    const response = await fetch(this.apiUrl + "/book/getOne", {
      method: "post",
      headers: headers,
      body: data,
    });
    const data_1 = await response.json();
    return data_1;
  }

  //*Add more books
  addMoreBooks() {
    let data = {
      id: this.barCode,
      count: this.count,
    };

    let headers = new Headers();
    headers.append("Authorization", this.cookie);
    headers.append("Content-Type", "application/json");

    data = JSON.stringify(data);

    fetch(this.apiUrl + "/book/add", {
      method: "put",
      headers: headers,
      body: data,
    }).then((response) => {
      if (response.status === 201) {
        location.reload();
      }
    });
  }

  removeMoreBooks() {
    let data = {
      id: this.barCode,
      count: this.count,
    };

    let headers = new Headers();
    headers.append("Authorization", this.cookie);
    headers.append("Content-Type", "application/json");

    data = JSON.stringify(data);

    fetch(this.apiUrl + "/book/remove", {
      method: "put",
      headers: headers,
      body: data,
    }).then((response) => {
      if (response.status === 400) {
        alert("Unos nije validan");
      } else if (response.status === 201) {
        location.reload();
      }
    });
  }
}
