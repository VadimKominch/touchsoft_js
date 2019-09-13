function bind(func,obj){
    return function(){
        func.apply(obj,arguments);
    };
}

var o = { name: 'Bob' }
var greet = function() { console.log(this.name); }
var oGreet = bind(greet, o);
oGreet(); // 'Bob'