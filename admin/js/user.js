//入口函数
$(function() {
  //一: 一进到个人中心页面,就显示登录的这个管理员的所有信息
  $.ajax({
    type: "get",
    url: BigNew.user_detail,
    success: function(backData) {
      //console.log(backData);
      if (backData.code == 200) {
        // $('input.username').val(backData.data.username);
        // $('input.nickname').val(backData.data.nickname);
        // $('input.email').val(backData.data.email);
        // $('input.password').val(backData.data.password);
        //上面四句代码可以简写成下面这样
        for (var key in backData.data) {
          //key:
          $("input." + key).val(backData.data[key]);
        }
        $("img.user_pic").attr("src", backData.data.userPic);
      }
    }
  });

  //二: 图片预览
  //给选择图片的input:file按钮设置一个值改变事件
  $("#exampleInputFile").on("change", function() {
    var fileIcon = this.files[0]; //获取文件
    //console.log(fileIcon);
    var url = URL.createObjectURL(fileIcon); //把这个文件生成一个url
    $("img.user_pic").attr("src", url); //把url交给预览用的img的src
  });

  //三: 点击修改按钮,完成个人信息的修改
  $("button.btn-edit").on("click", function(e) {
    e.preventDefault();
    //创建一个formData对象
    var fd = new FormData($("#form")[0]); //form表单dom对象
    //fd对象获取form表单中所有带有name属性的标签的值, 这个值要发送到接口中去,
    //所以这些name属性的取值 和 接口的参数名要一致.
    //发送ajax请求
    $.ajax({
      type: "post",
      url: BigNew.user_edit,
      data: fd,
      contentType: false,
      processData: false,
      success: function(backData) {
        //console.log(backData);
        if (backData.code == 200) {
          alert("修改成功");
          //第一种解决办法: 刷新一下页面
          //parent.window.location.reload();

          //第二种解决办法:
          //发送ajax请求,获取网站管理员用户的个人信息
          $.ajax({
            url: window.BigNew.user_info,
            success: function(backData) {
              //console.log(backData);
              if (backData.code == 200) {
                //给父页面的显示个人信息的标签设置新的值.
                parent.$(".user_info>span>i").text(backData.data.nickname);
                parent.$(".user_info>img").attr("src", backData.data.userPic);
                parent
                  .$(".user_center_link>img")
                  .attr("src", backData.data.userPic);
              }
            }
          });
        }
      }
    });
  });
});
