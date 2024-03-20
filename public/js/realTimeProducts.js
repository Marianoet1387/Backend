const socket = io(); // Conectarse al servidor

//  Browser:

socket.on("newProduct", (p) => { // agregamos prod al HTML
    const container = document.getElementById("productsFeed")
    container.innerHTML +=`
    <div class="div-card">
        <div class="title">
            <p>${p.title}</p>
        </div>
        <div class="image">
            <p>${p.thumbnail}</p>
        </div>
        <div class="description">
            <p>Descripcion: ${p.description}</p>
        </div>
        <div class="price">
            <p>Precio: ${p.price}</p>
        </div>
        <div class="code-stock">
            <p>Codigo: ${p.code}</p>
            <p>Stock: ${p.stock}</p>
        </div>
    </div>
    `
})

socket.on('updateProducts',(products) => {
    const productList = document.getElementById('productsFeed');
    productList.innerHTML = ''; // Limpiar la lista
    products.forEach( p => {  
    productList.innerHTML += `
    <div class="div-card">
        <div class="title">
            <p>${p.title}</p>
        </div>
        <div class="image">
            <p>${p.thumbnail}</p>
        </div>
        <div class="description">
            <p>Descripcion: ${p.description}</p>
        </div>
        <div class="price">
            <p>Precio: ${p.price}</p>
        </div>
        <div class="code-stock">
            <p>Codigo: ${p.code}</p>
            <p>Stock: ${p.stock}</p>
        </div>
    </div>
    `
    });
});
