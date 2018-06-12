# validate
diting就是谛听。中国神话中可以辨别真假的神兽。<BR>
这个是一个基于jQuery的插件，用于验证form表单。拥有6种验证方式

 * 长度
 * 范围
 * 正则
 * 相等
 * 必须
 * 邮箱
 
## 使用方法

### 要验证的表单
    <form action="" method="post">
        <label for="test"></label><input type="text" id="test" />
        <label for="Name"></label><input type="text" id="Name" />
        <label for="Pwd"></label><input type="text" id="Pwd" />
        <input type="submit" value=""/>
        <div class="form-group">
            <label class="control-label" for="input1">label</label>
            <input type="text" class="form-control" id="input1"
                   aria-describedby="inputSuccessStatus helpBlock">
            <span class="glyphicon form-control-feedback" aria-hidden="true"></span>
            <span id="inputSuccessStatus" class="sr-only"></span>
            <span id="helpBlock" class="help-block"></span>
        </div>
    </form>
### 引入JavaScript

    <script src="js/jquery.js"></script>
    <script src="jquery.sf.validate.js"></script>
    <script src="jquery.sf.validate.diting.js"></script>
### 配置

    $(function () {
        $("form").diting({
            rulers:{
                input1:{
                    regular:{
                        regular:"/^test$/",
                        message:"必须填入test",
                        error:"不符合正则表达式",
                        correct:"正确",
                        fun:function (result) {
                            if (result === true) {
                                // console.log("成功");
                            }else {
                                // console.log("失败");
                            }
                        }
                    }
                }
            },
            fun:function (Key, validated) {//全局回到函数，任何一个标签验证时都会触发
                console.log(Key);//id
                console.log(validated);//true or false
            }
        })
    })
    ps:如果有bootstrap支持，需要引入字体和css文件
    ps:message：是还未验证时的信息。第二个fun后面的函数是当所以标签验证时触发
详细信息查看demo实例