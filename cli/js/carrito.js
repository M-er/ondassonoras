var t = $('#tcarrito').DataTable({
	order: [[0, 'asc']],
	rowGroup: {
		endRender: function ( rows, group ) {
			var avg = rows
			.data()
			.pluck(5)
			.reduce( function (a, b) {
				return a + b.replace(/[^\d]/g, '')*1;
			}, 0);

			return 'Total carrito: '+group+': '+
			$.fn.dataTable.render.number(',', '.', 0, '$').display( avg );
		},
		dataSrc: 0
	}
});
$(document).ready(function (e) {
	console.log("Carrito.");
	init();
});

function init(){
	$("#bdelCarrito").hide();
	loadCarrito();
}
function loadCarrito(){
	$('#tstore').DataTable();
	$.ajax({
		type: "post", data: { "t": "tCarrito"},
		url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				if(datos.cant>0){
					$("#bdelCarrito").show();
				}
				$(datos.productos).each(function (i,k) {
					if(k){
						var codigo = parseInt(k.codigo);
						t.row.add(["#"+k.codigo,"#"+k.producto_idproducto,k.minstock,k.cant,"$"+ k.preciounitario,"$"+ k.subtotal,k.nombproveedor,"<a style='color:red;' onclick='eliminarProd(" + k.idcar + ")' href='#'><i class='far fa-2x fa-times-circle'></i></a>",]).draw(false);
					}
				});
			}
			else {
				console.log("Error: " + datos.txerr);
			}
		}
	});
}
function refreshCarr(){
	$('#tcarrito').DataTable().clear();
	cart();
}
function eliminarCarritos(){
	swal({
		title: "Esta seguro?",
		text: "Esta a punto de eliminar todos los carritos.",
		type: "warning",
		showCancelButton: true,
		confirmButtonText: "Si, estoy seguro!",
		cancelButtonText: "No, no estoy seguro.",
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
			$.ajax({
				type: "post", data: { "t": "dCarrito" },
				url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						swal("Eliminada!", "El carrito ha sido eliminado .", "success");
						cart();
					} else {
						swal("Error", datos.txerr, "error");
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});	
		}
	});
}
function cerrarCarrito(){
	swal({
		title: "Esta seguro?",
		text: "Esta a punto de cerrar el carrito y enviarlo.",
		type: "warning",
		showCancelButton: true,
		confirmButtonText: "Si, estoy seguro!",
		cancelButtonText: "No, no estoy seguro.",
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
			$.ajax({
				type: "post", data: { "t": "enviarCarrito"},
				url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						swal("OK!", "El carrito ha sido enviado.", "success");
						cart();
					} else {
						swal("Error", datos.txerr, "error");
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		} else if (
			result.dismiss === swal.DismissReason.cancel
			) {
			swal("Cancelado", "Has cancelado la confirmación de carrito", "info");

		}
	});
}
function eliminarProd(ide){
	var id = ide;
	swal({
		title: "Esta seguro?",
		text: "Esta a punto de eliminar el carrito.",
		type: "warning",
		showCancelButton: true,
		confirmButtonText: "Si, estoy seguro!",
		cancelButtonText: "No, no estoy seguro.",
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
			$.ajax({
				type: "post", data: { "t": "dCarrito", "idcarr": id },
				url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						swal("Eliminada!", "La compra del producto ha sido eliminada.", "success");
						cart();
					} else {
						swal("Error", datos.txerr, "error");
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		} else if (
			result.dismiss === swal.DismissReason.cancel
			) {
			swal("Cancelado", "El carrito no ha sido eliminado", "info");

		}
	});
}
