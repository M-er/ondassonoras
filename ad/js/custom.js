$(document).ready(function() {
	dropdown();
	init();
});
function init(){
	console.log("Inicializando pagina.");
	checkSession();
	checkCarrito();
	reportes();
}
/* * * * * * Ventas * * * * * */
function ventas(quien){
	$("#main").empty();
	$(".active").removeClass("active");
	console.log("Cargando Ventas");
	loading();
	if(quien){
		$("#ventas").addClass("active");
		$("#main").load("ventas.html");	
	}
	else {		
		$("#ventasos").addClass("active");
		$("#main").load("ventasos.html");	

	}
}

/* * * * * * Pedidos * * * * * */
function pedido(){
	$(".active").removeClass("active");
	$("#user").addClass("active");
	$("#main").empty();
	console.log("Cargando Pedidos");
	loading();
	$("#main").load("pedidos.html");	
}
/* * * * * * Usuarios * * * * * */
function usuarios(){
	$(".active").removeClass("active");
	$("#user").addClass("active");
	$("#main").empty();
	console.log("Cargando Usuarios");
	loading();
	$("#main").load("usuarios.html");	
}
/* * * * * * Reportes * * * * * */
function reportes(){
	$(".active").removeClass("active");
	$("#repo").addClass("active");
	$("#main").empty();
	console.log("Cargando Reportes");
	loading();
	$("#main").load("reportes.html");	
}
/* * * * * * Carritos * * * * * */
function carritos(){
	$(".active").removeClass("active");
	$("#carr").addClass("active");
	$("#main").empty();
	console.log("Cargando Carritos");
	loading();
	$("#main").load("carritos.html");	
}
/* * * * * * Store * * * * * */
function store(){
	$(".active").removeClass("active");
	$("#store").addClass("active");
	$("#main").empty();
	console.log("Cargando Store");
	loading();
	$("#main").load("tienda.html");		
}
/* * * * * * Precios * * * * * */
function precios(){
	$(".active").removeClass("active");
	$("#precios").addClass("active");
	$("#main").empty();
	console.log("Cargando Precios");
	loading();
	$("#main").load("precios.html");		
}
/* * * * * * Proveedores * * * * * */
function proveedores(){
	$(".active").removeClass("active");
	$("#prove").addClass("active");
	$("#main").empty();
	console.log("Cargando Proveedores");
	loading();
	$("#main").load("proveedores.html");		
}
/* * * * * * PRODUCTOS * * * * * */
function productos(){
	$(".active").removeClass("active");
	$("#prod").addClass("active");
	$("#main").empty();
	console.log("Cargando Productos");
	loading();
	$("#main").load("productos.html");		
}
/* * * * * * MMT * * * * * */
function mmt(){
	$(".active").removeClass("active");
	$("#mmt").addClass("active");
	$("#main").empty();
	console.log("Cargando MMT");
	loading();
	$("#main").load("mmt.html");	
}
/* * * * * * Libro * * * * * */
function libro(){
	$(".active").removeClass("active");
	$("#book").addClass("active");
	$("#main").empty();
	console.log("Cargando Libro");
	loading();
	$("#main").load("libro.html");	
}
/* Auxiliares */
function loading() {
	$("#main").empty();
	$("#main").append("<div class='loader'></div>").delay(1000);
}

function checkSession(){
	$.ajax({
		type:"post", data:{"t":"checkuser"},
		url:"./macros.php", dataType:'json',cache:false, success:function(datos,textStatus,jqXHR){
			if (datos.err != 0){
				swal("Error", datos.txerr, "error");
				setTimeout(function() {
					window.location.assign(datos.iraPagina);
				}, 1000);
			}else{
				$("#indexTit").html('<i class="fas fa-user-plus"></i> '+datos.usuario);
			}
		},
        error:function(jqXHR, textStatus, errorThrown) { //Muestra l error en consola
        	console.log(textStatus, errorThrown);}
        });
}
function checkCarrito(){
	$.ajax({
		type:"post", data:{"t":"checkcarr"},
		url:"../ad/macros.php", dataType:'json',cache:false, success:function(datos,textStatus,jqXHR){
			if (datos.err == 0){
				$(".alert").hide();
				console.log("no hay carritos");
			}else{
				console.log("hay carritos");
				$("#titNotificacion").html("<strong>Hay carritos para ver!</strong>");
				window.setTimeout(function() {
					$(".alert").fadeTo(500, 0).slideUp(500, function(){
						$(this).remove(); 
					});
				}, 2500);
			}
		},
		error:function(jqXHR, textStatus, errorThrown) { 
			console.log(textStatus, errorThrown);}
		});
}

function dropdown(){
	//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
	var dropdown = document.getElementsByClassName("dropdown-btn");
	var i;

	for (i = 0; i < dropdown.length; i++) {
		dropdown[i].addEventListener("click", function() {
			this.classList.toggle("active");
			var dropdownContent = this.nextElementSibling;
			if (dropdownContent.style.display === "block") {
				dropdownContent.style.display = "none";
			} else {
				dropdownContent.style.display = "block";
			}
		});
	}
}