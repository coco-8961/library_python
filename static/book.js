//密碼驗證
function validate() {
    var pass = $('#inputPassword').val();
    var cpass = $("#inputCheckPassword").val();
    if (pass == cpass) {
        return true;
    } else {
        alert("Passwords do not match");
        return false;
    }
}
$(document).ready(function () {
//日曆
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
        username = $('#username').text();
        if (username == "") {
            alert('無法借閱，請先登入');
            return 0
        }
        bookname = $(this).parents(".card").find("h4").text();
        var myDate = new Date().toLocaleString();
        $.ajax({
            url: "/borrowBook",
            type: 'POST',
            data: {
                'username': username,
                'bookname': bookname,
                'time': myDate
            }
        })
        $(this).text("已借閱");
        $(this).removeClass("btn-outline-primary");
        $(this).addClass("btn-outline-secondary");
        $(this).attr("disabled", true);
        console.log(username, bookname, myDate);
    })

    $("table").on("click", "#borrow_btn", function () {
        username = $('#username').text();
        if (username == "") {
            alert('無法借閱，請先登入');
            return 0
        }
        bookname = $(this).parents("tbody").find(".fs-2").text();
        var myDate = new Date().toLocaleString();
        $.ajax({
            url: "/borrowBook",
            type: 'POST',
            data: {
                'username': username,
                'bookname': bookname,
                'time': myDate
            }
        })
        $(this).attr("hidden", true);
        $(this).parents("tbody").find("#return_btn").attr("hidden", false)
    })

    //還書
    $("#booktable").on("click", "#return_btn", function () {
        username = $('#username').text();
        if (username == "") {
            alert('無法借閱，請先登入');
            return 0
        }
        bookname = $(this).parents("tbody").find(".fs-2").text();
        var myDate = new Date().toLocaleString();
        $.ajax({
            url: "/returnBook",
            type: 'POST',
            data: {
                'username': username,
                'bookname': bookname,
                'time': myDate
            }
        })
        $(this).attr("hidden", true);
        $(this).parents("tbody").find("#borrow_btn").attr("hidden", false)
    })

    $("#returntable").on("click", "#return_btn", function () {
        username = $('#username').text();
        if (username == "") {
            alert('無法借閱，請先登入');
            return 0
        }
        bookname = $(this).parents("tr").children(".bookname").text();
        var myDate = new Date().toLocaleString();
        $.ajax({
            url: "/returnBook",
            type: 'POST',
            data: {
                'username': username,
                'bookname': bookname,
                'time': myDate
            }
        })
        $(this).parents("tr").remove();

    })
})
