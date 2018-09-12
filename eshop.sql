-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 02, 2018 at 09:40 PM
-- Server version: 5.7.22-0ubuntu0.17.10.1-log
-- PHP Version: 7.1.17-0ubuntu0.17.10.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eshop`
--

-- --------------------------------------------------------

--
-- Table structure for table `carrito`
--

CREATE TABLE `carrito` (
  `idcar` int(11) NOT NULL,
  `usuario_idusuario` int(11) NOT NULL,
  `producto_idproducto` int(11) NOT NULL,
  `producto_proveedor_idproveedor` int(11) NOT NULL,
  `minstock` int(11) NOT NULL,
  `cant` int(11) NOT NULL,
  `listo` tinyint(1) NOT NULL DEFAULT '0',
  `vigencia` datetime NOT NULL,
  `codigo` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `idcategoria` int(11) NOT NULL,
  `nombrecat` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`idcategoria`, `nombrecat`) VALUES
(1, 'Funda'),
(2, 'Templado');

-- --------------------------------------------------------

--
-- Table structure for table `codigo`
--

CREATE TABLE `codigo` (
  `idcodigo` int(11) NOT NULL,
  `codigo` varchar(13) NOT NULL,
  `usuario_idusuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `codigo`
--

INSERT INTO `codigo` (`idcodigo`, `codigo`, `usuario_idusuario`) VALUES
(1, '00001', 1),
(2, '1', 1),
(3, '1', 1),
(4, '1', 1),
(5, '1', 1),
(6, '1', 1),
(7, '00007', 1),
(8, '1', 1),
(9, '1', 1),
(10, '000010', 1),
(11, '000010', 1),
(12, '00007', 1),
(13, '000010', 1),
(14, '000014', 2),
(15, '000015', 2),
(16, '00001', 1),
(17, '00007', 1),
(18, '000010', 1),
(19, '00001', 1),
(20, '000020', 2),
(21, '000021', 2),
(22, '000022', 1),
(23, '00007', 1),
(24, '00007', 1),
(25, '000022', 1),
(26, '000022', 1),
(27, '000027', 1),
(28, '000028', 1),
(29, '000029', 1),
(30, '000030', 1),
(31, '000031', 1),
(32, '000032', 1),
(33, '000033', 1),
(34, '000034', 1),
(35, '000035', 1),
(36, '000036', 1),
(37, '000037', 1),
(38, '000038', 1),
(39, '000039', 1),
(40, '000040', 1),
(41, '000041', 1),
(42, '000042', 1),
(43, '000043', 1),
(44, '000044', 1),
(45, '000045', 1),
(46, '000046', 1),
(47, '000047', 1),
(48, '000047', 1),
(49, '000049', 3),
(50, '000032', 1),
(51, '000034', 1),
(52, '000049', 1),
(53, '000049', 1),
(54, '000049', 1),
(55, '000032', 1),
(56, '000034', 1),
(57, '000057', 1),
(58, '000057', 1),
(59, '000059', 1),
(60, '000060', 1),
(61, '000059', 1),
(62, '000062', 2),
(63, '000063', 2),
(64, '000064', 2),
(65, '000064', 1),
(66, '0hfghf', 2),
(67, '12312afsa', 2),
(68, '12312afsa', 1),
(69, '41f12', 2),
(70, '000059', 1),
(71, '000059', 1),
(72, '000032', 1),
(73, '000060', 1),
(74, '000074', 1),
(75, '000074', 1),
(76, '000074', 1),
(77, '000077', 1),
(78, '000077', 1),
(79, '000077', 1),
(80, '000077', 1),
(81, '000081', 1),
(82, '000082', 1),
(83, '000083', 1),
(84, '000084', 2),
(85, '000085', 1),
(86, '000086', 1),
(87, '000087', 1),
(88, '000088', 1),
(89, '000089', 1),
(90, '000090', 1),
(91, '000091', 1),
(92, '000092', 1);

-- --------------------------------------------------------

--
-- Table structure for table `estado`
--

CREATE TABLE `estado` (
  `idestado` int(11) NOT NULL,
  `nombestado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `estado`
--

INSERT INTO `estado` (`idestado`, `nombestado`) VALUES
(1, 'Abierta'),
(2, 'En Proceso'),
(3, 'Cerrada');

-- --------------------------------------------------------

--
-- Table structure for table `imagen`
--

CREATE TABLE `imagen` (
  `idimagen` int(11) NOT NULL,
  `pathimagen` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `imagen`
--

INSERT INTO `imagen` (`idimagen`, `pathimagen`) VALUES
(2, 'Ondas Sonoras/3/2.jpeg'),
(3, 'Ondas Sonoras/4/3.png'),
(4, 'Ondas Sonoras/5/4.jpeg'),
(5, 'Ondas Sonoras/6/5.jpeg'),
(6, 'Ondas Sonoras/7/6.png'),
(7, 'Ondas Sonoras/8/7.jpeg'),
(8, 'Ondas Sonoras/8/8.gif'),
(9, 'Ondas Sonoras/8/9.gif'),
(10, 'Ondas Sonoras/8/10.jpeg'),
(11, 'Ondas Sonoras/9/12.png'),
(12, 'Ondas Sonoras/10/15.jpeg'),
(14, 'Ondas Sonoras/3/14.gif'),
(15, 'Ondas Sonoras/10/15.jpeg'),
(16, 'Ondas Sonoras/10/16.gif'),
(17, 'Ondas Sonoras/10/17.gif'),
(19, 'Ondas Sonoras/3/2.jpeg'),
(22, 'Ondas Sonoras/13/22.gif'),
(23, 'Ondas Sonoras/13/23.gif'),
(24, 'Ondas Sonoras/13/24.jpeg'),
(25, 'Todo Cell/14/25.png'),
(26, 'Ondas Sonoras/15/26.jpeg'),
(27, 'Ondas Sonoras/11/27.png'),
(28, 'Ondas Sonoras/11/28.jpeg'),
(29, 'Ondas Sonoras/1/29.jpeg'),
(30, 'Ondas Sonoras/12/30.jpeg'),
(31, 'Todo Cell/16/31.jpeg'),
(32, 'Todo Cell/16/32.jpeg'),
(33, 'Todo Cell/16/33.gif'),
(34, 'Ondas Sonoras/16/34.jpeg'),
(35, 'Ondas Sonoras/16/35.gif'),
(36, 'Ondas Sonoras/18/36.png');

-- --------------------------------------------------------

--
-- Table structure for table `imgxprod`
--

CREATE TABLE `imgxprod` (
  `imagen_idimagen` int(11) NOT NULL,
  `producto_idproducto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `imgxprod`
--

INSERT INTO `imgxprod` (`imagen_idimagen`, `producto_idproducto`) VALUES
(29, 1),
(2, 3),
(14, 3),
(19, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 7),
(10, 8),
(11, 9),
(12, 10),
(15, 10),
(16, 10),
(17, 10),
(27, 11),
(28, 11),
(30, 12),
(24, 13),
(25, 14),
(26, 15),
(34, 16),
(35, 16),
(36, 18);

-- --------------------------------------------------------

--
-- Table structure for table `libro`
--

CREATE TABLE `libro` (
  `idlibro` int(11) UNSIGNED NOT NULL,
  `producto_idproducto` int(11) UNSIGNED NOT NULL,
  `usuario_idusuario` int(11) UNSIGNED NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cantidad` int(11) NOT NULL,
  `proveedor_idproveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `libro`
--

INSERT INTO `libro` (`idlibro`, `producto_idproducto`, `usuario_idusuario`, `timestamp`, `cantidad`, `proveedor_idproveedor`) VALUES
(57, 4, 2, '2018-05-11 23:22:10', -5, 1),
(58, 1, 3, '2018-05-11 23:28:05', -12, 1),
(59, 3, 3, '2018-05-11 23:28:07', -321, 1),
(60, 4, 3, '2018-05-11 23:28:10', -177, 1),
(61, 5, 3, '2018-05-11 23:28:12', -110, 1),
(62, 6, 3, '2018-05-11 23:28:15', -12, 1),
(63, 7, 3, '2018-05-11 23:28:17', -15, 1),
(64, 8, 3, '2018-05-11 23:28:19', -55, 1),
(65, 9, 3, '2018-05-11 23:28:21', -34, 1),
(66, 10, 3, '2018-05-11 23:28:23', -23, 1),
(67, 1, 2, '2018-05-11 23:34:08', -50, 1),
(68, 1, 2, '2018-05-11 23:38:36', -12, 1),
(69, 3, 2, '2018-05-11 23:40:53', -12, 1),
(70, 1, 2, '2018-05-11 23:44:33', -15, 1),
(71, 6, 3, '2018-05-12 00:00:40', -14, 1),
(72, 6, 3, '2018-05-12 00:01:05', -2, 1),
(73, 6, 3, '2018-05-12 00:10:09', -25, 1),
(74, 4, 3, '2018-05-21 16:19:07', -124, 1),
(75, 1, 3, '2018-05-21 16:20:18', -3, 1),
(76, 5, 2, '2018-05-22 16:10:15', -15, 1),
(77, 4, 2, '2018-05-22 16:11:25', -25, 1),
(78, 7, 2, '2018-05-22 16:54:07', -15, 1),
(79, 3, 2, '2018-05-22 17:22:16', -24, 1),
(80, 3, 2, '2018-05-22 17:26:12', -150, 1),
(81, 3, 2, '2018-05-22 17:27:53', -13, 1),
(82, 3, 2, '2018-05-22 17:29:46', -1, 1),
(83, 4, 2, '2018-05-22 17:30:40', -2, 1),
(84, 3, 2, '2018-05-22 17:30:40', -1, 1),
(85, 4, 2, '2018-05-22 18:55:32', -2, 1),
(86, 4, 2, '2018-05-22 19:55:28', -1, 1),
(87, 6, 2, '2018-05-22 19:55:28', -12, 1),
(88, 1, 2, '2018-05-22 23:06:16', -136, 1),
(89, 3, 2, '2018-05-22 23:06:21', -15, 1),
(90, 4, 2, '2018-05-22 23:06:22', -1, 1),
(91, 8, 2, '2018-05-22 23:06:23', -2, 1),
(92, 9, 2, '2018-05-22 23:06:25', -1, 1),
(93, 11, 2, '2018-05-22 23:06:26', -1, 1),
(94, 1, 2, '2018-05-23 00:02:16', -12, 0),
(95, 3, 2, '2018-05-23 00:02:17', -3, 0),
(96, 4, 2, '2018-05-23 00:02:17', -4, 0),
(97, 5, 2, '2018-05-23 00:02:17', -21, 0),
(98, 6, 2, '2018-05-23 00:02:17', -1, 0),
(99, 1, 2, '2018-05-23 00:36:55', -1, 0),
(100, 3, 2, '2018-05-23 00:36:56', -1, 0),
(101, 7, 2, '2018-05-23 00:36:56', -1, 0),
(102, 9, 2, '2018-05-23 00:36:56', -1, 0),
(103, 1, 3, '2018-05-23 00:40:44', -1, 0),
(104, 3, 3, '2018-05-23 00:40:44', -1, 0),
(105, 4, 3, '2018-05-23 00:40:44', -1, 0),
(106, 5, 3, '2018-05-23 00:40:45', -1, 0),
(107, 1, 2, '2018-06-01 18:31:48', -25, 0),
(108, 3, 2, '2018-06-01 18:31:49', -24, 0),
(109, 4, 2, '2018-06-01 18:31:49', -12, 0),
(110, 5, 2, '2018-06-01 18:31:49', -32, 0),
(111, 1, 2, '2018-06-01 18:32:58', -23, 0),
(112, 3, 2, '2018-06-01 18:32:58', -11, 0),
(113, 4, 2, '2018-06-01 18:32:59', 1, 0),
(114, 1, 2, '2018-06-02 18:00:01', -22, 0),
(115, 4, 2, '2018-06-02 18:00:01', -15, 0),
(116, 3, 2, '2018-06-02 18:00:01', -1, 0),
(117, 1, 2, '2018-06-02 23:57:32', -24, 0),
(118, 4, 2, '2018-06-02 23:57:32', -55, 0),
(119, 3, 2, '2018-06-02 23:57:32', -33, 0),
(120, 7, 2, '2018-06-02 23:57:32', -4, 0),
(121, 5, 2, '2018-06-02 23:57:32', -58, 0),
(122, 8, 2, '2018-06-02 23:57:33', -44, 0),
(123, 6, 2, '2018-06-02 23:57:33', -12, 0),
(124, 3, 2, '2018-06-03 00:01:15', -44, 1),
(125, 4, 2, '2018-06-03 00:01:15', -12, 1),
(126, 5, 2, '2018-06-03 00:01:16', -12, 1),
(127, 1, 2, '2018-06-03 00:01:16', -22, 1);

-- --------------------------------------------------------

--
-- Table structure for table `marca`
--

CREATE TABLE `marca` (
  `idmarca` int(11) NOT NULL,
  `nombremarca` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `marca`
--

INSERT INTO `marca` (`idmarca`, `nombremarca`) VALUES
(0, 'Generico'),
(1, 'Samsung'),
(2, 'Apple'),
(3, 'Motorola');

-- --------------------------------------------------------

--
-- Table structure for table `modelo`
--

CREATE TABLE `modelo` (
  `idmodelo` int(11) NOT NULL,
  `nombremodelo` varchar(45) DEFAULT NULL,
  `marca_idmarca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `modelo`
--

INSERT INTO `modelo` (`idmodelo`, `nombremodelo`, `marca_idmarca`) VALUES
(0, 'Generico', 0),
(1, 'Galaxy S2', 1),
(2, 'Galaxy s3', 1),
(3, 'Iphone6', 2),
(4, 'Iphone7', 2),
(5, 'E2', 3),
(6, 'repiola', 0);

-- --------------------------------------------------------

--
-- Table structure for table `precio`
--

CREATE TABLE `precio` (
  `idprecio` int(11) NOT NULL,
  `precio1` int(11) DEFAULT '0',
  `precio2` int(11) DEFAULT '0',
  `precio3` int(11) DEFAULT '0',
  `precio4` int(11) DEFAULT '0',
  `producto_idproducto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `precio`
--

INSERT INTO `precio` (`idprecio`, `precio1`, `precio2`, `precio3`, `precio4`, `producto_idproducto`) VALUES
(4, 100, 110, 120, 130, 4),
(5, 100, 110, 120, 130, 5),
(6, 100, 110, 120, 130, 6),
(7, 100, 110, 120, 130, 7),
(8, 100, 110, 120, 130, 8),
(9, 1, 2, 3, 4, 9),
(15, 345, 380, 414, 448, 3),
(16, 115, 125, 135, 200, 10),
(19, 100, 110, 120, 130, 13),
(20, 100, 110, 120, 130, 14),
(21, 200, 220, 240, 260, 15),
(22, 100, 110, 120, 130, 11),
(23, 200, 220, 240, 260, 1),
(24, 100, 110, 120, 130, 12),
(25, 100, 110, 120, 130, 16),
(26, 100, 110, 120, 130, 17),
(27, 100, 110, 120, 130, 18),
(28, 100, 110, 120, 130, 19),
(29, 100, 110, 120, 130, 20);

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `idproducto` int(11) NOT NULL,
  `creador` int(11) NOT NULL DEFAULT '1',
  `nombprod` varchar(45) NOT NULL,
  `obsprod` varchar(100) NOT NULL,
  `ubicacion` varchar(100) NOT NULL DEFAULT 'Santa Rosa',
  `proveedor_idproveedor` int(11) NOT NULL,
  `categoria_idcategoria` int(11) NOT NULL,
  `codigo_idcodigo` int(11) NOT NULL,
  `modelo_idmodelo` int(11) NOT NULL,
  `modelo_marca_idmarca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`idproducto`, `creador`, `nombprod`, `obsprod`, `ubicacion`, `proveedor_idproveedor`, `categoria_idcategoria`, `codigo_idcodigo`, `modelo_idmodelo`, `modelo_marca_idmarca`) VALUES
(1, 1, 'Funda Samsung S2', 'Sin observacion', 'Sin ubicacion', 1, 1, 72, 1, 1),
(3, 1, 'Funda Samsung S3', 'Sin observacion', 'Sin ubicacion', 1, 2, 34, 2, 1),
(4, 1, 'Funda Apple 6', 'Sin observacion', 'Sin ubicacion', 1, 1, 35, 3, 2),
(5, 1, 'Funda Loca', 'Sin observacion', 'Sin ubicacion', 1, 1, 36, 2, 1),
(6, 1, 'Funda Fuego', 'Sin observacion', 'Sin ubicacion', 1, 2, 37, 3, 2),
(7, 1, 'Fundas Vaa', 'Sin observacion', 'Sin ubicacion', 1, 1, 38, 3, 2),
(8, 1, 'Funda mickey', 'Sin observacion', 'Sin ubicacion', 1, 1, 46, 2, 1),
(9, 1, 'Funda colorida', 'Sin observacion', 'Sin ubicacion', 1, 1, 47, 3, 2),
(10, 1, 'Nueva de cliente', 'Sin observacion', 'Sin ubicacion', 1, 2, 49, 2, 1),
(11, 1, 'Uno nuevo', 'Sin observaciones', 'Sin ubicacion', 1, 1, 71, 0, 0),
(12, 1, 'Sin Nombree', 'Sin observacion', 'Sin ubicacion', 1, 1, 73, 0, 0),
(13, 1, 'Sin Nombre Cliente', 'Sin observacion', 'Sin ubicacion', 1, 1, 64, 0, 0),
(14, 1, 'Creado cliente', 'Sin observacion', 'Sin ubicacion', 2, 1, 68, 0, 0),
(15, 1, 'Otro cliente1', 'asda', 'Sin ubicacion', 1, 2, 69, 0, 0),
(16, 1, 'Nuevo con permisos', 'Sin observacion', 'Sin ubicacion', 1, 1, 80, 0, 0),
(17, 1, 'Sin Nombre', 'Sin observacion', 'Sin ubicacion', 1, 1, 81, 0, 0),
(18, 2, 'Mioynotuyo', 'Sin observacion', 'Sin ubicacion', 1, 1, 84, 0, 0),
(19, 1, 'Sin Nombre', 'Sin observacion', 'Sin ubicacion', 1, 1, 90, 0, 0),
(20, 1, 'Sin Nombre', 'Sin observacion', 'Sin ubicacion', 1, 1, 92, 6, 0);

-- --------------------------------------------------------

--
-- Table structure for table `prodxuser`
--

CREATE TABLE `prodxuser` (
  `producto_idproducto` int(11) NOT NULL,
  `usuario_idusuario` int(11) NOT NULL,
  `habilitado` tinyint(1) NOT NULL DEFAULT '1',
  `minstock` int(11) NOT NULL DEFAULT '0',
  `cantstock` int(11) NOT NULL,
  `precio` int(11) DEFAULT NULL,
  `preciovta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `prodxuser`
--

INSERT INTO `prodxuser` (`producto_idproducto`, `usuario_idusuario`, `habilitado`, `minstock`, `cantstock`, `precio`, `preciovta`) VALUES
(1, 1, 1, 0, -22, NULL, NULL),
(1, 2, 1, 0, 116, 220, NULL),
(3, 1, 1, 0, -44, NULL, NULL),
(3, 2, 1, 0, 159, 922, 1383),
(3, 3, 1, 0, 114, 448, NULL),
(4, 1, 1, 0, -12, 397, 397),
(4, 2, 1, 0, 169, 100, 1515),
(4, 3, 1, 0, 152, 130, 130),
(5, 1, 1, 0, -12, 188, 188),
(5, 2, 1, 0, 533, 113, 170),
(5, 3, 1, 0, 234, 130, 130),
(6, 1, 1, 0, -12, 650, 650),
(6, 2, 1, 0, 18, 779, 1169),
(6, 3, 1, 0, 34, 130, 130),
(7, 1, 1, 0, -4, 735, 735),
(7, 2, 1, 0, 404, 790, 1185),
(7, 3, 1, 0, 20, 130, 130),
(8, 1, 1, 0, -44, 724, 724),
(8, 2, 1, 0, 285, 995, 1493),
(9, 1, 1, 0, -1, 414, 414),
(9, 2, 1, 0, 282, 795, 1193),
(10, 1, 1, 0, 150, NULL, NULL),
(10, 2, 1, 0, 156, 140, 210),
(11, 1, 1, 0, 0, NULL, NULL),
(12, 1, 1, 0, 1, NULL, NULL),
(13, 1, 1, 0, 1, NULL, NULL),
(13, 2, 1, 0, 353, 530, 795),
(14, 1, 1, 0, 1, 100, NULL),
(14, 2, 1, 0, 271, 104, 156),
(15, 2, 1, 10, 15, NULL, 250),
(16, 1, 1, 0, 1, NULL, NULL),
(17, 1, 1, 0, 1, NULL, NULL),
(18, 2, 1, 0, 1, NULL, NULL),
(19, 1, 1, 0, 1, NULL, NULL),
(20, 1, 1, 0, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `proveedor`
--

CREATE TABLE `proveedor` (
  `idproveedor` int(11) NOT NULL,
  `nombproveedor` varchar(45) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `proveedor`
--

INSERT INTO `proveedor` (`idproveedor`, `nombproveedor`, `telefono`, `email`) VALUES
(1, 'Ondas Sonoras', '1234566', 'mail@mail.com'),
(2, 'Todo Cell', '1234565', 'mail@mail.com'),
(3, 'Nuevo', '123', 'q@q');

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `idtag` int(11) NOT NULL,
  `nombtag` varchar(55) NOT NULL,
  `importancia` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`idtag`, `nombtag`, `importancia`) VALUES
(1, 'funda', 2),
(2, 'tag', 3),
(3, 'nuevo', 1),
(4, 'nueva', 5),
(5, 'persona', 2),
(6, 'j', 1),
(7, 'a', 1),
(8, 'gdas', 1),
(9, 'loco', 15),
(10, 'delcliente', 1),
(11, 'repiola', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tagxprod`
--

CREATE TABLE `tagxprod` (
  `tag_idtag` int(11) NOT NULL,
  `producto_idproducto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tagxprod`
--

INSERT INTO `tagxprod` (`tag_idtag`, `producto_idproducto`) VALUES
(1, 1),
(2, 1),
(7, 1),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(3, 11),
(3, 12),
(7, 13),
(7, 14),
(8, 15),
(3, 16),
(2, 17),
(7, 17),
(10, 18),
(2, 19),
(11, 20);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `idusuario` int(11) NOT NULL,
  `habilitadouser` int(1) NOT NULL,
  `nombuser` varchar(45) NOT NULL,
  `contuser` varchar(45) NOT NULL,
  `emailuser` varchar(45) NOT NULL,
  `tipo` tinyint(1) NOT NULL DEFAULT '2',
  `listaprec` tinyint(1) NOT NULL DEFAULT '1',
  `zona` varchar(200) NOT NULL DEFAULT 'Santa Rosa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`idusuario`, `habilitadouser`, `nombuser`, `contuser`, `emailuser`, `tipo`, `listaprec`, `zona`) VALUES
(1, 1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'm@tres-erres.com.ar', 1, 1, 'Santa Rosa'),
(2, 1, 'cliente1', 'd5a8d8c7ab0514e2b8a2f98769281585', 'cliente1@cliente.com', 2, 2, 'Santa Rosa'),
(3, 1, 'cliente2', '6dcd0e14f89d67e397b9f52bb63f5570', 'cliente2@cliente2.com', 2, 4, 'General Pico');

-- --------------------------------------------------------

--
-- Table structure for table `venta`
--

CREATE TABLE `venta` (
  `idventa` int(11) NOT NULL,
  `fechaventa` date NOT NULL,
  `monto` double NOT NULL,
  `usuario_idusuario` int(11) NOT NULL,
  `producto_idproducto` int(11) NOT NULL,
  `cant` int(11) NOT NULL DEFAULT '1',
  `estado_idestado` int(11) NOT NULL,
  `codigo` varchar(11) NOT NULL,
  `zona` varchar(200) NOT NULL,
  `cliente` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `venta`
--

INSERT INTO `venta` (`idventa`, `fechaventa`, `monto`, `usuario_idusuario`, `producto_idproducto`, `cant`, `estado_idestado`, `codigo`, `zona`, `cliente`) VALUES
(2, '2018-05-11', 2436, 1, 1, 12, 3, '0002', 'Santa Rosa', NULL),
(3, '2018-05-11', 143808, 1, 3, 321, 3, '0003', 'Santa Rosa', NULL),
(4, '2018-05-11', 23010, 1, 4, 177, 3, '0004', 'Santa Rosa', NULL),
(5, '2018-05-11', 14300, 1, 5, 110, 3, '0005', 'Santa Rosa', NULL),
(6, '2018-05-11', 1560, 1, 6, 12, 3, '0006', 'Santa Rosa', NULL),
(7, '2018-05-11', 1950, 1, 7, 15, 3, '0007', 'Santa Rosa', NULL),
(8, '2018-05-11', 7150, 1, 8, 55, 3, '0008', 'Santa Rosa', NULL),
(9, '2018-05-11', 4420, 1, 9, 34, 3, '0009', 'Santa Rosa', NULL),
(10, '2018-05-11', 2990, 1, 10, 23, 3, '0010', 'Santa Rosa', NULL),
(11, '2018-05-11', 8600, 1, 1, 50, 3, '0011', 'Santa Rosa', NULL),
(12, '2018-05-11', 2064, 1, 1, 12, 3, '0012', 'Santa Rosa', NULL),
(13, '2018-05-11', 4560, 1, 3, 12, 3, '0013', 'Santa Rosa', NULL),
(14, '2018-05-11', 2580, 2, 1, 15, 3, '0014', 'Santa Rosa', NULL),
(15, '2018-05-11', 1820, 3, 6, 14, 3, '0015', 'Santa Rosa', NULL),
(16, '2018-05-11', 260, 3, 6, 2, 3, '0016', 'Santa Rosa', NULL),
(17, '2018-05-11', 3250, 1, 6, 25, 3, '0017', 'Santa Rosa', NULL),
(18, '2018-05-21', 16120, 3, 4, 124, 3, '0018', 'Santa Rosa', NULL),
(19, '2018-05-21', 609, 1, 1, 3, 3, '0019', 'Santa Rosa', NULL),
(20, '2018-05-22', 17775, 2, 7, 15, 3, '0020', 'Santa Rosa', NULL),
(21, '2018-05-22', 33192, 2, 3, 24, 3, '0021', 'Santa Rosa', NULL),
(22, '2018-05-22', 207450, 2, 3, 150, 3, '0022', 'Santa Rosa', NULL),
(23, '2018-05-22', 17979, 2, 3, 13, 3, '0023', 'Santa Rosa', NULL),
(24, '2018-05-22', 1383, 2, 3, 1, 3, '0024', 'Santa Rosa', NULL),
(25, '2018-05-22', 3030, 2, 4, 2, 3, '0025', 'Santa Rosa', NULL),
(26, '2018-05-22', 1383, 2, 3, 1, 3, '0025', 'Santa Rosa', NULL),
(27, '2018-05-22', 3030, 2, 4, 2, 3, '0026', 'Santa Rosa', NULL),
(28, '2018-05-22', 1515, 2, 4, 1, 3, '0027', 'Santa Rosa', NULL),
(29, '2018-05-22', 14028, 2, 6, 12, 3, '0027', 'Santa Rosa', NULL),
(30, '2018-05-22', 2064, 1, 1, 12, 3, '0001', 'Santa Rosa', 'cliente1'),
(31, '2018-05-22', 1140, 1, 3, 3, 3, '0001', 'Santa Rosa', 'cliente1'),
(32, '2018-05-22', 440, 1, 4, 4, 3, '0001', 'Santa Rosa', 'cliente1'),
(33, '2018-05-22', 2310, 1, 5, 21, 3, '0001', 'Santa Rosa', 'cliente1'),
(34, '2018-05-22', 110, 1, 6, 1, 3, '0001', 'Santa Rosa', 'cliente1'),
(35, '2018-05-22', 172, 1, 1, 1, 3, '00035', 'Santa Rosa', 'cliente1'),
(36, '2018-05-22', 380, 1, 3, 1, 3, '00035', 'Santa Rosa', 'cliente1'),
(37, '2018-05-22', 110, 1, 7, 1, 3, '00035', 'Santa Rosa', 'cliente1'),
(38, '2018-05-22', 2, 1, 9, 1, 3, '00035', 'Santa Rosa', 'cliente1'),
(39, '2018-05-22', 203, 1, 1, 1, 3, '0039', 'General Pico', 'cliente2'),
(40, '2018-05-22', 448, 1, 3, 1, 3, '0039', 'General Pico', 'cliente2'),
(41, '2018-05-22', 130, 1, 4, 1, 3, '0039', 'General Pico', 'cliente2'),
(42, '2018-05-22', 130, 1, 5, 1, 3, '0039', 'General Pico', 'cliente2'),
(43, '2018-06-01', 5500, 1, 1, 25, 3, '0043', 'Santa Rosa', 'cliente1'),
(44, '2018-06-01', 9120, 1, 3, 24, 3, '0043', 'Santa Rosa', 'cliente1'),
(45, '2018-06-01', 1320, 1, 4, 12, 3, '0043', 'Santa Rosa', 'cliente1'),
(46, '2018-06-01', 3520, 1, 5, 32, 3, '0043', 'Santa Rosa', 'cliente1'),
(47, '2018-06-01', 5060, 1, 1, 23, 3, '0047', 'Santa Rosa', 'cliente1'),
(48, '2018-06-01', 4180, 1, 3, 11, 3, '0047', 'Santa Rosa', 'cliente1'),
(49, '2018-06-01', -110, 1, 4, -1, 3, '0047', 'Santa Rosa', 'cliente1'),
(50, '2018-06-02', 4840, 1, 1, 22, 3, '0050', 'Santa Rosa', 'cliente1'),
(51, '2018-06-02', 1650, 1, 4, 15, 3, '0050', 'Santa Rosa', 'cliente1'),
(52, '2018-06-02', 380, 1, 3, 1, 3, '0050', 'Santa Rosa', 'cliente1'),
(53, '2018-06-02', 5280, 1, 1, 24, 3, '0001', 'Santa Rosa', 'cliente1'),
(54, '2018-06-02', 6050, 1, 4, 55, 3, '0001', 'Santa Rosa', 'cliente1'),
(55, '2018-06-02', 12540, 1, 3, 33, 3, '0001', 'Santa Rosa', 'cliente1'),
(56, '2018-06-02', 440, 1, 7, 4, 3, '0001', 'Santa Rosa', 'cliente1'),
(57, '2018-06-02', 6380, 1, 5, 58, 3, '0001', 'Santa Rosa', 'cliente1'),
(58, '2018-06-02', 4840, 1, 8, 44, 3, '0001', 'Santa Rosa', 'cliente1'),
(59, '2018-06-02', 1320, 1, 6, 12, 3, '0001', 'Santa Rosa', 'cliente1'),
(60, '2018-06-02', 16720, 1, 3, 44, 3, '0001', 'Santa Rosa', 'cliente1'),
(61, '2018-06-02', 1320, 1, 4, 12, 3, '0001', 'Santa Rosa', 'cliente1'),
(62, '2018-06-02', 1320, 1, 5, 12, 3, '0001', 'Santa Rosa', 'cliente1'),
(63, '2018-06-02', 4840, 1, 1, 22, 3, '0001', 'Santa Rosa', 'cliente1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`idcar`,`usuario_idusuario`,`producto_idproducto`,`producto_proveedor_idproveedor`),
  ADD KEY `fk_carrito_usuario1_idx` (`usuario_idusuario`),
  ADD KEY `fk_carrito_producto1_idx` (`producto_idproducto`,`producto_proveedor_idproveedor`);

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`idcategoria`);

--
-- Indexes for table `codigo`
--
ALTER TABLE `codigo`
  ADD PRIMARY KEY (`idcodigo`,`usuario_idusuario`),
  ADD KEY `fk_codigo_usuario1_idx` (`usuario_idusuario`);

--
-- Indexes for table `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`idestado`);

--
-- Indexes for table `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`idimagen`);

--
-- Indexes for table `imgxprod`
--
ALTER TABLE `imgxprod`
  ADD PRIMARY KEY (`imagen_idimagen`,`producto_idproducto`),
  ADD KEY `fk_imagen_has_producto_producto1_idx` (`producto_idproducto`),
  ADD KEY `fk_imagen_has_producto_imagen1_idx` (`imagen_idimagen`);

--
-- Indexes for table `libro`
--
ALTER TABLE `libro`
  ADD PRIMARY KEY (`idlibro`);

--
-- Indexes for table `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`idmarca`);

--
-- Indexes for table `modelo`
--
ALTER TABLE `modelo`
  ADD PRIMARY KEY (`idmodelo`,`marca_idmarca`),
  ADD KEY `fk_modelo_marca1_idx` (`marca_idmarca`);

--
-- Indexes for table `precio`
--
ALTER TABLE `precio`
  ADD PRIMARY KEY (`idprecio`,`producto_idproducto`),
  ADD UNIQUE KEY `idprecio_UNIQUE` (`idprecio`),
  ADD KEY `fk_precio_producto1_idx` (`producto_idproducto`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`idproducto`,`proveedor_idproveedor`,`categoria_idcategoria`,`codigo_idcodigo`,`modelo_idmodelo`,`modelo_marca_idmarca`),
  ADD UNIQUE KEY `idproducto_UNIQUE` (`idproducto`),
  ADD KEY `fk_producto_proveedor1_idx` (`proveedor_idproveedor`),
  ADD KEY `fk_producto_categoria1_idx` (`categoria_idcategoria`),
  ADD KEY `fk_producto_codigo1_idx` (`codigo_idcodigo`),
  ADD KEY `fk_producto_modelo1_idx` (`modelo_idmodelo`,`modelo_marca_idmarca`);

--
-- Indexes for table `prodxuser`
--
ALTER TABLE `prodxuser`
  ADD PRIMARY KEY (`producto_idproducto`,`usuario_idusuario`),
  ADD KEY `fk_prodxuser_producto1_idx` (`producto_idproducto`),
  ADD KEY `fk_prodxuser_usuario1_idx` (`usuario_idusuario`);

--
-- Indexes for table `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`idproveedor`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`idtag`);

--
-- Indexes for table `tagxprod`
--
ALTER TABLE `tagxprod`
  ADD PRIMARY KEY (`tag_idtag`,`producto_idproducto`),
  ADD KEY `fk_tagxprod_producto1_idx` (`producto_idproducto`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idusuario`);

--
-- Indexes for table `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`idventa`,`usuario_idusuario`,`producto_idproducto`),
  ADD KEY `fk_venta_usuario1_idx` (`usuario_idusuario`),
  ADD KEY `fk_venta_producto1_idx` (`producto_idproducto`),
  ADD KEY `fk_venta_estado1` (`estado_idestado`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `libro`
--
ALTER TABLE `libro`
  MODIFY `idlibro` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;
--
-- AUTO_INCREMENT for table `venta`
--
ALTER TABLE `venta`
  MODIFY `idventa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `fk_carrito_producto1` FOREIGN KEY (`producto_idproducto`,`producto_proveedor_idproveedor`) REFERENCES `producto` (`idproducto`, `proveedor_idproveedor`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_carrito_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `codigo`
--
ALTER TABLE `codigo`
  ADD CONSTRAINT `fk_codigo_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `imgxprod`
--
ALTER TABLE `imgxprod`
  ADD CONSTRAINT `fk_imagen_has_producto_imagen1` FOREIGN KEY (`imagen_idimagen`) REFERENCES `imagen` (`idimagen`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_imagen_has_producto_producto1` FOREIGN KEY (`producto_idproducto`) REFERENCES `producto` (`idproducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `modelo`
--
ALTER TABLE `modelo`
  ADD CONSTRAINT `fk_modelo_marca1` FOREIGN KEY (`marca_idmarca`) REFERENCES `marca` (`idmarca`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `precio`
--
ALTER TABLE `precio`
  ADD CONSTRAINT `fk_precio_producto1` FOREIGN KEY (`producto_idproducto`) REFERENCES `producto` (`idproducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_categoria1` FOREIGN KEY (`categoria_idcategoria`) REFERENCES `categoria` (`idcategoria`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_producto_codigo1` FOREIGN KEY (`codigo_idcodigo`) REFERENCES `codigo` (`idcodigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_producto_modelo1` FOREIGN KEY (`modelo_idmodelo`,`modelo_marca_idmarca`) REFERENCES `modelo` (`idmodelo`, `marca_idmarca`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_producto_proveedor1` FOREIGN KEY (`proveedor_idproveedor`) REFERENCES `proveedor` (`idproveedor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `prodxuser`
--
ALTER TABLE `prodxuser`
  ADD CONSTRAINT `fk_prodxuser_producto1` FOREIGN KEY (`producto_idproducto`) REFERENCES `producto` (`idproducto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_prodxuser_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tagxprod`
--
ALTER TABLE `tagxprod`
  ADD CONSTRAINT `fk_tagxprod_producto1` FOREIGN KEY (`producto_idproducto`) REFERENCES `producto` (`idproducto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_tagxprod_tag1` FOREIGN KEY (`tag_idtag`) REFERENCES `tag` (`idtag`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `fk_venta_estado1` FOREIGN KEY (`estado_idestado`) REFERENCES `estado` (`idestado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_venta_producto1` FOREIGN KEY (`producto_idproducto`) REFERENCES `producto` (`idproducto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_venta_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
