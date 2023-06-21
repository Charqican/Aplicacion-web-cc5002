Highcharts.chart('container', {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Tipo de donaciones y Pedidos',
      align: 'center'
    },
    subtitle: {
        text: 'Subtitulos',
        align: 'center'
    },
    xAxis: {
      categories: ['Fruta', 'Verdura', 'Otro'],
      title: {
        text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Cantidad (Unidades)',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 1
    },
    tooltip: {
        valueSuffix: ' Unidades'
      },
    plotOptions: {
      bar: {
        borderRadius: '75%',
        dataLabels: {
          enabled: true
        },
        groupPadding: 0.1
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: "Donaciones",
      data: [0, 0, 0]
  }, {
      name:"Pedidos",
      data: [0, 0, 0]
  }]
  });


let chart_series = [];
fetch("http://127.0.0.1:5000/get-graph-data")
    .then( (response=>response.json()))
    .then( (parsedata) => {
        const informacion_pedidos=  parsedata[0];
        const informacion_donaciones = parsedata[1]; 
        // Fruta | Verdura | Otro
        let valores_donacion = [0, 0, 0];
        // Fruta | Verdura | Otro
        let valores_pedidos = [0, 0, 0];

        // llenamos los valores de la serie
        for (pedido of informacion_pedidos) {
            if(pedido["tipo"] == "fruta") valores_pedidos[0]++;
            else if (pedido["tipo"] == "verdura") valores_pedidos[1]++;
            else valores_pedidos[2]++;
        }

        for (donacion of informacion_donaciones) {
            if(donacion["tipo"] == "fruta") valores_donacion[0]++;
            else if (donacion["tipo"] == "verdura") valores_donacion[1]++;
            else valores_donacion[2]++;
        } 
        
        // creamos la  serie
        let chart = Highcharts.charts.find(
            (chart) => chart && chart.renderTo.id === "container"
          );
        chart.update({
            series: [{
                name: "Donaciones",
                data: valores_donacion
            }, {
                name:"Pedidos",
                data: valores_pedidos
            }]
        });
    }).catch((error) => console.error("Error:", error));
