let userID = localStorage.getItem("TFUserId");

let name = document.getElementById("name");
let username = document.getElementById("username");
let email = document.getElementById("email");
let followerCountNum = document.getElementById("followerCountNum");
let followingCountNum = document.getElementById("followingCountNum");
let userCategory = document.querySelectorAll(".category");

let yourPostBtn = document.querySelector(".post-button");

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

yourPostBtn.addEventListener("click", () => {
    window.location.href = "YourPost.html";
})

let editProfileBtn = document.querySelector(".edit-profile-button");
editProfileBtn.addEventListener("click", () => {
    window.location.href = "EditProfile.html";
})

let fetchUserAPI = `http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UserProfile/${userID}`;

fetch(fetchUserAPI, {
    headers: {
        "Authorization": `Bearer ${jwtToken}`
    }
})
    .then(res => {
        return res.json();
    })
    .then(res => {
        console.log(res);
        name.innerText = res.name;
        username.innerText = res.username;
        email.innerText = res.email;
        for (let i = 0; i < 3; i++) {
            if (res.postCategory[i] == "") {
                userCategory[i].innerText = "No selection";
            }
            userCategory[i].innerText = res.postCategory[i];
        }

    })

//fetch following
fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UserFollowing/${userID}`,{
    headers: {
        "Authorization": `Bearer ${jwtToken}`
    }
})
    .then(res => {
        return res.json();
    })
    .then(res => {
        // console.log(res);
        followingCountNum.innerText = res.length;
        displayFollowing(res);
    })

//fetch follower
fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UserFollower/${userID}`,{
    headers: {
        "Authorization": `Bearer ${jwtToken}`
    }
})
    .then(res => {
        return res.json();
    })
    .then(res => {
        // console.log(res);
        followerCountNum.innerText = res.length;
        displayFollower(res);
    })

//Get user followers and following list
let followingList = document.querySelector(".following-list");

let followingContainer = document.createElement("div");

function displayFollowing(data) {
    followingContainer.innerHTML = "";
    data.forEach((element, index) => {

        let div = document.createElement("div");
        div.classList.add("follower")

        let followerName = document.createElement("p");
        followerName.textContent = `${element.name} (${element.username})`;

        let unfollowBtn = document.createElement("button");
        unfollowBtn.innerText = "Unfollow";
        unfollowBtn.classList.add("unfollow-button");

        unfollowBtn.addEventListener("click", () => {
            fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/removeFollowing/${userID}/${element.id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
                .then(res => {
                    if (res.status == 202 || res.status == 200) {
                        data.splice(index, 1);
                        displayFollowing(data);
                        console.log("follower removed")
                    } else {
                        console.log("something went wrong!")
                    }
                })
        })
        div.append(followerName, unfollowBtn);
        followingContainer.append(div);
        followingList.append(followingContainer);
    });
}

let followerList = document.querySelector(".follower-list");

function displayFollower(data) {
    data.forEach(element => {
        let div = document.createElement("div");
        div.classList.add("follower")

        let followerName = document.createElement("p");
        followerName.textContent = `${element.name} (${element.username})`;

        let unfollowBtn = document.createElement("button");
        unfollowBtn.innerText = "remove";
        unfollowBtn.classList.add("remove-button");

        div.append(followerName);
        followerList.append(div);
    });
}