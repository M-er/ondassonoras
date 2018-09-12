/* Variables Globales */
var tags = new Object;
var noSubo = [];

$(document).keyup(function (e) {
	if (e.keyCode == 27) { if ($('#mProd').hasClass('in')) { closeModal(); } }
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
});

/* * * * * * * *  Cargas * * * * * * * */
function guardar(){
	var lostoken = $('#tag').tokenfield('getTokens');
	if($("#modelo").val() == ""){
		swal("Atencion","Debe completar el modelo del producto","info");
	}
	if(!(lostoken.length)){
		swal("Atencion","Debe completar al menos con un tag antes de querer crear el producto","info");
	}
	if((lostoken.length) && $("#modelo").val() != ""){
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
		if(typeof modelo == 'number'){
			forData.append("modelo", modelo);
		}else{
			forData.append("modeloN", modelo);
		}
		forData.append("obs", $('#obs').val());
		forData.append("cant", $('#cant').val());
		forData.append("minstock", $('#min').val());
		forData.append("ide", $("#prodId").val());
		forData.append("nombre", $('#nomb').val());
		forData.append("ubicacion", $('#ubicacion').val());
		forData.append("habilitado", $('#habilitado').val());
		forData.append("preciocosto", $('#preciocto').val());
		forData.append("precioventa", $('#preciovta').val());
		$.ajax({
			type: "post",
			data: forData,
			url: "./macros.php?t=sProd",
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
function loadTags() {
	var lTags = [];
	$.getJSON("macros.php?t=tTags", function (data) {
		for (var i = 0; i < data.tags.length; i++) {
			lTags[i] = {
				id: data.tags[i].value,
				label: data.tags[i].data.toLowerCase(),
				value: data.tags[i].data.toLowerCase()
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
	$.getJSON("macros.php?t=tCats", function (data) {
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
	$.getJSON("macros.php?t=tMarcas", function (data) {
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
	$("#modelo").val("");
	var lModelo = [];
	$.getJSON("macros.php?t=tModelo&idMarca="+idMarca, function (data) {
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
	$.getJSON("macros.php?t=tProve", function (data) {
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
	$('#tproductos').DataTable();
	$.ajax({
		type: "post",
		data: {
			"t": "tProd"
		},
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var t = $('#tproductos').DataTable();
				var img = "";
				if (datos.cant) {
					for (var i = 0; i < datos.cant; i++) {
						if(datos.productos[i].pathimagen != null){img = datos.productos[i].pathimagen;}else{img = "default-50x50.gif";}
						t.row.add([datos.productos[i].codigo,  "<div class='item-thumb'><a href='#'><img class='imgTable' src='../cli/img/productos/"+img+"' alt='Su imagen' /></a></div>",datos.productos[i].nombprod,datos.productos[i].cantstock, "$"+datos.productos[i].preciocto,datos.productos[i].nombremarca,datos.productos[i].nombremodelo,datos.productos[i].ubicacion,datos.productos[i].nombproveedor ,"<a style='color:#000;' onclick='editProd(" + datos.productos[i].idproducto + ")' href='#'><i class='fas fa-2x fa-pencil-alt' aria-hidden='true'></i></a><a style='color:#000;' onclick='deleteProd(" + datos.productos[i].idproducto + ")' href='#'><i class='fas fa-2x fa-trash-alt' aria-hidden='true'></i><a style='color:#000;' onclick='imprimir(" + datos.productos[i].idproducto + ")' href='#'><i class='fas fa-2x fa-print' aria-hidden='true'></i>",]).draw(false);
					}
				}else{
					console.log("No hay productos cargados.");
				}
			} else {
				console.log("Error: " + datos.txerr);
			}
		},

	});
}
function loadEdit(id) {
	var ide = id;
	$.ajax({
		type: "post", data: { "t": "tProd", "ide": ide },
		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var ojos = document.getElementById("h4info");
				ojos.scrollIntoView();

				var t = $('#tproductos').DataTable();
				openModal();
				$("#prodId").val(datos.productos[0].idproducto);
				$("#nomb").val(datos.productos[0].nombprod);
				$("#obs").val(datos.productos[0].obsprod);
				$("#cant").val(datos.productos[0].cantstock);
				$("#min").val(datos.productos[0].minstock);
				$("#preciocto").val(datos.productos[0].preciocto);
				$("#preciovta").val(datos.productos[0].precio1);
				$("#proveedor").val(datos.productos[0].idproveedor + "-" +datos.productos[0].nombproveedor);
				$("#modelo").val(datos.productos[0].idmodelo + "-" +datos.productos[0].nombremodelo);
				$("#ubicacion").val(datos.productos[0].ubicacion);
				$("#cat").val(datos.productos[0].idcategoria + "-" + datos.productos[0].nombrecat);
				$("#codigo").val(datos.productos[0].codigo);
				$("#marca").val(datos.productos[0].idmarca + "-" + datos.productos[0].nombremarca);
				if(datos.productos[0].tags){
					var lostags = datos.productos[0].tags.split(",");
					var resultado = [];
					for (var j = 0; j < lostags.length; j++) {
						var campos = lostags[j].split("-");
						resultado.push({ id: campos[0], value: campos[1], label: campos[1] });
					}
					$("#tag").tokenfield('setTokens', resultado);
				}
				console.log("Tengo: "+datos.productos[0].pathimagen);
				if (datos.productos[0].pathimagen) {
					var previewing = $("#thumbnail");
					previewing.html("");
					var imgA = datos.productos[0].pathimagen.split(",");
					for (var x = 0; x < imgA.length; x++) {
						var ideImg;
						var imgwrap;
						var close; 
						var fa; 
						var img;
						imgwrap = $('<span />', { "class": 'pip' });
						close = $('<span />', { "class": 'remove' });
						fa = $('<i />', { "class": 'text-danger fa fa-bomb' });
						img = $("<img />");
						img.attr("class", "imageThumb");
						if(imgA[x] != 'default-50x50.gif'){
							ideImg = imgA[x].split("/")[2].split(".")[0];
							fa.attr("onclick", "deleteImg(" + ideImg + ")");
							img.attr("id", "img" + ideImg + "");
							imgwrap.attr("id", "thumb" + ideImg + "");
							img.attr("src", "../cli/img/productos/" + imgA[x]);
						}else{
							img.attr("src", "../cli/img/productos/default-50x50.gif");
						}
						close.append(fa);
						imgwrap.append(img);
						imgwrap.append(close);
						previewing.append(imgwrap);
					}
					cambioModal(1);
				}
			}
			else {
				console.log("Error: " + datos.txerr);
			}
		}
	});
}
/* * * * * * * *  Bajas * * * * * * * */
function deleteImg(ide) {
	var ide = ide;
	swal({
		title: "Esta segur@?",
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
				url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
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
		title: "Esta segur@?",
		text: "Esta a punto de eliminar el producto!",
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
				type: "post", data: { "t": "dProd", "ide": ide },
				url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						swal("Eliminado!", "El producto se ha eliminado satisfactoriamente.", "success");
						closeModal();
						refresh();
					} else {
						swal("Error", datos.txerr, "error");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		} else {
			swal("Cancelado", "Su producto está a salvo :)", "info");
		}
	});
}
/* * * * * * * *  Modificaciones * * * * * * * */
function editProd(id) {
	loadEdit(id);
}
/* * * * * * * *  Auxiliares * * * * * * * */
function cleanCampos(modal) {
	$("#prodId").val("");
	$("#nomb").val("Sin Nombre");
	$("#cat").val("1-Funda");
	$("#obs").val("Sin observacion");
	$("#proveedor").val("1-Ondas Sonoras");
	$("#tag").tokenfield('setTokens', new Array());
	$("#cant").val("1");
	$("#min").val("0");
	$("#codigo").val("0");
	$("#marca").val("0-Generico");
	$("#modelo").val("0-Generico");
	$("#preciocto").val("100");
	$("#preciovta").val("100");
	$("#ubicacion").val("Sin ubicacion");
	$("#imgToUpload").val("");
	$("#thumbnail").empty();
	noSubo.length = 0;
	cambioModal(0);
}
function refresh() {
	$('#tproductos').DataTable().clear();
	productos();
}
function openModal() {
	$('#mProd').modal('toggle');
}
function closeModal() {
	$('#mProd').modal().hide();
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	var delayInMilliseconds = 1000;
	setTimeout(function () {
		$modalStack.clearFocusListCache();
	}, delayInMilliseconds);
}
function openModalC() {
	$('#mBarcode').modal('toggle');
}
function closeModalC() {
	$('#mBarcode').modal('toggle');
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
function imprimir(ide){
	var ide = ide;
	$.ajax({
		type: "post", data: { "t": "tProd", "ide": ide },
		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var texto = datos.productos[0].codigo;
				var proveedor = datos.productos[0].nombproveedor.split(' ');
				var prov = "["+proveedor[0].charAt(0).toUpperCase()+" "+proveedor[1].charAt(0).toUpperCase()+"]";
				$("#titCode").html(datos.productos[0].nombrecat+" "+datos.productos[0].nombprod+" "+prov);
				JsBarcode("#code128", texto, {format: "CODE128",text: texto});
				print();
				//openModalC();
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
/*

	
    */