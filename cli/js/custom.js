$(document).ready(function() {
	init();
});
function init(){
	console.log("Inicializando pagina.");
	checkSessionC();
	dashboard();
}
/* * * * * * Tablero * * * * * */
function dashboard(){
	$(".active").removeClass("active");
	$("#dash").addClass("active");
	$("#main").empty();
	console.log("Cargando Dashboard");
	loading();
	$("#main").load("dashboard.html");		
}
/* * * * * * Inventario * * * * * */
function inventario(){
	$(".active").removeClass("active");
	$("#inven").addClass("active");
	$("#main").empty();
	console.log("Cargando inventario");
	loading();
	$("#main").load("inventario.html");		
}
/* * * * * * Sales * * * * * */
function sales(){
	$(".active").removeClass("active");
	$("#sales").addClass("active");
	$("#main").empty();
	console.log("Cargando Ventas");
	loading();
	$("#main").load("ventas.html");		
}
/* * * * * * Carrito * * * * * */
function cart(){
	$(".active").removeClass("active");
	$("#cart").addClass("active");
	$("#main").empty();
	console.log("Cargando Carrito");
	loading();
	$("#main").load("carrito.html");		
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
/* Auxiliares */
function loading() {
	$("#main").empty();
	$("#main").append("<div class='loader'></div>").delay(1000);
	console.log("Time out exipred");
}
function checkSessionC(){
	$.ajax({
		type:"post", data:{"t":"checkuserCli"},
		url:"../ad/macros.php", dataType:'json',cache:false, success:function(datos,textStatus,jqXHR){
			if (datos.err != 0){
				swal("Error", datos.txerr, "error");
				setTimeout(function() {
					window.location.assign(datos.iraPagina);
				}, 1000);
			}else{
				$("#indexTit").html('<i class="fas fa-users"></i> '+datos.usuario);
			}
		},
        error:function(jqXHR, textStatus, errorThrown) { //Muestra l error en consola
        	console.log(textStatus, errorThrown);}
        });
}