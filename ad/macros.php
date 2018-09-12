<?php
header("Expires:Fri, Jun 12 1981 08:20:00 GMT");
header("Pragma:no-cache");
header("Cache-Control:no-cache");
header('Content-Type: application/json; charset=UTF-8');
require_once("./connect.php");
// server should keep session data for AT LEAST 1 hour
ini_set('session.gc_maxlifetime', 3600);
// each client should remember their session id for EXACTLY 1 hour
session_set_cookie_params(3600);
session_start();
$tarea=$_REQUEST['t'];
$respuesta=array('err'=>0,'txerr'=>'');
switch($tarea) {
	/* * * * * * * Caso Usuario * * * * * * */
	case 'lo':
	unset($_SESSION['iduser']);
	unset($_SESSION['usuario']);
	unset($_SESSION['hayusuario']);
	unset($_SESSION['tipo']);
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
	$res= $db->query("SELECT * FROM usuario WHERE (nombuser='$usuario' or emailuser='$usuario') AND contuser='$contra' ;");
	$filas = $res->num_rows;
	$elId = $res->fetch_assoc();
	if ($filas==1) {
		$_SESSION['iduser']=$elId['idusuario'];
		$_SESSION['tipo']=$elId['tipo'];
		if($elId['tipo']==1){
			Logear("Usuario: #".$elId['idusuario']." - Ingreso al sistema de admin.");
			$respuesta['iraPagina']="./ad";
		}else{
			Logear("Usuario: #".$elId['idusuario']." - Ingreso al sistema de cliente.");
			$respuesta['iraPagina']="./cli";
		}
		$_SESSION['usuario']=$usuario;
		$_SESSION['hayusuario']= 1;
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
	if(isset($_SESSION['hayusuario']) && $_SESSION['hayusuario'] == 1){
		$usuario=$_SESSION['usuario'];
		$res = $db->query("SELECT * FROM usuario WHERE nombuser='$usuario';");
		$filas = $res->num_rows;
		if($filas==1){
			$tipo = $_SESSION['tipo'];
			if($tipo == 1){
				$respuesta['err']=0;
				$respuesta['txerr']='';
				$respuesta['iduser']=$_SESSION['iduser'];
				$respuesta['usuario']=$_SESSION['usuario'];
			}else{
				$respuesta['err']=1;
				$respuesta['txerr']="No deberia estar aqui.";
				$respuesta['iraPagina']='../cli/index.html';
			}
		}

	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="No esta logueado";
		$respuesta['iraPagina']='../index.html';
	}
	break;
	case 'checkuserCli':
	if(isset($_SESSION['hayusuario']) && $_SESSION['hayusuario'] == 1){
		$usuario=$_SESSION['usuario'];
		$res = $db->query("SELECT * FROM usuario WHERE nombuser='$usuario';");
		$filas = $res->num_rows;
		if($filas==1){
			$tipo = $_SESSION['tipo'];
			if($tipo == 2){
				$respuesta['err']=0;
				$respuesta['txerr']='';
				$respuesta['iduser']=$_SESSION['iduser'];
				$respuesta['usuario']=$_SESSION['usuario'];
			}else{
				$respuesta['err']=1;
				$respuesta['txerr']="No deberia estar aqui.";
				$respuesta['iraPagina']='../index.html';
			}
		}
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="No esta logueado";
		$respuesta['iraPagina']='../index.html';
	}
	break;

	case 'tUser':
	if(isset($_POST['ide'])){
		$ide = $_POST['ide'];
		$usuarios = $db->query("Select * from usuario where idusuario = '$ide'");
	}else{
		if(isset($_GET['menos'])){
			$menos = $_GET['menos']*1;
			$usuarios = $db->query("Select * from usuario where idusuario != '$menos'");
		}else{
			$usuarios = $db->query("Select * from usuario");
		}
	}

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
	if(isset($_POST['pass'])){$pass = md5($_POST['pass']);}
	if(isset($_POST['email'])){$email = $_POST['email'];}
	if(isset($_POST['habilitado'])){$habilitado = $_POST['habilitado'] * 1;}
	if(isset($_POST['lista'])){$lista = $_POST['lista']*1;}
	if(isset($_POST['zona'])){$zona = $_POST['zona'];}
	if($elId){
		if(isset($_POST['pass'])){
			$usuario = $db->query("UPDATE usuario SET nombuser='$nombreuser' , habilitadouser='$habilitado' , contuser='$pass' , emailuser='$email', listaprec='$lista', zona = '$zona' WHERE idusuario='$elId';");
		}else{
			$usuario = $db->query("UPDATE usuario SET nombuser='$nombreuser' , habilitadouser='$habilitado' , emailuser='$email', listaprec='$lista', zona = '$zona' WHERE idusuario='$elId';");
		}
	}else{
		$elId = ultimoId($db,"idusuario","usuario")+1;
		$usuario = $db->query("INSERT INTO usuario(idusuario, nombuser, habilitadouser, contuser, emailuser, listaprec, zona) VALUES ('$elId','$nombreuser','$habilitado','$pass','$email', '$lista', '$zona');");
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

	/* * * * * * * Caso Carrito * * * * * * */
	case 'tProdsC':
	if(isset($_SESSION['iduser'])){
		$userID = $_GET['user'];
		$listaprec = $db->query("SELECT listaprec FROM usuario WHERE idusuario = '$userID'");
		$listaprec = $listaprec->fetch_array(MYSQLI_NUM);
		$listaprec = $listaprec[0];
		$prod = $db->query("SELECT idproducto as id, carrito.minstock as min, carrito.cant as cant, precio.precio$listaprec as precioventa, codigo.codigo as value, nombprod as data FROM producto left join carrito on(producto_idproducto = idproducto) left join codigo on (producto.codigo_idcodigo = codigo.idcodigo) left join precio on (precio.producto_idproducto = producto.idproducto) WHERE carrito.usuario_idusuario = '$userID'");
		$prods = $db->query("SELECT idproducto as id, precio.precio$listaprec as precioventa, codigo as value, nombprod as data FROM producto left join prodxuser on(producto_idproducto = idproducto) left join codigo on codigo_idcodigo = idcodigo left join precio on (precio.producto_idproducto = producto.idproducto) WHERE prodxuser.usuario_idusuario = '$userID'");
		$cant = $prod->num_rows;
		$cants = $prods->num_rows;
		if ($cant>=1) {
			$producto = array();
			$productos = array();
			while( $producto[]=$prod->fetch_assoc() );
			while( $productos[]=$prods->fetch_assoc() );
			$respuesta['producto']=$producto;
			$respuesta['productos']=$productos;
			$respuesta['cant']=$cant;
			$respuesta['cants']=$cants;
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}
		else
		{
			$respuesta['err']=1;
			$respuesta['txerr']="Sin productos para ese usuario";
		}
	}else{
		$respuesta['err']=2;
		$respuesta['txerr']="No hay session";
	}
	break;
	case 'checkcarr':
	if($_SESSION['tipo']==1){
		$res = $db->query("SELECT COUNT(*) AS total FROM carrito WHERE 1");
		$cant = $res->fetch_array(MYSQLI_NUM);
		$cant =  $cant[0];
		if(!($cant)){
			$respuesta['err']=0;
			$respuesta['txerr']='';
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']='Hay elementos en el carrito';
		}
	}
	break;
	case 'uCarrito':
	$user = $_SESSION['iduser'];
	if (isset($_POST['idprod'])){$id = $_POST['idprod'];}
	if (isset($_POST['cant'])){$cant = $_POST['cant'];}
	if (isset($_POST['userID'])){$userID = $_POST['userID'];}
	$idcar = ultimoId($db,"idcar","carrito")+1;
	$codigo = $db->query("SELECT codigo FROM carrito WHERE usuario_idusuario = '$userID' and listo = 1");
	$codigo = $codigo->fetch_array(MYSQLI_NUM);
	$codigo =  $codigo[0];
	if(!($codigo)){
		$codigo = sprintf('%06d', $idcar);
	}else
	$codigo = sprintf('%06d', $codigo);
	if($id && $cant && $userID){
		$idcar = ultimoId($db,"idcar","carrito")+1;

		$sql = "INSERT INTO carrito(idcar, usuario_idusuario, producto_idproducto, producto_proveedor_idproveedor, minstock, cant, listo, vigencia, codigo) VALUES ('$idcar','$userID','$id',1,0,'$cant',1, DATE_ADD(now(), INTERVAL 25 MINUTE), '$codigo')";
		$iquery = $db->query($sql);
		if($iquery){
			Logear("Usuario ".$user." - actualiza carrito ".$codigo." .");
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="Error al querer insertar!";
		}
	}
	break;
	case 'gCarrito':
	$user = $_SESSION['iduser'];
	if (isset($_POST['idprod'])){$id = $_POST['idprod'];}
	if (isset($_POST['cant'])){$cant = $_POST['cant'];}
	if (isset($_POST['minstock'])){$minstock = $_POST['minstock'];}
	if($id && $cant){
		$codigo = $db->query("select EXISTS (SELECT codigo FROM carrito WHERE listo = 1)");
		$codigo = $codigo->fetch_array(MYSQLI_NUM);
		$codigo =  $codigo[0];
		if(!($codigo)){
			$codigo = ultimoId($db,"idcar","carrito")+1;
			$codigo = sprintf('%06d', 1);
		}else{
			$codigo = $db->query("SELECT max(codigo) FROM carrito WHERE listo = 1");
			$codigo = $codigo->fetch_array(MYSQLI_NUM);
			$codigo =  $codigo[0]*1 + 1;
			$codigo = sprintf('%06d', $codigo);
		}
		$idcar = ultimoId($db,"idcar","carrito")+1;
		$esta = $db->query("select EXISTS ( SELECT producto_idproducto FROM carrito WHERE producto_idproducto = '$id' AND usuario_idusuario = '$user' ) ");
		$esta = $esta->fetch_array(MYSQLI_NUM);
		$esta =  $esta[0];
		if($esta){
			$sql = "UPDATE carrito SET codigo = '$codigo', listo= 0, minstock='$minstock',cant=cant + '$cant',vigencia = DATE_ADD(now(), INTERVAL 25 MINUTE) WHERE producto_idproducto = '$id' AND usuario_idusuario = '$user' ";
		}
		else $sql = "INSERT INTO carrito(idcar, usuario_idusuario, producto_idproducto, producto_proveedor_idproveedor, minstock, cant, listo, vigencia, codigo) VALUES ('$idcar','$user','$id',1,'$minstock','$cant',0, DATE_ADD(now(), INTERVAL 25 MINUTE), '$codigo')";
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
	$listaprec = $db->query("SELECT listaprec FROM usuario WHERE idusuario = '$user'");
	$listaprec = $listaprec->fetch_array(MYSQLI_NUM);
	$listaprec = $listaprec[0];
	$sql = "Select carrito.idcar, carrito.usuario_idusuario, carrito.producto_idproducto, carrito.producto_proveedor_idproveedor, carrito.minstock, carrito.cant, carrito.listo, carrito.vigencia, carrito.codigo, nombproveedor, precio.precio$listaprec * carrito.cant as subtotal, precio.precio$listaprec preciounitario from carrito left join proveedor on idproveedor = producto_proveedor_idproveedor left join usuario on idusuario = carrito.usuario_idusuario left join precio on precio.producto_idproducto = carrito.producto_idproducto where usuario_idusuario = '$user' and listo = 0 order by carrito.producto_idproducto";
	$iquery = $db->query($sql);
	if($iquery){
		$cant = $iquery->num_rows;
		$productos = array();
		while($productos[]=$iquery->fetch_assoc());
		$respuesta['cant'] = $cant;
		$respuesta['productos']=$productos;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al querer insertar!";
	}
	break;
	case 'enviarCarrito':
	$user = $_SESSION['iduser'];
	$problematicos = array();
	if(empty($problematicos)){
		$codigo = $db->query("SELECT max(codigo) FROM carrito WHERE listo = 1");
		$codigo = $codigo->fetch_array(MYSQLI_NUM);
		$codigo =  $codigo[0]*1 + 1;
		$codigo = sprintf('%06d', $codigo);	
		$sql = "UPDATE carrito SET listo=1, codigo = '$codigo' WHERE usuario_idusuario = '$user' and listo=0";
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
	case 'tCarritos':
	$user = $_SESSION['iduser'];
	if(isset($_POST['codigo'])){
		$codigo = $_POST['codigo'];
		$numlength = strlen($codigo);
		if($numlength < 4){
			$codigo = sprintf('%06d', $codigo);
		}
		$sql = "SELECT carrito.codigo, carrito.usuario_idusuario, carrito.idcar,carrito.listo, carrito.minstock, carrito.cant, usuario.nombuser, usuario.zona,carrito.vigencia, carrito.producto_idproducto, producto.nombprod, producto.ubicacion, precio.precio4 preciovta, precio.precio1 preciocto FROM carrito, precio, proveedor, producto, usuario WHERE carrito.producto_idproducto = producto.idproducto and carrito.producto_proveedor_idproveedor = proveedor.idproveedor and usuario.idusuario = carrito.usuario_idusuario and carrito.listo = 1 and proveedor.idproveedor = 1  and carrito.codigo = '$codigo' group by producto_idproducto";
	}else{
		$sql = "SELECT carrito.*,usuario.nombuser, usuario.zona,carrito.vigencia,producto.nombprod, producto.ubicacion, case usuario.listaprec when 1 then precio.precio1 when 2 then precio.precio2 when 3 then precio.precio3 when 4 then precio.precio4 end as 'preciovta', precio.precio1 preciocto FROM carrito, precio, proveedor, producto, usuario WHERE carrito.producto_idproducto = producto.idproducto and carrito.producto_proveedor_idproveedor = proveedor.idproveedor and usuario.idusuario = carrito.usuario_idusuario and precio.producto_idproducto = producto.idproducto and carrito.listo = 1 and proveedor.idproveedor = 1 group by idcar";
	}
	$iquery = $db->query($sql);
	if($iquery){
		$cant = $iquery->num_rows;
		$carritos = array();
		while($carritos[]=$iquery->fetch_assoc());
		$respuesta['carritos']=$carritos;
		$respuesta['cant']=$cant;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al traer los carritos!";
	}

	break;
	case 'okCarrito':
	if(isset($_POST['codcarr'])){
		$codcarr = sprintf('%06d', $_POST['codcarr']);
		$todo = $db->query("SELECT idcar, usuario_idusuario, producto_idproducto, cant, producto_proveedor_idproveedor FROM carrito WHERE codigo = '$codcarr'");
		$todos = array();
		while( $todos[]=$todo->fetch_assoc() );
		$codcarr = $db->query("SELECT max(codigo) FROM venta WHERE 1");
		$codcarr = $codcarr->fetch_array(MYSQLI_NUM);
		$codcarr =  $codcarr[0]*1 + 1;
		$codcarr = sprintf('%06d', $codcarr);
		foreach($todos as $item) {
			if($item['producto_idproducto'] != 0){
				$idProd = $item['producto_idproducto']*1;
				$ideCar = $item['idcar']*1;
				$userID = $item['usuario_idusuario']*1;
				$minstock = $item['minstock']*1;
				$cantProd = $item['cant']*1;
				$proveedorID = $item['producto_proveedor_idproveedor']*1;

				$ideVenta = ultimoId($db,"idventa","venta")+1;
				$cliente = $db->query("SELECT nombuser FROM usuario WHERE idusuario = '$userID'");
				$cliente = $cliente->fetch_array(MYSQLI_NUM);

				$cliente = $cliente[0];

				$zona = $db->query("SELECT zona FROM usuario WHERE idusuario = '$userID'");
				$zona = $zona->fetch_array(MYSQLI_NUM);
				$zona = $zona[0];

				$cantProdOld = $db->query("SELECT cantstock FROM prodxuser WHERE usuario_idusuario = 1 and producto_idproducto = '$idProd'");
				$cantProdOld = $cantProdOld->fetch_array(MYSQLI_NUM);

				$cantProdOld = $cantProd[0];

				$listaprec = $db->query("SELECT listaprec FROM usuario WHERE idusuario = '$userID'");
				$listaprec = $listaprec->fetch_array(MYSQLI_NUM);

				$listaprec = $listaprec[0];

				$precio = $db->query("SELECT precio$listaprec FROM precio WHERE producto_idproducto = '$idProd'");
				$precio = $precio->fetch_array(MYSQLI_NUM);

				$precio = $precio[0];

				$exist = $db->query("SELECT EXISTS(SELECT producto_idproducto FROM prodxuser WHERE producto_idproducto = '$idProd' and usuario_idusuario = '$userID');");
				$exist = $exist->fetch_array(MYSQLI_NUM);

				$exist = $exist[0];
				if($exist){
					$insert = $db->query("UPDATE prodxuser SET minstock='$minstock',cantstock=cantstock + '$cantProd' WHERE producto_idproducto = '$idProd'");
				}
				else{
					$insert = $db->query("INSERT INTO prodxuser(producto_idproducto, usuario_idusuario, habilitado, minstock, cantstock, precio) VALUES ('$idProd','$userID',1,'$minstock','$cantProd',$precio)");
				}
				$monto = $precio*$cantProd*1;

				$insertVenta = $db->query("INSERT INTO venta(idventa, fechaventa, zona, monto, usuario_idusuario, producto_idproducto, cant, estado_idestado, cliente, codigo) VALUES ('$ideVenta',now(),'$zona','$monto',1,'$idProd','$cantProd',3,'$cliente', '$codcarr')");

				$libro = $db->query("INSERT INTO libro(producto_idproducto, usuario_idusuario, timestamp, cantidad, proveedor_idproveedor) VALUES ('$idProd','$userID',now(),-'$cantProd','$proveedorID')");
				Logear("Se ha actualizado libro - Producto #".$idProd." - Cantidad: -".$cantProd." - Usuario: #".$userID);
				$total = $cantProdOld*1 - $cantProd *1;
				$total = $total*1;
				$descuento = $db->query("UPDATE prodxuser SET cantstock='$total'  WHERE producto_idproducto = '$idProd' and usuario_idusuario = 1");
				$limpiar = $db->query("DELETE FROM carrito WHERE idcar = '$ideCar'");
				if($libro && $descuento && $limpiar){
					$respuesta['err']=0;
					$respuesta['txerr']="";
				}
			}
		}
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error - No recibi codigo";
	}

	break;
	case 'dCarrito':
	$user = $_SESSION['iduser'];
	if(isset($_POST['codigo'])){
		$codigo = $_POST['codigo'];
		$codigo = $codigo*1;
		$codigo = sprintf('%06d', $codigo);
		$sql = "DELETE FROM carrito WHERE codigo = '$codigo'";
	}else{
		if(isset($_POST['idcarr'])){
			$idcarr = $_POST['idcarr'];
			$sql = "DELETE FROM carrito WHERE idcar = '$idcarr'";
		}else{
			$sql = "DELETE FROM carrito WHERE usuario_idusuario = '$user'";
		}
	}
	$iquery = $db->query($sql);
	if($iquery){
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al querer eliminar!";
	}
	break;
	/* * * * * * * Caso Productos * * * * * * */
	case 'tInv':
	if (isset($_SESSION['hayusuario'])){
		$userID = $_SESSION['iduser'];
		$tipoprecio = $db->query("SELECT listaprec FROM usuario WHERE idusuario = '$userID';");
		$tipoPre=armarArrayCon($tipoprecio);
		$precioTipo = "precio".$tipoPre[0]['listaprec']*1;
		$prods=$db->query("SELECT idproducto, nombprod, obsprod, cantstock, minstock, pathimagen, ubicacion, proveedor_idproveedor, nombrecat, codigo, $precioTipo preciocto, preciovta, nombremodelo, nombremarca, nombproveedor
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
	}else{
		logout();
	}
	break;
	case 'tProd':
	if (isset($_POST["ide"]) && !empty($_POST["ide"])){
		$id = $_POST["ide"]*1;
		$prods = $db->query("SELECT idproducto, nombprod, obsprod, cantstock, minstock, ubicacion, proveedor_idproveedor, idcategoria, nombrecat, idcodigo, codigo, preciocto, precio1, idmodelo, nombremodelo,idmarca, nombremarca, idproveedor, nombproveedor, GROUP_CONCAT(DISTINCT tag.idtag,'-', tag.nombtag ORDER BY tag.idtag ASC SEPARATOR ',') as 'tags',  GROUP_CONCAT(DISTINCT imagen.pathimagen ORDER BY imagen.pathimagen ASC SEPARATOR ',') as 'pathimagen' FROM
			producto
			left join prodxuser on prodxuser.producto_idproducto = idproducto
			left join imgxprod on imgxprod.producto_idproducto = idproducto
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
		$prods=$db->query("SELECT idproducto, nombprod, obsprod, cantstock, minstock, pathimagen, ubicacion, proveedor_idproveedor, nombrecat, codigo, preciocto, precio1, nombremodelo, nombremarca, nombproveedor FROM producto
			left join prodxuser on prodxuser.producto_idproducto = idproducto
			left join imgxprod on imgxprod.producto_idproducto = idproducto
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
	case 'tUpdateProd':
	if(isset($_SESSION['iduser'])){
		$userID=$_SESSION['iduser'];
		$idprod = $_POST['ide']*1;
		$producto = $db->query("SELECT minstock, cantstock, preciovta FROM prodxuser WHERE producto_idproducto = '$idprod' and usuario_idusuario = '$userID'");
		if($producto){
			$respuesta['err']=0;
			$respuesta['txerr']="";
			$respuesta['producto']=$producto->fetch_assoc();
		}
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error de sesion";
	}
	break;
	case 'tProds':
	$productos = $db->query("SELECT idproducto as 'value', nombprod as 'data' FROM producto WHERE 1 GROUP BY idproducto");
	if($productos){
		$cantProd = $productos->num_rows;
		if($cantProd>0){
			$aProds = array();
			while( $xx=$productos->fetch_assoc() ) $aProds[]=$xx;
			$respuesta['err']=0;
			$respuesta['txerr']="";
			$respuesta['producto']=$aProds;
			$respuesta['cant']=$cantProd;
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No hay productos";
		}
	}else{
		$respuesta['err']=2;
		$respuesta['txerr']="Error de bd";

	}
	break;

	case 'dProdxUser':
	if(isset($_SESSION['iduser'])){
		$userID=$_SESSION['iduser'];
		$ide = $_POST['ide']*1;
		Logear("Usuario: #".$userID." - Eliminar producto: #".$ide);
		$producto = $db->query("DELETE FROM prodxuser WHERE producto_idproducto = '$ide' and usuario_idusuario = '$userID';");
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
	case 'dProd':
	if(isset($_SESSION['iduser'])){
		$userID=$_SESSION['iduser'];
		$ide = $_POST['ide']*1;
		Logear("Usuario: #".$userID." - Eliminar producto: #".$ide);
		$categoria = $db->query("SELECT nombproveedor from proveedor left join producto on idproveedor = proveedor_idproveedor WHERE idproducto = '$ide';");
		$fila = $categoria->fetch_Row();
		$categoria = trim($fila[0]);
		$files = glob("../cli/img/productos/".$categoria."/".$ide."/*");
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
		$elimino = rmdir("../cli/img/productos/".$categoria."/".$ide);
		if(!$elimino){
			Logear("No se pudieron eliminar algunas imagenes fisicas");
		}
		$limpieza = limpio($db,$ide);
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
	if($_SESSION['hayusuario']){
		$userID=$_SESSION['iduser'];
		$tipoUser=$_SESSION['tipo'];
		Logear("Usuario: #".$userID." - Subir producto");
		$prov = $_POST['prov']*1;
		$nombre = $_POST['nombre'];
		$ubicacion = $_POST['ubicacion'];
		$habilitado = $_POST['habilitado']*1;
		$preciocosto = $_POST['preciocosto']*1;
		$precioventa = $_POST['precioventa']*1;
		$cant = $_POST['cant']*1;
		$minstock = $_POST['minstock']*1;
		$obs = $_POST['obs'];
		$cat = $_POST['cat']*1;
		$marca = $_POST['marca']*1;
		if(isset($_POST['modelo'])){
			$modelo = $_POST['modelo']*1;
		}else{
			if(isset($_POST['modeloN'])){
				$modeloN = $_POST['modeloN'];
			}
		}
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

		if($modeloN){
			$ideModel = ultimoId($db, "idmodelo", "modelo")+1;
			$db->query("INSERT INTO modelo(idmodelo, nombremodelo, marca_idmarca) VALUES ('$ideModel','$modeloN','$marca')");
			$modelo = $ideModel;
		}

		if(!($nuevo)){
			$ide = $_POST['ide'];
			limpio($db, $ide);
			$prod = $db->query("UPDATE producto SET nombprod='$nombre',obsprod='$obs',ubicacion='$ubicacion',proveedor_idproveedor='$prov',categoria_idcategoria='$cat',modelo_idmodelo = '$modelo',modelo_marca_idmarca='$marca', codigo_idcodigo='$codIde', preciocto = '$preciocosto' WHERE idproducto = '$ide'");
			$prodxuser = $db->query("UPDATE prodxuser set cantstock = '$cant' WHERE usuario_idusuario = '$userID' and producto_idproducto = '$ide', minstock = '$minstock'");
		}else{
			$nuevo = 1;
			$ide = ultimoId($db,"idproducto","producto")+1;
			$prod = $db->query("INSERT INTO producto(idproducto, nombprod, obsprod, ubicacion, preciocto, proveedor_idproveedor, categoria_idcategoria,modelo_idmodelo, modelo_marca_idmarca, codigo_idcodigo, creador) VALUES ('$ide','$nombre','$obs','$ubicacion','$preciocosto','$prov','$cat','$modelo','$marca','$codIde', '$userID')");
		}
		if($prod){
			$idprecio = ultimoId($db,"idprecio","precio")+1;
			$precios = $db->query("INSERT INTO precio(idprecio, precio1, precio2, precio3, precio4, producto_idproducto) VALUES ('$idprecio','$precioventa','$precioventa'*1.1,'$precioventa'*1.2,'$precioventa'*1.3,'$ide')");
			$prodxuser = $db->query("INSERT INTO prodxuser(producto_idproducto, usuario_idusuario, cantstock, minstock) VALUES ('$ide','$userID', '$cant', '$minstock')");
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
			$storeFolder = '../cli/img/productos/'.$prov.'/'.$ide;
			$targetPath = dirname( __FILE__ ).$ds.$storeFolder.$ds;
			if(!file_exists($targetPath)){
				mkdir($targetPath, 0777, true);
				chmod($targetPath, 0777);
			}
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
					chmod($targetFile, 0777);
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
				/*$idImg = ultimoId($db,"idimagen","imagen")+1;
				$tipo = "gif";
				$nombreFichero = $idImg.".".$tipo;
				$pathFichero = $prov."/".$ide."/".$nombreFichero;
				$targetFile = $targetPath.$nombreFichero;
				$fichero = '../cli/img/productos/default-50x50.gif';
				$nuevo_fichero = $targetPath.'default-50x50.gif';
				if (!copy($fichero, $nuevo_fichero)) {
					Logear("Usuario: #".$userID." - Error al querer insertar imagen generica en subida de producto");
					error_log("Error al copiar $fichero a $nuevo_fichero\n ");
				}else{$moveSuccess = true;}*/
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
				if(!($hayImg)){
					if($prod){
						Logear("Usuario: #".$userID." - Subido producto");
						$respuesta['err'] = 0;
						$respuesta['txerr'] = "OK - Producto creado";
					}
				}else{
					Logear("Usuario: #".$userID." - Error al copiar img a la carpeta");
					$respuesta['err'] = 4;
					$respuesta['txerr'] = "Error al subir/actualizar producto";
				}
			}
		}else{
			Logear("Fallo el insert a Producto.");
			$respuesta['err'] = 5;
			$respuesta['txerr'] = "Error al subir/actualizar producto";
		}
	}else{
		Logear("Usuario no autorizado trato de crear un producto.");
		$respuesta['err'] = 6;
		$respuesta['txerr'] = "Acceso no autorizado";
	}
	break;
	case 'uProd':
	if(isset($_SESSION['hayusuario'])){
		$userID=$_SESSION['iduser'];
		if (isset($_POST["idprod"]) && !empty($_POST["idprod"]) && $_POST["idprod"]!=""){
			$ide = $_POST['idprod']*1;
			$cant = $_POST['cant']*1;
			$preciovta = $_POST['preciovta']*1;
			$stockmin = $_POST['stock']*1;
			$sql = $db->query("UPDATE prodxuser SET cantstock='$cant', preciovta= '$preciovta', minstock = '$stockmin'  WHERE producto_idproducto = '$ide' and usuario_idusuario = '$userID'");
			Logear("El usuario ".$userID." se ha actualizado el producto ".$ide.". Cantidad #".$cant. " - Stock minimo: #".$stockmin. " - Precio venta: $".$preciovta);
			$respuesta['err'] = 0;
			$respuesta['txerr'] = "OK - Producto actualizado";
		}else{
			$respuesta['err'] = 1;
			$respuesta['txerr'] = "No especifica producto.";

		}
	}else{
		Logear("Usuario no identificado queriendo modificar cantidad de producto!");
		$respuesta['err'] = 2;
		$respuesta['txerr'] = "No esta logueado.";
	}
	break;
	/* * * * * * * Caso Categorias * * * * * * */
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

	/* * * * * * * Casos Tienda * * * * * * */
	case 'tStore':
	$user=$_SESSION['iduser'];
	$tipoprecio = $db->query("SELECT listaprec FROM usuario WHERE idusuario = '$user';");
	$tipoPre=armarArrayCon($tipoprecio);
	$precioTipo = "precio".$tipoPre[0]['listaprec']*1;
	$prods = $db->query("SELECT idproducto, nombprod, obsprod, cantstock, categoria_idcategoria, modelo_idmodelo, modelo_marca_idmarca, ubicacion, proveedor_idproveedor,$precioTipo preciocto, pathimagen, GROUP_CONCAT(DISTINCT tagxprod.tag_idtag SEPARATOR ',') as 'tags' FROM producto, imgxprod, imagen, precio, prodxuser, tagxprod where producto.idproducto = tagxprod.producto_idproducto and producto.idproducto = imgxprod.producto_idproducto and imagen.idimagen = imgxprod.imagen_idimagen and precio.producto_idproducto = producto.idproducto and /*prodxuser.usuario_idusuario = 1*/ producto.proveedor_idproveedor = 1 and producto.creador = 1 group by idproducto");
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
	case 'tFiltros':
	$user=$_SESSION['iduser'];
	$categorias = $db->query("SELECT idcategoria, nombrecat FROM categoria WHERE 1;");
	$cantCats = $categorias->num_rows;
	$marcas = $db->query("SELECT idmarca, nombremarca FROM marca WHERE 1;");
	$cantBrands = $marcas->num_rows;
	$etiquetas = $db->query("SELECT idtag, nombtag, importancia weight FROM tag WHERE 1;");
	$cantTag = $etiquetas->num_rows;
	if($categorias && $marcas){
		$aCats = array();
		$aBran = array();
		$aTags = array();
		while( $xx=$categorias->fetch_assoc() ) $aCats[]=$xx;
		while( $xx=$marcas->fetch_assoc() ) $aBran[]=$xx;
		while( $xx=$etiquetas->fetch_assoc() ) $aTags[]=$xx;
		$respuesta['categorias']=$aCats;
		$respuesta['marcas']=$aBran;
		$respuesta['tags']=$aTags;
		$respuesta['cantCat']=$cantCats;
		$respuesta['cantBran']=$cantBrands;
		$respuesta['cantTags']=$cantTag;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al traer productos";
	}
	break;
	case 'filtroCat':
	$laCat = $_POST['cat'];
	$user=$_SESSION['iduser'];
	$tipoprecio = $db->query("SELECT listaprec FROM usuario WHERE idusuario = '$user';");
	$tipoPre=armarArrayCon($tipoprecio);
	$precioTipo = "precio".$tipoPre[0]['listaprec']*1;
	$prods = $db->query("SELECT idproducto, nombprod, obsprod, cantstock, ubicacion, proveedor_idproveedor,$precioTipo preciocto, pathimagen FROM producto, imgxprod, imagen, precio, prodxuser where producto.categoria_idcategoria = '$laCat' and producto.idproducto = imgxprod.producto_idproducto and imagen.idimagen = imgxprod.imagen_idimagen and precio.producto_idproducto = producto.idproducto and prodxuser.usuario_idusuario = 1 group by idproducto");
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
	/* * * * * * * Caso Marca * * * * * * */

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
	/* * * * * * * Caso Modelos * * * * * * */

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

	case 'tMod':
	if(isset($_POST['idMod'])){
		$id = $_POST['idMod']*1;
		$modelo = $db->query("SELECT idmodelo, nombremodelo AS 'nombModelo' FROM modelo WHERE idmodelo = '$id';");
		$marca = $db->query("SELECT idmarca, nombremarca AS 'nombMarca' FROM marca
			left join modelo on modelo.marca_idmarca = marca.idmarca WHERE modelo.idmodelo = '$id';");
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

	/* * * * * * * Caso Tags * * * * * * */

	case 'tTag':
	if(isset($_POST['idtag'])){
		$idtag = $_POST['idtag']*1;
		$tag = $db->query("SELECT idtag, nombtag nombretag, importancia FROM tag WHERE idtag = '$idtag';");
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
	$etiquetas = $db->query("SELECT idtag AS 'value', nombtag AS 'data' , importancia FROM tag WHERE 1;");
	$cantTag = $etiquetas->num_rows;
	if ($cantTag>=1) {
		$tags = array();
		while( $xx=$etiquetas->fetch_assoc() ) $tags[]=$xx;
		$respuesta['tags']=$tags;
		$respuesta['cant']=$cantTag;
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Sin tags";
	}
	break;
	case 'dTag':
	if(isset($_POST['ideTag'])){
		$elId = $_POST['ideTag']* 1;
		$dquery = $db->query("Delete from tagxprod where tag_idtag = '$elId'");
		$dquery = $db->query("Delete from tag where idtag = '$elId'");
		if($dquery){
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="Error al querer eliminar";
		}
	}
	else {
		$respuesta['err']=1;
		$respuesta['txerr']="No hay id!";
	}
	break;
	case 'gTag':
	if(isset($_POST['idTag'])){$ide = $_POST['idTag']*1;}else{$ide = 0;}
	if(isset($_POST['nombtag'])){$nombre = $_POST['nombtag'];}
	if(isset($_POST['importancia'])){$importancia = $_POST['importancia'];}
	$rta = creaTag($db, $ide, $nombre, $importancia);
	if($rta){
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error de BD";
	}
	break;

	/* * * * * * * Caso Marcas Modelos Tags * * * * * * */

	case 'tMMT':
	$marcas = $db->query("SELECT idmarca, nombremarca AS 'nombMarca' FROM marca WHERE 1;");
	$modelo = $db->query("SELECT modelo.idmodelo, modelo.nombremodelo AS 'nombModelo', marca.nombremarca AS 'nombMarca' FROM modelo
		left join marca on marca.idmarca = modelo.marca_idmarca WHERE 1;");
	$tag = $db->query("SELECT idtag, nombtag AS 'nombTag', importancia FROM tag WHERE 1;");
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

	/* * * * * * * Caso Precios * * * * * * */
	case 'tPrecio':
	if(isset($_POST['idprecio'])){
		$ide = $_POST['idprecio'];
		$precios = $db->query("SELECT precio.*,producto.nombprod ,producto.idproducto FROM precio,producto WHERE precio.producto_idproducto = producto.idproducto and precio.idprecio = '$ide' GROUP BY precio.idprecio");
	}else{
		$precios = $db->query("SELECT precio.*,producto.nombprod FROM precio,producto WHERE precio.producto_idproducto = producto.idproducto GROUP BY precio.idprecio");
	}
	if($precios){
		$cantPrec = $precios->num_rows;
		if($cantPrec>0){
			$aPrecios = array();
			while( $xx=$precios->fetch_assoc() ) $aPrecios[]=$xx;
			$respuesta['err']=0;
			$respuesta['txerr']="";
			$respuesta['precios']=$aPrecios;
			$respuesta['cant']=$cantPrec;
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No hay precios";
		}
	}else{
		$respuesta['err']=2;
		$respuesta['txerr']="Error de bd";

	}
	break;

	case 'gPrecio':
	if(isset($_POST['idprec'])){$elId = $_POST['idprec']* 1;}
	if(isset($_POST['precio1'])){$precio1 = $_POST['precio1']*1;}
	if(isset($_POST['precio2'])){$precio2 = $_POST['precio2']*1;}
	if(isset($_POST['precio3'])){$precio3 = $_POST['precio3']*1;}
	if(isset($_POST['precio4'])){$precio4 = $_POST['precio4']*1;}
	if(isset($_POST['prod'])){$prod = $_POST['prod']*1;}
	$esta = $db->query("select EXISTS ( SELECT idproducto FROM producto WHERE idproducto = '$prod' ) ");
	$esta = $esta->fetch_array(MYSQLI_NUM);
	$esta =  $esta[0];
	if($esta){
		$precio = $db->query("UPDATE precio SET precio1='$precio1', precio2='$precio2', precio3='$precio3', precio4='$precio4', producto_idproducto='$prod' WHERE producto_idproducto = '$prod'");
	}else{
		$elId = ultimoId($db,"idprecio","precio")+1;
		$precio = $db->query("INSERT INTO precio(idprecio, precio1, precio2, precio3, precio4, producto_idproducto) VALUES ('$elId', '$precio1', '$precio2', '$precio3', '$precio4', '$prod')");
	}
	if($precio){
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}else{
		$respuesta['err']=1;
		$respuesta['txerr']="Error al subir o actualizar";
	}
	break;

	case 'dPrecio':
	if(isset($_POST['idprec'])){
		$elId = $_POST['idprec']* 1;
		$dquery = $db->query("Delete from precio where idprecio = '$elId'");
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

	/* * * * * * * Caso Proveedores * * * * * * */

	case 'tProve':
	if(isset($_POST['ideProve'])){
		$idProv = $_POST['ideProve'];
		$proveedores = $db->query("Select * from proveedor where idproveedor = '$idProv'");
	}else{
		$proveedores = $db->query("Select * from proveedor");
	}
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

	case 'gProve':
	if(isset($_POST['idProv'])){ $elId = $_POST['idProv']* 1; }
	if(isset($_POST['nombre'])){
		$nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$nombreProv = mysqli_real_escape_string($db,$nombre);
	}
	if(isset($_POST['email'])){
		$email = filter_var($_POST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$emailProv = mysqli_real_escape_string($db,$email);
	}
	if(isset($_POST['telefono'])){
		$telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$telefonoProv = mysqli_real_escape_string($db,$telefono);
	}
	if(isset($_POST['direccion'])){
		$direccion = filter_var($_POST['direccion'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
		$direccionProv = mysqli_real_escape_string($db,$direccion);
	}
	if($elId){
		$proveedor = $db->query("UPDATE proveedor SET nombproveedor='$nombreProv', telefono = '$telefonoProv', email = '$emailProv', direccion = '$direccionProv' WHERE idproveedor='$elId';");
	}else{
		$elId = ultimoId($db,"idproveedor","proveedor")+1;
		$proveedor = $db->query("INSERT INTO proveedor(idproveedor, nombproveedor, telefono, email, direccion) VALUES ('$elId','$nombreProv', '$telefonoProv', '$emailProv', '$direccionProv');");
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

	/* * * * * * * Caso Libro * * * * * * */

	case 'tbook':
	$libro = $db->query("SELECT libro.*, nombuser, nombproveedor, nombprod FROM libro left join usuario on usuario_idusuario = idusuario left join proveedor on proveedor_idproveedor = idproveedor left join producto on producto_idproducto = idproducto WHERE 1;");
	$cant = $libro->num_rows;
	if ($cant>=1) {
		$book = array();
		while( $book[]=$libro->fetch_assoc() );
		$respuesta['libro']=$book;
		$respuesta['cant']=$cant;
		$respuesta['err']=0;
		$respuesta['txerr']="";
	}
	else
	{
		$respuesta['err']=1;
		$respuesta['txerr']="Sin libro";
	}
	break;

	/* * * * * * * Caso VentasOS * * * * * * */
	case 'tProdsB':
	if(isset($_SESSION['iduser'])){
		$prods = $db->query("SELECT idproducto as id, codigo as value, nombprod as data FROM producto left join codigo on codigo_idcodigo = idcodigo WHERE 1");
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
			$respuesta['txerr']="Sin productos.";
		}
	}else{
		$respuesta['err']=2;
		$respuesta['txerr']="No hay session";
	}
	break;
	case 'tPrecB':
	if( (isset($_GET['prodID'])) && (isset($_GET['userID']) ) ){
		$userID = $_GET['userID'];
		$prodID = $_GET['prodID'];
		$listaprec = $db->query("SELECT listaprec FROM usuario WHERE idusuario = '$userID'");
		$listaprec = $listaprec->fetch_array(MYSQLI_NUM);
		$listaprec = $listaprec[0];
		$precios = $db->query("SELECT idprecio id, precio.precio$listaprec precio FROM precio WHERE precio.producto_idproducto = '$prodID'");
		if($precios){
			$cantPrec = $precios->num_rows;
			if($cantPrec>0){
				$aPrecios = array();
				while( $xx=$precios->fetch_assoc() ) $aPrecios[]=$xx;
				$respuesta['err']=0;
				$respuesta['txerr']="";
				$respuesta['precios']=$aPrecios;
				$respuesta['cant']=$cantPrec;
			}else{
				$respuesta['err']=1;
				$respuesta['txerr']="No hay precios";
			}
		}else{
			$respuesta['err']=2;
			$respuesta['txerr']="Error de bd";

		}
	}
	break;
	case 'gVentaOS':
	$ideUser = $_SESSION['iduser'];
	$productos = $_POST['productos'];
	$cliente = $_POST['cliente'];
	$codVenta = ultimoId($db,"codigo","venta")*1+1;
	$observacion = $_POST['observacion'];
	$ubicacion = $_POST['ubicacion'];
	foreach($productos as $item)
	{
		$ideProd = $item['id']*1;
		$codigoProd = $item['cod'];
		$precio = $item['precio']*1;
		$cant = $item['cant']*1;
		$user = $item['user']*1;
		$monto = $precio * $cant * 1;
		$estado = 3;

		$zona = $db->query("SELECT zona FROM usuario WHERE idusuario = '$ideUser' ");
		$zona = $zona->fetch_array(MYSQLI_NUM);
		$zona =  $zona[0];

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
		$cantOld = $db->query("SELECT cantstock FROM prodxuser WHERE producto_idproducto = '$ideProd' and usuario_idusuario = '$ideUser'");
		$cantOld = $cantOld->fetch_array(MYSQLI_NUM);
		$cantOld = $cantOld[0];
		$cantResul = $cantOld - $cant;
		$cantResul = $cantResul*1;
		$descuento = $db->query("UPDATE prodxuser SET cantstock='$cantResul' WHERE usuario_idusuario = '$ideUser' and producto_idproducto = '$ideProd'");
		$aumento = $db->query("UPDATE prodxuser SET cantstock='$cant' WHERE usuario_idusuario = '$user' and producto_idproducto = '$ideProd'");
		if($descuento && $aumento){
			$insertVenta = $db->query("INSERT INTO venta(idventa, fechaventa, observacion, ubicacion, zona, monto, usuario_idusuario, producto_idproducto, cant, estado_idestado, codigo, cliente) VALUES ('$ideVenta',now(),'$observacion','$ubicacion','$zona','$monto','$ideUser','$ideProd','$cant','$estado', LPAD($codVenta*1, 4, '0'), '$cliente' )");
			if($insertVenta){
				$libro = $db->query("INSERT INTO libro(producto_idproducto, usuario_idusuario, timestamp, cantidad, proveedor_idproveedor) VALUES ('$ideProd','$ideUser',now(),-'$cant','$proveedorID')");
				Logear("Se ha actualizado libro - Producto #".$ideProd." - Cantidad: -".$cant." - Usuario: #".$ideUser);
				$respuesta['err']=0;
				$respuesta['txerr']="";
			}else{
				$respuesta['err']=2;
				$respuesta['txerr']="Error al insertar la venta.";
			}
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No se pudo aumentar ni descontar stock.";
		}
	}
	/* * * * * * * Caso Ventas * * * * * * */
	case 'tProdsA':
	if(isset($_SESSION['iduser'])){
		$user = $_SESSION['iduser'];
		$prods = $db->query("SELECT idproducto as id, preciovta as precioventa, codigo as value, nombprod as data FROM producto left join prodxuser on(producto_idproducto = idproducto) left join codigo on codigo_idcodigo = idcodigo WHERE prodxuser.usuario_idusuario = '$user'");
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
			$respuesta['txerr']="Sin productos para ese usuario";
		}
	}else{
		$respuesta['err']=2;
		$respuesta['txerr']="No hay session";
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
	case 'gVenta':
	$ideUser = $_SESSION['iduser'];
	$productos = $_POST['productos'];
	$codVenta = ultimoId($db,"codigo","venta")*1+1;
	foreach($productos as $item)
	{
		$ideProd = $item['id']*1;
		$codigoProd = $item['cod'];
		$precio = $item['precio']*1;
		$cant = $item['cant']*1;
		$monto = $precio * $cant * 1;
		$estado = 3;

		$zona = $db->query("SELECT zona FROM usuario WHERE idusuario = '$ideUser' ");
		$zona = $zona->fetch_array(MYSQLI_NUM);
		$zona =  $zona[0];

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

		$cantOld = $db->query("SELECT cantstock FROM prodxuser WHERE producto_idproducto = '$ideProd' and usuario_idusuario = '$ideUser'");
		$cantOld = $cantOld->fetch_array(MYSQLI_NUM);
		$cantOld = $cantOld[0];
		$cantResul = $cantOld - $cant;
		$cantResul = $cantResul*1;
		if($cantResul > 0){
			$descuento = $db->query("UPDATE prodxuser SET cantstock='$cantResul' WHERE usuario_idusuario = '$ideUser' and producto_idproducto = '$ideProd'");

			$insertVenta = $db->query("INSERT INTO venta(idventa, fechaventa, zona, monto, usuario_idusuario, producto_idproducto, cant, estado_idestado, codigo) VALUES ('$ideVenta',now(),'$zona','$monto','$ideUser','$ideProd','$cant','$estado', LPAD($codVenta*1, 4, '0') )");

			$libro = $db->query("INSERT INTO libro(producto_idproducto, usuario_idusuario, timestamp, cantidad, proveedor_idproveedor) VALUES ('$ideProd','$ideUser',now(),-'$cant','$proveedorID')");
			Logear("Se ha actualizado libro - Producto #".$ideProd." - Cantidad: -".$cant." - Usuario: #".$ideUser);
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['idprod']=$ideProd;
			$respuesta['err']=2;
			$respuesta['txerr']="No hay stock suficiente";
		}
	}
	break;
	case 'uVentaEstado':
	if(isset($_SESSION['iduser'])){
		$ideVenta = $_POST['idVenta']*1;
		$estado = $_POST['estado']*1;
		$update = $db->query("UPDATE venta SET estado_idestado='$estado' WHERE idventa = '$ideVenta'");
		if($update){
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No se pudo actualizar";
		}

	}else{
		logout();
	}
	break;
	case 'dVenta':
	if(isset($_SESSION['iduser']) && $_SESSION['tipo'] == 1){
		$idventa = $_POST['idventa'];
		$dVenta = $db->query("Delete from venta where idventa = '$idventa'");
		if($dVenta){
			$respuesta['err']=0;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No se pudo eliminar";
		}
	}
	break;
	case 'tVentasMes':
	if(isset($_SESSION['iduser']) && $_SESSION['tipo'] == 1){
		$xx=setlocale(LC_TIME,"es_AR.UTF-8");
		$minimo=date("Y-m-01",strtotime("-11 months"));
		for($i=0; $i<12; $i++)
			$meses[]=ucwords(strftime("%b",strtotime(date("Y-m-d",strtotime("+ {$i} MONTHS",strtotime($minimo))))));
		//$query = $db->query("SELECT usuario_idusuario, sum(monto) as vendido, DATE_FORMAT(fechaventa, '%m') AS mes FROM venta WHERE usuario_idusuario in (Select idusuario from usuario where 1) and fechaventa between(\"$minimo\",\"" . date("Y-m-d") . "\") GROUP BY usuario_idusuario, mes");
		$query = $db->query("SELECT nombuser, sum(monto) as vendido, DATE_FORMAT(fechaventa, '%m') AS mes FROM venta, usuario WHERE usuario_idusuario = idusuario and usuario_idusuario in (Select idusuario from usuario where 1) and fechaventa > NOW() - INTERVAL 12 MONTH GROUP BY usuario_idusuario, mes;");
		$todo=array();
		$cant = $query->num_rows;
		while ($fila = $query->fetch_assoc()) {
			$todo[$i]['name']=$fila['nombuser'];
			$todo[$i]['data']=array(0,0,0,0,0,0,0,0,0,0,0,0);
			$todo[$i]['name']=$fila['nombuser'];
			$todo[$i]['data'][$fila['mes']*1]+=$fila['vendido'];
			$i++;
		}
		$respuesta["reportes"] = $todo;
	}
	break;
	case 'tVentaPie':
	if(isset($_SESSION['iduser']) && $_SESSION['tipo'] == 1){
		$sql = "select sum(monto) monto, nombuser, nombprod nombre from venta join usuario on(venta.usuario_idusuario = usuario.idusuario) join producto on(producto.idproducto = venta.producto_idproducto) where venta.estado_idestado = 3 GROUP BY usuario_idusuario, producto_idproducto order by usuario_idusuario, producto_idproducto";
		$query = $db->query($sql);
		$cant = $query->num_rows;
		if($query){
			$ventas = array();
			while( $xx=$query->fetch_assoc() ) $ventas[]=$xx;
			$respuesta['ventas']=$ventas;
			$respuesta['cant']=$cant;
		}
	}
	break;
	case 'tVentaColum':
	if(isset($_SESSION['iduser']) && $_SESSION['tipo'] == 1){
		$ventas =$db->query("select sum(monto) monto, producto.nombprod, usuario.nombuser from venta join usuario on(venta.usuario_idusuario = usuario.idusuario) join producto on(venta.producto_idproducto = producto.idproducto) where usuario_idusuario in (select idusuario from usuario) and producto_idproducto in(select idproducto from producto) GROUP by usuario_idusuario, producto_idproducto");
		$cant = $ventas->num_rows;
		if($ventas){
			$ventasA = array();
			while( $xx=$ventas->fetch_assoc() ) $ventasA[]=$xx;
			$respuesta['ventas']=$ventasA;
			$respuesta['cant']=$cant;
		}
	}
	break;
	case 'tVenta':
	if(isset($_POST['user']) && $_POST['user'] != 0){
		$userID = $_POST['user']*1;
		if($userID == 1){
			$groupBy = "group by idventa";
		}else{
			$groupBy = "group by usuario_idusuario, idventa";
		}
		$sql = "Select idventa, codigo, IFNULL(observacion, 0) observacion, IFNULL(venta.ubicacion, 0) ubicacion, fechaventa, usuario.zona, monto, usuario_idusuario, producto_idproducto, cant, IFNULL(venta.cliente, 0) cliente, estado_idestado, nombestado, producto.nombprod, usuario.nombuser from venta join producto on (venta.producto_idproducto = producto.idproducto) join usuario on (venta.usuario_idusuario = usuario.idusuario) join estado on (venta.estado_idestado = idestado) where usuario_idusuario = '$userID'";
	}else{
		$sql = "Select venta.*, producto.nombprod, nombremarca, nombremodelo , usuario.nombuser, nombestado from venta join estado on (venta.estado_idestado = idestado) join producto on (venta.producto_idproducto = producto.idproducto) join marca on(producto.modelo_marca_idmarca = marca.idmarca) join modelo on(producto.modelo_idmodelo = modelo.idmodelo) join usuario on (venta.usuario_idusuario = usuario.idusuario) where venta.usuario_idusuario != 1";
	}
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
	case 'checkCant':
	if(isset($_SESSION['iduser'])){
		$userID = $_SESSION['iduser'];
		$idprod = $_POST['prod']*1;
		$todo = $db->query("SELECT minstock, cantstock FROM prodxuser WHERE usuario_idusuario = '$userID' and producto_idproducto='$idprod'");
		$todo = $todo->fetch_array(MYSQLI_NUM);
		$minstock =  $todo[0];
		$cant =  $todo[1];
		if($todo){
			$respuesta['err']=0;
			$respuesta['minstock']=$minstock*1;
			$respuesta['cant']=$cant*1;
			$respuesta['txerr']="";
		}else{
			$respuesta['err']=1;
			$respuesta['txerr']="No pudimos determinar cantidad";
		}

	}else{
		logout();
	}
	break;
	/* * * * * * * Caso Pedidos * * * * * * */
	case 'tPedido':
	$prods=$db->query("SELECT idproducto id, nombprod, minstock, cantstock, pathimagen, proveedor_idproveedor, nombrecat, codigo.codigo, preciocto, precio1, nombremodelo, nombremarca, nombproveedor, sum(venta.cant) vendido FROM producto
		left join prodxuser on prodxuser.producto_idproducto = idproducto
		left join imgxprod on imgxprod.producto_idproducto = idproducto
		left join imagen on imagen_idimagen = idimagen
		left join venta on venta.producto_idproducto = idproducto
		left join categoria on categoria_idcategoria = idcategoria
		left join proveedor on proveedor_idproveedor = idproveedor
		left join codigo on codigo_idcodigo = idcodigo
		left join precio on idproducto = precio.producto_idproducto
		left join marca on modelo_marca_idmarca = idmarca
		left join modelo on modelo_idmodelo = idmodelo WHERE prodxuser.usuario_idusuario = 1 and venta.usuario_idusuario = 1 and fechaventa <= NOW() and fechaventa >= Date_add(Now(),interval - 1 month) and venta.cliente IS NOT NULL group by idproducto");
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
	case 'uMin':
	if(isset($_SESSION['iduser']) && $_SESSION['iduser']==1){
		$userID = $_SESSION['iduser'];
		$idProd = $_POST['prod']*1;
		$min = $_POST['min']*1;
		$prods=$db->query("UPDATE prodxuser SET minstock='$min' WHERE producto_idproducto='$idProd' and usuario_idusuario = '$userID'");
	}
	break;
	/* * * * * * * Caso Imagenes * * * * * * */

	case 'dImg':
	$ideImg = $_POST['ideImg']*1;
	$exist = $db->query("SELECT EXISTS(SELECT pathimagen FROM imagen WHERE idimagen = '$ideImg')");
	$exist = $exist->fetch_array(MYSQLI_NUM);
	$exist =  $exist[0];
	if($exist){
		$pathImg = $db->query("SELECT pathimagen FROM imagen WHERE idimagen = '$ideImg'");
		$pathImg = $pathImg->fetch_row();
		$pathImg=trim($pathImg[0]);
		if (file_exists("../cli/img/productos/".$pathImg)) {
			$elimino = unlink("../cli/img/productos/".$pathImg);
		}else{
			$elimino = true;
		}
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
}
echo json_encode($respuesta);

/* * * * * * * * * * Auxiliares * * * * * * * * * */
function checkUser($tipo){
	if($_SESSION['tipo'] != $tipo){
		Logear("Acceso al sistema con usuario no logueado.");
		logout();
	}
}
function logout(){
	unset($_SESSION['iduser']);
	unset($_SESSION['usuario']);
	unset($_SESSION['hayusuario']);
	unset($_SESSION['tipo']);
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
	$xx=fopen("./tmp/log.txt","a");
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
function creaTag($db, $elId, $nomb, $importancia){
	$importancia = $importancia *1;
	$nombtag = filter_var($nomb, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
	$nombreTag = mysqli_real_escape_string($db,$nombtag);
	if($elId){
		$tag = $db->query("UPDATE tag SET nombtag='$nombreTag', importancia='$importancia' WHERE idtag='$elId';");
	}else{
		$elId = ultimoId($db,"idtag","tag")+1;
		$tag = $db->query("INSERT INTO tag(idtag, nombtag, importancia) VALUES ('$elId','$nombreTag',$importancia);");
	}
	return $tag;
}

function limpio($db,$ide){
	$tagxprod=$db->query("DELETE FROM tagxprod WHERE producto_idproducto = '$ide';");
	$prodxuser=$db->query("DELETE FROM prodxuser WHERE producto_idproducto = '$ide';");
	$precioxprod=$db->query("DELETE FROM precio WHERE producto_idproducto = '$ide';");
	return($tagxprod && $prodxuser && $precioxprod);
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
