$("#btnLogin").click(function(){
    let user=$("#username").val();
    let pwd=$("#userpwd").val();
    var xhr;
    if(XMLHttpRequest){
        xhr=new XMLHttpRequest();
    }else{
        xhr=new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('post',"/login.do");
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4&&xhr.status==200){
            var obj=JSON.parse(xhr.responseText);
            console.log(obj);
            if(obj.code==200&&obj.message=='登录成功'){
                location.href="../html/student.html";
            }else{
                alert('登录失败');
            }
        }
    }
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("txtName="+user+"&txtPwd="+pwd);
})