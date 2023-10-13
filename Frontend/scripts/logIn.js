// Add an event listener to the submit button
let submitBtn = document.querySelector("button");

submitBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Get the username and password values
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  // Create a Basic Authentication header by base64 encoding the username and password
  const base64Credentials = btoa(username + ':' + password);

  // Define the URL and request options
  const url = 'http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/login';
  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + base64Credentials
    },
  };

  // Send the request
  fetch(url, requestOptions)
    .then(response => {
      if(response.status == 200 || response.status == 202){
        const authorizationHeader = response.headers.get('Authorization');
        // Save the JWT token in a cookie
        setCookie("jwt", authorizationHeader, 1); // Set the cookie to expire in 1 day
        userLoginWithToken(authorizationHeader);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      }
      console.log(response.status)
    })
    .catch(error => {
      // Handle errors here
      console.error(error);
    });

});

// Function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  //expires.setTime(expires.getTime() + (days * 60 * 1000)); // Convert minutes to milliseconds
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// To make login with jwt
function userLoginWithToken(token) {
  fetch("http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/loginUser", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: token // You may need to adjust the body content depending on your server's requirements
  })
    .then(data => {
      return data.json();
    })
    .then(data => {
      localStorage.setItem("TFUserId", data.id);
    })
}
