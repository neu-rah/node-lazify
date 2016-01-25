"use strict";
//for now this package need to:
//   1- run with node --harmony-proxies
//   2- and use the 'harmony-proxy' for ES6 syntax
// check latter if this is still needed

//this can turn a hell of debug i guess

var Proxy = require('harmony-proxy');
var Reflect = require('harmony-reflect');

module.exports= function lazy(f) {
  return function lazyfied() {
    var self=this;
    var args=arguments;//Array.prototype.slice.call(arguments);
    function memoizer(t,o,args) {
      return t?
        (o.memo||(o.memo=new (Function.prototype.bind.apply(f,[f].concat(Array.prototype.slice.call(args)))) ))
        :( o.memo || (o.memo=f.apply(o,args)) );
    }
    return new Proxy({},
      {
       get(target, trapName, receiver) {
          var o=memoizer(self,target,args);
          if(o[trapName]) return o[trapName].bind?o[trapName].bind(o):o[trapName];
          else return Reflect[trapName]&&Reflect[trapName].apply(o,Array.prototype.slice.call(arguments,1));
          return undefined;
       }
     });
   }
}
