
$(document).ready(function (e) {
	traeProds();
	
});

function traeProds() {
	console.log("Inicializando - Cargando datos en tabla");
	$('#tproductos').DataTable();
	$.ajax({
		type: "post",
		data: {
			"t": "tPedido"
		},
		url: "./macros.php",
		dataType: 'json',
		cache: false,
		success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				if (datos.cant) {
					var acomprar = 0;
					var amin = 0;
					for(var j=0; j<datos.cant; j++){
						var fila = document.createElement("tr");
						var name = document.createElement("td");
						name.innerHTML = datos.productos[j].nombprod;
						var cant = document.createElement("td");
						cant.innerHTML = datos.productos[j].cantstock;
						var min = document.createElement("td");
						var imin = document.createElement("input");
						amin = datos.productos[j].minstock;
						var vendido = document.createElement("td");
						vendido.innerHTML = datos.productos[j].vendido;
						var compra = document.createElement("td");
						var icompra = document.createElement("input");
						acomprar = ((datos.productos[j].minstock - datos.productos[j].cantstock)>=0)?(datos.productos[j].minstock - datos.productos[j].cantstock):0;
						imin.value = amin;
						icompra.value = acomprar;
						icompra.className = "icompra form-control"
						imin.className = "imin form-control"
						icompra.setAttribute("type","number");
						imin.setAttribute("type","number");
						icompra.setAttribute("min","0");
						imin.setAttribute("min","0");
						icompra.setAttribute("placeholder","Cantidad a comprar");
						imin.setAttribute("placeholder","Cantidad minima deseada");
						fila.setAttribute("id",datos.productos[j].id);
						fila.setAttribute("nombre",datos.productos[j].nombprod);
						fila.setAttribute("cant",datos.productos[j].cantstock);
						fila.setAttribute("min",datos.productos[j].minstock);
						fila.setAttribute("vendido",datos.productos[j].vendido);
						compra.append(icompra);
						min.append(imin);
						fila.append(name);
						fila.append(cant);
						fila.append(min);
						fila.append(vendido);
						fila.append(vendido);
						fila.append(compra);
						$("#listProd").append(fila);
					}
					console.dir(datos.productos);
				}else{
					console.log("No hay productos cargados.");
				}
			} else {
				console.log("Error: " + datos.txerr);
			}
		},

	});
}

function refresh() {
	pedido();
}
/*




*/
function armarPedido(){
	var d = new Date();
	var id = 0;
	var hoy = d.getDate();
	var compra = 0;
	var min = 0;
	var prod = 0;
	var j = 0;
	$("#iFecha").val("Fecha: "+hoy);
	$('#listProd > tr').each(function() {
		$(this).closest('tr').find('input.icompra').each(function(){
			compra = $(this).val();							
		});
		$(this).closest('tr').find('input.imin').each(function(){
			min = $(this).val();							
		});
		prod = $(this).attr('id');
		$.ajax({type: "post",data: {"t": "uMin","prod": prod,"min": min},url: "./macros.php",dataType: 'json',cache: false,success: function (datos, textStatus, jqXHR) {console.log("Minimo actualizado.")}});
		var iFila = document.createElement("tr");
		if(j%2){
			iFila.style.backgroundColor = 'rgba(0,0,0,.05)';
		}
		var iCampoN = document.createElement("td");
		var iCampoS = document.createElement("td");
		var iCampoM = document.createElement("td");
		var iCampoV = document.createElement("td");
		var iCampoC = document.createElement("td");
		iCampoC.style.background= " none";
		iCampoC.style.border= " none";
		iCampoC.style.cursor= " pointer";
		iCampoC.style.lineHeight= " 1.5";
		iCampoC.style.textAlign= "center";
		iCampoC.style.font= " 700 1.0rem 'Roboto Slab', sans-serif";
		iCampoC.style.letterSpacing= " 0.05rem";
		iCampoC.style.outline= " 2px dashed #000";
		iCampoN.innerHTML = $(this).attr('nombre');
		iCampoS.innerHTML = $(this).attr('cant');
		iCampoM.innerHTML = min;
		iCampoV.innerHTML = $(this).attr('vendido');
		iCampoC.innerHTML = compra;
		iFila.append(iCampoN);
		iFila.append(iCampoS);
		iFila.append(iCampoM);
		iFila.append(iCampoV);
		iFila.append(iCampoC);
		$("#iLista").append(iFila);
		j++;
	});
	//$("#aImprimir").css("visibility", "");
	print();

}
function print(){
	var mywindow = window.open('', 'PRINT', 'height=400,width=600');
	mywindow.document.write('<html>'+$("#aImprimir").html()+'</html>');
	mywindow.document.close(); 
	mywindow.focus(); 
	mywindow.print();
	mywindow.close();
	return true;
}
/*

	
    */