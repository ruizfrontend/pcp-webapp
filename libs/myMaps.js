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
					.find('.btn-detalle').attr('href', '/' + data['IDPIF']).end()
					.find('.modal-body').html('')
						.append('<dl class="dl-horizontal">')
						.find('dl')
							.append('<dt>Comunidad:</dt><dd>' + data['COMUNIDAD'] + '</dd>')
							.append('<dt>Provincia:</dt><dd>' + data['PROVINCIA'] + '</dd>')
							.append('<dt>Comarca:</dt><dd>' + data['COMARCA'] + '</dd>')
							.append('<dt>Municipio:</dt><dd>' + data['SUPQUEMADA'] + '</dd>')
							.append('<dt>Superficie forestal quemada:</dt><dd>' + data['MUERTOS'] + '</dd><br>')
							.append('<dt>Muertos:</dt><dd>' + data['HERIDOS'] + '</dd>')
							.append('<dt>Fecha:</dt><dd>' + data['FECHA'] + '</dd>')
							.append('<dt>Tiempo en controlarse:</dt><dd>' + data['TIME_CTRL'] + '</dd>')
							.append('<dt>Tiempo en extinguirse:</dt><dd>' + data['TIME_EXT'] + '</dd>')
							.append('<dt>Causa:</dt><dd>' + data['CAUSA'] + '</dd>')
							.append('<dt>Medios de extinción:</dt><dd>' + data['PERSONAL'] + ' personas, ' + data['PESADOS'] + ' vehiculos pesados y ' + data['AEREOS'] + '</dd>')
							.end()
						.end()
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
	$('body').
	$.ajax('data.json')
		.done(homeInit)
		.fail(function(){
			$('#map').append('<h2>No se pudieron obtener los datos<h2>');
		})
		
}

var homeInit = function(data){
	function(data){
			
		return; 

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
		
	}
}

	// Función de inicialización genérica del mapa
var mapInit = function(id, position, zoom) {
  	  var map = L.map(id).setView(position, zoom);
      var mapquestLayer = new L.TileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
          maxZoom: 12,
          minZoom: 5,
          attribution: 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
          subdomains: ['otile1','otile2','otile3','otile4']
      });
      map.addLayer(mapquestLayer);
      return map;
}
