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

        $frame.bind('mousewheel DOMMouseScroll MozMousePixelScroll', onScroll );
        $ul.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", onTransitionEnd );

        if ( value )
          index = $('.glyph.' + value ).index();

        goto( index );

        if ( Modernizr.touch ) {

          $frame.bind('scroll', function ( e ) {
            e.preventDefault();
            e.stopPropagation();
          });

          $frame.bind('touchstart webkitTouchStart', onTouchstart );
          $frame.bind('touchmove  webkitTouchMove',  onTouchmove );
          $frame.bind('touchend   webkitTouchEnd',   onTouchend );
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

        // TOUCH
        var firstTouch           = null
          , currentTouch         = null
          , originalIndex        = index
          , startingScrollOffset = null
          , maxOffset            = width - $glyphs.width()
          ;

        function onTouchstart ( e ) {

          $frame.addClass('touch-start');

          firstTouch    = currentTouch     = e.changedTouches[0];
          originalIndex = index;
        }

        function onTouchmove ( e ) {

          $frame.addClass('touch-move');
          $frame.removeClass('touch-move-left touch-move-right');

          currentTouch = e.touches[0];

          var diffX = firstTouch.pageX - currentTouch.pageX
            , diffY = firstTouch.pageY - currentTouch.pageY
            , diff  = Math.max( Math.abs( diffX ), Math.abs( diffY ) )
            , i     = index + Math.floor( diff / 10 )
            ;

          if ( diff * -1 === diffX || diff * -1 === diffY ) i *= -1;
          if ( i === 0 ) return; // EXIT
          goto( originalIndex + i );
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