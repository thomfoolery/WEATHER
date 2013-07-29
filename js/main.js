var _W = {
  "isMobile": (function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  })(),

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

      if ( FB.getAuthResponse() ) {
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

      $('#facebook-login').on('click', function () {

        if ( _W.isMobile ) {
          var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=" + 209166885904722 + "&response_type=code&redirect_uri=" + encodeURI('http://thomfoolery.github.io/WEATHER/index.html');
          window.location = permissionUrl;
          return;
        }
        else
          FB.login();
      });

      FB.Event.subscribe('auth.authResponseChange', onAuthResponseChange );
    }

    $.getScript('//connect.facebook.net/en_US/all.js');

    function onAuthResponseChange (response) {

      if ( response.status === 'connected' ) {

        FB.api('/me', function( response ) {

          console.log('Good to see you, ' + response.name + '.');

          var $btn = $('<button id="account" class="ui-btn">' +
                        '<img src="http://graph.facebook.com/' + response.username + '/picture" class="profile-picture" />' +
                        response.name + '</button>'
                      );

          $('#facebook-login').replaceWith( $btn );
        });

        loginType = 'facebook';
        ID        = FB.getUserID();

      }
      // else if ( response.status === 'not_authorized' ) {
      //   // FB.login();
      // }
      // else {
      //   // FB.login();
      // }
    }
  }
);
