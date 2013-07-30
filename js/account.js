// ACCOUNT
(function () {

  var loginType
    , ID

    , accountDetailsTemplate = _.template( $('#account-details-template').html().trim() );
    ;

  $('footer .submit').click( onSubmit );

  // SEND
  function onSubmit ( e ) {

    var data  = {}
      , $card = $cards.eq( index )
      ;

    if ( FB.getAuthResponse() ) {

      data['timestamp']   = Date().now();
      data['loginType']   = loginType;
      data['id']          = ID;

      data['date']        = $card.find('[name=date]').val();
      data['weather']     = $card.find('[name=weather]').val();
      data['temperature'] = $card.find('[name=temperature]').val();
    }
    else {

      if ( _W.isMobile )
        window.location = "https://m.facebook.com/dialog/oauth?client_id=" + 209166885904722 + "&response_type=code&redirect_uri=" + encodeURI('http://thomfoolery.github.io/WEATHER/index.html');
      else
        FB.login();
      return;
    }

    for ( var i in window.localStorage ) {
      data[ i ] = window.localStorage[ i ];
    }

    $.post('services/index.php', JSON.stringify( data ) );
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

      if ( _W.isMobile )
        return window.location = "https://m.facebook.com/dialog/oauth?client_id=" + 209166885904722 + "&response_type=code&redirect_uri=" + encodeURI('http://thomfoolery.github.io/WEATHER/index.html');
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

        var $btn = $('<button id="account-header" class="ui-btn">' +
                      '<img src="http://graph.facebook.com/' + response.username + '/picture" class="profile-picture" />' +
                      response.name + '</button>'
                    )

          , $accountDetails = $( accountDetailsTemplate({
                "score":  12 * 1000,
                "streaks": ['7 days over 50%', '14 days 23%', '1 month 45%']
              })
            );

        $('#facebook-login').replaceWith( $btn );
        $accountDetails.insertAfter( $btn );
      });

      loginType = 'facebook';
      ID        = FB.getUserID();

    }
  }
})();