const socket = io() 
let username 
const chatBox = document.getElementById("chatBox")
const messageLogs = document.getElementById("messageLogs")

swal.fire({
    title:"Ingresa un username",
    input:"text",
    text:"Debes identificarte primero!",
    inputValidator:(value) => {
        return !value && "Debes escribir un username valido!"
    },
    allowOutsideClick: false
}).then(result => {
    username = result.value
    console.log(`Usuario identificado como : ${username}`)
    // notificamos al servidor que se conecto
    socket.emit("user-connected", username)
})

// Escuchar el evento enter y mandar el msj
chatBox.addEventListener("keyup", event => {
    if(event.key === "Enter"){
        const text = chatBox.value;
        if(text.trim().length > 0) { 
            socket.emit("message", { username: username, message: text }); 
            chatBox.value = ""; 
        }
    }
});
                    
// Escuchar los msj desde el servidor y mostrarlos
socket.on("message", (data)=>{
    const { username, message} = data
    messageLogs.innerHTML += `${username} dice : ${message} </br>`
})

socket.on("user-joined-chat",(username) => {
    swal.fire({
        text:`Nuevo usuario conectado: ${username}`,
        toast: true,
        position:"top-rigth"
    })
})