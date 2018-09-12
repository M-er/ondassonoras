$(document).ready(function() {
	init();
});
function init(){
	console.log("Inicializando pagina.");
	checkSession();
	dash();
}
function dash(){
	$("#main").empty();
	$(".active").removeClass("active");
	$("#dash").addClass("active");
	console.log("Cargando dashboard");
	loading();
	$("#main").load("dashboard.html");	
}
function usuarios(){
	$(".active").removeClass("active");
	$("#user").addClass("active");
	$("#main").empty();
	console.log("Cargando Usuarios");
	loading();
	$("#main").load("usuarios.html");	
}
function reportes(){
	$(".active").removeClass("active");
	$("#repo").addClass("active");
	$("#main").empty();
	console.log("Cargando Reportes");
	loading();
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
/* * * * * * mmt * * * * * */
function mmt(){
	$(".active").removeClass("active");
	$("#mmt").addClass("active");
	$("#main").empty();
	console.log("Cargando MMT");
	loading();
	$("#main").load("mmt.html");	
}
/* Auxiliares */
function loading() {
	$("#main").empty();
	$("#main").append("<div class='loader'></div>").delay(1000);
	console.log("Time out exipred");
}