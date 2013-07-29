var _W = {
  "prefix": (function () { // IIF
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
      , $ticks

      , width         = 0
      , padding       = 0

      , index         = 0
      , today         = new Date()
      , card_template = _.template( $('#card-template').html() )
      , cardOuterHeight
      , cardWidth

      , isAnimating = false
      , loginType
      , ID
      ;

    for ( var i = 0; i < 7; i++ ) {

      today.setDate( today.getDate() +1 );
      $card = createCard( i, today );
      width += $card.outerWidth( true );

      if ( i == 0 )
        $card.addClass('active');
    }

    $cards          = $('.card');
    $ticks          = $('.tick');

    cardWidth       = $card.width();
    cardOuterHeight = $card.outerHeight( true );

    $('header input')  .click( locate );
    $('footer .prev')  .click( prev );
    $('footer .next')  .click( next );
    $('footer .submit').click( onSubmit );

    $('body').bind('mousewheel DOMMouseScroll MozMousePixelScroll', onScroll );
    $main.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", onTransitionEnd );

    goto( 0 );

    // hide address bar on mobile
    window.scrollTo(0, window.pageYOffset + 1);

    function createCard ( i, date ) {

      var now        = new Date()
        , dataKey    = date.getFullYear() + '-' + ( date.getMonth() +1 ) + '-' + date.getDate()
        , dateString = (
                         date.getFullYear() === now.getFullYear() &&
                         date.getMonth() === now.getMonth() &&
                         date.getDate() === now.getDate() +1
                       )
                         ? 'Tomorrow'
                         : date.toString()

        , $card = $(
            card_template({
              "date": dateString,
              "location": _W.Location.getLocation()
            })
          )
        , $tick = $('<span class="tick">' + ( i +1 ) + '</span>')
        ;

      $tick.on('click', function () {
        index = i
        goto( i );
      });

      $('#main').append( $card );
      $('#pagination').append( $tick )
        .swipe({"swipe": onSwipe });

      _W.WeatherSelector(     $card.find('.weather-selector')    , 'weather.'     + dataKey );
      _W.TemperatureSelector( $card.find('.temperature-selector'), 'temperature.' + dataKey );

      return $card;
    }

    function prev ( e ) {
      if ( e ) e.preventDefault();
      if ( $main.is(':animated') ) return; // EXIT
      if ( index <= 0 )
        return;
      goto( --index );
    }

    function next ( e ) {
      if ( e ) e.preventDefault();
      if ( $main.is(':animated') ) return; // EXIT
      if ( index >= $cards.size() -1 )
        return;
      goto( ++index );
    }

    function goto ( index ) {

      if ( isAnimating ) return; // EXIT

      $cards.filter('.active').removeClass('active');
      $ticks.filter('.active').removeClass('active');

      $cards.eq( index ).addClass('active');
      $ticks.eq( index ).addClass('active');

      isAnimating = true;

      $main.css( _W.prefix.css + 'transform', 'translateX(' + ( - $card.outerWidth( true ) * index ) + 'px)');
    }

    function locate () {

    }

    function onSubmit ( e ) {

      var data = {};

      if ( FB.getLoginStatus() === 'connected' ) {
        data['loginType'] = loginType;
        data['id']        = ID;
      }
      else {
        FB.login();
        return;
      }

      for ( var i in window.localStorage ) {
        data[ i ] = window.localStorage[ i ];
      }

      $.post('services/index.php', JSON.stringify( data ) );
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
    }

    // SWIPE
    function onSwipe ( e, direction, distance, duration, fingerCount ) {
      if ( direction == 'right' ) prev();
      if ( direction == 'left' )  next();
    }

    function onTransitionEnd () {
      isAnimating = false;
    }

    // RESIZE
    $( window ).resize( onResize ).resize();
    function onResize () {

      var paddingSide = ( $( window ).width() / 2 ) - ( cardWidth / 2 );

      $main.width( width + paddingSide *2 );
      $main.css('paddingLeft',  paddingSide + 'px');
      $main.css('paddingRight', paddingSide + 'px');
    }

    // FB
    window.fbAsyncInit = function() {
      FB.init({
        "appId"      : '209166885904722',
        "channelUrl" : 'http://thomfoolery.github.io/WEATHER/channel.html',
        "status"     : true, // check login status
        "cookie"     : true, // enable cookies to allow the server to access the session
        "fbml"       : false
      });

      $('.facebook-login').on('click', function () { FB.login(); });

      FB.Event.subscribe('auth.authResponseChange', onAuthResponseChange );
    }

    $.getScript('//connect.facebook.net/en_US/all.js');

    function onAuthResponseChange (response) {

      if ( response.status === 'connected' ) {

        FB.api('/me', function( response ) {

          console.log('Good to see you, ' + response.name + '.');
          var $btn = $('<button class="ui-btn"/>');
          $btn.txt( response.name );
          $('.facebook-login').replaceWith( $btn );
        });

        loginType = 'facebook';
        ID        = FB.getUserID();

      } else if ( response.status === 'not_authorized' ) {
        FB.login();
      } else {
        FB.login();
      }
    }
  }
);
