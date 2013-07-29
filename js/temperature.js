var _W = _W || {};
_W.TemperatureSelector = {};
// TEMP
(function() {

  _W.TemperatureSelector = function init_TemperatureSelector ( $el, dataKey ) {

    $el.each(
      function ( index, el ) {

        var $container = $( el )
          , $input     = $container.find('input')
          , $frame     = $container.find('.frame')
          , $value     = $frame.find('.value')
          , $therm     = $frame.find('.glyph .thermometer')

          , $prev      = $container.find('.prev')
          , $next      = $container.find('.next')

          , value      = parseInt( ( window.localStorage.getItem( dataKey ) || 0 ) )
          , max        = $value.data('max')
          , min        = $value.data('min')
          ;

        $prev.click( prev );
        $next.click( next );

        $frame.bind('mousewheel DOMMouseScroll MozMousePixelScroll', onScroll );
        $frame.on('mousedown touchstart',             onSwipeStart );

        if ( Modernizr.touch ) {

          $frame.bind('scroll', function ( e ) {
            e.preventDefault();
            e.stopPropagation();
          });
        }

        goto ( value );

        function prev ( e ) {
          if ( e ) e.preventDefault();
          if ( value <= min )
            return;
          else
            value --;
          goto( value );
        }

        function next ( e ) {
          if ( e ) e.preventDefault();
          if ( value >= max )
            return;
          else
            value ++;
          goto( value );
        }

        function goto ( value ) {

          $input.val(  value );
          $value.text( value );

          if ( Modernizr.localstorage )
            window.localStorage.setItem( dataKey, value );

          $therm.removeClass('low medium-low medium-high high full');
          if ( value > -40 && value <= -20 )
            $therm.addClass('low');
          else if ( value > -20 && value <= 0 )
            $therm.addClass('medium-low');
          else if ( value > 0 && value <= 10 )
            $therm.addClass('medium-high');
          else if ( value > 10 && value <= 30 )
            $therm.addClass('high');
          else if ( value > 30 && value <= 50 )
            $therm.addClass('full');
        }

        // SCROLL
        function onScroll ( e ) {

          var dir = null;

          e.preventDefault();
          e.stopPropagation();

          if ( e.originalEvent.wheelDelta || e.originalEvent.detail )
            dir = e.originalEvent.wheelDelta || - e.originalEvent.detail;
          if ( dir < 0 )
            next();
          else if ( dir > 0 )
            prev();
        };

        var initial = {};
        function onSwipeStart ( e ) {
          initial['y']     = e.clientY || e.originalEvent.touches[0].pageY;
          initial['value'] = value;
          $( document ).on('mousemove touchmove',  onSwipeMove );
          $( document ).on('mouseup   touchend   touchcancel', onSwipeEnd );
        }

        function onSwipeMove ( e ) {

          e.preventDefault();
          e.stopPropagation();

          var diff = Math.round(( initial['y'] - ( e.clientY || e.originalEvent.touches[0].pageY )) / 4 );
          value = initial['value'] + diff;
          if ( value > 50  ) value =  50;
          if ( value < -50 ) value = -50;
          goto( value );

        }

        function onSwipeEnd ( e ) {
          inital = {};
          $( document ).off('mousemove mouseup touchmove touchend touchcancel');
        }
      }
    );
  }
})();