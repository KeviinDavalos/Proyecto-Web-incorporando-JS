// ------- Variables -------
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaProductos = document.querySelector('#lista-productos');

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

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('productosCarrito')){
        productosCarrito = JSON.parse(localStorage.getItem('productosCarrito'))
        carritoHTML()
    }
})

registrarEventListeners();
function registrarEventListeners() {
    listaProductos.addEventListener('click', agregarProducto);
    carrito.addEventListener('click', eliminarProducto);
    
    vaciarCarritoBtn.addEventListener('click', () => {
        productosCarrito = [];
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El carrito se vacío correctamente',
            showConfirmButton: false,
            timer: 1000
        })
        limpiarHTML();
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


function leerDatosProducto(producto) {
    const infoProducto = {
        nombre: producto.querySelector('h3').textContent,
        precio: producto.querySelector('p').textContent,
        id: producto.querySelector('button').getAttribute('data-id'),
        cantidad: 1
    }

    const existeProducto = productosCarrito.some( producto => producto.id === infoProducto.id);
    if(existeProducto) {
        const productoMas = productosCarrito.map( producto => {
            if(producto.id === infoProducto.id){
                producto.cantidad++;
                return producto;
            }else {
                return producto;
            }
        } );
        productosCarrito = [...productoMas];
    }else {
        productosCarrito = [...productosCarrito, infoProducto];
    }
    carritoHTML();
}

function carritoHTML() {
    limpiarHTML();

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
        contenedorCarrito.appendChild(row);
        localStorage.setItem('productosCarrito', JSON.stringify(productosCarrito))
    });
}

function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}