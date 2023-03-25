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
        if (response.status != 201) {
          alert("Greska pri unosu");
        } else {
          location.reload();
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
      }
    });
  }
}
