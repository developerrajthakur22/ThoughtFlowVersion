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

const feedApi = `http://localhost:9990/Feed/${userID}`;

//code to search 
function searchPost(keyword) {
    fetch(`http://localhost:9990/SearchPost/${keyword}`,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    }
    )
        .then(res => {
            return res.json();
        })
        .then(data => {
            displayFeed(data);
        })
        .catch(err => {
            console.log(err);
        })
}

let searchButton = document.getElementById("search-button");
let searchInput = document.getElementById("search-input");

searchButton.addEventListener("click", () => {
    let keyword = searchInput.value;
    searchPost(keyword);
})

// Add an event listener for the "keydown" event on the search input
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        let keyword = searchInput.value;
        searchPost(keyword);
    }
});

//code of normal feed
function fetchFeedAPI() {
    fetch(feedApi,{
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            displayFeed(data);
        })
}

fetchFeedAPI();

//code of all the posts
function allPosts(){
    fetch("http://localhost:9990/allPosts",{
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            displayFeed(data);
        })
}

let yourFeedBtn = document.getElementById("yourFeed");
let allPostsBtn = document.getElementById("allPosts");

allPostsBtn.addEventListener("click", ()=>{
    allPosts();
})
yourFeedBtn.addEventListener("click", ()=>{
    fetchFeedAPI();
})


let main = document.querySelector(".main");

function displayFeed(data) {
    // main.innerHTML = 
    // `<div class="feed-header">
    // <h2>Feed</h2>
    // <div class="post-section">
    //     <div class="search-bar">
    //         <input type="text" id="search-input" placeholder="Search for Post...">
    //         <button id="search-button">Search</button>
    //     </div>
    // </div>`;
    main.innerHTML = "";
    if (data.length == 0) {
        main.innerHTML = `<h1 style="text-align: center; margin-top: 40px">No Posts :(  </h1>
        <h3 style="text-align: center; margin-top: 40px">Start following other people or click the 'All Posts' button above.  </h3>`;
    }

    data.forEach((data, index) => {

        let PostDiv = document.createElement("div");
        PostDiv.classList.add("post");

        let title = document.createElement("h3");
        title.innerText = data.title;

        let tweet = document.createElement("p");
        tweet.innerHTML = createTweet(data.tweet).innerHTML;
        tweet.classList.add("post-description");

        let postDetails = document.createElement("div");
        postDetails.classList.add("post-details");

        let username = document.createElement("span");
        username.innerText = `Posted by: ${data.user.name.split(" ")[0]} (${data.user.username})`;
        username.classList.add("username");

        let postDate = document.createElement("span");
        postDate.innerText = data.date;
        postDate.classList.add("post-date");

        postDetails.append(username, postDate);

        let postActions = document.createElement("div");
        postActions.classList.add("post-actions");

        let likeButton = document.createElement("button");


        //We are check whether the user has already liked the or not so that we are not making the same like request again and again
        let isLiked = false;
        let likeCount = data.postLikes.length;

        for (let i = 0; i < data.postLikes.length; i++) {
            if (data.postLikes[i].user == userID) {
                //console.log(data.postLikes[i]);
                isLiked = true;
                break;
            }
        }

        if (isLiked) {
            likeButton.innerText = `Liked (${likeCount})`;
            likeButton.setAttribute("your-action", "liked");
        } else {
            likeButton.innerText = `Like (${likeCount})`;
            likeButton.setAttribute("your-action", "like");
        }

        function updateLikeButton() {
            if (isLiked) {
                likeButton.innerText = `Liked (${likeCount})`;
                likeButton.setAttribute("your-action", "liked");
            }
            else {
                likeButton.innerText = `Like (${likeCount})`;
                likeButton.setAttribute("your-action", "like");
            }
        }

        likeButton.classList.add("like-button");

        //like or unlike a post code
        likeButton.addEventListener("click", () => {

            //used if-else to check whether the post is already liked or not
            if (!isLiked) {
                fetch(`http://localhost:9990/LikePost/${data.post_id}/${userID}`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                })
                    .then(response => {
                        if (response.status === 202) {
                            isLiked = true;
                            likeCount++;
                            updateLikeButton();
                            postLikeNotification(data.user.id,userID,data.post_id);
                            console.log("Liked successfully");
                        } else {
                            console.log("Not liked, Something went wrong");
                        }
                    })
            }
            else {
                fetch(`http://localhost:9990/UnlikePost/${data.post_id}/${userID}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                })
                    .then(response => {
                        if (response.status === 202) {
                            isLiked = false;
                            likeCount--;
                            updateLikeButton();
                            console.log("Unliked successfully");
                        } else {
                            console.log("Not Unliked, Something went wrong");
                        }
                    })
            }
        })

        let commentButton = document.createElement("button");
        commentButton.innerText = `Comment (${data.comments.length})`;
        commentButton.classList.add("comment-button");
        commentButton.classList.add("comment-toggle-button");

        let mainComment = document.createElement("div");
        mainComment.style.display = "none";
        mainComment.classList.toggle("comments-section");

        //this will fetch all the comments
        function fetchComments(post_id) {
            mainComment.innerHTML = "";
            fetch(`http://localhost:9990/PostComments/${post_id}`,{
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(res => {
                    //console.log(res)
                    //Code related to comment section

                    for (let i = res.length - 1; i >= 0; i--) {
                        let com = res[i];

                        let commentDiv = document.createElement("div");
                        commentDiv.classList.add("comment");

                        let ComUser = document.createElement("h3");
                        ComUser.innerText = `${Object.keys(com)[0]}`;

                        let comment = document.createElement("div");
                        comment.innerText = com[Object.keys(com)[0]].comment;

                        // let commentLike = document.createElement("button");
                        // commentLike.innerText = "Like (" + com[Object.keys(com)[0]].commentLike + ")";
                        // commentLike.addEventListener("click", ()=>{
                        //     fetch(`http://localhost:9990/likeAComment/${data.post_id}`,{
                        //         method: "POST",
                        //         headers: {
                        //             'Content-Type': 'application/json'
                        //         },
                        //         body: JSON.stringify(com)
                        //     })
                        //     .then(res=>{
                        //         if(res.status == 202 || res.status == 200){
                        //             commentLike.innerText = "Like (" + com[Object.keys(com)[0]].commentLike++ + ")";
                        //             console.log("comment liked");
                        //         }else{
                        //             console.log("something went wrong");
                        //         }
                        //     })
                        // })

                        if (com[Object.keys(com)[0]].user == userID) {
                            let deleteCommentBtn = document.createElement("button");
                            deleteCommentBtn.innerText = "Delete";
                            deleteCommentBtn.style.color = "red";

                            deleteCommentBtn.addEventListener("click", () => {
                                console.log(data.post_id, com[Object.keys(com)[0]])
                                // Call the deleteAComment function
                                 deleteAComment(data.post_id, com[Object.keys(com)[0]]);
                            })
                            commentDiv.append(ComUser, comment, deleteCommentBtn);
                        } else {
                            commentDiv.append(ComUser, comment);
                        }


                        mainComment.append(commentDiv);
                    }
                })
        }

        //Delete a comment function
        function deleteAComment(post_id, Comment) {
            fetch(`http://localhost:9990/deleteAComment/${post_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify(Comment)
            })
                .then(res => {
                    if (res.status == 200 || res.status == 202) {
                        fetchComments(data.post_id)
                        console.log("Comment deleted successfully");
                        
                    } else {
                        console.log("Comment not deleted, something went wrong!");
                    }
                    
                })
        }

        fetchComments(data.post_id);

        //this will be use to post a comment 
        let addComment = document.createElement("div");
        addComment.style.display = "none";
        addComment.classList.add("AddComment");

        let commmentInp = document.createElement("input");
        commmentInp.type = "text";
        commmentInp.placeholder = "Add a comment";

        let commentBtn = document.createElement("button");
        commentBtn.innerText = "Comment";

        commentBtn.addEventListener("click", () => {
            let comm = commmentInp.value;

            if (comm == "") {
                commmentInp.placeholder = "Please add a comment to post";
            } else {
                fetch(`http://localhost:9990/CommentPost/${data.post_id}/${userID}/${commmentInp.value}`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                })
                    .then(response => {
                        if (response.status === 202) {
                            console.log("commented successfully");
                            fetchComments(data.post_id);
                            postCommentNotification(data.user.id , userID, data.post_id);
                        } else {
                            console.log("Something went wrong");
                        }
                    })
            }
        })

        addComment.append(commmentInp, commentBtn);

        //this will works as toggle 
        commentButton.addEventListener("click", () => {
            if (mainComment.style.display == "none" && addComment.style.display == "none") {
                mainComment.style.display = "block";
                addComment.style.display = "block"
            } else {
                mainComment.style.display = "none";
                addComment.style.display = "none"
            }
        })

        //comment code end here    

        //delete a post code
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.classList.add("deleteBtnIndex");

        deleteButton.addEventListener("click", () => {
            fetch(`http://localhost:9990/removePost/${data.post_id}/${userID}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
                .then(res => {
                    if (res.status == 202 || res.status == 200) {
                        //window.alert("Post deleted");
                        Swal.fire('Post deleted')
                        fetchFeedAPI();
                    }
                    else {
                      //  window.alert("something went wrong");
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            //footer: '<a href="">Why do I have this issue?</a>'
                          })
                    }
                })
        })

        if (data.user.id == userID) {
            postActions.append(likeButton, commentButton, deleteButton, mainComment, addComment);
        } else {
            postActions.append(likeButton, commentButton, mainComment, addComment);
        }


        PostDiv.append(title, tweet, postDetails, postActions);
        main.append(PostDiv);
    });

}


//make every tweet as paragraphs model
function createTweet(text) {
    const tweetElement = document.createElement("div");
    // tweetElement.classList.add("tweet");

    // Split the text into paragraphs based on line breaks
    const paragraphs = text.split('\n');

    // Create a paragraph element for each line and add it to the tweet
    paragraphs.forEach(paragraphText => {
        const paragraphElement = document.createElement("p");
        paragraphElement.style.marginTop = 0;
        paragraphElement.style.marginBottom = "7px";
        paragraphElement.innerHTML = paragraphText.replace(/\n/g, '<br>'); // Replace newline with <br> tag
        tweetElement.appendChild(paragraphElement);
    });
    return tweetElement;
}


//create a function to make like notification to the user 
function postLikeNotification(recipent_id, sender_id, post_id){
    fetch(`http://localhost:9990/createLikeNoti/${recipent_id}/${sender_id}/${post_id}`, {
        method: "POST",
        headers:{
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then((res)=>{
        console.log("notification status: "+ res.status);
    })
}

//create a function to make comment notification to the user 
function postCommentNotification(recipent_id, sender_id, post_id){
    fetch(`http://localhost:9990/createCommentNoti/${recipent_id}/${sender_id}/${post_id}`, {
        method: "POST",
        headers:{
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then((res)=>{
        console.log("notification status: "+ res.status);
    })
}