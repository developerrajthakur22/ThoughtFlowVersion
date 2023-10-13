let checkProfidleUserId = localStorage.getItem("checkProfile");


let name = document.getElementById("name");
let username = document.getElementById("username");
let email = document.getElementById("email");
let followerCountNum = document.getElementById("followerCountNum");
let followingCountNum = document.getElementById("followingCountNum");
let userCategory = document.querySelectorAll(".category");
let userProfilePicture = document.querySelector(".profilePicOfUser");

let yourPostBtn = document.querySelector(".post-button-CheckProfile");

yourPostBtn.addEventListener("click", ()=>{
    window.location.href = "UserPost.html";
})

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


let fetchUserAPI = `http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UserProfile/${checkProfidleUserId}`;

fetch(fetchUserAPI,{
    headers: {
        "Authorization": `Bearer ${jwtToken}`
    }
})
    .then(res => {
        return res.json();
    })
    .then(res => {
        console.log(res);
        let profile = document.createElement("img");
        profile.src = `data:image/jpeg;base64,${res.image}`;
        if(res.image == null){
            profile.src = "Images/userImage.png";
        }
        profile.classList.add("profilePhoto");
        userProfilePicture.append(profile);
        name.innerText = res.name;
        username.innerText = res.username;
        email.innerText = res.email;
        for(let i = 0; i < 3; i++){
            if(res.postCategory[i] == ""){
                userCategory[i].innerText = "No selection";
            }
            userCategory[i].innerText = res.postCategory[i];
        }
        // userProfilePicture.src = `data:image/jpeg;base64,${res.image}`;
 
    })

//fetch following
fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UserFollowing/${checkProfidleUserId}`,{
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
fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UserFollower/${checkProfidleUserId}`,{
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
    data.forEach((element,index) => {

        let div = document.createElement("div");
        div.classList.add("follower")

        let followerName = document.createElement("p");
        followerName.textContent = `${element.name} (${element.username})`;

        // let unfollowBtn = document.createElement("button");
        // unfollowBtn.innerText = "Unfollow";
        // unfollowBtn.classList.add("unfollow-button");

        // unfollowBtn.addEventListener("click", () => {
        //     fetch(`http://localhost:9990/removeFollowing/${userID}/${element.id}`, {
        //         method: 'DELETE'
        //         })
        //         .then(res => {
        //              if(res.status==202 || res.status==200){
        //                 data.splice(index, 1);
        //                 displayFollowing(data);
        //                 console.log("follower removed")
        //             }else{
        //                 console.log("something went wrong!")
        //              }
        //         })
        // })
        div.append(followerName);
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

        div.append(followerName);
        followerList.append(div);
    });
}