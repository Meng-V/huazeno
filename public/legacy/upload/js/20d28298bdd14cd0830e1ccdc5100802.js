$(function () {

    echart_map();
    function echart_map() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('ceshi8'));
	
	 
	
        var chinaGeoCoordMap = {
            
            'HUACHEN': [116.4551, 40.2539],  
			'Europe': [2.20,48.50], 
			'South America': [-60.00,-16.30], 
           'North America': [-90.00,46.30], 
          'Middle East': [53.846656,22.862496], 
		  'Southeast Asia': [105.55,11.05], 
 'Africa': [34.888822,-6.369028]

        };
        var chinaDatas = [
		[{
                name: 'Europe',
                value: 1,
				num:'1 site'
            }]
			
		 
			
			,[{
                name: 'South America',
                value: 1,
				num:'1 site'
            }],[{
          
                name: 'Middle East',
                value: 1,
				num:'1 site'
            }]

, [{


                
                name: 'Africa',
                value: 1,
				num:'1 site'
            }]

            , [{


                
                name: 'North America',
                value: 1,
				num:'1 site'
            }]
,[{
                name: 'Southeast Asia',
                value: 1,
				num:'1 site'
           
            }] 
        ];

        var convertData = function(data) {
            var res = [];
            for(var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = [116.4551, 40.2539];
                var toCoord = chinaGeoCoordMap[dataItem[0].name];
                if(fromCoord && toCoord) {
                    res.push([{
                        coord: fromCoord,
                        value: dataItem[0].value
                    }, {
                        coord: toCoord,
                    }]);
					
                }
            }
            return res;
        };
        var series = [];
        [['HUACHEN', chinaDatas]].forEach(function(item, i) {
            console.log(item)
			
			
 
			
			
            series.push({
                    type: 'lines',
                    zlevel: 4,
                    effect: {
                        show: true,
                        period: 4, //箭头指向速度，值越小速度越快
                        trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                        symbol: 'arrow', //箭头图标
                        symbolSize: 10, //图标大小
                    },
                    lineStyle: {
                        normal: {
                            width: 0.2, //尾迹线条宽度
                            opacity: 0.5, //尾迹线条透明度
                            curveness: 0.4 //尾迹线条曲直度
                        }
                    },
                    data: convertData(item[1])
                }, {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: { //涟漪特效
                        period: 4, //动画时间，值越小速度越快
                        brushType: 'stroke', //波纹绘制方式 stroke, fill
                        scale: 10 //波纹圆环最大限制，值越大波纹越大
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'right', //显示位置
                            offset: [5, 0], //偏移设置
                            formatter: function(params){//圆环显示文字
                                return params.data.name; 
                            },

 

                            fontSize: 16
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    symbol: 'circle',
                    symbolSize: function(val) {
                        return 5+ val[2] * 10; //圆环大小
                    },
                    itemStyle: {
                        normal: {
                            show: false,
                            color: '#d01f37'
                        }
                    },
                    data: item[1].map(function(dataItem) {
                        return {
                            name: dataItem[0].name,
                            value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                        };
                    }),
                },
                //被攻击点
                {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        period: 4,
                        brushType: 'stroke',
                        scale: 4
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            //offset:[5, 0],
                            color: '#d01f37',
                            formatter: '{b}',
                            textStyle: {
                                color: "#d01f37",
								fontSize: 0, // 设置标签文字大小
                            }
                        },
                        emphasis: {
                            show: false,
                            color: "#d01f37"
                        }
                    },
                    symbol: 'pin',
                    symbolSize: 50,
                    data: [{
                        name: item[0],
                        value: chinaGeoCoordMap[item[0]].concat([10]),
                    }],
                }
            );
        });

        option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: '#e9e9e9',
                borderColor: '#e9e9e9',
                showDelay: 0,
                hideDelay: 0,
                enterable: true,
                transitionDuration: 0,
                extraCssText: 'z-index:100',
				 //根据业务自己拓展要显示的内容
                formatter: function(params, ticket, callback) {
                    var res = "";
                    var name = params.name;
                    var value = params.value[params.seriesIndex + 1];
					var num = params.num;
                    res = ''; 
                    return res;
                }
            },
			
			
			
			
			
            /*backgroundColor:"#013954",*/
            visualMap: { //图例值控制
                min: 0,
                max: 2,
                calculable: true,
                show: false,
                color: ['#d01f37', '#fff', '#d01f37', '#fff', '#fff'],
                textStyle: {
                    color: '#000'
                }
            },
            geo: {
                map: 'world',
                zoom: 1.2,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: false, //是否允许缩放
                itemStyle: {
                    normal: {
                        color: '#e9e9e9', //地图背景色
                        borderColor: '#e9e9e9', //省市边界线00fcff 516a89
                        borderWidth: 0
                    },
                    emphasis: {
                        color: '#e9e9e9' //悬浮背景
                    }
                }
            },
            series: series
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });

    }

})



