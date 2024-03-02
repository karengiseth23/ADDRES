let listaServicios = [];
let objServicio = {
    id: '',
    presupuesto: '',
    unidad: '',
    tipo: '',
    cantidad: '',
    valor_unitario: '',
    valor_total: '',
    fecha_adquisicion: '',
    proveedor: '',
    documentacion: '',
    historial: [],
};
var id_delete = "";
var id_create = "";
async function consultar() {
    const response = await fetch("http://127.0.0.1:8000/presupuestos/?limit=1000&page=1");
    const registros = await response.json();
    listaServicios = registros.results;
    mostrarServicios();
  }
  
consultar();

async function detalle(id) {
    const response = await fetch("http://127.0.0.1:8000/presupuestos/"+id);
    const registros = await response.json();
    listaServicios = registros.results;
    mostrarServicios();
  }

let editando = false;

const formulario = document.querySelector('#formulario');
const presupuestoInput = document.querySelector('#presupuesto');
const unidadInput = document.querySelector('#unidad');
const tipoInput = document.querySelector('#tipo');
const cantidadInput = document.querySelector('#cantidad');
const valorUnitarioInput = document.querySelector('#valorUnitario');
const valorTotalInput = document.querySelector('#valorTotal');
const fechaAdquisicionInput = document.querySelector('#fechaAdquisicion');
const proveedorInput = document.querySelector('#proveedor');
const documentacionInput = document.querySelector('#documentacion');

const btnAgregarInput = document.querySelector('#btnAgregar');
const btnActualizarInput = document.querySelector('#btnActualizar');

formulario.addEventListener('submit', validarFormulario);

function validarFormulario(e) {
    e.preventDefault();

    if (presupuestoInput.value === '' ||
        unidadInput.value === '' ||
        tipoInput.value === '' ||
        cantidadInput.value === '' ||
        valorUnitarioInput.value === '' ||
        valorTotalInput.value === '' ||
        fechaAdquisicionInput.value === '' ||
        proveedorInput.value === '' ||
        documentacionInput.value === ''
    ) {
        alert('Todos los campos se deben llenar');
        return;
    }

    if (editando) {
        editarServicio();
        editando = false;
    } else {
        objServicio.presupuesto = presupuestoInput.value;
        objServicio.unidad = unidadInput.value;
        objServicio.tipo = tipoInput.value;
        objServicio.cantidad = cantidadInput.value;
        objServicio.valor_unitario = valorUnitarioInput.value;
        objServicio.valor_total = valorTotalInput.value;
        objServicio.fecha_adquisicion = fechaAdquisicionInput.value;        

        objServicio.proveedor = proveedorInput.value;
        objServicio.documentacion = documentacionInput.value;

        fetch("http://127.0.0.1:8000/presupuestos/"+objServicio.id, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({...objServicio}),
            })
    .then(async res => agregarServicio(await res.json()))
    .then(data => console.log(data))
    .catch(error => console.error('Error patching data:', error));    }
}

function agregarServicio(res) {
    console.log(res.id)
    id_create = res.id
    formulario.reset();
    var mensajeParrafo = document.createElement('p');
    mensajeParrafo.textContent = 'Registro exitoso, para consultar, editar o eliminar conserve el ID: ' + id_create;
    var contenedorMensaje = document.getElementById('mensajeConfirmacion');
    contenedorMensaje.appendChild(mensajeParrafo);
     
}

function limpiarObjeto() {
    objServicio.id = '',
        objServicio.presupuesto = '';
    objServicio.unidad = '';
    objServicio.tipo = '';
    objServicio.cantidad = '';
    objServicio.valor_unitario = '';
    objServicio.valor_total = '';
    objServicio.fecha_adquisicion = '';
    objServicio.proveedor = '';
    objServicio.documentacion = '';
}


function mostrarServicios() {
    limpiarHTML();

    const tbody = document.querySelector('.div-servicios');

    listaServicios.forEach(servicio => {
        const {
            id,
            presupuesto,
            unidad,
            tipo,
            cantidad,
            valor_unitario,
            valor_total,
            fecha_adquisicion,
            proveedor,
            documentacion,
            historial
        } = servicio;

        const fila = document.createElement('tr');

        // Crear celdas para cada valor
        const celdaId = crearCelda(id);
        const celdaPresupuesto = crearCelda(presupuesto);
        const celdaUnidad = crearCelda(unidad);
        const celdaTipo = crearCelda(tipo);
        const celdaCantidad = crearCelda(cantidad);
        const celdaValorUnitario = crearCelda(valor_unitario);
        const celdaValorTotal = crearCelda(valor_total);
        const celdaFechaAdquisicion = crearCelda(fecha_adquisicion);
        const celdaProveedor = crearCelda(proveedor);
        const celdaDocumentacion = crearCelda(documentacion);

        const celdaAcciones = document.createElement('td');
        const editarBoton = document.createElement('button');
        editarBoton.onclick = () => cargarServicio(servicio);
        editarBoton.textContent = '';
        editarBoton.classList.add('btn', 'btn-editar');
        celdaAcciones.append(editarBoton);

        const eliminarBoton = document.createElement('button');
        eliminarBoton.onclick = () => abrirModal(id);
        eliminarBoton.textContent = '';
        eliminarBoton.classList.add('btn', 'btn-eliminar');
        celdaAcciones.append(eliminarBoton);

        fila.appendChild(celdaId);
        fila.appendChild(celdaPresupuesto);
        fila.appendChild(celdaUnidad);
        fila.appendChild(celdaTipo);
        fila.appendChild(celdaCantidad);
        fila.appendChild(celdaValorUnitario);
        fila.appendChild(celdaValorTotal);
        fila.appendChild(celdaFechaAdquisicion);
        fila.appendChild(celdaProveedor);
        fila.appendChild(celdaDocumentacion);
        fila.appendChild(celdaAcciones);

        tbody.appendChild(fila);
    });
}

function crearCelda(valor) {
    const celda = document.createElement('td');
    celda.textContent = valor;
    return celda;
}


// Función para formatear la fecha a AAAA-MM-DD
function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    const año = fechaObj.getFullYear();
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

function cargarServicio(servicio) {
    abrirEditar(); 
    const {
        id,
        presupuesto,
        unidad,
        tipo,
        cantidad,
        valor_unitario,
        valor_total,
        fecha_adquisicion,
        proveedor,
        documentacion,
        historial
    } = servicio;
    presupuestoInput.value = presupuesto;
    unidadInput.value = unidad;
    tipoInput.value = tipo;
    cantidadInput.value = cantidad;
    valorUnitarioInput.value = valor_unitario;
    valorTotalInput.value = valor_total;
// Formatear la fecha antes de asignarla al input
    fechaAdquisicionInput.value = formatearFecha(fecha_adquisicion);    
    proveedorInput.value = proveedor;
    documentacionInput.value = documentacion;

    var arrayDeObjetos = historial;

    var tablaBody = document.getElementById('tBody');
    tablaBody.innerHTML = ""
    // Iterar sobre el array y agregar filas a la tabla
    for (var i = 0; i < arrayDeObjetos.length; i++) {
      var objeto = arrayDeObjetos[i];
      var fila = tablaBody.insertRow(i);
        const celdaPresupuesto = fila.insertCell(0);
        const celdaUnidad = fila.insertCell(1)
        const celdaTipo = fila.insertCell(2)
        const celdaCantidad = fila.insertCell(3)
        const celdaValorUnitario = fila.insertCell(4)
        const celdaValorTotal = fila.insertCell(5)
        const celdaFechaAdquisicion = fila.insertCell(6)
        const celdaProveedor = fila.insertCell(7)
        const celdaDocumentacion = fila.insertCell(8)
      celdaPresupuesto.textContent = objeto.presupuesto;
      celdaUnidad.textContent = objeto.unidad;
      celdaTipo.textContent= objeto.tipo;
      celdaCantidad.textContent = objeto.cantidad;
      celdaValorUnitario.textContent = objeto.valor_unitario;
      celdaValorTotal.textContent = objeto.valor_total;
      celdaFechaAdquisicion.textContent = objeto.fecha_adquisicion;
      celdaProveedor.textContent = objeto.proveedor;
      celdaDocumentacion.textContent = objeto.documentacion;
    }

    
    objServicio.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Actualizar';
    editando = true;
   
}


function editarServicio() {
    objServicio.presupuesto = presupuestoInput.value;
    objServicio.unidad = unidadInput.value;
    objServicio.tipo = tipoInput.value;
    objServicio.cantidad = cantidadInput.value;
    objServicio.valor_unitario = valorUnitarioInput.value;
    objServicio.valor_total = valorTotalInput.value;
    objServicio.fecha_adquisicion = fechaAdquisicionInput.value;
    objServicio.proveedor = proveedorInput.value;
    objServicio.documentacion = documentacionInput.value;
    objServicio.historial = [];
    fetch("http://127.0.0.1:8000/presupuestos/"+objServicio.id, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({...objServicio}),
        })
.then(res => closeEdit())
.catch(error => console.error('Error patching data:', error));

    
}

function closeEdit(){
    limpiarHTML();
    consultar();
    formulario.reset();
    editando = false;
    cerrarModal();
}

const modal = document.getElementById('confirmar');
const editar = document.getElementById('editar');

function abrirEditar() {
    editar.style.display = 'block';
  }

function abrirModal(id) {
  modal.style.display = 'block';
  id_delete = id
}

function cerrarModal() {
  modal.style.display = 'none';
  editar.style.display ='none';
}

function confirmarEliminacion() {
  eliminarServicio(id_delete);
  cerrarModal();
}


function eliminarServicio(id) {
 
    fetch("http://127.0.0.1:8000/presupuestos/"+id, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({...objServicio}),
        })
.then(data => consultar())
.catch(error => console.error('Error patching data:', error));

    limpiarHTML();
    mostrarServicios();
}

function limpiarHTML() {
    const tbody = document.querySelector('.div-servicios');
    tbody.innerHTML = '';  // Limpiar el contenido actual del tbody    
}


var btnAgregar = document.getElementById('btnAgregar');

if (btnAgregar) {
    btnAgregar.addEventListener('click', function() {
       
    });
}