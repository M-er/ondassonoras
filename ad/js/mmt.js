/* Variables Globales */
var tags = new Object;
$(document).keyup(function (e) {
	if (e.keyCode == 27) { 
		if ($('#mDynamic').hasClass('in')) { closeModal(); } 
	}
});

$(document).ready(function (e) {
	console.log("Todo listo");
	loadTabla();
});
function cambioTipo(){
	var tipo = $("#tipo").val();
	switch (tipo){
		case "1":
		$.ajax({
			type: "post",
			data: { "t": "tMarcas"},
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					$("#tituloModal").html("Creación de marca");
					$("#ide1").val("");
					$("#label1").html("Marca");
					$("#col2").hide();
					loadMarcas(1);
				}else { console.log("Error: " + datos.txerr); }
			},
		});
		
		break;
		case "2":
		$.ajax({
			type: "post",
			data: { "t": "tMarcas"},
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					$("#tituloModal").html("Creación de modelo");
					$("#col2").show();
					$("#label1").html("Marca");
					$("#label2").html("Modelo");
					$("#ide1").val("");
					$("#ide2").val("");
					loadMarcas(2);
				}else { console.log("Error: " + datos.txerr); }
			},
		});
		break;
		case "3":
		$.ajax({
			type: "post",
			data: { "t": "tTags"},
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					$("#tituloModal").html("Creación de tag");
					$("#col2").show();
					$("#label1").html("Tag");
					$("#label2").html("Importancia");
					$("#ide1").val("");
					$("#ide2").val("");
					loadTags();
				}else { console.log("Error: " + datos.txerr); }
			},
		});
		break;
		default:
		break;
	}
}
function loadTabla() {
	console.log("Inicializando - Cargando datos en tablas");
	$('#tdynamic').DataTable();
	$.ajax({
		type: "post",
		data: { "t": "tMMT" },
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var table = $('#tdynamic').DataTable();
				for (var x = 0; x < datos.cantMarcas; x++) 
					table.row.add(["Marca",datos.marca[x].nombMarca,"-","-","<a style='color:#000;' onclick='editar(1," + datos.marca[x].idmarca + ")' href='#'><i class='fas fa-2x fa-pencil-alt' aria-hidden='true'></i></a>  <a style='color:#000;' onclick='eliminar(1," + datos.marca[x].idmarca + ")' href='#'><i class='fas fa-2x fa-trash-alt' aria-hidden='true'></i></a>",]).draw(false); 			
				for (var x = 0; x < datos.cantModelos; x++) 
					table.row.add(["Modelo",datos.modelo[x].nombModelo, datos.modelo[x].nombMarca,"-","<a style='color:#000;' onclick='editar(2," + datos.modelo[x].idmodelo + ")' href='#'><i class='fas fa-2x fa-pencil-alt' aria-hidden='true'></i></a>  <a style='color:#000;' onclick='eliminar(2," + datos.modelo[x].idmodelo + ")' href='#'><i class='fas fa-2x fa-trash-alt' aria-hidden='true'></i></a>",]).draw(false); 
				for (var x = 0; x < datos.cantTags; x++) 
					table.row.add(["Tag",datos.tag[x].nombTag,"-",datos.tag[x].importancia,"<a style='color:#000;' onclick='editar(3," + datos.tag[x].idtag + ")' href='#'><i class='fas fa-2x fa-pencil-alt' aria-hidden='true'></i></a>  <a style='color:#000;' onclick='eliminar(3," + datos.tag[x].idtag + ")' href='#'><i class='fas fa-2x fa-trash-alt' aria-hidden='true'></i></a>",]).draw(false);
			} else { console.log("Error: " + datos.txerr); }
		},
	});
}

function cleanCampos() {
	$("#label1").html("");
	$("#label2").html("");
	$("#tipo").hide("");
	$("#tipo").val("");
	$("#col2").show();
	$("#ide1").val("");
	$("#ide2").val("");
	$("#tituloModal").val("Edición");
}
function editar(tipo, id){
	var ide = id;
	openModal(tipo);
	switch(tipo){
		case 1:
		$.ajax({
			type: "post",
			data: { "t": "tMarca", "idmarca":ide },
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					$("#label1").html("Marca");
					$("#tituloModal").html("Edicion de marca #"+datos.marca.idmarca);
					$("#ide1").val(datos.marca.idmarca + "-" + datos.marca.nombremarca);
					loadMarcas(1);
				}else { console.log("Error: " + datos.txerr); }
			},
		});
		break;
		case 2:
		$.ajax({
			type: "post",
			data: { "t": "tMod", "idMod":ide },
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					$("#label1").html("Marca");
					$("#label2").html("Modelo");
					$("#tituloModal").html("Edicion de modelo #"+datos.modelo.idmodelo);
					$("#ide1").val(datos.marca.idmarca + "-" + datos.marca.nombMarca);
					$("#ide2").val(datos.modelo.idmodelo + "-" + datos.modelo.nombModelo);
					loadMarcas(2);
				}else { console.log("Error: " + datos.txerr); }
			},
		});
		break;
		case 3:
		$.ajax({
			type: "post",
			data: { "t": "tTag", "idtag":ide },
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					$("#label1").html("Tag");
					$("#label2").html("Importancia");
					$("#tituloModal").html("Edicion de tag #"+datos.tag.idtag);
					$("#ide1").val(datos.tag.idtag + "-" + datos.tag.nombretag);
					$("#ide2").val(datos.tag.importancia);
					loadTags();
				}else { console.log("Error: " + datos.txerr); }
			},
		});
		break;
	}
}
function eliminar(tipo,id){
	var ide = id;
	switch(tipo){
		case 1:
		swal({
			title: "Esta segur@?",
			text: "Esta a punto de eliminar la Marca",
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
					type: "post", data: { "t": "dMar", "ideMar": ide },
					url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
						if (datos.err == 0) {
							swal("Eliminado!", "La marca ha sido eliminada.", "success");
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
				swal("Cancelado", "La marca está a salvo :)", "info");
			}
		});
		break;
		case 2:
		swal({
			title: "Esta segur@?",
			text: "Esta a punto de eliminar el modelo",
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
					type: "post", data: { "t": "dMod", "ideMod": ide },
					url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
						if (datos.err == 0) {
							swal("Eliminado!", "El modelo ha sido eliminado.", "success");
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
				swal("Cancelado", "El modelo está a salvo :)", "info");
			}
		});
		break;
		case 3:
		swal({
			title: "Esta segur@?",
			text: "Esta a punto de eliminar el Tag",
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
					type: "post", data: { "t": "dTag", "ideTag": ide },
					url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
						if (datos.err == 0) {
							swal("Eliminado!", "El tag ha sido eliminado.", "success");
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
				swal("Cancelado", "El tag está a salvo :)", "info");
			}
		});
		break;
	}
}
function guardar(){
	var tipo = $("#tipo").val();
	switch(tipo){
		case "1":
		if ($('#ide1').val().indexOf("-") >= 0){
			var marcaid = $('#ide1').val().split("-")[0];
			var marca = $('#ide1').val().split("-")[1]
		}else var marca = $('#ide1').val();
		$.ajax({
			type: "post",
			data: { "t": "gMar", "idMarca":marcaid, "nombMarca":marca},
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					swal("Exito", "Se ha guardado sin problemas.", "success");
					closeModal();
					var delayInMilliseconds = 1000;
					setTimeout(function () {
						refresh();
					}, delayInMilliseconds);
				}else { console.log("Error: " + datos.txerr); }
			},
		});
		break;
		case "2":
		var marca = $('#ide1').val().split("-")[0];
		var modelo = $('#ide2').val();
		var modeloid = 0;
		if (modelo.indexOf("-") >= 0){
			modeloid = $('#ide2').val().split("-")[0];
			modelo = $('#ide2').val().split("-")[1]
		}
		$.ajax({
			type: "post",
			data: { "t": "gMod", "idMod":modeloid, "nombMod":modelo, "idMar":marca },
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					swal("Exito", "Se ha guardado sin problemas.", "success");
					closeModal();
					var delayInMilliseconds = 1000;
					setTimeout(function () {
						refresh();
					}, delayInMilliseconds);
				}else { console.log("Error: " + datos.txerr); }
			},
		});
		break;
		case "3":
		if ($('#ide1').val().indexOf("-") >= 0){
			var tagid = $('#ide1').val().split("-")[0];
			var tag = $('#ide1').val().split("-")[1]
		}else var tag = $('#ide1').val();
		var importancia = $('#ide2').val();
		$.ajax({
			type: "post",
			data: { "t": "gTag", "idTag":tagid, "nombtag":tag, "importancia":importancia},
			url: "./macros.php",
			dataType: 'json',
			cache: false,
			success: function (datos, textStatus, jqXHR) {
				if(datos.err == 0){
					swal("Exito", "Se ha guardado sin problemas.", "success");
					closeModal(3);
					var delayInMilliseconds = 1000;
					setTimeout(function () {
						refresh();
					}, delayInMilliseconds);
				}else { swal("Error", datos.txerr, "error") }
			},
		});
		break;
	}
}
function nuevo(){
	$("#tipo").val("0");
	$("#tipo").show();
	$("#label1").html("");
	$("#label2").html("");
	openModal();
}

/* Auxiliares */
function refresh() {
	$('#tdynamic').DataTable().clear();
	mmt();
}
/* Modal */
function openModal(tipo) {
	switch (tipo){
		case 1:
		$("#tipo").val("1");
		$("#tipo").hide();
		$("#col2").hide();
		$("#ide1").val("");
		$("#tituloModal").html("Edición de marca");
		$("#mDynamic").modal('toggle');
		break;
		case 2:
		$("#tipo").val("2");
		$("#tipo").hide();
		$("#col2").show();
		$("#ide1").val("");
		$("#ide2").val("");
		$("#tituloModal").html("Edición de modelo");
		$("#mDynamic").modal('toggle');
		break;
		case 3:
		$("#tipo").val("3");
		$("#tipo").hide();
		$("#col2").show();
		$("#ide1").val("");
		$("#ide2").val("");
		$("#tituloModal").html("Edición de tag");
		$("#mDynamic").modal('toggle');
		break;
		default:
		$("#tipo").show();
		$("#col2").hide();
		$("#ide1").val("");
		$("#tituloModal").html("Nuevo/a");
		$("#mDynamic").modal('toggle');
		break;
	}

}
function closeModal() {
	cleanCampos();
	$('#mDynamic').modal('toggle');

}

/* Robadas */
function loadMarcas(modal) {
	var lMarcas = [];
	$.getJSON("macros.php?t=tMarcas", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lMarcas[i] = {
				id: data.brand[i].value,
				label: data.brand[i].value + "-" + data.brand[i].data,
				value: data.brand[i].value + "-" + data.brand[i].data
			};
		}
		if(modal == 1){
			$("#ide1").autocomplete({
				source: lMarcas,
				minLength: 2,
				delay: 100,
				autoFocus: true,
				autoselect: true,
				appendTo: "#mDynamic",
				select: function(a,b){
					$("#ide1").val("");
					var id = b.item.value.split("-")[0];
					loadModelo(id,"#mDynamic");
				}
			});
		}
		if(modal == 2){
			$("#ide1").autocomplete({
				source: lMarcas,
				minLength: 2,
				delay: 100,
				autoFocus: true,
				autoselect: true,
				appendTo: "#mDynamic",
				change: function(event,ui){
					if (ui.item==null)
					{
						var seSalva = 0;
						for(var j=0;j<lMarcas.length;j++){
							if(ui.item == lMarcas[j]){
								seSalva = 1;
							}
						}
						if(seSalva == 0){
							$("#modMarca").val('');
							$("#modMarca").focus();	
						}
					}
				},
				select: function(a,b){
					$("#ide2").val("");
					var id = b.item.value.split("-")[0];
					loadModelo(id,"#mDynamic");
				}
			});
		}
	});
	return lMarcas;
}
function loadModelo(idMarca,modal){
	$("#modelo").empty();
	var lModelo = [];
	$.getJSON("macros.php?t=tModelo&idMarca="+idMarca, function (data) {
		for (var i = 0; i < data.cant; i++) {
			lModelo[i]={
				id: data.modelos[i].value,
				label: data.modelos[i].value + "-" + data.modelos[i].data,
				value: data.modelos[i].value + "-" + data.modelos[i].data
			}
		}
		$("#ide2").autocomplete({
			source: lModelo,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: modal
		});
	});
	return lModelo;
}
function loadTags() {
	var lTags = [];
	$.getJSON("macros.php?t=tTags", function (data) {
		for (var i = 0; i < data.cant; i++) {
			lTags[i] = {
				id: data.tags[i].value,
				label: data.tags[i].value + "-" + data.tags[i].data,
				value: data.tags[i].value + "-" + data.tags[i].data,
				importancia: data.tags[i].importancia
			};
		}
		$("#ide1").autocomplete({
			source: lTags,
			minLength: 2,
			delay: 100,
			autoFocus: true,
			autoselect: true,
			appendTo: "#mDynamic",
			select: function(a,b){
				$("#ide2").val(b.item.importancia);
			}
		});

	});
	return lTags;
}