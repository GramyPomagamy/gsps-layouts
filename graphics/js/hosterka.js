(()=>{"use strict";var t,e={477:(t,e,r)=>{var o=r(2529),n=r(5803),c=r(5925),i=(r(4807),r(7023),r(5654),r(779));r(8793);var s,a=r(3415),u=(s=function(t,e){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},s(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}s(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}),l=function(t,e,r,o){var n,c=arguments.length,i=c<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(i=(c<3?n(i):c>3?n(e,r,i):n(e,r))||i);return c>3&&i&&Object.defineProperty(e,r,i),i};const p=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}var r;return u(e,t),l([(r=String,void 0===r&&(r={}),function(t,e){(0,i.l)(r,t,e),(0,c.yh)((function(t,e){(t.props||(t.props={}))[e]=r}))(t,e)})],e.prototype,"host",void 0),l([c.ZP],e)}(n.Z);var f=r(5440);const h=(0,f.Z)(p,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"container layout-horizontal layout-center"},[o("img",{attrs:{id:"host-icon",src:r(7441)}}),t._v(" "),o("span",{staticClass:"text"},[t._v(t._s(t.host))])])])}),[],!1,null,"4afe35d3",null).exports;var y=function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},t(e,r)};return function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function o(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}(),d=function(t,e,r,o){var n,c=arguments.length,i=c<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(i=(c<3?n(i):c>3?n(e,r,i):n(e,r))||i);return c>3&&i&&Object.defineProperty(e,r,i),i};const v=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.showNames=!1,e}return y(e,t),e.prototype.mounted=function(){var t=this;nodecg.listenFor("showNames",(function(){t.showNames=!0})),nodecg.listenFor("hideNames",(function(){t.showNames=!1}))},d([a.aD],e.prototype,"hosterka",void 0),d([(0,c.ZP)({components:{Host:h}})],e)}(n.Z),b=(0,f.Z)(v,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("transition",{attrs:{name:"fade",mode:"out-in"}},[t.hosterka&&t.showNames?r("div",{style:{width:"100%"}},[t.hosterka.host1.length>0?r("host",{key:t.hosterka.host1,attrs:{id:"nickname1",host:t.hosterka.host1}}):t._e(),t._v(" "),t.hosterka.host2.length>0?r("host",{key:t.hosterka.host2,attrs:{id:"nickname2",host:t.hosterka.host2}}):t._e()],1):t._e()])}),[],!1,null,null,null).exports;var g=r(8586),O=r(4170),_=function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},t(e,r)};return function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function o(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();n.Z.use(g.ZP);var w=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return _(e,t),Object.defineProperty(e.prototype,"reps",{get:function(){return this.context.rootState.ReplicantModule.reps},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"hosterka",{get:function(){return this.reps.hosterkaRep},enumerable:!1,configurable:!0}),function(t,e,r,o){var n,c=arguments.length,i=c<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(i=(c<3?n(i):c>3?n(e,r,i):n(e,r))||i);return c>3&&i&&Object.defineProperty(e,r,i),i}([(0,O.Yl)({name:"OurModule"})],e)}(O.g4),m=new g.yh({strict:!1,state:{},modules:{ReplicantModule:o.np,OurModule:w}});const j=m;(0,O.rT)(w,m),(0,o.rl)(j).then((function(){new n.Z({store:j,el:"#App",render:function(t){return t(b)}})}))},779:(t,e,r)=>{r.d(e,{l:()=>n});var o="undefined"!=typeof Reflect&&void 0!==Reflect.getMetadata;function n(t,e,r){if(o&&!Array.isArray(t)&&"function"!=typeof t&&!t.hasOwnProperty("type")&&void 0===t.type){var n=Reflect.getMetadata("design:type",e,r);n!==Object&&(t.type=n)}}},7441:(t,e,r)=>{t.exports=r.p+"img/host-icon-a54b2f7bc6e3b0565f53.png"}},r={};function o(t){var n=r[t];if(void 0!==n)return n.exports;var c=r[t]={exports:{}};return e[t](c,c.exports,o),c.exports}o.m=e,t=[],o.O=(e,r,n,c)=>{if(!r){var i=1/0;for(l=0;l<t.length;l++){for(var[r,n,c]=t[l],s=!0,a=0;a<r.length;a++)(!1&c||i>=c)&&Object.keys(o.O).every((t=>o.O[t](r[a])))?r.splice(a--,1):(s=!1,c<i&&(i=c));if(s){t.splice(l--,1);var u=n();void 0!==u&&(e=u)}}return e}c=c||0;for(var l=t.length;l>0&&t[l-1][2]>c;l--)t[l]=t[l-1];t[l]=[r,n,c]},o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var r in e)o.o(e,r)&&!o.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t;o.g.importScripts&&(t=o.g.location+"");var e=o.g.document;if(!t&&e&&(e.currentScript&&(t=e.currentScript.src),!t)){var r=e.getElementsByTagName("script");r.length&&(t=r[r.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=t+"../"})(),(()=>{var t={527:0};o.O.j=e=>0===t[e];var e=(e,r)=>{var n,c,[i,s,a]=r,u=0;if(i.some((e=>0!==t[e]))){for(n in s)o.o(s,n)&&(o.m[n]=s[n]);if(a)var l=a(o)}for(e&&e(r);u<i.length;u++)c=i[u],o.o(t,c)&&t[c]&&t[c][0](),t[i[u]]=0;return o.O(l)},r=self.webpackChunk=self.webpackChunk||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))})();var n=o.O(void 0,[473],(()=>o(477)));n=o.O(n)})();