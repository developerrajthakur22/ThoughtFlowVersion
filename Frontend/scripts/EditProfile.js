let userId = localStorage.getItem("TFUserId");

let name = document.getElementById("name");
let username = document.getElementById("username");
let email = document.getElementById("email");

let oldPassword = document.getElementById("oldPassword");
let newPassword = document.getElementById("newPassword");
let confirmPassword = document.getElementById("confirmPassword");

let saveBtn = document.getElementById("save");

let fetchUserAPI = `http://localhost:9990/UserProfile/${userId}`;

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

function userData() {
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
            let name = document.getElementById("name");
            let username = document.getElementById("username");
            let email = document.getElementById("email");

            let saveBtn = document.getElementById("save");

            name.setAttribute("placeholder", res.name);
            email.setAttribute("placeholder", res.email);
            username.setAttribute("placeholder", res.username);

         //   oldPasswordOfUser = res.password;
        })
}

userData(); //call userdata one time;

// Get all category checkboxes
const checkboxes = document.querySelectorAll('input[name="category"]');

// Initialize an array to store selected categories
const selectedCategories = [];

// Listen for changes in checkboxes
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            // If the checkbox is checked, add the category to the selectedCategories array
            selectedCategories.push(checkbox.value);
        } else {
            // If the checkbox is unchecked, remove the category from the array
            const index = selectedCategories.indexOf(checkbox.value);
            if (index !== -1) {
                selectedCategories.splice(index, 1);
            }
        }
        console.log(selectedCategories)
    });
});


//Code related to password change
const changePasswordButton = document.getElementById('changePassword');
const passwordFields = document.querySelector('.password-fields');

changePasswordButton.addEventListener('click', () => {
    // Toggle the visibility of the password fields
    passwordFields.style.display = passwordFields.style.display === 'none' ? 'block' : 'none';

});


saveBtn.addEventListener("click", () => {

    if (selectedCategories.length == 0 || selectedCategories.length == 3) {

    // Initialize the obj with only non-empty fields
    let obj = {};

    // Check and add the name field if it's not empty
    if (name.value.trim() !== "") {
        obj.name = name.value;
    }

    // Check and add the username field if it's not empty
    if (username.value.trim() !== "") {
        obj.username = username.value;
    }

    // Check and add the email field if it's not empty
    if (email.value.trim() !== "") {
        obj.email = email.value;
    }

    // Check the password fields
    if (oldPassword.value.trim() !== "" && newPassword.value.trim() !== "" && confirmPassword.value.trim() !== "") {
        if (newPassword.value === confirmPassword.value) {
            // Perform the password change request
            fetch(`http://localhost:9990/ChangePassword/${oldPassword.value}/${userId}/${newPassword.value}`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
            .then(response => {
                if (response.status === 202) {
                    window.alert('User password updated successfully!');
                } else if(response.status == 400){
                    window.alert("Old password is wrong");
                }
            });
        } else {
            window.alert("New password and confirm password must match.");
        }
    }

    // Add the selected categories
    obj.postCategory = selectedCategories;

    fetch(`http://localhost:9990/UpdateUserProfile/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(obj)
    })
    .then(response => {
        if (response.status === 202) {
            name.value = "";
            username.value = "";
            email.value = "";
            userData();
            window.alert('User profile updated successfully');
        } else {
            window.alert('Failed to update user profile');
        }
    });
  }else{
    window.alert("Select only 3 categories")
  }
});



///code to upload image 
document.addEventListener("DOMContentLoaded", function () {
    const imageUploadInput = document.getElementById("imageUpload");
    const selectedFileNameDiv = document.getElementById("selectedFileName");

    imageUploadInput.addEventListener("change", function () {
        const selectedFile = imageUploadInput.files[0];

        if (selectedFile) {
            // Display the selected file's name
            selectedFileNameDiv.textContent = `Selected File: ${selectedFile.name}`;

            // Now, you can upload the selected file to the server using fetch
            const formData = new FormData();
            formData.append("file", selectedFile);

            fetch(`http://localhost:9990/UploadProfilePic/${userId}`, {
                method: "PUT",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
            .then((response) => {
                if (response.status === 202) {
                    //alert("Profile photo uploaded successfully!");
                    
                } else {
                    alert("Profile photo upload failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error uploading profile photo:", error);
            });
        }
    });
});


// Delete user profile code
let deleteButton = document.getElementById("delete");

deleteButton.addEventListener("click", ()=>{
    if (confirm("Are you sure you want to delete your profile?")) {
        // User confirmed, proceed with deletion
        deleteUser();
    }

})

function deleteUser(){
    fetch(`http://localhost:9990/delUser/${userId}`,{
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then((res)=>{
        if(res.status == 200 || res.status == 202){
            window.alert("Profile Deleted");
            window.location = "Login.html"
        }
        else{
            window.alert("Something went wrong!");
        }
    })
}