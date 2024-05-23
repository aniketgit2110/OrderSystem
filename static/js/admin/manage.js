
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
    var openEyeIcon = passwordContainer.querySelector('.toggle-password svg:nth-child(1)');
    var slashedEyeIcon = passwordContainer.querySelector('.toggle-password svg:nth-child(2)');
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
    updateButton(button);
});

function updateButton(button){
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
}


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





//Create New User Section
const createNewUserButton = document.getElementById('create-new-user');
const newUserForm = document.getElementById('new-user-form');
const cancelButton = document.getElementById('cancel-new-user');
const createButton = document.getElementById('create-user-button');

//Open Up the Form for New User
createNewUserButton.addEventListener('click', () => {
    createNewUserButton.classList.add('hidden');
    newUserForm.classList.remove('hidden');
});

//Cancel the Form for new User
cancelButton.addEventListener('click', () => {
    createNewUserButton.classList.remove('hidden');
    newUserForm.classList.add('hidden');
});

//To disable/enable Create button
const nameInput = document.getElementById('new-user-name');
const usernameInput = document.getElementById('new-user-username');
const passwordInput = document.getElementById('new-user-password');
const rolesSelect = document.getElementById('role');

const enableCreateButtonIfValid = () => {
    const name = nameInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = rolesSelect.value;

    if (name && username && password && role) {
        createButton.disabled = false;
    } else {
        createButton.disabled = true;
    }
};

nameInput.addEventListener('input', enableCreateButtonIfValid);
usernameInput.addEventListener('input', enableCreateButtonIfValid);
passwordInput.addEventListener('input', enableCreateButtonIfValid);
rolesSelect.addEventListener('change', enableCreateButtonIfValid);

//For Dealer Roles hiding/unhiding
const roleSelect = document.getElementById('role');
const dealerTypeContainer = document.getElementById('dealer-type-container');

roleSelect.addEventListener('change', () => {
    if (roleSelect.value === 'customer') {
        dealerTypeContainer.classList.remove('hidden');
    } else {
        dealerTypeContainer.classList.add('hidden');
    }
});

//Create new user with data
createButton.addEventListener('click', () => {

    const name = document.getElementById('new-user-name').value;
    const username = document.getElementById('new-user-username').value;
    const password = document.getElementById('new-user-password').value;
    const role = document.getElementById('role').value;
    const dealerType = document.getElementById('dealer-type').value;

    fetch('/create_new_user/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken' : csrftoken,
        },
        body: JSON.stringify({'name': name, 'username': username, 'password': password,'role': role, 'dealertype': dealerType })
        })
    .then((response) => response.json())
    .then((data) => {
        updateUser(name,username,password,role,dealerType);
        resetForm();
    });
});

//To update New User Content
function updateUser(name, username, password, role, dealerType) {
    const userId = null;
    fetch('/get_user_id/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken' : csrftoken,
        },
        body: JSON.stringify({'username': username})
        })
    .then((response) => response.json())
    .then((data) => {
        userId = data.userId;
    });
    console.log(userId);
    // Create the inner HTML content for the new user
    const innerHTML = `
        <div class="user-wrapper" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); border-radius: 14px; padding: 6px;background-color: white">
            <strong style="font-size:16px;padding-left:10px;background-color: white">${name}</strong>
            <div class="cart-row">
                <div style="flex:0.5"></div>
                <div style="flex:4" class="details" id="details-${username}">
                    <div style="padding-bottom: 9px;width: max-content;">
                        <label>Username </label>                      
                        <div class="username-container-${userId}" style="position:relative;">
                            <input class="update-user-username" type="password" id="username-${userId}" style="width:100%;height:30px;border-radius:10px;border:1px solid black" value="${username}">
                            <span class="toggle-username" style="position:absolute; right:3%; top:-55%; transform:translateY(-50%); cursor:pointer;" onclick="toggleUsername(${userId})">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="22" width="22">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="22" width="22" style="display: none;">
                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/><path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/></svg>
                            </span>
                        </div>
                    </div>
                    <div class="form-field" style="width: max-content;">
                        <label style="justify-self:start;">Password </label>
                        <div class="password-container-${userId}" style="position:relative;">
                            <input class="update-user-password" type="password" id="password-${userId}" style="width:100%;height:30px;border-radius:10px;border:1px solid black"  value="${password}">
                            <span class="toggle-password" style="position:absolute; right:3%; top:-55%; transform:translateY(-50%); cursor:pointer;" onclick="togglePassword(${userId})">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="22" width="22">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="22" width="22" style="display: none;">
                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/><path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/></svg>
                            </span>
                        </div>
                    </div>
                    <br>
                    <button class="update-button" id="update-button-${userId}" >Update</button>
                </div>
                <div style="flex:1;"></div>
                <div style="flex:4;padding-right:18px">
                    Roles :
                    <div class="user-role-${username}" data-id="${userId}">
                        <select id="user-role-${username}" name="user-role" class="form-control" style="border: 1px solid;border-radius: 10px">
                            <option value="admin"  ${role === 'admin' ? 'selected' : ''}>Admin</option>
                            <option value="manager"   ${role === 'manager' ? 'selected' : ''}>Manager</option>
                            <option value="customer" ${role === 'customer' ? 'selected' : ''}>Dealer</option>
                        </select>
                    </div>
                    <br>
                    ${role === 'customer' ?
                    `Dealer Type :
                    <div class="dealer-role-${username}" data-id="${userId}"> 
                        <select id="dealer-role-${username}" name="dealer-role" class="dealer-type ${dealerType === 'redpoly' ? 'redpoly-dealer' : 'normal-dealer'}" style="border: 1px solid;border-radius: 10px">
                            <option value="customer" ${dealerType === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="customer" ${dealerType === 'redpoly' ? 'selected' : ''}>Red Poly</option>
                        </select>
                    </div>`
                    :
                    `<div class="dealer-role-${username}" data-id="${userId}">
                    </div>`
                    }
                </div>
            </div>
        </div>
    `;

    // Append the innerHTML div to the Parent div
    const parentDiv = document.querySelector('.box');
    parentDiv.innerHTML += innerHTML;

    // Attach listener for Update button
    const button = document.getElementById(`update-button-${userId}`);
    updateButton(button);
 
    // Attach listener for user roles
    const userRoleSelect = document.getElementById(`user-role-${username}`);
    userRoleSelect.addEventListener('change', (event) => {
        const role = event.target.value;
        const username = event.target.id.split('-')[2];
        const redpoly = 'no';
        updateUserRole(username,role,redpoly);

    });

    // Attach listener for dealer roles
    const dealerRoleSelect = document.getElementById(`dealer-role-${username}`);
    // Check if dealerRoleSelect exists
    if (dealerRoleSelect) {
        const normalDealerOption = dealerRoleSelect.querySelector('option[value="normal"]');
        const redpolyDealerOption = dealerRoleSelect.querySelector('option[value="redpoly"]');

        // Attach event listener to the select element for change events
        dealerRoleSelect.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            const username = event.target.id.split('-')[2];
            let redpoly = 'no';

            // Determine if the selected option is for redpoly dealer
            if (selectedValue === 'redpoly') {
                redpoly = 'yes';
            }

            // Update user role with the selected option and redpoly flag
            updateUserRole(username, selectedValue, redpoly);
        });
    }      
    

}

//To reset form after creating new User
function resetForm(){
    //Clear the form
    document.getElementById('new-user-name').value = '';
    document.getElementById('new-user-username').value = '';
    document.getElementById('new-user-password').value = '';
    document.getElementById('role').value = ''; 
    document.getElementById('dealer-type').value = 'normal'; 
    //Hide form div
    newUserForm.classList.add('hidden');
    //Unhide the Create New User button
    createNewUserButton.classList.remove('hidden');
}