(this["webpackJsonpoaa.gg"]=this["webpackJsonpoaa.gg"]||[]).push([[0],{198:function(e,t,a){e.exports=a(378)},226:function(e,t){},228:function(e,t){},267:function(e,t){},268:function(e,t){},375:function(e,t){},378:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(11),l=a.n(c),i=a(24),o=a(46),u=a(429),s=a(114),m=null,p="UA-112154059-2";function f(e){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p;e!==m&&(m=e,s.a.initialize(e))}(),function(){var e=Object(o.h)();Object(n.useEffect)((function(){s.a.send(["pageview",e.pathname])}),[e])}(),e.children||null}var b=a(9),h=a(19),E=a(182),d=a(44),g=a(421),v=a(414),O=a(422),j=a(88),y=a(187),w=a.n(y),x=a(85),k=a(25),P=a(419),S=a(415),N=a(432),D=a(416),T=a(417),C=a(418),M=a(420),B=a(185),I=a.n(B),F=a(186),L=a.n(F),R=a(184),W=a.n(R),A=a(183),z=a.n(A),J=a(39),U=a.n(J),G=a(180),Y=a.n(G),q=a(31),V=a.n(q),H=a(181);function X(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function K(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?X(a,!0).forEach((function(t){Object(h.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):X(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function Q(e,t){var a=Y.a.decode(t);return V.a.configure({baseUrl:a.baseUrl,token:t,authorization:"x-auth-token",options:{json:!0}}),console.log("Logged in successfuly",a),e.setState({user:K({},a.user,{mmr:Math.round(100*a.user.unrankedMMR)/100})}),a}var Z={login:function(e){U.a.get("authentication",(function(t,a){if(!a)return V.a.configure({token:null}),void(null!==e.state.user&&e.setState({user:null}));var n,r=Q(e,a),c=Date.now()-new Date(1e3*r.iat);(!e.state.hasUpdated&&c>3e4||c>3e5)&&(n=Object(H.partial)(Q,e),V.a.get("/auth/token",(function(e,t){t&&t.token?U.a.set("authentication",t.token,(function(e,t){return n(t)})):console.log("Tried to reauth but instead of this shit",e,t)})))}))}},$=Object(x.a)(r.a,{user:null,hasUpdated:!1},Z);var _=function(){var e=Object(o.i)().token,t=$()[1];return e&&e.length?(U.a.set("authentication",e,(function(){return t.login()})),r.a.createElement(o.a,{to:"/login"})):r.a.createElement(o.a,{to:"/"})};function ee(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function te(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?ee(a,!0).forEach((function(t){Object(h.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):ee(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var ae=Object(E.a)((function(e){return{drawer:{flexShrink:0,whiteSpace:"nowrap"},drawerOpen:{width:function(e){return e},transition:e.transitions.create("width",{easing:e.transitions.easing.sharp,duration:e.transitions.duration.enteringScreen})},drawerClose:Object(h.a)({transition:e.transitions.create("width",{easing:e.transitions.easing.sharp,duration:e.transitions.duration.leavingScreen}),overflowX:"hidden",width:e.spacing(7)+1},e.breakpoints.up("sm"),{width:e.spacing(9)+1}),toolbar:te({display:"flex",alignItems:"center",justifyContent:"flex-end",padding:e.spacing(0,1)},e.mixins.toolbar)}})),ne=Object(x.a)(r.a,{open:!0,drawerWidth:240},{toggleDrawer:function(e){e.setState({open:!e.state.open})},openDrawer:function(e){e.setState({open:!0})},closeDrawer:function(e){e.setState({open:!1})}});function re(e){var t,a,n=ne(),c=Object(b.a)(n,2),l=c[0],i=c[1],u=$(),s=Object(b.a)(u,1)[0],m=ae(l.drawerWidth),p=Object(k.a)(),f=Object(o.g)(),E=l.open;function g(e){f.push(e.path)}var O=[{icon:z.a,text:"Manage Team",path:"/team"},"divider",{icon:W.a,text:"Logout",path:"/logout"}];return r.a.createElement(N.a,{variant:"permanent",className:Object(d.classNames)(m.drawer,(t={},Object(h.a)(t,m.drawerOpen,E),Object(h.a)(t,m.drawerClose,!E),t)),classes:{paper:Object(d.classNames)((a={},Object(h.a)(a,m.drawerOpen,E),Object(h.a)(a,m.drawerClose,!E),a))},open:E},r.a.createElement("div",{className:m.toolbar},r.a.createElement(v.a,{onClick:i.closeDrawer},"rtl"===p.direction?r.a.createElement(I.a,null):r.a.createElement(L.a,null))),r.a.createElement(S.a,null),r.a.createElement(D.a,null,r.a.createElement(T.a,{button:!0,onClick:function(){return g({path:"/"})}},r.a.createElement(C.a,null,r.a.createElement(P.a,{alt:s.user.profile.name,src:s.user.profile.avatar})),r.a.createElement(M.a,{primary:s.user.profile.name,secondary:"MMR: ".concat(s.user.mmr)})),O.map((function(e,t){return"divider"===e?r.a.createElement(S.a,{key:"divider"+t}):r.a.createElement(T.a,{button:!0,key:e.text,onClick:function(){return g(e)}},r.a.createElement(C.a,null,r.a.createElement(e.icon,null)),r.a.createElement(M.a,{primary:e.text}))}))))}var ce=Object(E.a)((function(e){return{hide:{display:"none"},appBar:{zIndex:e.zIndex.drawer+1,transition:e.transitions.create(["width","margin"],{easing:e.transitions.easing.sharp,duration:e.transitions.duration.leavingScreen})},appBarShift:{marginLeft:function(e){return e},width:function(e){return"calc(100% - ".concat(e,"px)")},transition:e.transitions.create(["width","margin"],{easing:e.transitions.easing.sharp,duration:e.transitions.duration.enteringScreen})}}}));function le(e){var t=ne(),a=Object(b.a)(t,2),n=a[0],c=a[1],l=n.open,i=n.drawerWidth,o=ce(i);return r.a.createElement(g.a,{position:"fixed",className:Object(d.classNames)(o.appBar,Object(h.a)({},o.appBarShift,l))},r.a.createElement(O.a,null,r.a.createElement(v.a,{color:"inherit","aria-label":"open drawer",onClick:c.openDrawer,edge:"start",className:Object(d.classNames)(o.menuButton,Object(h.a)({},o.hide,l))},r.a.createElement(w.a,null)),r.a.createElement(j.a,{variant:"h6",noWrap:!0},"Open Angel Arena")))}var ie=a(73),oe=a.n(ie),ue=a(424),se=a(423),me=a(379),pe=Object(E.a)((function(e){return{root:{padding:e.spacing(3,2)}}}));var fe=function(){var e=$(),t=Object(b.a)(e,2),a=t[0],n=t[1],c=pe();if(a.user)return console.log("Redirecting back!"),r.a.createElement(o.a,{to:"/"});n.login();var l="https://chrisinajar.com:4969/auth/authenticate";return-1!==oe.a.location.origin.indexOf("localhost")&&(console.log(oe.a.location.origin,oe.a.location.origin.indexOf("localhost")),l="http://localhost:9969/auth/authenticate"),r.a.createElement(se.a,null,r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(me.a,{align:"center",className:c.root},r.a.createElement(j.a,{paragraph:!0},"Log in using steam! This will give oaa.gg permission to read your name, steam id, avatar, and other public information."),r.a.createElement(j.a,{paragraph:!0},"Always check the address bar at the top when logging in with Steam, never put your password into a website not owned by Valve."),r.a.createElement("br",null),r.a.createElement(ue.a,{variant:"contained",onClick:function(){return oe.a.location.href=l}},"Log In")))},be=Object(E.a)((function(e){return{root:{padding:e.spacing(3,2)}}}));var he=function(e){var t=be();return r.a.createElement(se.a,null,r.a.createElement(me.a,{align:"center",className:t.root},e.children))};var Ee=function(){return r.a.createElement(he,null,"There is nothing here. Maybe it bought Sonic and flew away!")},de=a(425),ge=Object(E.a)((function(e){return{statBox:{padding:e.spacing(1,0,3,0)}}}));var ve=function(){var e=$(),t=Object(b.a)(e,1)[0],a=ge(),n=t.user,c=n.mmr,l=n.profile,i=n.matchesFinished,o=n.matchesStarted,u=n.bestRanking,s=n.bottlepassLevel,m=n.averageMonthlyDays,p=n.seasonPlacings,f=n.daysPlayedThisMonth,h=[{text:"MMR",value:c},{text:"Games Started",value:o},{text:"Games Finished",value:i},{text:"Bottlepass Level",value:s},{text:"Best Ranking Achieved",value:u},{text:"Average Monthly Days Played",value:Math.round(10*m)/10},{text:"Days Played This Month",value:f},{text:"Top 100 Placings",value:p}];return r.a.createElement(he,null,r.a.createElement(j.a,{variant:"h2",gutterBottom:!0},"Hello, ".concat(l.name)),r.a.createElement(de.a,{container:!0,spacing:2},h.map((function(e){return r.a.createElement(de.a,{item:!0,xs:12,sm:6,md:3,key:e.text},r.a.createElement(me.a,{className:a.statBox},r.a.createElement(j.a,{variant:"subtitle1"},e.text),r.a.createElement(j.a,{variant:"h3"},e.value)))}))))};var Oe=function(){var e=Object(o.g)();return r.a.createElement(r.a.Fragment,null,r.a.createElement(j.a,{paragraph:!0},"You are not currently on any team's roster!"),r.a.createElement(ue.a,{variant:"contained",onClick:function(){e.push("/team/create")}},"Create Team"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(ue.a,{variant:"contained"},"Join Team"))},je=a(12),ye=a.n(je),we=a(21),xe=a(188),ke=a(427),Pe=a(426),Se=a(430);function Ne(e){return De.apply(this,arguments)}function De(){return(De=Object(we.a)(ye.a.mark((function e(t){return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){V.a.post("/team/create",{body:{name:t}},(function(t,n){t&&a(t),e(n)}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Te(){return Ce.apply(this,arguments)}function Ce(){return(Ce=Object(we.a)(ye.a.mark((function e(){return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,t){V.a.get("/team/invite",{},(function(a,n){a&&t(a),e(n.token)}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Me(e){return Be.apply(this,arguments)}function Be(){return(Be=Object(we.a)(ye.a.mark((function e(t){return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){V.a.get("/team/checkInvite",{query:{token:t}},(function(t,n){t&&a(t),e(n)}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Ie(e){return Fe.apply(this,arguments)}function Fe(){return(Fe=Object(we.a)(ye.a.mark((function e(t){return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){V.a.post("/team/join",{body:{token:t}},(function(t,n){t&&a(t),e(n)}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Le(e){return Re.apply(this,arguments)}function Re(){return(Re=Object(we.a)(ye.a.mark((function e(t){return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){V.a.get("/team/view",{query:{id:t}},(function(t,n){t&&a(t),e(n)}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var We=Object(E.a)((function(e){return{buttonProgress:{position:"absolute",top:"50%",left:"50%",marginTop:-12,marginLeft:-12},wrapper:{margin:e.spacing(1),position:"relative"}}}));function Ae(){var e=function(){var e=Object(n.useState)(!1),t=Object(b.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)(0),l=Object(b.a)(c,2),i=l[0],o=l[1],u=Object(n.useState)(""),s=Object(b.a)(u,2),m=s[0],p=s[1],f=$(),h=Object(b.a)(f,2),E=h[0],d=h[1];function g(){return(g=Object(we.a)(ye.a.mark((function e(){var t,a;return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r(!0),e.next=3,Ne(m);case 3:t=e.sent,a=t.token,U.a.set("authentication",a,(function(){return d.login()}));case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(n.useEffect)((function(){switch(console.log("Check",i),i){case 0:return Object(xe.timeout)((function(){o(1)}),2e3)}}),[i]),[{teamName:m,creationStep:i,buttonDisabled:a,userState:E},{setTeamName:p,submitTeamName:function(){o(2)},createTeam:function(){return g.apply(this,arguments)}}]}(),t=Object(b.a)(e,2),a=t[0],c=t[1],l=We();if(a.userState.user.team)return r.a.createElement(o.a,{to:"/team"});switch(a.creationStep){case 0:return r.a.createElement(r.a.Fragment,null,r.a.createElement(j.a,{variant:"h2"},"Create a team"),r.a.createElement("br",null),r.a.createElement(j.a,{variant:"subtitle1"},"Win the game, make some money"));case 1:return r.a.createElement(r.a.Fragment,null,r.a.createElement(j.a,{variant:"h2"},"Create a team"),r.a.createElement("br",null),r.a.createElement(j.a,{variant:"subtitle1"},"Enter your team name below"),r.a.createElement(se.a,{maxWidth:"sm",align:"center"},r.a.createElement(de.a,{container:!0},r.a.createElement(de.a,{item:!0,xs:6},r.a.createElement(Pe.a,{fullWidth:!0},r.a.createElement(Se.a,{placeholder:"Team Name",helperText:"You can change this later",value:a.teamName,required:!0,onChange:function(e){return c.setTeamName(e.target.value)}}))),r.a.createElement(de.a,{item:!0,xs:6},r.a.createElement(d.If,{condition:!!a.teamName.length,render:function(){return r.a.createElement(ue.a,{color:"primary",variant:"contained",onClick:c.submitTeamName},"Next")}})))));case 2:return r.a.createElement(r.a.Fragment,null,r.a.createElement(j.a,{variant:"h2"},"Team ",a.teamName),r.a.createElement("br",null),r.a.createElement(se.a,{maxWidth:"sm"},r.a.createElement(j.a,{paragraph:!0},"Your team will be active once you have 5 players add and confirmed, and then all 5 of you play a game together. Games played before registering the team or before roster changes do not count.")),r.a.createElement("div",{className:l.wrapper},r.a.createElement(ue.a,{color:"primary",variant:"contained",onClick:c.createTeam,disabled:a.buttonDisabled},"Create Team"),a.buttonDisabled&&r.a.createElement(ke.a,{size:24,className:l.buttonProgress})))}return null}var ze=function(){return r.a.createElement(he,null,r.a.createElement(Ae,null))},Je=a(55),Ue=a.n(Je),Ge=Object(E.a)((function(e){return{statBox:{padding:e.spacing(1,0,3,0)}}}));var Ye=function(){var e=Object(n.useState)(),t=Object(b.a)(e,2),a=t[0],c=t[1],l=$(),i=Object(b.a)(l,1)[0];Ge(),Object(n.useEffect)((function(){function e(){return(e=Object(we.a)(ye.a.mark((function e(){var t;return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Te();case 2:t=e.sent,c(t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}a||function(){e.apply(this,arguments)}()}),[a]);var o=i.user,u=o.team,s=(o.profile,"".concat(Ue.a.location.origin,"/team/join/").concat(a));return r.a.createElement(r.a.Fragment,null,r.a.createElement(j.a,{variant:"h3"},"Team: ",u.name),r.a.createElement(S.a,null),r.a.createElement("br",null),r.a.createElement(j.a,null,"Invite player using this link:\xa0",s?r.a.createElement("a",{href:s},s):"Loading..."))};Object(E.a)((function(e){return{statBox:{padding:e.spacing(1,0,3,0)}}}));var qe=function(){var e=Object(n.useState)(),t=Object(b.a)(e,2),a=t[0],c=t[1],l=Object(n.useState)(),i=Object(b.a)(l,2),u=i[0],s=i[1],m=Object(o.i)(),p=Object(o.g)(),f=m[0];function h(){return(h=Object(we.a)(ye.a.mark((function e(){var t,a;return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c(!0),e.prev=1,e.next=4,Ie(f);case 4:t=e.sent,a=t.team,p.push("/team/view/".concat(a.id)),e.next=13;break;case 9:return e.prev=9,e.t0=e.catch(1),c(!1),e.abrupt("return");case 13:case"end":return e.stop()}}),e,null,[[1,9]])})))).apply(this,arguments)}if(Object(n.useEffect)((function(){function e(){return(e=Object(we.a)(ye.a.mark((function e(){var t;return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Me(f);case 2:t=e.sent,s(t.team);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}u||function(){e.apply(this,arguments)}()}),[u]),a||!u){var E=a?"Joining ".concat(u.name):"Checking invite code...";return r.a.createElement(he,null,r.a.createElement(j.a,{variant:"h4"},E),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(ke.a,null))}return r.a.createElement(he,null,r.a.createElement(j.a,{variant:"h4"},"Do you want to join team"),r.a.createElement(j.a,{variant:"h1"},u.name),r.a.createElement("br",null),r.a.createElement(j.a,null,"You can join as many teams as you'd like, however only one of those teams may compete in league play."),r.a.createElement("br",null),r.a.createElement(de.a,{container:!0},r.a.createElement(de.a,{item:!0,xs:!1,sm:1}),r.a.createElement(de.a,{item:!0,xs:12,sm:4},r.a.createElement(ue.a,{onClick:function(){return h.apply(this,arguments)},variant:"contained",color:"primary"},"JOIN TEAM")),r.a.createElement(de.a,{item:!0,xs:!1,sm:2}),r.a.createElement(de.a,{item:!0,xs:12,sm:4},r.a.createElement(ue.a,{onClick:function(){p.push("/team")},variant:"contained",color:"secondary"},"REJECT INVITE")),r.a.createElement(de.a,{item:!0,xs:!1,sm:1})))};function Ve(){return r.a.createElement(he,null,r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(ke.a,{size:128}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("br",null))}var He=a(428),Xe=Object(E.a)((function(e){return{root:{}}}));function Ke(e){var t=Xe(),a=e.players;return r.a.createElement(D.a,{className:t.root},a.map((function(e){return r.a.createElement(T.a,{key:e.steamid,alignItems:"flex-start"},r.a.createElement(He.a,null,r.a.createElement(P.a,{alt:e.name,src:e.avatar})),r.a.createElement(M.a,{primary:e.name,secondary:r.a.createElement(r.a.Fragment,null,"MMR: ".concat(Math.round(100*e.mmr)/100))}))})))}var Qe=Object(E.a)((function(e){return{statBox:{padding:e.spacing(1,0,3,0)}}}));var Ze=function(){var e=Object(n.useState)(),t=Object(b.a)(e,2),a=t[0],c=t[1],l=$(),i=Object(b.a)(l,1)[0],u=(Qe(),Object(o.i)()[0]);return Object(n.useEffect)((function(){function e(){return(e=Object(we.a)(ye.a.mark((function e(){var t;return ye.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Le(u);case 2:t=e.sent,c(t.team);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}a||function(){e.apply(this,arguments)}()}),[a]),i.user.profile,a?r.a.createElement(he,null,r.a.createElement(j.a,{variant:"h2"},a.name),r.a.createElement(S.a,null),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(Ke,{players:a.players})):r.a.createElement(Ve,null)};var $e=function(){var e=Object(o.i)().action,t=$(),a=Object(b.a)(t,2),n=a[0],c=(a[1],!!n.user.team);switch(e){case"create":return r.a.createElement(ze,null);case"join":return r.a.createElement(qe,null);case"view":return r.a.createElement(Ze,null)}return c?r.a.createElement(he,null,r.a.createElement(Ye,null)):r.a.createElement(he,null,r.a.createElement(Oe,null))};function _e(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function et(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?_e(a,!0).forEach((function(t){Object(h.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):_e(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var tt=Object(E.a)((function(e){return{root:{display:"flex"},content:{flexGrow:1,padding:e.spacing(3)},toolbar:et({display:"flex",alignItems:"center",justifyContent:"flex-end",padding:e.spacing(0,1)},e.mixins.toolbar)}}));function at(e){var t=$(),a=Object(b.a)(t,1)[0],n=tt();return a.user?r.a.createElement("div",{className:n.root},r.a.createElement(le,null),r.a.createElement(re,null),r.a.createElement("main",{className:n.content},r.a.createElement("div",{className:n.toolbar}),r.a.createElement(o.d,null,r.a.createElement(o.b,{exact:!0,path:"/"},r.a.createElement(ve,null)),r.a.createElement(o.b,{path:"/team/:action/*"},r.a.createElement($e,null)),r.a.createElement(o.b,{path:"/team/:action"},r.a.createElement($e,null)),r.a.createElement(o.b,{path:"/team"},r.a.createElement($e,null)),r.a.createElement(o.b,null,r.a.createElement(Ee,null))))):r.a.createElement(fe,null)}var nt=function(){var e=$(),t=Object(b.a)(e,2),a=(t[0],t[1]),n=Object(o.g)();return U.a.remove("authentication",(function(){a.login(),n.push("/login")})),null};var rt=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(u.a,null),r.a.createElement(i.a,null,r.a.createElement(f,null),r.a.createElement(o.d,null,r.a.createElement(o.b,{exact:!0,path:"/auth/:token"},r.a.createElement(_,null)),r.a.createElement(o.b,{exact:!0,path:"/login"},r.a.createElement(fe,null)),r.a.createElement(o.b,{exact:!0,path:"/logout"},r.a.createElement(nt,null)),r.a.createElement(o.b,{path:"/"},r.a.createElement(at,null)))))};l.a.render(r.a.createElement(rt,null),document.getElementById("root"))}},[[198,1,2]]]);
//# sourceMappingURL=main.17eca53f.chunk.js.map