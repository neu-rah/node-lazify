"use strict";

var log=console.log;
var lazy=require("./node-lazify");
var Proxy = require('harmony-proxy');
var Reflect = require('harmony-reflect');

function f(n) {
  console.log(n);
  if(n<=1) return 1;
  return n*f(n-1);
}

var Obj=class Obj {
  constructor(name) {console.log(name,"construction");this.name=name;}
  test(n) {return n+":"+this.name+" is Ok";}
  //valueOf() {console.log("valueOf",this.name);return this;}
}

//lazify some stuff
var f=lazy(f);//lazify function call
var Obj=lazy(Obj);//lazify object construction

//use the lazified stuff as if not
var n=f(10);//lazy call
var o=new Obj("o");//lazy construction

//till now nothing happens, no calcs done, no objects constructed
console.log("results------------------------------");
//execution occours here when needed to use the values
console.log(o.test("final test"));
console.log(n+0,o.name);
console.log(JSON.stringify(o.valueOf()));
