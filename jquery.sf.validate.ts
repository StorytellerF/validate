abstract class validate {
    get message(): string {
        return this._message;
    }

    protected model: resultModel;
    protected _message: string;

    protected constructor(message) {
        this.model = new resultModel();
        this._message = message;
    }

    public abstract do(str: string): object;
}

class resultModel {
    result: boolean;
    message: string
}

/**
 * 必须验证
 */
class requiredValidate extends validate {
    private errorMessage: string;
    private correctMessage: string;

    constructor(message,error,correct) {
        super(message);
        this.errorMessage=error;
        this.correctMessage=correct;
    }

    do(str: string): resultModel {
        if ((str == null || str.trim() == "")) {
            this.model.result = false;
            this.model.message = this.errorMessage;

        } else {
            this.model.result = true;
            this.model.message = this.correctMessage;

        }
        return this.model;
    }

}
//总共6个验证
/**
 * 正则验证
 */
class regularValidate extends validate {
    protected readonly reg: string;
    private readonly errorMessage: string;
    private readonly correctMessage: string;

    constructor(reg: string, message, em, cm) {
        super(message);
        this.reg = reg;
        this.errorMessage = em;
        this.correctMessage = cm;
    }

    do(str: string): resultModel {
        let pat = new RegExp(eval(this.reg));
        if (pat.test(str)) {
            this.model.result = true;
            this.model.message = this.correctMessage;
        } else {
            this.model.result = false;
            this.model.message = this.errorMessage;
        }
        return this.model;
    }


}

/**
 * 长度验证
 */
class lengthValidate extends validate {
    protected readonly min: number;
    protected readonly max: number;
    protected readonly minErrorMessage: string;
    protected readonly maxErrorMessage: string;
    protected readonly minCorrectMessage: string;
    protected readonly maxCorrectMessage: string;

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
    constructor(min: number,
                max: number,
                message: string,
                max_em: string,
                max_cm: string,
                min_em: string,
                min_cm: string) {
        super(message);
        this.min = min;
        this.max = max;
        this.minErrorMessage = min_em;
        this.minCorrectMessage = min_cm;
        this.maxErrorMessage = max_em;
        this.maxCorrectMessage = max_cm;
    }

    do(str: string): resultModel {
        if (str.length < this.min) {
            this.model.result = false;
            this.model.message = this.minErrorMessage;
        } else if (str.length > this.max) {
            this.model.result = false;
            this.model.message = this.maxErrorMessage;
        } else {
            this.model.result = true;
            this.model.message = this.minCorrectMessage + " " + this.maxCorrectMessage;
        }
        return this.model;
    }

}

/**
 * 相等验证
 */
class equalValidate extends validate{
    validateId:string;//存储一个用来对比的标签id
    error:string;
    correct:string;
    constructor(message,id,error,correct){
        super(message);
        this.validateId=id;
        this.error=error;
        this.correct=correct;

    }
    do(str: string): object {
        let o=$(this.validateId);
        let value=o.val();
        if (value==str){
            this.model.result=true;
            this.model.message=this.correct;

        }else {
            this.model.result=false;
            this.model.message=this.error;

        }
        return this.model;
    }

}

/**
 * 范围验证
 */
class rangeValidate extends lengthValidate{

    constructor(minV,maxV,message,max_em: string,
                max_cm: string,
                min_em: string,
                min_cm: string){
        super(minV,maxV,message,max_em,max_cm,min_em,min_cm);
    }
    do(data:string):resultModel {
        let num = parseInt(data);
        if (num < this.min) {
            this.model.result = false;
            this.model.message = this.minErrorMessage;
        } else if (num> this.max) {
            this.model.result = false;
            this.model.message = this.maxErrorMessage;
        } else {
            this.model.result = true;
            this.model.message = this.minCorrectMessage + " " + this.maxCorrectMessage;
        }
        return this.model;
    }


}

let emailReg = "/[\\w]+@(?:[\\dA-Za-z-]+\\.)+[a-zA-Z]{2,4}/";
/**
 * 电子邮件验证
 */
class emailValidate extends regularValidate {
    constructor(message, em, cm) {
        super(emailReg, message, em, cm);
    }
}

/**
 * 包含验证类和回掉函数
 */
class validateModel {
    private readonly validate: validate;
    private readonly fun;

    constructor(v, f) {
        this.validate = v;
        this.fun = f;
    }

    getValidate(): validate {
        return this.validate;
    }

    getFun() {
        return this.fun;
    }
}

/**
 * 管理model
 */
class validateManager {
    private list = [];
    private obj;

    constructor() {
        this.obj = {
            result: true,
            message: "no"
        }
    }

    /**
     * 执行每个验证，获得返回对象，有错误立即停止，返回，没有继续，直到完成
     * @param {string} str
     * @returns {boolean}
     */
    do(str: string) {
        let length = this.list.length;
        for (let i = 0; i < length; i++) {
            let v: validate = this.list[i].getValidate();
            let result = v.do(str);//返回值变成{result:true,message:""}
            this.obj = result;
            let f = this.list[i].getFun();
            if (!(f == null || f == undefined)) f(result);
            if (!result) {
                return this.obj;
            }
        }
        return this.obj;
    }

    getMessage() {
        let total = "";
        for (let l of this.list) {
            if (l instanceof validateModel) {
                total += l.getValidate().message;
            }
        }
        return total;
    }
    /**
     * 添加验证
     * @param vm
     */
    push(vm: validateModel) {
        this.list.push(vm);
    }
}
