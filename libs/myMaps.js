/*global $*/

$(function(){
	
	    // inicializamos según el tipo de página
	if($('body').hasClass('pageHome')) {
	    // código para la home
	    loadFullmap();
	} else {
	    // código para el detalle
	    loadDetail();
	}
	
	$('.btn-incendio').click(function(){
		var $this = $(this);
		var incendio = $this.data('incendio');
		var $modal = $('#myModal');
		
		$.ajax('/' + incendio + '.json')
			.done(function(data){
				console.log(data);
				$modal
					.find('h4').text('Incendio de ' + data['FECHA'] + ' en ' + data['MUNICIPIO']).end()
					.find('.modal-body').html('Comunidad: ' + data['COMUNIDAD'] + '<br>\
								Provincia: ' + data['PROVINCIA'] + '<br>\
								Comarca: ' + data['COMARCA'] + '<br>\
								Municipio ' + data['MUNICIPIO'] + '<br><br>\
								Superficie forestal quemada: ' + data['SUPQUEMADA'] + 'ha<br>\
								Muertos: ' + data['MUERTOS'] + '<br>\
								Heridos: ' + data['HERIDOS'] + '<br>\
								Fecha: ' + data['FECHA'] + '<br>\
								Tiempo en controlarse: ' + data['TIME_CTRL'] + 'minutos<br>\
								Tiempo en extinguirse: ' + data['TIME_EXT'] + 'minutos<br>\
								Causa: ' + data['CAUSA'] + '<br>\
								Extinción mediante: ' + data['PERSONAL'] + ' personas, ' + data['PESADOS'] + ' vehiculos pesados y ' + data['AEREOS'] + ' medios aereos.').end()
					.modal()
			})
			.fail(function(){ console.log('No se pudo cargar el incendio'); })
		
			// evitamos la acción por defecto del link
		return false;
	});

	$("#table").tablesorter();
})

	// carga página de detalle
var loadDetail = function(){
    
    // En la página de detalle tenemos que tener la variable global detail con la información para el mapa
    if(!window.detail) return;
    
        // iniciando el mapa
    var map = mapInit('map', [detail['LATITUD'], detail['LONGITUD']], 10);
    
        // pintando el marcador del incendio
	var marker = L.marker([detail['LATITUD'], detail['LONGITUD']]).addTo(map);
}

	// carga json con todos los puntos y los dibuja
var loadFullmap = function(){
	if($('#map').length) {
		$.ajax('data.json')
			.done(function(data){
				if(!window.L) return $('#map').append('<h2>No se pudo dibujar el mapa.<h2>');
				
				var puntos = $.parseJSON(data);
				
				var map = mapInit('map', [40.2085,-3.713], 6);
				
				var geoJSON = {
				    "type": "FeatureCollection",
				    "features": []
				};
				
				for (var i = puntos.length - 1; i >= 0; i--) {
					geoJSON.features.push({
						"type": "Feature",
				        "properties": {
				          "causa": puntos[i]['CAUSA'],
				          "id": puntos[i]['IDPIF']
				        },
				        "geometry": {
				          "type": "Point",
				          "coordinates": [puntos[i]['LONGITUD'], puntos[i]['LATITUD']]
				        }
					});
				}
				
				var dataLayer = L.geoJson(geoJSON, {
		            onEachFeature: function(feature, layer) {
		                layer.bindPopup(
		                    '<a href="' + feature.properties.id + '/">' +
		                        feature.properties.causa +
		                    '</a>'
		                );
		            }
		        });
			    map.addLayer(dataLayer);
				
			})
			.fail(function(){
				$('#map').append('<h2>No se pudieron obtener los datos<h2>');
			})
			
	};
}


	// Función de inicialización genérica del mapa
var mapInit = function(id, position, zoom) {
  	  var map = L.map(id).setView(position, zoom);
      var mapquestLayer = new L.TileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
          subdomains: ['otile1','otile2','otile3','otile4']
      });
      map.addLayer(mapquestLayer);
      return map;
}
