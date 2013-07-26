var _W = {
  "cssPrefix": (function () { // IIF
    // exit if IE8
    if ( ! window.getComputedStyle ) return '';

    var styles = window.getComputedStyle(document.documentElement, '')
      , pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1]
      , dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

    return {
      "dom":       dom,
      "lowercase": pre,
      "css":       '-' + pre + '-',
      "js":        pre[0].toUpperCase() + pre.substr(1)
    };
  })()
};

_.templateSettings = {
  evaluate : /\{\[([\s\S]+?)\]\}/g,
  interpolate : /\{\{(.+?)\}\}/g // mustache templating style
};

$.ajaxSetup({
  "cache": true,
  "crossDomain": true
});

$.when(

    $.getScript('js/location.js'),
    $.getScript('js/date.js'),
    $.getScript('js/weather.js'),
    $.getScript('js/temperature.js')

  ).then(

  function () {

    var $main  = $('#main')
      , $card
      , $cards

      , width         = 0
      , padding       = 0

      , index         = 0
      , today         = new Date()
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

    $('footer .prev').click( prev );
    $('footer .next').click( next );

    $('body').bind('mousewheel DOMMouseScroll MozMousePixelScroll', onScroll );

    function createCard ( date ) {

      var $card = $(
            card_template({
              "date": date,
              "location": _W.Location.getLocation()
            })
          )

        , dataKey = date.getFullYear() + '-' + ( date.getMonth() +1 ) + '-' + date.getDate();
        ;

      $('#main').append( $card );

      _W.WeatherSelector(     $card.find('.weather-selector')    , 'weather.'     + dataKey );
      _W.TemperatureSelector( $card.find('.temperature-selector'), 'temperature.' + dataKey );

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

      $cards.filter('.active').removeClass('active');
      $cards.eq( index ).addClass('active');
      $main.css( _W.cssPrefix.css + 'transform', 'translateX(' + ( - $card.outerWidth( true ) * index ) + 'px)');
    }

    function onScroll ( e ) {

      var dir = null;

      e.preventDefault();
      e.stopPropagation();

      if ( e.originalEvent.wheelDelta || e.originalEvent.detail )
        dir = e.originalEvent.wheelDelta || -e.originalEvent.detail;
      if ( dir < 0 )
        next();
      else if ( dir > 0 )
        prev();
    }

    $( window ).resize( onResize ).resize();
    function onResize () {

      var paddingTop  = Math.max( ( $( window ).height() - $card.outerHeight( true ) ) / 2, 50 )
        , paddingSide = ( $( window ).width() / 2 ) - ( $card.width() / 2 )
        ;

      $main.css('paddingTop', paddingTop + 'px');

      $main.width( width + paddingSide *2 );
      $main.css('paddingLeft',  paddingSide + 'px');
      $main.css('paddingRight', paddingSide + 'px');
    }
  }
);
