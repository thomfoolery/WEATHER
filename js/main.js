var _W = {};

_.templateSettings = {
  evaluate : /\{\[([\s\S]+?)\]\}/g,
  interpolate : /\{\{(.+?)\}\}/g // mustache templating style
};

$.ajaxSetup({
  "cache": true,
  "crossDomain": true
});

$.when(

    $.getScript('/js/location.js'),
    $.getScript('/js/date.js'),
    $.getScript('/js/weather.js'),
    $.getScript('/js/temperature.js')

  ).then(

  function () {

    var $main  = $('#main')
      , $card
      , $cards

      , width         = 0
      , padding       = 0

      , index         = 0
      , today         = new Date()
      , date_string   = ''
      , card_template = _.template( $('#card-template').html() )
      ;

    for ( var i = 0; i < 7; i++ ) {
      today.setDate( today.getDate() +1 );
      $card = createCard( today );
      width += $card.outerWidth( true );

      if ( i == 0 )
        $card.addClass('active');
    }

    $cards  = $('.card');
    padding = ( $( window ).width() / 2 ) - ( $card.width() / 2 );

    $main.width( width + padding *2 );
    $main.css('paddingLeft',  padding + 'px');
    $main.css('paddingRight', padding + 'px');

    $('footer .prev').click( prev );
    $('footer .next').click( next );

    function createCard ( date ) {

      var $card = $(
            card_template({
              "date": date,
              "location": _W.Location.getLocation()
            })
          );

      $('#main').append( $card );

      _W.WeatherSelector(     $card.find('.weather-selector')     );
      _W.TemperatureSelector( $card.find('.temperature-selector') );

      return $card;
    }

    function prev ( e ) {
      if ( e ) e.preventDefault();
      if ( $main.is(':animated') ) return; // EXIT
      if ( index <= 0 )
        index = $cards.size() -1;
      else
        index --;
      goto( index );
    }

    function next ( e ) {
      if ( e ) e.preventDefault();
      if ( $main.is(':animated') ) return; // EXIT
      if ( index >= $cards.size() -1 )
        index = 0;
      else
        index ++;
      goto( index );
    }

    function goto ( index ) {

      $('.card.active').removeClass('active');
      $cards.eq( index ).addClass('active');
      $main.animate({"marginLeft": - $card.outerWidth( true ) * index });
    }

    $( window ).resize( onResize ).resize();
    function onResize () {
      var paddingTop = Math.max( ( $( window ).height() - $card.outerHeight( true ) ) / 2, 50 );
      $main.css('paddingTop', paddingTop + 'px');
    }
  }
);
