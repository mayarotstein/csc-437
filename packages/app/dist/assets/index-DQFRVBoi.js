(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var Y,Ce;class ct extends Error{}ct.prototype.name="InvalidTokenError";function Xs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ti(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Xs(t)}catch{return atob(t)}}function as(r,t){if(typeof r!="string")throw new ct("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new ct(`Invalid token specified: missing part #${e+1}`);let i;try{i=ti(s)}catch(n){throw new ct(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new ct(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ei="mu:context",te=`${ei}:change`;class si{constructor(t,e){this._proxy=ii(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class le extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new si(t,this),this.style.display="contents"}attach(t){return this.addEventListener(te,t),t}detach(t){this.removeEventListener(te,t)}}function ii(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(te,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function ri(r,t){const e=ls(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function ls(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return ls(r,i.host)}class ni extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function cs(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ni(e,r))}class ce{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function oi(r){return t=>({...t,...r})}const ee="mu:auth:jwt",hs=class us extends ce{constructor(t,e){super((s,i)=>this.update(s,i),t,us.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(li(s)),Kt(i);case"auth/signout":return e(ci()),Kt(this._redirectForLogin);case"auth/redirect":return Kt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};hs.EVENT_TYPE="auth:message";let ds=hs;const ps=cs(ds.EVENT_TYPE);function Kt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class ai extends le{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=X.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ds(this.context,this.redirect).attach(this)}}class Q{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ee),t}}class X extends Q{constructor(t){super();const e=as(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new X(t);return localStorage.setItem(ee,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ee);return t?X.authenticate(t):new Q}}function li(r){return oi({user:X.authenticate(r),token:r})}function ci(){return r=>{const t=r.user;return{user:t&&t.authenticated?Q.deauthenticate(t):t,token:""}}}function hi(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function ui(r){return r.authenticated?as(r.token||""):{}}const S=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:X,Provider:ai,User:Q,dispatch:ps,headers:hi,payload:ui},Symbol.toStringTag,{value:"Module"}));function Ot(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function se(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const fs=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:se,relay:Ot},Symbol.toStringTag,{value:"Module"}));function gs(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const di=new DOMParser;function H(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=di.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Te(a);case"bigint":case"boolean":case"number":case"symbol":return Te(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Te(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ht(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let pi=(Y=class extends HTMLElement{constructor(){super(),this._state={},Ht(this).template(Y.template).styles(Y.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Ot(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},fi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},Y.template=H`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,Y.styles=gs`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,Y);function fi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const gi=Object.freeze(Object.defineProperty({__proto__:null,Element:pi},Symbol.toStringTag,{value:"Module"})),ms=class vs extends ce{constructor(t){super((e,s)=>this.update(e,s),t,vs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(vi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(yi(s,i));break}}}};ms.EVENT_TYPE="history:message";let he=ms;class Re extends le{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=mi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ue(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new he(this.context).attach(this)}}function mi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function vi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function yi(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const ue=cs(he.EVENT_TYPE),_i=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Re,Provider:Re,Service:he,dispatch:ue},Symbol.toStringTag,{value:"Module"}));class x{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ue(this._provider,t);this._effects.push(i),e(i)}else ri(this._target,this._contextLabel).then(i=>{const n=new Ue(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ue{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ys=class _s extends HTMLElement{constructor(){super(),this._state={},this._user=new Q,this._authObserver=new x(this,"blazing:auth"),Ht(this).template(_s.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;bi(i,this._state,e,this.authorization).then(n=>nt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},nt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ze(this.src,this.authorization).then(e=>{this._state=e,nt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ze(this.src,this.authorization).then(i=>{this._state=i,nt(i,this)});break;case"new":s&&(this._state={},nt({},this));break}}};ys.observedAttributes=["src","new","action"];ys.template=H`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function ze(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function nt(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function bi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const bs=class $s extends ce{constructor(t,e){super(e,t,$s.EVENT_TYPE,!1)}};bs.EVENT_TYPE="mu:message";let ws=bs;class $i extends le{constructor(t,e,s){super(e),this._user=new Q,this._updateFn=t,this._authObserver=new x(this,s)}connectedCallback(){const t=new ws(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const wi=Object.freeze(Object.defineProperty({__proto__:null,Provider:$i,Service:ws},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,de=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),Le=new WeakMap;let Es=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(de&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Le.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Le.set(e,t))}return t}toString(){return this.cssText}};const Ei=r=>new Es(typeof r=="string"?r:r+"",void 0,pe),Ai=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Es(e,r,pe)},Si=(r,t)=>{if(de)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ne=de?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ei(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:xi,defineProperty:ki,getOwnPropertyDescriptor:Pi,getOwnPropertyNames:Oi,getOwnPropertySymbols:Ci,getPrototypeOf:Ti}=Object,tt=globalThis,Me=tt.trustedTypes,Ri=Me?Me.emptyScript:"",je=tt.reactiveElementPolyfillSupport,ht=(r,t)=>r,Ct={toAttribute(r,t){switch(t){case Boolean:r=r?Ri:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},fe=(r,t)=>!xi(r,t),He={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:fe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),tt.litPropertyMetadata??(tt.litPropertyMetadata=new WeakMap);let G=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=He){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ki(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Pi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??He}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=Ti(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[...Oi(e),...Ci(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ne(i))}else t!==void 0&&e.push(Ne(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Si(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ct).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ct;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??fe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[ht("elementProperties")]=new Map,G[ht("finalized")]=new Map,je==null||je({ReactiveElement:G}),(tt.reactiveElementVersions??(tt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Rt=Tt.trustedTypes,Ie=Rt?Rt.createPolicy("lit-html",{createHTML:r=>r}):void 0,As="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Ss="?"+P,Ui=`<${Ss}>`,I=document,pt=()=>I.createComment(""),ft=r=>r===null||typeof r!="object"&&typeof r!="function",ge=Array.isArray,zi=r=>ge(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,De=/-->/g,Fe=/>/g,L=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Be=/'/g,qe=/"/g,xs=/^(?:script|style|textarea|title)$/i,Li=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),at=Li(1),et=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ve=new WeakMap,M=I.createTreeWalker(I,129);function ks(r,t){if(!ge(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ie!==void 0?Ie.createHTML(t):t}const Ni=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ot?f[1]==="!--"?o=De:f[1]!==void 0?o=Fe:f[2]!==void 0?(xs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=i??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?qe:Be):o===qe||o===Be?o=L:o===De||o===Fe?o=ot:(o=L,i=void 0);const h=o===L&&r[l+1].startsWith("/>")?" ":"";n+=o===ot?a+Ui:u>=0?(s.push(d),a.slice(0,u)+As+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[ks(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ie=class Ps{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ni(t,e);if(this.el=Ps.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=M.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(As)){const c=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?ji:p[1]==="?"?Hi:p[1]==="@"?Ii:It}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(xs.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=Rt?Rt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],pt()),M.nextNode(),a.push({type:2,index:++n});i.append(u[c],pt())}}}else if(i.nodeType===8)if(i.data===Ss)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}};function st(r,t,e=r,s){var i,n;if(t===et)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=ft(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=st(r,o._$AS(r,t.values),o,s)),t}class Mi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??I).importNode(e,!0);M.currentNode=i;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new bt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Di(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=I,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class bt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),ft(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ie.createElement(ks(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Mi(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ve.get(t.strings);return e===void 0&&Ve.set(t.strings,e=new ie(t)),e}k(t){ge(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new bt(this.O(pt()),this.O(pt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class It{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=st(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=st(this,l[s+a],e,a),d===et&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ji extends It{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Hi extends It{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Ii extends It{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??_)===et)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Di{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const We=Tt.litHtmlPolyfillSupport;We==null||We(ie,bt),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Fi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new bt(t.insertBefore(pt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Z=class extends G{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Fi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return et}};Z._$litElement$=!0,Z.finalized=!0,(Ce=globalThis.litElementHydrateSupport)==null||Ce.call(globalThis,{LitElement:Z});const Ye=globalThis.litElementPolyfillSupport;Ye==null||Ye({LitElement:Z});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bi={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:fe},qi=(r=Bi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Os(r){return(t,e)=>typeof e=="object"?qi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Cs(r){return Os({...r,state:!0,attribute:!1})}function Vi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Wi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ts={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,v,Bt){var w=v.length-1;switch(g){case 1:return new m.Root({},[v[w-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[w-1],v[w]]);break;case 4:case 5:this.$=v[w];break;case 6:this.$=new m.Literal({value:v[w]});break;case 7:this.$=new m.Splat({name:v[w]});break;case 8:this.$=new m.Param({name:v[w]});break;case 9:this.$=new m.Optional({},[v[w-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],v=this.table,Bt="",w=0,ke=0,Gs=2,Pe=1,Js=g.slice.call(arguments,1),y=Object.create(this.lexer),U={yy:{}};for(var qt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,qt)&&(U.yy[qt]=this.yy[qt]);y.setInput(c,U.yy),U.yy.lexer=y,U.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Vt=y.yylloc;g.push(Vt);var Zs=y.options&&y.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Qs=function(){var W;return W=y.lex()||Pe,typeof W!="number"&&(W=h.symbols_[W]||W),W},$,z,E,Wt,V={},St,k,Oe,xt;;){if(z=p[p.length-1],this.defaultActions[z]?E=this.defaultActions[z]:(($===null||typeof $>"u")&&($=Qs()),E=v[z]&&v[z][$]),typeof E>"u"||!E.length||!E[0]){var Yt="";xt=[];for(St in v[z])this.terminals_[St]&&St>Gs&&xt.push("'"+this.terminals_[St]+"'");y.showPosition?Yt="Parse error on line "+(w+1)+`:
`+y.showPosition()+`
Expecting `+xt.join(", ")+", got '"+(this.terminals_[$]||$)+"'":Yt="Parse error on line "+(w+1)+": Unexpected "+($==Pe?"end of input":"'"+(this.terminals_[$]||$)+"'"),this.parseError(Yt,{text:y.match,token:this.terminals_[$]||$,line:y.yylineno,loc:Vt,expected:xt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+z+", token: "+$);switch(E[0]){case 1:p.push($),m.push(y.yytext),g.push(y.yylloc),p.push(E[1]),$=null,ke=y.yyleng,Bt=y.yytext,w=y.yylineno,Vt=y.yylloc;break;case 2:if(k=this.productions_[E[1]][1],V.$=m[m.length-k],V._$={first_line:g[g.length-(k||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(k||1)].first_column,last_column:g[g.length-1].last_column},Zs&&(V._$.range=[g[g.length-(k||1)].range[0],g[g.length-1].range[1]]),Wt=this.performAction.apply(V,[Bt,ke,w,U.yy,E[1],m,g].concat(Js)),typeof Wt<"u")return Wt;k&&(p=p.slice(0,-1*k*2),m=m.slice(0,-1*k),g=g.slice(0,-1*k)),p.push(this.productions_[E[1]][0]),m.push(V.$),g.push(V._$),Oe=v[p[p.length-2]][p[p.length-1]],p.push(Oe);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(p=this._input.match(this.rules[g[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=v,this.options.backtrack_lexer){if(c=this.test_match(p,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Wi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ts);function K(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Rs={Root:K("Root"),Concat:K("Concat"),Literal:K("Literal"),Splat:K("Splat"),Param:K("Param"),Optional:K("Optional")},Us=Ts.parser;Us.yy=Rs;var Yi=Us,Ki=Object.keys(Rs);function Gi(r){return Ki.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var zs=Gi,Ji=zs,Zi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ls(r){this.captures=r.captures,this.re=r.re}Ls.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Qi=Ji({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Zi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ls({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Xi=Qi,tr=zs,er=tr({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),sr=er,ir=Yi,rr=Xi,nr=sr;$t.prototype=Object.create(null);$t.prototype.match=function(r){var t=rr.visit(this.ast),e=t.match(r);return e||!1};$t.prototype.reverse=function(r){return nr.visit(this.ast,r)};function $t(r){var t;if(this?t=this:t=Object.create($t.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=ir.parse(r),t}var or=$t,ar=or,lr=ar;const cr=Vi(lr);var hr=Object.defineProperty,Ns=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&hr(t,e,i),i};const Ms=class extends Z{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>at` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new cr(i.path)})),this._historyObserver=new x(this,e),this._authObserver=new x(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),at` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ps(this,"auth/redirect"),at` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):at` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),at` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){ue(this,"history/redirect",{href:t})}};Ms.styles=Ai`
    :host,
    main {
      display: contents;
    }
  `;let Ut=Ms;Ns([Cs()],Ut.prototype,"_user");Ns([Cs()],Ut.prototype,"_match");const ur=Object.freeze(Object.defineProperty({__proto__:null,Element:Ut,Switch:Ut},Symbol.toStringTag,{value:"Module"})),js=class Hs extends HTMLElement{constructor(){if(super(),Ht(this).template(Hs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};js.template=H`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;let dr=js;const pr=Object.freeze(Object.defineProperty({__proto__:null,Element:dr},Symbol.toStringTag,{value:"Module"})),Is=class re extends HTMLElement{constructor(){super(),this._array=[],Ht(this).template(re.template).styles(re.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ds("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{se(t,"button.add")?Ot(t,"input-array:add"):se(t,"button.remove")&&Ot(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],fr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Is.template=H`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Is.styles=gs`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function fr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ds(e)))}function Ds(r,t){const e=r===void 0?H`<input />`:H`<input value="${r}" />`;return H`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function B(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var gr=Object.defineProperty,mr=Object.getOwnPropertyDescriptor,vr=(r,t,e,s)=>{for(var i=mr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&gr(t,e,i),i};class Dt extends Z{constructor(t){super(),this._pending=[],this._observer=new x(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}vr([Os()],Dt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,me=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ve=Symbol(),Ke=new WeakMap;let Fs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(me&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ke.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ke.set(e,t))}return t}toString(){return this.cssText}};const yr=r=>new Fs(typeof r=="string"?r:r+"",void 0,ve),q=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Fs(e,r,ve)},_r=(r,t)=>{if(me)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Pt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ge=me?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return yr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:br,defineProperty:$r,getOwnPropertyDescriptor:wr,getOwnPropertyNames:Er,getOwnPropertySymbols:Ar,getPrototypeOf:Sr}=Object,C=globalThis,Je=C.trustedTypes,xr=Je?Je.emptyScript:"",Jt=C.reactiveElementPolyfillSupport,ut=(r,t)=>r,zt={toAttribute(r,t){switch(t){case Boolean:r=r?xr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ye=(r,t)=>!br(r,t),Ze={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:ye};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class J extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ze){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&$r(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=wr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ze}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Sr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...Er(e),...Ar(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ge(i))}else t!==void 0&&e.push(Ge(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _r(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:zt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:zt;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ye)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[ut("elementProperties")]=new Map,J[ut("finalized")]=new Map,Jt==null||Jt({ReactiveElement:J}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=globalThis,Lt=dt.trustedTypes,Qe=Lt?Lt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Bs="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,qs="?"+O,kr=`<${qs}>`,D=document,gt=()=>D.createComment(""),mt=r=>r===null||typeof r!="object"&&typeof r!="function",_e=Array.isArray,Pr=r=>_e(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Zt=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Xe=/-->/g,ts=/>/g,N=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),es=/'/g,ss=/"/g,Vs=/^(?:script|style|textarea|title)$/i,Or=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),A=Or(1),it=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),is=new WeakMap,j=D.createTreeWalker(D,129);function Ws(r,t){if(!_e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qe!==void 0?Qe.createHTML(t):t}const Cr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=lt;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===lt?f[1]==="!--"?o=Xe:f[1]!==void 0?o=ts:f[2]!==void 0?(Vs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??lt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?ss:es):o===ss||o===es?o=N:o===Xe||o===ts?o=lt:(o=N,i=void 0);const h=o===N&&r[l+1].startsWith("/>")?" ":"";n+=o===lt?a+kr:u>=0?(s.push(d),a.slice(0,u)+Bs+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[Ws(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class vt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Cr(t,e);if(this.el=vt.createElement(d,s),j.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=j.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Bs)){const c=f[o++],h=i.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Rr:p[1]==="?"?Ur:p[1]==="@"?zr:Ft}),i.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Vs.test(i.tagName)){const u=i.textContent.split(O),c=u.length-1;if(c>0){i.textContent=Lt?Lt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],gt()),j.nextNode(),a.push({type:2,index:++n});i.append(u[c],gt())}}}else if(i.nodeType===8)if(i.data===qs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const s=D.createElement("template");return s.innerHTML=t,s}}function rt(r,t,e=r,s){var o,l;if(t===it)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=mt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=rt(r,i._$AS(r,t.values),i,s)),t}class Tr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??D).importNode(e,!0);j.currentNode=i;let n=j.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Lr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=j.nextNode(),o++)}return j.currentNode=D,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),mt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=vt.createElement(Ws(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Tr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=is.get(t.strings);return e===void 0&&is.set(t.strings,e=new vt(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new wt(this.O(gt()),this.O(gt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=rt(this,t,e,0),o=!mt(t)||t!==this._$AH&&t!==it,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=rt(this,l[s+a],e,a),d===it&&(d=this._$AH[a]),o||(o=!mt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Rr extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ur extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class zr extends Ft{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??b)===it)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Lr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const Qt=dt.litHtmlPolyfillSupport;Qt==null||Qt(vt,wt),(dt.litHtmlVersions??(dt.litHtmlVersions=[])).push("3.2.1");const Nr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(gt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let T=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return it}};var os;T._$litElement$=!0,T.finalized=!0,(os=globalThis.litElementHydrateSupport)==null||os.call(globalThis,{LitElement:T});const Xt=globalThis.litElementPolyfillSupport;Xt==null||Xt({LitElement:T});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mr={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:ye},jr=(r=Mr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function be(r){return(t,e)=>typeof e=="object"?jr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Et(r){return be({...r,state:!0,attribute:!1})}const Hr=q`

* {
    margin: 0;
    box-sizing: border-box;
  }
  body {
    line-height: 1.5;
  }
  img {
    max-width: 100%;
  }
  .view {
    margin: 0;
    padding: 0;
  }
  `,At={styles:Hr};var Ir=Object.defineProperty,Ys=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Ir(t,e,i),i};function Dr(r){const t=r.target;if(t){const e=t.checked,s=new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{checked:e}});t.dispatchEvent(s)}}function Fr(r){fs.relay(r,"auth:message",["auth/signout"])}var R;const $e=(R=class extends T{constructor(){super(...arguments),this.userid="guest",this.navigationLinks=[],this._authObserver=new x(this,"slofoodguide:auth")}render(){return A`
      <header>
        <h1><a class="title" href="/">San Luis Obispo Food Guide</a></h1>
        <nav>
          ${this.navigationLinks.map(t=>A`<a href=${t.href}>${t.label}</a>`)}
        </nav>
        <drop-down>
          <a slot="actuator">
            Hello,
            <span id="userid">${this.userid}</span>
          </a>
            <menu>
              <li>
                <label>
                <input 
                  type="checkbox"
                  id="dark-mode-toggle"
                  autocomplete="off"
                  @change=${Dr}
                  />
                  <slot name="dark-mode">Dark Mode</slot>
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout" @click=${Fr}>Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>
        </drop-down>
      </header>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!==this.userid&&(this.userid=t.username)}),R.initializeOnce()}static initializeOnce(){document.body.dataset.darkModeListener!=="true"&&(document.body.addEventListener("darkmode:toggle",t=>{const e=t,{checked:s}=e.detail;document.body.classList.toggle("dark-mode",s)}),document.body.dataset.darkModeListener="true")}},R.uses=B({"drop-down":pr.Element}),R.styles=[At.styles,q`
    header{
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: var(--size-spacing-medium);
      background-color: var(--color-background-header);
      color: var(--color-text-header);
    }
    .title {
      text-decoration: none;
      color: currentColor;
    }

    h1 {
        flex-basis: 100%;
        font-family: var(--font-family-display);
        font-size: var(--size-type-xxxlarge);
        font-weight: var(--font-weight-light);

    }

    nav {
        display: flex;
        color: var(--color-text-header);
        margin: var(--size-spacing-small);
        ::slotted(a:not(:first-child))::before {
          content: ">";
          padding: 0.25em;
        }
    }

    nav a {
      color: var(--color-text-header); /* Matches h1 */
    }


    a[slot="actuator"] {
      color: var(--color-link-inverted);
      cursor: pointer;
    }

    #userid:empty::before {
      content: "Guest";
    }
    menu {
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
    }

    a:has(#userid:empty) ~ menu > .when-signed-in,
    a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
      display: none;
    }  
  `],R);Ys([Et()],$e.prototype,"userid");Ys([Et()],$e.prototype,"navigationLinks");let we=$e;B({"slo-food-header":we,"mu-auth":S.Provider});window.relayEvent=fs.relay;document.addEventListener("DOMContentLoaded",()=>{document.querySelector("slo-food-header")});const Br={};function qr(r,t,e){switch(r[0]){case"profile/select":Vr(r[1],e).then(i=>t(n=>({...n,profile:i})));break;case"profile/save":Wr(r[1],e).then(i=>t(n=>({...n,profile:i}))).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)}).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;default:const s=r[0];throw new Error(`Unhandled Auth message "${s}"`)}}function Vr(r,t){return fetch(`/api/guests/${r.userid}`,{headers:S.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}function Wr(r,t){return fetch(`/api/guests/${r.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...S.headers(t)},body:JSON.stringify(r.profile)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${r.userid}`)}).then(e=>{if(e)return e})}var rs=Object.freeze,Ks=Object.defineProperty,Yr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Ks(t,e,i),i},Kr=(r,t)=>rs(Ks(r,"raw",{value:rs(r.slice())})),ns;const Ae=class Ae extends Dt{constructor(){super(...arguments),this.src="/api/guests/",this.userid="guest",this._authObserver=new x(this,"slofoodguide:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!=this.userid&&(this.userid=t.username)})}render(){return A(ns||(ns=Kr([`
      <body>
        <section class="main-page">
          <img src="images/slo-guide.jpg" alt="Explore Restaurants in SLO">
          <p>Discover the best food and drink options in SLO, whether you're in the mood for meals, snacks, or beverages!</p>
          <p>SLO Food Guide from a <em>SLOCAL!</em></p>
          <h2><a href="/app/guest/`,`" class="button">Explore Restaurants</a></h2>
          <p>
            <svg class="icon">
              <use href="icons/food.svg#icon-utensils" />
            </svg>
            Find all the best places for meals, snacks, and drinks in San Luis Obispo.
          </p>
        </section>            
        <script>
          document.body.addEventListener("darkmode:toggle", (event) => {
            const { checked } = event.detail;
              document.body.classList.toggle("dark-mode", checked);
          });
        <\/script>
    </body>
    `])),this.userid)}};Ae.styles=[At.styles,q`
        
        img {
          width: 100vw;
          height: 400px;
          object-fit: cover;
          object-position: center;
          display: block;
          border-radius: var(--img-border-radius);
      
        }

        h2{
          font-family: var(--font-family-display);
          font-size: var(--size-type-large);
          font-weight: var(--font-weight-normal);
        }

        p {
          font-size: var(--size-type-medium);
        }

        svg.icon {
          display: inline;
          height: 2em;
          width: 2em;
          vertical-align: top;
          fill: currentColor;
        }

        .button {
          display: inline-block;
          padding: var(--size-spacing-medium);
          font-size: var(--size-type-medium);
          font-family: var(--font-family-display);
          background-color: var(--color-button-background);
          color: var(--color-button-text);
          border-radius: var(--card-border-radius);
          text-decoration: none;
          text-align: center;
          border: none;
          transition: background-color 0.3s ease;
        }
      
        .button:hover {
          background-color: var(--color-button-hover);
        }

        section.main-page {
          display: grid;
          grid-template-columns: var(--grid-columns-main);
          grid-gap: var(--grid-gap);
          padding: var(--grid-container-padding);
          max-width: var(--grid-max-width);
          margin: auto;
          text-align: center;
      }
    `];let yt=Ae;Yr([Et()],yt.prototype,"userid");var Gr=Object.defineProperty,Jr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Gr(t,e,i),i};const Nt=class Nt extends T{constructor(){super(...arguments),this._user=new S.User,this._authObserver=new x(this,"slofoodguide:auth")}render(){const{username:t,favoritemeal:e,nickname:s,partysize:i}=this.guest||{};return console.log(this.guest),A`
          <section class="view">
              <h2>Your Profile</h2>
              <p>Username: ${t}</p>
              <img src=${e}>
              <p>Nickname: ${s}</p>
              <p>Party Size: ${i}</p>
              <button id="edit" class="button">Edit</a>
          </section>
            <mu-form class="edit">
              <h3><label>
                <span>Username</span>
                <input name="username" />
              </label></h2>
              <h3><label>
                <span>Favorite Meal</span>
                <input type="file" name="favoritemeal" />
              </label></h2>
              <h3><label>
                <span>Nickname</span>
                <input name="nickname" />
              </label></h2>
              <h3><label>
                <span>Party Size</span>
                <input name="partysize" />
              </label></h2>
            </mu-form>
  `}get src(){return this.getAttribute("src")}set mode(t){t&&this.setAttribute("mode",t)}get editButton(){var t;return((t=this.shadowRoot)==null?void 0:t.getElementById("edit"))||null}get favoritemealInput(){var t;return((t=this.shadowRoot)==null?void 0:t.querySelector('input[type="file"]'))||null}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status!==200)throw new Error(`Status: ${e.status}`);if(!e.body)throw new Error("Empty response body");return e.json()}).then(e=>{this.guest=e}).catch(e=>{console.error(`Failed to render data from ${t}:`,e)})}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.src&&this.mode!=="new"&&this.hydrate(this.src)})}attributeChangedCallback(t,e,s){t==="src"&&e!==s&&this.mode!=="new"&&this.hydrate(s)}handleFavoritemealSelected(t){var n;const s=(n=t.target.files)==null?void 0:n[0];if(!s)return;const i=new FileReader;i.onload=()=>this._favoritemeal=i.result,i.onerror=o=>console.error("FileReader error:",o),i.readAsDataURL(s)}};Nt.uses=B({"mu-form":gi.Element}),Nt.styles=q`
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      //--display-editor-none: none;
    }

    h2{
        font-family: var(--font-family-display);
        font-size: var(--size-type-large);
        font-weight: var(--font-weight-normal);
        grid-column: 1 / -1;
        margin: 0;
    }

    h3{
      font-family: var(--font-family-display);
      font-size: var(--size-type-mlarge);
      font-weight: var(--font-weight-normal);
      grid-column: 1 / -1;
  }

    p {
        font-size: var(--size-type-medium);
    }

    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      object-position: center;
      display: block;
      border-radius: var(--img-border-radius);
    }

    button {
      display: inline-block;
      padding: var(--size-spacing-medium);
      font-size: var(--size-type-medium);
      font-family: var(--font-family-display);
      background-color: var(--color-button-background);
      color: var(--color-button-text);
      border-radius: var(--card-border-radius);
      text-decoration: none;
      text-align: center;
      border: none;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: var(--color-button-hover);
    }

    mu-form.edit {
      display: var(--display-editor-none, grid);
    }

    mu-form.edit h3,
    mu-form.edit label,
    mu-form.edit input {
    margin: 0; /* Remove all default margins */
    padding: 0; /* Ensure no extra padding */
  }

    mu-form.edit {
      gap: var(--size-spacing-medium); /* Add controlled spacing between form fields */
      display: grid; /* Use grid layout for alignment */
      grid-template-columns: 1fr; /* Single column for fields */
      margin: 0;
      padding: 0;
    }
  `;let _t=Nt;Jr([Et()],_t.prototype,"guest");var Zr=Object.defineProperty,Qr=Object.getOwnPropertyDescriptor,Ee=(r,t,e,s)=>{for(var i=s>1?void 0:s?Qr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Zr(t,e,i),i};const Mt=class Mt extends Dt{get profile(){return this.model.profile}render(){return A`
      <body>
        <main class="page">
            <section>
                <h1 slot="title">Best Restaurants in San Luis Obispo</h1>
                <div class="card">
                    <guest-profile src="/api/guests/${this.guestId}">
                    </guest-profile>
                </div>
                <div class="card">
                    <h2>Meals</h2>
                    <img
                        src="/images/meal.jpg"
                        alt="Explore Meals in SLO"
                    />
                    <p>Hungry for a full meal? Check out our selection of restaurants offering everything from low-cost bites to high-end gourmet dishes. There’s something to satisfy every appetite.</p>
                    <a class="button" href="/app/meal">Explore Meals in SLO</a>
                </div>
                <div class="card">
                    <h2>Small Bites</h2>
                    <img
                      src="/images/farmers.jpg"
                      alt="Explore Small Bites in SLO"
                      />
                    <p>If you're in the mood for something light, why not grab a quick snack or treat? Find the best spots for small bites, from frozen yogurt to tasty street snacks.</p>
                    <a  class="button" href="small-bite.html">Explore Small Bites in SLO</a>
                </div>
                <div class="card">
                    <h2>Beverages</h2>
                    <img 
                      src="/images/beverage.jpg"
                      alt="Explore Beverages in SLO"
                      />
                    <p>Need something to quench your thirst? Explore the top spots for coffee, craft cocktails, wine, and non-alcoholic options around town.</p>
                    <a href="beverage.html" class="button">Explore Beverages in SLO</a>
                </div>
            </section>
          </main>
        </body>
    `}constructor(){super("slofoodguide:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="userid"&&e!==s&&s&&this.dispatchMessage(["profile/select",{userid:s}])}};Mt.uses=B({"guest-profile":_t}),Mt.styles=[At.styles,q`
      section {
        display: grid;
        grid-gap: var(--grid-gap);
        grid-template-columns: var(--grid-columns);
        padding: var(--grid-container-padding);
        max-width: var(--grid-max-width);
        //align-items: stretch;
    }

      img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: var(--img-border-radius);
      }

      h1 {
          font-family: var(--font-family-display);
          font-size: var(--size-type-xlarge);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-h1);      
      }

        section h1 {
            grid-column: 1 / -1;
            font-size: var(--size-type-xlarge);        
        }

        h2{
          font-family: var(--font-family-display);
          font-size: var(--size-type-large);
          font-weight: var(--font-weight-normal);
        }

        p {
          font-size: var(--size-type-medium);
        }

        svg.icon {
          display: inline;
          height: 2em;
          width: 2em;
          vertical-align: top;
          fill: currentColor;
        }

        .button {
          display: inline-block;
          padding: var(--size-spacing-medium);
          font-size: var(--size-type-medium);
          font-family: var(--font-family-display);
          background-color: var(--color-button-background);
          color: var(--color-button-text);
          border-radius: var(--card-border-radius);
          text-decoration: none;
          text-align: center;
          border: none;
          transition: background-color 0.3s ease;
        }
      
        .button:hover {
          background-color: var(--color-button-hover);
        }

        .card {
          flex: 1 1 calc(50% - var(--grid-gap));
          display: flex;
          flex-direction: column;
          //justify-content: space-between;
          gap: var(--size-card-gap);
          padding: var(--size-card-padding);
          background-color: var(--card-background-color);
          border-radius: var(--card-border-radius);
          box-sizing: border-box;
        }

        .card h2,
        .card p {
          margin: 0;
        }

        @media (max-width: 768px) {
          section {
              grid-template-columns: 1fr;
          }
      
          img {
              width: 100%;
          }
      
          .card {
              margin-bottom: var(--size-spacing-large);
          }
      }`];let F=Mt;Ee([be()],F.prototype,"userid",2);Ee([be({attribute:"guest-id"})],F.prototype,"guestId",2);Ee([Et()],F.prototype,"profile",1);const jt=class jt extends T{constructor(){super(...arguments),this._user=new S.User,this.src="/api/guests/",this._authObserver=new x(this,"slofoodguide:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).catch(e=>console.log("Failed to load main data:",e))}render(){return A`
      <body>
        <main class="page">
            <section>
                <h1 slot="title">Best Restaurants in San Luis Obispo</h1>
                <div class="card">
                    <h2 slot="category">Meals</h2>
                    <img
                        slot="image"
                        src="/images/meal.jpg"
                        alt="Explore Meals in SLO"
                        width= 300
                        height= 200
                    />
                    <p>Hungry for a full meal? Check out our selection of restaurants offering everything from low-cost bites to high-end gourmet dishes. There’s something to satisfy every appetite.</p>
                    <a class="button" slot="link" href="meal.html">Visit Restaurants</a>
                </div>
            </section>
          </main>
        </body>
    `}};jt.uses=B({"guest-profile":_t}),jt.styles=[At.styles,q`
        
        img {
          width: 100vw;
          height: 400px;
          object-fit: cover;
          object-position: center;
          display: block;
          border-radius: var(--img-border-radius);
      
        }

        h1 {
            font-family: var(--font-family-display);
            font-size: var(--size-type-xlarge);
            font-weight: var(--font-weight-medium);
            color: var(--color-text-h1);
        
        }

        section h1 {
            grid-column: 1 / -1;
            font-size: var(--size-type-xlarge);        
        }

        h2{
          font-family: var(--font-family-display);
          font-size: var(--size-type-large);
          font-weight: var(--font-weight-normal);
        }

        p {
          font-size: var(--size-type-medium);
        }

        svg.icon {
          display: inline;
          height: 2em;
          width: 2em;
          vertical-align: top;
          fill: currentColor;
        }

        .button {
          display: inline-block;
          padding: var(--size-spacing-medium);
          font-size: var(--size-type-medium);
          font-family: var(--font-family-display);
          background-color: var(--color-button-background);
          color: var(--color-button-text);
          border-radius: var(--card-border-radius);
          text-decoration: none;
          text-align: center;
          border: none;
          transition: background-color 0.3s ease;
        }
      
        .button:hover {
          background-color: var(--color-button-hover);
        }

        section {
            display: grid;
            grid-gap: var(--grid-gap);
            grid-template-columns: var(--grid-columns);
            padding: var(--grid-container-padding);
            max-width: var(--grid-max-width);
            align-items: stretch;
        }

        .card {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            border: var(--card-border-color);
            border-radius: var(--card-border-radius);
            padding: var(--size-spacing-medium);
            background-color: var(--card-background-color);
            gap: var(--size-spacing-medium);
            flex-grow: 1;
        }`];let ne=jt;const Se=class Se extends Dt{constructor(){super(...arguments),this.src="/api/guests/",this._user=new S.User,this._authObserver=new x(this,"slofoodguide:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).catch(e=>console.log("Failed to load main data:",e)).catch(e=>console.log("Failed to convert main data:",e))}render(){return A`
      <body>
        <section>
          <div class="card">
              <h1>Low-Cost Meals in San Luis Obispo</h1>
              <h2>Salty Options</h2>
              <p>Enjoy delicious savory meals without breaking the bank.</p>
              <ul>
                  <li><strong>Thai Delight</strong></li>
                  <li><strong>High Street Deli</strong> - Go at 4:20 everyday for $8 sandwiches</li>
                  <li><strong>Finney's</strong></li>
                  <li><strong>Taqueria San Miguel</strong> - Go on Taco Tuesdays for $1 Tacos</li>
                  <li><strong>In-N-Out</strong> - A California classic with a beautiful drive to Pismo along the coast</li>
              </ul>
              <h2>Sweet Options</h2>
              <p>Treat yourself to some affordable sweets in SLO.</p>
              <ul>
                  <li><strong>SloDoCo Donuts</strong></li>
                  <li><strong>Batch Old Fashioned Ice Cream</strong></li>
                  <li><strong>House of Bread</strong></li>
              </ul>
          </div>
        <div class="card">
          <h1>High-Cost Meals in San Luis Obispo
          <h2>Salty Options</h2>
          <p>Great spots for dinner!</p>
          <ul>
              <li><strong>Giuseppe’s Cucina Italiana</strong></li>
              <li><strong>Nate's on Marsh</strong></li>
              <li><strong>Bear & The Wren</strong></li>
              <li><strong>Luna Red</strong></li>
              <li><strong>Alex Madonna’s Gold Rush Steak House</strong></li>    
          </ul>
          <h2>Sweet Options</h2>
          <p>A fancy sweet treat</p>
          <ul>
              <li><strong>Madonna Inn Copper Cafe</strong></li>
              <li><strong>Mistura</strong></li>
          </ul>
        </div>
      </section>           
    </body>
    `}};Se.styles=[At.styles,q`
        
        img {
          width: 100vw;
          height: 400px;
          object-fit: cover;
          object-position: center;
          display: block;
          border-radius: var(--img-border-radius);
      
        }

        h2{
          font-family: var(--font-family-display);
          font-size: var(--size-type-large);
          font-weight: var(--font-weight-normal);
        }

        p {
          font-size: var(--size-type-medium);
        }

        svg.icon {
          display: inline;
          height: 2em;
          width: 2em;
          vertical-align: top;
          fill: currentColor;
        }

        .button {
          display: inline-block;
          padding: var(--size-spacing-medium);
          font-size: var(--size-type-medium);
          font-family: var(--font-family-display);
          background-color: var(--color-button-background);
          color: var(--color-button-text);
          border-radius: var(--card-border-radius);
          text-decoration: none;
          text-align: center;
          border: none;
          transition: background-color 0.3s ease;
        }
      
        .button:hover {
          background-color: var(--color-button-hover);
        }
        li strong {
          color: var(--color-text-list-strong);
        }
        p em {
          font-style: var(--font-italic-body);
          font-weight: var(--font-weight-medium);
        }
        section {
          display: grid;
          grid-gap: var(--grid-gap);
          grid-template-columns: var(--grid-columns);
          padding: var(--grid-container-padding);
          max-width: var(--grid-max-width);
          align-items: stretch;
        }
        section h1 {
          grid-column: 1 / -1;
          font-size: var(--size-type-xlarge);
      
        }
      .card {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          border: var(--card-border-color);
          border-radius: var(--card-border-radius);
          padding: var(--size-spacing-medium);
          background-color: var(--card-background-color);
          gap: var(--size-spacing-medium);
          flex-grow: 1;
      }
      h1 {
        font-family: var(--font-family-display);
        font-size: var(--size-type-xlarge);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-h1);
    
    }
    `];let oe=Se;const Xr=[{path:"/app/guest/:id",view:r=>A`
      <restaurant-view guest-id=${r.id}></restaurant-view>
    `},{path:"/app/meal",view:()=>A`
      <meal-view></meal-view>
    `},{path:"/app/test",view:()=>A`
      <test-view></test-view>
    `},{path:"/app",view:()=>A`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}],xe=class xe extends T{render(){return A`
      <mu-switch></mu-switch>
    `}connectedCallback(){super.connectedCallback(),we.initializeOnce()}};xe.uses=B({"home-view":yt,"restaurant-view":F,"test-view":ne});let ae=xe;B({"mu-auth":S.Provider,"mu-history":_i.Provider,"mu-store":class extends wi.Provider{constructor(){super(qr,Br,"slofoodguide:auth")}},"mu-switch":class extends ur.Element{constructor(){super(Xr,"slofoodguide:history","slofoodguide:auth")}},"slofoodguide-app":ae,"slo-food-header":we,"home-view":yt,"restaurant-view":F,"meal-view":oe});
