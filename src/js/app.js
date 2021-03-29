document.addEventListener('DOMContentLoaded', function () {
	iniciarApp();
});

function iniciarApp() {
	mostrarServicios();
}

async function mostrarServicios() {
	try {
		const resultado = await fetch('./servicios.json');
		const db = await resultado.json();

		const servicios = db.servicios; // Usando destructuring seria ----------- const { servicios } = db;---------entonces no haria falta el console.log
		console.log(servicios);

		// Generar el HTML
		servicios.forEach((servicio) => {
			const { id, nombre, precio } = servicio; //Destructuring

			// DOM Scripting

			// Generar nombre-servicio
			const nombreServicio = document.createElement('P');
			nombreServicio.textContent = nombre;
			nombreServicio.classList.add('nombre-servicio');
			console.log(nombreServicio);

			// Generar precioServicio
			const precioServicio = document.createElement('P');
			precioServicio.textContent = `$ ${precio}`;
			precioServicio.classList.add('precio-servicio');
			console.log(precioServicio);
		});
	} catch (error) {
		console.log(error);
	}
}
