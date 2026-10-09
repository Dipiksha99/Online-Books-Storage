const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match!";
    return;
  }

  message.textContent = "Passwords matched!";

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  console.log("Name:", name);
  console.log("Email:", email);

  try {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });

  const result = await response.text();
  if (!response.ok) {
  message.textContent = result;
  return;
}
  message.textContent = result;
  registerForm.reset();
} catch (error) {
  message.textContent = "Server se connect nahi ho pa raha!";
  console.log(error);
}

});
