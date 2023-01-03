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
