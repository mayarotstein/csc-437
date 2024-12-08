(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var J,Ue;class dt extends Error{}dt.prototype.name="InvalidTokenError";function ni(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function oi(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ni(t)}catch{return atob(t)}}function us(r,t){if(typeof r!="string")throw new dt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new dt(`Invalid token specified: missing part #${e+1}`);let i;try{i=oi(s)}catch(n){throw new dt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new dt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ai="mu:context",ie=`${ai}:change`;class li{constructor(t,e){this._proxy=ci(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ue extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new li(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ie,t),t}detach(t){this.removeEventListener(ie,t)}}function ci(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(ie,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function hi(r,t){const e=ds(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function ds(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return ds(r,i.host)}class ui extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ps(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ui(e,r))}class de{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function di(r){return t=>({...t,...r})}const re="mu:auth:jwt",fs=class gs extends de{constructor(t,e){super((s,i)=>this.update(s,i),t,gs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(fi(s)),Zt(i);case"auth/signout":return e(gi()),Zt(this._redirectForLogin);case"auth/redirect":return Zt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};fs.EVENT_TYPE="auth:message";let ms=fs;const vs=ps(ms.EVENT_TYPE);function Zt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class pi extends ue{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=et.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ms(this.context,this.redirect).attach(this)}}class tt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(re),t}}class et extends tt{constructor(t){super();const e=us(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new et(t);return localStorage.setItem(re,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(re);return t?et.authenticate(t):new tt}}function fi(r){return di({user:et.authenticate(r),token:r})}function gi(){return r=>{const t=r.user;return{user:t&&t.authenticated?tt.deauthenticate(t):t,token:""}}}function mi(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function vi(r){return r.authenticated?us(r.token||""):{}}const S=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:et,Provider:pi,User:tt,dispatch:vs,headers:mi,payload:vi},Symbol.toStringTag,{value:"Module"}));function Tt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function ne(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ys=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ne,relay:Tt},Symbol.toStringTag,{value:"Module"}));function _s(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const yi=new DOMParser;function F(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=yi.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Le(a);case"bigint":case"boolean":case"number":case"symbol":return Le(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Le(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ft(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let _i=(J=class extends HTMLElement{constructor(){super(),this._state={},Ft(this).template(J.template).styles(J.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Tt(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},bi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},J.template=F`
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
  `,J.styles=_s`
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
  `,J);function bi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const bs=Object.freeze(Object.defineProperty({__proto__:null,Element:_i},Symbol.toStringTag,{value:"Module"})),$s=class ws extends de{constructor(t){super((e,s)=>this.update(e,s),t,ws.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(wi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(Ai(s,i));break}}}};$s.EVENT_TYPE="history:message";let pe=$s;class Ne extends ue{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=$i(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),fe(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new pe(this.context).attach(this)}}function $i(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function wi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function Ai(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const fe=ps(pe.EVENT_TYPE),As=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ne,Provider:Ne,Service:pe,dispatch:fe},Symbol.toStringTag,{value:"Module"}));class x{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Me(this._provider,t);this._effects.push(i),e(i)}else hi(this._target,this._contextLabel).then(i=>{const n=new Me(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Me{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Es=class Ss extends HTMLElement{constructor(){super(),this._state={},this._user=new tt,this._authObserver=new x(this,"blazing:auth"),Ft(this).template(Ss.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Ei(i,this._state,e,this.authorization).then(n=>lt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&je(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&je(this.src,this.authorization).then(i=>{this._state=i,lt(i,this)});break;case"new":s&&(this._state={},lt({},this));break}}};Es.observedAttributes=["src","new","action"];Es.template=F`
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
  `;function je(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function lt(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function Ei(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const xs=class ks extends de{constructor(t,e){super(e,t,ks.EVENT_TYPE,!1)}};xs.EVENT_TYPE="mu:message";let Ps=xs;class Si extends ue{constructor(t,e,s){super(e),this._user=new tt,this._updateFn=t,this._authObserver=new x(this,s)}connectedCallback(){const t=new Ps(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const xi=Object.freeze(Object.defineProperty({__proto__:null,Provider:Si,Service:Ps},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis,ge=Ot.ShadowRoot&&(Ot.ShadyCSS===void 0||Ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),He=new WeakMap;let Os=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ge&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&He.set(e,t))}return t}toString(){return this.cssText}};const ki=r=>new Os(typeof r=="string"?r:r+"",void 0,me),Pi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Os(e,r,me)},Oi=(r,t)=>{if(ge)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Ot.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ie=ge?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ki(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ci,defineProperty:Ti,getOwnPropertyDescriptor:Ri,getOwnPropertyNames:zi,getOwnPropertySymbols:Ui,getPrototypeOf:Li}=Object,st=globalThis,De=st.trustedTypes,Ni=De?De.emptyScript:"",Fe=st.reactiveElementPolyfillSupport,pt=(r,t)=>r,Rt={toAttribute(r,t){switch(t){case Boolean:r=r?Ni:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ve=(r,t)=>!Ci(r,t),Be={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:ve};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),st.litPropertyMetadata??(st.litPropertyMetadata=new WeakMap);let Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ti(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Ri(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=Li(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,s=[...zi(e),...Ui(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ie(i))}else t!==void 0&&e.push(Ie(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Oi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Rt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Rt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ve)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[pt("elementProperties")]=new Map,Z[pt("finalized")]=new Map,Fe==null||Fe({ReactiveElement:Z}),(st.reactiveElementVersions??(st.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zt=globalThis,Ut=zt.trustedTypes,qe=Ut?Ut.createPolicy("lit-html",{createHTML:r=>r}):void 0,Cs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Ts="?"+P,Mi=`<${Ts}>`,B=document,mt=()=>B.createComment(""),vt=r=>r===null||typeof r!="object"&&typeof r!="function",ye=Array.isArray,ji=r=>ye(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,We=/>/g,j=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Ke=/"/g,Rs=/^(?:script|style|textarea|title)$/i,Hi=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ht=Hi(1),it=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Je=new WeakMap,I=B.createTreeWalker(B,129);function zs(r,t){if(!ye(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const Ii=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ct?f[1]==="!--"?o=Ve:f[1]!==void 0?o=We:f[2]!==void 0?(Rs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=i??ct,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?j:f[3]==='"'?Ke:Ye):o===Ke||o===Ye?o=j:o===Ve||o===We?o=ct:(o=j,i=void 0);const h=o===j&&r[l+1].startsWith("/>")?" ":"";n+=o===ct?a+Mi:u>=0?(s.push(d),a.slice(0,u)+Cs+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[zs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let oe=class Us{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ii(t,e);if(this.el=Us.createElement(d,s),I.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=I.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Cs)){const c=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Fi:p[1]==="?"?Bi:p[1]==="@"?qi:Bt}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Rs.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],mt()),I.nextNode(),a.push({type:2,index:++n});i.append(u[c],mt())}}}else if(i.nodeType===8)if(i.data===Ts)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=B.createElement("template");return s.innerHTML=t,s}};function rt(r,t,e=r,s){var i,n;if(t===it)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=vt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=rt(r,o._$AS(r,t.values),o,s)),t}class Di{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??B).importNode(e,!0);I.currentNode=i;let n=I.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Vi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=I.nextNode(),o++)}return I.currentNode=B,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),vt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ji(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=oe.createElement(zs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Di(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Je.get(t.strings);return e===void 0&&Je.set(t.strings,e=new oe(t)),e}k(t){ye(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new wt(this.O(mt()),this.O(mt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Bt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=rt(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==it,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=rt(this,l[s+a],e,a),d===it&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Fi extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Bi extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class qi extends Bt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??_)===it)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Vi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const Ge=zt.litHtmlPolyfillSupport;Ge==null||Ge(oe,wt),(zt.litHtmlVersions??(zt.litHtmlVersions=[])).push("3.2.0");const Wi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(mt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let X=class extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Wi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return it}};X._$litElement$=!0,X.finalized=!0,(Ue=globalThis.litElementHydrateSupport)==null||Ue.call(globalThis,{LitElement:X});const Ze=globalThis.litElementPolyfillSupport;Ze==null||Ze({LitElement:X});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yi={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:ve},Ki=(r=Yi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Ls(r){return(t,e)=>typeof e=="object"?Ki(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ns(r){return Ls({...r,state:!0,attribute:!1})}function Ji(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Gi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ms={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,v,Wt){var A=v.length-1;switch(g){case 1:return new m.Root({},[v[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new m.Literal({value:v[A]});break;case 7:this.$=new m.Splat({name:v[A]});break;case 8:this.$=new m.Param({name:v[A]});break;case 9:this.$=new m.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],v=this.table,Wt="",A=0,Te=0,ei=2,Re=1,si=g.slice.call(arguments,1),y=Object.create(this.lexer),N={yy:{}};for(var Yt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Yt)&&(N.yy[Yt]=this.yy[Yt]);y.setInput(c,N.yy),N.yy.lexer=y,N.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Kt=y.yylloc;g.push(Kt);var ii=y.options&&y.options.ranges;typeof N.yy.parseError=="function"?this.parseError=N.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ri=function(){var K;return K=y.lex()||Re,typeof K!="number"&&(K=h.symbols_[K]||K),K},$,M,E,Jt,Y={},kt,k,ze,Pt;;){if(M=p[p.length-1],this.defaultActions[M]?E=this.defaultActions[M]:(($===null||typeof $>"u")&&($=ri()),E=v[M]&&v[M][$]),typeof E>"u"||!E.length||!E[0]){var Gt="";Pt=[];for(kt in v[M])this.terminals_[kt]&&kt>ei&&Pt.push("'"+this.terminals_[kt]+"'");y.showPosition?Gt="Parse error on line "+(A+1)+`:
`+y.showPosition()+`
Expecting `+Pt.join(", ")+", got '"+(this.terminals_[$]||$)+"'":Gt="Parse error on line "+(A+1)+": Unexpected "+($==Re?"end of input":"'"+(this.terminals_[$]||$)+"'"),this.parseError(Gt,{text:y.match,token:this.terminals_[$]||$,line:y.yylineno,loc:Kt,expected:Pt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+$);switch(E[0]){case 1:p.push($),m.push(y.yytext),g.push(y.yylloc),p.push(E[1]),$=null,Te=y.yyleng,Wt=y.yytext,A=y.yylineno,Kt=y.yylloc;break;case 2:if(k=this.productions_[E[1]][1],Y.$=m[m.length-k],Y._$={first_line:g[g.length-(k||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(k||1)].first_column,last_column:g[g.length-1].last_column},ii&&(Y._$.range=[g[g.length-(k||1)].range[0],g[g.length-1].range[1]]),Jt=this.performAction.apply(Y,[Wt,Te,A,N.yy,E[1],m,g].concat(si)),typeof Jt<"u")return Jt;k&&(p=p.slice(0,-1*k*2),m=m.slice(0,-1*k),g=g.slice(0,-1*k)),p.push(this.productions_[E[1]][0]),m.push(Y.$),g.push(Y._$),ze=v[p[p.length-2]][p[p.length-1]],p.push(ze);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(p=this._input.match(this.rules[g[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=v,this.options.backtrack_lexer){if(c=this.test_match(p,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Gi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ms);function G(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var js={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Hs=Ms.parser;Hs.yy=js;var Zi=Hs,Qi=Object.keys(js);function Xi(r){return Qi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Is=Xi,tr=Is,er=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ds(r){this.captures=r.captures,this.re=r.re}Ds.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var sr=tr({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(er,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ds({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),ir=sr,rr=Is,nr=rr({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),or=nr,ar=Zi,lr=ir,cr=or;At.prototype=Object.create(null);At.prototype.match=function(r){var t=lr.visit(this.ast),e=t.match(r);return e||!1};At.prototype.reverse=function(r){return cr.visit(this.ast,r)};function At(r){var t;if(this?t=this:t=Object.create(At.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=ar.parse(r),t}var hr=At,ur=hr,dr=ur;const pr=Ji(dr);var fr=Object.defineProperty,Fs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&fr(t,e,i),i};const Bs=class extends X{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ht` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new pr(i.path)})),this._historyObserver=new x(this,e),this._authObserver=new x(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ht` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(vs(this,"auth/redirect"),ht` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ht` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ht` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){fe(this,"history/redirect",{href:t})}};Bs.styles=Pi`
    :host,
    main {
      display: contents;
    }
  `;let Lt=Bs;Fs([Ns()],Lt.prototype,"_user");Fs([Ns()],Lt.prototype,"_match");const gr=Object.freeze(Object.defineProperty({__proto__:null,Element:Lt,Switch:Lt},Symbol.toStringTag,{value:"Module"})),qs=class Vs extends HTMLElement{constructor(){if(super(),Ft(this).template(Vs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};qs.template=F`
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
  `;let mr=qs;const vr=Object.freeze(Object.defineProperty({__proto__:null,Element:mr},Symbol.toStringTag,{value:"Module"})),_e=class ae extends HTMLElement{constructor(){super(),this._array=[],Ft(this).template(ae.template).styles(ae.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ws("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ne(t,"button.add")?Tt(t,"input-array:add"):ne(t,"button.remove")&&Tt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],_r(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};_e.template=F`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;_e.styles=_s`
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
  `;let yr=_e;function _r(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ws(e)))}function Ws(r,t){const e=r===void 0?F`<input />`:F`<input value="${r}" />`;return F`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const br=Object.freeze(Object.defineProperty({__proto__:null,Element:yr},Symbol.toStringTag,{value:"Module"}));function z(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var $r=Object.defineProperty,wr=Object.getOwnPropertyDescriptor,Ar=(r,t,e,s)=>{for(var i=wr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&$r(t,e,i),i};class Et extends X{constructor(t){super(),this._pending=[],this._observer=new x(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Ar([Ls()],Et.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,be=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),Qe=new WeakMap;let Ys=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(be&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Qe.set(e,t))}return t}toString(){return this.cssText}};const Er=r=>new Ys(typeof r=="string"?r:r+"",void 0,$e),U=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Ys(e,r,$e)},Sr=(r,t)=>{if(be)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Ct.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Xe=be?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Er(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:xr,defineProperty:kr,getOwnPropertyDescriptor:Pr,getOwnPropertyNames:Or,getOwnPropertySymbols:Cr,getPrototypeOf:Tr}=Object,C=globalThis,ts=C.trustedTypes,Rr=ts?ts.emptyScript:"",Xt=C.reactiveElementPolyfillSupport,ft=(r,t)=>r,Nt={toAttribute(r,t){switch(t){case Boolean:r=r?Rr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},we=(r,t)=>!xr(r,t),es={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:we};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class Q extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=es){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&kr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Pr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??es}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=Tr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...Or(e),...Cr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Xe(i))}else t!==void 0&&e.push(Xe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Sr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Nt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Nt;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??we)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[ft("elementProperties")]=new Map,Q[ft("finalized")]=new Map,Xt==null||Xt({ReactiveElement:Q}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=globalThis,Mt=gt.trustedTypes,ss=Mt?Mt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ks="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,Js="?"+O,zr=`<${Js}>`,q=document,yt=()=>q.createComment(""),_t=r=>r===null||typeof r!="object"&&typeof r!="function",Ae=Array.isArray,Ur=r=>Ae(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",te=`[ 	
\f\r]`,ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,is=/-->/g,rs=/>/g,H=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ns=/'/g,os=/"/g,Gs=/^(?:script|style|textarea|title)$/i,Lr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),w=Lr(1),nt=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),as=new WeakMap,D=q.createTreeWalker(q,129);function Zs(r,t){if(!Ae(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ss!==void 0?ss.createHTML(t):t}const Nr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ut;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ut?f[1]==="!--"?o=is:f[1]!==void 0?o=rs:f[2]!==void 0?(Gs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=H):f[3]!==void 0&&(o=H):o===H?f[0]===">"?(o=i??ut,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?H:f[3]==='"'?os:ns):o===os||o===ns?o=H:o===is||o===rs?o=ut:(o=H,i=void 0);const h=o===H&&r[l+1].startsWith("/>")?" ":"";n+=o===ut?a+zr:u>=0?(s.push(d),a.slice(0,u)+Ks+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[Zs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class bt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Nr(t,e);if(this.el=bt.createElement(d,s),D.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=D.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Ks)){const c=f[o++],h=i.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?jr:p[1]==="?"?Hr:p[1]==="@"?Ir:qt}),i.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Gs.test(i.tagName)){const u=i.textContent.split(O),c=u.length-1;if(c>0){i.textContent=Mt?Mt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],yt()),D.nextNode(),a.push({type:2,index:++n});i.append(u[c],yt())}}}else if(i.nodeType===8)if(i.data===Js)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const s=q.createElement("template");return s.innerHTML=t,s}}function ot(r,t,e=r,s){var o,l;if(t===nt)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=_t(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=ot(r,i._$AS(r,t.values),i,s)),t}class Mr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??q).importNode(e,!0);D.currentNode=i;let n=D.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new St(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Dr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=D.nextNode(),o++)}return D.currentNode=q,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class St{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),_t(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==nt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ur(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=bt.createElement(Zs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Mr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=as.get(t.strings);return e===void 0&&as.set(t.strings,e=new bt(t)),e}k(t){Ae(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new St(this.O(yt()),this.O(yt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class qt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=ot(this,t,e,0),o=!_t(t)||t!==this._$AH&&t!==nt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=ot(this,l[s+a],e,a),d===nt&&(d=this._$AH[a]),o||(o=!_t(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class jr extends qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Hr extends qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ir extends qt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??b)===nt)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Dr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}}const ee=gt.litHtmlPolyfillSupport;ee==null||ee(bt,St),(gt.litHtmlVersions??(gt.litHtmlVersions=[])).push("3.2.1");const Fr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new St(t.insertBefore(yt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let T=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return nt}};var hs;T._$litElement$=!0,T.finalized=!0,(hs=globalThis.litElementHydrateSupport)==null||hs.call(globalThis,{LitElement:T});const se=globalThis.litElementPolyfillSupport;se==null||se({LitElement:T});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Br={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:we},qr=(r=Br,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Vt(r){return(t,e)=>typeof e=="object"?qr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function L(r){return Vt({...r,state:!0,attribute:!1})}const Vr=U`

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
  `,xt={styles:Vr};var Wr=Object.defineProperty,Qs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Wr(t,e,i),i};function Yr(r){const t=r.target;if(t){const e=t.checked,s=new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{checked:e}});t.dispatchEvent(s)}}function Kr(r){ys.relay(r,"auth:message",["auth/signout"])}var R;const Ee=(R=class extends T{constructor(){super(...arguments),this.userid="guest",this.navigationLinks=[],this._authObserver=new x(this,"slofoodguide:auth")}render(){return w`
      <header>
        <h1><a class="title" href="/">San Luis Obispo Food Guide</a></h1>
        <nav>
          ${this.navigationLinks.map(t=>w`<a href=${t.href}>${t.label}</a>`)}
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
                  @change=${Yr}
                  />
                  <slot name="dark-mode">Dark Mode</slot>
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout" @click=${Kr}>Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>
        </drop-down>
      </header>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!==this.userid&&(this.userid=t.username)}),R.initializeOnce()}static initializeOnce(){document.body.dataset.darkModeListener!=="true"&&(document.body.addEventListener("darkmode:toggle",t=>{const e=t,{checked:s}=e.detail;document.body.classList.toggle("dark-mode",s)}),document.body.dataset.darkModeListener="true")}},R.uses=z({"drop-down":vr.Element}),R.styles=[xt.styles,U`
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
  `],R);Qs([L()],Ee.prototype,"userid");Qs([L()],Ee.prototype,"navigationLinks");let Se=Ee;z({"slo-food-header":Se,"mu-auth":S.Provider});window.relayEvent=ys.relay;document.addEventListener("DOMContentLoaded",()=>{document.querySelector("slo-food-header")});const Jr={};function Gr(r,t,e){switch(r[0]){case"profile/select":Zr(r[1],e).then(i=>t(n=>({...n,profile:i})));break;case"profile/save":Qr(r[1],e).then(i=>t(n=>({...n,profile:i}))).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;default:const s=r[0];throw new Error(`Unhandled Auth message "${s}"`)}}function Zr(r,t){return fetch(`/api/guests/${r.userid}`,{headers:S.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}function Qr(r,t){return fetch(`/api/guests/${r.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...S.headers(t)},body:JSON.stringify(r.profile)}).then(e=>{if(console.log("Response status:",e.status),e.status===200)return e.json();throw new Error(`Failed to save profile for ${r.userid}`)}).then(e=>{if(e)return e})}var ls=Object.freeze,Xs=Object.defineProperty,Xr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Xs(t,e,i),i},tn=(r,t)=>ls(Xs(r,"raw",{value:ls(r.slice())})),cs;const Pe=class Pe extends Et{constructor(){super(...arguments),this.src="/api/guests/",this.userid="guest",this._authObserver=new x(this,"slofoodguide:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!=this.userid&&(this.userid=t.username)})}render(){return w(cs||(cs=tn([`
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
    `])),this.userid)}};Pe.styles=[xt.styles,U`
        
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
    `];let $t=Pe;Xr([L()],$t.prototype,"userid");var en=Object.defineProperty,ti=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&en(t,e,i),i};const jt=class jt extends T{constructor(){super(...arguments),this._user=new S.User,this._authObserver=new x(this,"slofoodguide:auth"),this.userid="guest"}render(){const{username:t,favoritemeal:e,nickname:s,partysize:i}=this.guest||{};return w`
          <section class="profile">
            <h2>Your Profile</h2>
            <p>Username: ${t}</p>
            <img src=${e} alt="Favorite Meal" />
            <p>Nickname: ${s}</p>
            <p>Party Size: ${i}</p>
            <a href="/app/guest/edit/${this.userid}" class="button">Edit Profile</a>
          </section>
        `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!=this.userid&&(this.userid=t.username),t&&(this._user=t),this.src&&this.mode!=="new"&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status!==200)throw new Error(`Status: ${e.status}`);return e.json()}).then(e=>{this.guest=e}).catch(e=>{console.error(`Failed to render data from ${t}:`,e)})}get src(){return this.getAttribute("src")}set mode(t){t&&this.setAttribute("mode",t)}get favoritemealInput(){var t;return((t=this.shadowRoot)==null?void 0:t.querySelector('input[type="file"]'))||null}attributeChangedCallback(t,e,s){t==="src"&&e!==s&&this.mode!=="new"&&this.hydrate(s)}};jt.uses=z({"mu-form":bs.Element}),jt.styles=U`
    :host {
      display: contents;
    }

    h2{
        font-family: var(--font-family-display);
        font-size: var(--size-type-large);
        font-weight: var(--font-weight-normal);
        grid-column: 1 / -1;
        margin: 0;
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
  `;let at=jt;ti([L()],at.prototype,"guest");ti([L()],at.prototype,"userid");var sn=Object.defineProperty,rn=Object.getOwnPropertyDescriptor,xe=(r,t,e,s)=>{for(var i=s>1?void 0:s?rn(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&sn(t,e,i),i};const Ht=class Ht extends Et{get profile(){return this.model.profile}render(){return w`
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
    `}constructor(){super("slofoodguide:model")}};Ht.uses=z({"guest-profile":at}),Ht.styles=[xt.styles,U`
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
      }`];let V=Ht;xe([Vt()],V.prototype,"userid",2);xe([Vt({attribute:"guest-id"})],V.prototype,"guestId",2);xe([L()],V.prototype,"profile",1);const It=class It extends T{constructor(){super(...arguments),this._user=new S.User,this.src="/api/guests/",this._authObserver=new x(this,"slofoodguide:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).catch(e=>console.log("Failed to load main data:",e))}render(){return w`
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
    `}};It.uses=z({"guest-profile":at}),It.styles=[xt.styles,U`
        
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
        }`];let le=It;const Oe=class Oe extends Et{constructor(){super(...arguments),this.src="/api/guests/",this._user=new S.User,this._authObserver=new x(this,"slofoodguide:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).catch(e=>console.log("Failed to load main data:",e)).catch(e=>console.log("Failed to convert main data:",e))}render(){return w`
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
    `}};Oe.styles=[xt.styles,U`
        
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
    `];let ce=Oe;var nn=Object.defineProperty,on=Object.getOwnPropertyDescriptor,ke=(r,t,e,s)=>{for(var i=s>1?void 0:s?on(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&nn(t,e,i),i};const Dt=class Dt extends Et{get profile(){return this.model.profile}_handleSubmit(t){const e=this.userid||"";this.dispatchMessage(["profile/save",{userid:e,profile:t.detail,onSuccess:()=>{As.dispatch(this,"history/navigate",{href:`/app/guest/${this.userid}`})},onFailure:s=>{console.error("ERROR:",s)}}])}render(){return w`
        <section class="edit-profile">
          <h2 class="main">Edit Your Profile</h2>
          <div class="card">
            <mu-form
              init=${this.profile}
              @mu-form:submit=${this._handleSubmit}>
              <label>
                <h2><span>Username</span></h2>
                <input name="username"</input>
              </label>
              <label>
                <h2><span>Favorite Meal</span></h2>
                <input
                  name="favoritemeal"
                  type="file"
                  @change=${this.handleFavoritemealSelected} />
              </label>
              <label>
                <h2><span>Nickname</span></h2>
                <input name="nickname"></input>
              </label>
              <label>
                <h2><span>Party Size</span></h2>
                <input name="partysize"</input>
              </label>
            </mu-form>
          </div>
        </section>
      `}handleFavoritemealSelected(t){var n;const s=(n=t.target.files)==null?void 0:n[0];if(!s)return;const i=new FileReader;i.onload=()=>this._favoritemeal=i.result,i.onerror=o=>console.error("FileReader error:",o),i.readAsDataURL(s)}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="userid"&&e!==s&&s&&this.dispatchMessage(["profile/select",{userid:s}])}};Dt.uses=z({"mu-form":bs.Element,"input-array":br.Element}),Dt.styles=U`
      :host {
        display: contents;
      }

      form {
        display: flex;
        flex-direction: column;
        padding: var(--size-spacing-medium); /* Add some padding for the card */
        gap: var(--size-spacing-medium); /* Space between elements */
        width: 100%;
        margin-left: 0;
      }
  
      h2{
          font-family: var(--font-family-display);
          font-size: var(--size-type-large);
          font-weight: var(--font-weight-normal);
          grid-column: 1 / -1;
      }

      .main{
        font-size: var(--size-type-xlarge);
        margin-bottom: 0;
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
    `;let W=Dt;ke([L()],W.prototype,"guest",2);ke([Vt()],W.prototype,"userid",2);ke([L()],W.prototype,"profile",1);const an=[{path:"/app/guest/:id",view:r=>w`
      <restaurant-view guest-id=${r.id}></restaurant-view>
    `},{path:"/app/meal",view:()=>w`
      <meal-view></meal-view>
    `},{path:"/app/test",view:()=>w`
      <test-view></test-view>
    `},{path:"/app/guest/edit/:id",view:r=>w`
      <guest-edit guest-id=${r.id}></guest-edit>
    `},{path:"/app",view:()=>w`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}],Ce=class Ce extends T{render(){return w`
      <mu-switch></mu-switch>
    `}connectedCallback(){super.connectedCallback(),Se.initializeOnce()}};Ce.uses=z({"home-view":$t,"restaurant-view":V,"test-view":le,"guest-edit":W});let he=Ce;z({"mu-auth":S.Provider,"mu-history":As.Provider,"mu-store":class extends xi.Provider{constructor(){super(Gr,Jr,"slofoodguide:auth")}},"mu-switch":class extends gr.Element{constructor(){super(an,"slofoodguide:history","slofoodguide:auth")}},"slofoodguide-app":he,"slo-food-header":Se,"home-view":$t,"restaurant-view":V,"meal-view":ce,"guest-edit":W});
