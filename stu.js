var student = [];
var totalPage;
var currentPage = 1;
var perPage = 3;
var editId = -1;
$(document).ready(function () {
    tbPage();//获得页数
    initData();
    tbDel(); //给删除按钮添加事件
    tbPageSize();
    tbModal();
    tbEditStu();
    tbAdd();
    stuSearchEvent();
    selClass();
})
function initData() {
    //创建xhr对象
    var xhr;
    if (XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Mircrosoft.XMLHTTP');
    }
    //使用open打开连接(发起请求)
    xhr.open('get', "/studentList.do?currentPage=" + currentPage + "&perPage=" + perPage);
    //事件来处理响应回来的数据
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            if (data.code == 200) {
                student = data.data;
                tbStart();//显示列表数据
            } else {
                console.log(data.message); 
            }
        }
    }
    //发起请求 send
    xhr.send(null);
}
function tbStart() {
    $('#tbName').html('');
    $('#pageDiv').find('button').removeClass('btn-primary');
    $('#pageDiv button').eq(currentPage - 1).addClass('btn-primary');
    console.log(currentPage);
    var tbName = document.getElementById('tbName');
    for (var i =0;i < student.length; i++) {
        tbName.innerHTML += `<tr>
        <td><input type="checkbox" id="check"></td>
        <td>${student[i].s_id}</td>
        <td>${student[i].s_name}</td>
        <td>${student[i].s_age}</td>
        <td>
           <i class="btnDel glyphicon glyphicon-trash" data-index=${student[i].s_id}></i>
           <i class="btnEdit glyphicon glyphicon-pencil" data-index=${student[i].s_id}></i>
        </td>
    </tr>`;
    }
}
function tbDel() {
    $('#tbName').on('click', '.btnDel', function () {
        var id = $(this).attr('data-index');
        var xhr;
        if (XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('microsoft.XMLHTTP');
        }
        xhr.open('get', '/student/del.do?id=' + id);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.code == 200) {
                    if (currentPage > totalPage) {
                        currentPage = totalPage;
                    }
                    tbPage(); 
                    initData();
                } else {
                    alert("删除失败");
                }
            }
        }
        xhr.send(null);
    })
}
function tbAdd() {
    $('#btnAddStu').click(function () {
        if (editId == -1) {
            var s_name = $('#modalAddName').val();
            var s_age = Number($('#modalAddAge').val());
            var xhr;
            if (XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject("microsoft.XMLHTTP");
            }
            xhr.open("get", "/student/add.do?s_name=" + s_name + "&s_age=" + s_age);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var obj = JSON.parse(xhr.responseText);
                    if (obj.code == 200) {
                        tbPage();//获得页数
                        initData();
                    } else {
                        console.log(obj.message);
                    }
                }
            }
            xhr.send(null);
            $('#myModal').modal('hide');
        } else {
            for (let i = 0; i < student.length; i++) {
                if (student[i].s_id == editId) {
                    let stuName = $('#modalAddName').val();
                    let stuAge = Number($('#modalAddAge').val());
                    var xhr;
                    if (XMLHttpRequest) {
                        xhr = new XMLHttpRequest();
                    } else {
                        xhr = new ActiveXObject("microsoft.XMLHTTP");
                    }
                    xhr.open("get", "/student/edit.do?s_name=" + stuName + "&s_age=" + stuAge + "&s_id=" + student[i].s_id);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var obj = JSON.parse(xhr.responseText);
                            if (obj.code == 200) {
                                tbPage();//获得页数
                                initData();
                            } else {
                                console.log(obj.message);
                            }
                        }
                    }
                    xhr.send(null);
                    $('#myModal').modal('hide');
                    break;
                }
            }
        }
    })
}
function tbModal() {
    $('#btnModal').click(function () {
        $('#myModalLabel').text('添加信息');
        $('#btnAddStu').text('添加');
        editId = -1
        $('#myModal input').val('');
    })
}
function tbPage() {
    var xhr;
    if (XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("microsoft.XMLHTTP");
    }
    xhr.open("get", "/total.do");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var obj = JSON.parse(xhr.responseText);
            if (obj.code == 200) {
                var count = Math.ceil(obj.data / perPage);  //总页数
                $('#pageDiv').html('');
                for (var i = 1; i <= count; i++) {
                    if (i == currentPage) {
                        $('#pageDiv').append(`<button class="btn btn-primary">${i}</button>`);
                    }
                    else {
                        $('#pageDiv').append(`<button class="btn">${i}</button>`);
                    }
                }
                initData();
            } else {
                console.log(obj.message);
            }
        }
    }
    xhr.send(null);

}
function tbPageSize() {
    $('#pageDiv').on('click', 'button', function () {
        var yeshu = Number($(this).text());
        currentPage = yeshu;
        initData();
    })
}
//修改信息
function tbEditStu() {
    $('#tbName').on('click', '.btnEdit', function () {
        $('#myModal').modal('show');
        $('#myModalLabel').text('修改信息');
        $('#btnAddStu').text('修改');
        var id = $(this).attr('data-index');
        editId = id;
        console.log(student)
        for (let i = 0; i < student.length; i++) {
            if (student[i].s_id == editId) {
                $('#modalAddName').val(student[i].s_name);
                $('#modalAddAge').val(student[i].s_age);
                break;
            }
        }
    })
}
//搜索
function stuSearchEvent() {
    $("#btnSearch").click(function () {
        var search = $("#stuSearch").val();
        var searchid = $("#classId").val();
        var xhr;
        if (XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("microsoft.XMLHTTP");
        }
        xhr.open("get", "/stuSearch.do?search=" + search + "&searchid=" + searchid);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var obj = JSON.parse(xhr.responseText);
                console.log(obj)
                if (obj.code == 200) {
                    student = obj.data;
                    tbStart();
                } else {
                    console.log(obj.data);
                }
            }
        }
        xhr.send(null);
    })
}
function selClass() {
    var xhr;
    if (XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("microsoft.XMLHTTP");
    }
    xhr.open("get", "/classList.do");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var obj = JSON.parse(xhr.responseText);
            if (obj.code == 200) {
                obj.data.forEach(function (item, index) {
                    $("#classId").append("<option value='" + item.c_id + "'>" + item.c_name + "</option>");
                });
            } else {
                console.log(obj.data);
            }
        }
    }
    xhr.send(null);
}
