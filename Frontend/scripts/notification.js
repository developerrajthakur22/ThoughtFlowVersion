let userID = localStorage.getItem("TFUserId");

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
const jwtToken = getCookie("jwt");

let notificationUrl = `http://localhost:9990/getNotication/${userID}`; // Correct the URL path

fetch(notificationUrl, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${jwtToken}`
    }
})
    .then(response => {
        return response.json();
    })
    .then(data => {
        //console.log(data);

        if (data.length == 0) {
            document.querySelector(".post-section").innerHTML = `<h1 style="text-align: center; margin-top: 40px">No Notifications :(  </h1>`;
        }

        display(data);

    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

function display(data) {
    data.forEach(element => {
        let notiDiv = document.createElement("div");
        notiDiv.classList.add("notification");

        let notiIcon = document.createElement("span");
        notiIcon.classList.add("notification-icon");

        let notiText = document.createElement("span");
        notiText.classList.add("notification-text");

        if (element.type === "Follow") {
            notiDiv.classList.add("following");
            notiIcon.innerText = "👤";
            notiText.innerText = `${element.sender.name} (${element.sender.username}) started following you`;
        }
        else if (element.type === "Like") {
            notiDiv.classList.add("like");
            notiIcon.innerText = "❤️";
            notiText.innerText = `${element.sender.name} (${element.sender.username}) liked your post (${element.post.title})`;
        }
        else {
            notiDiv.classList.add("comment");
            notiIcon.innerText = "💬";
            notiText.innerText = `${element.sender.name} (${element.sender.username}) commented on your post (${element.post.title})`;
        }

        notiDiv.appendChild(notiIcon);
        notiDiv.appendChild(notiText);

        // Append the notification div to your HTML container
        document.querySelector(".post-section").appendChild(notiDiv);
    });
}
