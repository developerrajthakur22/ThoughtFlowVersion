let checkProfidleUserId = localStorage.getItem("checkProfile");

let userID = localStorage.getItem("TFUserId");

let PostUsername = document.getElementById("PostUsername");

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

let mainDiv = document.getElementById("yourPosts");
//function that fetch the api and shows all the posts;
function displayAllPost(){
    fetch(`http://localhost:9990/UserPosts/${checkProfidleUserId}`,{
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then(res =>{
        return res.json();
    })
    .then(res=>{
        // PostUsername.innerText = res.name + " (" + res.username + ")"; 
        console.log(res);
        if(res.length == 0){
            mainDiv.innerHTML = `<h1 style="text-align: center; margin-top: 40px">No Posts :(  </h1>`;
        }else{
            displayFeed(res);
        }
    })
}

//function call first time to show whenever the page is loaded
displayAllPost()


function displayFeed(data) {
    
    mainDiv.innerHTML = "";
    for(let i = data.length-1; i >= 0; i--){
        let element = data[i];
        
        let PostDiv = document.createElement("div");
        PostDiv.classList.add("post");

        let title = document.createElement("h3");
        title.innerText = element.title;

        let tweet = document.createElement("p");
        tweet.innerHTML = createTweet(element.tweet).innerHTML;
        tweet.classList.add("post-description");

        let postDetails = document.createElement("div");
        postDetails.classList.add("post-details");

        let username = document.createElement("span");
        username.innerText = `Posted by: ${element.user.name.split(" ")[0]} (${element.user.username})`;
        username.classList.add("username");

        let postDate = document.createElement("span");
        postDate.innerText = element.date;
        postDate.classList.add("post-date");

        postDetails.append(username, postDate);

        let postActions = document.createElement("div");
        postActions.classList.add("post-actions");

        let likeButton = document.createElement("button");


        //We are check whether the user has already liked the or not so that we are not making the same like request again and again
        let isLiked = false;
        let likeCount = element.postLikes.length;

        for (let i = 0; i < element.postLikes.length; i++) {
            if (element.postLikes[i].user == userID) {
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
                fetch(`http://localhost:9990/LikePost/${element.post_id}/${userID}`, {
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
                            console.log("Liked successfully");
                        } else {
                            console.log("Not liked, Something went wrong");
                        }
                    })
            }
            else {
                fetch(`http://localhost:9990/UnlikePost/${element.post_id}/${userID}`, {
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
        commentButton.innerText = `Comment (${element.comments.length})`;
        commentButton.classList.add("comment-button");
        commentButton.classList.add("comment-toggle-button");

        let mainComment = document.createElement("div");
        mainComment.style.display = "none";
        mainComment.classList.toggle("comments-section");

        //this will fetch all the comments
        function fetchComments(post_id){
            mainComment.innerHTML = "";
            fetch(`http://localhost:9990/PostComments/${element.post_id}`,{
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
            .then(response => {
                return response.json();
            })
            .then(res => {
                console.log(res)
                //Code related to comment section
                
                for (let i = res.length-1; i >= 0; i--) {
                    let com = res[i];
                    
                    let commentDiv = document.createElement("div");
                    commentDiv.classList.add("comment");
                    
                    let ComUser = document.createElement("h3");
                    ComUser.innerText = `${Object.keys(com)[0]}`;
                    
                    let comment = document.createElement("div");
                    comment.innerText = com[Object.keys(com)[0]].comment;

                    if (com[Object.keys(com)[0]].user == userID) {
                        let deleteCommentBtn = document.createElement("button");
                        deleteCommentBtn.innerText = "Delete";
                        deleteCommentBtn.style.color = "red";

                        deleteCommentBtn.addEventListener("click", () => {
                            console.log(element.post_id, com[Object.keys(com)[0]])
                            // Call the deleteAComment function
                             deleteAComment(element.post_id, com[Object.keys(com)[0]]);
                        })
                        commentDiv.append(ComUser, comment, deleteCommentBtn);
                    } else {
                        commentDiv.append(ComUser, comment);
                    }
                    
                   // commentDiv.append(ComUser, comment);
                    mainComment.append(commentDiv);
                }
            })
        }

        //Delete a comment function
        function deleteAComment(post_id, Comment) {
            fetch(`http://localhost:9990/deleteAComment/${element.post_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify(Comment)
            })
                .then(res => {
                    if (res.status == 200 || res.status == 202) {
                        fetchComments(post_id)
                        console.log("Comment deleted successfully");
                    } else {
                        console.log("Comment not deleted, something went wrong!");
                    }
                    
                })
        }


        fetchComments(element.post_id);

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
                fetch(`http://localhost:9990/CommentPost/${element.post_id}/${userID}/${commmentInp.value}`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                })
                    .then(response => {
                        if (response.status === 202) {
                            console.log("commented successfully");
                            fetchComments(element.post_id);
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
        // let deleteButton = document.createElement("button");
        // deleteButton.innerText = "Delete";
        // deleteButton.classList.add("deleteBtn");

        // deleteButton.addEventListener("click", ()=>{
        //     fetch(`http://localhost:9990/removePost/${element.post_id}/${userID}`,{
        //         method: "DELETE"
        //     })
        //     .then(res=>{
        //         if(res.status == 202 || res.status == 200){
        //             window.alert("Post deleted");
        //             displayAllPost()
        //         }
        //         else{
        //             window.alert("something went wrong");
        //         }
        //     })
        // })

        postActions.append(likeButton, commentButton, mainComment, addComment);

        PostDiv.append(title, tweet, postDetails, postActions);
        mainDiv.append(PostDiv);
    }
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