$(document).ready(function (e) {
	console.log("Reportes.");
	init();
});
function refresh() {
	reportes();
}
function init(){
	goFetch();	
  //initCol(datos);
    //initPie();
    //initBar();
  }
  function initCol(datos){
  	var samples = [];
  	$.each(datos.reportes, function(k, v){
     samples.push({name: v["name"], data: v["data"]});
   });
  	
  	Highcharts.chart('grafCol', {
  		chart: {
  			type: 'column'
  		},
  		title: {
  			text: 'Ventas mensuales totales'
  		},
  		subtitle: {
  			text: 'Fuente: Ondas Sonoras'
  		},
  		xAxis: {
  			categories: [
  			'Ene',
  			'Feb',
  			'Mar',
  			'Abr',
  			'May',
  			'Jun',
  			'Jul',
  			'Ago',
  			'Sep',
  			'Oct',
  			'Nov',
  			'Dec'
  			],
  			crosshair: true
  		},
  		yAxis: {
  			min: 0,
  			title: {
  				text: 'Ventas ($)'
  			}
  		},
  		tooltip: {
  			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  			'<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
  			footerFormat: '</table>',
  			shared: true,
  			useHTML: true
  		},
  		plotOptions: {
  			column: {
  				pointPadding: 0.2,
  				borderWidth: 0
  			}
  		},
  		series: samples
  	});
  }
  function goFetch(){
  	$.ajax({
  		type: "post", data: { "t": "tVentasMes"},
  		url: "./macros.php", dataType: 'json', cache: false, success: function (datos, textStatus, jqXHR) {
  			initCol(datos);
  		}
  	});
  }
  function initPie(){
  	Highcharts.chart('grafPie', {
  		chart: {
  			plotBackgroundColor: null,
  			plotBorderWidth: null,
  			plotShadow: false,
  			type: 'pie'
  		},
  		title: {
  			text: 'Browser market shares in January, 2018'
  		},
  		tooltip: {
  			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  		},
  		plotOptions: {
  			pie: {
  				allowPointSelect: true,
  				cursor: 'pointer',
  				dataLabels: {
  					enabled: false
  				},
  				showInLegend: true
  			}
  		},
  		series: [{
  			name: 'Brands',
  			colorByPoint: true,
  			data: [{
  				name: 'Chrome',
  				y: 61.41,
  				sliced: true,
  				selected: true
  			}, {
  				name: 'Internet Explorer',
  				y: 11.84
  			}, {
  				name: 'Firefox',
  				y: 10.85
  			}, {
  				name: 'Edge',
  				y: 4.67
  			}, {
  				name: 'Safari',
  				y: 4.18
  			}, {
  				name: 'Other',
  				y: 7.05
  			}]
  		}]
  	});
  }

  function initBar(){
  	Highcharts.chart('grafBar', {
  		chart: {
  			type: 'column',
  			options3d: {
  				enabled: true,
  				alpha: 15,
  				beta: 15,
  				viewDistance: 25,
  				depth: 40
  			}
  		},

  		title: {
  			text: 'Total fruit consumption, grouped by gender'
  		},

  		xAxis: {
  			categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas'],
  			labels: {
  				skew3d: true,
  				style: {
  					fontSize: '16px'
  				}
  			}
  		},

  		yAxis: {
  			allowDecimals: false,
  			min: 0,
  			title: {
  				text: 'Number of fruits',
  				skew3d: true
  			}
  		},

  		tooltip: {
  			headerFormat: '<b>{point.key}</b><br>',
  			pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
  		},

  		plotOptions: {
  			column: {
  				stacking: 'normal',
  				depth: 40
  			}
  		},

  		series: [{
  			name: 'John',
  			data: [5, 3, 4, 7, 2],
  			stack: 'male'
  		}, {
  			name: 'Joe',
  			data: [3, 4, 4, 2, 5],
  			stack: 'male'
  		}, {
  			name: 'Jane',
  			data: [2, 5, 6, 2, 1],
  			stack: 'female'
  		}, {
  			name: 'Janet',
  			data: [3, 0, 4, 4, 3],
  			stack: 'female'
  		}]
  	});

  }