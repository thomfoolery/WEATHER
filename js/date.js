// DATE
(function () {

  var dow_full  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
    , dow_short = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat' ]

    , months_full  = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    , months_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    , suffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
    ;

  Date.prototype.toString = function toString () {

    var s = '';

    s += dow_full[ this.getDay() ] + ' ';
    s += months_full[ this.getMonth() ] + ' ';
    s += this.getDate() + suffix[ this.getDate() % 10 ];

    return s;
  }
})();