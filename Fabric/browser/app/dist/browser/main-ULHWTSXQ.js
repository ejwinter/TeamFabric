import{a as ci,b as di,c as mi,d as Ht,e as hi,f as X,g as $,h as vt,i as ui,j as _i,k as xt,l as gi,m as Qt,n as yt,o as fi,p as bi,q as wt,r as vi,s as xi,t as qt,u as Wt,v as yi,w as wi,x as ot,y as Ii}from"./chunk-J5PNG6IG.js";import{b as Ye,c as Je,d as ti}from"./chunk-EKGNUMOU.js";import{$ as tt,A as he,B as li,C as at,D as S,E as pi,F as I,G as Y,H as J,I as Gt,J as Ut,K as ki,L as kt,M as Ci,N as ue,O as _e,P as ge,Q as Mi,R as Zt,S as Kt,T as Di,U as Ei,V as Ai,W as Si,X as Ct,Y as Mt,Z as Xt,_ as Dt,aa as Et,ba as $t,e as ft,f as Ke,g as Xe,h as $e,m as B,o as bt,p as pe,q as ei,r as Nt,s as ii,t as ni,u as jt,v as ai,w as oi,x as ri,y as si,z as Vt}from"./chunk-VKMP52D6.js";import{$ as E,$a as u,A as Fe,Ab as Ue,B as le,Bb as h,Db as p,Eb as V,Fb as v,Gb as K,Hb as U,Ib as x,Jb as y,K as ce,La as Ve,M as H,Ma as d,Nb as de,O as Re,Ob as it,Pb as f,Qa as He,Qb as Ze,R as ct,Ra as pt,Rb as m,S as k,Sa as Qe,Sb as L,Ta as Bt,Tb as Ot,U as T,Ua as ht,Vb as ut,W as r,Wa as qe,Wb as _t,X as Le,Xb as gt,Yb as W,a as lt,aa as A,ab as C,bb as M,d as Ie,da as Q,db as j,ea as Z,eb as zt,g as w,gb as We,ha as dt,hc as nt,i as Te,ia as F,jc as me,k as Pe,kb as q,la as Be,lb as _,ma as N,mb as g,na as ze,o as se,ob as Ge,pa as mt,pb as Tt,qa as It,qb as Pt,ra as G,rb as R,sa as P,sb as s,ta as Ne,tb as c,u as Lt,ub as b,v as St,ya as je,z as Oe,zb as O}from"./chunk-5FYFBQHR.js";var nn="@",an=(()=>{class n{doc;delegate;zone;animationType;moduleImpl;_rendererFactoryPromise=null;scheduler=null;injector=r(Q);loadingSchedulerFn=r(on,{optional:!0});_engine;constructor(t,e,i,o,l){this.doc=t,this.delegate=e,this.zone=i,this.animationType=o,this.moduleImpl=l}ngOnDestroy(){this._engine?.flush()}loadImpl(){let t=()=>this.moduleImpl??import("./chunk-34NHSQNI.js").then(i=>i),e;return this.loadingSchedulerFn?e=this.loadingSchedulerFn(t):e=t(),e.catch(i=>{throw new Re(5300,!1)}).then(({\u0275createEngine:i,\u0275AnimationRendererFactory:o})=>{this._engine=i(this.animationType,this.doc);let l=new o(this.delegate,this._engine,this.zone);return this.delegate=l,l})}createRenderer(t,e){let i=this.delegate.createRenderer(t,e);if(i.\u0275type===0)return i;typeof i.throwOnSyntheticProps=="boolean"&&(i.throwOnSyntheticProps=!1);let o=new fe(i);return e?.data?.animation&&!this._rendererFactoryPromise&&(this._rendererFactoryPromise=this.loadImpl()),this._rendererFactoryPromise?.then(l=>{let D=l.createRenderer(t,e);o.use(D),this.scheduler??=this.injector.get(ze,null,{optional:!0}),this.scheduler?.notify(10)}).catch(l=>{o.use(i)}),o}begin(){this.delegate.begin?.()}end(){this.delegate.end?.()}whenRenderingDone(){return this.delegate.whenRenderingDone?.()??Promise.resolve()}componentReplaced(t){this._engine?.flush(),this.delegate.componentReplaced?.(t)}static \u0275fac=function(e){qe()};static \u0275prov=ct({token:n,factory:n.\u0275fac})}return n})(),fe=class{delegate;replay=[];\u0275type=1;constructor(a){this.delegate=a}use(a){if(this.delegate=a,this.replay!==null){for(let t of this.replay)t(a);this.replay=null}}get data(){return this.delegate.data}destroy(){this.replay=null,this.delegate.destroy()}createElement(a,t){return this.delegate.createElement(a,t)}createComment(a){return this.delegate.createComment(a)}createText(a){return this.delegate.createText(a)}get destroyNode(){return this.delegate.destroyNode}appendChild(a,t){this.delegate.appendChild(a,t)}insertBefore(a,t,e,i){this.delegate.insertBefore(a,t,e,i)}removeChild(a,t,e,i){this.delegate.removeChild(a,t,e,i)}selectRootElement(a,t){return this.delegate.selectRootElement(a,t)}parentNode(a){return this.delegate.parentNode(a)}nextSibling(a){return this.delegate.nextSibling(a)}setAttribute(a,t,e,i){this.delegate.setAttribute(a,t,e,i)}removeAttribute(a,t,e){this.delegate.removeAttribute(a,t,e)}addClass(a,t){this.delegate.addClass(a,t)}removeClass(a,t){this.delegate.removeClass(a,t)}setStyle(a,t,e,i){this.delegate.setStyle(a,t,e,i)}removeStyle(a,t,e){this.delegate.removeStyle(a,t,e)}setProperty(a,t,e){this.shouldReplay(t)&&this.replay.push(i=>i.setProperty(a,t,e)),this.delegate.setProperty(a,t,e)}setValue(a,t){this.delegate.setValue(a,t)}listen(a,t,e,i){return this.shouldReplay(t)&&this.replay.push(o=>o.listen(a,t,e,i)),this.delegate.listen(a,t,e,i)}shouldReplay(a){return this.replay!==null&&a.startsWith(nn)}},on=new T("");function Ti(n="animations"){return He("NgAsyncAnimations"),Le([{provide:Bt,useFactory:()=>new an(r(Z),r(Ke),r(F),n)},{provide:je,useValue:n==="noop"?"NoopAnimations":"BrowserAnimations"}])}var Pi=[{path:"",loadComponent:()=>import("./chunk-TYSEAI3Z.js").then(n=>n.ItemList)},{path:"search",loadComponent:()=>import("./chunk-YVHJCYWU.js").then(n=>n.SearchView)},{path:"**",redirectTo:""}];var Oi={providers:[Be(),ti(Pi),$e(),Ti()]};var te=["*"],sn=["content"],ln=[[["mat-drawer"]],[["mat-drawer-content"]],"*"],cn=["mat-drawer","mat-drawer-content","*"];function dn(n,a){if(n&1){let t=O();s(0,"div",1),h("click",function(){E(t);let i=p();return A(i._onBackdropClicked())}),c()}if(n&2){let t=p();f("mat-drawer-shown",t._isShowingBackdrop())}}function mn(n,a){n&1&&(s(0,"mat-drawer-content"),v(1,2),c())}var pn=[[["mat-sidenav"]],[["mat-sidenav-content"]],"*"],hn=["mat-sidenav","mat-sidenav-content","*"];function un(n,a){if(n&1){let t=O();s(0,"div",1),h("click",function(){E(t);let i=p();return A(i._onBackdropClicked())}),c()}if(n&2){let t=p();f("mat-drawer-shown",t._isShowingBackdrop())}}function _n(n,a){n&1&&(s(0,"mat-sidenav-content"),v(1,2),c())}var gn=`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));
  background-color: var(--mat-sidenav-content-background-color, var(--mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));
  box-shadow: var(--mat-sidenav-container-elevation-shadow, none);
  background-color: var(--mat-sidenav-container-background-color, var(--mat-sys-surface));
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  width: var(--mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`;var fn=new T("MAT_DRAWER_DEFAULT_AUTOSIZE",{providedIn:"root",factory:()=>!1}),xe=new T("MAT_DRAWER_CONTAINER"),Yt=(()=>{class n extends kt{_platform=r(B);_changeDetectorRef=r(nt);_container=r(ve);constructor(){let t=r(P),e=r(ki),i=r(F);super(t,e,i)}ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>{this._changeDetectorRef.markForCheck()})}_shouldBeHidden(){if(this._platform.isBrowser)return!1;let{start:t,end:e}=this._container;return t!=null&&t.mode!=="over"&&t.opened||e!=null&&e.mode!=="over"&&e.opened}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["mat-drawer-content"]],hostAttrs:[1,"mat-drawer-content"],hostVars:6,hostBindings:function(e,i){e&2&&(it("margin-left",i._container._contentMargins.left,"px")("margin-right",i._container._contentMargins.right,"px"),f("mat-drawer-content-hidden",i._shouldBeHidden()))},features:[W([{provide:kt,useExisting:n}]),j],ngContentSelectors:te,decls:1,vars:0,template:function(e,i){e&1&&(V(),v(0))},encapsulation:2,changeDetection:0})}return n})(),be=(()=>{class n{_elementRef=r(P);_focusTrapFactory=r(oi);_focusMonitor=r(ei);_platform=r(B);_ngZone=r(F);_renderer=r(ht);_interactivityChecker=r(ai);_doc=r(Z);_container=r(xe,{optional:!0});_focusTrap=null;_elementFocusedBeforeDrawerWasOpened=null;_eventCleanups;_isAttached=!1;_anchor=null;get position(){return this._position}set position(t){t=t==="end"?"end":"start",t!==this._position&&(this._isAttached&&this._updatePositionInParent(t),this._position=t,this.onPositionChanged.emit())}_position="start";get mode(){return this._mode}set mode(t){this._mode=t,this._updateFocusTrapState(),this._modeChanged.next()}_mode="over";get disableClose(){return this._disableClose}set disableClose(t){this._disableClose=S(t)}_disableClose=!1;get autoFocus(){let t=this._autoFocus;return t??(this.mode==="side"?"dialog":"first-tabbable")}set autoFocus(t){(t==="true"||t==="false"||t==null)&&(t=S(t)),this._autoFocus=t}_autoFocus;get opened(){return this._opened()}set opened(t){this.toggle(S(t))}_opened=N(!1);_openedVia=null;_animationStarted=new w;_animationEnd=new w;openedChange=new dt(!0);_openedStream=this.openedChange.pipe(St(t=>t),se(()=>{}));openedStart=this._animationStarted.pipe(St(()=>this.opened),le(void 0));_closedStream=this.openedChange.pipe(St(t=>!t),se(()=>{}));closedStart=this._animationStarted.pipe(St(()=>!this.opened),le(void 0));_destroyed=new w;onPositionChanged=new dt;_content;_modeChanged=new w;_injector=r(Q);_changeDetectorRef=r(nt);constructor(){this.openedChange.pipe(H(this._destroyed)).subscribe(t=>{t?(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement,this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus(this._openedVia||"program")}),this._eventCleanups=this._ngZone.runOutsideAngular(()=>{let t=this._renderer,e=this._elementRef.nativeElement;return[t.listen(e,"keydown",i=>{i.keyCode===27&&!this.disableClose&&!si(i)&&this._ngZone.run(()=>{this.close(),i.stopPropagation(),i.preventDefault()})}),t.listen(e,"transitionend",this._handleTransitionEvent),t.listen(e,"transitioncancel",this._handleTransitionEvent)]}),this._animationEnd.subscribe(()=>{this.openedChange.emit(this.opened)})}_forceFocus(t,e){this._interactivityChecker.isFocusable(t)||(t.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let i=()=>{o(),l(),t.removeAttribute("tabindex")},o=this._renderer.listen(t,"blur",i),l=this._renderer.listen(t,"mousedown",i)})),t.focus(e)}_focusByCssSelector(t,e){let i=this._elementRef.nativeElement.querySelector(t);i&&this._forceFocus(i,e)}_takeFocus(){if(!this._focusTrap)return;let t=this._elementRef.nativeElement;switch(this.autoFocus){case!1:case"dialog":return;case!0:case"first-tabbable":pt(()=>{!this._focusTrap.focusInitialElement()&&typeof t.focus=="function"&&t.focus()},{injector:this._injector});break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');break;default:this._focusByCssSelector(this.autoFocus);break}}_restoreFocus(t){this.autoFocus!=="dialog"&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,t):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null)}_isFocusWithinDrawer(){let t=this._doc.activeElement;return!!t&&this._elementRef.nativeElement.contains(t)}ngAfterViewInit(){this._isAttached=!0,this._position==="end"&&this._updatePositionInParent("end"),this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState())}ngOnDestroy(){this._eventCleanups.forEach(t=>t()),this._focusTrap?.destroy(),this._anchor?.remove(),this._anchor=null,this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(t){return this.toggle(!0,t)}close(){return this.toggle(!1)}_closeViaBackdropClick(){return this._setOpen(!1,!0,"mouse")}toggle(t=!this.opened,e){t&&e&&(this._openedVia=e);let i=this._setOpen(t,!t&&this._isFocusWithinDrawer(),this._openedVia||"program");return t||(this._openedVia=null),i}_setOpen(t,e,i){return t===this.opened?Promise.resolve(t?"open":"close"):(this._opened.set(t),this._container?._transitionsEnabled?(this._setIsAnimating(!0),setTimeout(()=>this._animationStarted.next())):setTimeout(()=>{this._animationStarted.next(),this._animationEnd.next()}),this._elementRef.nativeElement.classList.toggle("mat-drawer-opened",t),!t&&e&&this._restoreFocus(i),this._changeDetectorRef.markForCheck(),this._updateFocusTrapState(),new Promise(o=>{this.openedChange.pipe(Fe(1)).subscribe(l=>o(l?"open":"close"))}))}_setIsAnimating(t){this._elementRef.nativeElement.classList.toggle("mat-drawer-animating",t)}_getWidth(){return this._elementRef.nativeElement.offsetWidth||0}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&!!this._container?._isShowingBackdrop())}_updatePositionInParent(t){if(!this._platform.isBrowser)return;let e=this._elementRef.nativeElement,i=e.parentNode;t==="end"?(this._anchor||(this._anchor=this._doc.createComment("mat-drawer-anchor"),i.insertBefore(this._anchor,e)),i.appendChild(e)):this._anchor&&this._anchor.parentNode.insertBefore(e,this._anchor)}_handleTransitionEvent=t=>{let e=this._elementRef.nativeElement;t.target===e&&this._ngZone.run(()=>{t.type==="transitionend"&&this._setIsAnimating(!1),this._animationEnd.next(t)})};static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["mat-drawer"]],viewQuery:function(e,i){if(e&1&&U(sn,5),e&2){let o;x(o=y())&&(i._content=o.first)}},hostAttrs:[1,"mat-drawer"],hostVars:12,hostBindings:function(e,i){e&2&&(q("align",null)("tabIndex",i.mode!=="side"?"-1":null),it("visibility",!i._container&&!i.opened?"hidden":null),f("mat-drawer-end",i.position==="end")("mat-drawer-over",i.mode==="over")("mat-drawer-push",i.mode==="push")("mat-drawer-side",i.mode==="side"))},inputs:{position:"position",mode:"mode",disableClose:"disableClose",autoFocus:"autoFocus",opened:"opened"},outputs:{openedChange:"openedChange",_openedStream:"opened",openedStart:"openedStart",_closedStream:"closed",closedStart:"closedStart",onPositionChanged:"positionChanged"},exportAs:["matDrawer"],ngContentSelectors:te,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(e,i){e&1&&(V(),s(0,"div",1,0),v(2),c())},dependencies:[kt],encapsulation:2,changeDetection:0})}return n})(),ve=(()=>{class n{_dir=r(pi,{optional:!0});_element=r(P);_ngZone=r(F);_changeDetectorRef=r(nt);_animationDisabled=at();_transitionsEnabled=!1;_allDrawers;_drawers=new Ne;_content;_userContent;get start(){return this._start}get end(){return this._end}get autosize(){return this._autosize}set autosize(t){this._autosize=S(t)}_autosize=r(fn);get hasBackdrop(){return this._drawerHasBackdrop(this._start)||this._drawerHasBackdrop(this._end)}set hasBackdrop(t){this._backdropOverride=t==null?null:S(t)}_backdropOverride=null;backdropClick=new dt;_start=null;_end=null;_left=null;_right=null;_destroyed=new w;_doCheckSubject=new w;_contentMargins={left:null,right:null};_contentMarginChanges=new w;get scrollable(){return this._userContent||this._content}_injector=r(Q);constructor(){let t=r(B),e=r(Ci);this._dir?.change.pipe(H(this._destroyed)).subscribe(()=>{this._validateDrawers(),this.updateContentMargins()}),e.change().pipe(H(this._destroyed)).subscribe(()=>this.updateContentMargins()),!this._animationDisabled&&t.isBrowser&&this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._element.nativeElement.classList.add("mat-drawer-transition"),this._transitionsEnabled=!0},200)})}ngAfterContentInit(){this._allDrawers.changes.pipe(ce(this._allDrawers),H(this._destroyed)).subscribe(t=>{this._drawers.reset(t.filter(e=>!e._container||e._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(ce(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(t=>{this._watchDrawerToggle(t),this._watchDrawerPosition(t),this._watchDrawerMode(t)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(Oe(10),H(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngOnDestroy(){this._contentMarginChanges.complete(),this._doCheckSubject.complete(),this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}open(){this._drawers.forEach(t=>t.open())}close(){this._drawers.forEach(t=>t.close())}updateContentMargins(){let t=0,e=0;if(this._left&&this._left.opened){if(this._left.mode=="side")t+=this._left._getWidth();else if(this._left.mode=="push"){let i=this._left._getWidth();t+=i,e-=i}}if(this._right&&this._right.opened){if(this._right.mode=="side")e+=this._right._getWidth();else if(this._right.mode=="push"){let i=this._right._getWidth();e+=i,t-=i}}t=t||null,e=e||null,(t!==this._contentMargins.left||e!==this._contentMargins.right)&&(this._contentMargins={left:t,right:e},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}_watchDrawerToggle(t){t._animationStarted.pipe(H(this._drawers.changes)).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),t.mode!=="side"&&t.openedChange.pipe(H(this._drawers.changes)).subscribe(()=>this._setContainerClass(t.opened))}_watchDrawerPosition(t){t.onPositionChanged.pipe(H(this._drawers.changes)).subscribe(()=>{pt({read:()=>this._validateDrawers()},{injector:this._injector})})}_watchDrawerMode(t){t._modeChanged.pipe(H(Lt(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_setContainerClass(t){let e=this._element.nativeElement.classList,i="mat-drawer-container-has-open";t?e.add(i):e.remove(i)}_validateDrawers(){this._start=this._end=null,this._drawers.forEach(t=>{t.position=="end"?(this._end!=null,this._end=t):(this._start!=null,this._start=t)}),this._right=this._left=null,this._dir&&this._dir.value==="rtl"?(this._left=this._end,this._right=this._start):(this._left=this._start,this._right=this._end)}_isPushed(){return this._isDrawerOpen(this._start)&&this._start.mode!="over"||this._isDrawerOpen(this._end)&&this._end.mode!="over"}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_closeModalDrawersViaBackdrop(){[this._start,this._end].filter(t=>t&&!t.disableClose&&this._drawerHasBackdrop(t)).forEach(t=>t._closeViaBackdropClick())}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._drawerHasBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._drawerHasBackdrop(this._end)}_isDrawerOpen(t){return t!=null&&t.opened}_drawerHasBackdrop(t){return this._backdropOverride==null?!!t&&t.mode!=="side":this._backdropOverride}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["mat-drawer-container"]],contentQueries:function(e,i,o){if(e&1&&K(o,Yt,5)(o,be,5),e&2){let l;x(l=y())&&(i._content=l.first),x(l=y())&&(i._allDrawers=l)}},viewQuery:function(e,i){if(e&1&&U(Yt,5),e&2){let o;x(o=y())&&(i._userContent=o.first)}},hostAttrs:[1,"mat-drawer-container"],hostVars:2,hostBindings:function(e,i){e&2&&f("mat-drawer-container-explicit-backdrop",i._backdropOverride)},inputs:{autosize:"autosize",hasBackdrop:"hasBackdrop"},outputs:{backdropClick:"backdropClick"},exportAs:["matDrawerContainer"],features:[W([{provide:xe,useExisting:n}])],ngContentSelectors:cn,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(e,i){e&1&&(V(ln),_(0,dn,1,2,"div",0),v(1),v(2,1),_(3,mn,2,0,"mat-drawer-content")),e&2&&(g(i.hasBackdrop?0:-1),d(3),g(i._content?-1:3))},dependencies:[Yt],styles:[`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));
  background-color: var(--mat-sidenav-content-background-color, var(--mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));
  box-shadow: var(--mat-sidenav-container-elevation-shadow, none);
  background-color: var(--mat-sidenav-container-background-color, var(--mat-sys-surface));
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  width: var(--mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`],encapsulation:2,changeDetection:0})}return n})(),Jt=(()=>{class n extends Yt{static \u0275fac=(()=>{let t;return function(i){return(t||(t=G(n)))(i||n)}})();static \u0275cmp=u({type:n,selectors:[["mat-sidenav-content"]],hostAttrs:[1,"mat-drawer-content","mat-sidenav-content"],features:[W([{provide:kt,useExisting:n}]),j],ngContentSelectors:te,decls:1,vars:0,template:function(e,i){e&1&&(V(),v(0))},encapsulation:2,changeDetection:0})}return n})(),ye=(()=>{class n extends be{get fixedInViewport(){return this._fixedInViewport}set fixedInViewport(t){this._fixedInViewport=S(t)}_fixedInViewport=!1;get fixedTopGap(){return this._fixedTopGap}set fixedTopGap(t){this._fixedTopGap=bt(t)}_fixedTopGap=0;get fixedBottomGap(){return this._fixedBottomGap}set fixedBottomGap(t){this._fixedBottomGap=bt(t)}_fixedBottomGap=0;static \u0275fac=(()=>{let t;return function(i){return(t||(t=G(n)))(i||n)}})();static \u0275cmp=u({type:n,selectors:[["mat-sidenav"]],hostAttrs:[1,"mat-drawer","mat-sidenav"],hostVars:16,hostBindings:function(e,i){e&2&&(q("tabIndex",i.mode!=="side"?"-1":null)("align",null),it("top",i.fixedInViewport?i.fixedTopGap:null,"px")("bottom",i.fixedInViewport?i.fixedBottomGap:null,"px"),f("mat-drawer-end",i.position==="end")("mat-drawer-over",i.mode==="over")("mat-drawer-push",i.mode==="push")("mat-drawer-side",i.mode==="side")("mat-sidenav-fixed",i.fixedInViewport))},inputs:{fixedInViewport:"fixedInViewport",fixedTopGap:"fixedTopGap",fixedBottomGap:"fixedBottomGap"},exportAs:["matSidenav"],features:[W([{provide:be,useExisting:n}]),j],ngContentSelectors:te,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(e,i){e&1&&(V(),s(0,"div",1,0),v(2),c())},dependencies:[kt],encapsulation:2,changeDetection:0})}return n})(),Fi=(()=>{class n extends ve{_allDrawers=void 0;_content=void 0;static \u0275fac=(()=>{let t;return function(i){return(t||(t=G(n)))(i||n)}})();static \u0275cmp=u({type:n,selectors:[["mat-sidenav-container"]],contentQueries:function(e,i,o){if(e&1&&K(o,Jt,5)(o,ye,5),e&2){let l;x(l=y())&&(i._content=l.first),x(l=y())&&(i._allDrawers=l)}},hostAttrs:[1,"mat-drawer-container","mat-sidenav-container"],hostVars:2,hostBindings:function(e,i){e&2&&f("mat-drawer-container-explicit-backdrop",i._backdropOverride)},exportAs:["matSidenavContainer"],features:[W([{provide:xe,useExisting:n},{provide:ve,useExisting:n}]),j],ngContentSelectors:hn,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(e,i){e&1&&(V(pn),_(0,un,1,2,"div",0),v(1),v(2,1),_(3,_n,2,0,"mat-sidenav-content")),e&2&&(g(i.hasBackdrop?0:-1),d(3),g(i._content?-1:3))},dependencies:[Jt],styles:[gn],encapsulation:2,changeDetection:0})}return n})(),Ri=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({imports:[ue,I,ue]})}return n})();var vn=["*",[["mat-toolbar-row"]]],xn=["*","mat-toolbar-row"],yn=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]})}return n})(),Li=(()=>{class n{_elementRef=r(P);_platform=r(B);_document=r(Z);color;_toolbarRows;constructor(){}ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["mat-toolbar"]],contentQueries:function(e,i,o){if(e&1&&K(o,yn,5),e&2){let l;x(l=y())&&(i._toolbarRows=l)}},hostAttrs:[1,"mat-toolbar"],hostVars:6,hostBindings:function(e,i){e&2&&(Ze(i.color?"mat-"+i.color:""),f("mat-toolbar-multiple-rows",i._toolbarRows.length>0)("mat-toolbar-single-row",i._toolbarRows.length===0))},inputs:{color:"color"},exportAs:["matToolbar"],ngContentSelectors:xn,decls:2,vars:0,template:function(e,i){e&1&&(V(vn),v(0),v(1,1))},styles:[`.mat-toolbar {
  background: var(--mat-toolbar-container-background-color, var(--mat-sys-surface));
  color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}
.mat-toolbar, .mat-toolbar h1, .mat-toolbar h2, .mat-toolbar h3, .mat-toolbar h4, .mat-toolbar h5, .mat-toolbar h6 {
  font-family: var(--mat-toolbar-title-text-font, var(--mat-sys-title-large-font));
  font-size: var(--mat-toolbar-title-text-size, var(--mat-sys-title-large-size));
  line-height: var(--mat-toolbar-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-weight: var(--mat-toolbar-title-text-weight, var(--mat-sys-title-large-weight));
  letter-spacing: var(--mat-toolbar-title-text-tracking, var(--mat-sys-title-large-tracking));
  margin: 0;
}
@media (forced-colors: active) {
  .mat-toolbar {
    outline: solid 1px;
  }
}
.mat-toolbar .mat-form-field-underline,
.mat-toolbar .mat-form-field-ripple,
.mat-toolbar .mat-focused .mat-form-field-ripple {
  background-color: currentColor;
}
.mat-toolbar .mat-form-field-label,
.mat-toolbar .mat-focused .mat-form-field-label,
.mat-toolbar .mat-select-value,
.mat-toolbar .mat-select-arrow,
.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow {
  color: inherit;
}
.mat-toolbar .mat-input-element {
  caret-color: currentColor;
}
.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed {
  --mat-button-text-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
  --mat-button-outlined-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}

.mat-toolbar-row, .mat-toolbar-single-row {
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-row, .mat-toolbar-single-row {
    height: var(--mat-toolbar-mobile-height, 56px);
  }
}

.mat-toolbar-multiple-rows {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  min-height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-multiple-rows {
    min-height: var(--mat-toolbar-mobile-height, 56px);
  }
}
`],encapsulation:2,changeDetection:0})}return n})();var Bi=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({imports:[I]})}return n})();var kn=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["ng-component"]],hostAttrs:["cdk-text-field-style-loader",""],decls:0,vars:0,template:function(e,i){},styles:[`textarea.cdk-textarea-autosize {
  resize: none;
}

textarea.cdk-textarea-autosize-measuring {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: auto !important;
  overflow: hidden !important;
}

textarea.cdk-textarea-autosize-measuring-firefox {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: 0 !important;
}

@keyframes cdk-text-field-autofill-start { /*!*/ }
@keyframes cdk-text-field-autofill-end { /*!*/ }
.cdk-text-field-autofill-monitored:-webkit-autofill {
  animation: cdk-text-field-autofill-start 0s 1ms;
}

.cdk-text-field-autofill-monitored:not(:-webkit-autofill) {
  animation: cdk-text-field-autofill-end 0s 1ms;
}
`],encapsulation:2,changeDetection:0})}return n})(),Cn={passive:!0},zi=(()=>{class n{_platform=r(B);_ngZone=r(F);_renderer=r(Bt).createRenderer(null,null);_styleLoader=r(Nt);_monitoredElements=new Map;constructor(){}monitor(t){if(!this._platform.isBrowser)return Te;this._styleLoader.load(kn);let e=pe(t),i=this._monitoredElements.get(e);if(i)return i.subject;let o=new w,l="cdk-text-field-autofilled",D=st=>{st.animationName==="cdk-text-field-autofill-start"&&!e.classList.contains(l)?(e.classList.add(l),this._ngZone.run(()=>o.next({target:st.target,isAutofilled:!0}))):st.animationName==="cdk-text-field-autofill-end"&&e.classList.contains(l)&&(e.classList.remove(l),this._ngZone.run(()=>o.next({target:st.target,isAutofilled:!1})))},et=this._ngZone.runOutsideAngular(()=>(e.classList.add("cdk-text-field-autofill-monitored"),this._renderer.listen(e,"animationstart",D,Cn)));return this._monitoredElements.set(e,{subject:o,unlisten:et}),o}stopMonitoring(t){let e=pe(t),i=this._monitoredElements.get(e);i&&(i.unlisten(),i.subject.complete(),e.classList.remove("cdk-text-field-autofill-monitored"),e.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(e))}ngOnDestroy(){this._monitoredElements.forEach((t,e)=>this.stopMonitoring(e))}static \u0275fac=function(e){return new(e||n)};static \u0275prov=ct({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var Ni=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({})}return n})();var ji=new T("MAT_INPUT_VALUE_ACCESSOR");var rt=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({imports:[jt,ot,I]})}return n})();var An=["button","checkbox","file","hidden","image","radio","range","reset","submit"],Sn=new T("MAT_INPUT_CONFIG"),ee=(()=>{class n{_elementRef=r(P);_platform=r(B);ngControl=r(_i,{optional:!0,self:!0});_autofillMonitor=r(zi);_ngZone=r(F);_formField=r(wi,{optional:!0});_renderer=r(ht);_uid=r(Vt).getId("mat-input-");_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=r(Sn,{optional:!0});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=!1;_isNativeSelect=!1;_isTextarea=!1;_isInFormField=!1;focused=!1;stateChanges=new w;controlType="mat-input";autofilled=!1;get disabled(){return this._disabled}set disabled(t){this._disabled=S(t),this.focused&&(this.focused=!1,this.stateChanges.next())}_disabled=!1;get id(){return this._id}set id(t){this._id=t||this._uid}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(ui.required)??!1}set required(t){this._required=S(t)}_required;get type(){return this._type}set type(t){this._type=t||"text",this._validateType(),!this._isTextarea&&he().has(this._type)&&(this._elementRef.nativeElement.type=this._type)}_type="text";get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(t){this._errorStateTracker.matcher=t}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(t){t!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(t):this._inputValueAccessor.value=t,this.stateChanges.next())}get readonly(){return this._readonly}set readonly(t){this._readonly=S(t)}_readonly=!1;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(t){this._errorStateTracker.errorState=t}_neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(t=>he().has(t));constructor(){let t=r(Qt,{optional:!0}),e=r(bi,{optional:!0}),i=r(vi),o=r(ji,{optional:!0,self:!0}),l=this._elementRef.nativeElement,D=l.nodeName.toLowerCase();o?We(o.value)?this._signalBasedValueAccessor=o:this._inputValueAccessor=o:this._inputValueAccessor=l,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(l,"keyup",this._iOSKeyupListener)}),this._errorStateTracker=new xi(i,this.ngControl,e,t,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=D==="select",this._isTextarea=D==="textarea",this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||!1,this._isNativeSelect&&(this.controlType=l.multiple?"mat-native-select-multiple":"mat-native-select"),this._signalBasedValueAccessor&&mt(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next()})}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(t=>{this.autofilled=t.isAutofilled,this.stateChanges.next()})}ngOnChanges(){this.stateChanges.next()}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.()}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder()}focus(t){this._elementRef.nativeElement.focus(t)}updateErrorState(){this._errorStateTracker.updateErrorState()}_focusChanged(t){if(t!==this.focused){if(!this._isNativeSelect&&t&&this.disabled&&this.disabledInteractive){let e=this._elementRef.nativeElement;e.type==="number"?(e.type="text",e.setSelectionRange(0,0),e.type="number"):e.setSelectionRange(0,0)}this.focused=t,this.stateChanges.next()}}_onInput(){}_dirtyCheckNativeValue(){let t=this._elementRef.nativeElement.value;this._previousNativeValue!==t&&(this._previousNativeValue=t,this.stateChanges.next())}_dirtyCheckPlaceholder(){let t=this._getPlaceholder();if(t!==this._previousPlaceholder){let e=this._elementRef.nativeElement;this._previousPlaceholder=t,t?e.setAttribute("placeholder",t):e.removeAttribute("placeholder")}}_getPlaceholder(){return this.placeholder||null}_validateType(){An.indexOf(this._type)>-1}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let t=this._elementRef.nativeElement.validity;return t&&t.badInput}get empty(){return!this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let t=this._elementRef.nativeElement,e=t.options[0];return this.focused||t.multiple||!this.empty||!!(t.selectedIndex>-1&&e&&e.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(t){let e=this._elementRef.nativeElement;t.length?e.setAttribute("aria-describedby",t.join(" ")):e.removeAttribute("aria-describedby")}onContainerClick(){this.focused||this.focus()}_isInlineSelect(){let t=this._elementRef.nativeElement;return this._isNativeSelect&&(t.multiple||t.size>1)}_iOSKeyupListener=t=>{let e=t.target;!e.value&&e.selectionStart===0&&e.selectionEnd===0&&(e.setSelectionRange(1,1),e.setSelectionRange(0,0))};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?"true":null}static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:21,hostBindings:function(e,i){e&1&&h("focus",function(){return i._focusChanged(!0)})("blur",function(){return i._focusChanged(!1)})("input",function(){return i._onInput()}),e&2&&(Ue("id",i.id)("disabled",i.disabled&&!i.disabledInteractive)("required",i.required),q("name",i.name||null)("readonly",i._getReadonlyAttribute())("aria-disabled",i.disabled&&i.disabledInteractive?"true":null)("aria-invalid",i.empty&&i.required?null:i.errorState)("aria-required",i.required)("id",i.id),f("mat-input-server",i._isServer)("mat-mdc-form-field-textarea-control",i._isInFormField&&i._isTextarea)("mat-mdc-form-field-input-control",i._isInFormField)("mat-mdc-input-disabled-interactive",i.disabledInteractive)("mdc-text-field__input",i._isInFormField)("mat-mdc-native-select-inline",i._isInlineSelect()))},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly",disabledInteractive:[2,"disabledInteractive","disabledInteractive",me]},exportAs:["matInput"],features:[W([{provide:yi,useExisting:n}]),It]})}return n})(),ie=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({imports:[rt,rt,Ni,I]})}return n})();function In(n,a){if(n&1){let t=O();s(0,"div",1)(1,"button",2),h("click",function(){E(t);let i=p();return A(i.action())}),m(2),c()()}if(n&2){let t=p();d(2),Ot(" ",t.data.action," ")}}var Tn=["label"];function Pn(n,a){}var On=Math.pow(2,31)-1,Ft=class{_overlayRef;instance;containerInstance;_afterDismissed=new w;_afterOpened=new w;_onAction=new w;_durationTimeoutId;_dismissedByAction=!1;constructor(a,t){this._overlayRef=t,this.containerInstance=a,a._onExit.subscribe(()=>this._finishDismiss())}dismiss(){this._afterDismissed.closed||this.containerInstance.exit(),clearTimeout(this._durationTimeoutId)}dismissWithAction(){this._onAction.closed||(this._dismissedByAction=!0,this._onAction.next(),this._onAction.complete(),this.dismiss()),clearTimeout(this._durationTimeoutId)}closeWithAction(){this.dismissWithAction()}_dismissAfter(a){this._durationTimeoutId=setTimeout(()=>this.dismiss(),Math.min(a,On))}_open(){this._afterOpened.closed||(this._afterOpened.next(),this._afterOpened.complete())}_finishDismiss(){this._overlayRef.dispose(),this._onAction.closed||this._onAction.complete(),this._afterDismissed.next({dismissedByAction:this._dismissedByAction}),this._afterDismissed.complete(),this._dismissedByAction=!1}afterDismissed(){return this._afterDismissed}afterOpened(){return this.containerInstance._onEnter}onAction(){return this._onAction}},Hi=new T("MatSnackBarData"),At=class{politeness="polite";announcementMessage="";viewContainerRef;duration=0;panelClass;direction;data=null;horizontalPosition="center";verticalPosition="bottom"},Fn=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,selectors:[["","matSnackBarLabel",""]],hostAttrs:[1,"mat-mdc-snack-bar-label","mdc-snackbar__label"]})}return n})(),Rn=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,selectors:[["","matSnackBarActions",""]],hostAttrs:[1,"mat-mdc-snack-bar-actions","mdc-snackbar__actions"]})}return n})(),Ln=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,selectors:[["","matSnackBarAction",""]],hostAttrs:[1,"mat-mdc-snack-bar-action","mdc-snackbar__action"]})}return n})(),Qi=(()=>{class n{snackBarRef=r(Ft);data=r(Hi);constructor(){}action(){this.snackBarRef.dismissWithAction()}get hasAction(){return!!this.data.action}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["simple-snack-bar"]],hostAttrs:[1,"mat-mdc-simple-snack-bar"],exportAs:["matSnackBar"],decls:3,vars:2,consts:[["matSnackBarLabel",""],["matSnackBarActions",""],["matButton","","matSnackBarAction","",3,"click"]],template:function(e,i){e&1&&(s(0,"div",0),m(1),c(),_(2,In,3,1,"div",1)),e&2&&(d(),Ot(" ",i.data.message,`
`),d(),g(i.hasAction?2:-1))},dependencies:[X,Fn,Rn,Ln],styles:[`.mat-mdc-simple-snack-bar {
  display: flex;
}
.mat-mdc-simple-snack-bar .mat-mdc-snack-bar-label {
  max-height: 50vh;
  overflow: auto;
}
`],encapsulation:2,changeDetection:0})}return n})(),we="_mat-snack-bar-enter",ke="_mat-snack-bar-exit",Bn=(()=>{class n extends Mi{_ngZone=r(F);_elementRef=r(P);_changeDetectorRef=r(nt);_platform=r(B);_animationsDisabled=at();snackBarConfig=r(At);_document=r(Z);_trackedModals=new Set;_enterFallback;_exitFallback;_injector=r(Q);_announceDelay=150;_announceTimeoutId;_destroyed=!1;_portalOutlet;_onAnnounce=new w;_onExit=new w;_onEnter=new w;_animationState="void";_live;_label;_role;_liveElementId=r(Vt).getId("mat-snack-bar-container-live-");constructor(){super();let t=this.snackBarConfig;t.politeness==="assertive"&&!t.announcementMessage?this._live="assertive":t.politeness==="off"?this._live="off":this._live="polite",this._platform.FIREFOX&&(this._live==="polite"&&(this._role="status"),this._live==="assertive"&&(this._role="alert"))}attachComponentPortal(t){this._assertNotAttached();let e=this._portalOutlet.attachComponentPortal(t);return this._afterPortalAttached(),e}attachTemplatePortal(t){this._assertNotAttached();let e=this._portalOutlet.attachTemplatePortal(t);return this._afterPortalAttached(),e}attachDomPortal=t=>{this._assertNotAttached();let e=this._portalOutlet.attachDomPortal(t);return this._afterPortalAttached(),e};onAnimationEnd(t){t===ke?this._completeExit():t===we&&(clearTimeout(this._enterFallback),this._ngZone.run(()=>{this._onEnter.next(),this._onEnter.complete()}))}enter(){this._destroyed||(this._animationState="visible",this._changeDetectorRef.markForCheck(),this._changeDetectorRef.detectChanges(),this._screenReaderAnnounce(),this._animationsDisabled?pt(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(we)))},{injector:this._injector}):(clearTimeout(this._enterFallback),this._enterFallback=setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-snack-bar-fallback-visible"),this.onAnimationEnd(we)},200)))}exit(){return this._destroyed?Pe(void 0):(this._ngZone.run(()=>{this._animationState="hidden",this._changeDetectorRef.markForCheck(),this._elementRef.nativeElement.setAttribute("mat-exit",""),clearTimeout(this._announceTimeoutId),this._animationsDisabled?pt(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(ke)))},{injector:this._injector}):(clearTimeout(this._exitFallback),this._exitFallback=setTimeout(()=>this.onAnimationEnd(ke),200))}),this._onExit)}ngOnDestroy(){this._destroyed=!0,this._clearFromModals(),this._completeExit()}_completeExit(){clearTimeout(this._exitFallback),queueMicrotask(()=>{this._onExit.next(),this._onExit.complete()})}_afterPortalAttached(){let t=this._elementRef.nativeElement,e=this.snackBarConfig.panelClass;e&&(Array.isArray(e)?e.forEach(l=>t.classList.add(l)):t.classList.add(e)),this._exposeToModals();let i=this._label.nativeElement,o="mdc-snackbar__label";i.classList.toggle(o,!i.querySelector(`.${o}`))}_exposeToModals(){let t=this._liveElementId,e=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let i=0;i<e.length;i++){let o=e[i],l=o.getAttribute("aria-owns");this._trackedModals.add(o),l?l.indexOf(t)===-1&&o.setAttribute("aria-owns",l+" "+t):o.setAttribute("aria-owns",t)}}_clearFromModals(){this._trackedModals.forEach(t=>{let e=t.getAttribute("aria-owns");if(e){let i=e.replace(this._liveElementId,"").trim();i.length>0?t.setAttribute("aria-owns",i):t.removeAttribute("aria-owns")}}),this._trackedModals.clear()}_assertNotAttached(){this._portalOutlet.hasAttached()}_screenReaderAnnounce(){this._announceTimeoutId||this._ngZone.runOutsideAngular(()=>{this._announceTimeoutId=setTimeout(()=>{if(this._destroyed)return;let t=this._elementRef.nativeElement,e=t.querySelector("[aria-hidden]"),i=t.querySelector("[aria-live]");if(e&&i){let o=null;this._platform.isBrowser&&document.activeElement instanceof HTMLElement&&e.contains(document.activeElement)&&(o=document.activeElement),e.removeAttribute("aria-hidden"),i.appendChild(e),o?.focus(),this._onAnnounce.next(),this._onAnnounce.complete()}},this._announceDelay)})}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["mat-snack-bar-container"]],viewQuery:function(e,i){if(e&1&&U(Zt,7)(Tn,7),e&2){let o;x(o=y())&&(i._portalOutlet=o.first),x(o=y())&&(i._label=o.first)}},hostAttrs:[1,"mdc-snackbar","mat-mdc-snack-bar-container"],hostVars:6,hostBindings:function(e,i){e&1&&h("animationend",function(l){return i.onAnimationEnd(l.animationName)})("animationcancel",function(l){return i.onAnimationEnd(l.animationName)}),e&2&&f("mat-snack-bar-container-enter",i._animationState==="visible")("mat-snack-bar-container-exit",i._animationState==="hidden")("mat-snack-bar-container-animations-enabled",!i._animationsDisabled)},features:[j],decls:6,vars:3,consts:[["label",""],[1,"mdc-snackbar__surface","mat-mdc-snackbar-surface"],[1,"mat-mdc-snack-bar-label"],["aria-hidden","true"],["cdkPortalOutlet",""]],template:function(e,i){e&1&&(s(0,"div",1)(1,"div",2,0)(3,"div",3),zt(4,Pn,0,0,"ng-template",4),c(),b(5,"div"),c()()),e&2&&(d(5),q("aria-live",i._live)("role",i._role)("id",i._liveElementId))},dependencies:[Zt],styles:[`@keyframes _mat-snack-bar-enter {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes _mat-snack-bar-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-snack-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 8px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snack-bar-container {
  width: 100vw;
}

.mat-snack-bar-container-animations-enabled {
  opacity: 0;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-fallback-visible {
  opacity: 1;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-enter {
  animation: _mat-snack-bar-enter 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-exit {
  animation: _mat-snack-bar-exit 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

.mat-mdc-snackbar-surface {
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 8px;
}
[dir=rtl] .mat-mdc-snackbar-surface {
  padding-right: 0;
  padding-left: 8px;
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  min-width: 344px;
  max-width: 672px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snackbar-surface {
  width: 100%;
  min-width: 0;
}
@media (forced-colors: active) {
  .mat-mdc-snackbar-surface {
    outline: solid 1px;
  }
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  color: var(--mat-snack-bar-supporting-text-color, var(--mat-sys-inverse-on-surface));
  border-radius: var(--mat-snack-bar-container-shape, var(--mat-sys-corner-extra-small));
  background-color: var(--mat-snack-bar-container-color, var(--mat-sys-inverse-surface));
}

.mdc-snackbar__label {
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  padding: 14px 8px 14px 16px;
}
[dir=rtl] .mdc-snackbar__label {
  padding-left: 8px;
  padding-right: 16px;
}
.mat-mdc-snack-bar-container .mdc-snackbar__label {
  font-family: var(--mat-snack-bar-supporting-text-font, var(--mat-sys-body-medium-font));
  font-size: var(--mat-snack-bar-supporting-text-size, var(--mat-sys-body-medium-size));
  font-weight: var(--mat-snack-bar-supporting-text-weight, var(--mat-sys-body-medium-weight));
  line-height: var(--mat-snack-bar-supporting-text-line-height, var(--mat-sys-body-medium-line-height));
}

.mat-mdc-snack-bar-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  box-sizing: border-box;
}

.mat-mdc-snack-bar-handset,
.mat-mdc-snack-bar-container,
.mat-mdc-snack-bar-label {
  flex: 1 1 auto;
}

.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled).mat-unthemed {
  color: var(--mat-snack-bar-button-color, var(--mat-sys-inverse-primary));
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) {
  --mat-button-text-state-layer-color: currentColor;
  --mat-button-text-ripple-color: currentColor;
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element {
  opacity: 0.1;
}
`],encapsulation:2})}return n})(),zn=new T("mat-snack-bar-default-options",{providedIn:"root",factory:()=>new At}),Rt=(()=>{class n{_live=r(ri);_injector=r(Q);_breakpointObserver=r(ii);_parentSnackBar=r(n,{optional:!0,skipSelf:!0});_defaultConfig=r(zn);_animationsDisabled=at();_snackBarRefAtThisLevel=null;simpleSnackBarComponent=Qi;snackBarContainerComponent=Bn;handsetCssClass="mat-mdc-snack-bar-handset";get _openedSnackBarRef(){let t=this._parentSnackBar;return t?t._openedSnackBarRef:this._snackBarRefAtThisLevel}set _openedSnackBarRef(t){this._parentSnackBar?this._parentSnackBar._openedSnackBarRef=t:this._snackBarRefAtThisLevel=t}constructor(){}openFromComponent(t,e){return this._attach(t,e)}openFromTemplate(t,e){return this._attach(t,e)}open(t,e="",i){let o=lt(lt({},this._defaultConfig),i);return o.data={message:t,action:e},o.announcementMessage===t&&(o.announcementMessage=void 0),this.openFromComponent(this.simpleSnackBarComponent,o)}dismiss(){this._openedSnackBarRef&&this._openedSnackBarRef.dismiss()}ngOnDestroy(){this._snackBarRefAtThisLevel&&this._snackBarRefAtThisLevel.dismiss()}_attachSnackBarContainer(t,e){let i=e&&e.viewContainerRef&&e.viewContainerRef.injector,o=Q.create({parent:i||this._injector,providers:[{provide:At,useValue:e}]}),l=new _e(this.snackBarContainerComponent,e.viewContainerRef,o),D=t.attach(l);return D.instance.snackBarConfig=e,D.instance}_attach(t,e){let i=lt(lt(lt({},new At),this._defaultConfig),e),o=this._createOverlay(i),l=this._attachSnackBarContainer(o,i),D=new Ft(l,o);if(t instanceof Qe){let et=new ge(t,null,{$implicit:i.data,snackBarRef:D});D.instance=l.attachTemplatePortal(et)}else{let et=this._createInjector(i,D),st=new _e(t,void 0,et),en=l.attachComponentPortal(st);D.instance=en.instance}return this._breakpointObserver.observe(li.HandsetPortrait).pipe(H(o.detachments())).subscribe(et=>{o.overlayElement.classList.toggle(this.handsetCssClass,et.matches)}),i.announcementMessage&&l._onAnnounce.subscribe(()=>{this._live.announce(i.announcementMessage,i.politeness)}),this._animateSnackBar(D,i),this._openedSnackBarRef=D,this._openedSnackBarRef}_animateSnackBar(t,e){t.afterDismissed().subscribe(()=>{this._openedSnackBarRef==t&&(this._openedSnackBarRef=null),e.announcementMessage&&this._live.clear()}),e.duration&&e.duration>0&&t.afterOpened().subscribe(()=>t._dismissAfter(e.duration)),this._openedSnackBarRef?(this._openedSnackBarRef.afterDismissed().subscribe(()=>{t.containerInstance.enter()}),this._openedSnackBarRef.dismiss()):t.containerInstance.enter()}_createOverlay(t){let e=new Di;e.direction=t.direction;let i=Ei(this._injector),o=t.direction==="rtl",l=t.horizontalPosition==="left"||t.horizontalPosition==="start"&&!o||t.horizontalPosition==="end"&&o,D=!l&&t.horizontalPosition!=="center";return l?i.left("0"):D?i.right("0"):i.centerHorizontally(),t.verticalPosition==="top"?i.top("0"):i.bottom("0"),e.positionStrategy=i,e.disableAnimations=this._animationsDisabled,Ai(this._injector,e)}_createInjector(t,e){let i=t&&t.viewContainerRef&&t.viewContainerRef.injector;return Q.create({parent:i||this._injector,providers:[{provide:Ft,useValue:e},{provide:Hi,useValue:t.data}]})}static \u0275fac=function(e){return new(e||n)};static \u0275prov=ct({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var qi=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({providers:[Rt],imports:[Si,Kt,$,Qi,I]})}return n})();var Wi=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({imports:[I]})}return n})();var jn=["*"],Vn=`.mdc-list {
  margin: 0;
  padding: 8px 0;
  list-style-type: none;
}
.mdc-list:focus {
  outline: none;
}

.mdc-list-item {
  display: flex;
  position: relative;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  align-items: stretch;
  cursor: pointer;
  padding-left: 16px;
  padding-right: 16px;
  background-color: var(--mat-list-list-item-container-color, transparent);
  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));
}
.mdc-list-item.mdc-list-item--selected {
  background-color: var(--mat-list-list-item-selected-container-color);
}
.mdc-list-item:focus {
  outline: 0;
}
.mdc-list-item.mdc-list-item--disabled {
  cursor: auto;
}
.mdc-list-item.mdc-list-item--with-one-line {
  height: var(--mat-list-list-item-one-line-container-height, 48px);
}
.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-two-lines {
  height: var(--mat-list-list-item-two-line-container-height, 64px);
}
.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-three-lines {
  height: var(--mat-list-list-item-three-line-container-height, 88px);
}
.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  content: "";
  pointer-events: none;
}

a.mdc-list-item {
  color: inherit;
  text-decoration: none;
}

.mdc-list-item__start {
  fill: currentColor;
  flex-shrink: 0;
  pointer-events: none;
}
.mdc-list-item--with-leading-icon .mdc-list-item__start {
  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));
  width: var(--mat-list-list-item-leading-icon-size, 24px);
  height: var(--mat-list-list-item-leading-icon-size, 24px);
  margin-left: 16px;
  margin-right: 32px;
}
[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {
  margin-left: 32px;
  margin-right: 16px;
}
.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {
  color: var(--mat-list-list-item-hover-leading-icon-color);
}
.mdc-list-item--with-leading-avatar .mdc-list-item__start {
  width: var(--mat-list-list-item-leading-avatar-size, 40px);
  height: var(--mat-list-list-item-leading-avatar-size, 40px);
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 50%;
}
.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 50%;
}

.mdc-list-item__end {
  flex-shrink: 0;
  pointer-events: none;
}
.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));
  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));
  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));
  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));
  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));
}
.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));
  width: var(--mat-list-list-item-trailing-icon-size, 24px);
  height: var(--mat-list-list-item-trailing-icon-size, 24px);
}
.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {
  color: var(--mat-list-list-item-hover-trailing-icon-color);
}
.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));
}

.mdc-list-item__content {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-self: center;
  flex: 1;
  pointer-events: none;
}
.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {
  align-self: stretch;
}

.mdc-list-item__primary-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));
}
.mdc-list-item:hover .mdc-list-item__primary-text {
  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));
}
.mdc-list-item:focus .mdc-list-item__primary-text {
  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {
  display: block;
  margin-top: 0;
  line-height: normal;
  margin-bottom: -20px;
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {
  display: inline-block;
  width: 0;
  height: 28px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: -20px;
}

.mdc-list-item__secondary-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  margin-top: 0;
  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));
  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));
  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));
  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));
  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));
  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));
}
.mdc-list-item__secondary-text::before {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {
  white-space: normal;
  line-height: 20px;
}
.mdc-list-item--with-overline .mdc-list-item__secondary-text {
  white-space: nowrap;
  line-height: auto;
}

.mdc-list-item--with-leading-radio.mdc-list-item,
.mdc-list-item--with-leading-checkbox.mdc-list-item,
.mdc-list-item--with-leading-icon.mdc-list-item,
.mdc-list-item--with-leading-avatar.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {
  display: block;
  margin-top: 0;
  line-height: normal;
  margin-bottom: -20px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {
  display: inline-block;
  width: 0;
  height: 32px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: -20px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  display: block;
  margin-top: 0;
  line-height: normal;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {
  display: inline-block;
  width: 0;
  height: 32px;
  content: "";
  vertical-align: 0;
}

.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {
  padding-left: 0;
  padding-right: 0;
}
.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  margin-left: 16px;
  margin-right: 16px;
}

.mdc-list-item--with-trailing-meta.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  -webkit-user-select: none;
  user-select: none;
  margin-left: 28px;
  margin-right: 16px;
}
[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {
  margin-left: 16px;
  margin-right: 28px;
}
.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {
  display: block;
  line-height: normal;
  align-self: flex-start;
  margin-top: 0;
}
.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {
  display: inline-block;
  width: 0;
  height: 28px;
  content: "";
  vertical-align: 0;
}

.mdc-list-item--with-leading-radio .mdc-list-item__start,
.mdc-list-item--with-leading-checkbox .mdc-list-item__start {
  margin-left: 8px;
  margin-right: 24px;
}
[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,
[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {
  margin-left: 24px;
  margin-right: 8px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 8px;
}

.mdc-list-item--with-trailing-radio.mdc-list-item,
.mdc-list-item--with-trailing-checkbox.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {
  padding-left: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {
  padding-right: 0;
}
.mdc-list-item--with-trailing-radio .mdc-list-item__end,
.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {
  margin-left: 24px;
  margin-right: 8px;
}
[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,
[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {
  margin-left: 8px;
  margin-right: 24px;
}
.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {
  align-self: flex-start;
  margin-top: 8px;
}

.mdc-list-group__subheader {
  margin: 0.75rem 16px;
}

.mdc-list-item--disabled .mdc-list-item__start,
.mdc-list-item--disabled .mdc-list-item__content,
.mdc-list-item--disabled .mdc-list-item__end {
  opacity: 1;
}
.mdc-list-item--disabled .mdc-list-item__primary-text,
.mdc-list-item--disabled .mdc-list-item__secondary-text {
  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);
}
.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {
  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));
  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);
}
.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));
  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);
}

.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {
  padding-left: 0;
  padding-right: 0;
}

.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {
  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));
}

.mdc-list-item:hover::before {
  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));
  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}

.mdc-list-item.mdc-list-item--disabled::before {
  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));
  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}

.mdc-list-item:focus::before {
  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));
  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}

.mdc-list-item--disabled .mdc-radio,
.mdc-list-item--disabled .mdc-checkbox {
  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);
}

.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {
  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));
  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));
}

.mat-mdc-list-item-icon {
  font-size: var(--mat-list-list-item-leading-icon-size, 24px);
}

@media (forced-colors: active) {
  a.mdc-list-item--activated::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  a.mdc-list-item--activated [dir=rtl]::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-list-base {
  display: block;
}
.mat-mdc-list-base .mdc-list-item__start,
.mat-mdc-list-base .mdc-list-item__end,
.mat-mdc-list-base .mdc-list-item__content {
  pointer-events: auto;
}

.mat-mdc-list-item,
.mat-mdc-list-option {
  width: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),
.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {
  cursor: default;
}
.mat-mdc-list-item .mat-divider-inset,
.mat-mdc-list-option .mat-divider-inset {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,
.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {
  margin-left: 72px;
}
[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,
[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {
  margin-right: 72px;
}

.mat-mdc-list-item-interactive::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  content: "";
  opacity: 0;
  pointer-events: none;
  border-radius: inherit;
}

.mat-mdc-list-item > .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {
  content: "";
}

.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {
  white-space: nowrap;
  line-height: normal;
}
.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

mat-action-list button {
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  outline: inherit;
  -webkit-tap-highlight-color: transparent;
  text-align: start;
}
mat-action-list button::-moz-focus-inner {
  border: 0;
}

.mdc-list-item--with-leading-icon .mdc-list-item__start {
  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);
  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);
}

.mat-mdc-nav-list .mat-mdc-list-item {
  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));
  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));
}
.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {
  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));
}
`,Hn=["unscopedContent"],Qn=["text"],qn=[[["","matListItemAvatar",""],["","matListItemIcon",""]],[["","matListItemTitle",""]],[["","matListItemLine",""]],"*",[["","matListItemMeta",""]],[["mat-divider"]]],Wn=["[matListItemAvatar],[matListItemIcon]","[matListItemTitle]","[matListItemLine]","*","[matListItemMeta]","mat-divider"];var Gn=new T("ListOption"),Me=(()=>{class n{_elementRef=r(P);constructor(){}static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,selectors:[["","matListItemTitle",""]],hostAttrs:[1,"mat-mdc-list-item-title","mdc-list-item__primary-text"]})}return n})(),Un=(()=>{class n{_elementRef=r(P);constructor(){}static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,selectors:[["","matListItemLine",""]],hostAttrs:[1,"mat-mdc-list-item-line","mdc-list-item__secondary-text"]})}return n})(),De=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,selectors:[["","matListItemMeta",""]],hostAttrs:[1,"mat-mdc-list-item-meta","mdc-list-item__end"]})}return n})(),Gi=(()=>{class n{_listOption=r(Gn,{optional:!0});constructor(){}_isAlignedAtStart(){return!this._listOption||this._listOption?._getTogglePosition()==="after"}static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,hostVars:4,hostBindings:function(e,i){e&2&&f("mdc-list-item__start",i._isAlignedAtStart())("mdc-list-item__end",!i._isAlignedAtStart())}})}return n})(),Zn=(()=>{class n extends Gi{static \u0275fac=(()=>{let t;return function(i){return(t||(t=G(n)))(i||n)}})();static \u0275dir=M({type:n,selectors:[["","matListItemAvatar",""]],hostAttrs:[1,"mat-mdc-list-item-avatar"],features:[j]})}return n})(),Ee=(()=>{class n extends Gi{static \u0275fac=(()=>{let t;return function(i){return(t||(t=G(n)))(i||n)}})();static \u0275dir=M({type:n,selectors:[["","matListItemIcon",""]],hostAttrs:[1,"mat-mdc-list-item-icon"],features:[j]})}return n})(),Kn=new T("MAT_LIST_CONFIG"),Ce=(()=>{class n{_isNonInteractive=!0;get disableRipple(){return this._disableRipple}set disableRipple(t){this._disableRipple=S(t)}_disableRipple=!1;get disabled(){return this._disabled()}set disabled(t){this._disabled.set(S(t))}_disabled=N(!1);_defaultOptions=r(Kn,{optional:!0});static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,hostVars:1,hostBindings:function(e,i){e&2&&q("aria-disabled",i.disabled)},inputs:{disableRipple:"disableRipple",disabled:"disabled"}})}return n})(),Xn=(()=>{class n{_elementRef=r(P);_ngZone=r(F);_listBase=r(Ce,{optional:!0});_platform=r(B);_hostElement;_isButtonElement;_noopAnimations=at();_avatars;_icons;set lines(t){this._explicitLines=bt(t,null),this._updateItemLines(!1)}_explicitLines=null;get disableRipple(){return this.disabled||this._disableRipple||this._noopAnimations||!!this._listBase?.disableRipple}set disableRipple(t){this._disableRipple=S(t)}_disableRipple=!1;get disabled(){return this._disabled()||!!this._listBase?.disabled}set disabled(t){this._disabled.set(S(t))}_disabled=N(!1);_subscriptions=new Ie;_rippleRenderer=null;_hasUnscopedTextContent=!1;rippleConfig;get rippleDisabled(){return this.disableRipple||!!this.rippleConfig.disabled}constructor(){r(Nt).load(mi);let t=r(di,{optional:!0});this.rippleConfig=t||{},this._hostElement=this._elementRef.nativeElement,this._isButtonElement=this._hostElement.nodeName.toLowerCase()==="button",this._listBase&&!this._listBase._isNonInteractive&&this._initInteractiveListItem(),this._isButtonElement&&!this._hostElement.hasAttribute("type")&&this._hostElement.setAttribute("type","button")}ngAfterViewInit(){this._monitorProjectedLinesAndTitle(),this._updateItemLines(!0)}ngOnDestroy(){this._subscriptions.unsubscribe(),this._rippleRenderer!==null&&this._rippleRenderer._removeTriggerEvents()}_hasIconOrAvatar(){return!!(this._avatars.length||this._icons.length)}_initInteractiveListItem(){this._hostElement.classList.add("mat-mdc-list-item-interactive"),this._rippleRenderer=new ci(this,this._ngZone,this._hostElement,this._platform,r(Q)),this._rippleRenderer.setupTriggerEvents(this._hostElement)}_monitorProjectedLinesAndTitle(){this._ngZone.runOutsideAngular(()=>{this._subscriptions.add(Lt(this._lines.changes,this._titles.changes).subscribe(()=>this._updateItemLines(!1)))})}_updateItemLines(t){if(!this._lines||!this._titles||!this._unscopedContent)return;t&&this._checkDomForUnscopedTextContent();let e=this._explicitLines??this._inferLinesFromContent(),i=this._unscopedContent.nativeElement;if(this._hostElement.classList.toggle("mat-mdc-list-item-single-line",e<=1),this._hostElement.classList.toggle("mdc-list-item--with-one-line",e<=1),this._hostElement.classList.toggle("mdc-list-item--with-two-lines",e===2),this._hostElement.classList.toggle("mdc-list-item--with-three-lines",e===3),this._hasUnscopedTextContent){let o=this._titles.length===0&&e===1;i.classList.toggle("mdc-list-item__primary-text",o),i.classList.toggle("mdc-list-item__secondary-text",!o)}else i.classList.remove("mdc-list-item__primary-text"),i.classList.remove("mdc-list-item__secondary-text")}_inferLinesFromContent(){let t=this._titles.length+this._lines.length;return this._hasUnscopedTextContent&&(t+=1),t}_checkDomForUnscopedTextContent(){this._hasUnscopedTextContent=Array.from(this._unscopedContent.nativeElement.childNodes).filter(t=>t.nodeType!==t.COMMENT_NODE).some(t=>!!(t.textContent&&t.textContent.trim()))}static \u0275fac=function(e){return new(e||n)};static \u0275dir=M({type:n,contentQueries:function(e,i,o){if(e&1&&K(o,Zn,4)(o,Ee,4),e&2){let l;x(l=y())&&(i._avatars=l),x(l=y())&&(i._icons=l)}},hostVars:4,hostBindings:function(e,i){e&2&&(q("aria-disabled",i.disabled)("disabled",i._isButtonElement&&i.disabled||null),f("mdc-list-item--disabled",i.disabled))},inputs:{lines:"lines",disableRipple:"disableRipple",disabled:"disabled"}})}return n})();var Ui=(()=>{class n extends Xn{_lines;_titles;_meta;_unscopedContent;_itemText;get activated(){return this._activated}set activated(t){this._activated=S(t)}_activated=!1;_getAriaCurrent(){return this._hostElement.nodeName==="A"&&this._activated?"page":null}_hasBothLeadingAndTrailing(){return this._meta.length!==0&&(this._avatars.length!==0||this._icons.length!==0)}static \u0275fac=(()=>{let t;return function(i){return(t||(t=G(n)))(i||n)}})();static \u0275cmp=u({type:n,selectors:[["mat-list-item"],["a","mat-list-item",""],["button","mat-list-item",""]],contentQueries:function(e,i,o){if(e&1&&K(o,Un,5)(o,Me,5)(o,De,5),e&2){let l;x(l=y())&&(i._lines=l),x(l=y())&&(i._titles=l),x(l=y())&&(i._meta=l)}},viewQuery:function(e,i){if(e&1&&U(Hn,5)(Qn,5),e&2){let o;x(o=y())&&(i._unscopedContent=o.first),x(o=y())&&(i._itemText=o.first)}},hostAttrs:[1,"mat-mdc-list-item","mdc-list-item"],hostVars:13,hostBindings:function(e,i){e&2&&(q("aria-current",i._getAriaCurrent()),f("mdc-list-item--activated",i.activated)("mdc-list-item--with-leading-avatar",i._avatars.length!==0)("mdc-list-item--with-leading-icon",i._icons.length!==0)("mdc-list-item--with-trailing-meta",i._meta.length!==0)("mat-mdc-list-item-both-leading-and-trailing",i._hasBothLeadingAndTrailing())("_mat-animation-noopable",i._noopAnimations))},inputs:{activated:"activated"},exportAs:["matListItem"],features:[j],ngContentSelectors:Wn,decls:10,vars:0,consts:[["unscopedContent",""],[1,"mdc-list-item__content"],[1,"mat-mdc-list-item-unscoped-content",3,"cdkObserveContent"],[1,"mat-focus-indicator"]],template:function(e,i){e&1&&(V(qn),v(0),s(1,"span",1),v(2,1),v(3,2),s(4,"span",2,0),h("cdkObserveContent",function(){return i._updateItemLines(!0)}),v(6,3),c()(),v(7,4),v(8,5),b(9,"div",3))},dependencies:[ni],encapsulation:2,changeDetection:0})}return n})();var Zi=(()=>{class n extends Ce{_isNonInteractive=!1;static \u0275fac=(()=>{let t;return function(i){return(t||(t=G(n)))(i||n)}})();static \u0275cmp=u({type:n,selectors:[["mat-nav-list"]],hostAttrs:["role","navigation",1,"mat-mdc-nav-list","mat-mdc-list-base","mdc-list"],exportAs:["matNavList"],features:[W([{provide:Ce,useExisting:n}]),j],ngContentSelectors:jn,decls:1,vars:0,template:function(e,i){e&1&&(V(),v(0))},styles:[Vn],encapsulation:2,changeDetection:0})}return n})();var Ki=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({imports:[jt,hi,Wi,I,Dt]})}return n})();var ta=(n,a)=>a.id;function ea(n,a){if(n&1){let t=O();s(0,"mat-list-item",2),h("click",function(){E(t);let i=p(2);return A(i.filter.selectRequests())}),s(1,"mat-icon",3),m(2,"inbox"),c(),s(3,"span",4),m(4,"Requests"),c(),s(5,"span",8),m(6),c()()}if(n&2){let t=p(),e=p();f("active",e.filter.showRequests()),d(6),L(t.requests.length)}}function ia(n,a){if(n&1){let t=O();s(0,"mat-list-item",9),h("click",function(){let i=E(t).$implicit,o=p(2);return A(o.filter.selectEpic(i.id))}),b(1,"span",10),s(2,"span",11),m(3),c(),b(4,"app-state-badge",12),c()}if(n&2){let t=a.$implicit,e=p(2);f("active",e.filter.selectedEpicId()===t.id)("closed",e.filter.isClosed(t.state)),d(),it("background",e.epicColor(t)),d(2),L(t.title),d(),R("state",t.state)}}function na(n,a){if(n&1){let t=O();s(0,"mat-nav-list",0)(1,"mat-list-item",2),h("click",function(){E(t);let i=p();return A(i.filter.selectAll())}),s(2,"mat-icon",3),m(3,"view_list"),c(),s(4,"span",4),m(5,"All"),c()(),_(6,ea,7,3,"mat-list-item",5),b(7,"mat-divider"),s(8,"div",6),m(9,"Epics"),c(),Tt(10,ia,5,8,"mat-list-item",7,ta),c()}if(n&2){let t=a,e=p();d(),f("active",!e.filter.showRequests()&&!e.filter.selectedEpicId()),d(5),g(t.requests.length>0?6:-1),d(4),Pt(t.epics)}}function aa(n,a){n&1&&(s(0,"div",1),b(1,"mat-spinner",13),c())}var ne=class n{svc=r(tt);filter=r(Et);tree=Ii(this.svc.getTree());EPIC_COLORS=["#5e6ad2","#26b5ce","#4cb782","#f2994a","#eb5757","#9b51e0","#f2c94c","#2d9cdb"];epicColor(a){let t=Math.abs(a.id.split("").reduce((e,i)=>e+i.charCodeAt(0),0))%this.EPIC_COLORS.length;return this.EPIC_COLORS[t]}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=u({type:n,selectors:[["app-epic-nav"]],decls:2,vars:1,consts:[["dense",""],[1,"loading"],[1,"nav-item",3,"click"],["matListItemIcon",""],["matListItemTitle",""],[1,"nav-item",3,"active"],[1,"section-label"],[1,"nav-item","epic-item",3,"active","closed"],["matListItemMeta","",1,"count"],[1,"nav-item","epic-item",3,"click"],["matListItemIcon","",1,"epic-dot"],["matListItemTitle","",1,"epic-title"],["matListItemMeta","",3,"state"],["diameter","24"]],template:function(t,e){if(t&1&&_(0,na,12,3,"mat-nav-list",0)(1,aa,2,0,"div",1),t&2){let i;g((i=e.tree())?0:1,i)}},dependencies:[ft,Ki,Zi,Ui,Ee,Xt,Me,De,J,Y,Dt,Ut,Gt,$t],styles:["[_nghost-%COMP%]{display:block;padding:8px 0}.nav-item[_ngcontent-%COMP%]{border-radius:6px;margin:1px 6px;cursor:pointer;transition:background .1s;--mdc-list-list-item-container-color: transparent}.nav-item[_ngcontent-%COMP%]:hover{background:var(--hover-bg)}.nav-item.active[_ngcontent-%COMP%]{background:var(--active-bg);border-left:3px solid var(--accent)}.nav-item.closed[_ngcontent-%COMP%]{opacity:.5}.epic-dot[_ngcontent-%COMP%]{display:inline-block;width:10px;height:10px;border-radius:50%;flex-shrink:0}.epic-title[_ngcontent-%COMP%]{font-size:13px;font-weight:400}.section-label[_ngcontent-%COMP%]{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);padding:12px 16px 4px;font-weight:500}.count[_ngcontent-%COMP%]{font-size:11px;color:var(--muted);background:var(--hover-bg);border-radius:8px;padding:1px 6px}.loading[_ngcontent-%COMP%]{display:flex;justify-content:center;padding:24px}mat-nav-list[_ngcontent-%COMP%]{padding:0}"]})};var Xi=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({})}return n})();var $i=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=C({type:n});static \u0275inj=k({imports:[Xi,Kt,I]})}return n})();var oa=(n,a)=>a.key;function ra(n,a){n&1&&(s(0,"div",0),b(1,"mat-spinner",3),c())}function sa(n,a){if(n&1){let t=O();s(0,"button",16),h("click",function(){E(t);let i=p(2);return A(i.startEdit())}),s(1,"mat-icon"),m(2,"edit"),c()()}}function la(n,a){n&1&&(s(0,"span",18),m(1,"\u203A"),c())}function ca(n,a){if(n&1&&(s(0,"span",17),m(1),c(),_(2,la,2,0,"span",18)),n&2){let t=a.$implicit,e=a.$index,i=a.$count;d(),L(t),d(),g(e!==i-1?2:-1)}}function da(n,a){if(n&1&&(s(0,"div",14),Tt(1,ca,3,2,null,null,Ge),c()),n&2){let t=p(2);d(),Pt(t.breadcrumb)}}function ma(n,a){if(n&1&&(s(0,"div",21)(1,"span",22),m(2),c(),s(3,"span",23),m(4),c()()),n&2){let t=a.$implicit;d(2),L(t.key),d(2),L(t.value)}}function pa(n,a){if(n&1&&(s(0,"div",20),Tt(1,ma,5,2,"div",21,oa),c(),b(3,"mat-divider")),n&2){let t=p(2),e=p();d(),Pt(e.orderedProps(t.properties))}}function ha(n,a){if(n&1&&(s(0,"div",21)(1,"span",22),m(2,"Start Date"),c(),s(3,"span",23),m(4),c()()),n&2){let t=p(3);d(4),L(t.dates.start)}}function ua(n,a){if(n&1&&(s(0,"div",21)(1,"span",22),m(2,"Target Date"),c(),s(3,"span",23),m(4),c()()),n&2){let t=p(3);d(4),L(t.dates.target)}}function _a(n,a){if(n&1&&(s(0,"div",20),_(1,ha,5,1,"div",21),_(2,ua,5,1,"div",21),c(),b(3,"mat-divider")),n&2){let t=p(2);d(),g(t.dates.start?1:-1),d(),g(t.dates.target?2:-1)}}function ga(n,a){if(n&1&&(_(0,pa,4,0),_(1,_a,4,2),b(2,"div",19)),n&2){let t=p(),e=p();g(e.orderedProps(t.properties).length>0?0:-1),d(),g(t.dates.start||t.dates.target?1:-1),d(),R("innerHTML",t.html,Ve)}}function fa(n,a){n&1&&b(0,"mat-spinner",27)}function ba(n,a){n&1&&m(0," Save ")}function va(n,a){if(n&1){let t=O();s(0,"div",15)(1,"textarea",24),gt("ngModelChange",function(i){E(t);let o=p(2);return _t(o.editContent,i)||(o.editContent=i),A(i)}),c(),s(2,"div",25)(3,"button",26),h("click",function(){E(t);let i=p(2);return A(i.saveEdit())}),_(4,fa,1,0,"mat-spinner",27)(5,ba,1,0),c(),s(6,"button",28),h("click",function(){E(t);let i=p(2);return A(i.cancelEdit())}),m(7,"Cancel"),c()()()}if(n&2){let t=p(2);d(),ut("ngModel",t.editContent),R("disabled",t.saving()),d(2),R("disabled",t.saving()),d(),g(t.saving()?4:5),d(2),R("disabled",t.saving())}}function xa(n,a){if(n&1){let t=O();s(0,"div",1)(1,"div",4)(2,"div",5)(3,"span",6),m(4),c(),s(5,"div",7),_(6,sa,3,0,"button",8),s(7,"button",9),h("click",function(){E(t);let i=p();return A(i.close())}),s(8,"mat-icon"),m(9,"close"),c()()()(),s(10,"h2",10),m(11),c(),s(12,"div",11)(13,"span",12),m(14),c(),b(15,"app-state-badge",13),c(),_(16,da,3,0,"div",14),c(),b(17,"mat-divider"),_(18,ga,3,3)(19,va,8,5,"div",15),c()}if(n&2){let t=a,e=p();d(4),L(e.KIND_LABELS[t.kind]),d(2),g(e.editing()?-1:6),d(5),L(t.title),d(3),L(t.id),d(),R("state",t.state),d(),g(e.breadcrumb.length>1?16:-1),d(2),g(e.editing()?19:18)}}function ya(n,a){n&1&&(s(0,"div",2)(1,"mat-icon"),m(2,"article"),c(),s(3,"p"),m(4,"Select an item to view details"),c()())}var ae=class n{svc=r(tt);snack=r(Rt);filter=r(Et);detail=N(null);loading=N(!1);editing=N(!1);saving=N(!1);editContent=N("");KIND_LABELS={epic:"Epic",feature:"Feature",workitem:"Work Item",task:"Task",request:"Request"};PROP_DISPLAY_ORDER=["State","Type","Assigned to","Priority","Iteration","Start Date","Target Date","Duration","Area","Product","Effort","Estimated Hours","Remaining Hours","Labels"];constructor(){mt(()=>{let a=this.filter.openItem();if(!a){this.detail.set(null),this.editing.set(!1);return}this.loading.set(!0),this.editing.set(!1),this.svc.getItem(a.path).subscribe({next:t=>{this.detail.set(t),this.loading.set(!1)},error:()=>this.loading.set(!1)})})}get breadcrumb(){let a=this.detail();if(!a)return[];let t=a.path.split("/"),e=[];if(a.kind==="feature"||a.kind==="workitem"||a.kind==="task"){let i=t.indexOf("epics");i>=0&&e.push(t[i+1])}if(a.kind==="workitem"||a.kind==="task"){let i=t.indexOf("features");i>=0&&e.push(t[i+1])}if(a.kind==="task"){let i=t.indexOf("workitems");i>=0&&e.push(t[i+1])}return e.push(a.id),e}orderedProps(a){let t=new Set,e=[];for(let i of this.PROP_DISPLAY_ORDER)a[i]&&(e.push({key:i,value:a[i]}),t.add(i));for(let[i,o]of Object.entries(a))t.has(i)||e.push({key:i,value:o});return e}startEdit(){let a=this.detail();a&&(this.editContent.set(a.raw),this.editing.set(!0))}cancelEdit(){this.editing.set(!1)}saveEdit(){let a=this.detail();!a||this.saving()||(this.saving.set(!0),this.svc.saveItem(a.path,this.editContent()).subscribe({next:t=>{this.detail.set(t),this.editing.set(!1),this.saving.set(!1),this.svc.refreshTree(),this.snack.open("Saved","OK",{duration:2e3})},error:()=>{this.saving.set(!1),this.snack.open("Save failed","Dismiss",{duration:4e3})}}))}close(){this.filter.closeDetail()}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=u({type:n,selectors:[["app-item-detail-panel"]],decls:3,vars:3,consts:[[1,"panel-loading"],[1,"panel-content"],[1,"empty-state"],["diameter","32"],[1,"panel-header"],[1,"header-top"],[1,"kind-chip"],[1,"header-actions"],["mat-icon-button","","matTooltip","Edit this item"],["mat-icon-button","","matTooltip","Close",3,"click"],[1,"item-title"],[1,"item-meta"],[1,"entity-id"],[3,"state"],[1,"breadcrumb"],[1,"edit-area"],["mat-icon-button","","matTooltip","Edit this item",3,"click"],[1,"crumb"],[1,"crumb-sep"],[1,"markdown-body",3,"innerHTML"],[1,"props-section"],[1,"prop-row"],[1,"prop-key"],[1,"prop-val"],["placeholder","Edit markdown\u2026",1,"edit-textarea",3,"ngModelChange","ngModel","disabled"],[1,"edit-actions"],["mat-flat-button","","color","primary",3,"click","disabled"],["diameter","16"],["mat-stroked-button","",3,"click","disabled"]],template:function(t,e){if(t&1&&(_(0,ra,2,0,"div",0),_(1,xa,20,7,"div",1),_(2,ya,5,0,"div",2)),t&2){let i;g(e.loading()?0:-1),d(),g((i=!e.loading()&&e.detail())?1:-1,i),d(),g(!e.loading()&&!e.detail()?2:-1)}},dependencies:[ft,wt,vt,xt,yt,$,X,Ht,J,Y,Ut,Gt,$i,Dt,Xt,Mt,Ct,$t],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;height:100%;overflow:hidden;background:var(--surface)}.panel-loading[_ngcontent-%COMP%]{display:flex;justify-content:center;padding:48px}.panel-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%;overflow-y:auto}.panel-header[_ngcontent-%COMP%]{padding:16px 20px 12px;background:var(--surface);position:sticky;top:0;z-index:1}.header-top[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.header-actions[_ngcontent-%COMP%]{display:flex;gap:4px}.kind-chip[_ngcontent-%COMP%]{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);background:var(--active-bg);padding:2px 8px;border-radius:10px}.item-title[_ngcontent-%COMP%]{margin:0 0 6px;font-size:20px;font-weight:600;line-height:1.3;color:#1a1a2e}.item-meta[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin-bottom:6px}.breadcrumb[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:11px;color:var(--muted);margin-top:4px}.crumb[_ngcontent-%COMP%]{max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.crumb-sep[_ngcontent-%COMP%]{color:var(--border)}.props-section[_ngcontent-%COMP%]{padding:12px 20px}.prop-row[_ngcontent-%COMP%]{display:flex;padding:4px 0;font-size:13px;gap:8px}.prop-key[_ngcontent-%COMP%]{width:130px;flex-shrink:0;color:var(--muted);font-size:12px}.prop-val[_ngcontent-%COMP%]{color:#1a1a2e;word-break:break-word}.markdown-body[_ngcontent-%COMP%]{padding:16px 20px 32px;font-size:14px;line-height:1.6;color:#374151}.markdown-body[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:18px;font-weight:600;margin:16px 0 8px}.markdown-body[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:15px;font-weight:600;margin:14px 0 6px;color:#1a1a2e}.markdown-body[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:13px;font-weight:600;margin:12px 0 4px}.markdown-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0 0 10px}.markdown-body[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .markdown-body[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]{padding-left:20px;margin:4px 0 10px}.markdown-body[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-bottom:3px}.markdown-body[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:12px;font-family:SFMono-Regular,Consolas,monospace}.markdown-body[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]{background:#f1f5f9;padding:12px;border-radius:6px;overflow-x:auto}.markdown-body[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:none;padding:0}.markdown-body[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-weight:600}.markdown-body[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:var(--accent);text-decoration:none}.markdown-body[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration:underline}.markdown-body[_ngcontent-%COMP%]   hr[_ngcontent-%COMP%]{border:none;border-top:1px solid var(--border);margin:16px 0}.edit-area[_ngcontent-%COMP%]{display:flex;flex-direction:column;flex:1;padding:12px 20px;gap:8px}.edit-textarea[_ngcontent-%COMP%]{flex:1;min-height:400px;border:1px solid var(--border);border-radius:6px;padding:12px;font-family:SFMono-Regular,Consolas,monospace;font-size:13px;line-height:1.5;resize:vertical;outline:none;color:#1a1a2e}.edit-textarea[_ngcontent-%COMP%]:focus{border-color:var(--accent);box-shadow:0 0 0 2px #5e6ad226}.edit-actions[_ngcontent-%COMP%]{display:flex;gap:8px;padding-bottom:8px}.empty-state[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--muted)}.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:48px;width:48px;height:48px;margin-bottom:12px}.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px}"]})};var oe=class n{svc=r(tt);snack=r(Rt);commitMsg="";busy=N(!1);doCommit(){let a=this.commitMsg.trim();!a||this.busy()||(this.busy.set(!0),this.svc.commit(a).subscribe({next:t=>{this.busy.set(!1),t.ok?(this.commitMsg="",this.snack.open(`\u2713 Committed: ${t.output}`,"OK",{duration:4e3})):this.snack.open(`Commit failed: ${t.output}`,"Dismiss",{duration:6e3})},error:()=>{this.busy.set(!1),this.snack.open("Commit error \u2014 is git installed?","Dismiss",{duration:6e3})}}))}doPush(){this.busy()||(this.busy.set(!0),this.svc.push().subscribe({next:a=>{this.busy.set(!1),a.ok?this.snack.open("\u2713 Pushed successfully","OK",{duration:4e3}):this.snack.open(`Push failed: ${a.output}`,"Dismiss",{duration:6e3})},error:()=>{this.busy.set(!1),this.snack.open("Push error \u2014 check your git remote and credentials","Dismiss",{duration:6e3})}}))}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=u({type:n,selectors:[["app-git-actions"]],decls:13,vars:4,consts:[[1,"git-bar"],["appearance","outline",1,"msg-field"],["matInput","","placeholder","Describe your changes\u2026",3,"ngModelChange","keydown.enter","ngModel","disabled"],["mat-flat-button","","color","primary","matTooltip","Commit staged backlog changes",3,"click","disabled"],["mat-stroked-button","","matTooltip","Push commits to remote",3,"click","disabled"]],template:function(t,e){t&1&&(s(0,"div",0)(1,"mat-form-field",1)(2,"mat-label"),m(3,"Commit message"),c(),s(4,"input",2),gt("ngModelChange",function(o){return _t(e.commitMsg,o)||(e.commitMsg=o),o}),h("keydown.enter",function(){return e.doCommit()}),c()(),s(5,"button",3),h("click",function(){return e.doCommit()}),s(6,"mat-icon"),m(7,"commit"),c(),m(8," Commit "),c(),s(9,"button",4),h("click",function(){return e.doPush()}),s(10,"mat-icon"),m(11,"upload"),c(),m(12," Push "),c()()),t&2&&(d(4),ut("ngModel",e.commitMsg),R("disabled",e.busy()),d(),R("disabled",!e.commitMsg.trim()||e.busy()),d(4),R("disabled",e.busy()))},dependencies:[wt,vt,xt,yt,ie,ee,ot,qt,rt,$,X,J,Y,Mt,Ct],styles:[".git-bar[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;padding:0 16px;height:100%}.msg-field[_ngcontent-%COMP%]{flex:1;font-size:13px}mat-form-field[_ngcontent-%COMP%]{--mdc-outlined-text-field-container-height: 40px}button[_ngcontent-%COMP%]{white-space:nowrap;height:40px}"]})};var wa=["detailDrawer"],re=class n{router=r(Je);filter=r(Et);svc=r(tt);detailDrawer;searchQuery="";constructor(){mt(()=>{let a=this.filter.openItem();this.detailDrawer&&(a?this.detailDrawer.open():this.detailDrawer.close())})}onDrawerClosed(){this.filter.closeDetail()}toggleClosed(){this.filter.showClosed.update(a=>!a)}doSearch(a){a.preventDefault();let t=this.searchQuery.trim();if(!t){this.router.navigate(["/"]);return}this.router.navigate(["/search"],{queryParams:{q:t}})}refresh(){this.svc.refreshTree()}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=u({type:n,selectors:[["app-root"]],viewQuery:function(t,e){if(t&1&&U(wa,5),t&2){let i;x(i=y())&&(e.detailDrawer=i.first)}},decls:31,vars:5,consts:[["leftNav",""],["detailDrawer",""],[1,"app-shell"],[1,"toolbar"],["mat-icon-button","","matTooltip","Toggle nav",3,"click"],[1,"app-title"],[1,"search-form",3,"submit"],["appearance","outline",1,"search-field"],["matPrefix",""],["matInput","","name","q","placeholder","Search backlog\u2026","autocomplete","off",3,"ngModelChange","ngModel"],[1,"spacer"],["mat-button","","matTooltip","Show or hide closed and removed items",3,"click"],["mat-icon-button","","matTooltip","Refresh backlog data",3,"click"],[1,"sidenav-container"],["mode","side","opened","",1,"left-nav"],["position","end","mode","over",1,"detail-drawer",3,"closedStart"],[1,"main-content"],[1,"git-bar-wrapper"]],template:function(t,e){if(t&1){let i=O();s(0,"div",2)(1,"mat-toolbar",3)(2,"button",4),h("click",function(){E(i);let l=de(22);return A(l.toggle())}),s(3,"mat-icon"),m(4,"menu"),c()(),s(5,"span",5),m(6,"Backlog Browser"),c(),s(7,"form",6),h("submit",function(l){return e.doSearch(l)}),s(8,"mat-form-field",7)(9,"mat-icon",8),m(10,"search"),c(),s(11,"input",9),gt("ngModelChange",function(l){return E(i),_t(e.searchQuery,l)||(e.searchQuery=l),A(l)}),c()()(),b(12,"span",10),s(13,"button",11),h("click",function(){return e.toggleClosed()}),s(14,"mat-icon"),m(15),c(),m(16),c(),s(17,"button",12),h("click",function(){return e.refresh()}),s(18,"mat-icon"),m(19,"refresh"),c()()(),s(20,"mat-sidenav-container",13)(21,"mat-sidenav",14,0),b(23,"app-epic-nav"),c(),s(24,"mat-sidenav",15,1),h("closedStart",function(){return e.onDrawerClosed()}),b(26,"app-item-detail-panel"),c(),s(27,"mat-sidenav-content",16),b(28,"router-outlet"),c()(),s(29,"div",17),b(30,"app-git-actions"),c()()}t&2&&(d(11),ut("ngModel",e.searchQuery),d(2),f("active-toggle",e.filter.showClosed()),d(2),L(e.filter.showClosed()?"visibility":"visibility_off"),d(),Ot(" ",e.filter.showClosed()?"Closed visible":"Hide closed"," "))},dependencies:[ft,Ye,wt,fi,vt,xt,gi,yt,Qt,Ri,ye,Fi,Jt,Bi,Li,$,X,Ht,J,Y,ie,ee,ot,Wt,rt,Mt,Ct,qi,ne,ae,oe],styles:["[_nghost-%COMP%]{display:block;height:100vh;overflow:hidden}.app-shell[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100vh;overflow:hidden}.toolbar[_ngcontent-%COMP%]{flex-shrink:0;height:var(--toolbar-height)!important;min-height:var(--toolbar-height)!important;background:var(--surface);border-bottom:1px solid var(--border);box-shadow:0 1px 3px #00000014;gap:8px;color:#1a1a2e;z-index:100;padding:0 8px}.app-title[_ngcontent-%COMP%]{font-size:15px;font-weight:600;color:var(--accent);letter-spacing:-.01em;white-space:nowrap;margin-right:8px}.search-form[_ngcontent-%COMP%]{flex:1;max-width:400px;display:flex}.search-field[_ngcontent-%COMP%]{width:100%;--mdc-outlined-text-field-container-height: 36px}.spacer[_ngcontent-%COMP%]{flex:1}.active-toggle[_ngcontent-%COMP%]{background:var(--active-bg)!important;color:var(--accent)!important}.sidenav-container[_ngcontent-%COMP%]{flex:1;overflow:hidden}.left-nav[_ngcontent-%COMP%]{width:var(--nav-width);border-right:1px solid var(--border);background:var(--surface);overflow-y:auto}.detail-drawer[_ngcontent-%COMP%]{width:var(--detail-width);border-left:1px solid var(--border);background:var(--surface);overflow:hidden;box-shadow:-4px 0 16px #00000014}.main-content[_ngcontent-%COMP%]{background:#f4f5f7;overflow-y:auto}.git-bar-wrapper[_ngcontent-%COMP%]{flex-shrink:0;height:var(--git-bar-height);background:var(--surface);border-top:1px solid var(--border);box-shadow:0 -1px 4px #0000000f}"]})};Xe(re,Oi).catch(n=>console.error(n));
