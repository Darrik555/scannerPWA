import{i as p,g as b,H as D,a as H,b as m,s as c,c as R,h as I,d as u,f as L,j as O,k as V,l as Y,m as j,n as k,o as C,p as M,t as P,v as $,w,x as W,y as q}from"./oLtghWby.js";import{a as z,r as N,h}from"./DOq4m96K.js";import{a as B}from"./CowqXRAS.js";const F=["touchstart","touchmove"];function G(t){return F.includes(t)}function X(t,e){var r=e==null?"":typeof e=="object"?e+"":e;r!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=r,t.nodeValue=r+"")}function J(t,e){return A(t,e)}function Z(t,e){p(),e.intro=e.intro??!1;const r=e.target,_=w,l=u;try{for(var a=b(r);a&&(a.nodeType!==8||a.data!==D);)a=H(a);if(!a)throw m;c(!0),R(a),I();const d=A(t,{...e,anchor:a});if(u===null||u.nodeType!==8||u.data!==L)throw O(),m;return c(!1),d}catch(d){if(d===m)return e.recover===!1&&V(),p(),Y(r),c(!1),J(t,e);throw d}finally{c(_),R(l)}}const i=new Map;function A(t,{target:e,anchor:r,props:_={},events:l,context:a,intro:d=!0}){p();var v=new Set,y=o=>{for(var s=0;s<o.length;s++){var n=o[s];if(!v.has(n)){v.add(n);var f=G(n);e.addEventListener(n,h,{passive:f});var T=i.get(n);T===void 0?(document.addEventListener(n,h,{passive:f}),i.set(n,1)):i.set(n,T+1)}}};y(j(z)),N.add(y);var g=void 0,S=k(()=>{var o=r??e.appendChild(C());return M(()=>{if(a){P({});var s=$;s.c=a}l&&(_.$$events=l),w&&B(o,null),g=t(o,_)||{},w&&(W.nodes_end=u),a&&q()}),()=>{var f;for(var s of v){e.removeEventListener(s,h);var n=i.get(s);--n===0?(document.removeEventListener(s,h),i.delete(s)):i.set(s,n)}N.delete(y),o!==r&&((f=o.parentNode)==null||f.removeChild(o))}});return E.set(g,S),g}let E=new WeakMap;function x(t,e){const r=E.get(t);return r?(E.delete(t),r(e)):Promise.resolve()}export{Z as h,J as m,X as s,x as u};
