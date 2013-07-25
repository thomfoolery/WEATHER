var _W = _W || {};
_W.TemperatureSelector = {};
// TEMP
(function() {

  _W.TemperatureSelector = function init_TemperatureSelector ( $el ) {

    $el.each(
      function ( index, el ) {

        var $container = $( el )
          , $input     = $container.find('input')
          , $frame     = $container.find('.frame')
          , $value     = $frame.find('.value')
          , $therm     = $frame.find('.glyph .thermometer')

          , $prev      = $container.find('.prev')
          , $next      = $container.find('.next')

          , value      = 0
          , max        = $value.data('max')
          , min        = $value.data('min')
          ;

        $prev.click( prev );
        $next.click( next );

        $frame.bind('mousewheel DOMMouseScroll MozMousePixelScroll', onScroll );

        if ( Modernizr.touch ) {

          $frame.bind('scroll', function ( e ) {
            e.preventDefault();
            e.stopPropagation();
          });

          $frame.bind('touchstart', onTouchstart );
          $frame.bind('touchmove',  onTouchmove );
          $frame.bind('touchend',   onTouchend );
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

        var firstTouch           = null
          , startingScrollOffset = null
          ;

        function onTouchstart ( e ) {

          $frame.addClass('touch-start');

          firstTouch           = e.changedTouches[0];
          startingScrollOffset = $frame.scrollLeft();
        }

        function onTouchmove ( e ) {

          $frame.addClass('touch-move');

          currentTouch = e.changedTouches[0];
          // slide( firstTouch.pageX - currentTouch.pageX );
        }

        function onTouchend ( e ) {

          $frame.removeClass('touch-start touch-move');

          firstTouch           = null;
          startingScrollOffset = null;
        }
      }
    );
  }
})();