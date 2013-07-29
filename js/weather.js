var _W = _W || {};
_W.WeatherSelector = {};
// WEATHER
(function () {

  _W.WeatherSelector = function init_WeatherSelector ( $el, dataKey ) {

    $el.each(
      function ( index, el ) {

        var $container = $( el )
          , $input     = $container.find('input')
          , $frame     = $container.find('.frame')
          , $ul        = $frame.find('ul')
          , $glyphs    = $ul.find('.glyph')

          , $prev      = $container.find('.prev')
          , $next      = $container.find('.next')

          , index      = 0
          , value      = window.localStorage.getItem( dataKey )
          , width      = $glyphs.width() * $glyphs.size()

          , isAnimating = false
          ;

        $ul.width( width );
        $prev.click( prev );
        $next.click( next );

        $container.swipe({"swipe": onSwipe, "swipeStatus": onSwipeStatus, "threshold": 30 });
        $frame.bind('mousewheel DOMMouseScroll MozMousePixelScroll', onScroll );
        $frame.bind('mousewheel DOMMouseScroll MozMousePixelScroll', onScroll );
        $ul.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", onTransitionEnd );

        if ( value )
          index = $('.glyph.' + value ).index();

        if ( Modernizr.touch ) {

          $frame.bind('scroll', function ( e ) {
            e.preventDefault();
            e.stopPropagation();
          });
        }

        goto( index );

        function prev ( e ) {
          if ( e ) e.preventDefault();
          if ( $frame.is(':animated') ) return; // EXIT
          if ( index <= 0 )
            index = $glyphs.size() -1;
          else
            index --;
          goto( index );
        }

        function next ( e ) {
          if ( e ) e.preventDefault();
          if ( $frame.is(':animated') ) return; // EXIT
          if ( index >= $glyphs.size() -1 )
            index = 0;
          else
            index ++;
          goto( index );
        }

        function goto ( index ) {

          var value = $glyphs.eq( index ).find('.title').text().toLowerCase();

          if ( isAnimating ) return; // EXIT

          if ( Modernizr.localstorage )
            window.localStorage.setItem( dataKey, value );

          $input.val( value );

          if ( Modernizr.touch )
            $ul.css('marginLeft', ( - $glyphs.width() * index ) + 'px');
          else {
            isAnimating = true;
            $ul.css( _W.prefix.css + 'transform', 'translateX(' + ( - $glyphs.width() * index ) + 'px)');
          }
        }

        // SCROLL
        function onScroll ( e ) {

          var dir = null;

          e.preventDefault();
          e.stopPropagation();

          if ( isAnimating ) return; // EXIT

          if ( e.originalEvent.wheelDelta || e.originalEvent.detail )
            dir = e.originalEvent.wheelDelta || -e.originalEvent.detail;
          if ( dir < 0 )
            next();
          else if ( dir > 0 )
            prev();
        };

        function onTransitionEnd () {
          isAnimating = false;
        }

        // SWIPE
        function onSwipe ( e, direction, distance, duration, fingerCount ) {
          if ( direction == 'right' ) prev();
          if ( direction == 'left' )  next();
        }

        var initial = {};
        function onSwipeStatus ( e, phase, direction, distance, duration, fingerCount  ) {

          if ( phase == 'start' ) {

            initial = {
              "touch": { "x": e.x, "y": e.y }
            };

            if ( Modernizr.touch )
              initial['target'] = { "x": parseFloat( $ul.css('marginLeft') ) };

            return; // EXIT
          }

          if ( direction == 'up' || direction == 'down' ) return; // EXIT

          distance =  direction == 'left' ? distance * -1 : distance;

          if ( Modernizr.touch )
            $ul.css('marginLeft', initial['target'].x + distance + 'px');

          if ( phase == 'end' || phase == 'cancel' ) {

            initial = {
              "touch":  { "x": null, "y": null },
              "target": { "x": null }
            };

            if ( distance < $ul.swipe("option", "threshold") )
              goto( index );

            return; // EXIT
          }
        }
      }
    );
  };

})();