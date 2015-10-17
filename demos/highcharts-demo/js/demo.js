var chart_one = null,
	chart_two = null;
function demoDisplay() {
	initChart();
	setTimeout(function() {
		initParameterEvent();
	}, 50);
}

function initParameterEvent() {
	var params = {
		tab : "hc-title",
		func : null
	};
	var query = window.location.search;
	var iStart, iEnd;
	if (query.indexOf("?") == 0) {
		query = query.substring(1);
		var paramArr = query.split("&");
		var i,
			param;
		for (i in paramArr) {
			paramSplit = paramArr[i].split("=");
			params[paramSplit[0]] = paramSplit[1];
		}
	}

	$("#mytab a[href='#" + params.tab + "']").trigger("click");
	$("#" + params.tab + " button[data-func='" + params.func + "']").trigger("click");
}

function initChart() {
	chart_one = new Highcharts.Chart(getChartConfiguration("chart-one", "hc-container-one"));
	chart_two = new Highcharts.Chart(getChartConfiguration("chart-two", "hc-container-two"));
}

function resetChart() {
	if (chart_one != null) chart_one.destroy();
	if (chart_two != null) chart_two.destroy();
	initChart();
}

function updateParentIFrameSize() {
	var doc = document;
	var cHeight = Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
    var sHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight)
    var height  = Math.max(cHeight, sHeight)
	
	var ifr = parent.document.getElementById("hc-demo-iframe");
	if (ifr) {
		ifr.style.height = height + "px";
	}
}

function getChartConfiguration(type, renderTo) {
	var chart_conf;
	if (type == "chart-one") {
		chart_conf = chart_one_origin_conf;
	} else if (type == "chart-two") {
		chart_conf = chart_one_origin_conf;
	} else if (type == "3d-pie-chart") {
		chart_conf = pie_chart_with_click_event_conf;
	} else if (type == "time-line-chart") {
		chart_conf = time_line_conf;
	} else {
		chart_conf = chart_one_origin_conf;
	}

	chart_conf.chart.renderTo = renderTo;

	return chart_conf;
}

function showChart(type) {

	var c_one = $("#hc-container-one").parent(),
		c_two = $("#hc-container-two").parent();
	if (type == "left") {
		c_two.hide();
		c_one.removeClass("col-md-6 col-md-12");
		c_one.addClass("col-md-12");
		c_one.show();
	} else if (type == "right") {
		c_one.hide();
		c_two.removeClass("col-md-6 col-md-12");
		c_two.addClass("col-md-12");
		c_two.show();
	} else {
		c_one.removeClass("col-md-6 col-md-12");
		c_two.removeClass("col-md-6 col-md-12");
		c_one.addClass("col-md-6");
		c_two.addClass("col-md-6");
		c_one.show();
		c_two.show();
	}
	$(window).trigger("resize");
}

function addNotify(type, title, text, timeout, icon, iconsmall, color) {
	if (type == "smartadmin") {
		addSmartAdminNotify(title, text, color, icon, iconsmall, timeout);
	} else if (type == "gritter") {
		addGritterNotify(title, text, icon, timeout);
	}
}

function addSmartAdminNotify(title, content, color, icon, iconsmall, timeout) {
	var snConf = {};
	if (title != null) snConf.title = title;
	if (content != null) snConf.content = content;
	if (color != null) snConf.color = color;
	if (icon != null) snConf.icon = icon;
	if (iconsmall != null) snConf.iconSmall = iconsmall;
	if (timeout != null) snConf.timeout = timeout;

	$.smallBox(snConf/*{
		title : "Ding Dong!",
		content : "Someone's at the door...shall one get it sir? <p class='text-align-right'><a href='javascript:void(0);' class='btn btn-primary btn-sm'>Yes</a> <a href='javascript:void(0);' class='btn btn-danger btn-sm'>No</a></p>",
		color : "#296191",
		//timeout: 8000,
		//icon-small : "fa fa-cloud",
		icon : "fa fa-bell swing animated"
	}*/);
}

function addGritterNotify(title, text, image, time) {
	var gnConf = {};
	if (title != null) gnConf.title = title;
	if (text != null) gnConf.text = text;
	if (image != null) gnConf.image = image;
	if (time != null) gnConf.time = time;
	$.gritter.add(gnConf/*{
		// (string | mandatory) the heading of the notification
		title: 'This is a regular notice!',
		// (string | mandatory) the text inside the notification
		text: 'This will fade out after a certain amount of time.',
		// (string | optional) the image to display on the left
		image: 'http://a0.twimg.com/profile_images/59268975/jquery_avatar_bigger.png',
		// (bool | optional) if you want it to fade out on its own or just sit there
		sticky: false, 
		// (int | optional) the time you want it to be alive for before fading out (milliseconds)
		time: 8000,
		// (string | optional) the class name you want to apply directly to the notification for custom styling
		class_name: 'my-class',
	        // (function | optional) function called before it opens
		before_open: function(){
			alert('I am a sticky called before it opens');
		},
		// (function | optional) function called after it opens
		after_open: function(e){
			alert("I am a sticky called after it opens: \nI am passed the jQuery object for the created Gritter element...\n" + e);
		},
		// (function | optional) function called before it closes
		before_close: function(e, manual_close){
	                // the manual_close param determined if they closed it by clicking the "x"
			alert("I am a sticky called before it closes: I am passed the jQuery object for the Gritter element... \n" + e);
		},
		// (function | optional) function called after it closes
		after_close: function(){
			alert('I am a sticky called after it closes');
		}
	}*/);
}


function removeGritterNotify() {
	$.gritter.removeAll();
}

function btnActionHandler(e) {
	var val = $(this).data("func");

	$(".mod-pane").each(function() {
		var mod = $(this).data("mod");
		var content = $(".mod-content[data-id='" + val + "'][data-mod='" + mod + "']");
		$(".mod-body p", this).empty().append(content.html());
	});

	var func = btn_actions[val];
	func();

	updateParentIFrameSize();
}

function highlightAction(func1, func2, timeInterval, time) {
	if (time <= 0) return;
	setTimeout(function() {
		func1();
		setTimeout(function() {
			func2();
			highlightAction(func1, func2, timeInterval, time - 1);
		}, timeInterval);
	}, timeInterval);
}

// refer#1: http://jsfiddle.net/jugal/MtwGc/
function removeHCLegend(chart, seriesI) {
	var item, i;
	item = chart.series[seriesI];
	item.options.showInLegend = false;
    item.legendItem = null;
    chart.legend.destroyItem(item);
    chart.legend.render();
}

function addHCLegend(chart, seriesI) {
	var item, i;
	item = chart.series[seriesI];
	item.options.showInLegend = true;
    chart.legend.renderItem(item);
    chart.legend.render();
}

var chart_one_origin_conf = {
    chart: {
        type: 'line',
        renderTo: 'container',
        zoomType: 'x'
    },
    title: {
        text: 'Monthly Average Rainfall'
    },
    subtitle: {
        text: 'Source: WorldClimate.com'
    },
    xAxis: {
    	title: {
    		text: 'Month'
    	},
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ]
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Rainfall (mm)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        line: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Tokyo',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

    }, {
        name: 'New York',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

    }, {
        name: 'London',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

    }, {
        name: 'Berlin',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

    }]
};

var pie_chart_with_click_event_conf = {
	chart: {
        type: 'pie',
        options3d: {
			enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: 'Browser market shares at a specific website, 2014'
    },
    tooltip: {
        pointFormat: '<span style="color:{point.graphic.color}">{series.name}({point.cn_name})</span>: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            events: {
            	click: function(event) {
            		var desc = "<b>扇区信息</b><br>名称：" + event.point.name + "<br>中文名：" + event.point.cn_name + "<br>值：" + event.point.y + "<br>比例：" + event.point.percentage + " %";
            		addNotify("gritter", "点击事件通知", desc, '5000', null);
            	}
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Browser share',
        data: [
            {
                name: 'Firefox',
                y: 45.0,
                cn_name: '火狐'
            },
            {
                name: 'IE',
                y: 26.8,
                cn_name: '微软'
            },
            {
                name: 'Chrome',
                y: 12.8,
                sliced: true,
                selected: true,
                cn_name: '谷歌'
            },
            {
                name: 'Safari',
                y: 8.5,
                cn_name: '苹果'
            },
            {
                name: 'Opera',
                y: 6.2,
                cn_name: '欧朋'
            },
            {
                name: 'Others',
                y: 0.7,
                cn_name: '其他'
            }
        ]
    }]
};

var time_line_conf = {
	chart: {
        type: 'spline'
    },
    title: {
        text: 'Snow depth at Vikjafjellet, Norway'
    },
    subtitle: {
        text: 'Irregular time data in Highcharts JS'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Snow depth (m)'
        },
        min: 0
    },
    tooltip: {/*
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'*/
    },

    series: [{
        name: 'Depth',
        // Define the data points. All series have a dummy year
        // of 1970/71 in order to be compared on the same x axis. Note
        // that in JavaScript, months start at 0 for January, 1 for February etc.
        data: [[new Date("8 3, 2014, 14:15:00").getTime(), 0],
			[new Date("8 3, 2014, 16:15:00").getTime(), 0.6 ],
			[new Date("8 3, 2014, 18:15:00").getTime(), 0.7 ],
			[new Date("8 3, 2014, 20:15:00").getTime(), 0.8 ],
			[new Date("8 3, 2014, 22:15:00").getTime(), 0.6 ],
			[new Date("8 4, 2014, 0:15:00").getTime(), 0.6 ],
			[new Date("8 4, 2014, 2:15:00").getTime(), 0.67],
			[new Date("8 4, 2014, 4:15:00").getTime(), 0.81],
			[new Date("8 4, 2014, 6:15:00").getTime(), 0.78],
			[new Date("8 4, 2014, 7:15:00").getTime(), 0.98],
			[new Date("8 4, 2014, 8:15:00").getTime(), 1.84],
			[new Date("8 4, 2014, 10:15:00").getTime(), 1.80],
			[new Date("8 4, 2014, 12:15:00").getTime(), 1.80],
			[new Date("8 4, 2014, 14:15:00").getTime(), 1.92],
			[new Date("8 4, 2014, 16:15:00").getTime(), 2.49],
			[new Date("8 4, 2014, 18:15:00").getTime(), 2.79],
			[new Date("8 4, 2014, 20:15:00").getTime(), 2.73],
			[new Date("8 4, 2014, 22:15:00").getTime(), 2.61],
			[new Date("8 5, 2014, 0:15:00").getTime(), 2.76],
			[new Date("8 5, 2014, 5:15:00").getTime(), 2.82],
			[new Date("8 5, 2014, 6:15:00").getTime(), 2.8 ],
			[new Date("8 5, 2014, 7:15:00").getTime(), 2.1 ],
			[new Date("8 5, 2014, 8:15:00").getTime(), 1.1 ],
			[new Date("8 5, 2014, 9:15:00").getTime(), 0.25],
			[new Date("8 5, 2014, 10:15:00").getTime(), 0   ]]/*[
            [Date.UTC(2014,  7, 3, 14, 15, 0), 0   ],
            [Date.UTC(2014,  7, 3, 16, 15, 0), 0.6 ],
            [Date.UTC(2014,  7, 3, 18, 15, 0), 0.7 ],
            [Date.UTC(2014,  7, 3, 20, 15, 0), 0.8 ],
            [Date.UTC(2014,  7, 3, 22, 15, 0), 0.6 ],
            [Date.UTC(2014,  7, 4, 0, 15, 0), 0.6 ],
            [Date.UTC(2014,  7, 4, 2, 15, 0), 0.67],
            [Date.UTC(2014,  7, 4, 4, 15, 0), 0.81],
            [Date.UTC(2014,  7, 4, 6, 15, 0), 0.78],
            [Date.UTC(2014,  7, 4, 7, 15, 0), 0.98],
            [Date.UTC(2014,  7, 4, 8, 15, 0), 1.84],
            [Date.UTC(2014,  7, 4, 10, 15, 0), 1.80],
            [Date.UTC(2014,  7, 4, 12, 15, 0), 1.80],
            [Date.UTC(2014,  7, 4, 14, 15, 0), 1.92],
            [Date.UTC(2014,  7, 4, 16, 15, 0), 2.49],
            [Date.UTC(2014,  7, 4, 18, 15, 0), 2.79],
            [Date.UTC(2014,  7, 4, 20, 15, 0), 2.73],
            [Date.UTC(2014,  7, 4, 22, 15, 0), 2.61],
            [Date.UTC(2014,  7, 5, 0, 15, 0), 2.76],
            [Date.UTC(2014,  7, 5, 5, 15, 0), 2.82],
            [Date.UTC(2014,  7, 5, 6, 15, 0), 2.8 ],
            [Date.UTC(2014,  7, 5, 7, 15, 0), 2.1 ],
            [Date.UTC(2014,  7, 5, 8, 15, 0), 1.1 ],
            [Date.UTC(2014,  7, 5, 9, 15, 0), 0.25],
            [Date.UTC(2014,  7, 5, 10, 15, 0), 0   ]
        ]*/
    }]
};

var btn_actions = {
	do_what: function(e) {
		// Just do nothing..
	},
	show_chart_one: function(e) {
		addNotify("smartadmin", "显示Highcharts#1", "接下来将显示Highcharts#1，5s后自动关闭", '5000', "fa fa-warning shake animated", null, "#296191");
		showChart("left");
	},
	show_chart_two: function(e) {
		addNotify("smartadmin", "显示Highcharts#2", "接下来将显示Highcharts#2，8s后自动关闭", '8000', "fa fa-bell swing animated", null, "#3276B1");
		showChart("right");
	},
	show_chart_both: function(e) {
		addNotify("smartadmin", "Highcharts分列显示", "接下来将同时显示Highcharts#1#2，图表分两栏显示", null, null, "fa fa-thumbs-up bounce animated", "#739E73");
		showChart("both");
	},
	reset_both_chart: function(e) {
		addNotify("smartadmin", "重置图表", "重置当前图表", '8000', "fa fa-warning shake animated", null, "#C46A69");
		resetChart();
	},
	highlight_chart_legend: function(e) {
		showChart("left");
		addNotify("smartadmin", "legend元素", "图例，标注不同数据列的颜色块", '15000', "fa fa-warning shake animated", null, "#C79121");
		
		highlightAction(function() {
			addNotify("smartadmin", "隐藏legend", "legend将会隐藏500ms", '4000', "fa fa-bell swing animated", null, "#C46A69");
			var chart = chart_one;
			var size = chart.series.length;
			var i;
			for (i = 0; i < size; i++) {
				removeHCLegend(chart, i);
			}
		}, function() {
			addNotify("smartadmin", "显示legend", null, '4000', null, "fa fa-check fadeInLeft animated", "#739E73");
			var chart = chart_one;
			var size = chart.series.length;
			var i;
			for (i = 0; i < size; i++) {
				addHCLegend(chart, i);
			}
		}, 500, 3);
	},
	highlight_chart_title: function(e) {
		showChart("left");
		addNotify("smartadmin", "title元素", "标题，包括主标题和副标题", '15000', "fa fa-warning shake animated", null, "#C79121");
		
		highlightAction(function() {
			addNotify("smartadmin", "高亮title", "title将会高亮500ms", '4000', "fa fa-bell swing animated", null, "#C46A69");
			var chart = chart_one;
			chart.setTitle({
				style: {
					color: 'red',
					fontWeight: 'bold'
				}
			}, {
				style: {
					color: 'red',
					fontWeight: 'bold'
				}
			});
		}, function() {
			addNotify("smartadmin", "显示title", null, '4000', null, "fa fa-check fadeInLeft animated", "#739E73");
			var chart = chart_one;
			chart.setTitle({
				text: chart_one_origin_conf.title.text,
				style: {
					color: '#333333',
					fontWeight: 'normal'
				}
			}, {
				text: chart_one_origin_conf.subtitle.text,
				style: {
					color: '#555555',
					fontWeight: 'normal'
				}
			});
		}, 500, 3);
	},
	highlight_chart_axis: function(e) {
		showChart("left");
		addNotify("smartadmin", "axis元素", "坐标轴，包括横坐标和纵坐标，可以设置多个纵坐标用于显示不同统计数据", '15000', "fa fa-warning shake animated", null, "#C79121");
		
		highlightAction(function() {
			addNotify("smartadmin", "高亮axis", "axis将会高亮500ms", '4000', "fa fa-bell swing animated", null, "#C46A69");
			var chart = chart_one;
			chart.xAxis[0].update({
				title: {
					style: {
						color: 'red',
						fontWeight: 'bold'
					}
				},
				labels: {
					style: {
						color: 'red',
						fontWeight: 'bold'
					}
				}
			});
			chart.yAxis[0].update({
				title: {
					style: {
						color: 'red',
						fontWeight: 'bold'
					}
				},
				labels: {
					style: {
						color: 'red',
						fontWeight: 'bold'
					}
				}
			});
		}, function() {
			addNotify("smartadmin", "显示axis", null, '4000', null, "fa fa-check fadeInLeft animated", "#739E73");
			var chart = chart_one;
			chart.xAxis[0].update({
				title: {
					style: {
						color: '#707070',
						fontWeight: 'normal'
					}
				},
				labels: {
					style: {
						color: '#606060',
						fontWeight: 'normal'
					}
				}
			});
			chart.yAxis[0].update({
				title: {
					style: {
						color: '#707070',
						fontWeight: 'normal'
					}
				},
				labels: {
					style: {
						color: '#606060',
						fontWeight: 'normal'
					}
				}
			});
		}, 500, 3);
	},
	highlight_chart_series: function(e) {
		showChart("left");
		addNotify("smartadmin", "series元素", "数据列，一条统计图上的一些列点", '15000', "fa fa-warning shake animated", null, "#C79121");
		
		highlightAction(function() {
			addNotify("smartadmin", "高亮series", "series将会高亮1500ms", '6000', "fa fa-bell swing animated", null, "#C46A69");
			var chart = chart_one;
			var size = chart.series.length;
			var series = chart.series[size - 1];
			var points = chart_one_origin_conf.series[size - 1].data;
			var psize = points.length;
//			chart.series[size - 1].remove();
			series.update({
				lineWidth: 4
			});
			var sfunc = function(pointIndex) {
				var mradius = 8;
				if (pointIndex == psize - 1) mradius = 4;
				else if (pointIndex >= psize) return;

				setTimeout(function() {
					var tempPoints = [];
					var i;
					for (i = 0; i < psize; i++) {
						if (i == pointIndex) {
							tempPoints.push({
								y: points[i],
								marker: {
									radius: mradius
								}
							});
						} else {
							tempPoints.push(points[i]);
						}
					}
					series.update({
						data: tempPoints
					});
					sfunc(pointIndex + 1);
				}, 100);
			};
			sfunc(0);
		}, function() {
			addNotify("smartadmin", "显示series", null, '6000', null, "fa fa-check fadeInLeft animated", "#739E73");
			var chart = chart_one;
			var size = chart_one_origin_conf.series.length;
//			chart.addSeries(chart_one_origin_conf.series[size - 1]);
			chart.series[size - 1].update({
				lineWidth: 2
			});
		}, 1500, 2);
	},
	highlight_chart_tooltip: function(e) {
		showChart("left");
		addNotify("smartadmin", "tooltip元素", "数据提示框，鼠标在统计图上点滑动时浮动的提示框，显示该点数据详情", '15000', "fa fa-warning shake animated", null, "#C79121");
		
		highlightAction(function() {
			addNotify("smartadmin", "显示tooltip", "tooltip将会自动显示", '6000', "fa fa-bell swing animated", null, "#C46A69");
			var chart = chart_one;
			var i;
			var serieses = chart.series,
				ssize = serieses.length;
			var points = serieses[0].points,
				psize = points.length;
			var tfunc = function(pointIndex) {
				if (pointIndex < 0) return;
				setTimeout(function() {
					var tpoints = [];
					var j;
					for (j = 0; j < ssize; j++) {
						tpoints.push(serieses[j].points[pointIndex]);
					}
					// refer#1: http://jsfiddle.net/L2TFd/28/
					// refer#2: http://forum.highcharts.com/viewtopic.php?f=12&t=18889
					chart.tooltip.refresh(tpoints);
					tfunc(pointIndex - 1);
				}, 100);
			};
			tfunc(psize - 1);
		}, function() {
			// Do nothing..
		}, 800, 2);
	},
	show_chart_nodata: function(e) {
		Highcharts.setOptions({
			lang: {
				noData: "查询结果为空"
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '25px',
					color: '#303030',
//					opacity: 0.8,
					backgroundColor: 'gray'
				}
			}
		});

		showChart("left");
		resetChart();

		var chart = chart_one;
		var serieses = chart.series;
		var size = serieses.length,
			i;
		for (i = size - 1; i >= 0; i--) {
			serieses[i].update({
				data: []
			});
		}
		// chart.hideNoData();
		// chart.showNoData("No Data.");
	},
	show_chart_nodata_two: function(e) {
		Highcharts.setOptions({
			lang: {
				loading: "<i class='fa fa-gear fa-4x fa-spin txt-color-white'></i>"
			},
			loading: {
				hideDuration: 500,
				showDuration: 500,
		 		labelStyle: {
		            color: 'white',
		    		fontSize: '30px'
		        },
		        position: {
		        	verticalAlign: 'middle'
		        },
		        style: {
		            backgroundColor: 'black'
		        }
		    }
		});

		showChart("left");
		resetChart();

		var chart = chart_one;
		chart.showLoading("查询结果为空");
	},
	show_chart_loading: function(e) {
		Highcharts.setOptions({
			lang: {
				loading: "<i class='fa fa-gear fa-4x fa-spin txt-color-white'></i>"
			},
			loading: {
				hideDuration: 500,
				showDuration: 500,
		        labelStyle: {
	//	            color: 'white',
		    		fontSize: '40px'
		        },
		        style: {
		            backgroundColor: 'black',
		            opacity: 0.5
		        }
		    }
		});

		showChart("left");
		resetChart();

		var chart = chart_one;
		setTimeout(function() {
			chart.showLoading();
			setTimeout(function() {
				chart.hideLoading();
				resetChart();
			}, 3000);
		}, 1500);
	},
	show_chart_point_event: function(e) {
		if (chart_one != null) chart_one.destroy();
		chart_one = new Highcharts.Chart(getChartConfiguration("3d-pie-chart", "hc-container-one"));
	},
	show_chart_time_line: function(e) {
		resetChart();
		showChart("left");
		Highcharts.setOptions({
			global: {
				useUTC: true
			}
		});
		chart_one = new Highcharts.Chart(getChartConfiguration("time-line-chart", "hc-container-one"));
	},
	not_use_utc: function(e) {
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});
	}
};