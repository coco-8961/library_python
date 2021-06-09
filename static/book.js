$(document).ready(function () {
    $(function () {
        $("#datepicker").datepicker();
    });

//搜尋
    $("#search_bt").click(function () {
        var searchkey = $('#searchkey').val();
        console.log(searchkey);
    })

    $("#book").on("click", "#borrow_btn", function () {
        name = $(this).parents(".card").find("h4").text();
        var myDate = new Date().toLocaleString();
        $.ajax({
            url: "http://localhost:5000/borrowBook",
            type: 'POST',
            data: {
                'bookname': name,
                'time': myDate
            }
        })
        $(this).text("已借閱");
        $(this).removeClass("btn-outline-primary");
        $(this).addClass("btn-outline-secondary");
        $(this).attr("disabled", true);
        console.log(name, myDate);
    })
})
