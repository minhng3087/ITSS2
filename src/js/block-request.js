$("#block-request-form").submit(function (event) {

    let inputValue = document.getElementById("to-user-code").value;
    let url = "https://639581ea90ac47c6806c7a67.mockapi.io/blockrequests";
    let data = {
        from: JSON.parse(localStorage.getItem("userCode")),
        to: inputValue,
        isRecieved: false,
        isAccepted: false,
    };

    event.preventDefault();
    $.ajax({
        type: "POST",
        url: url,
        data: data,
    });

    alert("Block request !");
});

$('#btn-send-web').click(function () {
    let inputValue = $("#input-web").val();
    let url = "https://639581ea90ac47c6806c7a67.mockapi.io/blockrequests";
    var data;
    fetch('https://639581ea90ac47c6806c7a67.mockapi.io/blockrequests')
        .then((response) => response.json())
        .then((resData) => {
            let requests = resData.filter(item => {
                return item.from == JSON.parse(localStorage.getItem("userCode")) && item.isAccepted == "true";
            });

            data = requests[0];

            if (data) {
                data.data = inputValue;
                console.log(data);
                $.ajax({
                    type: "PUT",
                    url: url + "/" + data.id,
                    data: data,
                });
            }
        });

    alert(inputValue);
})
