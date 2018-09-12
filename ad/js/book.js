$(document).ready(function (e) {
	console.log("Libro.");
	init();
});
function init(){
	loadTabla();
}
function refreshBook() {
	$('#tbook').DataTable().clear();
	libro();
}
function loadTabla(){
	$('#tbook').DataTable();
	$.ajax({
		type: "post",
		data: { "t": "tbook" },
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var tBook = $('#tbook').DataTable();
				if(datos.cant){
					for (var x = 0; x < datos.cant; x++){
						tBook.row.add(["#"+datos.libro[x].idlibro,datos.libro[x].timestamp,"#"+datos.libro[x].usuario_idusuario+" - "+datos.libro[x].nombuser,"#"+datos.libro[x].producto_idproducto+" - "+datos.libro[x].nombprod,datos.libro[x].cantidad,"#"+datos.libro[x].proveedor_idproveedor+" - "+datos.libro[x].nombproveedor,]).draw(false); 			
					} 
				}else{
					tBook.row.add([" "," "," "," "," No hay nada en el libro  "," "," "," "," "]).draw(false);
					console.log("No se han encontrado reportes");

				}
			} else { console.log("Error: " + datos.txerr); }
		},
	});
}