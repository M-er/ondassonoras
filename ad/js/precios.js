$(document).keyup(function (e) {
	if (e.keyCode == 27) { 
		if ($('#mPrecio').hasClass('in')) { closeModal(); } 
	}
});

$(document).ready(function (e) {
	console.log("Precios.");
	init();
});
function init(){
	loadTablaPrecios();
	loadProds();
}
function openModal() {
	$('#mPrecio').modal('toggle');
}
function closeModal() {
	$('#mPrecio').modal().hide();
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	var delayInMilliseconds = 1000;
	setTimeout(function () {
		$modalStack.clearFocusListCache();
	}, delayInMilliseconds);
}
function cleanCampos(modal) {
	$("#precNombre").val("");
	$("#idprec").val("");
	$("#precTit").val("");

}
function refreshPrec() {
	$('#tprecios').DataTable().clear();
	precios();
}
function nuevoPrecio(){
	$("#precTit").val("Creacion de nuevo precio");
	openModal();
}
function deletePrecio(ide){
	var id = ide;
	swal({
		title: "Esta segur@?",
		text: "Esta a punto de eliminar el precio",
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
				type: "post", data: { "t": "dPrecio", "idprec": id },
				url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						swal("Eliminado!", "El precio ha sido eliminado.", "success");
						var delayInMilliseconds = 1000;
						setTimeout(function () {
							refreshPrec();
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
			swal("Cancelado", "El precio está a salvo :)", "info");
		}
	});

}
function loadTablaPrecios(){
	$('#tprecios').DataTable();
	$.ajax({
		type: "post",
		data: { "t": "tPrecio" },
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var tpr = $('#tprecios').DataTable();
				for (var x = 0; x < datos.cant; x++){
					tpr.row.add([datos.precios[x].producto_idproducto+"-"+datos.precios[x].nombprod,"$"+datos.precios[x].precio1, "$"+datos.precios[x].precio2, "$"+datos.precios[x].precio3, "$"+datos.precios[x].precio4,"<a style='color:#000;' onclick='editarPrecio(" + datos.precios[x].idprecio + ")' href='#'><i class='fas fa-2x fa-pencil-alt' aria-hidden='true'></i></a>  <a style='color:#000;' onclick='deletePrecio(" + datos.precios[x].idprecio + ")' href='#'><i class='fas fa-2x fa-trash-alt' aria-hidden='true'></i></a>",]).draw(false); 			
					
				} 
			} else { console.log("Error: " + datos.txerr); }
		},
	});
}
function guardarPrecio(){
	var prod = $("#nombprod").val().split("-")[0];
	var precio1 = $("#precio1").val();
	var precio2 = $("#precio2").val();
	var precio3 = $("#precio3").val();
	var precio4 = $("#precio4").val();
	var ide = 0;
	if($("#idprec").val()){
		ide = $("#idprec").val();
	}
	$.ajax({
		type: "post",
		data: { "t": "gPrecio", 
		"idprec":ide, 
		"precio1":precio1,
		"precio2":precio2,
		"precio3":precio3,
		"precio4":precio4,
		"prod":prod
	},
	url: "./macros.php",
	dataType: 'json',
	cache: false,
	success: function (datos, textStatus, jqXHR) {
		if(datos.err == 0){
			swal("Exito", "Se ha guardado sin problemas.", "success");
			closeModal();
			var delayInMilliseconds = 1000;
			setTimeout(function () {
				refreshPrec();
			}, delayInMilliseconds);
		}else { console.log("Error: " + datos.txerr); }
	},
});
}
function loadProds() {
	var lProds = [];
	$.getJSON("macros.php?t=tProds", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lProds[i] = {
				id: data.producto[i].value,
				label: data.producto[i].value + "-" + data.producto[i].data,
				value: data.producto[i].value + "-" + data.producto[i].data
			};
		}
		$("#nombprod").autocomplete({
			source: lProds,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mPrecio",
		});
	});
	return lProds;
}
function openModal() {
	$('#mPrecio').modal('toggle'); 
}

function editarPrecio(id){
	var ide = id;
	$.ajax({
		type: "post",
		data: { "t": "tPrecio", "idprecio":ide },
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if(datos.err == 0){
				$("#idprec").val(datos.precios[0].idprecio);
				$("#precio1").val(datos.precios[0].precio1);
				$("#precio2").val(datos.precios[0].precio2);
				$("#precio3").val(datos.precios[0].precio3);
				$("#precio4").val(datos.precios[0].precio4);
				$("#nombprod").val(datos.precios[0].producto_idproducto +"-"+datos.precios[0].nombprod);
				openModal();

			}else { console.log("Error: " + datos.txerr); }
		},
	});

}