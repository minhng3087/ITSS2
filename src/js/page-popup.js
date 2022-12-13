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

chrome.extension.getBackgroundPage().getUrl(function (tab) {
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
                var x = setInterval(function () {

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

window.setTimeout(function () {
    if (!is_bg_executed) {
        $('#block-ng').show();
    }
}, 3000);

$(window).load(function () {
    Controller.popupPage();
    i18n(function () { $('#container').show(); });

    // clear storage when tab close
    clearStartTimeStorage();
    // set timestart storage
    setStartTimeStorage();
    // tab time tracking
    tabTimeTracking();
});

$('.options').on('click', function () {
    check2go(chrome.extension.getURL('options.html'), false);
});

$('.popup-close').on('click', function () {
    window.close();
});

$('#blockthis').on('click', function () {
    var domain, time1, time2, times = [];
    domain = $('#tmp-hostname').val();
    time1 = $('#tmp-time-start').val().replace(':', '');
    time2 = $('#tmp-time-end').val().replace(':', '');

    if (time1 && time2) {
        times = [time1 + '-' + time2];
    }

    Controller.addBlockData(domain, times);

    alert('Save!');

    chrome.extension.getBackgroundPage().checkCurrentTab();
});

$('[i18n="options"]').css('display', ls.get('flag-option_page_link') ? 'inline-block' : 'none');

// tab time tracking
function tabTimeTracking() {
    const tabsListBody = document.getElementById("tabs-list-body");

    chrome.tabs.getSelected(null, function (tab) {
        const myURL = tab.url
        var time, usedTime;
        var openTabs = JSON.parse(localStorage.getItem("openTabs")) || null;
        if (openTabs) {
            let startTime = new Date(openTabs[tab.id]);
            let currentTime = new Date();
            time = timeFormat(startTime);
            usedTime = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000 / 60);
        }
        document.getElementById("current-tab-title").innerHTML = myURL;
        document.getElementById("time-start").innerHTML = time;
        document.getElementById("used-time").innerHTML = `${usedTime} Mins`;
    });

    let htmlContent = "";
    chrome.tabs.getAllInWindow(null, function (tabs) {
        var openTabs = JSON.parse(localStorage.getItem("openTabs")) || null;
        for (var i = 0; i < tabs.length; i++) {
            var startTime = new Date(openTabs[tabs[i].id]);
            var currentTime = new Date();
            var formattedTime = timeFormat(startTime);
            var gap = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000 / 60);
            htmlContent += `<tr>
                <td>${tabs[i].id}</td>
                <td>${tabs[i].url}</td>
                <td>${formattedTime}</td>
                <td>${gap} Mins</td>
              </tr>`;
        }
        tabsListBody.innerHTML = htmlContent;
    });
}

// set time storage
function setStartTimeStorage() {
    let openTabs = JSON.parse(localStorage.getItem("openTabs")) || null;
    if (!openTabs) {
        openTabs = {};
        localStorage.setItem("openTabs", JSON.stringify(openTabs))
    }
    chrome.tabs.getAllInWindow(null, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {

            const checkExistKey = tabs[i].id in openTabs;
            if (!checkExistKey) {
                openTabs[tabs[i].id] = new Date();
            }
            localStorage.setItem("openTabs", JSON.stringify(openTabs))
        }
    });
}

// clear storage when tab close
function clearStartTimeStorage() {
    var openTabs = JSON.parse(localStorage.getItem("openTabs")) || null;
    if (openTabs) {
        chrome.tabs.getAllInWindow(null, function (tabs) {
            const tabIds = tabs.map(function name(tab) {
                return tab.id.toString();
            });
            for (const key in openTabs) {
                if (tabIds.includes(key)) {
                    console.log("existed")
                } else {
                    delete openTabs[key];
                }
            }
            localStorage.setItem("openTabs", JSON.stringify(openTabs));
        });
    }
}

// time format
function timeFormat(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var formattedTime = hours + ':' + minutes + ':' + seconds;
    return formattedTime;
}

