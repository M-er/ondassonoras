var lProds = [];
var lUsers = [];
var elegido = 0;
var total = 0.0;
var productosVenta = [{id: 0, user: 0, precio: "", cod: "", tit: "", cant: 0}];
var t = $('#tventas').DataTable({
	order: [[0, 'asc']],
	rowGroup: {
		endRender: function ( rows, group ) {
			var avg = rows
			.data()
			.pluck(5)
			.reduce( function (a, b) {
				return a + b.replace(/[^\d]/g, '')*1;
			}, 0);

			return 'Total Vendido: '+
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
		type: "post", data: { "t": "tVenta", "user": "1"},
		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				if(datos.cant){
					$(datos.ventas).each(function (i,k) {
						if(k){
							var fecha = formatDate(k.fechaventa);
							var observacion = "";
							var ubicacion = "";
							var cliente = "";
							if(k.ubicacion != 0){ubicacion = k.ubicacion;}else{ubicacion = "Sin ubicacion";}
							if(k.observacion != 0){observacion = k.observacion;}else{observacion = "Sin observacion";}
							if(k.cliente != 0){cliente = k.cliente;}else{cliente = "Sin cliente";}
							t.row.add(["#"+k.codigo,fecha, observacion, ubicacion, cliente, "$"+k.monto, "<a style='color:red;' onclick='devolver(" +k.idventa + ")' href='#'><i class='fas fa-2x fa-trash' aria-hidden='true'></i>"]).draw(false);}
						});
				}else{
					t.row.add([" "," No hay ventas cargadas "," "," "," "," "," "]).draw(false);
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
function openModal() {
	cleanModal();
	loadUsuarios();
	$('#mSales').modal('toggle');
}
function closeModal() {
	$('#mSales').modal().hide();
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	var delayInMilliseconds = 1000;
	setTimeout(function () {
		$modalStack.clearFocusListCache();
	}, delayInMilliseconds);
}
function cleanModal(){
	productosVenta = [];
	elegido = 0;
	precioelegido = 0;
	total = 0.0;
	$("#dprod").empty();
	$("#precio").val("");
	$("#usuario").val("");
	$("#total").val("0.0");
	$("#producto").val("");
	$("#cantidad").val("");
	$("#cantidad").val("");
	$("#observacion").val("");
	$("#ubicacion").val("");
	$('#precio').prop("disabled", true);
	$('#producto').prop("disabled", true);
	$('#cantidad').prop("disabled", true);
}
$("#usuario").change(function(){
	$("#producto").val("");
	$("#precio").val("");
	$('#precio').prop("disabled", true);
	$("#cantidad").val("");
	$('#cantidad').prop("disabled", true);
	productosVenta = [];
	elegido = 0;
	precioelegido = 0;
	total = 0.0;
	$("#dprod").empty();
	$("#total").val("0.0");

});
$("#precio").change(function(){
	if($('#precio').val() == ""){
		$("#cantidad").val("");
		$('#cantidad').prop("disabled", true);
	}else{
		$('#cantidad').prop("disabled", false);
		for (var i=0; i<productosVenta.length; i++) {
			if(productosVenta[i].id == elegido){
				$("#cant"+elegido).html("x "+parseInt(cantidad));
				productosVenta[i].cant = parseInt(cantidad);
				precioelegido = parseInt($('#precio').val());
				productosVenta[i].precio = precioelegido;
				var total = parseInt(cantidad*precioelegido);
				$("#subtot"+elegido).html(" = "+total);
			}
		}
		actualizoTotales();
	}
})
$("#producto").change(function(){
	if($('#producto').val() == ""){
		$("#cantidad").val("");
		$('#cantidad').prop("disabled", true);
		$("#precio").val("");
		$('#precio').prop("disabled", true);
	}else{
		$('#precio').prop("disabled", false);
	}
})
$("#cantidad").change(function(){
	var cantidad = parseInt($("#cantidad").val());
	for (var i=0; i<productosVenta.length; i++) {
		if(productosVenta[i].id == elegido){
			var rta = 0;
			rta = checkCant(elegido,cantidad);
			$("#cant"+elegido).html("x "+parseInt(cantidad));
			productosVenta[i].cant = parseInt(cantidad);
			$("#subtot"+elegido).html(" = "+parseInt(cantidad*precioelegido));
			if(rta != -1){
				reponer(elegido);
			}

		}
	}
	actualizoTotales();
})
function loadUsuarios() {
	var lUsers = [];
	$.getJSON("../ad/macros.php?t=tUser&menos=1", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lUsers[i] = {
				id: parseInt(data.usuarios[i].idusuario),
				label: data.usuarios[i].idusuario + " - " + data.usuarios[i].nombuser,
				value: data.usuarios[i].idusuario + " - " + data.usuarios[i].nombuser
			};
		}
		$("#usuario").autocomplete({
			source: lUsers,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mSales",
			select: function(a,b){
				$('#producto').prop("disabled", false);
				loadProductos(b.item.id);
			}
		});
	});
	return lUsers;
}
function loadProductos(usuario) {
	var lProds = [];
	var usuario = usuario;
	$.getJSON("../ad/macros.php?t=tProdsB", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lProds[i] = {
				id: data.producto[i].id,
				titulo: data.producto[i].data,
				codigo: data.producto[i].value,
				label: data.producto[i].value + "-" + data.producto[i].data,
				value: data.producto[i].value + "-" + data.producto[i].data
			};
		}
		$("#producto").autocomplete({
			source: lProds,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mSales",
			select: function(a,b){
				$('#precio').prop("disabled", false);
				var id = parseInt(b.item.id);
				var tit = b.item.titulo;
				var cod = b.item.codigo;
				var preciovta = 0;
				elegido = id;
				precioelegido = preciovta;
				$("#precio").val(0);
				loadPrecios(id, usuario,cod,tit);
			}
		});
	});
	return lProds;
}
function loadPrecios(prod, usuario, codigo, titulo) {
	var lPrec = [];
	var prod = prod;
	var codigo = codigo;
	var titulo = titulo;
	var usuario = usuario;
	$.getJSON("../ad/macros.php?t=tPrecB&prodID="+prod+"&userID="+usuario, function (data) {
		if(data.cant == 1){
			$("#precio").val(data.precios[0].precio);
			precioelegido = parseInt(data.precios[0].precio);
			$('#cantidad').prop("disabled", false);
			$("#cantidad").val(0);
			agregoProd(prod,precioelegido,codigo,titulo,usuario);
		}
		for (var i = 0; i < data.cant; i++) {
			lPrec[i] = {
				//id: data.precios[i].id,
				label: data.precios[i].id + "-" + data.precios[i].precio,
				value: data.precios[i].precio
			};
		}
		$("#precio").autocomplete({
			source: lPrec,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mSales",
			focus: function (event, ui) {
				$(this).val(ui.item.value);
			},
			select: function(a,b){
				precioelegido = parseInt(b.item.value);
				$('#cantidad').prop("disabled", false);
				$("#cantidad").val(0);
				agregoProd(prod,precioelegido,codigo,titulo,usuario);
			}
		});
	});
	return lPrec;
}

function actualizoTotales(){
	total = 0;
	for (var i=0; i<productosVenta.length; i++) {
		total += parseInt(productosVenta[i].cant*productosVenta[i].precio);
	}
	total = parseInt(total);
	$("#total").val(total);
}
function agregoProd(id,preciovta,cod,tit,usuario){
	var result = $.grep(productosVenta, function(e){ return e.id == id; });
	if(result.length == 0){
		productosVenta.push({
			id: id,
			precio: parseInt(preciovta),
			cod: cod,
			tit: tit,
			cant: 0,
			user: usuario
		});
		var bbadge = document.createElement("button");
		bbadge.className="btn btn-primary";
		bbadge.setAttribute('type', "button");
		bbadge.setAttribute('id', "idprod"+id);
		bbadge.innerHTML = cod + " - " + tit +" ";
		var badge = document.createElement("span");
		badge.className="badge badge-light";
		badge.innerHTML = " x ";
		badge.setAttribute('onclick', 'return(quitarProd('+id+'))');
		var cant = document.createElement("span");
		cant.innerHTML = "x0";
		cant.setAttribute('id', 'cant'+id);
		var subtot = document.createElement("span");
		subtot.innerHTML = " - 0";
		subtot.setAttribute('id', 'subtot'+id);
		bbadge.append(cant);
		bbadge.append(subtot);
		bbadge.append(badge);
		$("#dprod").append(bbadge);
	}
}
function quitarProd(id){
	$("#producto").val("");
	var ide = id;
	for (var i=0; i<productosVenta.length; i++) {
		if(productosVenta[i].id == ide){
			productosVenta.splice(i,1);
			elegido = 0;
			precioelegido = 0;
			$("#producto").val("");
			$("#cantidad").val("");
			$("#precio").val("");
			$('#cantidad').prop("disabled", true);
			$('#producto').prop("disabled", true);
			$('#precio').prop("disabled", true);
			$("#idprod"+ide).remove();
			actualizoTotales();
		}
	}
}
function checkCant(elegido,cant){
	var rta = 0;
	$.ajax({
		type: "post",
		data: {
			"t": "checkCant",
			"prod": elegido
		},
		url: "../ad/macros.php", dataType: 'json', cache: false,async:false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var resul = 0;
				resul = parseInt(datos.cant) - cant;
				if(resul>=0){
					if(resul > parseInt(datos.minstock)){
						rta = -1;
					}else{
						rta = cant;
					}
				}else{
					rta = 0;
				}
			}else{
				swal("Error", datos.txerr, "Error");
			}
		}
	})
	return rta;
}
function reponer(ideprod){
	swal("Sin stock", "No tiene stock de ese producto, puede vender igual", "info");
}
function vender(){
	var cliente = $("#usuario").val().split("-")[1];
	var observacion = ($("#observacion").val()=="")?"Sin observacion":($("#observacion").val());
	var ubicacion = ($("#ubicacion").val()=="")?"Sin ubicacion":($("#ubicacion").val());
	$.ajax({
		type: "post",
		data: {
			"t": "gVentaOS",
			"cliente": cliente,
			"observacion": observacion,
			"ubicacion": ubicacion,
			"productos": productosVenta,
		},
		url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				closeModal();
				ventas();
				swal({
					title: 'Listo!!!',
					html:
					'Se ha creado la venta </pre>',
					confirmButtonText: 'Perfecto!'
				})

			}else{
				swal("Error", datos.txerr,"error");
			}
		}
	});
}
function devolver(ide){
	var ide = ide;
	swal({
			title: "Esta segur@?",
			text: "Está a punto de realizar una devolución.",
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
					type: "post", data: { "t": "dVenta", "idventa": ide },
					url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
						if (datos.err == 0) {
							swal("Eliminada!", "Se ha eliminado la venta", "success");
							var delayInMilliseconds = 1000;
							setTimeout(function () {
								refresh();
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
				swal("Cancelado", "La venta está a salvo :)", "info");
			}
		});
}