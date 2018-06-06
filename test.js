class Car {
     do(){

     }
}
class Porsche extends Car{

    constructor(){
        super();

        this.test=",";
        console.log("test")
    }
}
let c=new Porsche();
c.do();