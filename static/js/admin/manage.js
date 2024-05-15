
//Event Listener for change in user roles
document.querySelectorAll('.form-control').forEach(select => {
    select.addEventListener('change', (event) => {
        const role = event.target.value;
        const username = event.target.id.split('-')[2];
        const redpoly = 'no';
        updateUserRole(username,role,redpoly);

    });
});

document.querySelectorAll('.normal-dealer').forEach(select => {
    select.addEventListener('change', (event) => {
        const role = event.target.value;
        const username = event.target.id.split('-')[2];
        const redpoly = 'yes';
        updateUserRole(username,role,redpoly);

    });
});

document.querySelectorAll('.redpoly-dealer').forEach(select => {
    select.addEventListener('change', (event) => {
        const role = event.target.value;
        const username = event.target.id.split('-')[2];
        const redpoly = 'no';
        updateUserRole(username,role,redpoly);

    });
});

//Function for updating user role details
function updateUserRole(username,role,redpoly){
    fetch('/update_user_role/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken' : csrftoken,
        },
        body: JSON.stringify({'username': username, 'role': role, 'redpoly': redpoly })
        }) 
    
    updateDealerSection(username,role,redpoly);

    
}

//Function for updating dealer roles section
function updateDealerSection(username,role,redpoly){
    const dealerContainer = document.querySelector(`.dealer-role-${username}`);
        if (role === 'customer') {

            if(redpoly == 'yes'){
                const dealerOptions = `
                    <option value="customer" selected>Red Poly</option>
                    <option value="customer">Normal</option>
                `;
                dealerContainer.innerHTML = `
                    Dealer Type :
                    <select id="dealer-role-${username}" name="dealer-role" class="dealer-type redpoly-dealer" style="border: 1px solid;border-radius: 10px">
                        ${dealerOptions}
                    </select>
                `;

                reattachRedpolyEventListener();

            }else if(redpoly = 'no'){
                const dealerOptions = `
                    <option value="customer" selected>Normal</option>
                    <option value="customer">Red Poly</option>
                `;
                dealerContainer.innerHTML = `
                    Dealer Type :
                    <select id="dealer-role-${username}" name="dealer-role" class="dealer-type normal-dealer" style="border: 1px solid;border-radius: 10px">
                        ${dealerOptions}
                    </select>
                `;

                reattachNormalEventListener();
            }
            
        }else{
            dealerContainer.innerHTML = `
                
            `;
        }
}

//Function to reattach event listeners
function reattachRedpolyEventListener() {
    document.querySelectorAll('.redpoly-dealer').forEach(select => {
        select.addEventListener('change', (event) => {
            const role = event.target.value;
            const username = event.target.id.split('-')[2];
            const redpoly = 'no';
            updateUserRole(username,role,redpoly);
    
        });
    });
} 
function reattachNormalEventListener() {
    document.querySelectorAll('.normal-dealer').forEach(select => {
        select.addEventListener('change', (event) => {
            const role = event.target.value;
            const username = event.target.id.split('-')[2];
            const redpoly = 'yes';
            updateUserRole(username,role,redpoly);
    
        });
    });
} 



//To show and hide username field
function toggleUsername(userId) {
    var fieldId = `.username-container-${userId}`;
    var usernameContainer = document.querySelector(fieldId);
    var usernameField = usernameContainer.querySelector('input');
    var eyeIconOpen = usernameContainer.querySelector('.toggle-username svg:nth-child(1)');
    var eyeIconSlash = usernameContainer.querySelector('.toggle-username svg:nth-child(2)');
    
    if (usernameField.type === "password") {
        usernameField.type = "text";
        eyeIconOpen.style.display = 'none';
        eyeIconSlash.style.display = 'block';
    } else {
        usernameField.type = "password";
        eyeIconOpen.style.display = 'block';
        eyeIconSlash.style.display = 'none';
    }
}

//To show and hide password field
function togglePassword(userId) {
    var fieldId = `.password-container-${userId}`;
    var passwordContainer = document.querySelector(fieldId);
    var passwordField = passwordContainer.querySelector('input');
    var openEyeIcon = document.querySelector('.toggle-password svg:nth-child(1)');
    var slashedEyeIcon = document.querySelector('.toggle-password svg:nth-child(2)');
    if (passwordField.type === "password") {
        passwordField.type = "text";
        openEyeIcon.style.display = 'none';
        slashedEyeIcon.style.display = 'block';
    } else {
        passwordField.type = "password";
        openEyeIcon.style.display = 'block';
        slashedEyeIcon.style.display = 'none';
    }
}



// Update Buttons
const updateButtons = document.querySelectorAll('.update-button');
updateButtons.forEach(button => {
    button.disabled = true;
    const userId = button.id.split('-')[2];
 
    // Construct IDs for username and password fields
    const usernameFieldId = `username-${userId}`;
    const passwordFieldId = `password-${userId}`;
    const usernameInput = document.getElementById(usernameFieldId);
    const passwordInput = document.getElementById(passwordFieldId);
    // Get the values of the username and password fields
    const currentUsername = usernameInput.value;
    const currentPassword = passwordInput.value;

    // Function to enable button if either username or password changes
    const enableButtonIfChanged = () => {
        const newUsername = usernameInput.value;
        const newPassword = passwordInput.value;
        if (currentUsername !== newUsername || currentPassword !== newPassword) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    };

    // Add event listener for username field
    usernameInput.addEventListener('input', () => {
        enableButtonIfChanged();    
    });

    // Add event listener for password field
    passwordInput.addEventListener('input', () => {
        enableButtonIfChanged();
    });

    button.addEventListener('click', () => {
        // Get the new values of username and password fields
        const newUsername = usernameInput.value;
        const newPassword = passwordInput.value;
        // Call a function and pass the required fields
        updateUserData(currentUsername, currentPassword, newUsername, newPassword);
        resetButton(button,usernameInput,passwordInput);
    });
});

//Update User in Backend
function updateUserData(currentUsername, currentPassword, newUsername, newPassword){
    fetch('/update_user_data/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken' : csrftoken,
        },
        body: JSON.stringify({'username': currentUsername, 'new_username': newUsername, 'current_pass': currentPassword, 'new_pass': newPassword })
    });
};

//Cycle button
function resetButton(button,usernameInput,passwordInput){
    button.disabled = true;
    
    // Get the values of the username and password fields
    const currentUsername = usernameInput.value;
    const currentPassword = passwordInput.value;

    // Function to enable button if either username or password changes
    const enableButtonIfChanged = () => {
        const newUsername = usernameInput.value;
        const newPassword = passwordInput.value;
        if (currentUsername !== newUsername || currentPassword !== newPassword) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    };

    // Add event listener for username field
    usernameInput.addEventListener('input', () => {
        enableButtonIfChanged();    
    });

    // Add event listener for password field
    passwordInput.addEventListener('input', () => {
        enableButtonIfChanged();
    });

    button.addEventListener('click', () => {
        // Get the new values of username and password fields
        const newUsername = usernameInput.value;
        const newPassword = passwordInput.value;
        // Call a function and pass the required fields
        updateUserData(currentUsername, currentPassword, newUsername, newPassword);
        resetButton(button,usernameInput,passwordInput);
    });
};

