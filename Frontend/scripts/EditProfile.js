let userId = localStorage.getItem("TFUserId");

let name = document.getElementById("name");
let username = document.getElementById("username");
let email = document.getElementById("email");

let oldPassword = document.getElementById("oldPassword");
let newPassword = document.getElementById("newPassword");
let confirmPassword = document.getElementById("confirmPassword");

let saveBtn = document.getElementById("save");

let fetchUserAPI = `http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UserProfile/${userId}`;

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
            fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/ChangePassword/${oldPassword.value}/${userId}/${newPassword.value}`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
            .then(response => {
                if (response.status === 202) {
                 //   window.alert('User password updated successfully!');
                    Swal.fire(
                        'Password updated!',
                        'User password updated successfully!!',
                        'success'
                    )
                } else if(response.status == 400){
                   // window.alert("Old password is wrong");
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Old password is wrong!',
                        //footer: '<a href="">Why do I have this issue?</a>'
                      })
                }
            });
        } else {
          //  window.alert("New password and confirm password must match.");
            Swal.fire('The new password and the confirm password must match!')
        }
    }

    // Add the selected categories
    obj.postCategory = selectedCategories;

    fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UpdateUserProfile/${userId}`, {
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
            Swal.fire(
                'Profile updated!',
                'User profile updated successfully!',
                'success'
            )
           // window.alert('User profile updated successfully');
        } else {
            //window.alert('Failed to update user profile');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to update user profile!',
                //footer: '<a href="">Why do I have this issue?</a>'
            })
        }
    });
  }else{
    //window.alert("Select only 3 categories")
    Swal.fire('Select only 3 categories')
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

            fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/UploadProfilePic/${userId}`, {
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
    // if (confirm("Are you sure you want to delete your profile?")) {
    //     // User confirmed, proceed with deletion
    //     deleteUser();
    // }

    Swal.fire({
        title: 'Are you sure you want to delete your profile?',
        showDenyButton: true,
        //showCancelButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Cancel`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Deleted!', '', 'success')
          deleteUser();
        } else if (result.isDenied) {
          Swal.fire('User account is not deleted', '', 'info')
        }
      })

})

function deleteUser(){
    fetch(`http://thoughflowversion1withaws-env.eba-8prbfeav.ap-south-1.elasticbeanstalk.com/delUser/${userId}`,{
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then((res)=>{
        if(res.status == 200 || res.status == 202){
           // window.alert("Profile Deleted");
            Swal.fire(
                'Profile Deleted!',
                'Create a new account to continue using ThoughtFlow.',
                'success'
              )
            window.location = "Login.html"
        }
        else{
           // window.alert("Something went wrong!");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                //footer: '<a href="">Why do I have this issue?</a>'
              })
        }
    })
}