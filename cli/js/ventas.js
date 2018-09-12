var lEstados = [];
var elegido = 0;
var total = 0.0;
var t = $('#tsales').DataTable({
	order: [ 1, 'asc' ],
	rowGroup: {
		endRender: function ( rows, group ) {
			var avg = rows
			.data()
			.pluck(5)
			.reduce( function (a, b) {
				return a + b.replace(/[^\d]/g, '')*1;
			}, 0);

			return 'Vendido en '+group+': '+
			$.fn.dataTable.render.number(',', '.', 0, '$').display( avg );
		},
		dataSrc: 0
	}
});

var productosVenta = [{id: 0, precio: "", cod: "", tit: "", cant: 0}];
$(document).ready(function (e) {
	console.log("Ventas.");
	init();
});

$("#producto").change(function(){
	if($('#producto').val() == ""){
		$("#precio").val("");
		$("#cantidad").val("");
		$('#precio').prop("disabled", true);
		$('#cantidad').prop("disabled", true);
	}else{
		$('#precio').prop("disabled", false);
		$('#cantidad').prop("disabled", false);
	}
})
$("#precio").change(function(){
	precioelegido = $("#precio").val();
	$('#cantidad').val(0);
	actualizoTotales();

})

$("#cantidad").change(function(){
	var cantidad = parseInt($("#cantidad").val());
	var precio = parseInt($("#precio").val());
	for (var i=0; i<productosVenta.length; i++) {
		if(productosVenta[i].id == elegido){
			var rta = 0;
			rta = checkCant(elegido,cantidad);
			if(rta == -1){
				$("#cant"+elegido).html("x "+parseInt(cantidad));
				productosVenta[i].cant = parseInt(cantidad);
				productosVenta[i].precio = parseInt(precio);
				$("#subtot"+elegido).html(" = "+parseInt(cantidad*precio));
			}else{
				$("#cant"+elegido).html("x "+parseInt(rta));
				$("#cantidad").val(parseInt(rta));
				productosVenta[i].cant = parseInt(rta);
				productosVenta[i].precio = parseInt(precio);
				$("#subtot"+elegido).html(" = "+parseInt(rta*precio));
				reponer(elegido);
			}

		}
	}
	actualizoTotales();
})
function init(){
	loadEstados();
	loadProductos();
	loadVentas();
}
function loadVentas(){
	$.ajax({
		type: "post", data: { "t": "tVenta"},
		url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				if(datos.cant){
					$(datos.ventas).each(function (i,k) {
						if(k){
							var fecha = formatDate(k.fechaventa);
							var estado = k.estado_idestado + "-" + k.nombestado;
							var subtotal = k.cant * k.monto;
							t.row.add(["#"+k.codigo,k.producto_idproducto+"-"+k.nombprod,"#"+k.cant,k.monto, fecha, "$"+subtotal,]).draw(false);}
						});
				}else{console.log("No se han encontrado ventas");}
			}
			else {console.log("Error: " + datos.txerr);}
		}
	});
}

function reponer(ideprod){
	var ideProd = ideprod;
	var textoErr  = "No hay stock";
	swal({
		title: textoErr,
		text: "Puede realizar un pedido ahora si lo desea",
		type: 'info',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si, realizar pedido.',
		cancelButtonText: 'No, cancelar.',
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
			swal({
				title: 'Que cantidad desea?',
				type: 'question',
				input: 'range',
				inputAttributes: {
					min: 1,
					max: 100,
					step: 1
				},
				inputValue: 25
			}).then((cantidad) => {
				if(cantidad.value){

					var cant = cantidad.value;
					swal({
						title: 'Que stock minimo desea tener?',
						type: 'question',
						input: 'range',
						inputAttributes: {
							min: 1,
							max: cant,
							step: 1
						},
						inputValue: 25
					}).then((min) => {
						if(min.value){
							var stock = min.value;
							$.ajax({
								type: "POST",
								url: "../ad/macros.php",
								data: {
									"t": "gCarrito",
									"idprod":ideProd,
									"cant": cant,
									"minstock": stock
								},
								cache: false,
								success: function(response) {
									if(!(response.err)){
										swal("Ok","El carrito ha sido creado!","success")
										
									}else{
										swal("Error","El carrito no pudo ser creado.","error")
									}
								},
								failure: function (response) {
									swal(
										"Error",
										"El carrito no pudo ser creado.", 
										"error"
										)
								}
							});							
						}else console.log("Cold feet");
					})
				}else if (cantidad.dismiss === swal.DismissReason.cancel) {swal('Cancelado','Recuerde que tiene poco stock de ese producto','info')}
			})
		} else if (result.dismiss === swal.DismissReason.cancel) {swal('Cancelado','Recuerde que tiene poco stock de ese producto','info')}
	})
}
function vender(){
	$.ajax({
		type: "post", 
		data: { 
			"t": "gVenta",
			"productos": productosVenta
		},
		url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				closeModal();
				sales();
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
/* * * * * * * *  Modificaciones * * * * * * * */
function editEstado(id) {
	var ideVenta = id;
	const {value: estado} = swal({
		title: 'Seleccione el estado',
		input: 'select',
		inputOptions:{"1":"Abierta","2":"En Proceso","3":"Cerrada"},
		inputPlaceholder: 'Seleccione el nuevo estado para la venta.',
		showCancelButton: true,
		inputValidator: (value) => {
			return new Promise((resolve) => {
				if (value) {
					$.ajax({
						type: "post", 
						data: { 
							"t": "uVentaEstado",
							"idVenta":ideVenta,
							"estado": value
						},
						url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
							if (datos.err == 0) {
								sales();
								swal({
									title: 'Confirmado',
									html:
									'El estado se ha actualizado. </pre>',
									confirmButtonText: 'Perfecto!'
								})

							}else{
								swal({
									title: 'Error.',
									html:
									datos.txerr+' </pre>',
									confirmButtonText: 'Aceptar'
								})
							}
						}
					});
				}
			})
		}
	})


}
function loadProductos() {
	var lProds = [];
	$.getJSON("../ad/macros.php?t=tProdsA", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lProds[i] = {
				id: data.producto[i].id,
				titulo: data.producto[i].data,
				precio: data.producto[i].precioventa,
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
				$('#cantidad').prop("disabled", false);
				$('#producto').prop("disabled", false);
				var id = parseInt(b.item.id);
				var tit = b.item.titulo;
				var cod = b.item.codigo;
				var preciovta = parseInt(b.item.precio);
				elegido = id;
				precioelegido = preciovta;
				$("#precio").val(precioelegido);
				$("#cantidad").val(0);
				agregoProd(id,precioelegido,cod,tit);
				
			}
		});
	});
	return lProds;
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

function actualizoTotales(){
	total = 0;
	for (var i=0; i<productosVenta.length; i++) {
		total += parseInt(productosVenta[i].cant*productosVenta[i].precio);	

	}
	total = parseInt(total);
	$("#total").val(total);
}
function agregoProd(id,preciovta,cod,tit,cant){
	var result = $.grep(productosVenta, function(e){ return e.id == id; });
	if(result.length == 0){
		productosVenta.push({
			id: id,
			precio: parseInt(precioelegido),
			cod: cod,
			tit: tit,
			cant: parseInt(cant)
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
			$('#cantidad').prop("disabled", true);
			$("#idprod"+ide).remove();
			actualizoTotales();
		}
	}
}
function loadEstados() {
	$.getJSON("../ad/macros.php?t=tConditions", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lEstados[i] = {
				id: data.estados[i].value,
				label: data.estados[i].value + "-" + data.estados[i].data,
				value: data.estados[i].value + "-" + data.estados[i].data
			};
		}
		$("#estado").autocomplete({
			source: lEstados,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mSales"
		});
	});
	return lEstados;
}
function formatDate(fecha){
	dia = fecha.split("-")[2];
	mes = fecha.split("-")[1];
	anio = fecha.split("-")[0];
	return (dia+"/"+mes+"/"+anio);
}
function openModal() {
	cleanModal();
	$('#mSales').modal('toggle');
}
function cleanModal(){
	productosVenta = [];
	elegido = 0;
	precioelegido = 0;
	total = 0.0;
	$("#producto").val("");
	$("#precio").val("");
	$("#cantidad").val("");
	$('#precio').prop("disabled", true);
	$('#cantidad').prop("disabled", true);
	$("#total").val("0.0");
	$("#dprod").empty();
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
function refresh() {
	$('#tsales').DataTable().clear();
	sales();
}
function isEmpty( el ){
	return !$.trim(el.html())
}