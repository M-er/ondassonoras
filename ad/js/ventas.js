var t = $('#tventas').DataTable({
	order: [[0, 'asc']],
	rowGroup: {
		endRender: function ( rows, group ) {
			var avg = rows
			.data()
			.pluck(3)
			.reduce( function (a, b) {
				return a + b.replace(/[^\d]/g, '')*1;
			}, 0) / rows.count();

			return 'Vendido en '+group+': '+
			$.fn.dataTable.render.number(',', '.', 0, '$').display( avg );
		},
		dataSrc: 0
	}
});

$(document).ready(function (e) {
	console.log("Ventas.");
	init();
});

function init(){
	loadVentas();
}
function loadVentas(){
	$('#tventas').DataTable();
	$.ajax({
		type: "post", data: { "t": "tVenta"},
		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				if(datos.cant){
					$(datos.ventas).each(function (i,k) {
						if(k){
							var fecha = formatDate(k.fechaventa);
							t.row.add(["#"+k.codigo,k.producto_idproducto+"-"+k.nombprod,"#"+k.cant,k.monto,k.usuario_idusuario+"-"+k.nombuser,k.zona,fecha]).draw(false);}
						});

				}else{
					t.row.add([" "," "," ","No hay ventas cargadas "," "," "," "]).draw(false);
					console.log("No se han encontrado ventas");
				}
			}else {console.log("Error: " + datos.txerr);}
		}
	});
}
function refresh(){
	$('#tventas').DataTable().clear();
	ventas();
}
function formatDate(fecha){
	dia = fecha.split("-")[2];
	mes = fecha.split("-")[1];
	anio = fecha.split("-")[0];
	return (dia+"/"+mes+"/"+anio);
}
