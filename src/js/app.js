let pagina = 1;

const cita = {
	nombre: '',
	fecha: '',
	hora: '',
	servicios: [],
};

document.addEventListener('DOMContentLoaded', function () {
	iniciarApp();
});

function iniciarApp() {
	mostrarServicios();

	// Resalta el Div actual segun el tab al que se prsiona
	mostrarSeccion();

	// Oculta o muiestra una seccion segun el tab al que se presiona
	cambiarSeccion();
	// Paginacion siguiente y anterior
	paginaSiguiente();

	paginaAnterior();

	// Comprueba la pagina actual para ocultar o mostrar la paginacion

	botonesPaginador();

	// Muestra el resumen de la cita (o mensaje de error en caso de no pasar la validacion)
	mostrarResumen();
}

function mostrarSeccion() {
	// Eliminar mostrar-seccion de la seccion anterior

	const seccionAnterior = document.querySelector('.mostrar-seccion');

	if (seccionAnterior) {
		seccionAnterior.classList.remove('mostrar-seccion');
	}

	const seccionActual = document.querySelector(`#paso-${pagina}`);
	seccionActual.classList.add('mostrar-seccion');

	// Eliminar la clase de actual en el tab anterior
	const tabAnterior = document.querySelector('.tabs .actual');
	if (tabAnterior) {
		tabAnterior.classList.remove('actual');
	}

	// Resalta el tab Actual
	const tab = document.querySelector(`[data-paso="${pagina}"]`);
	tab.classList.add('actual');
}

function cambiarSeccion() {
	const enlaces = document.querySelectorAll('.tabs button');

	/* Un EventListener tiene que ser agregado sobre un elemento, no puede ser agregado sobre una coleccion de elementos
    por eso usamos el forEach*/
	enlaces.forEach((enlace) => {
		enlace.addEventListener('click', (e) => {
			e.preventDefault();
			pagina = parseInt(e.target.dataset.paso);

			// Llamar la funcion de mostrar seccion
			mostrarSeccion();
			botonesPaginador();
		});
	});
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

			// Generar precioServicio
			const precioServicio = document.createElement('P');
			precioServicio.textContent = `$ ${precio}`;
			precioServicio.classList.add('precio-servicio');

			// Generar div contenedor de servicio
			const servicioDiv = document.createElement('DIV');
			servicioDiv.classList.add('servicio');
			servicioDiv.dataset.idServicio = id;

			// Selecciona un servicio para la cita
			servicioDiv.onclick = seleccionarServicio;

			// Inyectar precio y nombre al div de servicio
			servicioDiv.appendChild(nombreServicio);
			servicioDiv.appendChild(precioServicio);

			//Inyectarlo en el HTML
			document.querySelector('#servicios').appendChild(servicioDiv);
		});
	} catch (error) {
		console.log(error);
	}
}

function seleccionarServicio(e) {
	// Forzar que el elemento al cual le damos click sea el DIV
	let elemento;
	if (e.target.tagName === 'P') {
		elemento = e.target.parentElement;
	} else {
		elemento = e.target;
	}

	// El siguiente if selecciona o des-selecciona el lemento de acuerdo a los click
	if (elemento.classList.contains('seleccionado')) {
		elemento.classList.remove('seleccionado');
	} else {
		elemento.classList.add('seleccionado');
	}
}

function paginaSiguiente() {
	const paginaSiguiente = document.querySelector('#siguiente');
	paginaSiguiente.addEventListener('click', () => {
		pagina++;
		botonesPaginador();
	});
}
function paginaAnterior() {
	const paginaAnterior = document.querySelector('#anterior');
	paginaAnterior.addEventListener('click', () => {
		pagina--;
		botonesPaginador();
	});
}

function botonesPaginador() {
	const paginaSiguiente = document.querySelector('#siguiente');
	const paginaAnterior = document.querySelector('#anterior');

	if (pagina === 1) {
		paginaAnterior.classList.add('ocultar');
	} else if (pagina === 3) {
		paginaSiguiente.classList.add('ocultar');
		paginaAnterior.classList.remove('ocultar');
	} else {
		paginaAnterior.classList.remove('ocultar');
		paginaSiguiente.classList.remove('ocultar');
	}

	mostrarSeccion(); // Cambia la seccion que se muestra por la de la pagina
}

function mostrarResumen() {}
