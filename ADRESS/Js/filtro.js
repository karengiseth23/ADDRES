
function filtrarTabla(idCampoFiltro, columna) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(idCampoFiltro);
    filter = input.value.toUpperCase();
    table = document.getElementById("tablaAdquisiciones");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[columna];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

var filasPrimeraColumna = document.querySelectorAll('.div-servicios td:first-child');
filasPrimeraColumna.forEach(function (fila) {
    var contenido = fila.textContent;
    var primerosCuatroDigitos = contenido.substring(0, 4);
    fila.textContent = primerosCuatroDigitos;
});