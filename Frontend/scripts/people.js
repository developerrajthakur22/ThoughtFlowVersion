let userId = localStorage.getItem("TFUserId");
let peopleContainer = document.querySelector(".peopleContainer");

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

// Function to fetch users and check if they are already followed
function fetchUsersAndCheckFollowing() {
    fetch(`http://localhost:9990/allUser`,{
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
        .then(res => res.json())
        .then(users => {
            fetchUserFollowingStatus(userId)
                .then(following => {
                    displayUsers(users, following);
                })
                .catch(error => {
                    console.error("Error fetching following status:", error);
                });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
}

// Function to fetch user following status
function fetchUserFollowingStatus(userId) {
    return fetch(`http://localhost:9990/UserFollowing/${userId}`,{
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        });
}

// Function to display users
function displayUsers(users, following) {
    peopleContainer.innerHTML = "";
    users.forEach(user => {
        const personDiv = document.createElement("div");
        personDiv.classList.add("person");

        const personInfoDiv = document.createElement("div");
        personInfoDiv.classList.add("personInfo");

        const nameHeader = document.createElement("h3");
        nameHeader.classList.add("name");
        nameHeader.textContent = user.name;

        const usernameParagraph = document.createElement("p");
        usernameParagraph.classList.add("username");
        usernameParagraph.textContent = "@" + user.username;

        let userImage = document.createElement("img");
        userImage.classList.add("userImagePeople");
        if(user.image){
            userImage.src = `data:image/jpeg;base64,${user.image}`;
        }else{
            userImage.src = "Images/userImage.png";
        }

        personInfoDiv.appendChild(nameHeader);
        personInfoDiv.appendChild(usernameParagraph);
        personInfoDiv.appendChild(userImage);

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        const checkProfileButton = document.createElement("button");
        checkProfileButton.classList.add("checkProfileButton");
        checkProfileButton.textContent = "Check Profile";
        checkProfileButton.addEventListener("click", ()=>{
            localStorage.setItem("checkProfile", user.id);
            window.location.href = "CheckProfile.html";
        })

        const followButton = document.createElement("button");
        followButton.classList.add("followButton");

        if (following.some(followedUser => followedUser.id === user.id)) {
            followButton.textContent = "Unfollow";
            followButton.style.backgroundColor = "red";
            followButton.addEventListener("click", () => {
                unfollowUser(userId, user.id);
            });
        } else {
            followButton.textContent = "Follow";
            followButton.addEventListener("click", () => {
                followUser(userId, user.id);
            });
        }

        buttonsDiv.appendChild(checkProfileButton);
        buttonsDiv.appendChild(followButton);

        personDiv.appendChild(personInfoDiv);
        personDiv.appendChild(buttonsDiv);

        peopleContainer.append(personDiv);
    });
}

// Function to follow a user
function followUser(userId, followUserId) {
    fetch(`http://localhost:9990/addToFollowing/${userId}/${followUserId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
        .then(res => {
            if (res.status == 200) {
                fetchUsersAndCheckFollowing(); // Refresh the user list after following
                postFollowNotification(followUserId,userId);
                console.log("Followed user");
            } else {
                //window.alert("Something went wrong!");
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    //footer: '<a href="">Why do I have this issue?</a>'
                  })
            }
        })
        .catch(error => {
            console.error("Error following user:", error);
        });
}

// Function to unfollow a user
function unfollowUser(userId, unfollowUserId) {
    fetch(`http://localhost:9990/removeFollowing/${userId}/${unfollowUserId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
        .then(res => {
            if (res.status == 202 || res.status == 200) {
                fetchUsersAndCheckFollowing(); // Refresh the user list after unfollowing
                console.log("Unfollowed user");
            } else {
                //window.alert("Something went wrong!");
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    //footer: '<a href="">Why do I have this issue?</a>'
                  })
            }
        })
        .catch(error => {
            console.error("Error unfollowing user:", error);
        });
}

// Call the initial fetchUsersAndCheckFollowing function
fetchUsersAndCheckFollowing();


//code to search 
function searchUsers(keyword){
    fetch(`http://localhost:9990/SearchUser/${keyword}`,{
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then(res => res.json())
        .then(users => {
            if(users.length == 0){
                peopleContainer.innerHTML = `<h1 style="text-align: center; margin-top: 40px">No user found :(  </h1>`;
                return;
            }
            fetchUserFollowingStatus(userId)
                .then(following => {
                    displayUsers(users, following);
                })
                .catch(error => {
                    console.error("Error fetching following status:", error);
                });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
}

let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", ()=>{
    let keyword = searchInput.value;
    searchUsers(keyword);
})

// Add an event listener for the "keydown" event on the search input
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        let keyword = searchInput.value;
        searchUsers(keyword);
    }
});



//create a function to make following notification to the user 
function postFollowNotification(recipent_id, sender_id){
    fetch(`http://localhost:9990/createFollowNoti/${recipent_id}/${sender_id}`, {
        method: "POST",
        headers:{
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then((res)=>{
        console.log("notification status: "+ res.status);
    })
}