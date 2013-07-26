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
          ;

        $ul.width( width );
        $prev.click( prev );
        $next.click( next );

        $frame.bind('mousewheel DOMMouseScroll MozMousePixelScroll', onScroll );

        if ( value ) {
          if ( _.isNumber( index = $('.glyph.' + value ).index() ) )
            goto( index );
        }

        if ( Modernizr.touch ) {

          $frame.bind('scroll', function ( e ) {
            e.preventDefault();
            e.stopPropagation();
          });

          $frame.bind('touchstart', onTouchstart );
          $frame.bind('touchmove',  onTouchmove );
          $frame.bind('touchend',   onTouchend );
        }

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

          if ( Modernizr.localstorage )
            window.localStorage.setItem( dataKey, value );

          $input.val( value );
          $frame.animate({ "scrollLeft": $glyphs.width() * index }, 100 );
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
          , maxOffset            = width - $glyphs.width()
          ;

        function onTouchstart ( e ) {

          $frame.addClass('touch-start');

          firstTouch           = e.changedTouches[0];
          startingScrollOffset = $frame.scrollLeft();
        }

        function onTouchmove ( e ) {

          $frame.addClass('touch-move');
          $frame.removeClass('touch-move-left touch-move-right');

          currentTouch = e.changedTouches[0];
          slide( firstTouch.pageX - currentTouch.pageX );
        }

        function onTouchend ( e ) {

          $frame.removeClass('touch-start touch-move touch-move-left touch-move-right');

          firstTouch           = null;
          startingScrollOffset = null;
        }

        function slide ( diff ) {

          if ( diff > 0 )
            $frame.addClass('touch-move-left');
          if ( diff < 0 )
            $frame.addClass('touch-move-right');

          var scrollLeft = startingScrollOffset + diff;

          if ( scrollLeft < 0 )
            scrollLeft = 0;
          else if ( scrollLeft > maxOffset )
            scrollLeft = maxOffset;

          $frame.scrollLeft( scrollLeft );
        }
      }
    );
  };

})();