let name = document.getElementById("name");
let username = document.getElementById("username");
let email = document.getElementById("email");

let newPassword = document.getElementById("setPassword");
let confirmPassword = document.getElementById("confirmPassword");

let saveBtn = document.getElementById("save");

let fetchUserAPI = "http://localhost:9990/UserProfile/6";

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
        //console.log(selectedCategories)
    });
});


saveBtn.addEventListener("click", () => {
    
    if(newPassword.value.length > 25){
       // window.alert("Password length too long");
        Swal.fire('Password length too long!')
        return;
    }

    if(newPassword.value.length < 5){
       // window.alert("Password length too short");
        Swal.fire('Password length too short!')
        return;
    }

    if(newPassword.value !== confirmPassword.value){
             //  window.alert("Please check the confirm password again");
               Swal.fire("Please check the confirm password again")
               return;
    }

    if (selectedCategories.length === 3) {
        // Initialize the object with only non-empty fields
        const obj = {
            name: name.value,
            username: username.value,
            email: email.value,
            postCategory: selectedCategories,
            password: newPassword.value,
        };

        // Check if an image file has been selected
        const imageUploadInput = document.getElementById("imageUpload");
        const selectedFile = imageUploadInput.files[0];

        if (selectedFile) {
            // Read the selected image file as a base64 string
            const reader = new FileReader();

            reader.onload = (event) => {
                const base64ImageData = event.target.result.split(',')[1]; // Get the base64 part after the comma

                // Add the base64 image data to the user object
                obj.image = base64ImageData;

                // Send a request to add the user with the image included
                sendAddUserRequest(obj);
            };

            reader.readAsDataURL(selectedFile);
        } else {
            // Send a request to add the user without an image
            sendAddUserRequest(obj);
        }
    } else {
       // window.alert("Select only 3 categories");
        Swal.fire("Select only 3 categories")
    }
});

// Function to send the addUser request
function sendAddUserRequest(userObj) {
    fetch("http://localhost:9990/addUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
    })
    .then(response => {
        if (response.status != 202) {
            console.log(response);
           // window.alert("Something went wrong, try to use different username");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong, try to use different username',
               // footer: '<a href="">Why do I have this issue?</a>'
              })
            return;
        }else{
            return response.json();
        }
    })
    .then(data=>{
        console.log(data)
       // localStorage.setItem("TFUserId", data.id);
        //window.alert("User profile Created");
        Swal.fire(
            'Done!',
            'User profile Created!',
            'success'
          )
        window.location.href = "login.html";
        
    })
    .catch((error) => {
        console.error("Error adding user:", error);
    });
}