var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var validate = /** @class */ (function () {
    function validate(message) {
        this.model = new resultModel();
        this._message = message;
    }
    Object.defineProperty(validate.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    return validate;
}());
var resultModel = /** @class */ (function () {
    function resultModel() {
    }
    return resultModel;
}());
/**
 * 必须验证
 */
var requiredValidate = /** @class */ (function (_super) {
    __extends(requiredValidate, _super);
    function requiredValidate(message, error, correct) {
        var _this = _super.call(this, message) || this;
        _this.errorMessage = error;
        _this.correctMessage = correct;
        return _this;
    }
    requiredValidate.prototype.do = function (str) {
        if ((str == null || str.trim() == "")) {
            this.model.result = false;
            this.model.message = this.errorMessage;
        }
        else {
            this.model.result = true;
            this.model.message = this.correctMessage;
        }
        return this.model;
    };
    return requiredValidate;
}(validate));
//总共6个验证
/**
 * 正则验证
 */
var regularValidate = /** @class */ (function (_super) {
    __extends(regularValidate, _super);
    function regularValidate(reg, message, em, cm) {
        var _this = _super.call(this, message) || this;
        _this.reg = reg;
        _this.errorMessage = em;
        _this.correctMessage = cm;
        return _this;
    }
    regularValidate.prototype.do = function (str) {
        var pat = new RegExp(eval(this.reg));
        if (pat.test(str)) {
            this.model.result = true;
            this.model.message = this.correctMessage;
        }
        else {
            this.model.result = false;
            this.model.message = this.errorMessage;
        }
        return this.model;
    };
    return regularValidate;
}(validate));
/**
 * 长度验证
 */
var lengthValidate = /** @class */ (function (_super) {
    __extends(lengthValidate, _super);
    /**
     * 构造长度验证
     * @param {number} min 最小长度
     * @param {number} max 最大长度
     * @param {string} message 一般信息
     * @param {string} max_em 超过最大信息
     * @param {string} max_cm 最大正确信息
     * @param {string} min_em 最小错误信息
     * @param {string} min_cm 最小正确信息
     */
    function lengthValidate(min, max, message, max_em, max_cm, min_em, min_cm) {
        var _this = _super.call(this, message) || this;
        _this.min = min;
        _this.max = max;
        _this.minErrorMessage = min_em;
        _this.minCorrectMessage = min_cm;
        _this.maxErrorMessage = max_em;
        _this.maxCorrectMessage = max_cm;
        return _this;
    }
    lengthValidate.prototype.do = function (str) {
        if (str.length < this.min) {
            this.model.result = false;
            this.model.message = this.minErrorMessage;
        }
        else if (str.length > this.max) {
            this.model.result = false;
            this.model.message = this.maxErrorMessage;
        }
        else {
            this.model.result = true;
            this.model.message = this.minCorrectMessage + " " + this.maxCorrectMessage;
        }
        return this.model;
    };
    return lengthValidate;
}(validate));
/**
 * 相等验证
 */
var equalValidate = /** @class */ (function (_super) {
    __extends(equalValidate, _super);
    function equalValidate(message, id, error, correct) {
        var _this = _super.call(this, message) || this;
        _this.validateId = id;
        _this.error = error;
        _this.correct = correct;
        return _this;
    }
    equalValidate.prototype.do = function (str) {
        var o = $(this.validateId);
        var value = o.val();
        if (value == str) {
            this.model.result = true;
            this.model.message = this.correct;
        }
        else {
            this.model.result = false;
            this.model.message = this.error;
        }
        return this.model;
    };
    return equalValidate;
}(validate));
/**
 * 范围验证
 */
var rangeValidate = /** @class */ (function (_super) {
    __extends(rangeValidate, _super);
    function rangeValidate(minV, maxV, message, max_em, max_cm, min_em, min_cm) {
        return _super.call(this, minV, maxV, message, max_em, max_cm, min_em, min_cm) || this;
    }
    rangeValidate.prototype.do = function (data) {
        var num = parseInt(data);
        if (num < this.min) {
            this.model.result = false;
            this.model.message = this.minErrorMessage;
        }
        else if (num > this.max) {
            this.model.result = false;
            this.model.message = this.maxErrorMessage;
        }
        else {
            this.model.result = true;
            this.model.message = this.minCorrectMessage + " " + this.maxCorrectMessage;
        }
        return this.model;
    };
    return rangeValidate;
}(lengthValidate));
var emailReg = "/[\\w]+@(?:[\\dA-Za-z-]+\\.)+[a-zA-Z]{2,4}/";
/**
 * 电子邮件验证
 */
var emailValidate = /** @class */ (function (_super) {
    __extends(emailValidate, _super);
    function emailValidate(message, em, cm) {
        return _super.call(this, emailReg, message, em, cm) || this;
    }
    return emailValidate;
}(regularValidate));
/**
 * 包含验证类和回掉函数
 */
var validateModel = /** @class */ (function () {
    function validateModel(v, f) {
        this.validate = v;
        this.fun = f;
    }
    validateModel.prototype.getValidate = function () {
        return this.validate;
    };
    validateModel.prototype.getFun = function () {
        return this.fun;
    };
    return validateModel;
}());
/**
 * 管理model
 */
var validateManager = /** @class */ (function () {
    function validateManager() {
        this.list = [];
        this.obj = {
            result: true,
            message: "no"
        };
    }
    /**
     * 执行每个验证，获得返回对象，有错误立即停止，返回，没有继续，直到完成
     * @param {string} str
     * @returns {boolean}
     */
    validateManager.prototype.do = function (str) {
        var length = this.list.length;
        for (var i = 0; i < length; i++) {
            var v = this.list[i].getValidate();
            var result = v.do(str); //返回值变成{result:true,message:""}
            this.obj = result;
            var f = this.list[i].getFun();
            if (!(f == null || f == undefined))
                f(result);
            if (!result) {
                return this.obj;
            }
        }
        return this.obj;
    };
    validateManager.prototype.getMessage = function () {
        var total = "";
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var l = _a[_i];
            if (l instanceof validateModel) {
                total += l.getValidate().message;
            }
        }
        return total;
    };
    /**
     * 添加验证
     * @param vm
     */
    validateManager.prototype.push = function (vm) {
        this.list.push(vm);
    };
    return validateManager;
}());
//# sourceMappingURL=jquery.sf.validate.js.map