"use strict";(self.webpackChunkhuddyntom=self.webpackChunkhuddyntom||[]).push([[503],{503:(e,t,n)=>{n.d(t,{PolygonDrawer:()=>a});var s=n(1355);class a extends s.y{getCenter(e,t){return{x:-t/(e.sides/3.5),y:-t/.76}}getSidesData(e,t){const n=e.sides;return{count:{denominator:1,numerator:n},length:2.66*t/(n/3)}}}},1355:(e,t,n)=>{n.d(t,{y:()=>a});var s=n(4709);class a{async draw(e){const{particle:t,radius:s}=e,a=this.getCenter(t,s),d=this.getSidesData(t,s),{drawPolygon:r}=await n.e(3570).then(n.bind(n,3570));r(e,a,d)}getSidesCount(e){var t;const n=e.shapeData;return Math.round((0,s.Gu)(null!==(t=null===n||void 0===n?void 0:n.sides)&&void 0!==t?t:5))}}}}]);
//# sourceMappingURL=503.90ce3aa0.chunk.js.map