var _W = _W || {};
_W.Location = {};
// TEMP
(function() {

  var _P = {
        "lat":      window.localStorage.getItem('location.lat')    || null,
        "lng":      window.localStorage.getItem('location.lng')    || null,
        "string": window.localStorage.getItem('location.string') ||null
      }
    ;

  if ( ! _P.lat || ! _P.lng || ! _P.string && navigator.geolocation )
    navigator.geolocation.getCurrentPosition( setGeoLocation );
  else
    $('#location').val( _P.string );

  $('#location-input-wrapper button').click( function () {

    if ( navigator.geolocation )
      navigator.geolocation.getCurrentPosition( setGeoLocation );
  });

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

    $('#location').val('Fetching location...');
    $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + _P.lat + ',' + _P.lng + '&sensor=true')
      .done( callback );

    function callback ( data ) {

      if ( data.results.length === 0 ) return; // EXIT

      for ( var i = data.results.length; i > 0; i-- ) {
        if ( data.results[ i -1 ].formatted_address.split(',').length === 3 ) {

          _P.lat = data.results[ 0 ].lat;
          _P.lng = data.results[ 0 ].lng;
          _P.string = data.results[ i -1 ].formatted_address;

          if ( Modernizr.localstorage ) {

            window.localStorage.setItem('location.lat', _P.lat );
            window.localStorage.setItem('location.lng', _P.lng );
            window.localStorage.setItem('location.string', _P.string );
          }

          $('#location').val( _P.string );

          break ;
        }
      }
    }
  }

})();