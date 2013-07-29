var _W = _W || {};
_W.Location = {};
// TEMP
(function() {

  var _P = {
        "lat":    window.localStorage.getItem('location.lat')    || null,
        "lng":    window.localStorage.getItem('location.lng')    || null,
        "string": window.localStorage.getItem('location.string') || null
      }

    , locations = [
        {
          "lat":   0,
          "lng":   0,
          "title": 'Toronto, ON, Canada'
        }, {
          "lat":   0,
          "lng":   0,
          "title": 'Vancouver, ON, Canada'
        }, {
          "lat":   0,
          "lng":   0,
          "title": 'Montreal, ON, Canada'
        }
      ]

    , locationSelectorTemplate = _.template( $('#location-selector-window-template').html() )
    , $locationSelector
    ;

  _.each( _P, function( value, key, _P ) {
    try { _P[ key ] = JSON.parse( value ); }
    catch ( e ) { _P[ key ] = null; }
  });

  $( document ).on('click', '.select-location', function () {

    if ( ! $locationSelector ) {

      $locationSelectorMask = $('<div id="location-selector-window-mask"/>')
      $locationSelector     = $( locationSelectorTemplate({ "locations": locations }) );

      $locationSelector.find('.close-window').on('click', closeLocationSelector );

      $locationSelectorMask.hide();
      $locationSelector    .hide();

      $('body').append( $locationSelectorMask, $locationSelector )
    }

    $locationSelectorMask.fadeIn();
    $locationSelector    .fadeIn();

  });

  $( document ).on('click', '.change-location', function ( e ) {

    var $target = $( e.currentTarget );

    _P.lat    = $target.data('lat');
    _P.lng    = $target.data('lng');
    _P.string = $target.text().trim();

    $('#location').val( _P.string );

    closeLocationSelector();

  });

  $( document ).on('click', '.geo-locate-location', refresh );

  function closeLocationSelector () {

    $locationSelectorMask.fadeOut();
    $locationSelector    .fadeOut();
  }

  refresh();
  function refresh () {

    if ( ! _P.lat || ! _P.lng || ! _P.string && navigator.geolocation )
      navigator.geolocation.getCurrentPosition( setGeoLocation );
    else
      $('#location').val( _P.string );

    if ( $locationSelector )
      closeLocationSelector();
  }

  $('#location-input-wrapper button').click( function () {
    if ( navigator.geolocation )
      navigator.geolocation.getCurrentPosition( setGeoLocation );
  });

  _W.Location.refresh = refresh;

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

          _P.lat = data.results[ 0 ].geometry.location.lat;
          _P.lng = data.results[ 0 ].geometry.location.lng;
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