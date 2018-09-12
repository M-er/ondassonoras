$(document).keyup(function (e) {
	if (e.keyCode == 27) { 
		if ($('#mUser').hasClass('show')) {closeModal(); } 
	}
});

$(document).ready(function (e) {
	console.log("Usuarios.");
	init();
});
function init(){
	loadTablaUsuarios();
}
function openModal() {
	$('#mUser').modal('toggle');
}
function closeModal() {
	cleanCampos();
	$('#mUser').modal().hide();
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	var delayInMilliseconds = 1000;
	setTimeout(function () {
		$modalStack.clearFocusListCache();
	}, delayInMilliseconds);
}
function cleanCampos(modal) {
	$("#userNombre").val("");
	$("#userPass1").val("");
	$("#userPass2").val("");
	$("#userEmail").val("");
	$("#zona").val("");
	$("#userHabilitado").val("1");
	$("#lista").val("1");
	$("#iduser").val("");
	$("#userTit").val("");

}
$("#userPass1").change(function(event) {
	if($("#userPass1").val().length < 6){
		$("#pWarning").show();
		$("#userPass1").removeClass('has-success');
		$("#userPass1").addClass('has-error');
		$("#picon").addClass('fa-exclamation-circle rojo');
		$("#picon").removeClass('fa-check-circle verde');
	}else{
		$("#pWarning").hide();
		$("#userPass1").removeClass('has-error');
		$("#userPass1").addClass('has-success');
		$("#picon").removeClass('fa-exclamation-circle rojo');
		$("#picon").addClass('fa-check-circle verde');
	}
});
$("#userPass2").change(function(event) {
	if($("#userPass2").val() != $("#userPass1").val()){
		$("#cWarning").show();
		$("#userPass2").removeClass('has-success');
		$("#userPass2").addClass('has-error');
		$("#cicon").addClass('fa-exclamation-circle rojo');
		$("#cicon").removeClass('fa-check-circle verde');
	}else{
		$("#cWarning").hide();
		$("#userPass2").removeClass('has-error');
		$("#userPass2").addClass('has-success');
		$("#cicon").removeClass('fa-exclamation-circle rojo');
		$("#cicon").addClass('fa-check-circle verde');
	}
});
$("#userEmail").change(function(event) {
	if( !(validateEmail($("#userEmail").val())) ){
		$("#eWarning").show();
		$("#userEmail").removeClass('has-success');
		$("#userEmail").addClass('has-error');
		$("#eicon").removeClass('fa-check-circle verde');
		$("#eicon").addClass('fa-exclamation-circle rojo');
	}else{
		$("#eWarning").hide();
		$("#userEmail").removeClass('has-error');
		$("#userEmail").addClass('has-success');
		$("#eicon").removeClass('fa-exclamation-circle danger');
		$("#eicon").addClass('fa-check-circle verde');
	}
});
function refreshUser() {
	$('#tusuarios').DataTable().clear();
	usuarios();
}
function nuevoUsuario(){
	$("#userTit").val("Creacion de nuevo usuario");
	openModal();
}
function editUser(ide){
	$("#userTit").val("Edición de usuario "+ide);
	$("#iduser").val(ide);
	$.ajax({
		type: "post", data: { "t": "tUser", "ide": ide },
		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				$("#userNombre").val(datos.usuarios[0].nombuser);
				$("#userEmail").val(datos.usuarios[0].emailuser);
				$("#userHabilitado").val(datos.usuarios[0].habilitadouser);
				$("#zona").val(datos.usuarios[0].zona);
				$("#lista").val(datos.usuarios[0].listaprec);
				openModal();	
			}
			else {
				console.log("Error: " + datos.txerr);
			}
		}
	});
}
function deleteUsuario(ide){
	var id = ide;
	swal({
		title: "Esta segur@?",
		text: "Esta a punto de eliminar el usuario",
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
				type: "post", data: { "t": "dUser", "ideUser": id },
				url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
					if (datos.err == 0) {
						swal("Eliminado!", "El usuario ha sido eliminado.", "success");
						var delayInMilliseconds = 1000;
						setTimeout(function () {
							refreshUser();
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
			swal("Cancelado", "El usuario está a salvo :)", "info");
		}
	});

}
function loadTablaUsuarios(){
	$('#tusuarios').DataTable();
	$.ajax({
		type: "post",
		data: { "t": "tUser" },
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var habilitado = "";
				var tus = $('#tusuarios').DataTable();
				for (var x = 0; x < datos.cant; x++){
					if(datos.usuarios[x].habilitadouser == 1){habilitado = "Si";}
					else{if(datos.usuarios[x].habilitadouser == 0){habilitado = "No";}}
					tus.row.add(["#"+datos.usuarios[x].idusuario, datos.usuarios[x].nombuser, datos.usuarios[x].contuser , datos.usuarios[x].emailuser , datos.usuarios[x].zona, habilitado, "#"+datos.usuarios[x].listaprec,"<a style='color:#000;' onclick='editUser(" + datos.usuarios[x].idusuario + ")' href='#'><i class='fas fa-2x fa-pencil-alt' aria-hidden='true'></i></a>  <a style='color:#000;' onclick='deleteUsuario(" + datos.usuarios[x].idusuario + ")' href='#'><i class='fas fa-2x fa-trash-alt' aria-hidden='true'></i></a>",]).draw(false);
				} 
			} else { console.log("Error: " + datos.txerr); }
		},
	});
}
function guardarUsuario(){
	var ide = 0;
	var ok = 0;
	var hayPsw = 0;
	var psw1 = $("#userPass1").val();
	var psw2 = $("#userPass2").val();
	var email = $("#userEmail").val();
	var zona = $("#zona").val();
	var nombre = $("#userNombre").val();
	var habilitado = $("#userHabilitado").val();
	var lista = $("#lista").val();

	if($("#iduser").val()){
		ide = $("#iduser").val();
	}
	
	if(!ide){
		if(validatePass(psw1,psw2)&&validateEmail(email)){
			hayPsw = 1;
			ok = 1;
		}else{swal("No valido!", "Por favor revise los campos", "info");}
	}
	if(ide){
		if (psw1){
			if(validatePass(psw1,psw2) && validateEmail(email)){
				ok = 1;
				hayPsw = 1;
			}else{
				swal("No valida!", "Por favor revise los campos", "info");
			}
		}else{
			if(validateEmail(email)){
				hayPsw = 0;
				ok = 1;
			}else{
				swal("No valido!", "Por favor revise el campo de email", "info");
			}
		}
	}if(ok){
		if(hayPsw){
			$.ajax({
				type: "post",
				data: { "t": "gUser", "idUser":ide, "nombre":nombre, "pass":psw1, "zona":zona, "habilitado":habilitado, "email":email, "lista":lista},
				url: "./macros.php",
				dataType: 'json',
				cache: false,
				success: function (datos, textStatus, jqXHR) {
					if(datos.err == 0){
						swal("Exito", "Se ha guardado sin problemas.", "success");
						closeModal();
						var delayInMilliseconds = 1000;
						setTimeout(function () {
							refreshUser();
						}, delayInMilliseconds);
					}else { console.log("Error: " + datos.txerr); }
				},
			});
		}else{
			$.ajax({
				type: "post",
				data: { "t": "gUser", "idUser":ide, "nombre":nombre, "habilitado":habilitado, "zona":zona, "email":email, "lista":lista},
				url: "./macros.php",
				dataType: 'json',
				cache: false,
				success: function (datos, textStatus, jqXHR) {
					if(datos.err == 0){
						swal("Exito", "Se ha guardado sin problemas.", "success");
						closeModal();
						var delayInMilliseconds = 1000;
						setTimeout(function () {
							refreshUser();
						}, delayInMilliseconds);
					}else { console.log("Error: " + datos.txerr); }
				},
			});
			
		}
	}
}
function validateEmail(email) 
{
	var re =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function validatePass(psw1,psw2){
	console.log("Mira: "+psw1);
	console.log("Mira: "+psw2);
	if( (psw1) && (psw2) ){console.log("Hay psw1 psw2");}
	if( (psw1.length >= 6) ){console.log("Ok pass mayor que 6");}
	if((psw1 == psw2)){console.log("Son iguales ");}
	return((psw1) && (psw2) && (psw1.length >= 6) && (psw1 == psw2))
}