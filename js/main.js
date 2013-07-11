var $location = $('input#location')
  , $date     = $('input#date')

  , $weather = $('.weather')
  , $temp    = $('.temperature')
  ;

// WEATHER
$weather.each( function ( index, el ) {

  var $container = $( el )
    , $input     = $container.find('input')
    , $frame     = $container.find('.frame')
    , $ul        = $frame.find('ul')
    , $glyphs    = $ul.find('.glyph')

    , $prev      = $container.find('.prev')
    , $next      = $container.find('.next')

    , index      = 0
    , width      = $glyphs.width() * $glyphs.size()
    ;

  $ul.width( width );

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

    $input.val( $glyphs.eq( index ).find('.title').text() );
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

});


// TEMP
$temp.each( function ( index, el ) {

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
});

$location.focus( function ( e ) {

  var $target = $( e.target );

  if ( $target.val() )
    $target.data('value', $target.val() );

  $target.val('');
});

$location.blur( function ( e ) {

  var $target = $( e.target );
  $target.val( $target.data('value') );
});


$('.date-picker').datepicker({
  "dateFormat": 'DD, d MM, yy'
});