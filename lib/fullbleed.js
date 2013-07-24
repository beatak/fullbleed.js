(function() {

var PORTRAIT_CLASS = 'portrait';
var MILSEC_INTERVAL = 333;

var current_epoch = Date.now || function () {
  return +new Date;
};
var $fullbleeds, last_executed, flag_executing, flag_pending;

var update = function () {
  if (flag_executing) {
    if (flag_executing) {
      return;
    }
    else {
      flag_executing = true;
      return;
    }
  }

  flag_executing = true;
  $fullbleeds.each(
    function (i, elm) {
      var $elm = $(elm);
      var data = $elm.data();
      var r = $elm.outerWidth() / $elm.outerHeight();
      if (!data.r) {
        data.r = (data.width / data.height);
      }
      if (r < data.r) {
        $elm.addClass(PORTRAIT_CLASS);
      }
      else {
        $elm.removeClass(PORTRAIT_CLASS);
      }
    }
  );

  flag_executing = false;
  last_executed = current_epoch();
  if (flag_pending) {
    flag_pending = false;
    update();
  }
};

$.fn.fullbleed = function() {
  this.each(function() {
    $fullbleeds = $fullbleeds.add(this);
  });
  update();
};

$(function () {
  $fullbleeds = $('*[data-fullbleed]');
  last_executed = -1;
  flag_executing = false;
  flag_pending = false;

  $(window).on('resize', function () {
    if (current_epoch() - last_executed > MILSEC_INTERVAL) {
      update();
    }
  });

  update();

  setTimeout(
    function () {
      // idealy, we should receive callback from TypeKit loader,
      // but well, I can't seem to get one. Good job Adobe.
      update();
    },
    1000
  );
});

})();
