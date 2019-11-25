//入口函数
$(function() {
  //一: 一进到文章类别页面,就显示所有的文章类别
  getData();

  function getData() {
    //1.发送ajax请求
    $.ajax({
      type: "get",
      url: BigNew.category_list,
      success: function(backData) {
        //console.log(backData);
        if (backData.code == 200) {
          //2.获取到所有的文章类别信息后,通过模板引擎渲染到页面上
          var resHtml = template("art_cate_temp", backData);
          $("tbody").html(resHtml);
        }
      }
    });
  }

  //二: 到底点击的是新增分类 /编辑 弹出来的模态框
  //show.bs.modal
  //show 方法调用之后立即触发该事件。
  //如果是通过点击某个作为触发器的元素，则此元素可以通过事件的 relatedTarget 属性进行访问。
  $("#myModal").on("show.bs.modal", function(e) {
    //就可以通过e.relatedTarget知道你是新增分类,还是编辑按钮弹出来的模态框
    //console.log(e.relatedTarget);
    if (e.relatedTarget === $("#xinzengfenlei")[0]) {
      //alert('新增分类');
      $("#exampleModalLabel").text("新增类别");
      $("#myModal .btn-queren")
        .text("新增")
        .addClass("btn-primary")
        .removeClass("btn-success");
      //reset() 方法可把表单中的元素重置为它们的默认值。
      $("#myModal form")[0].reset();
    } else {
      //alert('编辑分类');
      $("#exampleModalLabel").text("修改类别");
      $("#myModal .btn-queren")
        .text("编辑")
        .addClass("btn-success")
        .removeClass("btn-primary");

      //把编辑的当前这一行的 文章类别名 和 文章类别别名 显示在模态框中.
      $("#recipient-name").val(
        $(e.relatedTarget)
          .parent()
          .prev()
          .prev()
          .text()
      ); //文章类别名称
      $("#message-text").val(
        $(e.relatedTarget)
          .parent()
          .prev()
          .text()
      ); //文章类别 别名
      //把当前点击的整个编辑按钮身上存放的id, 保存在隐藏域中
      $("#category_id").val($(e.relatedTarget).attr("data-id"));
    }
  });

  //三. 给模态框中的 取消按钮设置一个点击事件
  $("#myModal .btn-cancel").on("click", function() {
    //reset() 方法可把表单中的元素重置为它们的默认值。
    $("#myModal form")[0].reset();
  });

  //四:给模态框中的 新增/编辑 按钮设置点击事件
  $("#myModal .btn-queren").on("click", function() {
    //判断是否拥有这个类:btn-primary ,如果有就是新增,否则就是编辑
    if ($(this).hasClass("btn-primary")) {
      // alert('新增逻辑');
      //1.获取用户输入的分类类别名称,和分类类别别名
      var cateName = $("#recipient-name")
        .val()
        .trim(); //分类类别名称
      var cateSlug = $("#message-text")
        .val()
        .trim(); //分类类别 别名
      //2.发送ajax请求,完成新增
      $.ajax({
        type: "post",
        url: BigNew.category_add,
        data: {
          name: cateName,
          slug: cateSlug
        },
        success: function(backData) {
          //console.log(backData);
          if (backData.code == 201) {
            $("#myModal").modal("hide");
            //window.location.reload();//刷新当前页面
            getData(); //重新发送ajax请求,获取数据重新渲染
          }
        }
      });
    } else {
      // alert('编辑逻辑');
      //获取当前要修改的这一行分类的id, 以及用户修改后的分类名和分类别名
      // var cateId = $('#category_id').val().trim(); //分类id
      // var cateName = $('#recipient-name').val().trim(); //分类类别名称
      // var cateSlug = $('#message-text').val().trim(); //分类类别 别名
      //上面获取数据的代码只有三句还好,如果像上面这样的获取数据的代码有三十行,那不写死了?
      //我们就想到了使用formData,但是formData他需要后端支持.  我们这个接口他不支持.
      //jQuery为我们提供了一个serialize()方法.
      //作用是: 获取form表单中有name属性的标签的值.
      var data = $("#myModal form").serialize();
      console.log(data);

      //发送ajax请求,完成编辑
      $.ajax({
        type: "post",
        url: BigNew.category_edit,
        // data: {
        //     id: cateId,
        //     name: cateName,
        //     slug: cateSlug
        // },
        data: data,
        success: function(backData) {
          //console.log(backData);
          if (backData.code == 200) {
            $("#myModal").modal("hide");
            //window.location.reload();//刷新当前页面
            getData(); //重新发送ajax请求,获取数据重新渲染
          }
        }
      });
    }
  });

  //五:删除分类
  $("tbody").on("click", ".btn-delete", function() {
    if (confirm("你确定要删除吗?")) {
      //获取要删除的分类id
      var id = $(this).attr("data-id");
      //发送ajax请求完成删除
      $.ajax({
        type: "post",
        url: BigNew.category_delete,
        data: {
          id: id
        },
        success: function(backData) {
          //console.log(backData);
          if (backData.code == 204) {
            getData();
          }
        }
      });
    }
  });

  
});
