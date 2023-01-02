/*!
 * JavaScript for Options Page
 *
 * @author Tetsuwo OISHI
 */

var fragment = window.location.hash.substr(1);

$(window).load(function () {
    var userCode = JSON.parse(localStorage.getItem("userCode")) || null;

    if (!userCode) {
        localStorage.setItem("userCode", JSON.stringify(Math.floor(Math.random() * 100 + Math.random() * 1000 + Math.random() * 10000 + Math.random() * 100000 + Math.random() * 1000000)));
    }

    Controller.optionsPage();
    i18n(function () {
        $('#container').show();
        $('#switching nav a').filter('[data-id="' + fragment + '"]').click();
    });




    // check request block
    fetch('https://639581ea90ac47c6806c7a67.mockapi.io/blockrequests')
        .then((response) => response.json())
        .then((data) => {
            let requests = data.filter(item => {
                return item.to == JSON.parse(localStorage.getItem("userCode")) && item.isRecieved == "false";
            });

            let url = "https://639581ea90ac47c6806c7a67.mockapi.io/blockrequests";
            for (let i = 0; i < requests.length; i++) {
                let check = confirm("Accept request block from " + requests[i].to + " ? ");
                requests[i].isRecieved = "true";
                if (check) {
                    requests[i].isAccepted = check.toString();
                }
                $.ajax({
                    type: "PUT",
                    url: url + "/" + requests[i].id,
                    data: JSON.stringify(requests[i]),
                    dataType: "json",
                    contentType: "application/json"
                });
            }
        });
});

$(window).unload(function () {
    //    Controller.save();
});

