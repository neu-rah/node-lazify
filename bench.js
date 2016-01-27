"use strict";

var log=console.log;

var Proxy = require('harmony-proxy');
var Reflect = require('harmony-reflect');
//require("babel-core").transform("code", {});

//complte reflex is as good as a dumb object!
function lazy(f) {
  return function lazyfied(...args) {
    var self=this;
    //var args=arguments;//Array.prototype.slice.call(arguments);

    var memo=function memoizer(target) {
      let nv=(self?new (Function.prototype.bind.apply(f,[f].concat(args))):f.apply(self,args));
      memo=()=>nv;
      return nv;
    }

    function reflex(target) {
      var _={};
      for(var i in Reflect) _[i]=function() {
        var o=memo(target);
        log("-->",i);
        return Reflect[i].apply(f,[o].concat(args.slice(1)));
      }
      log("reflex",_);
      return _;
    }

    let handler = new Proxy({}, {
            get(target, trapName, receiver) {
                return function (...args) {
                    var o=Reflect[trapName]||(memo(target)[trapName])||target[trapName]||Object[trapName];
                    return o&&o(...args);
                }
            }
        });

    //type of target function/object dictates the proxy type on construction
    //making it dificult to chgange latter
    let target={};
    return new Proxy(target,handler);//,reflex(target));
      /*{
        get(target, trapName, receiver) {
           var o=memo();
           var trap=o[trapName];
           return trap&&(trap.bind?trap.bind(o):trap);
        },
        set(t, p, v) {
           var o=memo();
           o[p]=v;
        }
     });*/
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

var handler = new Proxy({}, {
        get(target, trapName, receiver) {
            return function (...args) {
                let o=Reflect[trapName]||Object[trapName];//||target[trapName];
                return o&&o(...args);
            }
        }
    });

var t={name:"ok"};
var p=new Proxy(t,handler);
