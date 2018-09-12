
application/x-httpd-php macros.php ( PHP script, UTF-8 Unicode text, with very long lines )
<?php
header("Expires:Fri, Jun 12 1981 08:20:00 GMT");
header("Pragma:no-cache");
header("Cache-Control:no-cache");
header('Content-Type: application/json; charset=UTF-8');
require_once("./connect.php");
session_start();
$tarea=$_REQUEST['t'];
$respuesta=array('err'=>0,'txerr'=>'');
switch($tarea) {
	case 'lo':
	unset($_SESSION['iduser']);
	unset($_SESSION['usuario']);
	unset($_SESSION['hayusuario']);
	unset($_SESSION['tipouser']);
	$respuesta['err']=0;
	$respuesta['txerr']="Log Out";
	$respuesta['iraPagina']='../index.html';
	break;
	case 'login':
	$args=array('u'=>FILTER_SANITIZE_STRING,'p'=>FILTER_SANITIZE_STRING);
	$po=filter_input_array(INPUT_POST,$args);
	$usuario=mysqli_real_escape_string($db,$po['u']);
	$contra=mysqli_real_escape_string($db,$po['p']);
	$contra = md5($contra);
	$res= $db->query("SELECT idusuario FROM usuario WHERE nombuser='$usuario' AND contuser='$contra' ;");
	$filas = $res->num_rows;
	$elId = $res->fetch_assoc();
	if ($filas==1) {
		$_SESSION['iduser']=$elId['idusuario'];
		$_SESSION['usuario']=$usuario;
		$_SESSION['hayusuario']=1;
		$_SESSION['tipouser']=$elId['idusuario'];
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Error de autenticacion";
	}
	break;
	case 'checkuser':
	if($_SESSION['hayusuario']==1){
		$usuario=$_SESSION['usuario'];
		$res = $db->query("SELECT * FROM usuario WHERE nombuser='$usuario';");
		$filas = $res->num_rows;
		if($filas==1){
			$respuesta['err']=0;
			$respuesta['txerr']='';
			$respuesta['iduser']=$_SESSION['iduser'];
			$respuesta['usuario']=$_SESSION['usuario'];
		}
	}
	else
	{
		unset($_SESSION['iduser']);
		unset($_SESSION['usuario']);
		unset($_SESSION['hayusuario']);
		unset($_SESSION['tipouser']);
		$respuesta['err']=1;
		$respuesta['txerr']="No esta logueado";
		$respuesta['iraPagina']='../index.html';
	}
	break;
	case 'checkcarr':
	if($_SESSION['hayusuario']==1){
		$iduser = $_SESSION['iduser'];
		$res = $db->query("DELETE FROM carrito WHERE usuario_idusuario = '$iduser' and listo = 0 and vigencia < now();");
		$respuesta['err']=0;
		$respuesta['txerr']='';
	}
	break;
	case 'user':
	$usuario = $_SESSION['usuario'];
	$res = $db->query("SELECT * FROM usuario WHERE nombuser='$usuario';");
	$usuario = $res->fetch_assoc();
	$filas = $res->num_rows;
	if($filas==1){
		$respuesta['err']=0;
		$respuesta['txerr']='';
		$respuesta['nombre']=$usuario['nombuser'];
		$respuesta['email']=$usuario['emailuser'];
		$respuesta['path']=$usuario['path'];
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al obtener usuario";
	}
	break;
	if (isset($_POST["ide"]) && !empty($_POST["ide"])){
		$id = $_POST["ide"]*1;
		$prods = $db->query("SELECT idproducto, nombprod, obsprod, cantprod, ubicacion, proveedor_idproveedor, idcategoria, nombrecat, idcodigo, codigo, precio1, idmodelo, nombremodelo,idmarca, nombremarca, idproveedor, nombproveedor, GROUP_CONCAT(DISTINCT tag.idtag,'-', tag.nombtag ORDER BY tag.idtag ASC SEPARATOR ',') as 'tags',  GROUP_CONCAT(DISTINCT imagen.pathimagen ORDER BY imagen.pathimagen ASC SEPARATOR ',') as 'pathimagen' FROM 
			producto 
			left join imgxprod on producto_idproducto = idproducto 
			left join imagen on imagen_idimagen = idimagen 
			left join categoria on categoria_idcategoria = idcategoria 
			left join proveedor on proveedor_idproveedor = idproveedor 
			left join codigo on codigo_idcodigo = idcodigo 
			left join precio on idproducto = precio.producto_idproducto 
			left join marca on modelo_marca_idmarca = idmarca 
			left join tagxprod on tagxprod.producto_idproducto = idproducto
			left join tag on tag_idtag = idtag 
			left join modelo on modelo_idmodelo = idmodelo WHERE idproducto = '$id' group by idproducto");
	}else{
		$prods=$db->query("SELECT idproducto, nombprod, obsprod, cantprod, pathimagen, ubicacion, proveedor_idproveedor, nombrecat, codigo, precio1, nombremodelo, nombremarca, nombproveedor FROM producto 
			left join imgxprod on producto_idproducto = idproducto 
			left join imagen on imagen_idimagen = idimagen 
			left join categoria on categoria_idcategoria = idcategoria 
			left join proveedor on proveedor_idproveedor = idproveedor 
			left join codigo on codigo_idcodigo = idcodigo 
			left join precio on idproducto = precio.producto_idproducto 
			left join marca on modelo_marca_idmarca = idmarca 
			left join modelo on modelo_idmodelo = idmodelo WHERE 1 group by idproducto");
	}
	$cantProds = $prods->num_rows;
	if($prods){
		$aProds = array();
		while( $xx=$prods->fetch_assoc() ) $aProds[]=$xx;
		$respuesta['productos']=$aProds;
		$respuesta['cant']=$cantProds;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="No hay productos para mostrar";
	}
	break;
	case 'dImg':
	$ideImg = $_POST['ideImg']*1;
	$exist = $db->query("SELECT EXISTS(SELECT pathimagen FROM imagen WHERE idimagen = '$ideImg')");
	$exist = $exist->fetch_array(MYSQLI_NUM);
	$exist =  $exist[0];
	if($exist){
		$pathImg = $db->query("SELECT pathimagen FROM imagen WHERE idimagen = '$ideImg'");
		$pathImg = $pathImg->fetch_row();
		$pathImg=trim($pathImg[0]);      
		$elimino = unlink("./img/productos/".$pathImg);
		if($elimino){
			$delImgxProd = $db->query("DELETE FROM imgxprod WHERE imagen_idimagen = '$ideImg';");
			$delImg = $db->query("DELETE FROM imagen WHERE idimagen = '$ideImg';");
			if($delImgxProd && $delImg){
				$respuesta['err']=0;
				$respuesta['txerr']="";
			}else{
				$respuesta['err']=1;
				$respuesta['txerr']="Error al querer eliminar la imagen de la bd";
			}

		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No se pudo eliminar la imagen";
		}
	}else{
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	break;
	case 'dProd':
	if(isset($_SESSION['iduser'])){
		$userID=$_SESSION['iduser'];
		$ide = $_POST['ide']*1;
		Logear("Usuario: #".$userID." - Eliminar producto: #".$ide);
		$categoria = $db->query("SELECT nombproveedor from proveedor left join producto on idproveedor = proveedor_idproveedor WHERE idproducto = '$ide';");
		$fila = $categoria->fetch_Row();
		$categoria = trim($fila[0]);
		$files = glob("./img/productos/".$categoria."/".$ide."/*"); 
		foreach($files as $file){ 
			if(is_file($file)){
				$ideImg = explode("/", $file);
				$ideImg = $ideImg[5];
				$ideImg = explode(".", $ideImg);
				$ideImg = $ideImg[0];
				$imgxprod = $db->query("DELETE FROM imgxprod WHERE producto_idproducto = '$ide';");
				$img = $db->query("DELETE FROM imagen WHERE idimagen = '$ideImg';");
				unlink($file); 
			}
		}
		$elimino = rmdir("./img/productos/".$categoria."/".$ide);
		if(!$elimino){
			Logear("No se pudieron eliminar algunas imagenes fisicas");
		}
		$limpieza = limpio($db,$ide,$hayean);
		$hayventas = $db->query("SELECT EXISTS(SELECT idventa FROM venta WHERE producto_idproducto = '$ide')");
		$hayventas = $hayventas->fetch_array(MYSQLI_NUM);      
		$hayventas =  $hayventas[0]; 
		if($hayventas) {
			$ventas = $db->query("DELETE FROM ventas WHERE producto_idproducto = '$ide';");
		}
		$producto = $db->query("DELETE FROM producto WHERE idproducto = '$ide';");
		if ($producto)
		{
			$respuesta['err']=0;
			$respuesta['txerr']="";
			Logear("Usuario: #".$userID." - Elimino producto: #".$ide);
		}
		else
		{
			$respuesta['err']=2;
			$respuesta['txerr']="No se pudo quitar el producto de la base de datos";
			Logear("Usuario: #".$userID." - Error - BD - Al eliminar producto: #".$ide);
		}
	}
	break;
	case 'sProd':
	checkUser();
	$userID=$_SESSION['iduser'];
	Logear("Usuario: #".$userID." - Subir producto");
	$prov = $_POST['prov']*1;
	$nombre = $_POST['nombre'];
	$ubicacion = $_POST['ubicacion'];
	$habilitado = $_POST['habilitado']*1;
	$preciocosto = $_POST['preciocosto']*1;
	$cant = $_POST['cant']*1;
	$obs = $_POST['obs'];
	$cat = $_POST['cat']*1;
	$marca = $_POST['marca']*1;
	$modelo = $_POST['modelo']*1;
	if(isset($_POST['codigo'])){
		$codigo = $_POST['codigo'];
	}else $codigo = 0;
	if(isset($_POST['tags'])) $losTags = explode(",", $_POST['tags']);
	if( isset($_POST['newTags']) ){
		$newTags = array();
		$losNuevosTags = explode(",", $_POST['newTags']);
		foreach($losNuevosTags as $item) {  
			$item = filter_var($item, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);  
			$newTags[] = mysqli_real_escape_string($db,$item);
		}
	}
	if(isset($_FILES['img']) && count($_FILES['img']['name']) ) $hayImg = 1; else $hayImg = 0;
	if(empty($_POST['ide'])){$nuevo = 1;}else{$nuevo=0;}

	$codIde = ultimoId($db,"idcodigo","codigo")+1;
	if(!($codigo)){
		$sku = str_split($prov, 2);
		$codigo = "0000".$codIde;
	}
	$cod=$db->query("INSERT INTO codigo(idcodigo, codigo, usuario_idusuario) VALUES ('$codIde','$codigo','$userID')");
	if(!($nuevo)){
		$ide = $_POST['ide'];
		limpio($db, $ide);
		$prod = $db->query("UPDATE producto SET nombprod='$nombre',obsprod='$obs',cantprod='$cant',ubicacion='$ubicacion',proveedor_idproveedor='$prov',categoria_idcategoria='$cat',modelo_idmodelo = '$modelo',modelo_marca_idmarca='$marca', codigo_idcodigo='$codigo' WHERE idproducto = '$ide'");
	}else{
		$nuevo = 1;
		$ide = ultimoId($db,"idproducto","producto")+1;
		$prod = $db->query("INSERT INTO producto(idproducto, nombprod, obsprod, cantprod, ubicacion, proveedor_idproveedor, categoria_idcategoria,modelo_idmodelo, modelo_marca_idmarca, codigo_idcodigo) VALUES ('$ide','$nombre','$obs','$cant','$ubicacion','$prov','$cat','$modelo','$marca','$codigo')");
	}
	$idprecio = ultimoId($db,"idprecio","precio")+1;
	$precios = $db->query("INSERT INTO precio(idprecio, precio1, precio2, precio3, precio4, producto_idproducto) VALUES ('$idprecio','$preciocosto','$preciocosto'*1.1,'$preciocosto'*1.2,'$preciocosto'*1.3,'$ide')");
	$prodxuser = $db->query("INSERT INTO prodxuser(producto_idproducto, usuario_idusuario) VALUES ('$ide','$userID')");
	if(isset($losTags)){
		$cant = count($losTags);	
		if($cant){
			for ($i=0; $i<$cant; $i++) {
				$elTag = $losTags[$i]*1; 
				$tag = $db->query("INSERT INTO tagxprod(tag_idtag, producto_idproducto) VALUES ('$elTag','$ide');");
			}
		}
	}
	if(isset($newTags)){
		$cant = count($newTags);
		for ($i=0; $i < $cant; $i++) { 
			$idTag = ultimoId($db,"idtag","tag")+1;
			$esta = $db->query("SELECT EXISTS(SELECT nombtag FROM tag WHERE nombtag = '$newTags[$i]')");
			$esta = $esta->fetch_array(MYSQLI_NUM);      
			$esta =  $esta[0]; 
			if(!$esta){
				$tag = $db->query("INSERT INTO tag(idtag, nombtag) VALUES ('$idTag','$newTags[$i]');");
			}else{
				$idTag = $db->query("SELECT idtag FROM tag WHERE nombtag = '$newTags[$i]'");
				$idTag = $idTag->fetch_array(MYSQLI_NUM);      
				$idTag =  $idTag[0];
			}
			$tag = $db->query("INSERT INTO tagxprod(tag_idtag, producto_idproducto) VALUES ('$idTag','$ide');");
		}
	}
	$moveSuccess = false;
	$ds = DIRECTORY_SEPARATOR;

	$nombre = $db->query("SELECT nombproveedor FROM proveedor WHERE idproveedor = '$prov'");
	$nombre = $nombre->fetch_array(MYSQLI_NUM);      
	$prov =  $nombre[0]; 
	$storeFolder = 'img/productos/'.$prov.'/'.$ide;
	$targetPath = dirname( __FILE__ ).$ds.$storeFolder.$ds;
	if(!file_exists($targetPath)){mkdir($targetPath,0777,true);}
	if($hayImg){
		for($i=0; $i<count($_FILES['img']['name']); $i++) {
			$idImg = ultimoId($db,"idimagen","imagen")+1;
			$tempFile = $_FILES['img']['tmp_name'][$i];
			$tipo = $_FILES['img']['type'][$i];
			$tipo = explode("/",$tipo);
			$tipo = $tipo[1];
			$nombreFichero = $idImg.".".$tipo;  
			$pathFichero = $prov."/".$ide."/".$nombreFichero;
			$targetFile = $targetPath.$nombreFichero;
			$moveSuccess = move_uploaded_file($tempFile,$targetFile);
			$anchoDeseado = 768;
			$quality = 80;
			make_thumb($tipo,$targetFile,$targetFile,$anchoDeseado);
				//compress_image($tipo,$targetFile,$targetFile,$quality);
			$nombreFicheroThumb = $idImg."-thumb".".".$tipo;  
			$targetFileThumb = $targetPath.$nombreFicheroThumb;
			$anchoDeseado = 240;
			make_thumb($tipo,$targetFile,$targetFileThumb,$anchoDeseado); 
			$pathThumb = $ide."/".$nombreFicheroThumb;     
		}
	}else{
		$idImg = ultimoId($db,"idimagen","imagen")+1;
		$tipo = "gif";
		$nombreFichero = $idImg.".".$tipo;  
		$pathFichero = $prov."/".$ide."/".$nombreFichero;
		$targetFile = $targetPath.$nombreFichero;				
		$fichero = './img/productos/default-50x50.gif';
		$nuevo_fichero = $targetPath.'default-50x50.gif';
		if (!copy($fichero, $nuevo_fichero)) {
			Logear("Usuario: #".$userID." - Error al querer insertar imagen generica en subida de producto");
			error_log("Error al copiar $fichero a $nuevo_fichero\n ");
		}else{$moveSuccess = true;}
	}
	if($moveSuccess){ 
		$img = $db->query("INSERT INTO imagen(idimagen, pathimagen) VALUES ('$idImg','$pathFichero')");
		if($img){
			$imgxprod = $db->query("INSERT INTO imgxprod(imagen_idimagen, producto_idproducto) VALUES ('$idImg','$ide')");
			if(!($imgxprod)){
				Logear("Usuario: #".$userID." - Error al actualizar imgxprod");
				$respuesta['err'] = 2;
				$respuesta['txerr'] = "Error al subir/actualizar producto";
			}else{
				if($prod){
					Logear("Usuario: #".$userID." - Subido producto");
					$respuesta['err'] = 0;
					$respuesta['txerr'] = "OK - Producto creado";
				}
			}
		}else{
			Logear("Usuario: #".$userID." - Error al subir img path a bd");
			$respuesta['err'] = 3;
			$respuesta['txerr'] = "Error al subir/actualizar producto";
		}
	}else{
		Logear("Usuario: #".$userID." - Error al copiar img a la carpeta");
		$respuesta['err'] = 4;
		$respuesta['txerr'] = "Error al subir/actualizar producto";
	}
	break;
	case 'tCats':
	$categorias = $db->query("SELECT idcategoria AS 'value', nombrecat AS 'data' FROM categoria WHERE 1;"); 
	$cantCats = $categorias->num_rows;
	if ($cantCats>=1) {
		$cats = array();
		while( $cats[]=$categorias->fetch_assoc() );
		$respuesta['cats']=$cats;
		$respuesta['cant']=$cantCats;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Sin categorias";
	}
	break;
	case 'tProd':
	$userID=$_SESSION['iduser'];
	if (isset($_POST["ide"]) && !empty($_POST["ide"])){
		$id = $_POST["ide"]*1;
		$prods = $db->query("SELECT idproducto, nombprod, obsprod, cantprod, ubicacion, proveedor_idproveedor, idcategoria, nombrecat, idcodigo, codigo, precio1, idmodelo, nombremodelo,idmarca, nombremarca, idproveedor, nombproveedor, GROUP_CONCAT(DISTINCT tag.idtag,'-', tag.nombtag ORDER BY tag.idtag ASC SEPARATOR ',') as 'tags',  GROUP_CONCAT(DISTINCT imagen.pathimagen ORDER BY imagen.pathimagen ASC SEPARATOR ',') as 'pathimagen' FROM 
			producto 
			left join imgxprod on producto_idproducto = idproducto 
			left join imagen on imagen_idimagen = idimagen 
			left join categoria on categoria_idcategoria = idcategoria 
			left join proveedor on proveedor_idproveedor = idproveedor 
			left join codigo on codigo_idcodigo = idcodigo 
			left join precio on idproducto = precio.producto_idproducto 
			left join marca on modelo_marca_idmarca = idmarca 
			left join tagxprod on tagxprod.producto_idproducto = idproducto
			left join tag on tag_idtag = idtag 
			left join modelo on modelo_idmodelo = idmodelo WHERE idproducto = '$id' group by idproducto");
	}else{
		$prods=$db->query("SELECT idproducto, nombprod, obsprod, cantstock, minstock, pathimagen, ubicacion, proveedor_idproveedor, nombrecat, codigo, precio1, nombremodelo, nombremarca, nombproveedor 
			FROM prodxuser
			left join producto on producto_idproducto = idproducto
			left join imgxprod on imgxprod.producto_idproducto = producto.idproducto 
			left join imagen on imagen_idimagen = idimagen 
			left join categoria on categoria_idcategoria = idcategoria 
			left join proveedor on proveedor_idproveedor = idproveedor 
			left join codigo on codigo_idcodigo = idcodigo 
			left join precio on producto.idproducto = precio.producto_idproducto 
			left join marca on modelo_marca_idmarca = idmarca 
			left join modelo on modelo_idmodelo = idmodelo 

			WHERE prodxuser.usuario_idusuario = '$userID' group by idproducto
			");
	}
	$cantProds = $prods->num_rows;
	if($prods){
		$aProds = array();
		while( $xx=$prods->fetch_assoc() ) $aProds[]=$xx;
		$respuesta['productos']=$aProds;
		$respuesta['cant']=$cantProds;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="No hay productos para mostrar";
	}
	break;

	case 'tStore':
	$user=$_SESSION['iduser'];
	$tipoprecio = $db->query("SELECT listaprec FROM usuario WHERE idusuario = '$user';");
	$tipoPre=armarArrayCon($tipoprecio);
	$precioTipo = "precio".$tipoPre[0]['listaprec']*1;
	$prods = $db->query("SELECT idproducto, nombprod, obsprod, cantprod, ubicacion, proveedor_idproveedor,$precioTipo preciocto, pathimagen FROM producto, imgxprod, imagen, precio where proveedor_idproveedor = 1 and producto.idproducto = imgxprod.producto_idproducto and imagen.idimagen = imgxprod.imagen_idimagen and precio.producto_idproducto = producto.idproducto group by idproducto");
	$cantProds = $prods->num_rows;
	if($prods){
		$aProds = array();
		while( $xx=$prods->fetch_assoc() ) $aProds[]=$xx;
		$respuesta['productos']=$aProds;
		$respuesta['cant']=$cantProds;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al traer productos";
	}
	break;
	case 'tMarcas':
	$marcas = $db->query("SELECT idmarca AS 'value', nombremarca AS 'data' FROM marca WHERE 1;"); 
	$cantBrands = $marcas->num_rows;
	if ($cantBrands>=1) {
		$brand = array();
		while( $brand[]=$marcas->fetch_assoc() );
		$respuesta['brand']=$brand;
		$respuesta['cant']=$cantBrands;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Sin marcas";
	}
	break;
	case 'tMarca':
	if(isset($_POST['idmarca'])){
		$idmarca = $_POST['idmarca']*1;
		$marca = $db->query("SELECT idmarca, nombremarca FROM marca WHERE idmarca = '$idmarca';"); 
		if ($marca) {
			$respuesta['marca']=$marca->fetch_assoc();
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}
		else
		{
			$respuesta['err']=1;
			$respuesta['txerr']="Sin marcas";
		}
	}else
	{
		$respuesta['err']=2;
		$respuesta['txerr']="Sin ide!";
	}
	break;

	case 'tModelo':
	if(isset($_GET['idMarca'])){
		$id = $_GET['idMarca']*1;
		$modelo = $db->query("SELECT idmodelo AS 'value', nombremodelo AS 'data' FROM modelo WHERE marca_idmarca = '$id';"); 
		$cantMod = $modelo->num_rows;
		if ($cantMod>=1) {
			$models = array();
			while( $models[]=$modelo->fetch_assoc() );
			$respuesta['modelos']=$models;
			$respuesta['cant']=$cantMod;
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}
		else
		{
			$respuesta['err']=1;
			$respuesta['txerr']="Sin modelo para esa marca";
		}
	}
	break;
	case 'tTag':
	if(isset($_POST['idtag'])){
		$idtag = $_POST['idtag']*1;
		$tag = $db->query("SELECT idtag, nombtag nombretag FROM tag WHERE idtag = '$idtag';"); 
		if ($tag) {
			$respuesta['tag']=$tag->fetch_assoc();
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}
		else
		{
			$respuesta['err']=1;
			$respuesta['txerr']="Sin Tag";
		}
	}else
	{
		$respuesta['err']=2;
		$respuesta['txerr']="Sin ide!";
	}
	break;

	case 'tTags':
	$etiquetas = $db->query("SELECT idtag AS 'id', nombtag AS 'name' FROM tag WHERE 1;"); 
	$cantTag = $etiquetas->num_rows;
	if ($cantTag>=1) {
		$tags = array();
		while( $xx=$etiquetas->fetch_assoc() ) $tags[]=$xx;
		$respuesta=$tags;
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Sin tags";
	}
	case 'tMMT':
	$marcas = $db->query("SELECT idmarca, nombremarca AS 'nombMarca' FROM marca WHERE 1;"); 
	$modelo = $db->query("SELECT modelo.idmodelo, modelo.nombremodelo AS 'nombModelo', marca.nombremarca AS 'nombMarca' FROM modelo left join marca on marca.idmarca = modelo.marca_idmarca WHERE 1;"); 
	$tag = $db->query("SELECT idtag, nombtag AS 'nombTag' FROM tag WHERE 1;"); 
	$cantTags = $tag->num_rows;
	$cantMarcas = $marcas->num_rows;
	$cantModelos = $modelo->num_rows;
	if($marcas && $modelo && $tag )
	{
		$tags = array();
		$marca = array();
		$modelos = array();
		while( $xx=$marcas->fetch_assoc() ) $marca[]=$xx;
		while( $xx=$modelo->fetch_assoc() ) $modelos[]=$xx;
		while( $xx=$tag->fetch_assoc() ) $tags[]=$xx;
		$respuesta['err']=0;
		$respuesta['cantMarcas']=$cantMarcas;
		$respuesta['cantModelos']=$cantModelos;
		$respuesta['cantTags']=$cantTags;
		$respuesta['marca'] = $marca;
		$respuesta['modelo'] = $modelos;
		$respuesta['tag'] = $tags;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error de BD";

	}
	break;
	case 'tMod':
	if(isset($_POST['idMod'])){
		$id = $_POST['idMod']*1;
		$modelo = $db->query("SELECT idmodelo, nombremodelo AS 'nombModelo' FROM modelo WHERE idmodelo = '$id';"); 
		$marca = $db->query("SELECT idmarca, nombremarca AS 'nombMarca' FROM marca left join modelo on modelo.marca_idmarca = marca.idmarca WHERE modelo.idmodelo = '$id';"); 
		$dbmarcas = $db->query("SELECT idmarca, nombremarca AS 'nombMarca' FROM marca WHERE 1;"); 
		$cantMarcas = $dbmarcas->num_rows;
		if($modelo && $dbmarcas){
			$marcas = array();
			while( $xx=$dbmarcas->fetch_assoc() ) $marcas[]=$xx;
			$respuesta['err']=0;
			$respuesta['txerr']="";
			$respuesta['cantMarcas']=$cantMarcas;
			$respuesta['marcas'] = $marcas;
			$respuesta['modelo'] = $modelo->fetch_assoc() ;
			$respuesta['marca'] = $marca->fetch_assoc() ;
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="Error de BD";
		}
	}
	break;
	case 'gMod':
	if(isset($_POST['idMod'])){ $idmodelo = $_POST['idMod'] * 1; }
	if(isset($_POST['nombMod'])){
		$nombMod = filter_var($_POST['nombMod'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$nombModelo = mysqli_real_escape_string($db,$nombMod);
	}
	if(isset($_POST['idMar'])){ $idmarca = $_POST['idMar']*1; }
	if($idmodelo){
		$modelo = $db->query("UPDATE modelo SET nombremodelo='$nombModelo', marca_idmarca='$idmarca' WHERE idmodelo='$idmodelo';");
	}else{
		$idmodelo = ultimoId($db,"idmodelo","modelo")+1;
		$modelo = $db->query("INSERT INTO modelo(idmodelo, nombremodelo, marca_idmarca) VALUES ('$idmodelo','$nombModelo','$idmarca');"); 
	}
	if($modelo){
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error de BD";
	}
	break;
	case 'gMar':
	if(isset($_POST['idMarca'])){ $idmarca = $_POST['idMarca'] * 1; }
	if(isset($_POST['nombMarca'])){
		$nombMar = filter_var($_POST['nombMarca'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$nombMarca = mysqli_real_escape_string($db,$nombMar);
	}
	if($idmarca){
		$marca = $db->query("UPDATE marca SET nombremarca='$nombMarca' WHERE idmarca='$idmarca';");
	}else{
		$idmarca = ultimoId($db,"idmarca","marca")+1;
		$marca = $db->query("INSERT INTO marca(idmarca, nombremarca) VALUES ('$idmarca','$nombMarca');"); 
	}
	if($marca){
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error de BD";
	}
	break;
	case 'dMod':
	if(isset($_POST['ideMod'])){ 
		$elId = $_POST['ideMod']* 1; 
		$dquery = $db->query("Delete from modelo where idmodelo = '$elId'");
		if($dquery){
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=2;
			$respuesta['txerr']="Error de BD";
		}
	}
	else {
		$respuesta['err']=1;
		$respuesta['txerr']="No hay id!";
	}
	break;
	case 'dMar':
	if(isset($_POST['ideMar'])){ 
		$elId = $_POST['ideMar']* 1; 
		$dquery = $db->query("Delete from marca where idmarca = '$elId'");
		if($dquery){
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=2;
			$respuesta['txerr']="Error - Esta seguro que no tiene modelos dependientes ?";
		}
	}
	else {
		$respuesta['err']=1;
		$respuesta['txerr']="No hay id!";
	}
	break;
	case 'dTag':
	if(isset($_POST['ideTag'])){ 
		$elId = $_POST['ideTag']* 1; 
		$dquery = $db->query("Delete from tag where idtag = '$elId'");
		if($dquery){
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=2;
			$respuesta['txerr']="Error de BD";
		}
	}
	else {
		$respuesta['err']=1;
		$respuesta['txerr']="No hay id!";
	}
	break;
	case 'gTag':
	if(isset($_POST['idTag'])){ $elId = $_POST['idTag']* 1; }
	if(isset($_POST['nombtag'])){
		$nombtag = filter_var($_POST['nombtag'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$nombreTag = mysqli_real_escape_string($db,$nombtag);
	}
	if($elId){
		$tag = $db->query("UPDATE tag SET nombtag='$nombreTag' WHERE idtag='$elId';");
	}else{
		$elId = ultimoId($db,"idtag","tag")+1;
		$tag = $db->query("INSERT INTO tag(idtag, nombtag) VALUES ('$elId','$nombreTag');"); 
	}
	if($tag){
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error de BD";
	}
	break;
	case 'tProve':
	$proveedores = $db->query("Select * from proveedor");
	if($proveedores){
		$cantProv = $proveedores->num_rows;
		if($cantProv>0){
			$aProveedores = array();
			while( $xx=$proveedores->fetch_assoc() ) $aProveedores[]=$xx;
			$respuesta['err']=0;
			$respuesta['txerr']="";
			$respuesta['proveedores']=$aProveedores;
			$respuesta['cant']=$cantProv;
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No hay proveedores"; 
		}
	}else{
		$respuesta['err']=2;
		$respuesta['txerr']="Error de bd";

	}
	break;
	case 'tProdsA':
	$user = $_SESSION['iduser'];
	//$estados = $db->query("SELECT idestado AS 'value', nombestado AS 'data' FROM estado WHERE 1;"); 
	$prods = $db->query("SELECT codigo as value, nombprod as data FROM producto left join codigo on codigo_idcodigo = idcodigo WHERE idproducto in (Select producto_idproducto from prodxuser where usuario_idusuario = '$user')"); 
	$cant = $prods->num_rows;
	if ($cant>=1) {
		$productos = array();
		while( $productos[]=$prods->fetch_assoc() );
		$respuesta['producto']=$productos;
		$respuesta['cant']=$cant;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Sin estados";
	}
	break;
	case 'tConditions':
	$estados = $db->query("SELECT idestado AS 'value', nombestado AS 'data' FROM estado WHERE 1;"); 
	$cant = $estados->num_rows;
	if ($cant>=1) {
		$conditions = array();
		while( $conditions[]=$estados->fetch_assoc() );
		$respuesta['estados']=$conditions;
		$respuesta['cant']=$cant;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Sin estados";
	}
	break;
	case 'gProve':
	if(isset($_POST['idProv'])){ $elId = $_POST['idProv']* 1; }
	if(isset($_POST['nombre'])){
		$nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$nombreProv = mysqli_real_escape_string($db,$nombre);
	}
	if($elId){
		$proveedor = $db->query("UPDATE proveedor SET nombproveedor='$nombreProv' WHERE idproveedor='$elId';");
	}else{
		$elId = ultimoId($db,"idproveedor","proveedor")+1;
		$proveedor = $db->query("INSERT INTO proveedor(idproveedor, nombproveedor) VALUES ('$elId','$nombreProv');"); 
	}
	if($proveedor){
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al subir o actualizar";
	}
	break;
	case 'dProve':
	if(isset($_POST['ideProve'])){ 
		$elId = $_POST['ideProve']* 1; 
		$dquery = $db->query("Delete from proveedor where idproveedor = '$elId'");
		if($dquery){
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=2;
			$respuesta['txerr']="Error al querer eliminar";
		}
	}
	else {
		$respuesta['err']=1;
		$respuesta['txerr']="No hay id!";
	}
	break;
	case 'tUser':
	if(isset($_POST['ide'])){
		$ide = $_POST['ide'];
		$usuarios = $db->query("Select * from usuario where idusuario = '$ide'"); 
	}else{ $usuarios = $db->query("Select * from usuario"); }
	if($usuarios){
		$cUser = $usuarios->num_rows;
		if($cUser>0){
			$auser = array();
			while( $xx=$usuarios->fetch_assoc() ) $auser[]=$xx;
			$respuesta['err']=0;
			$respuesta['txerr']="";
			$respuesta['usuarios']=$auser;
			$respuesta['cant']=$cUser;
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No hay usuarios"; 
		}
	}else{
		$respuesta['err']=2;
		$respuesta['txerr']="Error de bd";

	}
	break;
	case 'gUser':
	if(isset($_POST['idUser'])){ $elId = $_POST['idUser']* 1; }
	if(isset($_POST['nombre'])){
		$nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$nombreuser = mysqli_real_escape_string($db,$nombre);
	}
	if(isset($_POST['pass'])){
		$pass = md5($_POST['pass']);
	}
	if(isset($_POST['email'])){
		$email = $_POST['email'];
	}
	if(isset($_POST['habilitado'])){
		$habilitado = $_POST['habilitado'] * 1;
	}
	if($elId){
		if($pass){
			$usuario = $db->query("UPDATE usuario SET nombuser='$nombreuser' , habilitadouser='$habilitado' , contuser='$pass' , emailuser='$email' WHERE idusuario='$elId';");
		}else{
			$usuario = $db->query("UPDATE usuario SET nombuser='$nombreuser' , habilitadouser='$habilitado' , emailuser='$email' WHERE idusuario='$elId';");
		}
	}else{
		$elId = ultimoId($db,"idusuario","usuario")+1;
		$usuario = $db->query("INSERT INTO usuario(idusuario, nombuser, habilitadouser, contuser, emailuser) VALUES ('$elId','$nombreuser','$habilitado','$pass','$email');"); 
	}
	if($usuario){
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al subir o actualizar";
	}
	break;
	case 'dUser':
	if(isset($_POST['ideUser'])){ 
		$elId = $_POST['ideUser']* 1; 
		$dquery = $db->query("Delete from usuario where idusuario = '$elId'");
		if($dquery){
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=2;
			$respuesta['txerr']="Error al querer eliminar";
		}
	}
	else {
		$respuesta['err']=1;
		$respuesta['txerr']="No hay id!";
	}
	break;
	case 'gCarrito':
	$user = $_SESSION['iduser'];
	if (isset($_POST['idprod'])){$id = $_POST['idprod'];}
	if (isset($_POST['cant'])){$cant = $_POST['cant'];}
	if (isset($_POST['minstock'])){$minstock = $_POST['minstock'];}
	if($id && $cant){
		$idcar = ultimoId($db,"idcar","carrito")+1;
		$esta = $db->query("select EXISTS ( SELECT producto_idproducto FROM carrito WHERE producto_idproducto = '$id' AND usuario_idusuario = '$user' ) ");
		$esta = $esta->fetch_array(MYSQLI_NUM);      
		$esta =  $esta[0]; 
		if($esta){
			$sql = "UPDATE carrito SET minstock='$minstock',cant=cant + '$cant',vigencia = DATE_ADD(now(), INTERVAL 25 MINUTE) WHERE producto_idproducto = '$id' AND usuario_idusuario = '$user' ";
		}
		else $sql = "INSERT INTO carrito(idcar, usuario_idusuario, producto_idproducto, producto_proveedor_idproveedor, minstock, cant, listo, vigencia) VALUES ('$idcar','$user','$id',1,'$minstock','$cant',0, DATE_ADD(now(), INTERVAL 25 MINUTE))";
		$iquery = $db->query($sql);
		if($iquery){
			Logear("Usuario ".$user." - crea carrito. ");	
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="Error al querer insertar!";
		}	
	}else{
		$respuesta['err']=3;
		$respuesta['txerr']="No hay id!";
	}
	break;
	case 'tCarrito':
	$user = $_SESSION['iduser'];
	$sql = "Select carrito.*, nombproveedor from carrito left join proveedor on idproveedor = producto_proveedor_idproveedor where usuario_idusuario = '$user' and listo = 0";
	$iquery = $db->query($sql);
	if($iquery){
		$productos = array();
		while($productos[]=$iquery->fetch_assoc());
		$respuesta['productos']=$productos;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al querer insertar!";
	}
	break;
	case 'okCarrito':
	$user = $_SESSION['iduser'];
	$problematicos = array();
	//$problematicos = checkCantCarrito($db, $user);
	if(empty($problematicos)){
		$sql = "UPDATE carrito SET listo=1 WHERE usuario_idusuario = '$user'";
		$iquery = $db->query($sql);
		if($iquery){
			Logear("El usuario: #".$user. " ha cerrado un carrito.");
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="Error al querer actualizar!";
		}
	}else{
		$respuesta['problematicos']=$problematicos;
		$respuesta['err']=2;
		$respuesta['txerr']="Error al querer cerrar el carrito por falta de stock.";
	}
	break;
	case 'dCarrito':
	$user = $_SESSION['iduser'];
	$id = $_POST['ideCarrito'];
	$sql = "DELETE FROM carrito WHERE idcar = '$id'";
	$iquery = $db->query($sql);
	if($iquery){
		Logear("El usuario: #".$user. " ha eliminado un carrito.");
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al querer actualizar!";
	}
	break;
	case 'tProdXUser':
	$user = $_SESSION['iduser'];
	$sql = "Select producto.*, prodxuser.cantstock from producto, prodxuser where prodxuser.producto_idproducto = producto.idproducto and prodxuser.usuario_idusuario = '$user'";
	$iquery = $db->query($sql);
	if($iquery){
		$cProd = $iquery->num_rows;
		$productos = array();
		while($productos[]=$iquery->fetch_assoc());
		$respuesta['productos']=$productos;
		$respuesta['cant']=$cProd;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al querer actualizar!";
	}
	break;
	case 'gVenta':
	$ideUser = $_SESSION['iduser'];
	$codigoProd = $_POST['cprod'];
	$cant = $_POST['cant'];
	$estado = $_POST['estado'];
	$zona = $_POST['zona'];
	$ideVenta = ultimoId($db,"idventa","venta")+1;

	$ideProd = $db->query("SELECT idproducto FROM producto WHERE codigo_idcodigo in(Select idcodigo from codigo where codigo = '$codigoProd')");
	$ideProd = $ideProd->fetch_array(MYSQLI_NUM);      
	$ideProd =  $ideProd[0];

	$minStock = $db->query("SELECT minstock FROM prodxuser WHERE usuario_idusuario = '$ideUser' and producto_idproducto = '$ideProd'");
	$minStock = $minStock->fetch_array(MYSQLI_NUM);      
	$minStock =  $minStock[0];

	$proveedorID = $db->query("SELECT proveedor_idproveedor FROM producto WHERE idproducto = '$ideProd'");
	$proveedorID = $proveedorID->fetch_array(MYSQLI_NUM);      
	$proveedorID = $proveedorID[0];
	$cantResul = checkCant($db, $cant, $ideUser, $ideProd);
	if($cantResul >= 0){
		$listaprec = $db->query("SELECT `listaprec` FROM `usuario` WHERE idusuario = '$ideUser'");
		$listaprec = $listaprec->fetch_array(MYSQLI_NUM);      
		$listaprec = $listaprec[0];
		$precio = $db->query("SELECT precio$listaprec FROM `precio` WHERE producto_idproducto = '$ideProd'");
		$precio = $precio->fetch_array(MYSQLI_NUM);      
		$precio = $precio[0];
		$precio = $precio*1;
		$cant = $cant*1;
		$monto = $precio*$cant;
		
		$descuento = $db->query("UPDATE prodxuser SET cantstock='$cantResul' WHERE usuario_idusuario = '$ideUser' and producto_idproducto = '$ideProd'");

		$insertVenta = $db->query("INSERT INTO venta(idventa, fechaventa, zona, monto, usuario_idusuario, producto_idproducto, cant, estado_idestado) VALUES ('$ideVenta',now(),'$zona','$monto','$ideUser','$ideProd','$cant','$estado')");

		$libro = $db->query("INSERT INTO `libro`(`producto_idproducto`, `usuario_idusuario`, `timestamp`, `cantidad`, `proveedor_idproveedor`) VALUES ('$ideProd','$ideUser',now(),-'$cant','$proveedorID')");
		Logear("Se ha actualizado libro - Producto #".$ideProd." - Cantidad: -".$cant." - Usuario: #".$ideUser);
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=2;
		$respuesta['idprod']=$ideProd*1;
		$respuesta['txerr']="No hay stock suficiente";
	}
	break;
	case 'tVenta':
	$user = $_SESSION['iduser'];
	$sql = "Select venta.*, producto.nombprod, estado.nombestado from venta join producto on (venta.producto_idproducto = producto.idproducto) join estado on (venta.estado_idestado = estado.idestado) where usuario_idusuario = '$user'";
	$tquery = $db->query($sql);
	if($tquery){
		$cant = $tquery->num_rows;
		$ventas = array();
		while($ventas[]=$tquery->fetch_assoc());
		$respuesta['ventas']=$ventas;
		$respuesta['cant']=$cant;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al querer traer ventas!";
	}
	break;
	case 'amigou':
	$respuesta['err']=0;
	$respuesta['txerr']=":)";
	break;

}   
echo json_encode($respuesta);

/* * * * * * * * * * Auxiliares * * * * * * * * * */
function checkUser(){
	if($_SESSION['hayusuario']!=1 || $_SESSION['tipouser'] != 2){
		unset($_SESSION['iduser']);
		unset($_SESSION['usuario']);
		unset($_SESSION['hayusuario']);
		unset($_SESSION['tipouser']);
		Logear("Acceso al cliente con usuario no logueado.");	
		logout();
	}
}
function logout(){
	header("Location: ../index.html");
	die();
}
function mArchivos($src, $dst) {
	$files = scandir($src);
	$source = $src;
	$destination = $dst;
	if (!is_dir($dst)) {
		mkdir($dst);         
	}
	foreach ($files as $file) {
		rename($src.$file, $dst.$file);
	}
	rmdir($src);
}
function armarArrayCon($resDb){
	$array=array();
	while($datos  = $resDb->fetch_assoc()){
		$array[] = $datos;
	}
	return $array;
}
function checkCant($db, $cant, $iduser, $idprod){
	$cant = $cant*1;
	$cant = $db->query("SELECT SUM(cantstock - '$cant') FROM prodxuser WHERE usuario_idusuario = '$iduser' and producto_idproducto = '$idprod'");
	$cant = $cant->fetch_array(MYSQLI_NUM);      
	$cant =  $cant[0];
	return $cant;
}
function checkCantCarrito($db, $iduser){
	$ideProds = $db->query("SELECT producto_idproducto FROM carrito WHERE  usuario_idusuario = '$iduser' and listo = 0 order by producto_idproducto");
	$cantProds = $db->query("SELECT cant FROM carrito WHERE  usuario_idusuario = '$iduser' and listo = 0 order by producto_idproducto");
	$cantProds = $cantProds->fetch_array(MYSQLI_NUM);      
	$ideProds = $ideProds->fetch_array(MYSQLI_NUM);      
	$cant = count($ideProds);
	$ok = true;
	$problematicos = array();
	for($j = 0; $j < $cant; $j++){
		$cant = $db->query("Select SUM(cantprod - '$cantProds[$j]') balance from producto where idproducto = '$ideProds[$j]'");
		$cant = $cant->fetch_array(MYSQLI_NUM);      
		$cant =  $cant[0];
		if($cant<0){
			$problematicos[]=$ideProds[$j];
		}
	}
	return $problematicos;
}
function limpio($db,$ide){
	$tagxprod=$db->query("DELETE FROM tagxprod WHERE producto_idproducto = '$ide';");
	$prodxuser=$db->query("DELETE FROM prodxuser WHERE producto_idproducto = '$ide';");
	$precioxprod=$db->query("DELETE FROM precio WHERE producto_idproducto = '$ide';");
	return($tagxprod && $prodxuser && $precioxprod);
}
function prepupdate($db,$tabla,$where,$datos) {
    //Sanitizo los null
	foreach($datos as $k=>$v) if ($v=="null") $datos[$k]="";
	$res=$db->query("Select * from {$tabla} {$where}");
	if ($res->num_rows<1) {
		$res2=$db->query("show columns from {$tabla}");
		$dts=array();
		while ($campos=$res2->fetch_assoc()) $dts[$campos['Field']]="";
		$dife=array();
		foreach($dts as $k=>$v) if (array_key_exists($k,$datos)) $dife[$k]=$datos[$k];
		$lsql=$rsql="";
		foreach($dife as $k=>$v) {
			$lsql.="{$k},";
			$rsql.="\"".mysqli_real_escape_string($db,$v)."\",";
        //$rsql.="\"{$v}\",";
		}
		$rsql="insert into {$tabla} (" . substr($lsql,0,-1) . ") VALUES (" . substr($rsql,0,-1) . ")";
	} else {
		$dts=$res->fetch_assoc();
		$dife=array_diff_assoc($datos,$dts);
		$campos=array();
		foreach($dife as $k=>$v) if (array_key_exists($k,$dts)) $campos[$k]=$datos[$k];
		$rsql="";
		foreach($campos as $k=>$v) $rsql.="{$k}=\"".$db->real_escape_string($v)."\", ";
		if (strlen($rsql)>2) $rsql="update {$tabla} set " . substr($rsql,0,-2) . " {$where} ";
		else $rsql=false;
	}
	return $rsql;
}
function make_thumb($fileType, $src, $dest, $desired_width) {
	if($fileType=="image/png"){
		$source_image = imagecreatefrompng($src);
		$width = imagesx($source_image);
		$height = imagesy($source_image);
		$desired_height = floor($height * ($desired_width / $width));
		$virtual_image = imagecreatetruecolor($desired_width, $desired_height);
		imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
		imagepng($virtual_image, $dest);
	}
	if($fileType=="image/jpeg"){
		$source_image = imagecreatefromjpeg($src);
		$width = imagesx($source_image);
		$height = imagesy($source_image);
		$desired_height = floor($height * ($desired_width / $width));
		$virtual_image = imagecreatetruecolor($desired_width, $desired_height);
		imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
		imagejpeg($virtual_image, $dest);
	}
}
function compress_image($tipo, $source_url, $destination_url, $quality) {
	if ($tipo == 'image/jpeg') $image = imagecreatefromjpeg($source_url);
	elseif ($tipo == 'image/gif') $image = imagecreatefromgif($source_url);
	elseif ($tipo == 'image/png') $image = imagecreatefrompng($source_url);
	imagejpeg($image, $destination_url, $quality);
	return $destination_url;
}
function Logear($cadena) {
	$xx=fopen("../ad/tmp/log.txt","a");
	fwrite($xx,date("Y-m-d H:i:s ").$cadena."\n");
	fclose($xx);
}
/* me devuelve el ultimo id de una tabla determinada */
function ultimoId($db,$id_tabla,$tabla){
	$rs = $db->query("SELECT MAX($id_tabla) AS id FROM $tabla");
	if ($row = $rs->fetch_Row()){
		$id = (int)trim($row[0]);
	}
	return $id;
}

/*Funcion que determina si hay algun error despues de la última codificación json*/
function errorJsonEncode(){
	switch(json_last_error()) {
		case JSON_ERROR_NONE:
		return ' - Sin errores';
		break;
		case JSON_ERROR_DEPTH:
		return ' - Excedido tamaño máximo de la pila';
		break;
		case JSON_ERROR_STATE_MISMATCH:
		return ' - Desbordamiento de buffer o los modos no coinciden';
		break;
		case JSON_ERROR_CTRL_CHAR:
		return ' - Encontrado carácter de control no esperado';
		break;
		case JSON_ERROR_SYNTAX:
		return ' - Error de sintaxis, JSON mal formado';
		break;
		case JSON_ERROR_UTF8:
		return ' - Caracteres UTF-8 malformados, posiblemente están mal codificados';
		break;
		default:
		return ' - Error desconocido';
		break;
	}
}
?>