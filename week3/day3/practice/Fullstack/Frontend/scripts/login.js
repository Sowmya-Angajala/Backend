import { footer } from "../components/footer.js";
import navbar from "../components/navbar.js";
import { baseUrl } from "../components/utlis.js";
document.getElementById("navbar").innerHTML = navbar();
document.getElementById("footer").innerHTML = footer;
let form = document.getElementById("form");
form.addEventListener("submit", () => {
  event.preventDefault();
  let email = form.email.value;
  let password = form.password.value;
  let userObj = { email, password };
  // console.log(userObj)
  // create fetch request and send this data to BE for signup
  console.log(`${baseUrl}/users/login`)
  fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userObj),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      document.getElementById("message").style.color = "green";
      document.getElementById("message").textContent = data.message;
      /// once Credentials are set into LS, they move to the todos page
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // move the user to login page
      alert("Login Success");
      window.location.href = "./todos.html";
    })
    .catch((err) => {
      document.getElementById("message").textContent = err.message;
      document.getElementById("message").style.color = "red";
      console.log("Failue in signup", err);
    });
});
