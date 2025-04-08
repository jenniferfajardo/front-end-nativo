//1. Definir el API
const API_BASE = "http://127.0.0.1:8000"

//2. Listar datos desde el API
async function loadUsers(){

  const res= await fetch(`${API_BASE}/user/get-users`);
  const users =await res.json();

  const tbody= document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  users.data.forEach((u)=>{

    const badgeClass = u.estado === 1 ? "badge-green" : "badge-red";
    const badgeText = u.estado === 1 ? "Activo" : "Inactivo";

    const row = `<tr>
    <td>${u.nombre}</td>
    <td>${u.apellido}</td>
    <td>${u.numtelefono}</td>
    <td>${u.correo}</td>
    <td>
    <span class="badge ${badgeClass}"> ${badgeText} </span>
    </td>
    <td>
    <i class="fa-solid fa-pencil" title="Editar"></i>
    <i class="fa-solid fa-toggle-on" title="Cambiar de estado"></i>
    </td>
    </tr>`;

    tbody.innerHTML += row;
  });
}

//Gestión del modal
function openModal(){
  document.getElementById("modal").style.display= "flex";
  document.getElementById("userForm").reset();
}

function closeModal(){
  document.getElementById("modal").style.display= "none";
}


//2. Create 
async function createUser() {

  const user={
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      correo: document.getElementById("correo").value,
      numtelefono: document.getElementById("numtelefono").value,
      password: document.getElementById("password").value,
  }

  const endpoint=`${API_BASE}/user/create-user`;
  const method ="POST";

  const res= await fetch(endpoint, {
    method,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(user)
  });

  console.log(res)

  if(res.ok){
    Swal.fire(
      "Ëxito",
      "Usuario creado",
      "success"
    )
  closeModal();
  loadUsers();

  }else{
    const error= await res.json();
    Swal.fire(
      "Error",
      error.detail || "Ocurrió un problema", "error",
      "error"
    )
  }

  
}

//Cargar data
loadUsers()

document.getElementById("userForm").addEventListener("submit", function(e){
  e.preventDefault();
  createUser();
})