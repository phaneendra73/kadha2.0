import{p as rt}from"./chunk-JWPE2WC7-4KALaivU.js";import{aH as T,az as P,c2 as nt,G as it,E as st,H as ot,J as lt,Y as ct,X as ut,_ as d,N as B,K as gt,a7 as dt,aa as pt,ah as ht,O as ft,Z as mt,a8 as vt}from"./index--hAjdUtN.js";import{p as xt}from"./cynefin-VYW2F7L2-DeecDDWO.js";import{d as K}from"./arc-Cjofl8N-.js";import{o as St}from"./ordinal-Cboi1Yqb.js";import"./init-Gi6I4Gst.js";function yt(t,n){return n<t?-1:n>t?1:n>=t?0:NaN}function wt(t){return t}function At(){var t=wt,n=yt,y=null,b=T(0),l=T(P),p=T(0);function i(e){var r,o=(e=nt(e)).length,h,w,$=0,f=new Array(o),s=new Array(o),D=+b.apply(this,arguments),E=Math.min(P,Math.max(-P,l.apply(this,arguments)-D)),k,R=Math.min(Math.abs(E)/o,p.apply(this,arguments)),u=R*(E<0?-1:1),A;for(r=0;r<o;++r)(A=s[f[r]=r]=+t(e[r],r,e))>0&&($+=A);for(n!=null?f.sort(function(M,m){return n(s[M],s[m])}):y!=null&&f.sort(function(M,m){return y(e[M],e[m])}),r=0,w=$?(E-o*u)/$:0;r<o;++r,D=k)h=f[r],A=s[h],k=D+(A>0?A*w:0)+u,s[h]={data:e[h],index:r,value:A,startAngle:D,endAngle:k,padAngle:R};return s}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:T(+e),i):t},i.sortValues=function(e){return arguments.length?(n=e,y=null,i):n},i.sort=function(e){return arguments.length?(y=e,n=null,i):y},i.startAngle=function(e){return arguments.length?(b=typeof e=="function"?e:T(+e),i):b},i.endAngle=function(e){return arguments.length?(l=typeof e=="function"?e:T(+e),i):l},i.padAngle=function(e){return arguments.length?(p=typeof e=="function"?e:T(+e),i):p},i}var Ct=vt.pie,I={sections:new Map,showData:!1},O=I.sections,V=I.showData,$t=structuredClone(Ct),Dt=d(()=>structuredClone($t),"getConfig"),Tt=d(()=>{O=new Map,V=I.showData,mt()},"clear"),bt=d(({label:t,value:n})=>{if(n<0)throw new Error(`"${t}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);O.has(t)||(O.set(t,n),B.debug(`added new section: ${t}, with value: ${n}`))},"addSection"),kt=d(()=>O,"getSections"),zt=d(t=>{V=t},"setShowData"),Et=d(()=>V,"getShowData"),Y={getConfig:Dt,clear:Tt,setDiagramTitle:ut,getDiagramTitle:ct,setAccTitle:lt,getAccTitle:ot,setAccDescription:st,getAccDescription:it,addSection:bt,getSections:kt,setShowData:zt,getShowData:Et},Mt=d((t,n)=>{rt(t,n),n.setShowData(t.showData),t.sections.map(n.addSection)},"populateDb"),Ht={parse:d(async t=>{const n=await xt("pie",t);B.debug(n),Mt(n,Y)},"parse")},Rt=d(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),Lt=Rt,Nt=d(t=>{const n=[...t.values()].reduce((l,p)=>l+p,0),y=[...t.entries()].map(([l,p])=>({label:l,value:p})).filter(l=>l.value/n*100>=1);return At().value(l=>l.value).sort(null)(y)},"createPieArcs"),Ot=d((t,n,y,b)=>{var J;B.debug(`rendering pie chart
`+t);const l=b.db,p=gt(),i=dt(l.getConfig(),p.pie),e=40,r=18,o=4,h=450,w=h,$=pt(n),f=$.append("g");f.attr("transform","translate("+w/2+","+h/2+")");const{themeVariables:s}=p;let[D]=ht(s.pieOuterStrokeWidth);D??(D=2);const E=i.legendPosition,k=i.textPosition,R=i.donutHole>0&&i.donutHole<=.9?i.donutHole:0,u=Math.min(w,h)/2-e,A=K().innerRadius(R*u).outerRadius(u),M=K().innerRadius(u*k).outerRadius(u*k),m=f.append("g");m.append("circle").attr("cx",0).attr("cy",0).attr("r",u+D/2).attr("class","pieOuterCircle");const L=l.getSections(),q=Nt(L),Q=[s.pie1,s.pie2,s.pie3,s.pie4,s.pie5,s.pie6,s.pie7,s.pie8,s.pie9,s.pie10,s.pie11,s.pie12];let W=0;L.forEach(a=>{W+=a});const U=q.filter(a=>(a.data.value/W*100).toFixed(0)!=="0"),_=St(Q).domain([...L.keys()]);m.selectAll("mySlices").data(U).enter().append("path").attr("d",A).attr("fill",a=>_(a.data.label)).attr("class",a=>{let c="pieCircle";return i.highlightSlice==="hover"?c+=" highlightedOnHover":i.highlightSlice===a.data.label&&(c+=" highlighted"),c}),m.selectAll("mySlices").data(U).enter().append("text").text(a=>(a.data.value/W*100).toFixed(0)+"%").attr("transform",a=>"translate("+M.centroid(a)+")").style("text-anchor","middle").attr("class","slice");const tt=f.append("text").text(l.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),H=[...L.entries()].map(([a,c])=>({label:a,value:c})),C=f.selectAll(".legend").data(H).enter().append("g").attr("class","legend");C.append("rect").attr("width",r).attr("height",r).style("fill",a=>_(a.label)).style("stroke",a=>_(a.label)),C.append("text").attr("x",r+o).attr("y",r-o).text(a=>l.getShowData()?`${a.label} [${a.value}]`:a.label);const z=Math.max(...C.selectAll("text").nodes().map(a=>(a==null?void 0:a.getBoundingClientRect().width)??0));let N=h,F=w+e;const g=r+o,G=H.length*g;switch(E){case"center":C.attr("transform",(a,c)=>{const v=g*H.length/2,x=-z/2-(r+o),S=c*g-v;return"translate("+x+","+S+")"});break;case"top":N+=G,C.attr("transform",(a,c)=>{const v=u,x=-z/2-(r+o),S=c*g-v;return`translate(${x}, ${S})`}),m.attr("transform",()=>`translate(0, ${G+g})`);break;case"bottom":N+=G,C.attr("transform",(a,c)=>{const v=-u-g,x=-z/2-(r+o),S=c*g-v;return"translate("+x+","+S+")"});break;case"left":F+=r+o+z,C.attr("transform",(a,c)=>{const v=g*H.length/2,x=-u-(r+o),S=c*g-v;return"translate("+x+","+S+")"}),m.attr("transform",()=>`translate(${z+r+o}, 0)`);break;case"right":default:F+=r+o+z,C.attr("transform",(a,c)=>{const v=g*H.length/2,x=12*r,S=c*g-v;return"translate("+x+","+S+")"});break}const X=((J=tt.node())==null?void 0:J.getBoundingClientRect().width)??0,et=w/2-X/2,at=w/2+X/2,Z=Math.min(0,et),j=Math.max(F,at)-Z;$.attr("viewBox",`${Z} 0 ${j} ${N}`),ft($,N,j,i.useMaxWidth)},"draw"),Wt={draw:Ot},Ut={parser:Ht,db:Y,renderer:Wt,styles:Lt};export{Ut as diagram};
