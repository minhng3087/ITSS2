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

            let sends = data.filter(item => {
                return item.from == JSON.parse(localStorage.getItem("userCode")) && item.isRecieved == "true" && item.isAccepted == "true";
            });

            let accepts = data.filter(item => {
                return item.to == JSON.parse(localStorage.getItem("userCode")) && item.isRecieved == "true" && item.isAccepted == "true";
            });

            let url = "https://639581ea90ac47c6806c7a67.mockapi.io/blockrequests";
            for (let i = 0; i < requests.length; i++) {
                let check = confirm("Accept request block from " + requests[i].name + " - " + requests[i].from + " ? ");
                requests[i].isRecieved = "true";
                if (check) {
                    requests[i].isAccepted = check.toString();
                    localStorage.setItem("blockRequestId", JSON.stringify(requests[i].id))
                    localStorage.setItem("block-manager-id", JSON.stringify(requests[i].from))
                }
                $.ajax({
                    type: "PUT",
                    url: url + "/" + requests[i].id,
                    data: JSON.stringify(requests[i]),
                    dataType: "json",
                    contentType: "application/json"
                });
            }

            for (let i = 0; i < sends.length; i++) {
                $("#send-web-form").show();
                $("#send-request-btn").hide();
                document.getElementById("to-user-code").value = sends[0].to;
                document.getElementById("to-user-code").disabled = true;
                document.getElementById("sender-name").disabled = true;
                document.getElementById("sender-name").value = sends[0].name;
            }
            console.log(accepts);
            if (accepts.length) {
                let blockList = accepts[0].data;
                // for (let i = 0; i < accepts.length; i++) {
                document.getElementById("blocked_text").value = blockList;
                document.getElementById("blocked_text").disabled = true;
                $('#save_submit').click();
                // }
            } else {
                $('#unblock-btn').hide();
            }
        });


    // check cancel request block
    fetch('https://639581ea90ac47c6806c7a67.mockapi.io/cancelrequests')
        .then((response) => response.json())
        .then((data) => {
            let requests = data.filter(item => {
                return item.to == JSON.parse(localStorage.getItem("userCode")) && item.isRecieved == "false";
            });

            let url = "https://639581ea90ac47c6806c7a67.mockapi.io/blockrequests";
            for (let i = 0; i < requests.length; i++) {
                let check = confirm("Accept cancel block from " + requests[i].from + " ? ");
                requests[i].isRecieved = "true";
                if (check) {
                    requests[i].isAccepted = check.toString();
                    $.ajax({
                        type: "DELETE",
                        url: url + "/" + requests[i].blockrequestId,
                    });
                }
                $.ajax({
                    type: "PUT",
                    url: "https://639581ea90ac47c6806c7a67.mockapi.io/cancelrequests" + "/" + requests[i].id,
                    data: JSON.stringify(requests[i]),
                    dataType: "json",
                    contentType: "application/json"
                });
            }
        });

});


$('#unblock-btn').click(function () {
    let urlCancel = "https://639581ea90ac47c6806c7a67.mockapi.io/cancelrequests";
    let urlBlockrequest = "https://639581ea90ac47c6806c7a67.mockapi.io/blockrequests";
    let data = {
        from: JSON.parse(localStorage.getItem("userCode")),
        to: JSON.parse(localStorage.getItem("block-manager-id")),
        isRecieved: false,
        isAccepted: false,
        blockrequestId: JSON.parse(localStorage.getItem("blockRequestId")),
    };

    $.ajax({
        type: "POST",
        url: urlCancel,
        data: data,
    });

    alert("Send unblock request");
})

$(window).unload(function () {
    //    Controller.save();
});

