var prev = "";
$(document).ready(function (e) {
	console.log("Tienda.");
	init();
});
function init(){
	$('#searchbar-icon').click(function(){
    $('#searchbar-input').animate({width: 'toggle'});
    $("#searchbar-icon").toggle();
    $("#searchbar-cross").toggle(500);
  });
  
  $('#searchbar-cross').click(function(){
    $('#searchbar-input').animate({width: 'toggle'});
    $("#searchbar-cross").toggle();
    $("#searchbar-icon").toggle(500);
    $('#searchbar-input').val("");
    filtroTitulo($("#searchbar-input").val());
  });
	loadStore();
	loadFiltros();
}	

$("#searchbar-input").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".thumbnail .caption").filter(function() {
      $(this).parent('div').parent('div').toggle($(this).text().toLowerCase().indexOf(value) > -1)
	});
});

function loadFiltros(){
	$.ajax({
		type: "post", data: { "t": "tFiltros"},
		url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				var toolbox = $("#toolbox");
				var divcategorias = $("#divcat");
				for(var j=0; j<datos.cantCat; j++){
					var catCol = document.createElement("div"); 
					catCol.className="col-lg-3 col-md-3 col-sm-3";
					var formCheck = document.createElement("div"); 
					formCheck.className="form-check";
					var formCheckInput = document.createElement("input"); 
					formCheckInput.className="form-check-input";
					formCheckInput.setAttribute('type', "checkbox");
					formCheckInput.setAttribute('checked', "checked");
					formCheckInput.setAttribute('onclick', "filtroCat("+datos.categorias[j].idcategoria+")");
					formCheckInput.setAttribute('id', "cat"+datos.categorias[j].idcategoria);
					var formCheckLabel = document.createElement("label"); 
					formCheckLabel.className="form-check-label";
					formCheckLabel.setAttribute('for', "cat"+datos.categorias[j].idcategoria);
					formCheckLabel.innerHTML = datos.categorias[j].nombrecat;
					formCheck.append(formCheckInput);
					formCheck.append(formCheckLabel);
					catCol.append(formCheck);
					divcategorias.append(catCol);
				}
				var divmarcas = $("#divmar");
				for(var j=0; j<datos.cantBran; j++){
					var catCol = document.createElement("div"); 
					catCol.className="col-lg-3 col-md-3 col-sm-3";
					var formCheck = document.createElement("div"); 
					formCheck.className="form-check";
					var formCheckInput = document.createElement("input"); 
					formCheckInput.className="form-check-input";
					formCheckInput.setAttribute('type', "checkbox");
					formCheckInput.setAttribute('checked', "checked");
					formCheckInput.setAttribute('onclick', "filtroMar("+datos.marcas[j].idmarca+")");
					formCheckInput.setAttribute('id', "cat"+datos.marcas[j].idmarca);
					var formCheckLabel = document.createElement("label"); 
					formCheckLabel.className="form-check-label";
					formCheckLabel.setAttribute('for', "cat"+datos.marcas[j].idmarca);
					formCheckLabel.innerHTML = datos.marcas[j].nombremarca;
					formCheck.append(formCheckInput);
					formCheck.append(formCheckLabel);
					catCol.append(formCheck);
					divmarcas.append(catCol);
				}

				var tag_list = new Array();
				for(var j=0; j<datos.cantTags; j++){
					tag_list.push({
						identificador: datos.tags[j].idtag,
						text: datos.tags[j].nombtag,
						weight: datos.tags[j].weight,
						html: {style: 'display:cursor;', onclick:'filtroTag('+datos.tags[j].idtag+')', }
					});
				}
				$("#divtag").jQCloud(tag_list);
			}
		}
	});
}
function loadStore(){
	$('#tstore').DataTable();
	$.ajax({
		type: "post", data: { "t": "tStore"},
		url: "../ad/macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
			if (datos.err == 0) {
				loadView(datos);
			}else {console.log("Error: " + datos.txerr);}
		}
	});
}
function loadView(datos){
	$("#productos").empty();
	for(var k = 0; k<datos.cant; k++){
		var columna = document.createElement('div');
		columna.className="col-lg-3 col-md-3 col-sm-3";
		columna.style.boxShadow = "2px 2px 2px 2px";
		columna.style.margin = "2em 2em 2em 2em";
		var dumbnail = document.createElement('div');
		dumbnail.setAttribute('categoria', datos.productos[k].categoria_idcategoria);
		dumbnail.setAttribute('marca', datos.productos[k].modelo_marca_idmarca);
		dumbnail.setAttribute('modelo', datos.productos[k].modelo_idmodelo);
		dumbnail.setAttribute('tags', datos.productos[k].tags);
		dumbnail.setAttribute('tit', datos.productos[k].nombprod);
		dumbnail.className="thumbnail";
		var img = document.createElement('img');
		img.className = "img-responsive";
		img.src = "../cli/img/productos/" + datos.productos[k].pathimagen.split(',')[0] + "";
		var caption = document.createElement('div');
		caption.className = "caption";
		var titulo = document.createElement('h4');
		titulo.className = "pull-left";
		titulo.innerHTML = datos.productos[k].nombprod;
		var precio = document.createElement('h4');
		precio.className = "pull-right";
		precio.innerHTML = "$"+datos.productos[k].preciocto;
		var obs = document.createElement('p');
		obs.innerHTML = datos.productos[k].obsprod;
		var space = document.createElement('div');
		space.className = "space-ten";
		caption.append(titulo);
		caption.append(precio);
		caption.append(obs);
		var row = document.createElement('div');
		row.className = 'row';
		var col10 = document.createElement('div');
		col10.className = 'col-sm-12';
		var label1 = document.createElement('label');
		label1.className = 'badge badge-light';
		label1.setAttribute('style', "font-size: 100%;");
		label1.setAttribute('for', "stockmin"+datos.productos[k].idproducto+"");
		label1.innerHTML = "Stock Minimo"
		var inputg = document.createElement('div');
		inputg.className = 'input-group';
		var prepetend = document.createElement('div');
		prepetend.className = 'input-group-prepend';
		var addon = document.createElement('span')
		addon.className = 'input-group-text';
		var fa = document.createElement('i');
		fa.className = 'fas fa-thermometer-quarter';
		var stockmin = document.createElement('input');
		stockmin.setAttribute('type', "number");
		stockmin.setAttribute('id', "stockmin"+datos.productos[k].idproducto+"");
		stockmin.setAttribute('min', "0");
		stockmin.setAttribute('placeholder', "Stock minimo");
		stockmin.setAttribute('name', "stockmin");
		stockmin.className = 'form-control';
		stockmin.value = 0;
		addon.append(fa);
		prepetend.append(addon);
		inputg.append(prepetend);
		inputg.append(stockmin);
		col10.append(label1);
		col10.append(inputg);
		row.append(col10);
		var row2 = document.createElement('div');
		row2.className = 'row';
		var col102 = document.createElement('div');
		col102.className = 'col-sm-12';
		var label2 = document.createElement('label');
		label2.className = 'badge badge-light';
		label2.setAttribute('for', "stockmin"+datos.productos[k].idproducto+"");
		label2.setAttribute('style', "font-size: 100%;");
		label2.innerHTML = " Cantidad deseada"
		var inputg2 = document.createElement('div');
		inputg2.className = 'input-group';
		var prepetend2 = document.createElement('div');
		prepetend2.className = 'input-group-prepend';
		var addon2 = document.createElement('span');
		addon2.className = 'input-group-text';
		var fa2 = document.createElement('i');
		fa2.className = 'fas fa-thermometer-three-quarters';
		var cant = document.createElement('input');
		cant.setAttribute('type', "number");
		cant.setAttribute('id', "cant"+datos.productos[k].idproducto+"");
		cant.setAttribute('min', "0");
		cant.setAttribute('placeholder', "Cantidad deseada");
		cant.setAttribute('name', "cant");
		cant.value = 0;
		cant.className = 'form-control';
		addon2.append(fa2);
		prepetend2.append(addon2);
		inputg2.append(prepetend2);
		inputg2.append(cant);
		col102.append(label2);
		col102.append(inputg2);
		row2.append(col102);
		var space2 = document.createElement('div');
		space2.className = "space-ten";
		var btng = document.createElement('div');
		btng.className = "btn-ground text-center";
		var btnok = document.createElement('button');
		btnok.className = "btn btn-success btn-carro";
		btnok.setAttribute('type', "button");
		btnok.setAttribute('onclick', "carrito("+datos.productos[k].idproducto+");");
		btnok.innerHTML = "Agregar al carrito";
		var fa3 = document.createElement('i');
		fa3.className = 'fa fa-shopping-cart';
		var space3 = document.createElement('div');
		space3.className = "space-ten";
		btnok.append(fa3);
		btng.append(btnok);
		dumbnail.append(img);
		dumbnail.append(caption);
		dumbnail.append(space);
		dumbnail.append(row);
		dumbnail.append(row2);
		dumbnail.append(space2);
		dumbnail.append(btng);
		dumbnail.append(space3);
		columna.append(dumbnail);
		$("#productos").append(columna);
	}
}

function filtroTag(id){
	var idetag = ''+id;
	$('.thumbnail', $('#productos')).each(function () {
		var arr = $(this).attr('tags').split(",");

		if(jQuery.inArray(idetag, arr) !== -1){
			console.log("lo encontre");
			$(this).parent('div').toggle();
		}
	});
}
function filtroCat(id){
	var idecat = id;
	$('.thumbnail', $('#productos')).each(function () {
		if($(this).attr('categoria') == id){
			$(this).parent('div').toggle();
		}
	});
}
function filtroMar(id){
	var idecat = id;
	$('.thumbnail', $('#productos')).each(function () {
		if($(this).attr('marca') == id){
			$(this).parent('div').toggle();
		}
	});
}
function enviarPedido(){
	$('.btn-carro').each(function () {
		$(this).trigger("onclick");
	});
}
function carrito(producto){
	var ideProd = producto;
	var cant = $("#cant"+producto).val();
	var minstock = $("#stockmin"+producto).val();
	$.ajax({
		type: "post", 
		data: { 
			"t": "gCarrito",
			"idprod":ideProd,
			"cant": cant,
			"minstock": minstock
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

