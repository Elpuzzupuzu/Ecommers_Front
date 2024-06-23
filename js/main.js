// Función para obtener los productos resumidos por categoría
async function getProductSummariesByCategory(categoryName) {
    try {
        const response = await fetch(`http://localhost:8080/products/by-category?categoryName=${categoryName}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Product Summaries for ${categoryName}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching product summaries for ${categoryName}:`, error);
        return [];
    }
}

// Función para obtener todos los productos resumidos
async function getAllProductSummaries() {
    try {
        const response = await fetch('http://localhost:8080/products/summary');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('All Product Summaries:', data);
        return data;
    } catch (error) {
        console.error('Error fetching all product summaries:', error);
        return [];
    }
}

// Función para cargar los productos después de que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    cargarProductos(); // Cargar productos iniciales

    // Obtener todos los botones de categoría
    const botonesCategoria = document.querySelectorAll(".boton-categoria");

    // Escuchar clics en los botones de categoría
    botonesCategoria.forEach(boton => {
        boton.addEventListener("click", async function(e) {
            // Remover la clase 'active' de todos los botones de categoría
            botonesCategoria.forEach(boton => boton.classList.remove("active"));
            
            // Agregar la clase 'active' al botón actual
            e.currentTarget.classList.add("active");

            // Obtener el categoryName del id del botón
            const categoryName = this.id;

            // Cargar productos por categoría
            if (categoryName === 'todos') {
                await cargarTodosLosProductos();
            } else {
                await cargarProductosPorCategoria(categoryName);
            }
        });
    });
});

// Función para cargar todos los productos
async function cargarTodosLosProductos() {
    try {
        const products = await getAllProductSummaries();
        mostrarProductos(products);
    } catch (error) {
        console.error('Error cargando todos los productos:', error);
    }
}

// Función para cargar productos por categoría
async function cargarProductosPorCategoria(categoryName) {
    try {
        const products = await getProductSummariesByCategory(categoryName);
        mostrarProductos(products);
    } catch (error) {
        console.error(`Error cargando productos por categoría ${categoryName}:`, error);
    }
}

// Función para mostrar productos en el contenedor
function mostrarProductos(products) {
    const contenedorProductos = document.querySelector("#contenedor-productos");

    if (!contenedorProductos) {
        console.error('Contenedor de productos no encontrado en el DOM');
        return;
    }

    // Limpiar contenedor de productos
    contenedorProductos.innerHTML = '';

    // Mostrar productos en el contenedor
    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${product.img}" alt="">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${product.name}</h3>
                <p class="producto-precio">${product.description}</p>
                <p class="producto-precio">${product.price}</p>
                <button class="producto-agregar">Agregar</button>
            </div>
        `;
        contenedorProductos.appendChild(div);
    });
}

// Función para cargar los productos iniciales (todos los productos)
async function cargarProductos() {
    await cargarTodosLosProductos();
}
