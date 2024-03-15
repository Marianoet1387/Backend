const socket = io()

//  Browser:

socket.on("newProduct", (p) => {
    const container = document.getElementById("productsFeed")
    container.innerHTML +=
        `   
        <div>
            <h3>Productos:</h3>
            <ul>
                <li> id: ${p.id}, title: ${p.title},description: ${p.description}, price: ${price},thumbnail: ${thumbnail}, code: ${p.code},stock: ${p.stock} </li>
            </ul>
        </div>
    
        `
})  