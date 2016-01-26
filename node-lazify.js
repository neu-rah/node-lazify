"use strict";
//for now this package need to:
//   1- run with node --harmony-proxies
//   2- and use the 'harmony-proxy' for ES6 syntax
// check latter if this is still needed

//this can turn a hell of debug i guess

// i would be happier by just changing the proxy target instead of the memoizer thing
// therefor the original target would get the value (no pre-checking needed) and replace himself for good, no further checkings
// would be much faster
// also the new operator is a pain
// and the this bind stuff, proxy should connect to the outter word as the target object, but that does not depend on proxy but to js

//this aproach has severe problems to cope with the possible return type
//problems when the result type is a function... and so on...
//DONE: find a way to not polute the the target with memo and preserve closures -> use local scope
var Proxy = require('harmony-proxy');
var Reflect = require('harmony-reflect');

module.exports= function lazy(f) {
  return function lazyfied() {
    var self=this;
    var args=arguments;//Array.prototype.slice.call(arguments);
    var memo=function memoizer(t,o,args) {
      let nv=(t?new (Function.prototype.bind.apply(f,[f].concat(Array.prototype.slice.call(args)))):f.apply(o,args));
      return memo=()=>nv;
    }
    return new Proxy({},
      {
       get(target, trapName, receiver) {
          var o=memo(self,target,args);
          var trap=o[trapName]||Reflect[trapName]||undefined;
          return trap&&(trap.bind?trap.bind(o):trap);
       }
     });
   }
}
