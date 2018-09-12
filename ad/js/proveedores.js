var nombresProveedores = [];
$(document).keyup(function (e) {
	if (e.keyCode == 27) {
		if ($('#mProve').hasClass('in')) { closeModal(); }
	}
});

$(document).ready(function (e) {
	console.log("Proveedores.");
	init();
});
function init(){
	loadTablaProveedores();
}
function openModal() {
	$('#mProve').modal('toggle');
}
function closeModal() {
	$('#mProve').modal().hide();
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	var delayInMilliseconds = 1000;
	setTimeout(function () {
		$modalStack.clearFocusListCache();
	}, delayInMilliseconds);
}
function cleanCampos(modal) {
	$("#provNombre").val("");
	$("#idprov").val("");
	$("#provTit").val("");
	$("#email").val("");
	$("#telefono").val("");
	$("#direccion").val("");

}
function refreshProv() {
	$('#tproveedores').DataTable().clear();
	nombresProveedores = [];
	proveedores();
}
function nuevoProveedor(){
	$("#provTit").val("Creacion de nuevo proveedor");
	openModal();
}
function editProveedor(ide){
	var ide = ide;
	$.ajax({
		type: "post", data: { "t": "tProve", "ideProve": ide },
		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				//"proveedores":[{"idproveedor":"2","nombproveedor":"Todo Cell","telefono":"123456","email":"mail@mail.com"}
				$("#provTit").html("Edición de proveedor "+ide);
				$("#idprov").val(ide);
				$("#provNombre").val(datos.proveedores[0].nombproveedor);
				$("#email").val(datos.proveedores[0].email);
				$("#telefono").val(datos.proveedores[0].telefono);
				$("#direccion").val(datos.proveedores[0].direccion);
			}
		}
	});
	openModal();
}
function deleteProveedor(ide){
	var id = ide;
	swal({
		title: "Esta segur@?",
		text: "Esta a punto de eliminar el proveedor",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn-danger",
		confirmButtonText: "Si, estoy seguro!",
		cancelButtonText: "No, no estoy seguro.",
		closeOnConfirm: false,
		closeOnCancel: false
	},
	function (isConfirm) {
		if (isConfirm) {
			$.ajax({
				type: "post", data: { "t": "dProve", "ideProve": id },
				url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						swal("Eliminado!", "El proveedor ha sido eliminado.", "success");
						var delayInMilliseconds = 1000;
						setTimeout(function () {
							refreshProv();
						}, delayInMilliseconds);
					} else {
						swal("Error", datos.txerr, "error");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		} else {
			swal("Cancelado", "El proveedor está a salvo :)", "info");
		}
	});

}
function loadTablaProveedores(){
	$('#tproveedores').DataTable();
	$.ajax({
		type: "post",
		data: { "t": "tProve" },
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var tpr = $('#tproveedores').DataTable();
				for (var x = 0; x < datos.cant; x++){
					nombresProveedores.push(datos.proveedores[x].nombproveedor);
					tpr.row.add(["#"+datos.proveedores[x].idproveedor, datos.proveedores[x].nombproveedor,datos.proveedores[x].email,datos.proveedores[x].telefono,datos.proveedores[x].direccion,"<a style='color:#000;' onclick='editProveedor(" + datos.proveedores[x].idproveedor + ")' href='#'><i class='fas fa-2x fa-pencil-alt' aria-hidden='true'></i></a>  <a style='color:#000;' onclick='deleteProveedor(" + datos.proveedores[x].idproveedor + ")' href='#'><i class='fas fa-2x fa-trash-alt' aria-hidden='true'></i></a>",]).draw(false);
				}
			} else { console.log("Error: " + datos.txerr); }
		},
	});
}
function guardarProveedor(){
	var nombre = $("#provNombre").val();
	var email = $("#email").val();
	var telefono = $("#telefono").val();
	var direccion = $("#direccion").val();
	var ide = 0;
	if($("#idprov").val()){
		ide = $("#idprov").val();
	}
	$.ajax({
		type: "post",
		data: { "t": "gProve", "idProv":ide, "nombre":nombre, "email":email,"telefono":telefono, "direccion": direccion},
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if(datos.err == 0){
				swal("Exito", "Se ha guardado sin problemas.", "success");
				closeModal();
				var delayInMilliseconds = 1000;
				setTimeout(function () {
					refreshProv();
				}, delayInMilliseconds);
			}else { console.log("Error: " + datos.txerr); }
		},
	});
}
