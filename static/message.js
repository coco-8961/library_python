$(document).ready(function(){
    var id=0;
    //新增
    $("#addmsg").click(function(){
        //取彈跳視窗input的值
        var bookid = $('#add_bookid').val();
        var name = $("#add_name").val();
        var content = $('#add_content').val();
        var myDate = new Date().toLocaleString();
        console.log(name,content,myDate);
        //新增內文
        id++;
        $.ajax({
                url:"http://localhost:5000/comment/add",
                type:'POST',
                data:{
                    'commentId':id,
                    'bookId':bookid,
                    'name':name,
                    'message':content,
                    'time':myDate,
                }
            })
        $("#allmessage").prepend(
            $("<div>")
                .attr({
                    "id":"message",
                })
                .append(
                    $("<div>")
                        .attr(
                            "id","msg_id",
                        )
                        .text(id),
                    $("<div>")
                        .attr(
                            "id","book_id",
                        )
                        .text(bookid),
                    $("<div>")
                        .attr(
                            "id","msg_name",
                        )
                        .text(name),
                    $("<p>")
                        .attr(
                            "id","msg_content",
                        )
                        .text(content),
                    $("<div>")
                        .attr(
                            "class","row align-items-center",
                        )
                        .append(
                            $("<div>")
                                .attr(
                                    "class","col-2 time align-bottom",
                                    "id","msg_time",
                                )
                                .text(myDate),
                            $("<div>")
                                .attr(
                                    "class","col-1",
                                )
                                .append(
                                    $("<button>")
                                        .attr({
                                            "type":"button",
                                            "class":"btn btn-warning",
                                            "id":"bt_edit",
                                            "data-bs-toggle":"modal",
                                            "data-bs-target":"#editModal",
                                        })
                                        .text("編輯"),
                                ),
                            $("<div>")
                                .attr(
                                    "class","col-1",
                                )
                                .append(
                                    $("<button>")
                                        .attr({
                                            "type":"button",
                                            "class":"btn btn-danger",
                                            "id":"bt_del",
                                        })
                                        .text("刪除"),
                                ),
                        )
            )
        )
        //清空input的值
        $("#add_name").val("");
        $("#add_content").val("");
    })

    //刪除
    $("#allmessage").on("click","#bt_del",function(){
        msg = $(this).parents("#message");
        var id = msg.children("#msg_id").text();
        var del=confirm("確定刪除？");
        if(del==true){
            $.ajax({
                url:"http://localhost:5000/comment/delete",
                type:'POST',
                data:{
                    'commentId':id,
                }
            })
            $(this).parents("#message").remove();
        }
    })

    //編輯
    $("#allmessage").on("click","#bt_edit",function(){
        edit_msg = $(this).parents("#message");
        //拿留言板的值
        edit_id = edit_msg.children("#msg_id").text();
        var name = edit_msg.children("#msg_name").text();
        var content = edit_msg.children("#msg_content").text();
        console.log(name,content);

        //將值放入input
        $("#edit_name").val(name);
        $("#edit_content").val(content);
    })
    $("#editmsg").click(function(){
        //取彈跳視窗input的值
        var editname = $("#edit_name").val();
        var editcontent = $('#edit_content').val();
        var editmyDate = new Date().toLocaleString();
        console.log(editname,editcontent,editmyDate);
        //變更內容
        $.ajax({
            url:"http://localhost:5000/comment/edit",
            type:'POST',
            data:{
                'commentId':edit_id,
                'name':editname,
                'message':editcontent,
                'time':editmyDate,
            }
        })
        edit_msg.children("#msg_name").text(editname);
        edit_msg.children("#msg_content").text(editcontent);
        edit_msg.children("#msg_time").text(editmyDate);
    })

    //搜尋
    $("#search_bt").click(function(){
        var searchkey = $('#searchkey').val();
        console.log(searchkey);
    })
})