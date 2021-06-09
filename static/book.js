$(document).ready(function () {
    $(function () {
        $("#datepicker").datepicker();
    });

//搜尋
    $("#search_bt").click(function () {
        var searchkey = $('#searchkey').val();
        console.log(searchkey);
    })

    //借書
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

    $("table").on("click", "#borrow_btn", function () {
        name = $(this).parents("tbody").find(".fs-2").text();
        var myDate = new Date().toLocaleString();
        $.ajax({
            url: "http://localhost:5000/borrowBook",
            type: 'POST',
            data: {
                'bookname': name,
                'time': myDate
            }
        })
        $(this).attr("hidden", true);
        $(this).parents("tbody").find("#return_btn").attr("hidden", false)
        console.log(name, myDate);
    })

    //還書
    $("table").on("click", "#return_btn", function () {
        name = $(this).parents("tbody").find(".fs-2").text();
        var myDate = new Date().toLocaleString();
        $.ajax({
            url: "http://localhost:5000/returnBook",
            type: 'POST',
            data: {
                'bookname': name,
                'time': myDate
            }
        })
        $(this).attr("hidden", true);
        $(this).parents("tbody").find("#borrow_btn").attr("hidden", false)
        console.log(name, myDate);
    })
})
