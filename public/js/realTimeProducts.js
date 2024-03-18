const socket = io(); // Conectarse al servidor

//  Browser:

socket.on("newProduct", (p) => {
    const container = document.getElementById("productsFeed")
    container.innerHTML += 
    `  
        <li> title: ${p.title},description: ${p.description}, price: ${price},thumbnail: ${thumbnail}, code: ${p.code},stock: ${p.stock} </li>
    `
})  