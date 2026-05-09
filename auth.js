const registerForm =
  document.getElementById("registerForm");

if(registerForm){

  registerForm.addEventListener("submit", (e)=>{

    e.preventDefault();

    const username =
      document.getElementById("username").value;

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;

    const message =
      document.getElementById("message");

    if(password !== confirmPassword){

      message.style.color = "#ff1744";

      message.innerText =
        "Passwords do not match ❌";

      return;

    }

    const user = {
      username,
      email,
      password
    };

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    message.style.color = "#00ff99";

    message.innerText =
      "Registration Successful ✅";

    setTimeout(()=>{

      window.location.href =
        "index.html";

    },1000);

  });

}


const loginForm =
  document.getElementById("loginForm");

if(loginForm){

  loginForm.addEventListener("submit", (e)=>{

    e.preventDefault();

    const username =
      document.getElementById("username").value;

    const password =
      document.getElementById("password").value;

    const savedUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    const message =
      document.getElementById("message");

    if(
      savedUser &&
      username === savedUser.username &&
      password === savedUser.password
    ){

      message.style.color = "#00ff99";

      message.innerText =
        "Login Successful ✅";

      setTimeout(()=>{

        window.location.href =
          "typing.html";

      },1000);

    }

    else{

      message.style.color = "#ff1744";

      message.innerText =
        "Invalid Username or Password ❌";

    }

  });

}