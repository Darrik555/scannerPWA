import{o as i,g as f,Z as p,x as _,_ as h,$ as E,w as s,d as o,h as T,c as g}from"./oLtghWby.js";function w(n){var t=document.createElement("template");return t.innerHTML=n,t.content}function r(n,t){var e=_;e.nodes_start===null&&(e.nodes_start=n,e.nodes_end=t)}function M(n,t){var e=(t&h)!==0,c=(t&E)!==0,a,m=!n.startsWith("<!>");return()=>{if(s)return r(o,null),o;a===void 0&&(a=w(m?n:"<!>"+n),e||(a=f(a)));var d=c||p?document.importNode(a,!0):a.cloneNode(!0);if(e){var l=f(d),v=d.lastChild;r(l,v)}else r(d,d);return d}}function N(n=""){if(!s){var t=i(n+"");return r(t,t),t}var e=o;return e.nodeType!==3&&(e.before(e=i()),g(e)),r(e,e),e}function L(){if(s)return r(o,null),o;var n=document.createDocumentFragment(),t=document.createComment(""),e=i();return n.append(t,e),r(t,e),n}function P(n,t){if(s){_.nodes_end=o,T();return}n!==null&&n.before(t)}const x="5";var u;typeof window<"u"&&((u=window.__svelte??(window.__svelte={})).v??(u.v=new Set)).add(x);export{r as a,P as b,L as c,N as d,M as t};
