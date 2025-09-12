const button_actions = {
    addUser: function(){
        const name = document.getElementById('newUserName').value.trim();
        const pass = document.getElementById('newUserPass').value;
        if (name && pass) {
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({ name: name, password: pass });
            localStorage.setItem('users', JSON.stringify(users));
            populateUserList(users);
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserPass').value = '';
            document.getElementById('userForm').style.display = 'none';
        }
    },

    removeUser: function(index){
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        populateUserList(users);
    },

    insertCredentials: function(user, type){
        const username = type === 'upper' ? user.name.toUpperCase() : user.name.toLowerCase();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                func: button_actions.setUserPass,
                args: [username, user.password]
            });
        });
        window.close();
    },

    setUserPass: function(userName, password) {
        document.getElementById("idUsuario").value = userName;
        document.getElementById("idPassword").value = password;
        document.getElementsByName("aceptar")[0].click();
    },

    showFormButton: function(){
        const userForm = document.getElementById('userForm');
        if (userForm.style.display === 'none' || userForm.style.display === '') {
            userForm.style.display = 'block';
        } else {
            userForm.style.display = 'none';
        }
    },

    downloadUsers: function(){
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const blob = new Blob([JSON.stringify(users, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.json';
        a.click();
        URL.revokeObjectURL(url);
    }
};

document.getElementById('addUser').addEventListener('click', button_actions.addUser);
document.getElementById('showFormButton').addEventListener('click', button_actions.showFormButton);
document.getElementById('downloadUsers').addEventListener('click', button_actions.downloadUsers);

function loadUsers() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.sort((a, b) => a.name.localeCompare(b.name));
    return Promise.resolve(users);
}

function populateUserList(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'username';
        nameSpan.textContent = user.name.toUpperCase();

        const buttonsDiv = document.createElement('div');

        const buttonUppercase = document.createElement('button');
        buttonUppercase.className = 'btn btn-outline-primary btn-sm me-1';
        buttonUppercase.innerHTML = '<i class="fas fa-arrow-up"></i>';
        buttonUppercase.addEventListener('click', function () {
            button_actions.insertCredentials(user, 'upper');
        });

        const buttonLowercase = document.createElement('button');
        buttonLowercase.className = 'btn btn-outline-info btn-sm me-1';
        buttonLowercase.innerHTML = '<i class="fas fa-arrow-down"></i>';
        buttonLowercase.addEventListener('click', function () {
            button_actions.insertCredentials(user, 'lower');
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.addEventListener('click', function () {
            button_actions.removeUser(index);
        });

        buttonsDiv.appendChild(buttonUppercase);
        buttonsDiv.appendChild(buttonLowercase);
        buttonsDiv.appendChild(deleteButton);

        li.appendChild(nameSpan);
        li.appendChild(buttonsDiv);
        userList.appendChild(li);
    });
}

loadUsers().then(users => {
    populateUserList(users);
});
