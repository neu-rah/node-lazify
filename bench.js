"use strict";

var log=console.log;

var Proxy = require('harmony-proxy');
var Reflect = require('harmony-reflect');

function lazy(f) {
  return function lazyfied() {
    var self=this;
    var args=arguments;//Array.prototype.slice.call(arguments);
    var memo=function memoizer() {
      let nv=(self?new (Function.prototype.bind.apply(f,[f].concat(Array.prototype.slice.call(args)))):f.apply(self,args));
      memo=()=>nv;
      return nv;
    }
    return new Proxy({},
      {
        get(target, trapName, receiver) {
           var o=memo();
           var trap=o[trapName];
           return trap&&(trap.bind?trap.bind(o):trap);
        },
        set(t, p, v) {
           var o=memo();
           o[p]=v;
        }
     });
   }
}

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

var n=f(10);//lazy call
var o=new Obj("o");//lazy construction
