let logoutBtn = document.getElementById("logout");

let userAccessID = localStorage.getItem("TFUserId");
// Function to get a cookie by name
function getCookie(name) {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));

    if (cookieValue) {
        return cookieValue.split('=')[1];
    } else {
        return null; // Cookie not found
    }
}

// Get the "jwt" cookie value
const jwtTokenCommon = getCookie("jwt");

//if jwt doesn't exist in cookie
if (jwtTokenCommon == null || userAccessID == null) {
    //window.alert("Session timeout, Please login again");
    window.alert('Session timeout, Please login again!')
    window.location.href = "Login.html";
}

// profile pic code
let fetchUser = `http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UserProfile/${userAccessID}`;

let profileContainer = document.querySelector(".profilePicture");
let profileName = document.getElementById("profileName");


let dummyImagePath = "Images/userImage.png"
let imageElement = document.createElement("img");
imageElement.classList.add("ProfileImg");
profileContainer.appendChild(imageElement);

fetch(fetchUser, {
    headers: {
        "Authorization": `Bearer ${jwtTokenCommon}`
    }
})
    .then(res => {
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    })
    .then(data => {
        //console.log(data);
        profileName.innerText = "Welcome, " + data.name;
        // Check if the JSON response contains an "image" property
        if (data.image) {
            // Create an img element

            // Set the src attribute to the image data received from the server
            imageElement.src = `data:image/jpeg;base64,${data.image}`; // Modify the format as needed
            // Append the image element to the profile container
            // profileContainer.appendChild(imageElement);
        } else {
            imageElement.src = dummyImagePath;
            console.error("Image data not found in the JSON response");
        }
    })
    .catch(error => {
        console.error("Error fetching or processing the image:", error);
    });


// Get all the anchor elements in the left-menu
const nameOfPage = document.querySelectorAll(".left-menu > a");

// Add an onclick event listener to each anchor element    
let currentPage = document.querySelector("title");

if (currentPage.innerText == "ThoughtFlow") {
    nameOfPage[0].style.backgroundColor = "White";
    nameOfPage[0].style.color = "Black";
}
else if (currentPage.innerText == "Profile") {
    nameOfPage[1].style.backgroundColor = "White";
    nameOfPage[1].style.color = "Black";
}
else if (currentPage.innerText == "Post") {
    nameOfPage[2].style.backgroundColor = "White";
    nameOfPage[2].style.color = "Black";
}
else if (currentPage.innerText == "Notification") {
    nameOfPage[3].style.backgroundColor = "White";
    nameOfPage[3].style.color = "Black";
}
else if (currentPage.innerText == "People") {
    nameOfPage[4].style.backgroundColor = "White";
    nameOfPage[4].style.color = "Black";
}


//code of logout
// Function to remove a cookie by name
function removeCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Add an event listener to the logout button
logoutBtn.addEventListener("click", () => {

    Swal.fire({
        title: 'Do you want to logout?',
        showDenyButton: true,
        //showCancelButton: true,
        confirmButtonText: 'Logout',
        denyButtonText: `Stay logged in`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire('Logout!', '', 'success')
            // Remove the "jwt" cookie
            removeCookie("jwt");

            // Optionally, clear any user-related data stored in localStorage
            localStorage.removeItem("TFUserId");

            // Redirect the user to the logout page or another destination
            window.location.href = "Login.html";
        }else if (result.isDenied) {
            Swal.fire('Cancelled', '', 'info')
          }
    })

});



// Correct the URL path
// Initialize the notification count when the user logs in
if (!localStorage.getItem("NCount")) {
    localStorage.setItem("NCount", 0);
}

// Get the "jwt" cookie value
//const jwtTokenCommon = getCookie("jwt");

// Add an event listener to the "Notification" page link
nameOfPage[3].addEventListener("click", () => {
    // When the "Notification" page is clicked, reset the count
    localStorage.setItem("NCount", 0);
    nameOfPage[3].innerText = "Notification";
});

// Fetch new notifications and update the count
fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/getNotication/${userAccessID}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${jwtTokenCommon}`
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const newNotificationCount = data.length - localStorage.getItem("NCount");
        if (newNotificationCount > 0) {
            localStorage.setItem("NCount", data.length);
            nameOfPage[3].innerText = `Notification (${newNotificationCount})`;
        }
        //console.log(data);
    })
    .catch(error => {
        console.error("Error fetching notifications:", error);
    });

