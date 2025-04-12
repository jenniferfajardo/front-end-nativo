//1. Definir el API
const API_BASE = "http://127.0.0.1:8000"

let userUpdate=null;

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
    <i class="fa-solid fa-pencil" title="Editar" onclick=openEditModal(${u.id})></i>
    <i class="fa-solid fa-toggle-on" title="Cambiar de estado" onclick=changeStatus(${u.id},${u.estado})></i>
    </td>
    </tr>`;

    tbody.innerHTML += row;
  });
}

//Gestión del modal
function openModal(){
  document.getElementById("modal").style.display= "flex";
  if(userUpdate){
    document.getElementById("formTitle").textContent="Actualizar Usuario";
    document.getElementById("submitButton").textContent="Actualizar";
  }
  else{
    document.getElementById("formTitle").textContent="Crear Usuario";
    document.getElementById("submitButton").textContent="Crear";
    document.getElementById("userForm").reset();
  }
  
}

function closeModal(){
  document.getElementById("modal").style.display= "none";
  userUpdate= null;
}

async function openEditModal(id){
  const res= await fetch(`${API_BASE}/user/get-user/${id}`);
  const response= await res.json();

  if(!res.ok || !response.data){
    return Swal.fire(
      "Error",
      "No se pudo cargar el usuario",
      "error"
    )
  }

  const user=response.data;

  document.getElementById("nombre").value = user.nombre || "";
  document.getElementById("apellido").value = user.apellido || "";
  document.getElementById("correo").value = user.correo || "";
  document.getElementById("numtelefono").value = user.numtelefono || "";
  document.getElementById("password").value = user.password || "";

  userUpdate= id;
  openModal();
}

//2. Create / Update
async function createUser() {

  const user={
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      correo: document.getElementById("correo").value,
      numtelefono: document.getElementById("numtelefono").value,
      password: document.getElementById("password").value,
  }

  const endpoint= userUpdate
  ? `${API_BASE}/user/update-user/${userUpdate}` 
  : `${API_BASE}/user/create-user`;
  
  const method = userUpdate ? "PUT" : "POST";

  const res= await fetch(endpoint, {
    method,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(user)
  });

  console.log(res)

  if(res.ok){
    Swal.fire(
      "Ëxito",
      userUpdate ? "Usuario Actualizado" : "Usuario creado",
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

//3. Change Status
async function changeStatus(id, estadoActual){

  const newState= estadoActual === 1 ? 0 : 1;
  const accion= newState ===1  ? "activar" : "inactivar";

  Swal.fire({
    title: `¿Seguro que quiere ${accion} este usuario?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Si, cambiar estado"
  }).then((result)=>{
    if(result.isConfirmed){
      fetch(`${API_BASE}/user/change-status/${id}`, {method: "PATCH"})
      .then(()=> {
        Swal.fire("Cambiado", "El estado ha sido actualizado", "success");
         loadUsers()
      })
      .catch(()=>{
        Swal.fire("Error", "No se pudo cambiar el estado", "error");
      })

    }
  })
}
//Cargar data
loadUsers()

document.getElementById("userForm").addEventListener("submit", function(e){
  e.preventDefault();
  createUser();
})