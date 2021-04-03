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

	// Almacena el nombre de la cita en el objeto
	nombreCita();

	// Almacena la fechja de la cita en el objeto
	fechaCita();

	// Desabilita dias pasados
	deshabilitarFechaAnterior();

	// Almacena la hora de la cita en el objeto
	horaCita();
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

		const id = parseInt(elemento.dataset.idServicio);

		eliminarServicio(id);
	} else {
		elemento.classList.add('seleccionado');

		//	console.log(elemento.dataset.idServicio);

		const servicioObj = {
			id: parseInt(elemento.dataset.idServicio),
			nombre: elemento.firstElementChild.textContent,
			precio: elemento.firstElementChild.nextElementSibling.textContent,
		};

		// 	console.log(servicioObj);
		agregarServicio(servicioObj);
	}
}

function eliminarServicio(id) {
	const { servicios } = cita;
	cita.servicios = servicios.filter((servicio) => servicio.id !== id);
	console.log(cita);
	//console.log('Eliminando....', id);
}

function agregarServicio(servicioObj) {
	const { servicios } = cita; // Destructuring

	cita.servicios = [...servicios, servicioObj];

	//console.log(cita);
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

		mostrarResumen(); //Estamos en la pagina 3, carga el resumen de la cita.
	} else {
		paginaAnterior.classList.remove('ocultar');
		paginaSiguiente.classList.remove('ocultar');
	}

	mostrarSeccion(); // Cambia la seccion que se muestra por la de la pagina
}

function mostrarResumen() {
	// Destructuring
	const { nombre, fecha, hora, servicios } = cita;

	// Seleccionar resumen
	const resumenDiv = document.querySelector('.contenido-resumen');

	// Limpia el HTML previo  -- el de resumen
	while (resumenDiv.firstChild) {
		resumenDiv.removeChild(resumenDiv.firstChild);
	}

	// Validacion de objeto
	if (Object.values(cita).includes('')) {
		const noServicios = document.createElement('P');
		noServicios.textContent =
			'Faltan datos de Servicios, hora, fecha o nombre';

		noServicios.classList.add('invalidar-cita');

		// Agregar resumenDiv
		resumenDiv.appendChild(noServicios);

		return;
	}

	// Mostrar el resumen
	const nombreCita = document.createElement('P');
	nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

	const fechaCita = document.createElement('P');
	fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

	const horaCita = document.createElement('P');
	horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

	resumenDiv.appendChild(nombreCita);
	resumenDiv.appendChild(fechaCita);
	resumenDiv.appendChild(horaCita);
	//console.log(Object.values(cita));

	// Iterar sobre el arreglo de servicios
	servicios.forEach((servicio) => {
		const { nombre, precio } = servicio; // Destructuring
		const contenedorServicio = document.createElement('DIV');
		contenedorServicio.classList.add('contenedor-servicio');

		const textoServicio = document.createElement('P');
		textoServicio.textContent = nombre;

		const precioServicio = document.createElement('P');
		precioServicio.textContent = precio;

		// Colocar texto y precio en el DIV
		contenedorServicio.appendChild(textoServicio);
		contenedorServicio.appendChild(precioServicio);
	});
}

function nombreCita() {
	const nombreInput = document.querySelector('#nombre');

	nombreInput.addEventListener('input', (e) => {
		//	console.log(e.target.value);
		const nombreTexto = e.target.value.trim();

		// Validacion de que nombreTexto no puede estar vacio

		if (nombreTexto === '' || nombreTexto.length < 3) {
			mostrarAlerta('Nombre no valido', 'error');
		} else {
			const alerta = document.querySelector('.alerta');
			if (alerta) {
				alerta.remove();
			}
			cita.nombre = nombreTexto;

			// console.log(cita);
		}
	});
}

function mostrarAlerta(mensaje, tipo) {
	// Si hay una alerta prevui, entonces no agregar otra

	const alertaPrevia = document.querySelector('.alerta');

	if (alertaPrevia) {
		return;
	}

	const alerta = document.createElement('DIV');
	alerta.textContent = mensaje;
	alerta.classList.add('alerta');

	if (tipo === 'error') {
		alerta.classList.add('error');
	}
	console.log(alerta);

	// Insertar en el HTML
	const formulario = document.querySelector('.formulario');
	formulario.appendChild(alerta);

	// Eliminar la alerta despues de 3 segundos
	setTimeout(() => {
		alerta.remove();
	}, 3000);
}

function fechaCita() {
	const fechaInput = document.querySelector('#fecha');
	fechaInput.addEventListener('input', (e) => {
		// console.log(e.target.value);
		const dia = new Date(e.target.value).getUTCDay();

		if ([0, 6].includes(dia)) {
			e.preventDefault; //Evita que se agrege la fecha cuando se escoge un fin de semana, lo cual no se trabaja
			fechaInput.value = '';
			mostrarAlerta('Fines de semana no trabajamos', 'error');
			//	console.log('Seleccionaste sabado o domingo lo cual no es valido');
		} else {
			cita.fecha = fechaInput.value;
			//console.log('Dia valido');
		}
	});
}

function deshabilitarFechaAnterior() {
	//const inputFecha = document.querySelector('#fecha');
	const inputFecha = document.getElementById('fecha');

	var today = new Date(); // te da la fecha actual
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0');
	var yyyy = today.getFullYear();

	today = `${yyyy}-${mm}-${dd}`;

	inputFecha.min = today;

	console.log(inputFecha);

	// Formato deseado: AAAA-MM-DD
}

function horaCita() {
	const inputHora = document.querySelector('#hora');
	inputHora.addEventListener('input', (e) => {
		const horaCita = e.target.value;
		const hora = horaCita.split(':');

		if (hora[0] < 10 || hora[0] > 20) {
			mostrarAlerta('Hora no valida', 'error');
			setTimeout(() => {
				inputHora.value = '';
			}, 2000);
		} else {
			cita.hora = horaCita;

			console.log(cita);
		}
	});
}
