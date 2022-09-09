// ------- Variables -------
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaProductos = document.querySelector('#lista-productos');

// Crea los productos a HTML
const creandoProductos = async() => {
    const response = await fetch("../secciones/data.json");
    const productosCreados = await response.json();
    productosCreados.forEach(producto => {
        const {img, nombre, precio, button, id} = producto;
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="${img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h3 class="card-title">${nombre}</h3>
                <p class="card-text">$${precio}</p>
                <button class="agregar-carrito" data-id="${id}">${button}</button>
            </div>
        </div>
        `;
        listaProductos.append(div);
    })
}
creandoProductos();
let productosCarrito = [];

// Local storage Carrito
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('productosCarrito')){
        productosCarrito = JSON.parse(localStorage.getItem('productosCarrito'))
        carritoHTML()
    }
})

registrarEventListeners();
function registrarEventListeners() {
    // Agrega un producto usando "Agregar al carrito"
    listaProductos.addEventListener('click', agregarProducto);
    // Elimina productos del carrito
    carrito.addEventListener('click', eliminarProducto);
    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        productosCarrito = []; // Reseteo del array
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El carrito se vacío correctamente',
            showConfirmButton: false,
            timer: 1000
        })
        limpiarHTML(); // Eliminamos todo el HTML
    })
}

// -------- Funciones -------
function agregarProducto(e) {
    if( e.target.classList.contains('agregar-carrito')){
        const productoSeleccionado = e.target.parentElement.parentElement;
        leerDatosProducto(productoSeleccionado);
    }
}

function eliminarProducto(e) {
    console.log(e.target.classList);
    if(e.target.classList.contains('carritoEliminar')) {
        const productoId = e.target.getAttribute('data-id');
        productosCarrito = productosCarrito.filter( producto => producto.id !== productoId);
        carritoHTML();
    }
}

// Lee el contenido del HTML que hagamos click y extrae la info
function leerDatosProducto(producto) {
    // Crea un objeto con el contenido del producto actual
    const infoProducto = {
        nombre: producto.querySelector('h3').textContent,
        precio: producto.querySelector('p').textContent,
        id: producto.querySelector('button').getAttribute('data-id'),
        cantidad: 1
    }

    // Verifica si un elemento ya exite en el carrito para actualizar la cantidad
    const existeProducto = productosCarrito.some( producto => producto.id === infoProducto.id);
    if(existeProducto) {
        // Actualiza la cantidad
        const productoMas = productosCarrito.map( producto => {
            if(producto.id === infoProducto.id){
                producto.cantidad++;
                return producto;
            }else {
                // Agrega el elemento al arreglo del carrito
                return producto;
            }
        } );
        productosCarrito = [...productoMas];
    }else {
        productosCarrito = [...productosCarrito, infoProducto];
    }
    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
    //limpia el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    productosCarrito.forEach(producto => {
        const {nombre, precio, cantidad, id} = producto;
        const row = document.createElement('tr')
        row.innerHTML = `
                        <td>${nombre}</td>
                        <td>${precio}</td>
                        <td>${cantidad}</td>
                        <td>
                            <a href="#" class="carritoEliminar" data-id="${id}"> X </a>
                        </td>
                        `;
        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
        // Renderizado de localStorage en el carrito
        localStorage.setItem('productosCarrito', JSON.stringify(productosCarrito))
    });
}

// Elimina los productos del tbody
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}