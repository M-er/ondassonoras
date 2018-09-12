$("#password").keyup(function(event) {
	if (event.keyCode === 13) {
		doLogin();
	}
});
function doLogin() {
    //grecaptcha.execute();
    $.ajax({
      type: "post",
      data: {
       "u": $('#username').val(),
       "p": $('#password').val(),
       "t": "login"
   },
   url: "./ad/macros.php",
   dataType: 'json',
   cache: false,
        success: function(datos, textStatus, jqXHR) { //console.log(datos);
        	if (datos.err == 0) {
        		//swal("Has ingresado correctamente!", "Seras redirigido al sitio de adminstracion.", "success");
        		setTimeout(function() {
        			window.location.assign(datos.iraPagina);
        		}, 500);
        	} else {
        		swal("Error", datos.txerr, "error");
            }
        },

    });
}
function doLogout(){
	$.ajax({
		type: "post",
		data: {
			"t": "lo"
		},
		url: "./ad/macros.php",
		dataType: 'json',
		cache: false,
        success: function(datos, textStatus, jqXHR) { //console.log(datos);
        	if (datos.err == 0) {
        		swal("Adios!", "Que tenga un buen dia.", "success");
        		setTimeout(function() {
        			window.location.assign(datos.iraPagina);
        		}, 3000);
        	} else {
        		swal("Error", datos.txerr, "error");

        	}
        },

    });
}
function checkSession(){
    $.ajax({
        type:"post", data:{"t":"checkuser"},
        url:"./ad/macros.php", dataType:'json',cache:false, success:function(datos,textStatus,jqXHR){
            if (datos.err != 0){
                swal("Error", datos.txerr, "error");
                setTimeout(function() {
                    window.location.assign(datos.iraPagina);
                }, 1000);
            }
        },
        error:function(jqXHR, textStatus, errorThrown) { //Muestra l error en consola
            console.log(textStatus, errorThrown);}
        });
}
function infoUser(){
    $.ajax({
        type: "post",
        data: {
            "t": "user"
        },
        url: "./ad/macros.php",
        dataType: 'json',
        cache: false,
        success: function(datos, textStatus, jqXHR) {
            if (datos.err == 0) {
                var nombre = document.getElementById("nombre");
                var email = document.getElementById("email");
                console.log("Datos de usuario recuperados. ");              
                console.log("Nombre: ", datos.nombre);              
                console.log("Email: ", datos.email);
                $('#nombre').val(datos.nombre);             
                $('#email').val(datos.email);                           
                $('#path').attr('src', "./dist/img/sparrow.jpg");
            } else {
                swal("Error", datos.txerr, "error");
            }
        },
    });
}