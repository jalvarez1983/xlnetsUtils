const button_actions = {

	addUser : function(){
		const newUserName = document.getElementById('newUserName').value.trim();	
		if (newUserName) {
			let users = JSON.parse(localStorage.getItem('users') || '[]');
			users.push({ name: newUserName });
			localStorage.setItem('users', JSON.stringify(users));
			populateUserList(users);
			document.getElementById('newUserName').value = '';
			document.getElementById('userForm').style.display = "none";
		}
	},

	removeUser : function(users){
		const index = users.indexOf(user);
		if (index > -1) {
			users.splice(index, 1);
		}
		localStorage.setItem('users', JSON.stringify(users));			
		li.remove();		
	},

	insertNameToInput: function(userName) {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const currentTab = tabs[0];
			console.log(currentTab.id);
			chrome.scripting.executeScript({
				target: { tabId: currentTab.id },
				func: button_actions.setUserPass,
				args: [userName]
			});
		});
		window.close();
	},

	setUserPass: function(userName) {
		document.getElementById("idUsuario").value = userName;
		document.getElementById("idPassword").value = userName;
		document.getElementsByName("aceptar")[0].click();
	},

	showFormButton: function(){
		const userForm = document.getElementById('userForm');		
		if (userForm.style.display === "none" || userForm.style.display === "") {
			userForm.style.display = "block";
		} else {
			userForm.style.display = "none";
		}
	}
}

document.getElementById('addUser').addEventListener('click', button_actions.addUser);
document.getElementById('showFormButton').addEventListener('click', button_actions.showFormButton);

function loadUsers() {
	let users = JSON.parse(localStorage.getItem('users') || '[]');
	// Ordenando alfabéticamente
	users.sort((a, b) => a.name.localeCompare(b.name));
	return Promise.resolve(users);
}

function populateUserList(users) {
	const userList = document.getElementById('userList');
	userList.innerHTML = ''; // Limpiar la lista existente

	users.forEach(user => {
		const li = document.createElement('li');
		li.className = "mb-2"; // margen inferior

		// Contenedor row para el sistema de rejilla
		const rowDiv = document.createElement('div');
		rowDiv.className = "row align-items-center"; // Alineación vertical

		// Columna para el nombre del usuario
		const nameDiv = document.createElement('div');
		nameDiv.className = "col-2 username";
		nameDiv.textContent = user.name.toUpperCase();

		// Columna para los botones
		const buttonsDiv = document.createElement('div');
		buttonsDiv.className = "col-10 text-right";

		const buttonUppercase = document.createElement('button');
		buttonUppercase.textContent = " Mayúsculas";
		buttonUppercase.className = "btn btn-mayusculas  btn-sm mr-1";
		buttonUppercase.addEventListener('click', function () {
			button_actions.insertNameToInput(user.name.toUpperCase());
		});

		const buttonLowercase = document.createElement('button');
		buttonLowercase.textContent = " Minúsculas";
		buttonLowercase.className = "btn btn-minusculas btn-sm";
		buttonLowercase.addEventListener('click', function () {
			button_actions.insertNameToInput(user.name.toLowerCase());
		});

		// Botón para borrar el usuario
		const deleteButton = document.createElement('button');
		deleteButton.className = 'btn btn-eliminar btn-sm ml-2 ';
		deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; 	// Añade ícono de Font Awesome
		deleteButton.addEventListener('click', function () {			
			button_actions.removeUser(users);
		});

		const iconUppercase = document.createElement('i');
		iconUppercase.className = "fas fa-arrow-up";
		buttonUppercase.prepend(iconUppercase);
		const iconLowercase = document.createElement('i');
		iconLowercase.className = "fas fa-arrow-down";
		buttonLowercase.prepend(iconLowercase);

		buttonsDiv.appendChild(buttonUppercase);
		buttonsDiv.appendChild(buttonLowercase);
		buttonsDiv.appendChild(deleteButton);

		rowDiv.appendChild(nameDiv);
		rowDiv.appendChild(buttonsDiv);

		li.appendChild(rowDiv);
		userList.appendChild(li);
	});
}

// Llenar la lista con los nombres de usuario
loadUsers().then(users => {
	populateUserList(users);
});