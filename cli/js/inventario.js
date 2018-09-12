/* Variables Globales */
var tags = new Object;
var noSubo = [];

$(document).keyup(function (e) {
	if (e.keyCode == 27) { 
		if ($('#mProd').hasClass('in')) { closeModal(); } 
		if ($('#mUpdate').hasClass('in')) { closeModal(); } 
	}
});
$(document).ready(function (e) {
	loadTablaProd();
	tags = loadTags();
	cats = loadCategorias();
	brands = loadMarcas();
	prove = loadProveedores();
	$('#mProd').on('show.bs.modal', function () {
		cleanCampos(1);
		preparoPreview();
	});
	$('#mUpdate').on('show.bs.modal', function () {
		cleanCampos(2);
	});
});

/* * * * * * * *  Cargas * * * * * * * */
function guardar(){
	console.log("Voy a guardar un producto");
	var lostoken = $('#tag').tokenfield('getTokens');
	if(!(lostoken.length)){
		swal("Atencion","Debe completar al menos con un tag antes de querer crear el producto","info");
	}else{
		var forData = new FormData();
		var ins = $('#imgToUpload').prop('files').length;
		var nombimg = "";
		for (var x = 0; x < ins; x++) {
			nombimg = document.getElementById('imgToUpload').files[x].name;
			if (jQuery.inArray(nombimg, noSubo) == -1) {
				forData.append("img[" + x + "]", document.getElementById('imgToUpload').files[x]);
			}
		}
		var cat = $('#cat').val().split("-")[0];
		var prov = $('#proveedor').val().split("-")[0];
		var marca = $('#marca').val().split("-")[0];
		var modelo= $("#modelo").val().split("-")[0];
		var codigo= $("#codigo").val().split("-")[0];
		var lostags = [];
		var newTag = []
		$(lostoken).each(function (k, v) {
			if (v.id) lostags.push(v.id);
			else newTag.push(v.value);
		});
		if(lostags.length) forData.append("tags", lostags);
		if(newTag.length) forData.append("newTags", newTag);
		forData.append("cat", cat);
		forData.append("codigo", codigo);
		forData.append("prov", prov);
		forData.append("marca", marca);
		forData.append("modelo", modelo);
		forData.append("obs", $('#obs').val());
		forData.append("cant", $('#cant').val());
		forData.append("ide", $("#prodId").val());
		forData.append("nombre", $('#nomb').val());
		forData.append("ubicacion", $('#ubicacion').val());
		forData.append("habilitado", $('#habilitado').val());
		forData.append("preciocosto", $('#preciocto').val());
		$.ajax({
			type: "post",
			data: forData,
			url: "../ad/macros.php?t=sProd",
			dataType: 'json',
			processData: false,  
			contentType: false,
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if (datos.err == 0) {
					swal("Exito", "Se han guardado sin problemas.", "success");
					closeModal();
					var delayInMilliseconds = 1000;
					setTimeout(function () {
						refresh();
					}, delayInMilliseconds);
				} else
				swal("Error", datos.txerr, "error");
			}
		});
		loadTablaProd();
	}
}
function actualizar(){
	var ideProd= $("#prodIdU").val();
	var cantu= $("#cantu").val();
	var preciovtau= $("#preciovtau").val();
	var stocku= $("#stocku").val();
	$.ajax({
		type: "POST",
		url: "../ad/macros.php",
		data: {
			"t": "uProd",
			"idprod":ideProd,
			"cant": cantu,
			"preciovta": preciovtau,
			"stock": stocku
		},
		cache: false,
		success: function(response) {
			if (response.err == 0) {
				closeModal(2);
				refresh();
				swal(
					"Ok",
					"La cantidad ha sido actualizada!",
					"success"
					)

			}else{
				closeModal(2);
				swal(
					"Error",
					response.txerr,
					"error"
					)

			}
		},
		failure: function (response) {
			swal(
				"Error",
				"La cantidad no pudo ser actualizada.", 
				"error"
				)
		}
	});	
}
function loadTags() {
	var lTags = [];
	$.getJSON("../ad/macros.php?t=tTags", function (data) {
		for (var i = 0; i < data.length; i++) {
			lTags[i] = {
				id: data[i].id,
				label: data[i].name.toLowerCase(),
				value: data[i].name.toLowerCase()
			}
		}
		$('#tag').tokenfield({
			autocomplete: {
				source: lTags,
				autoFocus: true,
				delay: 100,
				appendTo: "#mProd"
			},
			showAutocompleteOnFocus: true
		}).on('tokenfield:createtoken', function (e) { //Antes de Crear un token
			var sesalva = true;
			var losquehay = $('#tag').tokenfield('getTokens');
			$(losquehay).each(function (k, v) {
				if (v.label == e.attrs.label.toLowerCase()) {sesalva = false;}
			});
			return sesalva;
		});
		$(".tokenfield").css({ display: "inline-block" });
	});
	return lTags;
}
function loadCategorias() {
	var lCategorias = [];
	$.getJSON("../ad/macros.php?t=tCats", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lCategorias[i] = {
				id: data.cats[i].value,
				label: data.cats[i].value + "-" + data.cats[i].data,
				value: data.cats[i].value + "-" + data.cats[i].data
			};
		}
		$("#cat").autocomplete({
			source: lCategorias,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mProd"
		});
	});
	return lCategorias;
}
function loadMarcas() {
	var lMarcas = [];
	$.getJSON("../ad/macros.php?t=tMarcas", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lMarcas[i] = {
				id: data.brand[i].value,
				label: data.brand[i].value + "-" + data.brand[i].data,
				value: data.brand[i].value + "-" + data.brand[i].data
			};
		}
		$("#marca").autocomplete({
			source: lMarcas,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mProd",
			select: function(a,b){
				var id = b.item.value.split("-")[0];
				loadModelo(id);
			}
		});
	});
	return lMarcas;
}
function loadModelo(idMarca){
	$("#modelo").empty();
	var lModelo = [];
	$.getJSON("../ad/macros.php?t=tModelo&idMarca="+idMarca, function (data) {
		for (var i = 0; i < data.cant; i++) {
			lModelo[i]={
				id: data.modelos[i].value,
				label: data.modelos[i].value + "-" + data.modelos[i].data,
				value: data.modelos[i].value + "-" + data.modelos[i].data
			}
		}
		$("#modelo").autocomplete({
			source: lModelo,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mProd"
		});
	});
	return lModelo;
}
function loadProveedores() {
	var lProv = [];
	$.getJSON("../ad/macros.php?t=tProve", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lProv[i] = {
				id: data.proveedores[i].idproveedor,
				label: data.proveedores[i].idproveedor + "-" + data.proveedores[i].nombproveedor,
				value: data.proveedores[i].idproveedor + "-" + data.proveedores[i].nombproveedor
			};
		}
		$("#proveedor").autocomplete({
			source: lProv,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mProd",
		});
	});
	return lProv;
}
function loadTablaProd() {
	console.log("Inicializando - Cargando datos en tabla");
	$('#tinventario').DataTable();
	$.ajax({
		type: "post",
		data: {
			"t": "tInv"
		},
		url: "../ad/macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var t = $('#tinventario').DataTable();
				var alerta = "";
				var difer = 0;
				if (datos.cant) {
					for (var i = 0; i < datos.cant; i++) {
						switch(parseInt(datos.productos[i].cantstock) >= parseInt(datos.productos[i].minstock)+20){
							case true:
							alerta = "green";
							break;
							case false:
							difer = parseInt(datos.productos[i].cantstock) - parseInt(datos.productos[i].minstock);
							if(difer >= 5){
								alerta = "orange";
							}else{
								if(difer<5)
									alerta = "red";
							}
							break;
						}
						t.row.add([datos.productos[i].codigo ,datos.productos[i].nombprod,"$"+datos.productos[i].preciocto,datos.productos[i].preciovta,"<a href='#' style='color:"+alerta+"'><b>#"+ datos.productos[i].cantstock +"</b></a>","#"+datos.productos[i].minstock, "<a style='color:#000;' onclick='editProdCant(" + datos.productos[i].idproducto + ")' href='#'><i class='fas fa-2x fa-pencil-alt' aria-hidden='true'></i></a><a style='color:#000;' onclick='deleteProd(" + datos.productos[i].idproducto + ")' href='#'><i class='fas fa-2x fa-trash-alt' aria-hidden='true'></i>",]).draw(false);
					}

				}else{
					console.log("Inventario vacio.");
				}
			} else {
				console.log("Error: " + datos.txerr);
			}
		},

	});
}
/* * * * * * * *  Bajas * * * * * * * */
function deleteImg(ide) {
	var ide = ide;
	swal({
		title: "Esta seguro?",
		text: "Esta a punto de eliminar la imagen del producto!",
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
				type: "post", data: { "t": "dImg", "ideImg": ide },
				url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						var img = $('#img' + ide + '').attr('name');
						var ins = $('#imgToUpload').prop('files').length;
						for (var x = 0; x < ins; x++) {
							if (($('#imgToUpload').prop('files')[x].name == img)) {
								$('#thumb' + ide + '').remove();
								noSubo.push(img);
							}
						}
						$("#thumb" + ide).remove();
						if ($('#thumbnail').is(':empty')) { cambioModal(0); }
						swal("Eliminada!", "La imagen ha sido eliminada.", "success");
					} else {
						swal("Error", datos.txerr, "error");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		} else {
			swal("Cancelado", "La imágen está a salvo :)", "info");
		}
	});
}
function deleteProd(id) {

	var ide = id;
	swal({
		title: 'Esta seguro?',
		text: "Esta a punto de eliminar el producto!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si, eliminalo!',
		cancelButtonText: 'No, cancelar!',
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
			$.ajax({
				type: "post", data: { "t": "dProdxUser", "ide": ide },
				url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						swal('Eliminado!','Su producto ha sido eliminado.','success')						
						closeModal(1);
						refresh();
					} else {swal("Error", datos.txerr, "error");}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		} else if (result.dismiss === swal.DismissReason.cancel) {swal('Cancelado','Su producto está a salvo :)','error')}
	})
}
/* * * * * * * *  Modificaciones * * * * * * * */
function editProdCant(id) {
	openModal(2);

	var id = id;

	$.ajax({
		type: "POST",
		url: "../ad/macros.php",
		data: {
			"t": "tUpdateProd",
			"ide": id
		},
		cache: false,
		success: function(response) {
			$("#prodIdU").val(id);
			$("#cantu").val(response.producto.cantstock);
			$("#preciovtau").val(response.producto.preciovta);
			$("#stocku").val(response.producto.minstock);
			openModal(2);		
		},
		failure: function (response) {
			swal("Error", datos.txerr, "error");

		}
	});	
}
/* * * * * * * *  Auxiliares * * * * * * * */
function cleanCampos(modal) {
	if(modal == 1){
		$("#prodId").val("");
		$("#nomb").val("Sin Nombre");
		$("#cat").val("1-Funda");
		$("#obs").val("Sin observacion");
		$("#proveedor").val("1-Ondas Sonoras");
		$("#tag").tokenfield('setTokens', new Array());
		$("#cant").val("1");
		$("#codigo").val("0");
		$("#marca").val("0-Generico");
		$("#modelo").val("0-Generico");
		$("#preciocto").val("100");
		$("#ubicacion").val("Sin ubicacion");
		$("#imgToUpload").val("");
		$("#thumbnail").empty();
		noSubo.length = 0;
		cambioModal(0);
	}else{
		$("#prodIdU").val("");
		$("#cantu").val("0");
		$("#preciovtau").val("0");
		$("#stocku").val("0");
	}
}
function refresh() {
	$('#tinventario').DataTable().clear();
	inventario();
}
function openModal(modal) {
	if (modal == 1) { $('#mProd').modal('show'); }
	if (modal == 2) { $('#mUpdate').modal('show'); }
}
function closeModal(modal) {
	if(modal == 1)
		$('#mProd').modal().hide();
	else
		$('#mUpdate').modal().hide();
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	var delayInMilliseconds = 1000;
	setTimeout(function () {
		$modalStack.clearFocusListCache();
	}, delayInMilliseconds);
}
function cambioModal(opc) {
	if (opc) {
		$('#mDialog').addClass('modal-lg');
		$('#columna1').addClass('col-sm-6');
		$('#columna1').removeClass('col-sm-12');
		$('#columna2').addClass('col-sm-6');
	}
	else {
		$('#mDialog').removeClass('modal-lg');
		$('#columna1').removeClass('col-sm-6');
		$('#columna1').addClass('col-sm-12');
		$('#columna2').removeClass('col-sm-6');
	}

}
function preparoPreview() {
	$("#imgToUpload").on("change", function (e) {
		if (typeof (FileReader) != "undefined") {
			var previewing = $("#thumbnail");
			var i = 0;
			var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
			$($(this)[0].files).each(function () {
				i++;
				var file = $(this);
				if (regex.test(file[0].name.toLowerCase())) {
					var reader = new FileReader();
					var imgwrap = $('<span />', { "class": 'pip' });
					var close = $('<span />', { "class": 'remove' });
					var fa = $('<i />', { "class": 'text-danger fa fa-bomb' });
					fa.attr("onclick", "deleteImg(" + i + ")");
					var img = $("<img />");
					img.attr("id", "img" + i + "");
					imgwrap.attr("id", "thumb" + i + "");
					img.attr("name", "" + file[0].name + "");
					img.attr("class", "imageThumb");
					console.log("Che voy a ver el reader on load");
					reader.onload = function (e) {
						console.log("Viendo el reader on load");
						img.attr("src", e.target.result);
						close.append(fa);
						imgwrap.append(img);
						imgwrap.append(close);
						previewing.append(imgwrap);
					}
					reader.readAsDataURL(file[0]);
				} else {
					swal("Error", "No es una imágen válida.", "error");
					previewing.html("");
					return false;
				}
			});
			cambioModal(1);
		} else {
			swal("Error", "Este navegador, no soporta HTML5 FileReader.", "error");
		}
	});
}
