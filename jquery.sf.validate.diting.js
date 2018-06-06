$.fn.diting = function (data) {
    //获取全局fun
    let f = data.fun;
    //获取bootstrap支持
    let supportBootstrap = data.advanced.bootstrap;
    //为bootstrap初始化
    if (supportBootstrap) {
        let div = this.children("div.form-group");
        //去除has-success等
        // div.removeClass("has-success has-feedback");
        div.removeClass().addClass("form-group");
        //去除feedback
        div.children("span.glyphicon").removeClass().addClass("glyphicon form-control-feedback");
        div.children("span.help-block").text("").css("visibility", "hidden");
    }
    let regularTips = data.advanced.show;
    //遍历所有的 rulers
    let rulers = data.rulers;
    if (typeof rulers === "object") {
        for (let Key in rulers) {
            if (!rulers.hasOwnProperty(Key)) {
                return;
            }
            handleKey(Key);
        }
    }
    function getRegularParam(obj) {
        return new validateModel(new regularValidate(obj.regular,obj.message,obj.error,obj.correct),obj.fun);
    }
    function getLengthParam(obj) {
        return new validateModel(new lengthValidate(obj.min, obj.max, obj.message, obj.max_em, obj.max_cm, obj.min_em, obj.min_cm), obj.fun)
    }
    function getEmailParam(obj) {
        return new validateModel(new emailValidate(obj.message,obj.error,obj.correct),obj.fun);
    }

    function getRequiredParam(obj) {
          return new validateModel(new requiredValidate(obj.message,obj.error,obj.correct));
    }

    function getEqualParam(obj) {
        return new validateModel(new equalValidate(obj.message,obj.id,obj.error,obj.correct),obj.fun) ;
    }

    function getRangeParam(obj) {
        return new validateModel(new rangeValidate(obj.min,obj.max,obj.message,obj.max_em,obj.max_cm,obj.min_em,obj.min_cm),obj.fun) ;
    }

    function getValidateModelParam(cate, obj) {
        switch (cate) {
            case "regular":return getRegularParam(obj);
            case "length":return getLengthParam(obj);
            case "email":return getEmailParam(obj);
            case "required":return getRequiredParam(obj);
            case "equal":return getEqualParam(obj);
            case "range":return getRangeParam(obj);
            default:
                return null;
        }
    }
    /**
     * 根据信息是对象或字符串 ,此对象是rules下值的值
     * @param key
     * @param obj
     */
    function handleObjOrStrGetValidate(key, obj) {
        let current = obj[key];
        if (typeof obj[key] === "object") {//判断相对应的键下的值，key就是键
            //对象
            return getValidateModelParam(key,current);
        } else {
            //不是对象，那就是字符串，此时只能有一个验证方式
            return getValidateModelParam(key,obj);
        }
    }

    /**
     * 获取rulers的值，根据值是对象，字符串，解析出manager
     * @param value
     */
    function handleValidateManager(value) {
        let manager = new validateManager();
        if (typeof value === "object") {
            //对象,不止一个验证，或者有自定义错误信息
            //遍历
            for (let k in value) {
                if (!value.hasOwnProperty(k)){
                    return null;
                }
                //返回了一个model
                let model = handleObjOrStrGetValidate(k, value);
                if (model != null) {
                    manager.push(model);
                }
            }
        } else {
            //字符串,并且没有自定义错误信息,只支持这几个
            if (value === "required") {
                manager.push(new validateModel(new requiredValidate("不得为空",null,"不得为空"), null));
            } else {
                if (/^\/[\S]*\/$/.test(value)) {
                    //这是一个正则表达式
                    manager.push(new validateModel(new regularValidate(value, value, "输入错误", "输入正确"), null));
                }else if (value === "email") {
                    manager.push(new validateModel(new emailValidate("输入一个邮箱","错误","正确"),null));
                }else if (value[0] === 'l') {
                    let iv=Number(value.substring(1,value.indexOf('-'))) ;
                    let av=Number(value.substring(value.indexOf('-')+1,value.length)) ;
                    manager.push(new validateModel(new lengthValidate(iv,av,iv+"到"+av+"长度","不得超过"+av,"正确","不得低于"+iv,null),null))
                }else if (value[0] === "r") {
                    let iv=Number(value.substring(1,value.indexOf('-'))) ;
                    let av=Number(value.substring(value.indexOf('-')+1,value.length)) ;
                    manager.push(new validateModel(new rangeValidate(iv,av,iv+"到"+av+"大小","不得大于"+av,"正确","不得小于"+iv,null),null))
                }else {
                    manager.push(new validateModel(new equalValidate("",value,"两次输入不同","输入正确")))
                }
            }
        }
        return manager;
    }

    /**
     * 传递一个rulers下的键(就是标签的id)，获取manager，绑定事件到标签上
     * @param Key
     */
    function handleKey(Key) {
        //获取要验证控件
        let component = $("#" + Key);//标签id

        //获取需要什么验证
        let value = rulers[Key];//id后面的值，可能是对象，也可能时字符串 example: {IDName:'required'}
        //获取manager
        let manager = handleValidateManager(value);

        //绑定事件
        component.change(function () {
            validate(Key, manager, $(this));//example： true or false

        }).keyup(function () {
            if ($(this).val() === "") {
                showTips(Key,manager,$(this));
            }else {
                validate(Key, manager, $(this));
            }
        }).focusin(function () {
            showTips(Key, manager, $(this));
        }).focusout(function () {
            if ($(this).val() === "") {
                removeCurrentInputBootstrap($(this));
            }else {
                validate(Key,manager,$(this))
            }
        });
    }

    /**
     * 移除input标签的bootstrap效果
     * @param element input标签jQuery对象
     */
    function removeCurrentInputBootstrap(element) {
        let parent=element.parent("div.form-group");
        parent.removeClass().addClass("form-group");
        let icon=$(element.next("span.glyphicon")[0]);
        icon.removeClass().addClass("glyphicon form-control-feedback");
        let hidden=$(element.nextAll("span.sr-only")[0]);
        hidden.text("");
        let helpText=$(element.nextAll("span.help-block")[0]);
        helpText.text("");
    }
    /**
     * 验证时修改isValid的值
     * @param Key
     * @param result
     */
    function changeIsValid(Key, result) {
        $.extend($.fn.diting.is_valid, {[Key]: result});

    }

    /**
     * 点击输入框时显示提示
     * @param Key 标签id
     * @param manager 验证管理
     * @param t 标签指针
     */
    function showTips(Key, manager, t) {
        if (supportBootstrap)
            changeText("success", manager.getMessage(), t);
    }

    /**
     * 验证时修改Valid的值
     */
    function changeValid() {
        let obj = $.fn.diting.is_valid;
        for (let i in obj) {
            if (obj[i] === true) {
                $.fn.diting.valid = true;
            } else {
                $.fn.diting.valid = false;
                return;
            }
        }
    }

    /**
     * 执行验证
     * @param k
     * @param manager
     * @param t
     */
    function validate(k, manager, t) {
        let result = manager.do(t.val());//返回值变成{result:true,message:""}
        //
        if (supportBootstrap) {
            let cate;
            if (result.result) {
                cate = "success";
            } else {
                cate = "error";
            }
            changeText(cate, result.message, t);
        } else if (regularTips) {
            if (t.next("p").length === 0) {
                t.after($("<p>").addClass("error"));
            }
            t.next("p").text(result.message);
        }
        changeIsValid(k, result.result);
        changeValid();
        if (f != null && typeof (f)==="function"){
            f(k, result);
        }

        return result.result;
    }

    /**
     * 根据cate获取bootstrap预设的规则修改标签元素外观、值
     * @param cate
     * @param msg
     * @param t
     */
    function changeText(cate, msg, t) {
        let temp = $.fn.diting.changeBootstrapHelpText;
        let success = temp[cate];

        t.parent("div.form-group").removeClass(success.reverse).addClass(success.class + " has-feedback");
        t.next("span.glyphicon").removeClass(success.reverseIcon).addClass(success.icon);
        $(t.next()[1]).text(success.text);
        let span = $(t.nextAll()[2]);
        if (msg === undefined||msg===""||msg==="undefined")
            msg="";
        span.text(msg);
        span.css("visibility", "visible");
    }

    return this;
};
$.fn.diting.is_valid = {};
$.fn.diting.valid = false;
$.fn.diting.changeBootstrapHelpText = {
    success: {
        class: "has-success",
        reverse: "has-error",
        icon: "glyphicon-ok",
        reverseIcon: "glyphicon-remove",
        text: "(success)"
    },
    error: {
        class: "has-error",
        reverse: "has-success",
        icon: "glyphicon-remove",
        reverseIcon: "glyphicon-ok",
        text: "(error)"
    },
    warning:{
        class:"has-warning",
        reverse:"has-success",
        icon:"glyphicon-warning-sign",
        reverseIcon:"glyphicon-ok",
        text:"(warning)"
    }
};