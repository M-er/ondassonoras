var elegido = 0;
var total = 0.0;
var codigo = "0000";
var productosCarrito = [{id: 0, precio: 0, codigo: "", tit: "", cant: 0, min: 0, user: 0}];
var trp = $('#tcarritos').DataTable({
	order: [[0, 'asc']],
	rowGroup: {
		endRender: function (rows, columns, group) {
			
			var avg = rows
			.data()
			.pluck(7)
			.reduce( function (a, b) {
				return a + b.replace(/[^\d]/g, '')*1;
			}, 0);

			return 'Total: '+
			$.fn.dataTable.render.number(',', '.', 0, '$').display( avg ) + '<a style="color:red;" class=" opciones float-right" href="#" onclick="cancelarCompra('+codigo+')"><i class="far fa-2x fa-times-circle"></i></a>';		
		},
		startRender: function ( rows, group ) {
			group = group.slice( 1 );
			while(group.charAt(0) === '0')
			{
				group = group.substr(1);
				codigo = group;
			}
			return '<a style="color:blue;float:right" class="opciones" onclick="imprimir('+group+')" href="#"><i class="fas fa-2x fa-print" aria-hidden="true"></i><a style="color:black;" class=" opciones float-right" href="#" onclick="editar('+group+')"><i class=" fa-2x fas fa-edit"></i><a style="color:green;" class=" opciones float-right" href="#" onclick="confirmarCompra('+group+')"><i class="far fa-2x fa-check-circle"></i></a>';
		},dataSrc: 0
	}
});

$(document).keyup(function (e) {
	if (e.keyCode == 27) { 
		if ($('#mCarr').hasClass('in')) { closeModal(); } 
	}
});
$(document).ready(function (e) {
	console.log("Carritos.");
	init();
});
function init(){
	loadTablaCarritos();
}
$("#producto").change(function(){
	if($('#producto').val() == ""){
		$("#cantidad").val("");
		$('#cantidad').prop("disabled", true);
	}else{
		$('#cantidad').prop("disabled", false);
	}
});
$("#cantidad").change(function(){
	var cantidad = parseInt($("#cantidad").val());
	for (var i=0; i<productosCarrito.length; i++) {
		if(productosCarrito[i].id == elegido){
			$("#cant"+elegido).html("x "+parseInt(cantidad));
			productosCarrito[i].cant = parseInt(cantidad);
			$("#subtot"+elegido).html(" = "+parseInt(cantidad*precioelegido));
		}
	}
	actualizoTotales();
})
function loadProductos(iduser) {
	var user = iduser
	var lProds = [];
	$.getJSON("../ad/macros.php?t=tProdsC&user="+user, function (data) {
		for (var i = 0; i < data.cant; i++) {
			agregoProd(data.producto[i].id,parseInt(data.producto[i].precioventa),parseInt(data.producto[i].cant),data.producto[i].value,data.producto[i].data, user);
		}
		for (var i = 0; i < data.cants; i++) {
			lProds[i] = {
				user:   user,
				id:     data.productos[i].id,
				titulo: data.productos[i].data,
				precio: data.productos[i].precioventa,
				codigo: data.productos[i].value,
				label:  data.productos[i].value + "-" + data.productos[i].data,
				value:  data.productos[i].value + "-" + data.productos[i].data,
			};
		}
		$("#producto").autocomplete({
			source: lProds,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mCarr",
			select: function(a,b){
				$('#cantidad').prop("disabled", false);
				var id = parseInt(b.item.id);
				var tit = b.item.titulo;
				var cod = b.item.codigo;
				var user = b.item.user;
				var preciovta = parseInt(b.item.precio);
				elegido = id;
				precioelegido = preciovta;
				var cant = 0;
				$("#cantidad").val(0);
				agregoProd(id,preciovta,cant,cod,tit, user);
			}
		});
	});
	return lProds;
}
function actualizoTotales(){
	total = 0;
	for (var i=0; i<productosCarrito.length; i++) {
		total += parseInt(productosCarrito[i].cant*productosCarrito[i].precio);	
	}
	total = parseInt(total);
	$("#total").val(total);
}
function agregoProd(id,preciovta,cant,cod,tit, user){
	var result = $.grep(productosCarrito, function(e){ return e.id == id; });
	if(result.length == 0){
		productosCarrito.push({
			id: id,
			precio: preciovta,
			codigo: cod,
			tit: tit,
			cant: cant,
			user: user
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
		var ncant = cant;
		var cant = document.createElement("span");
		cant.innerHTML = "x"+ncant;
		cant.setAttribute('id', 'cant'+id);
		var subtot = document.createElement("span");
		var nsubtotal = preciovta*ncant;
		subtot.innerHTML = " - $"+nsubtotal;
		subtot.setAttribute('id', 'subtot'+id);
		bbadge.append(cant);
		bbadge.append(subtot);
		bbadge.append(badge);		
		$("#subTotal").append(bbadge);
	}
	actualizoTotales();

}
function quitarProd(id){
	$("#producto").val("");
	var ide = id;
	for (var i=0; i<productosCarrito.length; i++) {
		if(productosCarrito[i].id == ide){
			productosCarrito.splice(i,1);
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
function openModal() {
	$('#mCarr').modal('toggle');
}
function closeModal() {
	$('#mCarr').modal().hide();
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	var delayInMilliseconds = 1000;
	setTimeout(function () {
		$modalStack.clearFocusListCache();
	}, delayInMilliseconds);
}
function cleanCampos(modal) {
	$("#idcar").val("");
	$("#producto").val("");
	$("#cantidad").val("");
	$("#total").val("");
}
function refreshCarr() {
	$('#tcarritos').DataTable().clear();
	carritos();
}
function loadTablaCarritos(){
	$('#tcarritos').DataTable();
	$.ajax({
		type: "post",
		data: { "t": "tCarritos" },
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				if(datos.cant){
					for (var x = 0; x < datos.cant; x++){
						var elcod = parseInt(datos.carritos[x].codigo);
						var totalParcial = datos.carritos[x].cant*datos.carritos[x].preciovta;
						trp.row.add(["#"+datos.carritos[x].codigo,datos.carritos[x].producto_idproducto+"-"+datos.carritos[x].nombprod,"#"+datos.carritos[x].minstock,"#"+datos.carritos[x].cant,"$"+datos.carritos[x].preciocto,"$"+datos.carritos[x].preciovta,datos.carritos[x].usuario_idusuario+"-"+datos.carritos[x].nombuser,"$"+totalParcial]).draw(false); 			
					} 
				}else{
					trp.row.add([" "," "," "," "," No hay carritos creados  "," "," "," "," "]).draw(false);
					$(".opciones").hide();
					console.log("No se han encontrado Carritos");

				}
			} else { console.log("Error: " + datos.txerr); }
		},
	});
}
function confirmarCompra(codigo){
	var codcarr = codigo;
	$.ajax({
		type: "post",
		data: { 
			"t": "okCarrito",
			"codcarr":codcarr
		},
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if(datos.err == 0){
				swal("Ok!", "Se ha confirmado la compra", "success");
				refreshCarr();
			}else { 
				if(datos.err == 2){
					swal("Error", "No hay stock suficiente.", "error");
				} 
			}
		},
	});
}

function cancelarCompra(codigo){
	var codcarr = codigo;
	$.ajax({
		type: "post",
		data: { 
			"t": "dCarrito",
			"codigo":codcarr
		},
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if(datos.err == 0){
				swal("Ok!", "Se ha cancelado la compra", "success");
				refreshCarr();
			}else { console.log("Error: " + datos.txerr); }
		},
	});
}
function editar(codigo){
	var codigo = codigo;
	$.ajax({
		type: "post", data: { "t": "tCarritos", "codigo": codigo },
		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				$("#idcar").val(codigo);
				loadProductos(datos.carritos[0].usuario_idusuario);
				openModal();
			}
		}
	});
}
function actualizarCarro(){
	var codigo = $("#idcar").val();
	$.ajax({
		type: "post", 
		data: { 
			"t": "dCarrito",
			"codigo":codigo
		},
		url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				for (var i=0; i<productosCarrito.length; i++) {
					if(productosCarrito[i].id){
						carrito(productosCarrito[i].id, productosCarrito[i].user,productosCarrito[i].cant);
					}
				}
				refreshCarr();
				closeModal();
				swal({title: 'Listo!!!',
					html:'El carrito de compras ha sido actualizado </pre>',
					confirmButtonText: 'Perfecto!'});
			}
		}
	});

}
function carrito(producto, user, cant){
	var ideProd = producto;
	var cant = cant;
	var user = user;
	$.ajax({
		type: "post", 
		data: { 
			"t": "uCarrito",
			"idprod":ideProd,
			"userID": user,
			"cant": cant
		},
		url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				swal({
					title: 'Listo!!!',
					html:
					'El producto ha ido al carrito de compras </pre>',
					confirmButtonText: 'Perfecto!'
				})
			}else{
				if(datos.err == 2){
					swal({
						title: 'Cantidad no permitida.',
						html:
						'No hay suficiente stock para cumplir con esa demanda. </pre>',
						confirmButtonText: 'Entendido.'
					})
				}
			}
		}

	});
}
function imprimir(ide){
	var ide = ide;
	$.ajax({
		type: "post", data: { "t": "tCarritos", "codigo": ide },
		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				if(datos.cant){
					var texto = "";
					var total = 0;
					var x=0;
					texto += "<style type='text/css'>.table .thead-dark th {color: #fff;background-color: #212529;border-color: #32383e;}.table thead th {vertical-align: bottom;border-bottom: 2px solid #dee2e6;}.table td, .table th {padding: .75rem;vertical-align: top;}</style><table><tr><th>N°Presupuesto : "+datos.carritos[x].codigo+"</th><th></th></tr><tr><td>Cliente: "+datos.carritos[x].nombuser+"</td><td></td></tr><tr><td>Dirección cliente: "+datos.carritos[x].zona+"</td><td></td></tr><tr><td>Fecha: "+datos.carritos[x].vigencia+"</td><td></td></tr></table>";
					texto += "<table class='table'><tr><th class='thead-dark'>Ubicación</th><th>Producto</th><th>Cantidad</th><th>Precio(Venta)</th><th>Subtotal</th>";
					for(var x=0; x<datos.cant; x++){						
						texto += "<tr><td>"+datos.carritos[x].ubicacion+"</td><td>"+datos.carritos[x].nombprod+"</td><td>"+datos.carritos[x].cant+"</td><td>$"+datos.carritos[x].preciovta+"</td><td>$"+datos.carritos[x].cant * datos.carritos[x].preciovta+"</td></tr>";
						total += datos.carritos[x].preciovta*datos.carritos[x].cant;
					}
					texto += "<tr><td>Total: </td><td></td><td></td><td></td><td>$"+total+"</td></tr></table>";
				}
				$("#titCode").html(texto);
				print();
			}
		}
	});

}
function print(){
	var mywindow = window.open('', 'PRINT', 'height=400,width=600');
	mywindow.document.write('<html>'+$("#etiqueta").html()+'</html>');
	mywindow.document.close(); 
	mywindow.focus(); 
	mywindow.print();
	mywindow.close();
	return true;
}
