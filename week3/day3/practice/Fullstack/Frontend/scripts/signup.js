import { footer } from "../components/footer.js";
import navbar from "../components/navbar.js";
import { baseUrl } from "../components/utlis.js";

document.getElementById("navbar").innerHTML = navbar();

document.getElementById("footer").innerHTML = footer;

let form = document.getElementById("form");

form.addEventListener("submit", () => {
  event.preventDefault();

  let username = form.username.value;
  let email = form.email.value;
  let password = form.password.value;

  let userObj = { username, email, password };

  // console.log(userObj)

  // create fetch request and send this data to BE for signup

  fetch(`${baseUrl}/users/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userObj),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("message").style.color = "green";
      document.getElementById("message").textContent = data.message;
      // move the user to login page
      alert("Signup Success, Please Login")
      window.location.href="./login.html"
    })
    .catch((err) => {
      document.getElementById("message").textContent = err.message;
      document.getElementById("message").style.color = "red";

      console.log("Failue in signup", err);
    });
});
