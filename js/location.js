var _W = _W || {};
_W.Location = {};
// TEMP
(function() {

  var _P = {
        "lat":      null,
        "lng":      null,
        "location": null
      }
    ;

  if ( navigator.geolocation )
      navigator.geolocation.getCurrentPosition( setGeoLocation );

  _W.Location.getLat = function () {
    return _P.lat;
  };

  _W.Location.getLng = function () {
    return _P.lng;
  };

  _W.Location.getLocation = function () {
    return _P.lng;
  };

  function setGeoLocation ( position ) {

    _P.lat = position.coords.latitude;
    _P.lng = position.coords.longitude;

    $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + _P.lat + ',' + _P.lng + '&sensor=true')
      .done( callback );

    function callback ( data ) {

      if ( data.results.length === 0 ) return; // EXIT

      for ( var i = data.results.length; i > 0; i-- ) {
        if ( data.results[ i -1 ].formatted_address.split(',').length === 3 ) {
          _P.location = data.results[ i -1 ].formatted_address;
          $('#location').val( _P.location );
          break ;
        }
      }
    }
  }

})();