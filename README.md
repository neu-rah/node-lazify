# node-lazify

Lazify node functions returning ES6 proxy as result.

The code execution is delayed and started by output need, ES6 Proxies allow javascript laziness to be transparent.

for now this package need to:

   1- run with node --harmony-proxies

   2- and use the 'harmony-proxy' and 'harmony-reflect' for ES6 syntax

check latter if this is still needed


```javascript
"use strict";

var lazy=require("./node-lazify");

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
console.log(JSON.stringify(o.valueOf()));//still this JSON thing need the valueOf... something is not quite complete

```
