var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=o(((e,t)=>{t.exports=function(){return typeof Promise==`function`&&Promise.prototype&&Promise.prototype.then}})),u=o((e=>{var t,n=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];e.getSymbolSize=function(e){if(!e)throw Error(`"version" cannot be null or undefined`);if(e<1||e>40)throw Error(`"version" should be in range from 1 to 40`);return e*4+17},e.getSymbolTotalCodewords=function(e){return n[e]},e.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t},e.setToSJISFunction=function(e){if(typeof e!=`function`)throw Error(`"toSJISFunc" is not a valid function.`);t=e},e.isKanjiModeEnabled=function(){return t!==void 0},e.toSJIS=function(e){return t(e)}})),d=o((e=>{e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(t){if(typeof t!=`string`)throw Error(`Param is not a string`);switch(t.toLowerCase()){case`l`:case`low`:return e.L;case`m`:case`medium`:return e.M;case`q`:case`quartile`:return e.Q;case`h`:case`high`:return e.H;default:throw Error(`Unknown EC Level: `+t)}}e.isValid=function(e){return e&&e.bit!==void 0&&e.bit>=0&&e.bit<4},e.from=function(n,r){if(e.isValid(n))return n;try{return t(n)}catch{return r}}})),f=o(((e,t)=>{function n(){this.buffer=[],this.length=0}n.prototype={get:function(e){let t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)==1},put:function(e,t){for(let n=0;n<t;n++)this.putBit((e>>>t-n-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(e){let t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}},t.exports=n})),p=o(((e,t)=>{function n(e){if(!e||e<1)throw Error(`BitMatrix size must be defined and greater than 0`);this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}n.prototype.set=function(e,t,n,r){let i=e*this.size+t;this.data[i]=n,r&&(this.reservedBit[i]=!0)},n.prototype.get=function(e,t){return this.data[e*this.size+t]},n.prototype.xor=function(e,t,n){this.data[e*this.size+t]^=n},n.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]},t.exports=n})),m=o((e=>{var t=u().getSymbolSize;e.getRowColCoords=function(e){if(e===1)return[];let n=Math.floor(e/7)+2,r=t(e),i=r===145?26:Math.ceil((r-13)/(2*n-2))*2,a=[r-7];for(let e=1;e<n-1;e++)a[e]=a[e-1]-i;return a.push(6),a.reverse()},e.getPositions=function(t){let n=[],r=e.getRowColCoords(t),i=r.length;for(let e=0;e<i;e++)for(let t=0;t<i;t++)e===0&&t===0||e===0&&t===i-1||e===i-1&&t===0||n.push([r[e],r[t]]);return n}})),h=o((e=>{var t=u().getSymbolSize,n=7;e.getPositions=function(e){let r=t(e);return[[0,0],[r-n,0],[0,r-n]]}})),g=o((e=>{e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(e){return e!=null&&e!==``&&!isNaN(e)&&e>=0&&e<=7},e.from=function(t){return e.isValid(t)?parseInt(t,10):void 0},e.getPenaltyN1=function(e){let n=e.size,r=0,i=0,a=0,o=null,s=null;for(let c=0;c<n;c++){i=a=0,o=s=null;for(let l=0;l<n;l++){let n=e.get(c,l);n===o?i++:(i>=5&&(r+=t.N1+(i-5)),o=n,i=1),n=e.get(l,c),n===s?a++:(a>=5&&(r+=t.N1+(a-5)),s=n,a=1)}i>=5&&(r+=t.N1+(i-5)),a>=5&&(r+=t.N1+(a-5))}return r},e.getPenaltyN2=function(e){let n=e.size,r=0;for(let t=0;t<n-1;t++)for(let i=0;i<n-1;i++){let n=e.get(t,i)+e.get(t,i+1)+e.get(t+1,i)+e.get(t+1,i+1);(n===4||n===0)&&r++}return r*t.N2},e.getPenaltyN3=function(e){let n=e.size,r=0,i=0,a=0;for(let t=0;t<n;t++){i=a=0;for(let o=0;o<n;o++)i=i<<1&2047|e.get(t,o),o>=10&&(i===1488||i===93)&&r++,a=a<<1&2047|e.get(o,t),o>=10&&(a===1488||a===93)&&r++}return r*t.N3},e.getPenaltyN4=function(e){let n=0,r=e.data.length;for(let t=0;t<r;t++)n+=e.data[t];return Math.abs(Math.ceil(n*100/r/5)-10)*t.N4};function n(t,n,r){switch(t){case e.Patterns.PATTERN000:return(n+r)%2==0;case e.Patterns.PATTERN001:return n%2==0;case e.Patterns.PATTERN010:return r%3==0;case e.Patterns.PATTERN011:return(n+r)%3==0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(r/3))%2==0;case e.Patterns.PATTERN101:return n*r%2+n*r%3==0;case e.Patterns.PATTERN110:return(n*r%2+n*r%3)%2==0;case e.Patterns.PATTERN111:return(n*r%3+(n+r)%2)%2==0;default:throw Error(`bad maskPattern:`+t)}}e.applyMask=function(e,t){let r=t.size;for(let i=0;i<r;i++)for(let a=0;a<r;a++)t.isReserved(a,i)||t.xor(a,i,n(e,a,i))},e.getBestMask=function(t,n){let r=Object.keys(e.Patterns).length,i=0,a=1/0;for(let o=0;o<r;o++){n(o),e.applyMask(o,t);let r=e.getPenaltyN1(t)+e.getPenaltyN2(t)+e.getPenaltyN3(t)+e.getPenaltyN4(t);e.applyMask(o,t),r<a&&(a=r,i=o)}return i}})),_=o((e=>{var t=d(),n=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],r=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];e.getBlocksCount=function(e,r){switch(r){case t.L:return n[(e-1)*4+0];case t.M:return n[(e-1)*4+1];case t.Q:return n[(e-1)*4+2];case t.H:return n[(e-1)*4+3];default:return}},e.getTotalCodewordsCount=function(e,n){switch(n){case t.L:return r[(e-1)*4+0];case t.M:return r[(e-1)*4+1];case t.Q:return r[(e-1)*4+2];case t.H:return r[(e-1)*4+3];default:return}}})),v=o((e=>{var t=new Uint8Array(512),n=new Uint8Array(256);(function(){let e=1;for(let r=0;r<255;r++)t[r]=e,n[e]=r,e<<=1,e&256&&(e^=285);for(let e=255;e<512;e++)t[e]=t[e-255]})(),e.log=function(e){if(e<1)throw Error(`log(`+e+`)`);return n[e]},e.exp=function(e){return t[e]},e.mul=function(e,r){return e===0||r===0?0:t[n[e]+n[r]]}})),y=o((e=>{var t=v();e.mul=function(e,n){let r=new Uint8Array(e.length+n.length-1);for(let i=0;i<e.length;i++)for(let a=0;a<n.length;a++)r[i+a]^=t.mul(e[i],n[a]);return r},e.mod=function(e,n){let r=new Uint8Array(e);for(;r.length-n.length>=0;){let e=r[0];for(let i=0;i<n.length;i++)r[i]^=t.mul(n[i],e);let i=0;for(;i<r.length&&r[i]===0;)i++;r=r.slice(i)}return r},e.generateECPolynomial=function(n){let r=new Uint8Array([1]);for(let i=0;i<n;i++)r=e.mul(r,new Uint8Array([1,t.exp(i)]));return r}})),b=o(((e,t)=>{var n=y();function r(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}r.prototype.initialize=function(e){this.degree=e,this.genPoly=n.generateECPolynomial(this.degree)},r.prototype.encode=function(e){if(!this.genPoly)throw Error(`Encoder not initialized`);let t=new Uint8Array(e.length+this.degree);t.set(e);let r=n.mod(t,this.genPoly),i=this.degree-r.length;if(i>0){let e=new Uint8Array(this.degree);return e.set(r,i),e}return r},t.exports=r})),x=o((e=>{e.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}})),S=o((e=>{var t=`[0-9]+`,n=`[A-Z $%*+\\-./:]+`,r=`(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+`;r=r.replace(/u/g,`\\u`);var i=`(?:(?![A-Z0-9 $%*+\\-./:]|`+r+`)(?:.|[\r
]))+`;e.KANJI=new RegExp(r,`g`),e.BYTE_KANJI=RegExp(`[^A-Z0-9 $%*+\\-./:]+`,`g`),e.BYTE=new RegExp(i,`g`),e.NUMERIC=new RegExp(t,`g`),e.ALPHANUMERIC=new RegExp(n,`g`);var a=RegExp(`^`+r+`$`),o=RegExp(`^[0-9]+$`),s=RegExp(`^[A-Z0-9 $%*+\\-./:]+$`);e.testKanji=function(e){return a.test(e)},e.testNumeric=function(e){return o.test(e)},e.testAlphanumeric=function(e){return s.test(e)}})),C=o((e=>{var t=x(),n=S();e.NUMERIC={id:`Numeric`,bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:`Alphanumeric`,bit:2,ccBits:[9,11,13]},e.BYTE={id:`Byte`,bit:4,ccBits:[8,16,16]},e.KANJI={id:`Kanji`,bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(e,n){if(!e.ccBits)throw Error(`Invalid mode: `+e);if(!t.isValid(n))throw Error(`Invalid version: `+n);return n>=1&&n<10?e.ccBits[0]:n<27?e.ccBits[1]:e.ccBits[2]},e.getBestModeForData=function(t){return n.testNumeric(t)?e.NUMERIC:n.testAlphanumeric(t)?e.ALPHANUMERIC:n.testKanji(t)?e.KANJI:e.BYTE},e.toString=function(e){if(e&&e.id)return e.id;throw Error(`Invalid mode`)},e.isValid=function(e){return e&&e.bit&&e.ccBits};function r(t){if(typeof t!=`string`)throw Error(`Param is not a string`);switch(t.toLowerCase()){case`numeric`:return e.NUMERIC;case`alphanumeric`:return e.ALPHANUMERIC;case`kanji`:return e.KANJI;case`byte`:return e.BYTE;default:throw Error(`Unknown mode: `+t)}}e.from=function(t,n){if(e.isValid(t))return t;try{return r(t)}catch{return n}}})),ee=o((e=>{var t=u(),n=_(),r=d(),i=C(),a=x(),o=7973,s=t.getBCHDigit(o);function c(t,n,r){for(let i=1;i<=40;i++)if(n<=e.getCapacity(i,r,t))return i}function l(e,t){return i.getCharCountIndicator(e,t)+4}function f(e,t){let n=0;return e.forEach(function(e){let r=l(e.mode,t);n+=r+e.getBitsLength()}),n}function p(t,n){for(let r=1;r<=40;r++)if(f(t,r)<=e.getCapacity(r,n,i.MIXED))return r}e.from=function(e,t){return a.isValid(e)?parseInt(e,10):t},e.getCapacity=function(e,r,o){if(!a.isValid(e))throw Error(`Invalid QR Code version`);o===void 0&&(o=i.BYTE);let s=(t.getSymbolTotalCodewords(e)-n.getTotalCodewordsCount(e,r))*8;if(o===i.MIXED)return s;let c=s-l(o,e);switch(o){case i.NUMERIC:return Math.floor(c/10*3);case i.ALPHANUMERIC:return Math.floor(c/11*2);case i.KANJI:return Math.floor(c/13);case i.BYTE:default:return Math.floor(c/8)}},e.getBestVersionForData=function(e,t){let n,i=r.from(t,r.M);if(Array.isArray(e)){if(e.length>1)return p(e,i);if(e.length===0)return 1;n=e[0]}else n=e;return c(n.mode,n.getLength(),i)},e.getEncodedBits=function(e){if(!a.isValid(e)||e<7)throw Error(`Invalid QR Code version`);let n=e<<12;for(;t.getBCHDigit(n)-s>=0;)n^=o<<t.getBCHDigit(n)-s;return e<<12|n}})),w=o((e=>{var t=u(),n=1335,r=21522,i=t.getBCHDigit(n);e.getEncodedBits=function(e,a){let o=e.bit<<3|a,s=o<<10;for(;t.getBCHDigit(s)-i>=0;)s^=n<<t.getBCHDigit(s)-i;return(o<<10|s)^r}})),T=o(((e,t)=>{var n=C();function r(e){this.mode=n.NUMERIC,this.data=e.toString()}r.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){let t,n,r;for(t=0;t+3<=this.data.length;t+=3)n=this.data.substr(t,3),r=parseInt(n,10),e.put(r,10);let i=this.data.length-t;i>0&&(n=this.data.substr(t),r=parseInt(n,10),e.put(r,i*3+1))},t.exports=r})),E=o(((e,t)=>{var n=C(),r=`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:`.split(``);function i(e){this.mode=n.ALPHANUMERIC,this.data=e}i.getBitsLength=function(e){return 11*Math.floor(e/2)+e%2*6},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t=0;for(;t+2<=this.data.length;t+=2){let n=r.indexOf(this.data[t])*45;n+=r.indexOf(this.data[t+1]),e.put(n,11)}this.data.length%2&&e.put(r.indexOf(this.data[t]),6)},t.exports=i})),D=o(((e,t)=>{var n=C();function r(e){this.mode=n.BYTE,this.data=typeof e==`string`?new TextEncoder().encode(e):new Uint8Array(e)}r.getBitsLength=function(e){return e*8},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){for(let t=0,n=this.data.length;t<n;t++)e.put(this.data[t],8)},t.exports=r})),O=o(((e,t)=>{var n=C(),r=u();function i(e){this.mode=n.KANJI,this.data=e}i.getBitsLength=function(e){return e*13},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t=0;for(;t<this.data.length;t++){let n=r.toSJIS(this.data[t]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw Error(`Invalid SJIS character: `+this.data[t]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),e.put(n,13)}},t.exports=i})),k=o(((e,t)=>{var n={single_source_shortest_paths:function(e,t,r){var i={},a={};a[t]=0;var o=n.PriorityQueue.make();o.push(t,0);for(var s,c,l,u,d,f,p,m,h;!o.empty();)for(l in s=o.pop(),c=s.value,u=s.cost,d=e[c]||{},d)d.hasOwnProperty(l)&&(f=d[l],p=u+f,m=a[l],h=a[l]===void 0,(h||m>p)&&(a[l]=p,o.push(l,p),i[l]=c));if(r!==void 0&&a[r]===void 0){var g=[`Could not find a path from `,t,` to `,r,`.`].join(``);throw Error(g)}return i},extract_shortest_path_from_predecessor_list:function(e,t){for(var n=[],r=t;r;)n.push(r),e[r],r=e[r];return n.reverse(),n},find_path:function(e,t,r){var i=n.single_source_shortest_paths(e,t,r);return n.extract_shortest_path_from_predecessor_list(i,r)},PriorityQueue:{make:function(e){var t=n.PriorityQueue,r={},i;for(i in e||={},t)t.hasOwnProperty(i)&&(r[i]=t[i]);return r.queue=[],r.sorter=e.sorter||t.default_sorter,r},default_sorter:function(e,t){return e.cost-t.cost},push:function(e,t){var n={value:e,cost:t};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};t!==void 0&&(t.exports=n)})),A=o((e=>{var t=C(),n=T(),r=E(),i=D(),a=O(),o=S(),s=u(),c=k();function l(e){return unescape(encodeURIComponent(e)).length}function d(e,t,n){let r=[],i;for(;(i=e.exec(n))!==null;)r.push({data:i[0],index:i.index,mode:t,length:i[0].length});return r}function f(e){let n=d(o.NUMERIC,t.NUMERIC,e),r=d(o.ALPHANUMERIC,t.ALPHANUMERIC,e),i,a;return s.isKanjiModeEnabled()?(i=d(o.BYTE,t.BYTE,e),a=d(o.KANJI,t.KANJI,e)):(i=d(o.BYTE_KANJI,t.BYTE,e),a=[]),n.concat(r,i,a).sort(function(e,t){return e.index-t.index}).map(function(e){return{data:e.data,mode:e.mode,length:e.length}})}function p(e,o){switch(o){case t.NUMERIC:return n.getBitsLength(e);case t.ALPHANUMERIC:return r.getBitsLength(e);case t.KANJI:return a.getBitsLength(e);case t.BYTE:return i.getBitsLength(e)}}function m(e){return e.reduce(function(e,t){let n=e.length-1>=0?e[e.length-1]:null;return n&&n.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)},[])}function h(e){let n=[];for(let r=0;r<e.length;r++){let i=e[r];switch(i.mode){case t.NUMERIC:n.push([i,{data:i.data,mode:t.ALPHANUMERIC,length:i.length},{data:i.data,mode:t.BYTE,length:i.length}]);break;case t.ALPHANUMERIC:n.push([i,{data:i.data,mode:t.BYTE,length:i.length}]);break;case t.KANJI:n.push([i,{data:i.data,mode:t.BYTE,length:l(i.data)}]);break;case t.BYTE:n.push([{data:i.data,mode:t.BYTE,length:l(i.data)}])}}return n}function g(e,n){let r={},i={start:{}},a=[`start`];for(let o=0;o<e.length;o++){let s=e[o],c=[];for(let e=0;e<s.length;e++){let l=s[e],u=``+o+e;c.push(u),r[u]={node:l,lastCount:0},i[u]={};for(let e=0;e<a.length;e++){let o=a[e];r[o]&&r[o].node.mode===l.mode?(i[o][u]=p(r[o].lastCount+l.length,l.mode)-p(r[o].lastCount,l.mode),r[o].lastCount+=l.length):(r[o]&&(r[o].lastCount=l.length),i[o][u]=p(l.length,l.mode)+4+t.getCharCountIndicator(l.mode,n))}}a=c}for(let e=0;e<a.length;e++)i[a[e]].end=0;return{map:i,table:r}}function _(e,o){let c,l=t.getBestModeForData(e);if(c=t.from(o,l),c!==t.BYTE&&c.bit<l.bit)throw Error(`"`+e+`" cannot be encoded with mode `+t.toString(c)+`.
 Suggested mode is: `+t.toString(l));switch(c===t.KANJI&&!s.isKanjiModeEnabled()&&(c=t.BYTE),c){case t.NUMERIC:return new n(e);case t.ALPHANUMERIC:return new r(e);case t.KANJI:return new a(e);case t.BYTE:return new i(e)}}e.fromArray=function(e){return e.reduce(function(e,t){return typeof t==`string`?e.push(_(t,null)):t.data&&e.push(_(t.data,t.mode)),e},[])},e.fromString=function(t,n){let r=g(h(f(t,s.isKanjiModeEnabled())),n),i=c.find_path(r.map,`start`,`end`),a=[];for(let e=1;e<i.length-1;e++)a.push(r.table[i[e]].node);return e.fromArray(m(a))},e.rawSplit=function(t){return e.fromArray(f(t,s.isKanjiModeEnabled()))}})),j=o((e=>{var t=u(),n=d(),r=f(),i=p(),a=m(),o=h(),s=g(),c=_(),l=b(),v=ee(),y=w(),x=C(),S=A();function T(e,t){let n=e.size,r=o.getPositions(t);for(let t=0;t<r.length;t++){let i=r[t][0],a=r[t][1];for(let t=-1;t<=7;t++)if(!(i+t<=-1||n<=i+t))for(let r=-1;r<=7;r++)a+r<=-1||n<=a+r||(t>=0&&t<=6&&(r===0||r===6)||r>=0&&r<=6&&(t===0||t===6)||t>=2&&t<=4&&r>=2&&r<=4?e.set(i+t,a+r,!0,!0):e.set(i+t,a+r,!1,!0))}}function E(e){let t=e.size;for(let n=8;n<t-8;n++){let t=n%2==0;e.set(n,6,t,!0),e.set(6,n,t,!0)}}function D(e,t){let n=a.getPositions(t);for(let t=0;t<n.length;t++){let r=n[t][0],i=n[t][1];for(let t=-2;t<=2;t++)for(let n=-2;n<=2;n++)t===-2||t===2||n===-2||n===2||t===0&&n===0?e.set(r+t,i+n,!0,!0):e.set(r+t,i+n,!1,!0)}}function O(e,t){let n=e.size,r=v.getEncodedBits(t),i,a,o;for(let t=0;t<18;t++)i=Math.floor(t/3),a=t%3+n-8-3,o=(r>>t&1)==1,e.set(i,a,o,!0),e.set(a,i,o,!0)}function k(e,t,n){let r=e.size,i=y.getEncodedBits(t,n),a,o;for(a=0;a<15;a++)o=(i>>a&1)==1,a<6?e.set(a,8,o,!0):a<8?e.set(a+1,8,o,!0):e.set(r-15+a,8,o,!0),a<8?e.set(8,r-a-1,o,!0):a<9?e.set(8,15-a-1+1,o,!0):e.set(8,15-a-1,o,!0);e.set(r-8,8,1,!0)}function j(e,t){let n=e.size,r=-1,i=n-1,a=7,o=0;for(let s=n-1;s>0;s-=2)for(s===6&&s--;;){for(let n=0;n<2;n++)if(!e.isReserved(i,s-n)){let r=!1;o<t.length&&(r=(t[o]>>>a&1)==1),e.set(i,s-n,r),a--,a===-1&&(o++,a=7)}if(i+=r,i<0||n<=i){i-=r,r=-r;break}}}function M(e,n,i){let a=new r;i.forEach(function(t){a.put(t.mode.bit,4),a.put(t.getLength(),x.getCharCountIndicator(t.mode,e)),t.write(a)});let o=(t.getSymbolTotalCodewords(e)-c.getTotalCodewordsCount(e,n))*8;for(a.getLengthInBits()+4<=o&&a.put(0,4);a.getLengthInBits()%8!=0;)a.putBit(0);let s=(o-a.getLengthInBits())/8;for(let e=0;e<s;e++)a.put(e%2?17:236,8);return N(a,e,n)}function N(e,n,r){let i=t.getSymbolTotalCodewords(n),a=i-c.getTotalCodewordsCount(n,r),o=c.getBlocksCount(n,r),s=o-i%o,u=Math.floor(i/o),d=Math.floor(a/o),f=d+1,p=u-d,m=new l(p),h=0,g=Array(o),_=Array(o),v=0,y=new Uint8Array(e.buffer);for(let e=0;e<o;e++){let t=e<s?d:f;g[e]=y.slice(h,h+t),_[e]=m.encode(g[e]),h+=t,v=Math.max(v,t)}let b=new Uint8Array(i),x=0,S,C;for(S=0;S<v;S++)for(C=0;C<o;C++)S<g[C].length&&(b[x++]=g[C][S]);for(S=0;S<p;S++)for(C=0;C<o;C++)b[x++]=_[C][S];return b}function P(e,n,r,a){let o;if(Array.isArray(e))o=S.fromArray(e);else if(typeof e==`string`){let t=n;if(!t){let n=S.rawSplit(e);t=v.getBestVersionForData(n,r)}o=S.fromString(e,t||40)}else throw Error(`Invalid data`);let c=v.getBestVersionForData(o,r);if(!c)throw Error(`The amount of data is too big to be stored in a QR Code`);if(!n)n=c;else if(n<c)throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+c+`.
`);let l=M(n,r,o),u=new i(t.getSymbolSize(n));return T(u,n),E(u),D(u,n),k(u,r,0),n>=7&&O(u,n),j(u,l),isNaN(a)&&(a=s.getBestMask(u,k.bind(null,u,r))),s.applyMask(a,u),k(u,r,a),{modules:u,version:n,errorCorrectionLevel:r,maskPattern:a,segments:o}}e.create=function(e,r){if(e===void 0||e===``)throw Error(`No input text`);let i=n.M,a,o;return r!==void 0&&(i=n.from(r.errorCorrectionLevel,n.M),a=v.from(r.version),o=s.from(r.maskPattern),r.toSJISFunc&&t.setToSJISFunction(r.toSJISFunc)),P(e,a,i,o)}})),M=o((e=>{function t(e){if(typeof e==`number`&&(e=e.toString()),typeof e!=`string`)throw Error(`Color should be defined as hex string`);let t=e.slice().replace(`#`,``).split(``);if(t.length<3||t.length===5||t.length>8)throw Error(`Invalid hex color: `+e);(t.length===3||t.length===4)&&(t=Array.prototype.concat.apply([],t.map(function(e){return[e,e]}))),t.length===6&&t.push(`F`,`F`);let n=parseInt(t.join(``),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:`#`+t.slice(0,6).join(``)}}e.getOptions=function(e){e||={},e.color||(e.color={});let n=e.margin===void 0||e.margin===null||e.margin<0?4:e.margin,r=e.width&&e.width>=21?e.width:void 0,i=e.scale||4;return{width:r,scale:r?4:i,margin:n,color:{dark:t(e.color.dark||`#000000ff`),light:t(e.color.light||`#ffffffff`)},type:e.type,rendererOpts:e.rendererOpts||{}}},e.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale},e.getImageWidth=function(t,n){let r=e.getScale(t,n);return Math.floor((t+n.margin*2)*r)},e.qrToImageData=function(t,n,r){let i=n.modules.size,a=n.modules.data,o=e.getScale(i,r),s=Math.floor((i+r.margin*2)*o),c=r.margin*o,l=[r.color.light,r.color.dark];for(let e=0;e<s;e++)for(let n=0;n<s;n++){let u=(e*s+n)*4,d=r.color.light;if(e>=c&&n>=c&&e<s-c&&n<s-c){let t=Math.floor((e-c)/o),r=Math.floor((n-c)/o);d=l[+!!a[t*i+r]]}t[u++]=d.r,t[u++]=d.g,t[u++]=d.b,t[u]=d.a}}})),N=o((e=>{var t=M();function n(e,t,n){e.clearRect(0,0,t.width,t.height),t.style||={},t.height=n,t.width=n,t.style.height=n+`px`,t.style.width=n+`px`}function r(){try{return document.createElement(`canvas`)}catch{throw Error(`You need to specify a canvas element`)}}e.render=function(e,i,a){let o=a,s=i;o===void 0&&(!i||!i.getContext)&&(o=i,i=void 0),i||(s=r()),o=t.getOptions(o);let c=t.getImageWidth(e.modules.size,o),l=s.getContext(`2d`),u=l.createImageData(c,c);return t.qrToImageData(u.data,e,o),n(l,s,c),l.putImageData(u,0,0),s},e.renderToDataURL=function(t,n,r){let i=r;i===void 0&&(!n||!n.getContext)&&(i=n,n=void 0),i||={};let a=e.render(t,n,i),o=i.type||`image/png`,s=i.rendererOpts||{};return a.toDataURL(o,s.quality)}})),P=o((e=>{var t=M();function n(e,t){let n=e.a/255,r=t+`="`+e.hex+`"`;return n<1?r+` `+t+`-opacity="`+n.toFixed(2).slice(1)+`"`:r}function r(e,t,n){let r=e+t;return n!==void 0&&(r+=` `+n),r}function i(e,t,n){let i=``,a=0,o=!1,s=0;for(let c=0;c<e.length;c++){let l=Math.floor(c%t),u=Math.floor(c/t);!l&&!o&&(o=!0),e[c]?(s++,c>0&&l>0&&e[c-1]||(i+=o?r(`M`,l+n,.5+u+n):r(`m`,a,0),a=0,o=!1),l+1<t&&e[c+1]||(i+=r(`h`,s),s=0)):a++}return i}e.render=function(e,r,a){let o=t.getOptions(r),s=e.modules.size,c=e.modules.data,l=s+o.margin*2,u=o.color.light.a?`<path `+n(o.color.light,`fill`)+` d="M0 0h`+l+`v`+l+`H0z"/>`:``,d=`<path `+n(o.color.dark,`stroke`)+` d="`+i(c,s,o.margin)+`"/>`,f=`viewBox="0 0 `+l+` `+l+`"`,p=`<svg xmlns="http://www.w3.org/2000/svg" `+(o.width?`width="`+o.width+`" height="`+o.width+`" `:``)+f+` shape-rendering="crispEdges">`+u+d+`</svg>
`;return typeof a==`function`&&a(null,p),p}})),F=c(o((e=>{var t=l(),n=j(),r=N(),i=P();function a(e,r,i,a,o){let s=[].slice.call(arguments,1),c=s.length,l=typeof s[c-1]==`function`;if(!l&&!t())throw Error(`Callback required as last argument`);if(l){if(c<2)throw Error(`Too few arguments provided`);c===2?(o=i,i=r,r=a=void 0):c===3&&(r.getContext&&o===void 0?(o=a,a=void 0):(o=a,a=i,i=r,r=void 0))}else{if(c<1)throw Error(`Too few arguments provided`);return c===1?(i=r,r=a=void 0):c===2&&!r.getContext&&(a=i,i=r,r=void 0),new Promise(function(t,o){try{t(e(n.create(i,a),r,a))}catch(e){o(e)}})}try{let t=n.create(i,a);o(null,e(t,r,a))}catch(e){o(e)}}e.create=n.create,e.toCanvas=a.bind(null,r.render),e.toDataURL=a.bind(null,r.renderToDataURL),e.toString=a.bind(null,function(e,t,n){return i.render(e,n)})}))()),I=window.location.hostname===`localhost`?`http://localhost:3001/api`:`/api`,L={currentUser:JSON.parse(localStorage.getItem(`revly_user`)||`null`),currentTab:`profile`,clients:[],clientProfile:null,clientAnalytics:null,clientCategories:[],clientQuestions:[],clientCustomers:[],customerSearchQuery:``,adminSearchQuery:``,customizationDraft:null,modal:null,customerSession:null,customerStep:1,customerInfo:{name:``,mobile:``},currentQuestionIdx:0,customerAnswers:[],generatedReview:``,loading:!1,error:``},R={bolt:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,sparkles:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,users:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,qr:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M14 20h6"/><path d="M20 14v6"/></svg>`,star:`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,building:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/></svg>`,chart:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,palette:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,phone:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,search:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,copy:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,lock:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,user:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,trash:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,externalLink:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,plus:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,check:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,google:`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"/><path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.9 7.5 23.5 12 23.5z"/></svg>`},z=new URLSearchParams(window.location.search),B=z.get(`scan`)||z.get(`biz`);function V(){let e=document.getElementById(`app`);if(e){if(B){e.innerHTML=De(),setTimeout(()=>{let e=document.getElementById(`editableDraft`);e&&(e.style.height=`auto`,e.style.height=Math.max(160,e.scrollHeight+10)+`px`)},50);return}if(!L.currentUser){e.innerHTML=te();return}if(L.currentUser.role===`admin`){e.innerHTML=U();return}e.innerHTML=J(),setTimeout(()=>{let e=document.getElementById(`clientQrCanvas`);if(e&&L.currentUser){let t=`${window.location.origin}/?scan=${L.currentUser.username}`;F.toCanvas(e,t,{width:220,margin:2,color:{dark:L.clientProfile?.qr_color||`#0f172a`,light:`#ffffff`}})}},50)}}function te(){return`
    <div class="login-split-page">
      <div class="login-card-pro">
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:24px;">
          <div class="brand-icon" style="width:44px; height:44px;">
            ${R.bolt}
          </div>
          <div>
            <div style="font-size:24px; font-weight:800; color:#0f172a; letter-spacing:-0.035em; line-height:1.2;">Revly</div>
            <div style="font-size:12px; color:#64748b; font-weight:600;">AI Review & Customer Feedback SaaS</div>
          </div>
        </div>

        <div style="display:inline-flex; align-items:center; gap:6px; background:#eef2ff; border:1px solid #e0e7ff; padding:5px 12px; border-radius:99px; margin-bottom:20px;">
          <span class="live-pill-dot" style="background:#4f46e5; box-shadow:none;"></span>
          <span style="font-size:11.5px; font-weight:700; color:#4f46e5;">OpenAI GPT-4o-mini Connected</span>
        </div>

        <h2 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:6px;">Sign in to your dashboard</h2>
        <p style="font-size:13px; color:#64748b; margin-bottom:24px;">Enter your credentials to access your business portal</p>

        ${L.error?`
          <div style="background:#fee2e2; border:1px solid #fecaca; color:#b91c1c; padding:12px 16px; border-radius:10px; font-size:13px; margin-bottom:20px; display:flex; align-items:center; gap:8px;">
            <span>⚠️</span> <span>${L.error}</span>
          </div>
        `:``}

        <form id="loginForm" onsubmit="handleLogin(event)">
          <div style="margin-bottom:18px;">
            <label class="input-label">Username</label>
            <div style="position:relative;">
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex;">
                ${R.user}
              </span>
              <input type="text" id="loginUsername" class="pro-input" required placeholder="admin or client username" style="padding-left:42px;" autofocus>
            </div>
          </div>

          <div style="margin-bottom:24px;">
            <label class="input-label">Password</label>
            <div style="position:relative;">
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex;">
                ${R.lock}
              </span>
              <input type="password" id="loginPassword" class="pro-input" required placeholder="Enter password" style="padding-left:42px;">
            </div>
          </div>

          <button type="submit" class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%;" ${L.loading?`disabled`:``}>
            ${L.loading?`Authenticating...`:`Sign In to Portal &rarr;`}
          </button>
        </form>

        <div style="margin-top:28px; padding-top:20px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:11.5px; font-weight:600; color:#64748b;">
            Quick demo credentials:
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="quickFill('admin', 'admin123')">
              Super Admin
            </button>
            <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="quickFill('royalcafe', 'password123')">
              Royal Cafe
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function ne(e,t){document.getElementById(`loginUsername`).value=e,document.getElementById(`loginPassword`).value=t}async function re(e){e.preventDefault();let t=document.getElementById(`loginUsername`).value,n=document.getElementById(`loginPassword`).value;L.loading=!0,L.error=``,V();try{let e=await fetch(`${I}/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({username:t,password:n})}),r=await e.json();e.ok?(L.currentUser=r.user,localStorage.setItem(`revly_user`,JSON.stringify(r.user)),r.user.role===`admin`?await H():await q()):L.error=r.error||`Login failed`}catch{L.error=`Unable to connect to server`}finally{L.loading=!1,V()}}function ie(){L.currentUser=null,localStorage.removeItem(`revly_user`),V()}async function H(){try{let e=await fetch(`${I}/admin/clients`);e.ok&&(L.clients=await e.json())}catch(e){console.error(e)}}function U(){let e=L.clients.length,t=L.clients.reduce((e,t)=>e+(Number(t.scan_count)||0),0),n=L.clients.reduce((e,t)=>e+(Number(t.generated_count)||0),0),r=(L.adminSearchQuery||``).toLowerCase().trim(),i=L.clients.filter(e=>!r||(e.name||``).toLowerCase().includes(r)||(e.username||``).toLowerCase().includes(r)||(e.phone||``).toLowerCase().includes(r));return`
    <div class="dashboard-shell">
      <!-- Sidebar -->
      <aside class="dash-sidebar">
        <div class="sidebar-header">
          <div class="brand-icon">
            ${R.bolt}
          </div>
          <div>
            <div class="brand-title">Revly</div>
            <div class="brand-sub">Super Admin Portal</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-category-label">Management</div>
          <button class="nav-link active">
            ${R.users}
            Client Businesses
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-badge">
            <div class="user-avatar" style="background:#4f46e5;">SA</div>
            <div class="user-meta">
              <div class="user-name">Super Admin</div>
              <div class="user-role">Platform Manager</div>
            </div>
          </div>
          <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="handleLogout()" title="Logout" style="padding:6px 10px;">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Dashboard Area -->
      <main class="dash-main">
        <header class="dash-topbar">
          <div class="topbar-left">
            <h1 class="page-heading">Client Directory</h1>
          </div>
          <div class="topbar-right">
            <span class="live-pill">
              <span class="live-pill-dot"></span>
              Live Database Connected
            </span>
            <button class="btn-pro btn-pro-primary" onclick="openModal('create-client')">
              ${R.plus}
              Create New Client
            </button>
          </div>
        </header>

        <div class="dash-content">
          <!-- KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-top">
                <span class="kpi-label">Active Businesses</span>
                <div class="kpi-icon-bubble" style="background:#eef2ff; color:#4f46e5;">
                  ${R.building}
                </div>
              </div>
              <div class="kpi-number">${e}</div>
              <div class="kpi-footer">
                <span class="badge-pro badge-emerald">Active</span> Registered accounts
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-top">
                <span class="kpi-label">Total QR Scans</span>
                <div class="kpi-icon-bubble" style="background:#f0f9ff; color:#0284c7;">
                  ${R.qr}
                </div>
              </div>
              <div class="kpi-number">${t}</div>
              <div class="kpi-footer">
                Platform aggregate visits
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-top">
                <span class="kpi-label">AI Reviews Placed</span>
                <div class="kpi-icon-bubble" style="background:#fdf2f8; color:#db2777;">
                  ${R.sparkles}
                </div>
              </div>
              <div class="kpi-number">${n}</div>
              <div class="kpi-footer">
                Powered by gpt-4o-mini
              </div>
            </div>
          </div>

          <!-- Client Table Card -->
          <div class="dash-card">
            <div class="dash-card-header">
              <div>
                <h2 class="dash-card-title">All Client Accounts</h2>
                <div class="dash-card-desc">View business credentials, preview QR flows, and manage passwords</div>
              </div>
              <div class="search-input-wrap" style="max-width:320px;">
                ${R.search}
                <input type="text" class="pro-input" placeholder="Search clients..." value="${L.adminSearchQuery||``}" oninput="state.adminSearchQuery = this.value; render();" style="padding-left:40px;">
              </div>
            </div>

            <div class="table-container">
              <table class="pro-table">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Username</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${i.length===0?`
                    <tr>
                      <td colspan="5" style="text-align:center; padding:48px 20px; color:#64748b;">
                        <div style="font-size:32px; margin-bottom:12px;">🏢</div>
                        <div style="font-weight:700; color:#0f172a; margin-bottom:4px;">No client businesses found</div>
                        <div style="font-size:13px; margin-bottom:16px;">Try adjusting your search query or register a new business client.</div>
                        <button class="btn-pro btn-pro-primary" onclick="openModal('create-client')">+ Create New Client</button>
                      </td>
                    </tr>
                  `:i.map(e=>`
                    <tr>
                      <td>
                        <div style="display:flex; align-items:center; gap:12px;">
                          <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, #eef2ff, #e0e7ff); color:#4f46e5; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; border:1px solid #c7d2fe;">
                            ${e.name.slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div style="font-weight:700; font-size:14px; color:#0f172a;">${e.name}</div>
                            <div style="font-size:11px; color:#64748b;">ID #${e.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style="background:#f1f5f9; padding:4px 8px; border-radius:6px; font-size:12px; color:#334155; font-weight:600; border:1px solid #e2e8f0;">@${e.username}</code>
                      </td>
                      <td>
                        <span style="color:#475569; font-size:13px; font-family:var(--font-mono);">${e.phone||`—`}</span>
                      </td>
                      <td>
                        <span class="badge-pro badge-emerald">
                          <span style="width:5px; height:5px; border-radius:50%; background:#10b981;"></span>
                          Active
                        </span>
                      </td>
                      <td style="text-align:right;">
                        <div style="display:inline-flex; gap:6px;">
                          <a href="/?scan=${e.username}" target="_blank" class="btn-pro btn-pro-secondary btn-pro-sm" title="Preview Customer QR Flow">
                            ${R.externalLink}
                            View QR
                          </a>
                          <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="openModal('reset-password', { id: ${e.id}, name: '${e.name.replace(/'/g,`\\'`)}' })" title="Reset Client Password">
                            ${R.lock}
                            Password
                          </button>
                          <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteClient(${e.id})" title="Delete Client">
                            ${R.trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join(``)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      ${$()}
    </div>
  `}async function W(e){e.preventDefault();let t=document.getElementById(`clientName`).value,n=document.getElementById(`clientUsername`).value,r=document.getElementById(`clientPassword`).value,i=document.getElementById(`clientPhone`).value;try{let e=await fetch(`${I}/admin/clients`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({name:t,username:n,password:r,phone:i})}),a=await e.json();e.ok?(Q(),await H(),V()):alert(a.error||`Failed to create client`)}catch{alert(`Error connecting to server`)}}async function G(e,t){e.preventDefault();let n=document.getElementById(`newPasswordInput`).value;try{(await fetch(`${I}/admin/clients/${t}/password`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify({newPassword:n})})).ok?(alert(`Password updated successfully`),Q()):alert(`Failed to update password`)}catch{alert(`Error updating password`)}}async function K(e){if(confirm(`Are you sure you want to delete this client? All questions, scans, and feedback will be removed.`))try{await fetch(`${I}/admin/clients/${e}`,{method:`DELETE`}),await H(),V()}catch{alert(`Failed to delete client`)}}async function q(){if(!L.currentUser)return;let e=L.currentUser.id;try{let[t,n,r,i,a]=await Promise.all([fetch(`${I}/client/profile/${e}`).then(e=>e.json()),fetch(`${I}/client/analytics/${e}`).then(e=>e.json()),fetch(`${I}/client/categories/${e}`).then(e=>e.json()),fetch(`${I}/client/questions/${e}`).then(e=>e.json()),fetch(`${I}/client/customers/${e}`).then(e=>e.json()).catch(()=>[])]);L.clientProfile=t,L.clientAnalytics=n,L.clientCategories=r,L.clientQuestions=i,L.clientCustomers=Array.isArray(a)?a:[]}catch(e){console.error(`Error loading client data:`,e)}}function J(){let e=L.currentUser,t=L.clientProfile||e,n=L.clientAnalytics||{total_scans:0,total_generated:0,category_ratings:[],recent_feedback:[]},r=L.clientCustomers?L.clientCustomers.length:0;return`
    <div class="dashboard-shell">
      <!-- Modern Sidebar -->
      <aside class="dash-sidebar">
        <div class="sidebar-header">
          <div class="brand-icon">
            ${(t.name||e.name).slice(0,2).toUpperCase()}
          </div>
          <div style="min-width:0; flex:1;">
            <div class="brand-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${t.name||e.name}
            </div>
            <div class="brand-sub">Business Portal</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-category-label">Workspace</div>
          <button class="nav-link ${L.currentTab===`profile`?`active`:``}" onclick="switchTab('profile')">
            ${R.qr}
            Profile & QR Studio
          </button>

          <button class="nav-link ${L.currentTab===`customization`?`active`:``}" onclick="switchTab('customization')">
            ${R.palette}
            Customization
            <span class="badge-pro badge-indigo" style="margin-left:auto; font-size:10px; padding:2px 7px;">Live</span>
          </button>

          <button class="nav-link ${L.currentTab===`analytics`?`active`:``}" onclick="switchTab('analytics')">
            ${R.chart}
            Analytics & Reviews
          </button>

          <button class="nav-link ${L.currentTab===`customers`?`active`:``}" onclick="switchTab('customers')">
            ${R.users}
            Customers
            <span class="badge-pro badge-indigo" style="margin-left:auto; font-size:11px; padding:2px 8px;">${r}</span>
          </button>

          <button class="nav-link ${L.currentTab===`questions`?`active`:``}" onclick="switchTab('questions')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Questions & Category
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-badge">
            <div class="user-avatar" style="background:#4f46e5;">${(t.name||e.name).slice(0,1).toUpperCase()}</div>
            <div class="user-meta">
              <div class="user-name">${t.name||e.name}</div>
              <div class="user-role">@${e.username}</div>
            </div>
          </div>
          <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="handleLogout()" title="Logout" style="padding:6px 10px;">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Dashboard Area -->
      <main class="dash-main">
        <header class="dash-topbar">
          <div class="topbar-left">
            <h1 class="page-heading">
              ${L.currentTab===`profile`?`Profile & QR Studio`:``}
              ${L.currentTab===`customization`?`Review Page Customization & Mobile Studio`:``}
              ${L.currentTab===`analytics`?`Analytics & Performance`:``}
              ${L.currentTab===`customers`?`Customer Directory & Unique Visitors`:``}
              ${L.currentTab===`questions`?`Questions & Categories`:``}
            </h1>
          </div>
          <div class="topbar-right">
            <span class="live-pill">
              <span class="live-pill-dot"></span>
              AI Active (gpt-4o-mini)
            </span>
            <a href="/?scan=${e.username}" target="_blank" class="btn-pro btn-pro-primary">
              ${R.externalLink}
              Test Customer QR &rarr;
            </a>
          </div>
        </header>

        <div class="dash-content">
          ${L.currentTab===`profile`?ae(t):``}
          ${L.currentTab===`customization`?le(t):``}
          ${L.currentTab===`analytics`?ve(n):``}
          ${L.currentTab===`customers`?be():``}
          ${L.currentTab===`questions`?ye():``}
        </div>
      </main>

      ${$()}
    </div>
  `}function Y(e){L.currentTab=e,V()}function ae(e){let t=`${window.location.origin}/?scan=${L.currentUser.username}`;return`
    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:24px; align-items:flex-start;">
      <!-- Profile Form -->
      <div class="dash-card">
        <h2 class="dash-card-title" style="margin-bottom:6px;">Business Profile Details</h2>
        <div class="dash-card-desc" style="margin-bottom:20px;">Configure your business name and Google review destination link</div>

        <form onsubmit="handleSaveProfile(event)">
          <div style="margin-bottom:18px;">
            <label class="input-label">Business Name</label>
            <input type="text" id="profName" class="pro-input" required value="${e.name||``}" placeholder="e.g. Royal Cafe & Lounge">
          </div>

          <div style="margin-bottom:18px;">
            <label class="input-label">Google Review Page Link</label>
            <input type="url" id="profGoogleUrl" class="pro-input" placeholder="https://search.google.com/local/writereview?placeid=..." value="${e.google_review_url||``}">
            <span style="font-size:11px; color:#64748b; margin-top:4px; display:block;">
              Paste your Google Maps review link. Customers will be redirected here after generating their review draft.
            </span>
          </div>

          <div style="margin-bottom:24px;">
            <label class="input-label">Choose QR Code Color</label>
            <div style="display:flex; gap:10px; margin-top:8px;">
              ${[{color:`#0f172a`,name:`Dark Slate`},{color:`#4f46e5`,name:`Indigo`},{color:`#0284c7`,name:`Ocean Blue`},{color:`#059669`,name:`Emerald`},{color:`#dc2626`,name:`Crimson`}].map(t=>`
                <button type="button" 
                  onclick="selectColor('${t.color}')" 
                  style="width:36px; height:36px; border-radius:50%; background:${t.color}; border:${(e.qr_color||`#0f172a`)===t.color?`3px solid #6366f1`:`2px solid #ffffff`}; box-shadow:0 1px 3px rgba(0,0,0,0.2); cursor:pointer;"
                  title="${t.name}">
                </button>
              `).join(``)}
              <input type="hidden" id="profQrColor" value="${e.qr_color||`#0f172a`}">
            </div>
          </div>

          <button type="submit" class="btn-pro btn-pro-primary">
            Save Profile Changes
          </button>
        </form>
      </div>

      <!-- QR Studio Card -->
      <div class="dash-card" style="text-align:center;">
        <h2 class="dash-card-title" style="margin-bottom:4px;">Live Scannable QR Code</h2>
        <div class="dash-card-desc" style="margin-bottom:20px;">Display at tables, reception counters, or billing stations</div>

        <div style="background:#ffffff; border:2px solid #e2e8f0; border-radius:20px; padding:24px 20px; box-shadow:var(--shadow-md); display:inline-block; margin-bottom:20px;">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#4f46e5; margin-bottom:4px;">
            Scan to Review
          </div>
          <div style="font-size:17px; font-weight:800; color:#0f172a; margin-bottom:12px;">
            ${e.name||L.currentUser.name}
          </div>

          <div style="background:#f8fafc; padding:12px; border-radius:14px; border:1px solid #e2e8f0; display:inline-block;">
            <canvas id="clientQrCanvas" width="220" height="220"></canvas>
          </div>

          <div style="font-size:11px; font-weight:600; color:#64748b; margin-top:10px;">
            3 Quick Questions &bull; AI Review Draft
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <button class="btn-pro btn-pro-primary" onclick="downloadQrCode()">
            ${R.qr}
            Download Tabletop Stand (PNG)
          </button>

          <div style="display:flex; gap:8px;">
            <input type="text" class="pro-input" style="font-size:12px; font-family:var(--font-mono);" value="${t}" readonly>
            <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="navigator.clipboard.writeText('${t}'); alert('Customer review scan link copied to clipboard!');">
              ${R.copy}
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function oe(e){document.getElementById(`profQrColor`).value=e;let t=document.getElementById(`clientQrCanvas`);if(t&&L.currentUser){let n=`${window.location.origin}/?scan=${L.currentUser.username}`;F.toCanvas(t,n,{width:220,margin:2,color:{dark:e,light:`#ffffff`}})}}async function se(e){e.preventDefault();let t=document.getElementById(`profName`).value,n=document.getElementById(`profGoogleUrl`).value,r=document.getElementById(`profQrColor`).value;try{(await fetch(`${I}/client/profile/${L.currentUser.id}`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify({name:t,google_review_url:n,qr_color:r})})).ok&&(alert(`Profile updated successfully`),await q(),V())}catch{alert(`Failed to save profile`)}}function ce(){let e=document.getElementById(`clientQrCanvas`);if(!e)return;let t=document.createElement(`a`);t.href=e.toDataURL(`image/png`),t.download=`${L.currentUser.username}_qr_code.png`,document.body.appendChild(t),t.click(),document.body.removeChild(t)}function le(e){L.customizationDraft||={bgColor:e.bg_color||`#edf4fc`,logoUrl:e.logo_url||``,bannerUrl:e.banner_url||`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`,qrColor:e.qr_color||`#0f172a`};let t=L.customizationDraft;return`
    <div class="customization-grid">
      <!-- Left: Customization Settings -->
      <div class="dash-card">
        <h2 class="dash-card-title">Review Page Appearance</h2>
        <div class="dash-card-desc" style="margin-bottom:24px;">
          Customize how customers see your review station. Changes preview live in the mobile screen on the right.
        </div>

        <form onsubmit="handleSaveCustomization(event)">
          <!-- 1. Background Color -->
          <div style="margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid #f1f5f9;">
            <label class="input-label">Screen Background Color (Solid)</label>
            <div style="font-size:12px; color:#64748b; margin-bottom:10px;">
              Select a solid background tone for the customer review page. Pick from presets or choose any custom hex color.
            </div>

            <div class="color-swatches-row">
              ${[{name:`Soft Bluish`,color:`#edf4fc`},{name:`Sky Blue`,color:`#e0f2fe`},{name:`Indigo Mist`,color:`#eef2ff`},{name:`Cool Slate`,color:`#f1f5f9`},{name:`Pure White`,color:`#ffffff`},{name:`Dark Slate`,color:`#0f172a`}].map(e=>`
                <button type="button" 
                  class="color-swatch-circle bg-color-swatch ${t.bgColor.toLowerCase()===e.color.toLowerCase()?`active`:``}" 
                  style="background:${e.color};"
                  data-color="${e.color}"
                  title="${e.name}"
                  onclick="selectBgColorPreset('${e.color}')">
                </button>
              `).join(``)}

              <div style="display:flex; align-items:center; gap:8px; margin-left:8px; padding:4px 8px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;">
                <input type="color" id="customBgColorPicker" 
                  value="${t.bgColor&&t.bgColor.startsWith(`#`)&&t.bgColor.length===7?t.bgColor:`#edf4fc`}" 
                  style="width:32px; height:32px; border:none; border-radius:6px; cursor:pointer; padding:0; background:transparent;" 
                  oninput="handleColorPickerInput(this.value)" 
                  onchange="handleColorPickerChange(this.value)"
                  title="Choose custom color">
                <span id="bgColorHexLabel" style="font-family:var(--font-mono); font-weight:700; font-size:13px; color:#334155;">${t.bgColor}</span>
              </div>
            </div>
          </div>

          <!-- 2. Business Logo Upload -->
          <div style="margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
              <label class="input-label" style="margin-bottom:0;">Business Logo Image</label>
              <span class="badge-pro badge-indigo" style="font-size:11px; font-weight:700;">1:1 Ratio</span>
            </div>
            
            <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:16px;">
              <!-- Recommended Size Guideline -->
              <div style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; color:#3730a3; background:#eef2ff; padding:9px 12px; border-radius:8px; margin-bottom:14px; border:1px solid #e0e7ff;">
                <span style="font-size:15px;">📐</span>
                <span><strong>Perfect Size:</strong> 1:1 Square (Recommended: <strong>500 × 500 px</strong>, PNG / JPG / SVG, max 5MB)</span>
              </div>

              <div style="display:flex; align-items:center; gap:16px;">
                <!-- Logo Preview Thumbnail -->
                <div id="logoPreviewWrap" style="width:68px; height:68px; border-radius:16px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; border:2px solid #ffffff; box-shadow:0 3px 10px rgba(0,0,0,0.08);">
                  ${t.logoUrl?`
                    <img id="logoPreviewThumb" src="${t.logoUrl}" style="width:100%; height:100%; object-fit:cover;">
                  `:`
                    <span id="logoPreviewThumbText" style="font-size:22px; font-weight:800; color:#64748b;">${(e.name||`R`).slice(0,2).toUpperCase()}</span>
                  `}
                </div>

                <div style="flex:1;">
                  <input type="file" id="logoFileInput" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;" onchange="handleImageUpload(event, 'logoUrl')">
                  <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                    <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="document.getElementById('logoFileInput').click()" style="display:inline-flex; align-items:center; gap:6px;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Upload Logo Image
                    </button>
                    ${t.logoUrl?`
                      <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="removeLogoImage()" style="color:#ef4444; border-color:#fee2e2;">
                        Remove Logo
                      </button>
                    `:``}
                  </div>
                  <div id="logoUrlUploadStatus" style="margin-top:6px; font-size:11px; min-height:16px;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Cover / Rectangular Banner Image Upload -->
          <div style="margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
              <label class="input-label" style="margin-bottom:0;">Cover / Banner Rectangular Image</label>
              <span class="badge-pro badge-indigo" style="font-size:11px; font-weight:700;">16:9 Landscape</span>
            </div>

            <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:16px;">
              <!-- Recommended Size Guideline -->
              <div style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; color:#3730a3; background:#eef2ff; padding:9px 12px; border-radius:8px; margin-bottom:14px; border:1px solid #e0e7ff;">
                <span style="font-size:15px;">📐</span>
                <span><strong>Perfect Size:</strong> Landscape Rectangular (Recommended: <strong>1200 × 500 px</strong> or <strong>800 × 350 px</strong>, 16:9 ratio, max 5MB)</span>
              </div>

              <!-- Banner Preview Thumbnail -->
              <div style="margin-bottom:14px; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0; height:120px; background:#e2e8f0; position:relative;">
                <img id="bannerPreviewThumb" src="${t.bannerUrl||`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`}" style="width:100%; height:100%; object-fit:cover;">
              </div>

              <input type="file" id="bannerFileInput" accept="image/png,image/jpeg,image/webp" style="display:none;" onchange="handleImageUpload(event, 'bannerUrl')">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="document.getElementById('bannerFileInput').click()" style="display:inline-flex; align-items:center; gap:6px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload Banner Image
                </button>
                <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                  onclick="setBannerPreset('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80')">
                  Cozy Cafe
                </button>
                <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                  onclick="setBannerPreset('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80')">
                  Fine Dining
                </button>
                <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                  onclick="setBannerPreset('https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80')">
                  Lounge Bar
                </button>
              </div>
              <div id="bannerUrlUploadStatus" style="margin-top:6px; font-size:11px; min-height:16px;"></div>
            </div>
          </div>

          <!-- 4. Action Button Color -->
          <div style="margin-bottom:28px;">
            <label class="input-label">Brand Button & QR Accent Color</label>
            <div class="color-swatches-row">
              ${[{color:`#0f172a`,name:`Dark Slate`},{color:`#4f46e5`,name:`Royal Indigo`},{color:`#0284c7`,name:`Sky Ocean`},{color:`#059669`,name:`Emerald`},{color:`#dc2626`,name:`Crimson`}].map(e=>`
                <button type="button" 
                  class="color-swatch-circle qr-color-swatch ${t.qrColor===e.color?`active`:``}" 
                  style="background:${e.color};"
                  data-color="${e.color}"
                  title="${e.name}"
                  onclick="selectQrColorPreset('${e.color}')">
                </button>
              `).join(``)}
            </div>
          </div>

          <button type="submit" class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%;">
            ${R.check}
            Save Customization Changes
          </button>
        </form>
      </div>

      <!-- Right: Live Mobile Screen Simulator -->
      <div class="mobile-preview-wrapper">
        <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">
          Live Mobile Screen Preview
        </div>

        <div class="mobile-device-mockup">
          <div class="mobile-notch">
            <div class="mobile-notch-dot"></div>
          </div>

          <div id="mockupDeviceScreen" class="mobile-device-screen" style="background:${t.bgColor};">
            <!-- Mobile Top Status Bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0 8px 10px; font-size:11px; font-weight:700; color:#334155; opacity:0.8;">
              <span>9:41</span>
              <div style="display:flex; align-items:center; gap:5px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="16" width="3" height="6" rx="1"/><rect x="7" y="12" width="3" height="10" rx="1"/><rect x="13" y="7" width="3" height="15" rx="1"/><rect x="19" y="2" width="3" height="20" rx="1"/></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="18" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="9" width="10" height="6" rx="1"/><path d="M22 11v2"/></svg>
              </div>
            </div>
            <!-- Simulated White Card on Screen -->
            <div style="background:#ffffff; border-radius:20px; padding:20px 16px; border:1px solid rgba(0,0,0,0.06); box-shadow:0 8px 24px rgba(0,0,0,0.06); text-align:center; margin-top:10px;">
              <!-- 1. Top Logo -->
              <div id="mockupLogoContainer">
                ${t.logoUrl?`
                  <img src="${t.logoUrl}" class="customer-logo-img" style="width:56px; height:56px; border-radius:16px; margin:0 auto 12px; object-fit:cover;">
                `:`
                  <div class="customer-logo-img" style="width:56px; height:56px; border-radius:16px; background:#4f46e5; color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:800; margin:0 auto 12px;">
                    ${(e.name||`R`).slice(0,2).toUpperCase()}
                  </div>
                `}
              </div>

              <!-- 2. Rectangular Banner Image -->
              <img id="mockupBannerImg" src="${t.bannerUrl||`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`}" 
                class="customer-banner-img" style="height:110px; border-radius:10px; margin-bottom:14px; object-fit:cover;">

              <!-- 3. Business Name & Description -->
              <h3 style="font-size:17px; font-weight:800; color:#0f172a; margin-bottom:6px;">${e.name||`Your Business`}</h3>
              <p style="font-size:11px; color:#64748b; line-height:1.4; margin-bottom:14px;">
                Share your experience in 3 quick questions. Our AI prepares your review.
              </p>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:6px 10px; font-size:10px; color:#475569; margin-bottom:18px;">
                ⏱️ 45 seconds &bull; 100% genuine
              </div>

              <!-- Button with Brand Color -->
              <div id="mockupButtonPreview" style="background:${t.qrColor||`#4f46e5`}; color:#ffffff; font-weight:700; font-size:13px; padding:10px 16px; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                Start Feedback &rarr;
              </div>
            </div>

            <div style="text-align:center; margin-top:auto; padding-top:14px; font-size:10px; color:#64748b;">
              &bull; Live customer view &bull;
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function X(e){if(!L.customizationDraft){let e=L.clientProfile||L.currentUser;L.customizationDraft={bgColor:e.bg_color||`#edf4fc`,logoUrl:e.logo_url||``,bannerUrl:e.banner_url||`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`,qrColor:e.qr_color||`#0f172a`}}L.customizationDraft.bgColor=e;let t=document.getElementById(`mockupDeviceScreen`);t&&(t.style.backgroundColor=e);let n=document.getElementById(`bgColorHexLabel`);n&&(n.textContent=e),document.querySelectorAll(`.bg-color-swatch`).forEach(t=>{t.getAttribute(`data-color`)&&t.getAttribute(`data-color`).toLowerCase()===e.toLowerCase()?t.classList.add(`active`):t.classList.remove(`active`)})}function ue(e){X(e)}function de(e){X(e);let t=document.getElementById(`customBgColorPicker`);t&&e.startsWith(`#`)&&e.length===7&&(t.value=e)}function fe(e){if(!L.customizationDraft){let e=L.clientProfile||L.currentUser;L.customizationDraft={bgColor:e.bg_color||`#edf4fc`,logoUrl:e.logo_url||``,bannerUrl:e.banner_url||`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`,qrColor:e.qr_color||`#0f172a`}}L.customizationDraft.qrColor=e;let t=document.getElementById(`mockupButtonPreview`);t&&(t.style.backgroundColor=e),document.querySelectorAll(`.qr-color-swatch`).forEach(t=>{t.getAttribute(`data-color`)===e?t.classList.add(`active`):t.classList.remove(`active`)})}async function pe(e,t){let n=e.target.files&&e.target.files[0];if(!n)return;if(n.size>10485760){alert(`Selected image exceeds 10MB limit. Please choose a smaller image.`);return}let r=document.getElementById(`${t}UploadStatus`);r&&(r.innerHTML=`<span style="color:#4f46e5; font-size:12px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
      <span style="display:inline-block; width:12px; height:12px; border:2px solid #4f46e5; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
      Uploading image to server...
    </span>`);let i=new FileReader;i.onload=async e=>{let i=e.target.result;if(!L.customizationDraft){let e=L.clientProfile||L.currentUser;L.customizationDraft={bgColor:e.bg_color||`#edf4fc`,logoUrl:e.logo_url||``,bannerUrl:e.banner_url||`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`,qrColor:e.qr_color||`#0f172a`}}if(L.customizationDraft[t]=i,t===`logoUrl`){let e=document.getElementById(`logoPreviewWrap`);e&&(e.innerHTML=`<img id="logoPreviewThumb" src="${i}" style="width:100%; height:100%; object-fit:cover;">`);let t=document.getElementById(`mockupLogoContainer`);t&&(t.innerHTML=`<img src="${i}" class="customer-logo-img" style="width:56px; height:56px; border-radius:16px; margin:0 auto 12px; object-fit:cover;">`)}else if(t===`bannerUrl`){let e=document.getElementById(`bannerPreviewThumb`);e&&(e.src=i);let t=document.getElementById(`mockupBannerImg`);t&&(t.src=i)}try{let e=await fetch(`${I}/upload`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({data:i,filename:n.name})});if(e.ok){let n=await e.json();n.url&&(L.customizationDraft[t]=n.url,r&&(r.innerHTML=`<span style="color:#10b981; font-size:12px; font-weight:600;">✓ Uploaded successfully</span>`))}else{let t=await e.json().catch(()=>({}));r&&(r.innerHTML=`<span style="color:#f59e0b; font-size:12px; font-weight:600;">⚠️ ${t.error||`Server upload failed, using local preview`}</span>`)}}catch(e){console.error(`Upload error:`,e),r&&(r.innerHTML=`<span style="color:#f59e0b; font-size:12px; font-weight:600;">⚠️ Network error during upload, preview is active</span>`)}},i.readAsDataURL(n)}function me(){if(!L.customizationDraft){let e=L.clientProfile||L.currentUser;L.customizationDraft={bgColor:e.bg_color||`#edf4fc`,logoUrl:``,bannerUrl:e.banner_url||`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`,qrColor:e.qr_color||`#0f172a`}}L.customizationDraft.logoUrl=``,V()}function he(e){if(!L.customizationDraft){let t=L.clientProfile||L.currentUser;L.customizationDraft={bgColor:t.bg_color||`#edf4fc`,logoUrl:``,bannerUrl:e,qrColor:t.qr_color||`#0f172a`}}L.customizationDraft.bannerUrl=e;let t=document.getElementById(`mockupBannerImg`);t&&(t.src=e);let n=document.getElementById(`bannerPreviewThumb`);n&&(n.src=e)}function ge(e,t){if(!L.customizationDraft){let e=L.clientProfile||L.currentUser;L.customizationDraft={bgColor:e.bg_color||`#edf4fc`,logoUrl:e.logo_url||``,bannerUrl:e.banner_url||`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`,qrColor:e.qr_color||`#0f172a`}}L.customizationDraft[e]=t,V()}async function _e(e){e.preventDefault();let t=L.customizationDraft;try{(await fetch(`${I}/client/profile/${L.currentUser.id}`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify({bg_color:t.bgColor,logo_url:t.logoUrl,banner_url:t.bannerUrl,qr_color:t.qrColor})})).ok?(alert(`Customization saved successfully!`),await q(),V()):alert(`Failed to save customization`)}catch{alert(`Error saving customization`)}}function ve(e){return`
    <!-- Key Metrics Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">No. of QR Scans</span>
          <div class="kpi-icon-bubble" style="background:#eef2ff; color:#4f46e5;">
            ${R.qr}
          </div>
        </div>
        <div class="kpi-number">${e.total_scans}</div>
        <div class="kpi-footer">
          Customers who visited review page via QR
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Reviews Generated</span>
          <div class="kpi-icon-bubble" style="background:#ecfdf5; color:#059669;">
            ${R.sparkles}
          </div>
        </div>
        <div class="kpi-number">${e.total_generated}</div>
        <div class="kpi-footer">
          AI-assisted review drafts completed
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Conversion Rate</span>
          <div class="kpi-icon-bubble" style="background:#fffbeb; color:#d97706;">
            ${R.chart}
          </div>
        </div>
        <div class="kpi-number">${e.total_scans>0?Math.round(e.total_generated/e.total_scans*100):0}%</div>
        <div class="kpi-footer">
          Scan to completed review conversion
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; align-items:flex-start;">
      <!-- Category-Wise Ratings -->
      <div class="dash-card">
        <h2 class="dash-card-title">Category-wise Rating & Feedback</h2>
        <div class="dash-card-desc" style="margin-bottom:20px;">Average star ratings across feedback categories</div>

        ${e.category_ratings.length===0?`
          <div style="color:#64748b; font-size:13px; text-align:center; padding:32px 10px;">
            No rating feedback received yet. Scan your QR code to test!
          </div>
        `:`
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${e.category_ratings.map(e=>`
              <div class="cat-rating-row">
                <div style="min-width:120px;">
                  <strong style="font-size:13px; color:#0f172a;">${e.category_name}</strong>
                  <div style="font-size:11px; color:#64748b;">${e.response_count} response${e.response_count>1?`s`:``}</div>
                </div>

                <div class="cat-rating-bar">
                  <div class="cat-rating-fill" style="width:${Number(e.avg_rating)/5*100}%;"></div>
                </div>

                <div style="font-size:15px; font-weight:800; color:#d97706; min-width:60px; text-align:right;">
                  ★ ${e.avg_rating}
                </div>
              </div>
            `).join(``)}
          </div>
        `}
      </div>

      <!-- Recent Feedback & Review Drafts -->
      <div class="dash-card">
        <h2 class="dash-card-title">Recent Feedback Streams</h2>
        <div class="dash-card-desc" style="margin-bottom:20px;">Customer answers and AI review drafts generated</div>

        ${e.recent_feedback.length===0?`
          <div style="color:#64748b; font-size:13px; text-align:center; padding:32px 10px;">
            No customer reviews generated yet.
          </div>
        `:`
          <div style="display:flex; flex-direction:column; gap:14px; max-height:480px; overflow-y:auto;">
            ${e.recent_feedback.map(e=>`
              <div style="padding:16px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:28px; height:28px; border-radius:50%; background:#eef2ff; color:#4f46e5; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:11px;">
                      ${(e.customer_name||`A`).slice(0,1).toUpperCase()}
                    </div>
                    <strong style="color:#0f172a; font-size:13px;">${e.customer_name||`Anonymous Customer`}</strong>
                  </div>
                  <span style="font-size:11px; color:#94a3b8;">${new Date(e.created_at).toLocaleDateString()}</span>
                </div>
                <p style="font-size:13px; color:#334155; line-height:1.6; background:#fff; padding:12px; border-radius:8px; border:1px solid #f1f5f9;">
                  "${e.generated_review}"
                </p>
              </div>
            `).join(``)}
          </div>
        `}
      </div>
    </div>
  `}function ye(){return`
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; align-items:flex-start;">
      <!-- Categories Section -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div>
            <h2 class="dash-card-title">Feedback Categories</h2>
            <div class="dash-card-desc">Group your questions by service touchpoints</div>
          </div>
          <button class="btn-pro btn-pro-primary btn-pro-sm" onclick="openModal('add-category')">
            + Add Category
          </button>
        </div>

        <div class="table-container">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Questions</th>
                <th style="text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${L.clientCategories.length===0?`
                <tr>
                  <td colspan="3" style="text-align:center; padding:24px; color:#64748b;">No categories created yet.</td>
                </tr>
              `:L.clientCategories.map(e=>`
                <tr>
                  <td><strong style="color:#0f172a;">${e.name}</strong></td>
                  <td><span class="badge-pro badge-indigo">${e.question_count} questions</span></td>
                  <td style="text-align:right;">
                    <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteCategory(${e.id})">Delete</button>
                  </td>
                </tr>
              `).join(``)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div>
            <h2 class="dash-card-title">Question Bank</h2>
            <div class="dash-card-desc">Random 3 questions are selected for each scan</div>
          </div>
          <button class="btn-pro btn-pro-primary btn-pro-sm" onclick="openModal('add-question')">
            + Add Question
          </button>
        </div>

        <div class="table-container">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Question Text</th>
                <th>Category</th>
                <th style="text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${L.clientQuestions.length===0?`
                <tr>
                  <td colspan="3" style="text-align:center; padding:24px; color:#64748b;">No questions added yet.</td>
                </tr>
              `:L.clientQuestions.map(e=>`
                <tr>
                  <td style="font-weight:600; color:#0f172a; max-width:240px;">${e.question_text}</td>
                  <td><span class="badge-pro badge-indigo">${e.category_name}</span></td>
                  <td style="text-align:right;">
                    <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteQuestion(${e.id})">Delete</button>
                  </td>
                </tr>
              `).join(``)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function be(){let e=L.clientCustomers||[],t=(L.customerSearchQuery||``).toLowerCase().trim(),n=e.filter(e=>!t||(e.name||``).toLowerCase().includes(t)||(e.mobile||``).toLowerCase().includes(t)),r=e.length,i=e.reduce((e,t)=>e+(Number(t.visit_count)||1),0),a=e.filter(e=>(Number(e.visit_count)||1)>1).length,o=r>0?Math.round(a/r*100):0,s=e.reduce((e,t)=>e+(Number(t.reviews_count)||0),0);return`
    <!-- Top KPI Cards for Customers -->
    <div class="customer-stats-grid">
      <div class="customer-stat-box">
        <div class="customer-stat-icon" style="background:#eef2ff; color:#4f46e5;">
          ${R.users}
        </div>
        <div>
          <div class="customer-stat-val">${r}</div>
          <div class="customer-stat-lbl">Unique Customers</div>
        </div>
      </div>

      <div class="customer-stat-box">
        <div class="customer-stat-icon" style="background:#ecfdf5; color:#059669;">
          ${R.qr}
        </div>
        <div>
          <div class="customer-stat-val">${i}</div>
          <div class="customer-stat-lbl">Total Scans / Visits</div>
        </div>
      </div>

      <div class="customer-stat-box">
        <div class="customer-stat-icon" style="background:#fffbeb; color:#d97706;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </div>
        <div>
          <div class="customer-stat-val">${a}</div>
          <div class="customer-stat-lbl">Repeat Visitors (${o}%)</div>
        </div>
      </div>

      <div class="customer-stat-box">
        <div class="customer-stat-icon" style="background:#f1f5f9; color:#0f172a;">
          ${R.star}
        </div>
        <div>
          <div class="customer-stat-val">${s}</div>
          <div class="customer-stat-lbl">Reviews Placed</div>
        </div>
      </div>
    </div>

    <!-- Main Customer Table Card -->
    <div class="dash-card">
      <div class="search-filter-row">
        <div>
          <h2 class="dash-card-title" style="margin-bottom:4px;">Customer Directory</h2>
          <div class="dash-card-desc">All customers who scanned your QR code, grouped uniquely by verified mobile number.</div>
        </div>

        <div class="search-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="pro-input" placeholder="Search by name or mobile number..." value="${L.customerSearchQuery||``}" oninput="state.customerSearchQuery = this.value; render();">
        </div>
      </div>

      ${n.length===0?`
        <div class="empty-state-pro" style="padding:48px 20px; text-align:center;">
          <div style="font-size:36px; margin-bottom:12px;">👥</div>
          <h3 style="font-size:16px; font-weight:700; color:#0f172a; margin-bottom:6px;">${t?`No matching customers found`:`No customer records yet`}</h3>
          <p style="font-size:13px; color:#64748b; max-width:400px; margin:0 auto;">${t?`Try searching with a different name or mobile number.`:`When customers scan your QR code and provide their contact details, they will be tracked here with their unique visit counts.`}</p>
        </div>
      `:`
        <div class="table-container">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile Number (Unique)</th>
                <th>Total Scans / Visits</th>
                <th>Reviews Drafted</th>
                <th>Last Visited</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${n.map(e=>`
                <tr>
                  <td>
                    <div class="customer-name-cell">
                      <div class="customer-avatar-circle">
                        ${(e.name||`G`).slice(0,1).toUpperCase()}
                      </div>
                      <div>
                        <div style="font-weight:700; color:#0f172a; font-size:14px;">${e.name||`Guest`}</div>
                        <div style="font-size:11px; color:#94a3b8;">ID #${e.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="customer-mobile-pill">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      ${e.mobile}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span class="visit-count-badge ${Number(e.visit_count)>1?`repeat-visitor-badge`:``}">
                        ${e.visit_count} ${Number(e.visit_count)===1?`Scan`:`Scans`}
                      </span>
                      ${Number(e.visit_count)>1?`<span style="font-size:11px; font-weight:700; color:#d97706; background:#fffbeb; padding:2px 6px; border-radius:4px; border:1px solid #fef3c7;">Repeat</span>`:``}
                    </div>
                  </td>
                  <td>
                    <span class="badge-pro badge-indigo">${e.reviews_count||0} Drafts</span>
                  </td>
                  <td>
                    <div style="font-size:13px; color:#334155; font-weight:600;">
                      ${new Date(e.last_visited).toLocaleDateString(void 0,{month:`short`,day:`numeric`,year:`numeric`})}
                    </div>
                    <div style="font-size:11px; color:#94a3b8;">
                      ${new Date(e.last_visited).toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`})}
                    </div>
                  </td>
                  <td style="text-align:right;">
                    <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteCustomer(${e.id})" title="Delete customer record">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </td>
                </tr>
              `).join(``)}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `}async function xe(e){if(confirm(`Are you sure you want to remove this customer record?`))try{(await fetch(`${I}/client/customers/${e}`,{method:`DELETE`})).ok&&(L.clientCustomers=L.clientCustomers.filter(t=>t.id!==e),V())}catch(e){console.error(`Failed to delete customer:`,e)}}async function Se(e){e.preventDefault();let t=document.getElementById(`catNameInput`).value;try{(await fetch(`${I}/client/categories/${L.currentUser.id}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({name:t})})).ok&&(Q(),await q(),V())}catch{alert(`Failed to add category`)}}async function Ce(e){if(confirm(`Delete this category and its questions?`))try{await fetch(`${I}/client/categories/${e}`,{method:`DELETE`}),await q(),V()}catch{alert(`Failed to delete category`)}}async function we(e){e.preventDefault();let t=document.getElementById(`qCatSelect`).value,n=document.getElementById(`qTextInput`).value;try{(await fetch(`${I}/client/questions/${L.currentUser.id}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({category_id:t,question_text:n})})).ok&&(Q(),await q(),V())}catch{alert(`Failed to add question`)}}async function Te(e){if(confirm(`Delete this question?`))try{await fetch(`${I}/client/questions/${e}`,{method:`DELETE`}),await q(),V()}catch{alert(`Failed to delete question`)}}async function Ee(){if(!L.customerSession)try{let e=await fetch(`${I}/customer/session/${B}`);e.ok?(L.customerSession=await e.json(),V()):(L.error=`Business not found or invalid QR link`,V())}catch{L.error=`Unable to connect`,V()}}function De(){if(!L.customerSession&&!L.error)return Ee(),`
      <div class="customer-clean-page" style="background: #edf4fc;">
        <div class="customer-clean-card" style="text-align:center; padding:50px 24px;">
          <div style="width:48px; height:48px; border:3px solid #e2e8f0; border-top-color:#4f46e5; border-radius:50%; margin:0 auto 20px; animation:spin 0.8s linear infinite;"></div>
          <div style="font-size:16px; font-weight:700; color:#0f172a;">Connecting to review station...</div>
          <p style="font-size:13px; color:#64748b; margin-top:6px;">Please wait a moment</p>
        </div>
      </div>
    `;if(L.error)return`
      <div class="customer-clean-page" style="background: #edf4fc;">
        <div class="customer-clean-card" style="text-align:center; padding:50px 24px;">
          <div style="font-size:36px; margin-bottom:16px;">⚠️</div>
          <h2 style="font-size:20px; font-weight:800; color:#ef4444; margin-bottom:8px;">Notice</h2>
          <p style="color:#64748b; font-size:14px; line-height:1.5;">${L.error}</p>
        </div>
      </div>
    `;let e=L.customerSession,t=``;if(L.customerStep===1)t=`
      <div style="text-align:center;">
        <!-- 1. Top Logo -->
        ${e.logoUrl?`<img src="${e.logoUrl}" alt="${e.businessName}" class="customer-logo-img">`:`<div class="customer-logo-img" style="background:${e.qrColor||`#4f46e5`}; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; margin:0 auto 14px;">${e.businessName.slice(0,2).toUpperCase()}</div>`}

        <!-- 2. Rectangular Image Banner -->
        ${e.bannerUrl?`<img src="${e.bannerUrl}" alt="${e.businessName} cover" class="customer-banner-img">`:`<img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80" alt="${e.businessName} banner" class="customer-banner-img">`}

        <!-- 3. Rest of Content -->
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin-bottom:8px; line-height:1.3;">${e.businessName}</h1>
        <p style="font-size:14px; color:#64748b; line-height:1.6; margin-bottom:24px;">
          Share your experience in 3 quick questions. Our AI will help prepare your review draft.
        </p>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px; font-size:13px; color:#475569; margin-bottom:28px; display:flex; align-items:center; justify-content:center; gap:8px;">
          ${R.bolt}
          <span>Takes less than 45 seconds &bull; 100% genuine</span>
        </div>
      </div>

      <button class="btn-pro btn-pro-primary btn-pro-lg" onclick="customerNextStep(2)" style="width:100%; font-size:16px; padding:14px 20px; background:${e.qrColor||`#4f46e5`};">
        ${R.sparkles}
        Start Feedback &rarr;
      </button>
    `;else if(L.customerStep===2)t=`
      <div>
        <div style="font-size:12px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">Step 1 of 2</div>
        <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:6px;">Your Information</h2>
        <p style="font-size:13px; color:#64748b; margin-bottom:24px; line-height:1.5;">Optional: tell us your name so ${e.businessName} knows who visited.</p>

        <form onsubmit="handleCustomerInfoSubmit(event)">
          <div style="margin-bottom:18px;">
            <label class="input-label" style="font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Your Name (Optional)</label>
            <div style="position:relative;">
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex;">
                ${R.user}
              </span>
              <input type="text" id="custNameInput" class="pro-input" placeholder="e.g. Alex" value="${L.customerInfo.name}" style="padding-left:42px; font-size:14px;">
            </div>
          </div>

          <div style="margin-bottom:24px;">
            <label class="input-label" style="font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Mobile Number (Optional)</label>
            <div style="position:relative;">
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex;">
                ${R.phone}
              </span>
              <input type="tel" id="custMobileInput" class="pro-input" placeholder="+1 (555) 000-0000" value="${L.customerInfo.mobile}" style="padding-left:42px; font-size:14px;">
            </div>
          </div>

          <button type="submit" class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%; font-size:15px; padding:13px 20px; background:${e.qrColor||`#4f46e5`};">
            Continue to Questions &rarr;
          </button>
        </form>
      </div>

      <div style="text-align:center; margin-top:16px;">
        <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="skipCustomerInfo()" style="color:#64748b; border:none; background:transparent; font-size:13px; cursor:pointer;">
          Skip & Continue Anonymously
        </button>
      </div>
    `;else if(L.customerStep===3){let n=e.questions;if(!n||n.length===0)t=`
        <div style="text-align:center; padding:40px 10px;">
          <p style="color:#64748b; font-size:14px;">No questions configured by the business yet.</p>
        </div>
      `;else{let e=n[L.currentQuestionIdx],r=n.length;t=`
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <span class="badge-pro badge-indigo" style="font-weight:700;">Question ${L.currentQuestionIdx+1} of ${r}</span>
            <span style="font-size:13px; font-weight:700; color:#475569;">${e.category_name}</span>
          </div>

          <div style="height:6px; background:#e2e8f0; border-radius:99px; margin-bottom:32px; overflow:hidden;">
            <div style="height:100%; background:#4f46e5; border-radius:99px; width:${(L.currentQuestionIdx+1)/r*100}%; transition:width 0.3s ease;"></div>
          </div>

          <div style="text-align:center; padding:10px 0;">
            <h2 style="font-size:22px; font-weight:800; color:#0f172a; line-height:1.4; margin-bottom:28px;">
              ${e.question_text}
            </h2>

            <div class="star-interactive-row">
              ${[1,2,3,4,5].map(t=>`
                <button type="button" class="star-btn-lg" title="${t} Star" onclick="rateStar(${e.id}, '${e.category_name.replace(/'/g,`\\'`)}', '${e.question_text.replace(/'/g,`\\'`)}', ${t})">
                  ★
                </button>
              `).join(``)}
            </div>

            <div style="font-size:14px; font-weight:700; color:#d97706; margin-top:16px;">
              Tap a star (1 to 5) to rate
            </div>
          </div>
        </div>

        <div style="text-align:center; font-size:12px; color:#94a3b8; margin-top:24px;">
          Automatically moves to next question
        </div>
      `}}else L.customerStep===4?t=L.loading?`
        <div style="text-align:center; padding:50px 10px;">
          <div style="width:68px; height:68px; border-radius:50%; background:linear-gradient(135deg, #4f46e5, #06b6d4); display:flex; align-items:center; justify-content:center; color:#fff; font-size:30px; margin:0 auto 20px; box-shadow:0 10px 25px rgba(79, 70, 229, 0.3);">
            ${R.sparkles}
          </div>
          <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:8px;">Crafting your review...</h2>
          <p style="font-size:14px; color:#64748b; line-height:1.5;">Our AI is synthesizing your answers into an authentic review draft.</p>
        </div>
      `:`
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h2 style="font-size:20px; font-weight:800; color:#0f172a;">Your Review Draft</h2>
            <span class="badge-pro badge-indigo">${R.sparkles} AI Generated</span>
          </div>

          <p style="font-size:13px; color:#64748b; margin-bottom:16px; line-height:1.4;">
            Feel free to edit your text below before continuing to Google.
          </p>

          <textarea id="editableDraft" class="review-arial-box" rows="7" placeholder="Your review text..." oninput="state.generatedReview = this.value; this.style.height='auto'; this.style.height=(this.scrollHeight+10)+'px'">${L.generatedReview}</textarea>

          <div style="background:#ecfdf5; border:1px solid #bbf7d0; border-radius:10px; padding:12px 14px; font-size:12px; color:#047857; line-height:1.5; margin-bottom:24px; display:flex; align-items:flex-start; gap:8px;">
            <span style="display:flex; margin-top:1px;">${R.check}</span>
            <span>Clicking below copies this review and opens ${e.businessName}'s Google review page. Simply paste and post!</span>
          </div>

          <button class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%; font-size:16px; padding:14px 20px; display:flex; align-items:center; justify-content:center; gap:10px; background:#0f172a;" onclick="copyAndRedirectToGoogle()">
            ${R.google}
            Copy & Continue to Google &rarr;
          </button>
        </div>
      `:L.customerStep===5&&(t=`
      <div style="text-align:center; padding:40px 10px;">
        <div style="width:72px; height:72px; border-radius:50%; background:#ecfdf5; color:#10b981; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 20px; border:2px solid #bbf7d0;">
          ${R.check}
        </div>
        <h2 style="font-size:24px; font-weight:800; color:#0f172a; margin-bottom:8px;">Thank You!</h2>
        <p style="font-size:14px; color:#64748b; line-height:1.6; margin-bottom:28px;">
          Your review draft was copied to your clipboard. Simply paste and submit it on the Google review window.
        </p>

        <button class="btn-pro btn-pro-secondary btn-pro-lg" onclick="customerNextStep(1)" style="width:100%;">
          Start New Review
        </button>
      </div>
    `);let n=L.customerStep>1?`
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:18px;">⭐</span>
        <span style="font-weight:700; font-size:15px; color:#0f172a;">${e.businessName}</span>
      </div>
      <span style="font-size:12px; font-weight:600; color:#475569; background:#f8fafc; border:1px solid #e2e8f0; padding:4px 10px; border-radius:99px;">Verified Review</span>
    </div>
  `:``;return`
    <div class="customer-clean-page" style="background: ${e.bgColor||`#edf4fc`};">
      <div class="customer-clean-card">
        ${n}
        ${t}
      </div>
    </div>
  `}function Oe(e){L.customerStep=e,V()}function ke(){L.customerInfo.name=`Guest`,L.customerInfo.mobile=``,L.customerStep=3,L.currentQuestionIdx=0,L.customerAnswers=[],V()}function Z(e){e.preventDefault(),L.customerInfo.name=document.getElementById(`custNameInput`).value.trim(),L.customerInfo.mobile=document.getElementById(`custMobileInput`).value.trim(),L.customerInfo.mobile&&L.customerSession&&fetch(`${I}/customer/record-info`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({clientId:L.customerSession.clientId,name:L.customerInfo.name,mobile:L.customerInfo.mobile})}).catch(e=>console.warn(`Could not record customer info immediately`,e)),L.customerStep=3,L.currentQuestionIdx=0,L.customerAnswers=[],V()}function Ae(e,t,n,r){L.customerAnswers.push({category_id:e,category_name:t,question_text:n,rating:r});let i=L.customerSession.questions.length;L.currentQuestionIdx<i-1?(L.currentQuestionIdx+=1,V()):je()}async function je(){L.customerStep=4,L.loading=!0,V();try{let e=await(await fetch(`${I}/customer/generate-review`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({clientId:L.customerSession.clientId,customerName:L.customerInfo.name||`Anonymous`,customerMobile:L.customerInfo.mobile||``,answers:L.customerAnswers})})).json();L.generatedReview=e.reviewDraft,L.feedbackId=e.feedbackId,L.googleReviewUrl=e.googleReviewUrl}catch{L.generatedReview=`I had a great experience at ${L.customerSession.businessName}. The service was excellent!`}finally{L.loading=!1,V()}}async function Me(){let e=L.generatedReview||document.getElementById(`editableDraft`)?.value;try{await navigator.clipboard.writeText(e)}catch{console.warn(`Clipboard write error`)}L.feedbackId&&fetch(`${I}/customer/redirect`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({feedbackId:L.feedbackId})});let t=L.googleReviewUrl||L.customerSession.googleReviewUrl;t?window.open(t,`_blank`,`noopener,noreferrer`):alert(`Review text copied! Note: Google Review URL is not configured yet by the business.`),L.customerStep=5,V()}function Ne(e,t=null){L.modal={type:e,data:t},V()}function Q(){L.modal=null,V()}function $(){if(!L.modal)return``;let{type:e,data:t}=L.modal;return e===`create-client`?`
      <div class="pro-modal-backdrop" onclick="closeModal()">
        <div class="pro-modal-box" onclick="event.stopPropagation()">
          <div class="pro-modal-header">
            <h3 class="pro-modal-title">Create New Client</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form onsubmit="handleCreateClient(event)">
            <div class="pro-modal-body">
              <div style="margin-bottom:16px;">
                <label class="input-label">Business Name</label>
                <input type="text" id="clientName" class="pro-input" required placeholder="e.g. Apex Dental Care">
              </div>
              <div style="margin-bottom:16px;">
                <label class="input-label">Username</label>
                <input type="text" id="clientUsername" class="pro-input" required placeholder="e.g. apexdental">
              </div>
              <div style="margin-bottom:16px;">
                <label class="input-label">Initial Password</label>
                <input type="text" id="clientPassword" class="pro-input" required value="Pass@123">
              </div>
              <div style="margin-bottom:16px;">
                <label class="input-label">Phone Number</label>
                <input type="tel" id="clientPhone" class="pro-input" placeholder="+1 (555) 123-4567">
              </div>
            </div>
            <div class="pro-modal-footer">
              <button type="button" class="btn-pro btn-pro-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-pro btn-pro-primary">Create Client Account</button>
            </div>
          </form>
        </div>
      </div>
    `:e===`reset-password`?`
      <div class="pro-modal-backdrop" onclick="closeModal()">
        <div class="pro-modal-box" onclick="event.stopPropagation()">
          <div class="pro-modal-header">
            <h3 class="pro-modal-title">Reset Client Password</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form onsubmit="handleResetPassword(event, ${t.id})">
            <div class="pro-modal-body">
              <p style="font-size:13px; color:#64748b; margin-bottom:16px;">
                Enter a new password for <strong>${t.name}</strong>:
              </p>
              <div>
                <label class="input-label">New Password</label>
                <input type="text" id="newPasswordInput" class="pro-input" required value="Pass@${Math.floor(100+Math.random()*900)}">
              </div>
            </div>
            <div class="pro-modal-footer">
              <button type="button" class="btn-pro btn-pro-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-pro btn-pro-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    `:e===`add-category`?`
      <div class="pro-modal-backdrop" onclick="closeModal()">
        <div class="pro-modal-box" onclick="event.stopPropagation()">
          <div class="pro-modal-header">
            <h3 class="pro-modal-title">Add Feedback Category</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form onsubmit="handleAddCategory(event)">
            <div class="pro-modal-body">
              <div>
                <label class="input-label">Category Name</label>
                <input type="text" id="catNameInput" class="pro-input" required placeholder="e.g. Ambience & Cleanliness">
              </div>
            </div>
            <div class="pro-modal-footer">
              <button type="button" class="btn-pro btn-pro-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-pro btn-pro-primary">Add Category</button>
            </div>
          </form>
        </div>
      </div>
    `:e===`add-question`?`
      <div class="pro-modal-backdrop" onclick="closeModal()">
        <div class="pro-modal-box" onclick="event.stopPropagation()">
          <div class="pro-modal-header">
            <h3 class="pro-modal-title">Add Question to Bank</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form onsubmit="handleAddQuestion(event)">
            <div class="pro-modal-body">
              <div style="margin-bottom:16px;">
                <label class="input-label">Category</label>
                <select id="qCatSelect" class="pro-select" required>
                  ${L.clientCategories.map(e=>`
                    <option value="${e.id}">${e.name}</option>
                  `).join(``)}
                </select>
              </div>
              <div>
                <label class="input-label">Question Text</label>
                <input type="text" id="qTextInput" class="pro-input" required placeholder="e.g. How clean and comfortable was the space?">
              </div>
            </div>
            <div class="pro-modal-footer">
              <button type="button" class="btn-pro btn-pro-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-pro btn-pro-primary">Save Question</button>
            </div>
          </form>
        </div>
      </div>
    `:``}window.handleLogin=re,window.handleLogout=ie,window.quickFill=ne,window.openModal=Ne,window.closeModal=Q,window.handleCreateClient=W,window.handleResetPassword=G,window.deleteClient=K,window.switchTab=Y,window.selectColor=oe,window.handleSaveProfile=se,window.downloadQrCode=ce,window.updateCustomization=ge,window.handleColorPickerInput=X,window.handleColorPickerChange=ue,window.selectBgColorPreset=de,window.selectQrColorPreset=fe,window.handleImageUpload=pe,window.removeLogoImage=me,window.setBannerPreset=he,window.handleSaveCustomization=_e,window.handleAddCategory=Se,window.deleteCategory=Ce,window.handleAddQuestion=we,window.deleteQuestion=Te,window.customerNextStep=Oe,window.skipCustomerInfo=ke,window.handleCustomerInfoSubmit=Z,window.rateStar=Ae,window.copyAndRedirectToGoogle=Me,window.deleteCustomer=xe,L.currentUser?L.currentUser.role===`admin`?H().then(V):q().then(V):V();