(function(){var 






a=ecui={},rd=a.array={},tc=a.browser={},A=a.dom={},Rb=a.ext={},Ob=a.string={},q=a.ui={},M=a.util={},hb=baidu,uc=hb.browser,K=hb.dom,g=void 0,wb=window,B=document,yb=Math,w=yb.min,k=yb.max,nd=yb.abs,Qd=yb.ceil,P=yb.floor,Lb=yb.round,X=parseInt,C=tc.ie=uc.ie,mc=tc.firefox=uc.firefox,$d=tc.isStrict=uc.isStrict,kd=mc?"textContent":"innerText",Y=rd.indexOf=hb.array.indexOf,pb=rd.remove=hb.array.remove,Ec=A.addClass=K.addClass,J=A.children=K.children,_c=A.contain=function(a,b){

















































































return a==b||K.contains(a,b)},t=A.create=function(a,b,c){var 












d=B.createElement(c||"div");if(a)d.className=a;if(b)d.style.cssText=b;






return d},jb=A.first=K.first,m=A.getParent=C?function(a){



















return a.parentElement}:function(a){

return a.parentNode},sb=A.getPosition=K.getPosition,H=A.getStyle=function(a,b){

























return b?K.getStyle(a,b):a.currentStyle||(C?a.style:getComputedStyle(a,null))},gd=A.getText=function(a){












return a[kd]},Ac=A.insertAfter=K.insertAfter,N=A.insertBefore=K.insertBefore,xb=A.insertHTML=K.insertHTML,Ud=A.last=K.last,pc=A.moveElements=function(a,b,c){


















































c&&I(a);
for(var d;d=a.firstChild;)b.appendChild(d)},be=A.next=K.next,Sd=A.ready=K.ready,I=A.remove=function(a){var 































b=m(a);
b&&b.removeChild(a);
return a},Jc=A.removeClass=K.removeClass,Db=A.setInput=function(a,b,c){if(!a){if(C)return t("","",'<input type="'+(c||"")+'" name="'+(b||"")+'">');



























a=t("","","input")}


b=b===g?a.name:b;
c=c===g?a.type:c;if(a.name!=b||a.type!=c)if(C){


xb(a,"afterEnd",'<input type="'+c+'" name="'+b+'" class="'+a.className+'" style="'+a.style.cssText+'" '+(a.disabled?"disabled":"")+(a.readOnly?" readOnly":"")+">");






b=a;
(a=a.nextSibling).value=b.value;if(c=="radio")a.checked=b.checked;



I(b)}else{


a.type=c;
a.name=b}


return a},ad=A.setStyle=K.setStyle,oe=A.setText=function(a,b){




















a[kd]=b},Vd=Ob.encodeHTML=hb.string.encodeHTML,ae=Ob.sliceByte=function(a,b,c){for(var 






















d=0,e="number"==typeof c?function(a){

return a>127?c:1}:c;d<a.length;d++){




b-=e(a.charCodeAt(d));if(b<0)return a.slice(0,d)}





return a},vc=Ob.toCamelCase=hb.string.toCamelCase,ce=Ob.toHalfWidth=hb.string.toHalfWidth,Wc=Ob.trim=function(a){





























return a.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,"")},cb=M.attachEvent=function(a,b,c){











a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener(b,c,false)},Z=M.blank=function(){},pd=M.cancel=function(){


















return false},G=M.copy=hb.object.extend,se=M.createSWF=hb.swf.create,Zb=M.detachEvent=function(a,b,c){




















































a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener(b,c,false)},gc=M.findConstructor=function(a,b){for(;a;a=a.superClass){












a=a.constructor;if(a[b])return a[b]}},$b=M.findPrototype=function(a,b){for(var 
















c=a.constructor.prototype;c;c=c.constructor.superClass)if(a[b]!=c[b])return c[b]},Cb=M.getView=function(){var 




















a=B.body,b=m(a),f=B.compatMode=="BackCompat"?a:B.documentElement,g=b.scrollTop+a.scrollTop,d=b.scrollLeft+a.scrollLeft,c=f.clientWidth,e=f.clientHeight;







return{top:g,right:c+d,bottom:e+g,left:d,width:k(b.scrollWidth,a.scrollWidth,c),height:k(b.scrollHeight,a.scrollHeight,e)}},d=M.inherits=function(a,b){


















hb.lang.inherits(a,b);
return a.prototype},qe=M.parse=hb.json.parse,re=M.stringify=hb.json.stringify,r=M.toNumber=function(a){



























return X(a)||0},Kb=a.Timer=function(a,b,c){var 











d=Array.prototype.slice.call(arguments,3);this._nID=setTimeout(
function(){
a.apply(c,d);
d=c=null},b)},Kc,fc,rc,f,wd,nc,Ed,Id,lc,Od,oc,ec,T,sd,dd,sc,Hb,Wb,md,xd,Gb,Nb,S,Pb,rb,qb,D,hd,







Ib=["mousedown","mouseover","mousemove","mouseout","mouseup","pressstart","pressover","pressmove","pressout","pressend","click","focus","blur","keydown","keypress","keyup","mousewheel","change","resize","create","init"],


























































































c=q.Control=function(a,b){var 

c=a.style;

this._bCapture=b.capture!==false;
this._bFocusable=b.focus!==false;
this._bEnabled=b.enabled!==false;
this._sBaseClass=this._sClass=b.base;
this._sUID=b.uid;
this._sType=b.type;
this._eBase=this._eBody=a;
this._cParent=null;

this._sWidth=c.width;
this._sHeight=c.height;

Kc(a,this)},Xb,b=c.prototype,


































ub=q.Scroll=function(a,b){

;



b.focus=false;


a.onselectstart=pd;

a.innerHTML='<div class="'+b.type+"-prev "+b.base+'-prev" style="position:absolute;top:0px;left:0px"></div><div class="'+b.type+"-next "+b.base+'-next" style="position:absolute;top:0px;left:0px"></div><div class="'+b.type+"-block "+b.base+'-block" style="position:absolute"></div>';







c.call(this,a,b);


a=J(a);


this._nValue=this._nTotal=0;
this._nStep=1;


this._uPrev=f(Mc,a[0],this,{focus:false});
this._uNext=f(Mc,a[1],this,{focus:false});
this._uBlock=f(ed,a[2],this,{focus:false})},v=d(ub,c),ed=ub.Block=function(a,b){




c.call(this,a,b)},Cc=d(ed,c),Mc=ub.Button=function(a,b){



c.call(this,a,b)},_b=d(Mc,c),











Oc=q.VScroll=function(a,b){
ub.call(this,a,b)},Eb=d(Oc,ub),












zd=q.HScroll=function(a,b){
ub.call(this,a,b)},Ab=d(zd,ub),












































ob=q.Panel=function(a,b){var 

d=0,e=0,i=b.vScroll!==false?'<div class="ec-vscroll '+b.base+'-vscroll" style="position:absolute"></div>':"",h=b.hScroll!==false?'<div class="ec-hscroll '+b.base+'-hscroll" style="position:absolute"></div>':"",j=i&&h?'<div class="'+b.type+"-corner "+b.base+'-corner" style="position:absolute"></div>':"",k=[[i,"_uVScroll",Oc],[h,"_uHScroll",zd],[j,"_uCorner",c]],g=t(a.className,a.style.cssText+";overflow:hidden");





















g.innerHTML=i+h+j+'<div class="'+b.base+'-layout" style="position:relative;overflow:hidden"></div>';

a.style.cssText="position:absolute;top:0px;left:0px"+(h?";white-space:nowrap":"");
a.className=b.base+"-main";
N(g,a).lastChild.appendChild(a);

c.call(this,g,b);
this.$setBody(a);

this._bAbsolute=!(!b.absolute);
this._nWheelDelta=b.wheelDelta;


a=J(g);


for(;g=k[d++];)if(g[0])this[g[1]]=f(g[2],a[e++],this)},L=d(ob,c),










































bb=q.Edit=function(a,b){var 

d=a;if(a.tagName=="INPUT"){



a=t(d.className,d.style.cssText+";overflow:hidden");

d.className="";
d.style.cssText="border:0px";
N(a,d).appendChild(d)}else{


a.style.overflow="hidden";if(d=a.getElementsByTagName("input")[0])d.style.border="0px";else{




d=Db(null,b.name,b.input);
d.style.border="0px";
d.value=b.value||"";
a.appendChild(d)}}if(this._bHidden=b.hidden)d.style.display="none";





this._nLock=0;
this._eInput=d;
ad(a,"display","inline-block");
Vc(this);

c.call(this,a,b)},l=d(bb,c),O={},Gd=O.blur=function(a){var 












c=T(D(a).target);

c.$blur=b.$blur;
c.isEnabled()&&Nb(c);
delete c.$blur},jd=O.focus=function(a){var 









c=T(D(a).target);

c.$focus=b.$focus;

c.isEnabled()?qb(c):a.target.blur();
delete c.$focus},









































Bc=q.FormatEdit=function(a,b){


bb.call(this,a,b);

this._bSymbol=b.symbol!==false;
this._bTrim=b.trim!==false;
this._sEncoding=b.encoding;
this._oKeyMask=b.keyMask?new RegExp("["+b.keyMask+"]","g"):null;
this._nMinLength=b.minLength;
this._nMaxLength=b.maxLength;
this._nMinValue=b.minValue;
this._nMaxValue=b.maxValue;
this._oPattern=b.pattern?new RegExp("^"+b.pattern+"$"):null},eb=d(Bc,bb),


























Xd=q.Label=function(a,b){

c.call(this,a,b);

fc(this,this.setFor,b['for'])},Md=d(Xd,c),




































Ad=q.Checkbox=function(a,b){

b.hidden=true;
b.input="checkbox";

bb.call(this,a,b);
a=this.getInput();if(b.checked)a.checked=true;




this._aInferior=[];

fc(this,this.setSuperior,b.superior)},W=d(Ad,bb),




































tb=q.Radio=function(a,b){

b.hidden=true;
b.input="radio";

bb.call(this,a,b);
a=this.getInput();if(b.checked)a.checked=true;if(b=this.getName())(tb["ec-"+b]=tb["ec-"+b]||[]).push(this)},$=d(tb,bb),





























Q=q.Item=function(a,b){

a.onselectstart=pd;
a.style.overflow="hidden";
c.call(this,a,b)},ab=d(Q,c),p=q.Items={},

















































Vb=q.Select=function(a,b){

b.hidden=true;var 

d=0,k=a.name||b.name||"",j=a.value||b.value||"",i=a.options,e,h=[],g=t("ec-panel "+b.base+"-options","position:absolute;z-index:65535;display:none");if(i){














a=N(t(a.className,a.style.cssText),a);
I(a.nextSibling);


for(;e=i[d];d++)h[d]="<div "+sd()+'="value:'+Vd(e.value)+'">'+e.text+"</div>";




g.innerHTML=h.join("")}else pc(a,g);





a.innerHTML='<div class="ec-item '+b.type+'-text"></div><div class="ec-control '+b.type+'-button" style="position:absolute"></div><input name="'+k+'">';



bb.call(this,a,b);


e=this._uOptions=f(Cd,g,this,{hScroll:false});
this._cScroll=e.$getSection("VScroll");
this.$setBody(e.getBody());

a=J(a);

this._uText=f(Q,a[0],this,{capture:false});
this._uButton=f(c,a[1],this,{capture:false});
a[2].value=j;


this._nOptionSize=b.optionSize||5;
this._cSelected=false;

this.$initItems()},F=d(Vb,bb),Cd=Vb.Options=function(a,b){




ob.call(this,a,b)},_d=d(Cd,ob),ge=Vb.Item=function(a,b){



Q.call(this,a,b);
this._sValue=b.value===g?gd(a):""+b.value},ud=d(ge,Q),






































ne=q.Combox=function(a,b){

Vb.call(this,a,b);
this.getInput().style.display="";
this.$getSection("Text").getOuter().style.display="none"},pe=d(ne,Vb),



























zb=q.Grid=function(a,b){

c.call(this,a,b);

this._aItem=[];for(var 
d=0,g=J(a),e;e=g[d];)this._aItem[d++]=f(Jd,e,this)},ac=d(zb,c),Jd=zb.Item=function(a,b){







c.call(this,a,b)},vd=d(Jd,c),































Uc=q.Calendar=function(a,b){

c.call(this,a,b);for(var 


d=0,e=[],g=b.base;d<7;)e[d]='<div class="ec-grid-item '+g+'-name-item" style="float:left">'+["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"][d++]+"</div>";



e[d]='</div><div class="ec-grid '+g+'-date">';
for(;++d<50;)e.push('<div class="ec-grid-item '+g+'-date-item" style="float:left"></div>');



a.innerHTML='<div class="ec-grid '+g+'-name">'+e.join("")+"</div>";

this._uNames=f(zb,a.firstChild,this);
this._uDate=f(Dd,a.lastChild,this);

this.setDate(b.year,b.month)},kb=d(Uc,c),Dd=Uc.Date=function(a,b){




zb.call(this,a,b)},fe=d(Dd,zb),






































xc=q.Form=function(a,b){var 


d=t(a.className,a.style.cssText),e=jb(a);



d.innerHTML='<div class="ec-control '+b.base+'-title" onselectstart="return false" style="position:absolute"></div><div class="ec-control '+b.base+'-close" style="position:absolute"></div>';



c.call(this,d,b);

a.style.cssText="position:relative;overflow:"+H(a,"overflow");
a.className=b.base+"-main";
N(d,a).appendChild(a);


e&&e.tagName=="LABEL"&&pc(e,d=d.firstChild,true);

this._bHide=b.hide;
this._bTitleAuto=b.titleAuto!==false;


this._uTitle=f(Xc,d,this,{focus:false});


this._uClose=f(bd,d.nextSibling,this);


this.getOuter().style.zIndex=Ub.push(this)-1+4096},_=d(xc,c),Xc=xc.Title=function(a,b){




c.call(this,a,b)},Rd=d(Xc,c),bd=xc.Close=function(a,b){



c.call(this,a,b)},Zd=d(bd,c),Ub=[],




































db=q.Tree=function(a,b){var 

e=jb(a),h=this._aTree=[];


b=G(G({},b),getParameters(a));

c.call(this,a,b);if(e&&e.tagName=="LABEL"){for(var 





d=0,g=t(),i=J(a),f;f=i[d+1];){
g.appendChild(f);
h[d++]=yd(f,this,b)}


pc(e,a,true);
Kd(this,g);
Ac(g,a)}if(a.style.display=="none"||b.fold){




a.style.display="";
this.setFold()}else hc(this)},z=d(db,c),







































Td=q.RadioTree=function(a,b){

b=G(G({},b),getParameters(a));
this._sValue=a.getAttribute("value")||b.value;
this._sName=b.name;
db.call(this,a,b)},Bb=d(Td,db),






































de=q.CheckTree=function(a,b){

b=G(G({},b),getParameters(a));

db.call(this,a,b);

this._sSuperior=b.superior;var 

c=0,e=this._uCheckbox=f(Ad,a.insertBefore(t("ec-checkbox "+this.getBaseClass()+"-checkbox"),a.firstChild),this,b),d=this.getChildTrees();for(;a=d[c++];){









b=a._sSuperior;
a=a._uCheckbox;
b===g?a.setSuperior(e):b!==true&&fc(a,a.setSuperior,b)}},Pc=d(de,db),
























































Fb=q.Table=function(a,b){var 

d=0,l=this._aRow=[],p=this._aCol=[],n=jb(a),j=J(n),k=j[0],i,h;










I(n);
b.wheelDelta=1;
ob.call(this,a,b);if(k.tagName!="THEAD"){



a=N(t("","","thead"),k).appendChild((j=J(k)).shift());
k=m(a)}else{


j=J(j[1]);
a=Ud(k)}


n.setAttribute("cellSpacing","0");if(h=this._cVScroll=this.$getSection("VScroll"))h.setValue=Sc;if(h=this._cHScroll=this.$getSection("HScroll"))h.setValue=Sc;










h=t(b.type+"-area "+b.base+"-area","position:absolute;top:0px;overflow:hidden");



h.innerHTML='<div style="white-space:nowrap;position:absolute"><table cellspacing="0"><tbody></tbody></table></div>';
(this._uHead=f(c,this.getBase().appendChild(h),this)).$setBody(a);for(i=gc(this,"Row");h=j[d];d++){


h.className=b.type+"-row "+b.base+"-row "+h.className;
j[d]=jb(h);
(l[d]=f(i,h,this))._aCol=[]}for(d=0,(k=J(a));k[d];d++)for(i=0;l[i];i++){





h=j[i];if(l[i]._aCol[d]===g){

l[i]._aCol[d]=h;
j[i]=be(h);var 

e=r(h.getAttribute("rowSpan"))||1,o=r(h.getAttribute("colSpan"))||1;while(e--){



e||o--;
for(h=o;h--;)l[i+e]._aCol.push(e?false:null)}}}for(d=0;a=k[d];d++){








h=a.className.split(/\s+/);
h=h[0]||h[1]||b.base;
a.className=b.type+"-head "+h+"-head "+a.className;
h=b.type+"-item "+h+"-item ";

p[d]=f(qc,a,this);for(i=0;j=l[i];i++)if(a=j._aCol[d]){



a.className=h+a.className;
a.getControl=Mb}}




this.getBody().appendChild(n)},u=d(Fb,ob),Dc=Fb.Row=function(a,b){




c.call(this,a,b)},lb=d(Dc,c),qc=Fb.Col=function(a,b){



c.call(this,a,b)},bc=d(qc,c),ld=Fb.Cell=function(a,b){



c.call(this,a,b)},cc=d(ld,c),



















































Bd=q.LockedTable=function(a,b){

Fb.call(this,a,b);var 

d=0,i=this.getRows(),h=t("","position:absolute;top:0px;left:0px"),g=[],j=this._aLockedRow=[],e;






this._nLeft=b.leftLock||0;
this._nRight=this.getColCount()-(b.rightLock||0);for(;a=i[d];){



a=a.getBase();
g[d++]='<tr class="'+a.className+'" style="'+a.style.cssText+'"><td style="padding:0px;border:0px"></td></tr>'}



h.innerHTML='<div class="'+b.type+"-area "+b.base+'-area" style="overflow:hidden"><div style="white-space:nowrap;position:absolute"><table cellspacing="0"><thead><tr><td style="padding:0px;border:0px"></td></tr></thead></table></div></div><div class="'+b.type+"-layout "+b.base+'-layout" style="position:relative;overflow:hidden"><div style="white-space:nowrap;position:absolute;top:0px;left:0px"><table cellspacing="0"><tbody>'+g.join("")+"</tbody></table></div></div>";






e=this._uLockedHead=f(c,h.firstChild,this);
e.$setBody(e.getBase().lastChild.lastChild.firstChild.lastChild);
e._cJoint=this.$getSection("Head");
e._eFill=e.getBody().lastChild;

e=this._uLockedMain=f(c,a=h.lastChild,this);
e.$setBody(a=a.lastChild);

for(d=0,(g=J(a.lastChild.lastChild));e=g[d];)j[d]=Yc(this,e,i[d++]);


N(h,this.getBase().firstChild)},gb=d(Bd,Fb),le=Bd.Row=function(a,b){




Dc.call(this,a,b)},cd=d(le,Dc),













































Jb=q.Popup=function(a,b){

;



I(a);
a.style.display="none";
a.style.position="absolute";if(this._nOptionSize=b.optionSize){var 


d=t(a.className,a.style.cssText+";overflow:hidden");

a.style.cssText="position:absolute;top:0px;left:0px";
a.className=b.base+"-main";
d.innerHTML='<div class="ec-control '+b.base+'-prev" onselectstart="return false" style="position:absolute;top:0px;left:0px"></div><div class="ec-control '+b.base+'-next" onselectstart="return false" style="position:absolute"></div>';





c.call(this,d,b);
this.$setBody(a);

N(a,(a=J(d))[0]);
this._uPrev=f(Fc,a[0],this,{focus:false});
this._uNext=f(Fc,a[1],this,{focus:false})}else c.call(this,a,b);






this.$initItems()},R=d(Jb,c),Fc=Jb.Button=function(a,b){




c.call(this,a,b)},$c=d(Fc,c),Pd=Jb.Item=function(a,b){var 



c=jb(a);if(c&&c.tagName=="LABEL"){



pc(c,c=N(t(a.className,a.style.cssText),a),true);
a.className="ec-popup "+T(m(a)).getBaseClass();
this._cPopup=f(Jb,a,this,getParameters(a));
a=c}


Q.call(this,a,b);

this.setFocusable(false);
Nd(this)},mb=d(Pd,Q),V,
































Rc=q.Listbox=function(a,b){

b.hScroll=false;
b.vScroll=true;
this._sName=b.name||"";

ob.call(this,a,b);

this._cScroll=this.$getSection("VScroll");
this.$initItems()},nb=d(Rc,ob),me=Rc.Item=function(a,b){




Q.call(this,a,b);
a.appendChild(this._eInput=Db(null,b.parent._sName,"hidden")).value=b.value===g?gd(a):""+b.value;

this.setSelected(!(!b.selected))},ib=d(me,Q),


























ie=q.Progress=function(a,b){var 

d=a.innerHTML;

a.innerHTML='<div class="'+b.base+'-text" style="position:absolute;top:0px;left:0px"></div><div class="'+b.base+'-mask" style="position:absolute;top:0px;left:0px"></div>';

this._eText=a.firstChild;
this._eMask=a.lastChild;

c.call(this,a,b);

this.setText(b.rate||0,d)},Gc=d(ie,c),
























vb=a.Color=function(a){if(a)this.setRGB(X(a.substring(0,2),16),X(a.substring(2,4),16),X(a.substring(4,6),16));else this.setRGB(0,0,0)},fb=vb.prototype,










































dc=q.Palette=function(a,b){var 

d=1,g=C&&C<8?"display:inline;zoom:1":"display:inline-block",e=['<div class="'+b.base+'-left" style="float:left"><div class="ec-control '+b.base+'-image" style="position:relative;overflow:hidden"><div class="ec-control '+b.base+'-cross" style="position:absolute"><div></div></div></div></div><div class="'+b.base+'-mid" style="float:left"><div class="ec-control '+b.base+'-lightbar" style="position:relative">'];













for(;d<257;)e[d++]='<div style="height:1px;overflow:hidden"></div>';



e[d++]='<div class="ec-control '+b.base+'-arrow" style="position:absolute"><div></div></div></div></div><div class="'+b.base+'-right" style="float:left"><p>\u57fa\u672c\u989c\u8272</p><div class="'+b.base+'-basic" style="white-space:normal">';





for(;d<306;)e[d++]='<div class="ec-control '+b.base+'-area" style="'+g+";background:#"+Ld[d-259]+'"></div>';




e[d]='</div><table cellspacing="0" cellpadding="0" border="0"><tr><td class="'+b.base+'-color" rowspan="3"><div class="ec-control '+b.base+'-show"></div><input class="ec-edit '+b.base+'-value"></td><th>\u8272\u8c03:</th><td><input class="ec-edit '+b.base+'-edit"></td><th>\u7ea2:</th><td><input class="ec-edit '+b.base+'-edit"></td></tr><tr><th>\u9971\u548c\u5ea6:</th><td><input class="ec-edit '+b.base+'-edit"></td><th>\u7eff:</th><td><input class="ec-edit '+b.base+'-edit"></td></tr><tr><th>\u4eae\u5ea6:</th><td><input class="ec-edit '+b.base+'-edit"></td><th>\u84dd:</th><td><input class="ec-edit '+b.base+'-edit"></td></tr></table><div class="ec-control '+b.base+'-button">\u786e\u5b9a</div><div class="ec-control '+b.base+'-button">\u53d6\u6d88</div></div>';












a.innerHTML=e.join("");

c.call(this,a,b);


a=a.firstChild;
b=this._uMain=f(Sb,e=a.firstChild,this);
b._uIcon=f(Sb,e.lastChild,b,{capture:false});


a=a.nextSibling;
b=this._uLightbar=f(Sb,e=a.firstChild,this);
b._uIcon=f(Sb,e.lastChild,b,{capture:false});


a=J(a.nextSibling);
(this._uBasic=f(zb,a[1],this)).$click=Hd.$click;


e=a[2].getElementsByTagName("td");
this._uColor=f(c,e[0].firstChild,this);

this._aValue=[f(yc,e[0].lastChild,this)];
for(d=1;d<7;)this._aValue[d]=f(yc,e[d++].lastChild,this,{keyMask:"0-9",maxValue:255,maxLength:3});








this._uConfirm=f(Ic,a[3],this);
this._uCancel=f(Ic,a[4],this)},Yb=d(dc,c),Sb=dc.Area=function(a,b){




c.call(this,a,b)},fd=d(Sb,c),Ic=dc.Button=function(a,b){



c.call(this,a,b)},Hd=d(Ic,c),yc=dc.Edit=function(a,b){



Bc.call(this,a,b)},Tc=d(yc,Bc),Ld=["FF8080","FFFF80","80FF80","00FF80","80FFFF","0080F0","FF80C0","FF80FF","FF0000","FFFF00","80FF00","00FF40","00FFFF","0080C0","8080C0","FF00FF","804040","FF8040","00FF00","008080","004080","8080FF","800040","FF0080","800000","FF8000","008000","008040","0000FF","0000A0","800080","8000FF","400000","804000","004000","004040","000080","000040","400040","400080","000000","808000","808040","808080","408080","C0C0C0","400040","FFFFFF"],































U=Rb.Decorator=function(a,b){var 

c=a.getUID(),d=(this._oInner=U[c]||a).getOuter();


N(this._eOuter=t(this._sClass=b),d).appendChild(d);

U[c]=this;


G(a,Qb)},E=U.prototype,Qb={},
















Yd=Rb.LRDecorator=function(a,b){
U.call(this,a,b);
xb(this.getOuter(),"beforeEnd",'<div class="'+b+'-left" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-right" style="position:absolute;top:0px;left:0px"></div>')},


















ke=Rb.TBDecorator=function(a,b){
U.call(this,a,b);
xb(this.getOuter(),"beforeEnd",'<div class="'+b+'-top" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-bottom" style="position:absolute;top:0px;left:0px"></div>')},


















he=Rb.MagicDecorator=function(a,b){
U.call(this,a,b);
xb(this.getOuter(),"beforeEnd",'<div class="'+b+'-widget0" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-widget1" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-widget2" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-widget3" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-widget5" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-widget6" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-widget7" style="position:absolute;top:0px;left:0px"></div><div class="'+b+'-widget8" style="position:absolute;top:0px;left:0px"></div>')};Kb.prototype.stop=function(){


























clearTimeout(this._nID)};(function(){var 







b="ecui",N,O,bb,W,Q=[],F=[],A,z,R,X=false,E=[],v,_=0,K={},l,h=null,J=null,n=null,ab=[],d={mousedown:function(a){






























a=D(a);if(h=a.getTarget()){



u(h,"mousedown",a);
h.pressstart(a);for(a=h;a;a=a.getParent())if(a.isFocusable()){



a!=h&&a.contain(n)||qb(a);
break}}else qb()},mouseover:function(a){










a=D(a);var 

b=J,e=U(J=a.getTarget(),b),c=d.type;




c=c!="drag"&&c!="zoom"&&h&&(!e||e.contain(h));



u(b,"mouseout",a,e);
c&&h.contain(b)&&h.pressout(a);
u(J,"mouseover",a,e);
c&&h.contain(J)&&h.pressover(a)},mousemove:function(a){



a=D(a);var 

b=a.getTarget();


u(b,"mousemove",a);
h&&h.contain(b)&&h.pressmove(a)},mouseup:function(a){



a=D(a);var 

b=a.getTarget();

u(b,"mouseup",a);if(h){

h.pressend(a);

b==h&&h.click(a);
h=null}}},p={type:"drag",mousemove:function(a){








a=D(a);var 


b=d.target,g=A,f=z,h=b.getX()+g-d.x,i=b.getY()+f-d.y,e=w(k(h,d.left),d.right),c=w(k(i,d.top),d.bottom);









b.ondragmove&&b.ondragmove(a,e,c)===false||b.$dragmove(a,e,c)===false||b.setPosition(e,c);



d.x=g+b.getX()-h;
d.y=f+b.getY()-i},mouseup:function(a){



a=D(a);var 

b=d.target;
b.ondragend&&b.ondragend(a)===false||b.$dragend(a);
rb();

C&&B.body.releaseCapture(false);
d.mouseup(a)}},$={type:"forcibly",mousedown:function(a){







a=D(a);var 

b=d.target,e=d,c=a.getTarget();if(c&&!c.isFocusable()){





h=c;
u(h,"mousedown",a);
h.pressstart(a)}else if(b.onforcibly&&b.onforcibly(a)===false||b.$forcibly(a)===false)e!=d&&d.mousedown(a);else rb()}},M={type:"zoom",mousemove:function(a){















a=D(a);var 

b=d.target,c=d.width,e=d.height,f=d.width=A-d.x+c,h=d.height=z-d.y+e;









d.x=A;
d.y=z;

c=d.minWidth!==g?k(d.minWidth,f):f;


e=d.minHeight!==g?k(d.minHeight,h):h;


c=d.maxWidth!==g?w(d.maxWidth,c):c;


e=d.maxHeight!==g?w(d.maxHeight,e):e;




b.setPosition(c<0?d.left+c:d.left,e<0?d.top+e:d.top);



b.onzoom&&b.onzoom(a)===false||b.$zoom(a)===false||b.setSize(nd(c),nd(e))},mouseup:function(a){




a=D(a);var 

b=d.target;
b.onzoomend&&b.onzoomend(a)===false||b.$zoomend(a);
rb();
C&&B.body.releaseCapture(false);


b==l?b.hide():Pb();
d.mouseup(a)}};Kc=a.$bind=function(a,b){












a._cControl=b;
a.getControl=db};fc=a.$connect=function(a,b,c){if(c){var 













d=v[c];
d?b.call(a,d):(K[c]=K[c]||[]).push({func:b,caller:a})}};rc=a.$create=function(a,b){























b=b||{};var 

c=0,f=b.parent,e=b.id,g=b.element||t(),h=b.type,d=b.base||"";if(g.getControl)return g.getControl();












b.uid="ec-"+ ++_;

g.className+=" "+(h&&h!=a?h:b.type="ec-"+a.toLowerCase())+" "+d;if(!d){




d=g.className.split(/\s+/);
b.base=d[0]||d[1]}



a=new q[vc(a.charAt(0).toUpperCase()+a.slice(1))](g,b);if(f)a.setParent(f);else if(f=T(m(a.getOuter())))f.onappend&&f.onappend(a)===false||f.$append(a)===false||a.$setParent(f);else a.$setParent();













E.push(a);
a.create(b);if(e)v[e]=a;if(d=K[e])for(K[e]=null;e=d[c++];)e.func.call(e.caller,a);












return a};f=a.$fastCreate=function(a,b,c,d){var 














e=b.className.split(" ");

d=d||{};

d.uid="ec-"+ ++_;
d.type=e[0];
d.base=e[1];


a=new a(b,d);
a.$setParent(c);
a.create(d);

E.push(a);
return a};wd=a.$register=function(a,b){










Q.push(a,b)};nc=a.calcHeightRevise=function(a){











return N?r(a.borderTopWidth)+r(a.paddingTop)+r(a.paddingBottom)+r(a.borderBottomWidth):0};Ed=a.calcLeftRevise=function(a){var 














b=H(a.offsetParent),c=r(b.borderLeftWidth);


return O?c:mc&&b.overflow=="hidden"&&H(a,"position")=="absolute"?-c:0};Id=a.calcTopRevise=function(a){var 















b=H(a.offsetParent),c=r(b.borderTopWidth);


return O?c:mc&&b.overflow=="hidden"&&H(a,"position")=="absolute"?-c:0};lc=a.calcWidthRevise=function(a){















return N?r(a.borderLeftWidth)+r(a.paddingLeft)+r(a.paddingRight)+r(a.borderRightWidth):0};Od=a.create=function(a,b){




















a=rc(a,b);
a.cache();
a.init();
return a};oc=a.dispose=function(a){var 









b=0,e=a instanceof ecui.ui.Control,d={},c;





e?Nb(a):n&&_c(a,n.getOuter())&&qb(T(m(a)));for(c in v)d[v[c].getUID()]=c;for(;c=E[b++];)if(e?a.contain(c):_c(a,c.getOuter())){










c.dispose();
c=d[c.getUID()];
c&&delete v[c];
E.splice(--b,1)}};ec=a.drag=function(a,b,c){if(b.type=="mousedown"){var 




















d=a.getOuter(),f=d.offsetParent,e=H(f);



G(p,f.tagName=="BODY"||f.tagName=="HTML"?Cb():{top:0,right:f.offsetWidth-r(e.borderLeftWidth)-r(e.borderRightWidth),bottom:f.offsetHeight-r(e.borderTopWidth)-r(e.borderBottomWidth),left:0});





G(p,c);
p.right=k(p.right-a.getWidth(),p.left);
p.bottom=k(p.bottom-a.getHeight(),p.top);
p.target=a;
P(p);


e=d.style;
e.top=a.getY()+"px";
e.left=a.getX()+"px";
e.position="absolute";

C&&B.body.setCapture();
a.ondragstart&&a.ondragstart(b)===false||a.$dragstart(b)}};D=a.event=function(a){var 



















b=B.body,c=m(b);if(C){



a=wb.event;
a.pageX=c.scrollLeft+b.scrollLeft+a.clientX-b.clientLeft-c.clientLeft;
a.pageY=c.scrollTop+b.scrollTop+a.clientY-b.clientTop-c.clientTop;
a.target=a.srcElement;
a.which=a.keyCode;
a.stopPropagation=gb;
a.preventDefault=ib}


a.getTarget=hb;

A=a.pageX;
z=a.pageY;
R=a.which||R;

return a};T=a.findControl=function(a){











for(;a&&a.nodeType==1;a=m(a))if(a.getControl)return a.getControl();





return null};forcibly=a.forcibly=function(a){










$.target=a;
P($)};a.get=function(c){if(!v){for(f in d)cb(B,f,d[f]);

















v={};var 


e=B.body,f="data-ecui";


b=e.getAttribute(f)||b;

xb(e,"beforeEnd",'<div style="position:relative;width:8px;border:1px solid"><div></div></div>');




f=e.lastChild;
N=f.offsetWidth>8;
O=f.lastChild.offsetTop;
I(f);
cb(wb,"resize",Pb);
cb(wb,"unload",fb);


a.init(e);
X=true}

return v[c]||null};sd=a.getAttributeName=function(){










return b};dd=a.getFocused=function(){









return n||null};sc=a.getKey=function(){










return R};Hb=a.getMouseX=function(a){if(a){












a=a.getOuter();
return A-sb(a).left-r(H(a,"borderLeftWidth"))}

return A};Wb=a.getMouseY=function(a){if(a){












a=a.getOuter();
return z-sb(a).top-r(H(a,"borderTopWidth"))}

return z};getParameters=a.getParameters=function(a){var 










d=a.getAttribute(b),g={},f;if(d){




a.removeAttribute(b);
d=d.split(";");
f=d.length;for(;f--;){var 


c=d[f].split(/^\s+|\s*:\s*|\s+$/),h=c[0]||c[1],e=c[0]?c[1]:c[2];if(h){




c=e?+e:true;
g[vc(h)]=isNaN(c)?e=="true"||!e?true:e=="false"?false:e:c}}}





return g};md=a.getPressed=function(){










return h};xd=a.hasLoaded=function(){









return X};a.init=function(a){var 










b=0,i=0,d=a.getElementsByTagName("*"),h=[a],g=[],e,f;if(!bb++)Zb(wb,"resize",Pb);












for(;a=d[b++];)h[b]=a;for(b=0;a=h[b];b++)if(m(a)){





d=getParameters(a);
d.element=a;if(d.type)g[i++]=a=rc(d.type,d);for(e=0;f=Q[e];e+=2){





d[f]&&Q[e+1](a,d[f]);
a instanceof c&&a["$init"+f]&&a["$init"+f](d)}}





for(b=0;d=g[b++];)d.cache();


for(b=0;d=g[b++];)d.init();if(!(--bb))cb(wb,"resize",Pb)};Gb=a.isFixedSize=function(){















return N};Nb=a.loseFocus=function(a){










a.contain(n)&&qb(a.getParent())};S=a.mask=function(a,b){var 











c=0,e=B.body,d;if(a===false)for(;d=F[c++];)d.style.display="none";else if(a===true)for(;d=F[c++];){










d.style.display="";
Y(d)}else if(a===g){



I(F.pop());if(!F.length){

Jc(e,"mask");
Zb(wb,"scroll",V)}}else{if(!F.length){




Ec(e,"mask");
cb(wb,"scroll",V)}

F.push(d=e.appendChild(t("","position:absolute;top:0px;left:0px;background-color:#000;z-index:"+(b||32767))));



ad(d,"opacity",a);
Y(d)}};Pb=a.paint=function(){var 









a=0,b=B.body,c=[];if(C){if($d)do b=m(b);while(b.tagName!="HTML");










b=b.clientWidth;if(W!=b)W=b;else return}









b=d.type;
S(false);if(b!="zoom"){


b=="drag"&&d.mouseup();
for(;b=E[a++];)b.getParent()||b.isShow()&&c.push(b);for(a=0;b=c[a++];){



b.paint=Z;
b.resize();
delete b.paint}

for(a=0;b=c[a++];)b.cache(true,true);


for(a=0;b=c[a++];)b.$setSize(b.getWidth(),b.getHeight())}



C<8?new Kb(S,0,null,true):S(true)};a.query=function(a){














a=a||{};for(var 


b=0,h=[],e=a.type,f=a.parent,d=a.custom,c;c=E[b++];)if((!e||c instanceof e)&&(f===g||c.getParent()==f)&&(!d||d(c)))h.push(c);














return h};rb=a.restore=function(){








L(d,true);
L(d=ab.pop())};a.select=function(a,b,d){if(b.type=="mousedown"){if(!l){
















e=B.body;
xb(e,"beforeEnd",'<div class="ec-control ec-selector" style="overflow:hidden"><div class="ec-selector-box"></div></div>');




l=f(c,e.lastChild);

l.$setSize=eb;for(var 
g=3,i=["start","","end"];g--;){var 
e=i[g],h="select"+e;

l["$zoom"+e]=new Function("e","var o=this.target;o.on"+h+"&&o.on"+h+"(e)===false||o.$"+h+"(e)")}}








l.setPosition(A,z);
l.setSize(1,1);
l.setClass(d||"ec-selector"),l.show();

l.target=a;

hd(l,b)}};qb=a.setFocused=function(a){var 











b=U(n,a);


u(n,"blur",null,b);
u(n=a,"focus",null,b)};hd=a.zoom=function(a,b,c){if(b.type=="mousedown"){


















a.getOuter().style.position="absolute";


c&&G(M,c);
G(M,{left:a.getX(),top:a.getY(),width:a.getWidth(),height:a.getHeight()});





M.target=a;
P(M);

C&&B.body.setCapture();
a.onzoomstart&&a.onzoomstart(b)===false||a.$zoomstart(b)}};d.keydown=d.keypress=d.keyup=function(a){










a=D(a);for(var 
b=n;b;b=b.getParent())if(b[a.type](a)===false){

a.preventDefault();
break}};if(C)d.dblclick=function(a){












d.mousedown(a);
d.mouseup(a)};d[mc?"DOMMouseScroll":"mousewheel"]=function(a){










a=D(a);if(a.detail===g)a.detail=a.wheelDelta/-40;if(d.type=="drag"||u(J,"mousewheel",a)===false||u(n,"mousewheel",a)===false)a.preventDefault()};function u(a,b,c,d){






















for(;a!=d;a=a.getParent())if(a[b](c)===false)return false}function U(a,b){if(a!=b){var 
















c=0,d=[],e=[];while(a){





d.push(a);
a=a.getParent()}while(b){


e.push(b);
b=b.getParent()}


d.reverse();
e.reverse();


for(;d[c]==e[c];c++);
a=d[c-1]}


return a||null}function db(){









return this._cControl}function hb(){for(var 









a=T(this.target);a;a=a.getParent()){if(!a.isEnabled())break;if(a.isCapture())return a}







return null}function V(){







S(true)}function fb(){








F=B=null;for(var 
a=0,b;b=E[a++];)try{b.dispose()}catch(c){}}function ib(){













this.returnValue=false}function P(a){var 









b={};
L(d,true);

G(b,d);
G(b,a);
b.x=A;
b.y=z;
L(b);

ab.push(d);
d=b}function L(a,b){for(var 










c=0,e=b?Zb:cb,d;c<5;){
d=Ib[c++];
a[d]&&e(B,d,a[d])}}function Y(a){var 











b=Cb(),c=a.style;


c.top=b.top+"px";
c.left=b.left+"px";
c.width=b.right-b.left+"px";
c.height=b.bottom-b.top+"px"}function eb(a,b){var 










c=this.getOuter().firstChild,d=c.style;


q.Control.prototype.$setSize.call(this,a,b);
d.width=k(1,a-lc(c))+"px";
d.height=k(1,b-nc(c))+"px"}function gb(){







this.cancelBubble=true}


Sd(a.get)})();b.$blur=function(){


















































this.alterClass("focus",true)};b.$cache=function(a,b){for(var 












c=0,e=this._eBase,f=Gb(),g=["borderTopWidth","borderLeftWidth","borderRightWidth","borderBottomWidth","paddingTop","paddingLeft","paddingRight","paddingBottom"],d;d=g[c++];)this["$cache$"+d]=r(a[d]);












this.$cache$position=a.position;if(b!==false){



d=e.style;
this._nWidth=e.offsetWidth||r(a.width||d.width)+(f?this.getInvalidWidth(true):0);

this._nHeight=e.offsetHeight||r(a.height||d.height)+(f?this.getInvalidHeight(true):0)}};b.$dispose=function(){










this._eBase.getControl=g;
this._eBase=this._eBody=null};b.$focus=function(){








this.alterClass("focus")};b.$getSection=function(a){











return this["_u"+a]};b.$hide=function(){if(this._sDisplay===g){var 








a=this.getOuter().style;

this._sDisplay=a.display;
a.display="none";

Nb(this)}};b.$init=function(){









this.setEnabled(this._bEnabled);
this.$setSize(this.getWidth(),this.getHeight());if(this.$ready)if(xd())this.$ready();else{if(!Xb){







Xb=[];new Kb(
function(){for(var 
a=0,b;b=Xb[a++];)b.$ready();


Xb=null})}


Xb.push(this)}};









b.$locate=function(){if(this.$cache$position!="absolute")this._eBase.style.position=this.$cache$position="relative"};b.$mouseout=function(){













this.alterClass("over",true)};b.$mouseover=function(){










this.alterClass("over")};b.$pressend=b.$pressout=function(){










this.alterClass("press",true)};b.$pressover=b.$pressstart=function(){










this.alterClass("press")};b.$resize=function(){







this._eBase.style.width=this._sWidth;if(C<8&&H(this._eBase,"width")=="auto"){

this._eBase.style.width="100%";
this._eBase.style.width=this._eBase.offsetWidth-(Gb()?this.getInvalidWidth(true)*2:0)+"px"}


this._eBase.style.height=this._sHeight;
this.paint()};b.$setBody=function(a){










this._eBody=a};b.$setBodyHTML=function(a){









this._eBody.innerHTML=a};b.$setParent=function(a){










this._cParent=a};b.$setSize=function(a,b){var 











c=this._eBase.style,d=Gb();if(a){



c.width=a-(d?this.getInvalidWidth(true):0)+"px";
this._nWidth=a}if(b){



c.height=b-(d?this.getInvalidHeight(true):0)+"px";
this._nHeight=b}};b.$show=function(){








this.getOuter().style.display=this._sDisplay||"";
this._sDisplay=g};b.alterClass=function(a,b){










(b?Jc:Ec)(this._eBase,this._sClass+"-"+a+" "+this._sType+"-"+a)};b.cache=function(a,b){if(b||!this._bCache){















this._bCache=true;
this.$cache(H(this._eBase),a)}};b.clearCache=function(){









this._bCache=false};b.contain=function(a){











for(;a;a=a._cParent)if(a==this)return true;




return false};b.dispose=function(){try{this.ondispose&&this.ondispose()}catch(a){}













this.$dispose()};b.getBase=function(){










return this._eBase};b.getBaseClass=function(){










return this._sBaseClass};b.getBody=function(){










return this._eBody};b.getBodyHeight=function(){










return this.getHeight(true)-this.getInvalidHeight(true)};b.getBodyWidth=function(){










return this.getWidth(true)-this.getInvalidWidth(true)};b.getClass=function(){










return this._sClass};b.getHeight=function(){









this.cache();
return this._nHeight};b.getInvalidHeight=function(){









this.cache();
return this.$cache$borderTopWidth+this.$cache$paddingTop+this.$cache$paddingBottom+this.$cache$borderBottomWidth};b.getInvalidWidth=function(){










this.cache();
return this.$cache$borderLeftWidth+this.$cache$paddingLeft+this.$cache$paddingRight+this.$cache$borderRightWidth};b.getOuter=function(){











return this._eBase};b.getParent=function(){









return this._cParent||null};b.getType=function(){










return this._sType};b.getUID=function(){










return this._sUID};b.getWidth=function(){









this.cache();
return this._nWidth};b.getX=function(){var 










a=this.getOuter();

return this.isShow()?a.offsetLeft-Ed(a):0};b.getY=function(){var 










a=this.getOuter();

return this.isShow()?a.offsetTop-Id(a):0};









b.hide=function(){if(this.isShow())this.onhide&&this.onhide()===false||this.$hide()};b.isCapture=function(){













return this._bCapture};b.isEnabled=function(){var 










a=this._cParent;

return this._bEnabled&&(!a||a.isEnabled())};b.isFocusable=function(){










return this._bFocusable};b.isShow=function(){









return!(!this.getOuter().offsetWidth)};b.paint=function(){








this.cache(true,true);
this.$setSize(this.getWidth(),this.getHeight())};b.setBodySize=function(a,b){











this.setSize(a&&a+this.getInvalidWidth(),b&&b+this.getInvalidHeight())};b.setCapture=function(a){










this._bCapture=a!==false};b.setClass=function(a){var 










b=0,e=this._eBase,c=[],d=this._sType,f=this._sClass;





a=a||d;if(a!=f){e.className.replace(new RegExp("(^|\\s)"+f+"(-[^\\s]+)","g"),




function(b,e,f){
c.push(d+f);
d!=a&&c.push(a+f)});



c.push(d);
d!=a&&c.push(a);

e.className=c.join(" ");
this._sClass=a}},(b.setEnabled=function(a){











a=a!==false;if(this._bEnabled!=a){



this.alterClass("disabled",a);

a||Nb(this);
this._bEnabled=a}});b.setFocusable=function(a){











this._bFocusable=a!==false};b.setParent=function(a){var 










b=this._cParent,e=this.getOuter(),d;if(a)if(a instanceof c)d=a._eBody;else{









d=a;
a=T(a)}if(a!=b||d!=m(e)){if(b){






b.onremove&&b.onremove(this);
b.$remove(this)}if(a){if(a.onappend&&a.onappend(this)===false||a.$append(this)===false)a=d=null};







d?d.appendChild(e):I(e);
this.$setParent(a);
this.clearCache()}};b.setPosition=function(a,b){var 












c=this.getOuter().style;
c.left=a+"px";
c.top=b+"px"};b.setSize=function(a,b){










this.$setSize(a,b);if(a)this._sWidth=a+"px";if(b)this._sHeight=b+"px"};













b.show=function(){if(!this.isShow())this.onshow&&this.onshow()===false||this.$show()};(function(){for(var 








a=0,c;c=Ib[a++];){
b[c]=new Function("e","var o=this;if("+(a<17?"o.isEnabled()&&":"")+"(o.on"+c+"&&o.on"+c+"(e)===false||o.$"+c+"(e)===false))return false");




b["$"+c]=b["$"+c]||Z}



b.$forcibly=b.$append=b.$remove=b.$selectstart=b.$select=b.$selectend=b.$zoomstart=b.$zoom=b.$zoomend=b.$dragstart=b.$dragmove=b.$dragend=Z})();function Tb(a){var 



































b=a._oTimer;
b&&b.stop()}Cc.$dragmove=function(a,c,d){











b.$dragmove.call(this,a,c,d);var 

e=this.getParent(),f=e.$calcDragValue(c,d);



e.$setValue(f==e._nTotal?f:f-f%e._nStep);
e.scroll()};Cc.$pressstart=function(a){









b.$pressstart.call(this,a);

ec(this,a,this._oRange);


a.preventDefault()};Cc.setRange=function(a,b,c,d){












this._oRange={top:a,right:b,bottom:c,left:d}};_b.$pressend=function(a){














b.$pressend.call(this,a);
Tb(this.getParent())};_b.$pressout=function(a){









b.$pressout.call(this,a);
Tb(this.getParent())};_b.$pressover=function(a){









b.$pressover.call(this,a);
this.move(k(this.getParent()._nStep,5))};_b.$pressstart=function(a){









b.$pressstart.call(this,a);
this.move(k(this.getParent()._nStep,5));


a.preventDefault()};_b.move=function(a){var 









b=this.getParent(),c=b._uPrev==this;


Tb(b);if(c&&b._nValue||!c&&b._nValue<b._nTotal){


c?b.$allowPrev()&&b.setValue(b._nValue-a):b.$allowNext()&&b.setValue(b._nValue+a);


b._oTimer=new Kb(this.move,200,this,a)}};v.$cache=function(a,c){












b.$cache.call(this,a,c);

this._uPrev.cache(true,true);
this._uNext.cache(true,true);
this._uBlock.cache(true,true)};v.$hide=function(){








v.setValue.call(this,0);
return b.$hide.call(this)};v.$init=function(){








this._uPrev.$init();
this._uNext.$init();
this._uBlock.$init();
b.$init.call(this)};v.$pressend=function(a){










b.$pressend.call(this,a);
Tb(this)};v.$pressout=function(a){










b.$pressout.call(this,a);
Tb(this)};v.$pressover=function(a){










b.$pressover.call(this,a);
this._cButton.move(this.$getPageStep())};v.$pressstart=function(a){










b.$pressstart.call(this,a);

(this._cButton=this.$allowPrev()?this._uPrev:this._uNext).move(this.$getPageStep());


a.preventDefault()};v.$setPageStep=function(a){









this._nPageStep=a};v.$setSize=function(a,c){










b.$setSize.call(this,a,c);
this.$locate()};v.$setValue=function(a){










this._nValue=a};v.getStep=function(){










return this._nStep};v.getTotal=function(){










return this._nTotal};v.getValue=function(){










return this._nValue};v.scroll=function(){var 








a=this.getParent();
this.change();
a&&(a.onscroll&&a.onscroll(this)===false||a.$scroll(this))};









v.setStep=function(a){if(a>0)this._nStep=a};v.setTotal=function(a){if(a>=0&&this._nTotal!=a){














this._nTotal=a;if(this._nValue>a){



this._nValue=a;
this.scroll()}

this.$flush()}};v.setValue=function(a){











a=w(k(0,a),this._nTotal);if(this._nValue!=a){


this._nValue=a;
this.scroll();
this.$flush()}};v.skip=function(a){











this.setValue(this._nValue+a*this._nStep)};Eb.$allowNext=function(){var 











a=this._uBlock;
return Wb(this)>a.getY()+a.getHeight()};Eb.$allowPrev=function(){










return Wb(this)<this._uBlock.getY()};Eb.$calcDragValue=function(a,b){var 











c=this._uBlock,d=c._oRange;

return(b-d.top)/(d.bottom-this._uPrev.getHeight()-c.getHeight())*this._nTotal};Eb.$flush=function(){var 









a=this._uBlock,c=this._nTotal,e=this.getHeight(),d=this._uPrev.getHeight(),b=this.getBodyHeight(),f=k(P(b*e/(e+c)),a.getInvalidHeight()+5);if(c){







a.$setSize(0,f);
a.setPosition(0,d+P(this._nValue/c*(b-f)));
a.setRange(d,0,b+d,0)}};Eb.$getPageStep=function(){var 











a=this.getHeight();
return this._nPageStep||a-a%this._nStep};Eb.$setSize=function(a,b){










v.$setSize.call(this,a,b);var 

c=this.getBodyWidth(),d=this.$cache$paddingTop;




this._uPrev.$setSize(c,d);
this._uNext.$setSize(c,this.$cache$paddingBottom);
this._uBlock.$setSize(c);
this._uNext.setPosition(0,this.getBodyHeight()+d);

this.$flush()};Ab.$allowNext=function(){var 











a=this._uBlock;
return Hb(this)>a.getX()+a.getWidth()};Ab.$allowPrev=function(){










return Hb(this)<this._uBlock.getX()};Ab.$calcDragValue=function(a,b){var 











c=this._uBlock,d=c._oRange;

return(a-d.left)/(d.right-this._uPrev.getWidth()-c.getWidth())*this._nTotal};Ab.$flush=function(){var 









a=this._uBlock,b=this._nTotal,e=this.getWidth(),d=this._uPrev.getWidth(),c=this.getBodyWidth(),f=k(P(c*e/(e+b)),a.getInvalidWidth()+5);if(b){







a.$setSize(f);
a.setPosition(d+P(this._nValue/b*(c-f)),0);
a.setRange(0,c+d,0,d)}};Ab.$getPageStep=function(){var 











a=this.getWidth();
return a-a%this._nStep};Ab.$setSize=function(a,b){










v.$setSize.call(this,a,b);var 

c=this.getBodyHeight(),d=this.$cache$paddingLeft;




this._uPrev.$setSize(d,c);
this._uNext.$setSize(this.$cache$paddingRight,c);
this._uBlock.$setSize(0,c);
this._uNext.setPosition(this.getBodyWidth()+d,0);

this.$flush()};L.$cache=function(a,c){







































b.$cache.call(this,a,c);var 

e=this.getBody(),h=e.offsetWidth,g=e.offsetHeight;if(this._bAbsolute){for(var 






d=0,f=sb(e),j=f.left,i=f.top,l=e.getElementsByTagName("*");a=l[d++];)if(a.offsetWidth&&H(a,"position")=="absolute"){








f=sb(a);
h=k(h,f.left-j+a.offsetWidth);
g=k(g,f.top-i+a.offsetHeight)}}




this.$cache$mainWidth=h;
this.$cache$mainHeight=g;

a=H(m(e));
this.$cache$layoutWidthRevise=lc(a);
this.$cache$layoutHeightRevise=nc(a);

(c=this._uVScroll)&&c.cache(true,true);
(c=this._uHScroll)&&c.cache(true,true);
(c=this._uCorner)&&c.cache(true,true)};L.$init=function(){








this._uVScroll&&this._uVScroll.$init();
this._uHScroll&&this._uHScroll.$init();
this._uCorner&&this._uCorner.$init();
b.$init.call(this)};L.$keydown=L.$keypress=function(a){var 










b=sc(),c=b%2,d=c?this._uHScroll:this._uVScroll;if(b>=37&&b<=40&&!a.target.value){




d&&d.skip(b+c-39);
return false}};L.$mousewheel=function(a){











c=this._uVScroll;if(c&&c.isShow()){var 



b=c.getValue(),d=this._nWheelDelta||P(20/c.getStep())||1,c;


c.skip(a.detail>0?d:-d);
return b==c.getValue()}};L.$scroll=function(){var 









a=this.getBody().style;
a.left=-k(this.getScrollLeft(),0)+"px";
a.top=-k(this.getScrollTop(),0)+"px"};L.$setSize=function(a,c){











b.$setSize.call(this,a,c);
this.$locate();var 

d=this.$cache$paddingLeft+this.$cache$paddingRight,q=this.$cache$paddingTop+this.$cache$paddingBottom,i=this.getBodyWidth(),g=this.getBodyHeight(),n=this.$cache$mainWidth,k=this.$cache$mainHeight,e=this._uVScroll,f=this._uHScroll,h=this._uCorner,r=e&&e.getWidth(),s=f&&f.getHeight(),j=i-r,l=g-s,p=j+d,o=l+q;
















e&&e.setPosition(p,0);
f&&f.setPosition(0,o);
h&&h.setPosition(p,o);if(n<=i&&k<=g){



e&&e.$hide();
f&&f.$hide();
h&&h.$hide()}else for(;;){if(h){if(n>j&&k>l){






f.$setSize(p);
f.setTotal(n-j);
f.$show();
e.$setSize(0,o);
e.setTotal(k-l);
e.$show();
h.$setSize(r,s);
h.$show();
i=j;
g=l;
break}

h.$hide()}if(f)if(n>i){




f.$setSize(i+d);
f.setTotal(n-i);
f.$show();
e&&e.$hide();
g=l}else f.$hide();if(e)if(k>g){








e.$setSize(0,g+q);
e.setTotal(k-g);
e.$show();
f&&f.$hide();
i=j}else e.$hide();





break}



i-=this.$cache$layoutWidthRevise;
g-=this.$cache$layoutHeightRevise;

e&&e.$setPageStep(g);
f&&f.$setPageStep(i);


h=m(this.getBody()).style;
h.width=i+"px";
h.height=g+"px"};L.getScrollLeft=function(){var 










a=this._uHScroll;
return a?a.getValue():-1};L.getScrollTop=function(){var 










a=this._uVScroll;
return a?a.getValue():-1};function je(a){































a=D(a);for(var 

b=0,d=a.target.elements,c;c=d[b++];)if(c.getControl){

c=c.getControl();
c instanceof bb&&(c.onsubmit&&c.onsubmit(a)===false||c.$submit(a))}}function Vc(a){











Kc(a._eInput,a);if(!a._bHidden)for(var b in O)cb(a._eInput,b,O[b])}O.dragover=O.drop=function(a){















a=D(a);
a.stopPropagation();
a.preventDefault()};O.keydown=O.keypress=O.keyup=function(a){









a=D(a);
a.stopPropagation();
return T(a.target)[a.type](a)};O.paste=function(a){










a=D(a);
T(a.target).$keydown(a)};if(C)O.propertychange=function(a){if(a.propertyName=="value"){












a=T(D(a).target);if(!a._nLock){

a._nLock++;
a.change();
a._nLock--}}};else O.input=function(){






T(this).change()};l.$blur=function(){









b.$blur.call(this);var 

a=this._eInput;
Zb(a,"blur",Gd);try{a.blur()}catch(c){}





cb(a,"blur",Gd)};l.$dispose=function(){








this._eInput.getControl=g;
this._eInput=null;
b.$dispose.call(this)};l.$focus=function(){








b.$focus.call(this);var 

a=this._eInput;
Zb(a,"focus",jd);try{a.focus()}catch(c){}





cb(a,"focus",jd)};l.$setParent=function(a){for(var 









c=this.getOuter();c;c=m(c))if(c.tagName=="FORM"){if(!c.getControl){


cb(c,"submit",je);
c.getControl=Z}

break}


b.$setParent.call(this,a)};l.$setSize=function(a,c){










b.$setSize.call(this,a,c);var 
d=this._eInput.style;
d.width=this.getBodyWidth()+"px";
d.height=this.getBodyHeight()+"px"};








l.$submit=Z;l.getInput=function(){








return this._eInput};l.getName=function(){










return this._eInput.name};l.getSelectionEnd=C?function(){var 









a=B.selection.createRange().duplicate(),b=this._eInput.value.length;


a.moveStart("character",-b);
return a.text.length}:function(){

return this._eInput.selectionEnd};l.getSelectionStart=C?function(){var 









a=B.selection.createRange().duplicate(),b=this._eInput.value.length;


a.moveEnd("character",b);
return b-a.text.length}:function(){

return this._eInput.selectionStart};l.getValue=function(){










return this._eInput.value};l.setCaret=C?function(a){var 









b=this._eInput.createTextRange();
b.collapse();
b.select();
b.moveStart("character",a);
b.collapse();
b.select()}:function(a){

this._eInput.setSelectionRange(a,a)};l.setEnabled=function(a){









b.setEnabled.call(this,a);

this._eInput.readOnly=!a};l.setName=function(a){










this._eInput=Db(this._eInput,a||"");
Vc(this)};l.setValue=function(a){










this._nLock++;
this._eInput.value=a;
this._nLock--};function Hc(a,b){

































return (b?a.replace(/[^\x00-\xff]/g,b=="utf8"?"aaa":"aa"):a).length}eb.$blur=function(){








l.$blur.call(this);
this.validate()};eb.$getInputText=function(){









return this._sInput};eb.$keydown=function(a){var 










b=this.getInput().value,c=this.getSelectionStart(),d=this.getSelectionEnd();



this._sLeft=b.slice(0,c);
this._sRight=b.slice(d);
this._sSelection=b.slice(c,d);

l.$keydown.call(this,a)};eb.$submit=function(a){









l.$submit.call(this,a);
this.validate()||a.preventDefault()};eb.change=function(){var 








a=this.getValue(),k=this._oKeyMask,c=this._nMaxLength,j=this._nMaxValue,f=this._sEncoding,e=this._sLeft||"",d=this._sRight||"",m=this._sSelection||"",h=e.length,i=a.length-d.length,b=i<0?"":a.slice(h,i);if(b){if(this._bSymbol)b=ce(b);if(k)b=(b.match(k)||[]).join("");if(this._bTrim)b=Wc(b);if(c>0){






























c-=Hc(e,f)+Hc(d,f);
b=f?ae(b,c):b.slice(0,c)}if(!b){



this.restore();
return}if(j!==g&&!(j>=+(e+b+d)))b=m;







this._sInput=b;
this.setValue(e+b+d);
this.setCaret(h+b.length)}

l.change.call(this)};eb.restore=function(){var 







a=this._sLeft||"";

this.setValue(a+(this._sSelection||"")+(this._sRight||""));
this.setCaret(a.length)};eb.validate=function(){var 









a=[],g=this._nMinLength,c=this._nMaxLength,d=this._nMinValue,e=this._nMaxValue,h=this._oPattern,b=this.getValue(),f=Hc(b,this._sEncoding);








g>f&&a.push(["minLength",g]);
c<f&&a.push(["maxLength",c]);
d>+b&&a.push(["minValue",d]);
e<+b&&a.push(["maxValue",e]);
h&&!h.test(b)&&a.push(["pattern"]);

b=!a[0];
b||this.onerror&&this.onerror(a);
return b};Md.$click=function(a){





















;
this._cFor&&this._cFor.click(a)};Md.setFor=function(a){










this._cFor=a};function zc(a,b){var 

































c=a._cSuperior;if(b!==a._nStatus){



a.setClass(a.getBaseClass()+["-checked","","-part"][b]);

a._nStatus=b;
a.getInput().checked=!b;


c&&Nc(c);

a.change();
return true}

return false}function Nc(a){for(var 









b=0,d,c;d=a._aInferior[b];){if(b++&&c!=d._nStatus){

c=2;
break}

c=d._nStatus}


b&&zc(a,c)}W.$click=function(a){










l.$click.call(this,a);

this.setChecked(!(!this._nStatus))};W.$keydown=W.$keypress=W.$keyup=function(a){if(l["$"+a.type](a)===false)return false;if(a.which==32){














a.type=="keyup"&&this.$click(a);
return false}};W.$ready=function(){









this._aInferior.length||zc(this,this.getInput().checked?0:1)};W.getInferiors=function(){










return this._aInferior.slice()};W.getSuperior=function(){










return this._cSuperior||null};W.isChecked=function(){









return!this._nStatus};W.setChecked=function(a){if(zc(this,a!==false?0:1))for(var 











b=0,c;c=this._aInferior[b++];)c.setChecked(a)};W.setParent=function(a){













l.setParent.call(this,a);
this.getParent()||this.setSuperior()};W.setSuperior=function(a){var 










b=this._cSuperior;
this._cSuperior=a;if(b){



pb(b._aInferior,this);
Nc(b)}if(a){



a._aInferior.push(this);
Nc(a)}};function kc(a,b){if(b!==g)a.getInput().checked=b;



































a.setClass(a.getBaseClass()+(a.isChecked()?"-checked":""))}$.$click=function(a){










l.$click.call(this,a);
this.checked()};$.$dispose=function(){








this.setName();
l.$dispose.call(this)};$.$keydown=$.$keypress=$.$keyup=function(a){if(l["$"+a.type](a)===false)return false;if(a.which==32){














a.type=="keyup"&&this.$click(a);
return false}};$.$ready=function(){









kc(this)};$.checked=function(){if(!this.isChecked()){for(var 









a=0,c=this.getItems(),b;b=c[a++];)kc(b,false);


kc(this,true)}};$.getItems=function(){var 











a=this.getName();
return a?tb["ec-"+a].slice():[this]};$.isChecked=function(){









return this.getInput().checked};$.setName=function(a){var 










b=this.getName(),c=tb["ec-"+b];if(a!=b){




b&&pb(c,this);if(a){




kc(this,false);
(tb["ec-"+a]=tb["ec-"+a]||[]).push(this)}


l.setName.call(this,a)}};



















ab.$mouseout=Z;ab.$mouseover=function(a){









this.getParent().$setOvered(this)};ab.$pressstart=function(a){









b.$pressstart.call(this,a);
a.preventDefault()};p.$append=function(a){if(!(a instanceof Q)||$b(this,"$append").call(this,a)===false)return false;















p[this.getUID()].push(a);
this.$alterItems()};p.$cache=function(a,b){











$b(this,"$cache").call(this,a,b);for(var 

c=0,e=p[this.getUID()],d;d=e[c++];)d.cache(false,true)};p.$init=function(){










$b(this,"$init").call(this);
this.$alterItems()};p.$initItems=function(){








this.$alterItems=Z;


p[this.getUID()]=[];for(var 


a=0,c=J(this.getBody()),b;b=c[a++];)this.add(b);



delete this.$alterItems};p.$remove=function(a){










$b(this,"$remove").call(this,a);
pb(p[this.getUID()],a);
this.$alterItems()};p.$setOvered=function(a){var 










c=p[this.getUID()]._cOver;if(c!=a){



c&&b.$mouseout.call(c);
a&&b.$mouseover.call(a);
p[this.getUID()]._cOver=a}};p.add=function(a,b,c){var 














d=p[this.getUID()],e="ec-item "+this.getClass()+"-item ";if(a instanceof Q)a.setParent(this);else{if("string"==typeof a){









this.getBody().appendChild(e=t(e));
e.innerHTML=a;
a=e}else a.className=e+a.className;





c=c||getParameters(a);
c.parent=this;
d.push(a=f(gc(this,"Item")||Q,a,this,c));
this.$alterItems()}if(a.getParent()&&(e=d[b])&&e!=a){




N(a.getOuter(),e.getOuter());
d.splice(b,0,d.pop())}


return a};p.append=function(a,b){












this.add(a,g,b)};p.dispose=function(){








$b(this,"dispose").call(this);
delete p[this.getUID()]};p.getItems=function(){









return p[this.getUID()].slice()};p.getOvered=function(){










return p[this.getUID()]._cOver||null};p.remove=function(a){if("number"==typeof a)a=p[this.getUID()][a];













a&&a.setParent();
return a||null};p.setItemSize=function(a,b){for(var 










c=0,e=p[this.getUID()],d;d=e[c++];)d.$setSize(a,b)};function qd(a){var 














































b=a._uOptions,f=a._cScroll,c=sb(a.getOuter()),d=a._cSelected,e=c.top+a.getHeight();if(!m(b.getOuter())){








B.body.appendChild(b.getOuter());
a.$alterItems()}if(b.isShow()){



a.$setOvered(d);
f.setValue(f.getStep()*Y(a.getItems(),d));


a=b.getHeight();


b.setPosition(c.left,e+a<=Cb().bottom?e:c.top-a)}}






G(F,p);_d.$dispose=function(){if(this.isShow()){









S();
rb()}

I(this.getOuter());
L.$dispose.call(this)};ud.getValue=function(){










return this._sValue};ud.setValue=function(a){var 










b=this.getParent();
this._sValue=a;
b&&b._cSelected==this&&l.setValue.call(b,a)};F.$alterItems=function(){var 








a=this._uOptions,f=this._cScroll,d=this._nOptionSize,b=this.getBodyHeight(),e=this.getWidth(),c=this.getItems().length;if(m(a.getOuter())){








f.setStep(b);


this.setItemSize(e-a.getInvalidWidth()-(c>d?f.getWidth():0),b);





a.cache(false,true);
a.$setSize(e,(w(c,d)||1)*b+a.getInvalidHeight())}};F.$cache=function(a,b){












(m(this._uOptions.getOuter())?p:l).$cache.call(this,a,b);
this._uText.cache(false,true);
this._uButton.cache(false,true)};F.$forcibly=function(a){var 










b=a.getTarget();
this._uOptions.hide();
S();if(b instanceof Q&&b.getParent()==this&&b!=this._cSelected){



this.setSelected(b);
this.change()}};F.$keydown=F.$keypress=function(a){if(l["$"+a.type](a)===false)return false;var 















b=this._uOptions,f=this._cScroll,g=this._nOptionSize,c=a.which,d=this.getItems(),e=d.length,h=this.getOvered();if(md()!=this){if(c==40||c==38){if(e)if(b.isShow()){













this.$setOvered(d[c=w(k(0,Y(d,h)+c-39),e-1)]);
c-=f.getValue()/f.getStep();
f.skip(c<0?c:c>=g?c-g+1:0)}else this.setSelected(w(k(0,Y(d,this._cSelected)+c-39),e-1));





return false}else if(c==27||c==13&&b.isShow()){



c==13&&this.setSelected(h);
b.hide();
S();
rb();
return false}}};F.$mousewheel=function(a){var 












b=this._uOptions,c=this.getItems(),d=c.length;



b.isShow()?b.$mousewheel(a):this.setSelected(d?w(k(0,Y(c,this._cSelected)+(a.detail>0?1:-1)),d-1):null);




return false};F.$pressend=function(a){










l.$pressend.call(this,a);

forcibly(this);
S(0,65534)};F.$pressstart=function(a){










l.$pressstart.call(this,a);
this._uOptions.show();
qd(this)};F.$ready=function(){








this.setValue(this.getValue())};F.$remove=function(a){










this._cSelected==a&&this.setSelected();
p.$remove.call(this,a)};F.$setSize=function(a,b){










;

l.$setSize.call(this,a,b);
this.$locate();
b=this.getBodyHeight();


this._uText.$setSize(a=this.getBodyWidth()-b,b);


this._uButton.$setSize(b,b);
this._uButton.setPosition(a,0)};F.getSelected=function(){









return this._cSelected||null};F.setOptionSize=function(a){










this._nOptionSize=a;
this.$alterItems();
qd(this)};F.setSelected=function(a){if("number"==typeof a)a=this.getItems()[a];if(this._cSelected!==a){















this._uText.$setBodyHTML(a?a.getBody().innerHTML:"");
l.setValue.call(this,a?a._sValue:"");
this._cSelected=a;
this._uOptions.isShow()&&this.$setOvered(a)}};F.setValue=function(a){for(var 











b=0,d=this.getItems(),c;c=d[b++];)if(c._sValue==a){

this.setSelected(c);
return}




this.setSelected()};pe.$setSize=function(a,b){





































F.$setSize.call(this,a,b);
this.getInput().style.width=this.$getSection("Text").getWidth()+"px"};vd.getIndex=function(){


























return Y(this.getParent()._aItem,this)};ac.$cache=function(a,c){











b.$cache.call(this,a,c);


for(a=0;c=this._aItem[a++];)c.cache(false,true)};ac.getItem=function(a){













return this._aItem[a]};(function(){for(var 








a=0,b;a<13;){
b=Ib[a++];
ac[b]=Z;
vd[b]=new Function("e","var o=this,p=o.getParent();o.isEnabled()&&(p.on"+b+"&&p.on"+b+".call(o,e)===false||p.$"+b+".call(o,e))")}})();fe.$click=function(a){



































ac.$click.call(this,a);var 
b=this.getParent().getParent();
b.ondateclick&&b.ondateclick(new Date(b._nYear,b._nMonth,this._nDay))};kb.$cache=function(a,c){











b.$cache.call(this,a,c);
this._uNames.cache(true,true);
this._uDate.cache(true,true)};kb.$init=function(){








this._uNames.$init();
this._uDate.$init();
b.$init.call(this)};kb.$setSize=function(a,c){











b.$setSize.call(this,a,c);var 

d=0,e=this._uNames,g=P((a-e.getInvalidWidth())/7),f=P((c-e.getHeight())/6);





for(;d<7;)e.getItem(d++).$setSize(g);


for(d=0;d<42;)this._uDate.getItem(d++).$setSize(g,f);



e.$setSize(a);
this._uDate.$setSize(a,f*6)};kb.getMonth=function(){









return this._nMonth+1};kb.getYear=function(){









return this._nYear};kb.move=function(a){var 










b=new Date(this._nYear,this._nMonth+a,1);
this.setDate(b.getFullYear(),b.getMonth()+1)};kb.setDate=function(a,b){var 










c=0,g=new Date(),a=a||g.getFullYear(),b=b?b-1:g.getMonth(),f=new Date(a,b,0),d=1-(f.getDay()+1)%7,h=f.getDate(),e=(new Date(a,b+1,0)).getDate();if(this._nYear!=a||this._nMonth!=b){











this._nYear=a;
this._nMonth=b;for(;b=this._uDate.getItem(c++);){



b.setEnabled(a=d>0&&d<=e);
oe(b.getBody(),a?d:d>e?d-e:h+d);



b._nDay=d++}


this.change()}};Rd.$pressstart=function(a){



































b.$pressstart.call(this,a);
ec(this.getParent(),a);


a.preventDefault()};Zd.$click=function(a){









b.$click.call(this,a);
this.getParent().hide()};_.$cache=function(a,c){











b.$cache.call(this,a,c);var 
a=H(this.getBase().lastChild);
this.$cache$mainWidthRevise=lc(a);
this.$cache$mainHeightRevise=nc(a);
this._uTitle.cache(true,true);
this._uClose.cache(true,true)};_.$init=function(){








this._uTitle.$init();
this._uClose.$init();
b.$init.call(this)};_.$focus=function(){








b.$focus.call(this);var 

a=Y(Ub,this),c;if(this.getOuter().style.zIndex<32768){




Ub.push(Ub.splice(a,1)[0]);
for(;c=Ub[a];)c.getOuter().style.zIndex=4096+a++}};_.$hide=function(){











b.$hide.call(this);
this.getOuter().style.zIndex==32768&&S()};_.$init=function(){








b.$init.call(this);
this._bHide&&this.$hide()};_.$setSize=function(a,c){










b.$setSize.call(this,a,c);
this.$locate();var 

d=this.getBase().lastChild.style;

d.width=this.getBodyWidth()-this.$cache$mainWidthRevise+"px";
d.height=this.getBodyHeight()-this.$cache$mainHeightRevise+"px";
this._uTitle.$setSize(this._bTitleAuto&&this.getBodyWidth())};_.center=function(){var 







b=this.getOuter().offsetParent;if(b.tagName=="BODY"||b.tagName=="HTML")var 


a=Cb(),d=a.right+a.left,c=a.bottom+a.top;else{




d=b.offsetWidth;
c=b.offsetHeight}


this.setPosition((d-this.getWidth())/2,(c-this.getHeight())/2)};_.setTitle=function(a){









this._uTitle.$setBodyHTML(a||"")};_.show=function(){










this.contain(dd())||qb(this);
return b.show.call(this)};_.showModal=function(){








this.show();
this.getOuter().style.zIndex=32768;
S(.05)};function Kd(a,b){


































b=a._eItems=b||t();
b.className=a.getType()+"-items "+a.getBaseClass()+"-items";
b.style.cssText="";
return b}function hc(a){









a.setClass(a.getBaseClass()+(a._aTree.length?a._eItems.style.display?"-fold":"":"-empty"))}function yd(a,b,c){














a.className=b.getType()+" "+(Wc(a.className)||b.getBaseClass());
return f(b.constructor,a,b,c)}z.$click=function(a){










b.$click.call(this,a);
this.setFold(!this.isFold())};






z.$cache=z.$resize=z.$setSize=Z;z.$dispose=function(){






this._eItems=null;
b.$dispose.call(this)};z.$hide=function(){








b.$hide.call(this);var 

a=this._eItems;if(a){

a=a.style;
this._sItemsDisplay=a.display;
a.display="none"}};z.$show=function(){









b.$show.call(this);if(this._sItemsDisplay!==g){


this._eItems.style.display=this._sItemsDisplay;
this._sItemsDisplay=g}};z.add=function(a,b){var 












c=a,d=this._aTree;if("string"==typeof a){



d.push(a=yd(t(),this,{}));
a.$setParent();
a.$setBodyHTML(c)}

a.setParent(this);if(a.getParent()&&(c=d[b])&&c!=a){


d.splice(b,0,d.pop());
a._eItems&&Ac(a._eItems,N(a.getOuter(),c.getOuter()))}

return a};z.getChildTrees=function(){










return this._aTree.slice()};z.getFirst=function(){









return this._aTree[0]||null};z.getLast=function(){









return this._aTree[this._aTree.length-1]||null};z.getNext=function(){var 









a=this.getParent();
return a instanceof db&&a._aTree[Y(a._aTree,this)+1]||null};z.getPrev=function(){var 









a=this.getParent();
return a instanceof db&&a._aTree[Y(a._aTree,this)-1]||null};z.getRoot=function(){for(var 









a=this,b;(b=a.getParent())instanceof db;a=b);
return a};z.isFold=function(){









return!this._eItems||!(!this._eItems.style.display)};z.setFold=function(a){if(this._eItems){











this._eItems.style.display=a!==false?"none":"";
this.change()}


hc(this)};z.setParent=function(a){var 









c=this.getOuter(),d=this.getParent();if(a!=m(c)&&(!a||a!=d)){if(d instanceof db){





pb(d._aTree,this);
hc(d)}if(d=a instanceof db&&a.getBody())a.$setBody(a._eItems||Kd(a));







b.setParent.call(this,a);if(d){


a.$setBody(d);
a._aTree.push(this);
hc(a)}if(this._eItems)m(c)?Ac(this._eItems,c):I(this._eItems)}};function Fd(a,b){







































a._eInput||a.getBody().appendChild(a._eInput=Db("",a.getName(),"hidden"));
a._eInput.value=b}Bb.$click=function(a){if(Hb(this)<=r(H(this.getBase(),"paddingLeft"))){var 










b=this.getRoot();

b._cSelected&&b._cSelected.alterClass("select",true);
this.alterClass("select");
b._cSelected=this;
Fd(b,this._sValue);

this.setFold=Z}


z.$click.call(this,a);
delete this.setFold};Bb.$dispose=function(){








this._eInput=null;
z.$dispose.call(this)};Bb.getName=function(){









return this._sName};Bb.getSelected=function(){









return this.getRoot()._cSelected};Bb.getValue=function(){









return this._sValue};Bb.setParent=function(a){var 









b=this.getRoot();

z.setParent.call(this,a);if(b._cSelected==this){


this.alterClass("select",true);
b._cSelected=null;
Fd(b,"")}if(this._cSelected){


this._cSelected.alterClass("select",true);
this._cSelected=null;
this._eInput&&I(this._eInput)}};Pc.$cache=function(a,b){



































z.$cache.call(this,a,b);
this._uCheckbox.cache(true,true)};Pc.$init=function(){








this._uCheckbox.$init();
z.$init.call(this)};Pc.isChecked=function(){









return this._uCheckbox.isChecked()};function Mb(){



















































this.getControl=null;
f(ld,this,m(this).getControl());
return this.getControl()}function ee(a){for(var 









b=0,d=a.getParent()._aCol,e,c;c=d[b];)if(e=a._aCol[b++]){

c=c.getWidth()-c.getInvalidWidth();
while(a._aCol[b]===null)c+=d[b++].getWidth();


e.style.width=c+"px"}}function Sc(a){var 












b=1,c=this.getParent()[this instanceof Oc?"_aRow":"_aCol"],d=this.getValue();



a=w(k(0,a),this.getTotal());if(a==d)return;if(a>d){if(c.length==1){







v.setValue.call(this,this.getTotal());
return}for(;;b++)if(a<=c[b].$cache$pos){




d<c[b-1].$cache$pos&&b--;
break}}else for(b=c.length;b--;)if(a>=c[b].$cache$pos){







b<c.length-1&&d>c[b+1].$cache$pos&&b++;
break}




v.setValue.call(this,c[b].$cache$pos)}lb.$click=function(a){var 










b=this.getParent();
b.onrowclick&&b.onrowclick(a)!==false||ecui.ui.Control.prototype.$click.call(this,a)};lb.$dispose=function(){








this._aCol=null;
b.$dispose.call(this)};lb.$getCols=function(){









return this._aCol.slice()};lb.getCol=function(a){









return this._aCol[a]?this._aCol[a].getControl():null};lb.getCols=function(){for(var 









a=this._aCol.length,b=[];a--;)b[a]=this.getCol(a);



return b};bc.$hide=function(){







this.$setStyles("display","none",-this.getWidth())};bc.$setStyles=function(a,b,c){var 












d=0,i=this.getParent(),h=this.getBody(),j=i._aCol,k=Y(j,this),f=m(m(m(h))).style,g;







h.style[a]=b;if(c)f.width=jb(i.getBody()).style.width=X(f.width)+c+"px";for(;f=i._aRow[d++];){






h=f._aCol;
f=h[k];if(f)f.style[a]=b;if(c&&f!==false){




for(g=k;!(f=h[g]);g--);var 

e=-j[g].getInvalidWidth(),l=0;do if(!j[g].getOuter().style.display){




e+=j[g].getWidth();
l++}while(h[++g]===null);if(e>0){





f.style.display="";
f.style.width=e+"px";
f.setAttribute("colSpan",l)}else f.style.display="none"}}






c>0?i.resize():i.paint()};bc.$show=function(){







this.$setStyles("display","",this.getWidth())};bc.setSize=function(a){var 









b=this.getWidth();

this.$setSize(a);
this.$setStyles("width",a-this.getInvalidWidth(true)+"px",a-b)};cc.$click=function(a){var 










b=this.getParent().getParent();
b.oncellclick&&b.oncellclick(a)!==false||ecui.ui.Control.prototype.$click.call(this,a)};cc.getHeight=function(){









return this.getOuter().offsetHeight};cc.getWidth=function(){









return this.getOuter().offsetWidth};u.$cache=function(a,b){











L.$cache.call(this,a,b);

this._uHead.cache(false,true);


this.$cache$mainHeight-=(this.$cache$paddingTop=m(this._uHead.getBody()).offsetHeight);for(var 
c=0,d=0;a=this._aRow[c++];){
a.$cache$pos=d;
a.cache(true,true);if(!a.getOuter().style.display)d+=a.getHeight()}for(c=0,(d=0);a=this._aCol[c++];){





a.$cache$pos=d;
a.cache(true,true);if(!a.getOuter().style.display)d+=a.getWidth()}




this.$cache$mainWidth=d};u.$getCell=function(a,b){var 












c=this._aRow,e=c[a]&&c[a]._aCol,d=e&&e[b];if(d===g)d=null;else if(!d){







for(;d===false;d=(e=c[--a]._aCol)[b]);
for(;!d;d=e[--b]);}

return d};u.$init=function(){








L.$init.call(this);for(var 

a=0,b;b=this._aCol[a++];)b.$setSize(b.getWidth());


for(a=0;b=this._aRow[a++];)ee(b);


N(m(this._uHead.getBody()),this._uHead.getBase().lastChild.lastChild.firstChild)};u.$scroll=function(){







L.$scroll.call(this);
this._uHead.getBase().lastChild.style.left=this.getBody().style.left};u.$setSize=function(a,b){var 










c=this.getBody(),e=this._cVScroll,f=this._cHScroll,j=e&&e.getWidth(),k=f&&f.getHeight(),l=this.getInvalidWidth(true),o=this.getInvalidHeight(true),n=this.$cache$mainWidth+l,i=this.$cache$mainHeight+o,h=a-l,g=b-o,d;














this.getBase().style.paddingTop=this.$cache$paddingTop+"px";
jb(c).style.width=this._uHead.getBase().lastChild.lastChild.style.width=this.$cache$mainWidth+"px";if(this.$cache$mainWidth<=h&&this.$cache$mainHeight<=g){




a=n;
b=i}else if(!(e&&f&&this.$cache$mainWidth>h-j&&this.$cache$mainHeight>g-k)){





d=n+(!e||g>=this.$cache$mainHeight?0:j);
a=f?w(a,d):d;
d=i+(!f||h>=this.$cache$mainWidth?0:k);
b=e?w(b,d):d}


L.$setSize.call(this,a,b);

this._uHead.$setSize(X(m(c).style.width),this.$cache$paddingTop)};u.addCol=function(a,b){var 















c=0,j=this.getType(),n=a.base||this.getBaseClass(),k=t(j+"-head "+n+"-head","","th"),i=f(qc,k,this),e=this._aCol[b],m=a.width,h;if(e)e=e.getOuter();else b=this._aCol.length;















this._aCol.splice(b,0,i);
k.innerHTML=a.title||"";
this._uHead.getBody().insertBefore(k,e);

j=j+"-item "+n+"-item";for(;h=this._aRow[c];c++){

e=h._aCol[b];if(e!==null){for(l=b;!e;){



e=h._aCol[++l];if(e===g)break}




h._aCol.splice(b,0,e=h.getBody().insertBefore(t(j,"","td"),e));
e.getControl=Mb}else{var 



d=this.$getCell(c,b),l=r(d.getAttribute("rowspan"))||1;


d.setAttribute("colSpan",r(d.getAttribute("colSpan"))+1);
h._aCol.splice(b,0,e);
for(;--l;)this._aRow[++c]._aCol.splice(b,0,false)}}





i.$setSize(m);
i.$setStyles("width",k.style.width,m);

return i};u.addRow=function(a,b){var 











c=0,m=1,o=this.getBody().lastChild.lastChild,n=this.getType(),e=t(),j=['<table><tbody><tr class="'+n+"-row "+this.getBaseClass()+'-row">'],i=[],h=this._aRow[b],g;









h||(b=this._aRow.length);for(;g=this._aCol[c];)if(h&&h._aCol[c]===false||a[c]===false)i[c++]=false;else{







i[c]=true;
j[m++]='<td class="'+n+"-item "+g.getBaseClass().slice(0,-5)+'-item" style="';for(var 

d=c,l=g.isShow()?1:0,k=-g.getInvalidWidth();(g=this._aCol[++c])&&a[c]===null;){




i[c]=null;if(g.isShow()){

l++;
k+=g.getWidth()}}


i[d]=true;
j[m++]=(l?"width:"+k+'px" colSpan="'+l:"display:none")+'">'+a[d]+"</td>"}




j[m]="</tr></tbody></table>";
e.innerHTML=j.join("");
e=e.lastChild.lastChild.lastChild;

o.insertBefore(e,h&&h.getOuter());
h=f(gc(this,"Row"),e,this);
this._aRow.splice(b--,0,h);for(c=0,(e=e.firstChild),(g=null);this._aCol[c];c++)if(d=i[c]){




i[c]=e;
e.getControl=Mb;
e=e.nextSibling}else if(d===false){


d=this.$getCell(b,c);if(d!=g){

d.setAttribute("rowSpan",(r(d.getAttribute("rowSpan"))||1)+1);
g=d}}




h._aCol=i;
this.paint();

return h};u.getCell=function(a,b){











a=this._aRow[a];
return a&&a.getCol(b)||null};u.getCol=function(a){











return this._aCol[a]||null};u.getColCount=function(){









return this._aCol.length};u.getCols=function(){









return this._aCol.slice()};u.getRow=function(a){










return this._aRow[a]||null};u.getRowCount=function(){









return this._aRow.length};u.getRows=function(){









return this._aRow.slice()};u.removeCol=function(a){var 









b=0,d=this._aCol,c=d[a];if(c){




c.hide();

I(c.getOuter());
oc(c);
d.splice(a,1);for(;c=this._aRow[b++];){


d=c._aCol;if(c=d[a]){if(d[a+1]===null){



d.splice(a+1,1);
continue}

I(c);
c.getControl!=Mb&&oc(c.getControl())}

d.splice(a,1)}}};u.removeRow=function(a){var 











b=0,f=this._aRow[a],i=f._aCol,e=this._aRow[a+1],d,h,c;if(f){for(;this._aCol[b];b++){









c=i[b];if(c===false){

c=this.$getCell(a-1,b);if(d!=c){

c.setAttribute("rowSpan",r(c.getAttribute("rowSpan"))-1);
d=c}}else if(c&&(h=r(c.getAttribute("rowSpan")))>1){



c.setAttribute("rowSpan",h-1);
e._aCol[b++]=c;
for(;i[b]===null;)e._aCol[b++]=null;for(h=b--;;){



d=e._aCol[h++];if(d||d===g)break}





e.getBody().insertBefore(c,d);
c.getControl!=Mb&&c.getControl().$setParent(e)}}



I(f.getOuter());
oc(f);
this._aRow.splice(a,1);

this.paint()}};(function(){for(var 





a=0;a<5;){var 
b=Ib[a++],c=b.slice(5);

lb[b]=new Function("e","var p=this.getParent();p.onrow"+c+"&&p.onrow"+c+"(e)!==false||ecui.ui.Control.prototype."+b+".call(this,e)");




cc[b]=new Function("e","var p=this.getParent().getParent();p.oncell"+c+"&&p.oncell"+c+"(e)!==false||ecui.ui.Control.prototype."+b+".call(this,e)")}})();function Yc(a,b,c){






















































b=f(gc(a,"Row"),b,a);
b._eFill=b.getBase().lastChild;
b._cJoint=c;
c._cJoint=b;

return b}function wc(a){var 









b=0,e=a.getParent(),h=a._cJoint.$getCols,f=e.getCols(),j=h?a._cJoint.$getCols():f,i=a._cJoint.getBody(),g=a.getBody(),c=g.firstChild,d;for(;f[b];){if(b==e._nLeft)c=i.firstChild;if(d=j[b++]){














h||(d=d.getOuter());if(c!=d)(b<=e._nLeft||b>e._nRight?g:i).insertBefore(d,c);else c=c.nextSibling}if(b==e._nRight)c=a._eFill.nextSibling}}function Wd(a){




















wc(a._uLockedHead);for(var 
b=0,c;c=a._aLockedRow[b++];)wc(c)}cd.$dispose=function(){










this._eFill=null;
lb.$dispose.call(this)};gb.$cache=function(a,b){











u.$cache.call(this,a,b);var 

c=0,f=this.getRows(),e=this.getCols(),d=e[this._nLeft].$cache$pos;




this.$cache$paddingTop=k(this.$cache$paddingTop,this._uLockedHead.getBody().offsetHeight);
this.$cache$mainWidth-=((this.$cache$paddingLeft=d)+(this.$cache$paddingRight=this._nRight<e.length?this.$cache$mainWidth-e[this._nRight].$cache$pos:0));




for(;a=e[c++];)a.$cache$pos-=d;for(c=0,(d=0);a=f[c++];){




a.getCol(this._nLeft).cache(false,true);
a.$cache$pos=d;
a._cJoint.cache(true,true);
d+=k(a.getHeight(),a._cJoint.getHeight())}


this.$cache$mainHeight=d};gb.$dispose=function(){








this._uLockedHead._eFill=null;
u.$dispose.call(this)};gb.$init=function(){








u.$init.call(this);
Wd(this)};gb.$resize=function(){







this.getBase().style.paddingLeft=this.getBase().style.paddingRight="";
this.$cache$paddingLeft=this.$cache$paddingRight=0;
u.$resize.call(this)};gb.$scroll=function(){







u.$scroll.call(this);
this._uLockedMain.getBody().style.top=this.getBody().style.top};gb.$setSize=function(a,b){var 










c=0,e=this.getBase().style,d=this._uLockedHead,f=m(m(d.getBody())).style;




e.paddingLeft=this.$cache$paddingLeft+"px";
e.paddingRight=this.$cache$paddingRight+"px";

u.$setSize.call(this,a,b);

e=d._cJoint.getWidth()+this.$cache$paddingLeft+this.$cache$paddingRight;
d.$setSize(0,this.$cache$paddingTop);
f.height=this.$cache$paddingTop+"px";
this._uLockedMain.$setSize(e,this.getBodyHeight());
f.width=this._uLockedMain.getBody().lastChild.style.width=e+"px";

a=m(this.getBody()).style.width;
d._eFill.style.width=a;for(;d=this._aLockedRow[c++];){



e=d._eFill.style;
e.width=a;

f=k(d.getHeight(),d._cJoint.getHeight());
e.height=f+"px";
d._cJoint.getCol(this._nLeft).$setSize(0,f)}};gb.addCol=function(a,b){
















b>=0&&b<this._nLeft&&this._nLeft++;
b<this._nRight&&this._nRight++;
return u.addCol.call(this,a,b)};gb.addRow=function(a,b){











this.paint=Z;var 

c=u.addRow.call(this,a,b),b=Y(this.getRows(),c),f=this._aLockedRow[b],e=c.getBase(),d=t();





d.innerHTML='<table cellspacing="0"><tbody><tr class="'+e.className+'" style="'+e.style.cssText+'"><td style="padding:0px;border:0px"></td></tr></tbody></table>';


d=Yc(this,e=d.lastChild.lastChild.lastChild,c);
this._uLockedMain.getBody().lastChild.lastChild.insertBefore(e,f&&f.getOuter());
this._aLockedRow.splice(b,0,d);
wc(d);

delete this.paint;
this.paint();

return c};gb.removeCol=function(a){









u.removeCol.call(this,a);
a>=0&&a<this._nLeft&&this._nLeft--;
a<this._nRight&&this._nRight--};(function(){for(var 








a=0,b;a<13;){
b=Ib[a++];
cd["$"+b]=new Function("","(ecui.ui.Control.prototype.$"+b+").apply(this,arguments);ecui.ui.Control.prototype.$"+b+".apply(this._cJoint,arguments)")}})();function Nd(a){















































a&&a.setClass(a.getBaseClass()+(a.getItems().length?"-complex":""))}


G(R,p);$c.$click=function(a){








b.$click.call(this,a);var 

c=this.getParent(),h=c.getBody(),f=c.getItems(),e=f[0].getHeight(),g=c._uPrev.getHeight(),d=(X(h.style.top)-g)/e;







c.$setOvered();
h.style.top=w(k(c._uPrev==this?++d:--d,c._nOptionSize-f.length),0)*e+g+"px"};$c.$pressstart=function(a){











b.$pressstart.call(this,a);
a.preventDefault()};mb.$click=function(a){









ab.$click.call(this,a);
this.getItems().length||V.$blur()};mb.$mouseout=function(a){









ab.$mouseout.call(this,a);
this.getItems().length||this.getParent().$setOvered()};mb.$mouseover=function(a){










ab.$mouseover.call(this,a);var 

b=this._cPopup,f=this.getParent(),i=f._cSuperior,c=f._cInferior,h=sb(this.getOuter()),d=h.left,g=Cb(),e;if(c!=b){










c&&c.hide();if(b&&b.getItems().length){


b.setParent(true);


e=b.getWidth();
c=d+this.getWidth()-4;
d-=e-4;


b.setPosition(c+e>g.right||i&&i.getX()>f.getX()&&d>g.left?d:c,h.top-4);



b.show()}}};mb.$pressend=function(a){











ab.$pressend.call(this,a);
a.getTarget()!=this&&V.$blur()};mb.add=function(a,b){












return (this._cPopup=this._cPopup||f(Jb,t("ec-popup "+this.getParent().getBaseClass()),this)).add(a,b)};mb.getItems=function(){











return this._cPopup&&this._cPopup.getItems()||[]};mb.remove=function(a){










return this._cPopup&&this._cPopup.remove(a)};R.$alterItems=function(){if(m(this.getOuter())){









Nd(this.getParent());var 

a=this.getItems(),e=a.length,d=e&&a[0].getHeight(),g=this._nOptionSize||Number.MAX_VALUE,b=this._uPrev,c=this._uNext,f=this.getBodyWidth(),h=this.getBase().style;








this.setItemSize(f,d);

d*=w(g,e);if(e>g){

b.show();
c.show();
b.$setSize(f);
c.$setSize(f);


b=b.getHeight();
c.setPosition(0,b+d);
c=c.getHeight()}else{if(b){



b.hide();
c.hide()}

b=c=0}


h.paddingTop=this.getBody().style.top=b+"px";
h.paddingBottom=c+"px";
this.cache(false,true);
this.setBodySize(0,d)}};R.$blur=function(){for(var 









a=this,b;b=a._cSuperior;a=b);
a.hide()};R.$cache=function(a,b){











p.$cache.call(this,a,b);


(b=this._uPrev)&&b.cache(true,true);
(b=this._uNext)&&b.cache(true,true)};R.$dispose=function(){








this.setParent();
b.$dispose.call(this)};R.$forcibly=function(){








V.$blur();
return false};R.$hide=function(){








b.$hide.call(this);


this.$setOvered();

V=this._cSuperior;
V?(V._cInferior=null):rb()};R.$setOvered=function(a){










p.$setOvered.call(this,a);
a||this._cInferior&&this._cInferior.hide()};R.$show=function(){








b.$show.call(this);
this.setParent(true);var 

a=this.getOuter(),c=Cb(),d=sb(a);




this.setPosition(w(k(d.left,c.left),c.right-this.getWidth()),w(k(d.top,c.top),c.bottom-this.getHeight()));if(V){






a.style.zIndex=r(H(V.getOuter(),"zIndex"))+1;
this._cSuperior=V;
V._cInferior=this}else{



a.style.zIndex=32768;
forcibly(this)}


V=this};R.cache=function(a,c){











m(this.getOuter())&&b.cache.call(this,a,c)};R.paint=function(){








m(this.getOuter())&&b.paint.call(this)};R.setParent=function(a){var 










b=this.getOuter();if(a){if(!m(b)){


B.body.appendChild(b);
this.$alterItems()}}else{



this.hide();
I(b)}};function Qc(a){var 































b=a.getParent(),e=b._cScroll,f=e.getStep(),c=Wb(b),d=a._nTop;





a._nTop=c;if(c>b.getHeight()){if(c<d)c=0;else{








c=P((c-k(0,d))/3);

c?e.skip(c):a._nTop=d}

c+=a._nLastIndex}else if(c<0){if(c>d)c=0;else{








c=Qd((c-w(0,d))/3);

c?e.skip(c):a._nTop=d}

c+=a._nLastIndex}else c=P((b.getScrollTop()+c)/f);





return w(k(0,c),b.getItems().length-1)}


G(nb,p);ib.$dispose=function(){







this._eInput=null;
ab.$dispose.call(this)};ib.$pressstart=function(b){









ab.$pressstart.call(this,b);
a.select(this,b,"listbox")};ib.$select=function(){var 







a=this._nStartIndex,c=this._nLastIndex,b=Qc(this),h=this.getParent().getItems(),e=0,f=-1,d=0,g=-1;if(b>c)if(b<a){











e=c;
f=b-1}else if(c<a){



e=c;
f=a-1;
d=a+1;
g=b}else{



d=c+1;
g=b}else if(b<c)if(b>a){





e=b+1;
f=c}else if(c>a){



e=a+1;
f=c;
d=b;
g=a-1}else{



d=b;
g=c-1}



this._nLastIndex=b;for(;e<=f;){



b=h[e++];
b.alterClass("selected",!b.isSelected())}



for(;d<=g;)h[d++].alterClass("selected")};ib.$selectend=function(){var 









a=this._nStartIndex,b=Qc(this),e=this.getParent().getItems(),c=w(a,b),d=k(a,b);if(a==b)this.setSelected(!this.isSelected());else for(;c<=d;)e[c++].setSelected()};ib.$selectstart=function(){






















this._nStartIndex=this._nLastIndex=Qc(this);
this.alterClass("selected")};ib.isSelected=function(){









return!this._eInput.disabled};ib.setParent=function(a){









ab.setParent.call(this,a);if(a instanceof Rc)this._eInput=Db(this._eInput,a._sName)};ib.setSelected=function(a){













this.alterClass("selected",this._eInput.disabled=a===false)};nb.$alterItems=function(){var 








a=this.getItems(),c=a.length,d=this._cScroll,b=c&&a[0].getHeight();if(b){





d.setStep(b);
this.setItemSize(this.getBodyWidth()-(c*b>this.getBodyHeight()?d.getWidth():0),b);



this.paint()}};nb.$cache=function(a,b){












p.$cache.call(this,a,b);for(var 


c=0,d=this.getItems();b=d[c++];)b.$cache(false,true)};nb.getName=function(){












return this._sName};nb.getSelected=function(){for(var 









a=0,d=this.getItems(),b,c=[];b=d[a++];)b.isSelected()&&c.push(b);


return c};nb.selectAll=function(){for(var 








a=0,c=this.getItems(),b;b=c[a++];)b.setSelected()};nb.setName=function(a){for(var 












b=0,d=this.getItems(),c;c=d[b++];)c._eInput=Db(c._eInput,a);



this._sName=a};Gc.$dispose=function(){





















this._eText=this._eMask=null;
b.$dispose.call(this)};Gc.$setSize=function(a,c){










b.$setSize.call(this,a,c);
this.$locate();var 

d=this._eText.style,e=this._eMask.style;

d.width=e.width=this.getBodyWidth()+"px";
d.height=e.height=this.getBodyHeight()+"px"};Gc.setText=function(a,b){










a=w(k(0,a),1);
this._eText.innerHTML=this._eMask.innerHTML=b||Lb(a*100)+"%";
this._eMask.style.clip="rect(0px,"+P(a*this.getBodyWidth())+"px,"+this.getBodyHeight()+"px,0px)"};function Lc(a,b,c){



























c=c<0?c+1:c>1?c-1:c;
c=c<.5?w(6*c,1):k(4-6*c,0);
return Lb(255*(a+(b-a)*c))}fb.getBlue=function(){









return this._nBlue};fb.getGreen=function(){









return this._nGreen};fb.getHue=function(){









return this._nHue};fb.getLight=function(){









return this._nLight};fb.getRGB=function(){var 









a=this._nRed,b=this._nGreen,c=this._nBlue;



return((a<16?"0":"")+a.toString(16)+(b<16?"0":"")+b.toString(16)+(c<16?"0":"")+c.toString(16)).toUpperCase()};fb.getRed=function(){











return this._nRed};fb.getSaturation=function(){









return this._nSaturation};fb.setRGB=function(a,b,c){











this._nRed=a;
this._nGreen=b;
this._nBlue=c;

a/=255;
b/=255;
c/=255;var 

d=w(a,b,c),g=k(a,b,c),f=g-d,e;




this._nLight=(g+d)/2;if(f){

e=a==g?(b-c)/6/f:b==g?.3333333333333333+(c-a)/6/f:.6666666666666666+(a-b)/6/f;


this._nHue=e<0?(e+=1):e>1?(e-=1):e;
this._nSaturation=this._nLight<.5?f/(g+d):f/(2-g-d)}else{




this._nHue=0;
this._nSaturation=0}};fb.setHSL=function(a,b,c){var 












d=c+w(c,1-c)*b,e=2*c-d;


this._nHue=a;
this._nSaturation=b;
this._nLight=c;

this._nRed=Lc(e,d,a+.3333333333333333);
this._nGreen=Lc(e,d,a);
this._nBlue=Lc(e,d,a-.3333333333333333)};function jc(a,b){for(var 
































c=0;c<7;c++)if(b[c]!==g){

c||(a._uColor.getBase().style.backgroundColor="#"+b[c]);
a._aValue[c].setValue(b[c])}}function Zc(a,b,c){for(var 













d=0,f=J(a._uLightbar.getBody()),e=new vb();d<256;){
e.setHSL(b,c,1-d/255);
f[d++].style.backgroundColor="#"+e.getRGB()}}function td(a){var 










b=a._aValue[1].getValue(),c=a._aValue[3].getValue();


a._uMain._uIcon.setPosition(b,255-c);
a._uLightbar._uIcon.getOuter().style.top=255-a._aValue[5].getValue()+"px";
Zc(a,b/255,c/255)}function od(a){var 









b=new vb();

b.setHSL(a._aValue[1].getValue()/255,a._aValue[3].getValue()/255,a._aValue[5].getValue()/255);





jc(a,[b.getRGB(),g,b.getRed(),g,b.getGreen(),g,b.getBlue()])}function ic(a){var 

















b=new vb();

b.setRGB(+a._aValue[2].getValue(),+a._aValue[4].getValue(),+a._aValue[6].getValue());





jc(a,[b.getRGB(),Lb(b.getHue()*256)%256,g,Lb(b.getSaturation()*255),g,Lb(b.getLight()*255)]);








td(a)}fd.$dragmove=function(a,c,d){











b.$dragmove.call(this,a,c,d);var 

e=this.getParent(),f=e.getParent();


d=255-d;if(e==f._uMain){

f._aValue[1].setValue(c);
f._aValue[3].setValue(d);
Zc(f,c/255,d/255)}else f._aValue[5].setValue(d);





od(f)};fd.$pressstart=function(a){









b.$pressstart.call(this,a);var 

c=this==this.getParent()._uMain,d=this._uIcon,g=c?Hb(this):d.getX(),f=Wb(this),e={top:0,bottom:255+d.getHeight()};if(c){






e.left=0;
e.right=255+d.getWidth()}else{if(f<0||f>255)return;





e.left=e.right=g}


d.setPosition(g,f);
ec(d,a,e);
d.$dragmove.call(d,a,g,f)};Hd.$click=function(a){









b.$click.call(this,a);var 

c=this.getParent();if(this==c._uConfirm)c.onconfirm&&c.onconfirm();else if(this==c._uCancel)c.hide();else{









a=Ld[this.getIndex()];
jc(c=c.getParent(),[g,g,X(a.slice(0,2),16),g,X(a.slice(2,4),16),g,X(a.slice(4),16)]);








ic(c)}};Tc.$change=function(){








eb.$change.call(this);var 

a=this.getParent(),b=this.getValue();if(this==a._aValue[0]){



b=this.$getInputText();if(b.length==6&&!b.replace(/[0-9a-f]/ig,""))a.setColor(new vb(b));else this.restore()}else{if(!b){









this.setValue(0);new Kb(
function(){
this.setCaret(1)},0,this)}else if(b.charAt(0)=="0")this.setValue(+b);if(Y(a._aValue,this)%2){







od(a);
td(a)}else ic(a)}};Tc.$keydown=function(a){














eb.$keydown.call(this,a);var 

b=this.getParent(),e=this.getValue(),f=this.getSelectionStart(),d=this.getSelectionEnd(),c=sc();if(!a.ctrlKey&&this==b._aValue[0]){if(c!=37&&c!=39){if(f==d)d++;











c=String.fromCharCode(c).toUpperCase();if(c>="0"&&c<="9"||c>="A"&&c<="F"){

e=e.slice(0,f)+c+e.slice(d);if(e.length==6){

c=d+d%2;
b._aValue[c].setValue(X(e.slice(c-2,c),16));
ic(b);
this.setCaret(d)}

a.preventDefault()}}}};Yb.$cache=function(a,c){














b.$cache.call(this,a,c);

this._uMain.cache(false,true);
this._uLightbar.cache(true,true)};Yb.$init=function(){







b.$init.call(this);
this.setColor(new vb("808080"))};Yb.$setSize=function(a,c){











b.$setSize.call(this,a,c);var 

d=1;

this._uMain.setBodySize(256,256);
this._uLightbar.setBodySize(0,256);

for(;d<7;)this._aValue[d++].paint()};Yb.getColor=function(){











return new vb(this._aValue[0].getValue())};Yb.setColor=function(a){









jc(this,[g,g,a.getRed(),g,a.getGreen(),g,a.getBlue()]);








ic(this)};E.$cache=function(a,c){
























this._oInner.$cache(a,c,true);
b.$cache.call(this,H(this._eOuter),false);
this._oInner.$cache$position="relative";
this.$cache$position=a.position=="absolute"?"absolute":"relative";
this.$cache$layout=";top:"+a.top+";left:"+a.left+";display:"+a.display};E.$dispose=function(){







this._eOuter=null};E.$init=function(){







this._eOuter.style.cssText="position:"+this.$cache$position+this.$cache$layout;
this._oInner.getOuter(true).style.cssText+=";position:relative;top:auto;left:auto;display:block";
this._oInner.$init(true)};E.$resize=function(){







this._eOuter.style.width="";
C||(this._eOuter.style.height="");
this._oInner.$resize(true)};E.$setSize=function(a,c){var 










d=this._eOuter.style,f=b.getInvalidWidth.call(this),g=b.getInvalidHeight.call(this),e=Gb();




this._oInner.$setSize(a&&a-f,c&&c-g,true);

d.width=this._oInner.getWidth(true)+(e?0:f)+"px";
d.height=this._oInner.getHeight(true)+(e?0:g)+"px"};E.alterClass=function(a,b){










(b?Jc:Ec)(this._eOuter,this._sClass+"-"+a);
this._oInner.alterClass(a,b,true)};E.cache=function(a,b){











this._oInner.cache(a,b,true)};E.getClass=function(){









return this._sClass};E.getHeight=function(){









return this._oInner.getHeight(true)+b.getInvalidHeight.call(this)};E.getInner=function(){









return this._oInner};E.getInvalidHeight=function(){









return this._oInner.getInvalidHeight(true)+b.getInvalidHeight.call(this)};E.getInvalidWidth=function(){









return this._oInner.getInvalidWidth(true)+b.getInvalidWidth.call(this)};E.getOuter=function(){









return this._eOuter};E.getWidth=function(){









return this._oInner.getWidth(true)+b.getInvalidWidth.call(this)};Qb.$dispose=function(){







this.clear();
this.$dispose()};Qb.clear=function(){for(b in Qb)delete this[b];var 












a=this.getUID(),b=U[a],c=b._eOuter;



N(this.getOuter(),c);
I(c);
for(;b!=this;b=b._oInner)b.$dispose();


delete U[a]};(function(){for(var 





a=0,d=[["$cache",2],["$init",0],["$resize",0],["$setSize",2],["alterClass",2],["cache",2],["getHeight",0],["getInvalidHeight",0],["getInvalidWidth",0],["getOuter",0],["getWidth",0]],c,b;c=d[a++];){







b=c[0];
Qb[b]=new Function("var o=this,d=ecui.ext.Decorator[o.getUID()],r=arguments;return r["+c[1]+"]?o.constructor.prototype."+b+".apply(o,r):d."+b+".apply(d,r)")}})();wd("decorate",






function(a,b){b.replace(/([A-Za-z0-9\-]+) *\( *([^)]+)\)/g,
function(b,c,d){

c=Rb[vc(c.charAt(0).toUpperCase()+c.slice(1))];


d=d.split(/\s+/);for(var 

e=0;b=d[e++];)new c(a,b)})});d(Yd,U).$setSize=function(a,b){

















E.$setSize.call(this,a,b);var 

c=this.getInner(),f=this.getOuter().lastChild,d=f.style,e=f.previousSibling.style,g=this.$cache$paddingLeft;





e.top=d.top=this.$cache$paddingTop+"px";
d.left=g+c.getWidth(true)+"px";
e.width=g+"px";
d.width=this.$cache$paddingRight+"px";
e.height=d.height=c.getHeight(true)+"px"};d(ke,U).$setSize=function(a,b){














E.$setSize.call(this,a,b);var 

c=this.getInner(),f=this.getOuter().lastChild,d=f.style,e=f.previousSibling.style,g=this.$cache$paddingTop;





d.top=g+c.getHeight(true)+"px";
e.left=d.left=this.$cache$paddingLeft+"px";
e.width=d.width=c.getWidth(true)+"px";
e.height=g+"px";
d.height=this.$cache$paddingBottom+"px"};d(he,U).$setSize=function(a,b){














E.$setSize.call(this,a,b);var 

c=this.getInner(),i=this.getOuter().lastChild,d=9,h=this.$cache$paddingTop,g=this.$cache$paddingLeft,f=c.getWidth(true),e=c.getHeight(true),j=["0px",h+"px",h+e+"px"],k=["0px",g+"px",g+f+"px"];









f=[g+"px",f+"px",this.$cache$paddingRight+"px"];
e=[h+"px",e+"px",this.$cache$paddingBottom+"px"];for(;d--;)if(d!=4){




c=i.style;
c.top=j[P(d/3)];
c.left=k[d%3];
c.width=f[d%3];
c.height=e[P(d/3)];
i=i.previousSibling}}})()