/*!
 * JavaScript for Pop-up Page
 *
 * @author Tetsuwo OISHI
 */

var WB = new WebsiteBlocker();
var is_bg_executed = false;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

chrome.extension.getBackgroundPage().getUrl(function(tab) {
    is_bg_executed = true;
    $('#popup-body article').hide();
    const today = new Date();
    if (tab && tab.url) {
        if (WB.checkUrl(null, tab.url.href, true)) {
            console.log(1);
            $('#block-already').show();
        }
        else {
            if (WB.getStartTime(null, tab.url.href, true)) {
                var startTime = WB.getStartTime(null, tab.url.href, true);

                startTime = startTime.toString();
                const hours = startTime[0] + startTime[1];
                const minutes = startTime[2] + startTime[3];
                const modifiedDate = new Date(today.setHours(hours, minutes));
               
                var countDownDate = modifiedDate.getTime();

                // Update the count down every 1 second
                var x = setInterval(function() {

                  // Get today's date and time
                  var now = new Date().getTime();

                  // Find the distance between now and the count down date
                  var distance = countDownDate - now;

                  // Time calculations for days, hours, minutes and seconds
                  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                  // Display the result in the element with id="demo"
                  document.getElementById("demo").innerHTML = days + "d " + hours + "h "
                  + minutes + "m " + seconds + "s ";

                  // If the count down is finished, write some text
                  if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("demo").innerHTML = "EXPIRED";
                  }
                }, 1000);
            }
            $('#tmp-hostname').val(tab.url.hostname).end().focus();
            $('#block-ok').show();
        }
    }
    else {
        console.log(3);
        $('#block-ng').show();
    }
});

window.setTimeout(function() {
    if (!is_bg_executed) {
        $('#block-ng').show();
    }
}, 3000);

$(window).load(function() {
    Controller.popupPage();
    i18n(function(){ $('#container').show(); });
});

$('.options').on('click', function() {
    check2go(chrome.extension.getURL('options.html'), false);
});

$('.popup-close').on('click', function() {
    window.close();
});

$('#blockthis').on('click', function() {
    var domain, time1, time2, times = [];
    domain = $('#tmp-hostname').val();
    time1  = $('#tmp-time-start').val().replace(':', '');
    time2  = $('#tmp-time-end').val().replace(':', '');

    if (time1 && time2) {
        times = [time1 + '-' + time2];
    }

    Controller.addBlockData(domain, times);

    alert('Save!');

    chrome.extension.getBackgroundPage().checkCurrentTab();
});

$('[i18n="options"]').css('display', ls.get('flag-option_page_link') ? 'inline-block' : 'none');


