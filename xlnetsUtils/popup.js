document.addEventListener("DOMContentLoaded", () => {
  const userList = document.getElementById("userList");
  const addUserBtn = document.getElementById("addUser");
  const newUserName = document.getElementById("newUserName");
  const newPassword = document.getElementById("newPassword");
  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const importFile = document.getElementById("importFile");

  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  const guardarUsuarios = () => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  };

  const inyectarUsuario = (username, password) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      console.log(currentTab.id);
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: setUserPass,
        args: [username, password], // Pasar username y password
      });
    });
    window.close();
  };

  const setUserPass = function (username, password) {
    document.getElementById("idUsuario").value = username; // Setear username
    document.getElementById("idPassword").value = password; // Setear password
    document.getElementsByName("aceptar")[0].click(); // Hacer clic en el botón
  };

  const renderUsuarios = () => {
	userList.innerHTML = "";
	usuarios.forEach(({ username, password }, index) => {
	  const li = document.createElement("li");
	  li.className = "list-group-item d-flex justify-content-between align-items-center";
  
	  // 🅰️ Zona izquierda: nombre
	  const name = document.createElement("span");
	  name.className = "username";
	  name.textContent = username;
  
	  // 🅱️ Zona derecha: acciones
	  const actions = document.createElement("div");
	  actions.className = "d-flex align-items-center gap-1";
  
	  const createActionButton = (text, title, transformFn) => {
		const btn = document.createElement("button");
		btn.textContent = text;
		btn.title = title;
		btn.className = "btn btn-insertar btn-sm mx-1";
		btn.onclick = () => inyectarUsuario(transformFn(username), transformFn(password));
		return btn;
	  };
  
	  actions.appendChild(createActionButton("Original", "Original", (u) => u));
	  actions.appendChild(createActionButton("Mayúsculas", "Mayúsculas", (u) => u.toUpperCase()));
	  actions.appendChild(createActionButton("Minúsculas", "Minúsculas", (u) => u.toLowerCase()));
  
	  const delBtn = document.createElement("button");
	  delBtn.className = "btn btn-eliminar btn-sm ml-2";
	  delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	  delBtn.onclick = () => {
		const confirmed = window.confirm(`¿Eliminar el usuario "${username}"?`);
		if (!confirmed) return;
		usuarios.splice(index, 1);
		guardarUsuarios();
		renderUsuarios();
	  };
  
	  actions.appendChild(delBtn);
  
	  li.appendChild(name);
	  li.appendChild(actions);
	  userList.appendChild(li);
	});
  };
  

  addUserBtn.addEventListener("click", () => {
    const username = newUserName.value.trim();
    const password = newPassword.value.trim();
    if (!username || !password) return;

    usuarios.push({ username, password });
    guardarUsuarios();
    renderUsuarios();

    newUserName.value = "";
    newPassword.value = "";
  });

  exportBtn.onclick = () => {
    const dataStr = JSON.stringify(usuarios, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usuarios.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  importBtn.onclick = () => {
	importFile.click();
  };

  importFile.addEventListener("change", () => {
	const file = importFile.files[0];
	if (!file) return;
  
	const reader = new FileReader();
	reader.onload = (e) => {
	  try {
		const imported = JSON.parse(e.target.result);
		if (!Array.isArray(imported)) throw new Error("Formato incorrecto");
		for (const user of imported) {
		  if (typeof user.username !== "string" || typeof user.password !== "string") {
			throw new Error("Estructura inválida");
		  }
		}
		usuarios = imported;
		guardarUsuarios();
		renderUsuarios();
		alert("Importado correctamente");
		importFile.value = ""; // reset input
	  } catch (err) {
		alert("Error al importar: " + err.message);
	  }
	};
	reader.readAsText(file);
  });

  renderUsuarios();

  document.getElementById("toggleAddUser").addEventListener("click", () => {
	const form = document.getElementById("userForm");
	form.style.display = form.style.display === "none" ? "block" : "none";
  });
  
  document.getElementById("toggleImportExport").addEventListener("click", () => {
	const section = document.getElementById("importExportSection");
	section.style.display = section.style.display === "none" ? "block" : "none";
  });
});
