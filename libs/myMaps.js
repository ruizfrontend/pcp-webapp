/*global $*/

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

	$('.btn-detail').click(function(e){
		
		var incendio = $(this).data('incendio');
		
		$.ajax(incendio + '.json')
			.done(function(data){
				
				$('#myModal')
					.find('.modal-title')
						.text('Detalles del incendio de ' + data['MUNICIPIO'] + ' a fecha de ' + data['FECHA'])
						.end()
					.find('.modal-body p')
						.text('Próximamente más información')
						.end()
					.modal('show');
					
				
			})
		return false;
	});
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

    // inicializamos según el tipo de página
if($('body').hasClass('pageHome')) {
    // código para la home
    loadFullmap();
} else {
    // código para el detalle
    loadDetail();
}
