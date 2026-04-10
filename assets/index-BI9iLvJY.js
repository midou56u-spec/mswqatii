import{h as Nt,render as Pt}from"https://esm.sh/preact";import{useState as r,useEffect as q}from"https://esm.sh/preact/hooks";import St from"https://esm.sh/htm";import{GoogleGenAI as Dt}from"https://esm.run/@google/genai";import{initializeApp as Ut}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";import{getFirestore as Mt,onSnapshot as F,doc as x,updateDoc as f,collection as A,getDocs as D,deleteDoc as Kt,getDoc as rt,setDoc as Y,query as B,where as U,increment as M}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";(function(){const g=document.createElement("link").relList;if(g&&g.supports&&g.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))N(l);new MutationObserver(l=>{for(const b of l)if(b.type==="childList")for(const h of b.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&N(h)}).observe(document,{childList:!0,subtree:!0});function t(l){const b={};return l.integrity&&(b.integrity=l.integrity),l.referrerPolicy&&(b.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?b.credentials="include":l.crossOrigin==="anonymous"?b.credentials="omit":b.credentials="same-origin",b}function N(l){if(l.ep)return;l.ep=!0;const b=t(l);fetch(l.href,b)}})();const s=St.bind(Nt),jt={projectId:"gen-lang-client-0875902085",appId:"1:852106800021:web:2420af81b94cc4b67d649c",apiKey:"AIzaSyBcFY_4bq5HWWAeN3aNU4fFWA7P8_LJ-RQ",authDomain:"gen-lang-client-0875902085.firebaseapp.com",storageBucket:"gen-lang-client-0875902085.firebasestorage.app",messagingSenderId:"852106800021",measurementId:""},Et="ai-studio-6100c38d-0c90-47d2-bd34-dbb846b47b30",w=window.GEMINI_API_KEY&&window.GEMINI_API_KEY!=="undefined"&&window.GEMINI_API_KEY!=="null"?window.GEMINI_API_KEY:"AIzaSyBcFY_4bq5HWWAeN3aNU4fFWA7P8_LJ-RQ";console.log("Initializing Firebase and AI...");const Lt=Ut(jt),i=Mt(Lt,Et);let W=null;try{const u=w&&w.trim()!==""&&w!=="YOUR_KEY_HERE"&&w!=="undefined"&&w!=="null"?w:null;u?W=new Dt({apiKey:u}):console.warn("Gemini API Key is missing or invalid. AI features will be disabled until a key is provided.")}catch(u){console.error("AI Init Error:",u)}console.log("Initialization complete.");const o=({name:u,className:g="w-6 h-6"})=>{const t={PenTool:s`<path d="m12 19 7-7 3 3-7 7-3-3Zm0 0-3-3m0 0 2.29-2.29c.39-.39.39-1.02 0-1.41l-4.24-4.24c-.39-.39-1.02-.39-1.41 0L3.34 10.4c-.39.39-.39 1.02 0 1.41l4.24 4.24c.39.39 1.02.39 1.41 0L11.29 13.7M9 16l-2 2" />`,LayoutDashboard:s`<path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z" />`,CreditCard:s`<rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" />`,Settings:s`<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />`,LogOut:s`<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" />`,Plus:s`<path d="M12 5v14m-7-7h14" />`,ImageIcon:s`<rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />`,X:s`<path d="M18 6 6 18M6 6l12 12" />`,Copy:s`<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />`,AlertCircle:s`<circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />`,Loader2:s`<path d="M21 12a9 9 0 1 1-6.219-8.56" />`,Users:s`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />`,Key:s`<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3-3.5 3.5z" />`,Video:s`<path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" />`,Smartphone:s`<rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />`,Trash2:s`<path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9v4m4-4v4" />`,BarChart3:s`<path d="M3 3v18h18m-18-4h4m4-4h4m4-4h4" />`,Search:s`<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />`};return s`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=${g}>
                    ${t[u]||s`<circle cx="12" cy="12" r="10" />`}
                </svg>
            `},Tt=()=>{const[u,g]=r(()=>{const e=localStorage.getItem("app_user");return e?JSON.parse(e):null}),[t,N]=r(null),[l,b]=r("generate"),[h,it]=r(""),[K,dt]=r(""),[j,ct]=r(""),[J,E]=r([]),[Q,L]=r([]),[X,T]=r(!1),[$,Z]=r(null),[tt,et]=r(null),[P,d]=r(null),[st,m]=r(null),[y,ut]=r(""),[k,bt]=r(""),[_,pt]=r(""),[I,xt]=r("login"),[S,at]=r(""),[z,gt]=r(null),[lt,mt]=r([]),[ht,vt]=r(0),[G,ft]=r(""),[C,yt]=r(null);q(()=>{if(u!=null&&u.uid)return F(x(i,"users",u.uid),a=>{if(a.exists()){const n=a.data();N(n),n.phone==="admin"&&n.role!=="admin"&&f(x(i,"users",u.uid),{role:"admin"})}})},[u]),q(()=>{if((t==null?void 0:t.role)==="admin"){const e=F(x(i,"stats","global"),n=>gt(n.data())),a=F(A(i,"activationKeys"),n=>{mt(n.docs.map(c=>({id:c.id,...c.data()})).sort((c,p)=>p.createdAt-c.createdAt))});return D(A(i,"users")).then(n=>vt(n.size)),()=>{e(),a()}}},[t]),q(()=>{(async()=>{(await rt(x(i,"users","admin"))).exists()||await Y(x(i,"users","admin"),{uid:"admin",phone:"admin",password:"1182019",displayName:"المدير العام",role:"admin",shortId:"000000",createdAt:Date.now(),isActiveUntil:null})})()},[]);const wt=async()=>{if(d(null),!y||!k)return d("كمل البيانات يا بطل");try{const e=B(A(i,"users"),U("phone","==",y),U("password","==",k)),a=await D(e);if(a.empty)return d("البيانات غلط، ركز شوية");const n={uid:a.docs[0].id,...a.docs[0].data()};g(n),localStorage.setItem("app_user",JSON.stringify(n))}catch(e){d(e.message)}},$t=async()=>{if(d(null),!y||!k||!_)return d("كمل البيانات كلها");try{const e=B(A(i,"users"),U("phone","==",y));if(!(await D(e)).empty)return d("الرقم ده مسجل قبل كده");const n="u_"+Date.now(),c=Math.floor(1e5+Math.random()*9e5).toString(),p={uid:n,phone:y,password:k,displayName:_,role:"user",shortId:c,createdAt:Date.now(),isActiveUntil:null,trialPostsCount:6,trialScriptsCount:6};await Y(x(i,"users",n),p),g(p),localStorage.setItem("app_user",JSON.stringify(p))}catch(e){d(e.message)}},kt=e=>{var n;const a=(n=e.target.files)==null?void 0:n[0];if(a){const c=new FileReader;c.onloadend=()=>{const p=c.result.split(",")[1];Z({type:a.type,base64:p}),et(c.result)},c.readAsDataURL(a)}},It=async()=>{if(!h&&!$)return d("اكتب اسم المنتج أو ارفع صورة الأول");const e=l==="tiktok",a=Date.now(),n=(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.isActiveUntil)&&t.isActiveUntil>a;if(!n){if(e&&((t==null?void 0:t.trialScriptsCount)||0)<=0)return d("خلصت تجارب السكربتات يا نجم، فعل الحساب عشان تكمل");if(!e&&((t==null?void 0:t.trialPostsCount)||0)<=0)return d("خلصت تجارب البوستات يا نجم، فعل الحساب عشان تكمل")}if(T(!0),d(null),!W)return T(!1),d("مفتاح Gemini مش موجود. لو رفعت الموقع على GitHub، لازم تضيف المفتاح في الكود أو تستخدم Environment Variables.");const c=e?`أنت خبير صناعة محتوى تيك توك (TikTok Creator) مصري محترف وعالمي. مهمتك كتابة 3 نماذج لسكربتات فيديو تيك توك "تريند" واحترافية جداً بالعامية المصرية الراقية.
السكربت لازم يكون متقسم بوضوح كأنك مخرج سينمائي:
- [المشهد]: وصف دقيق للي بيحصل قدام الكاميرا (زوايا التصوير، الحركة).
- [الكلام]: النص اللي هيتقال بظبط بأسلوب خاطف وذكي.
- [الكتابة]: الجمل اللي هتظهر على الشاشة (Hooks) عشان تشد العين.
الأسلوب لازم يكون "شيك" ولبق جداً، بعيد عن الابتذال وبعيد عن الفصحى.
إذا وجدت صورة، حللها وادمج تفاصيلها في السيناريو بذكاء.
اكتب 3 سكربتات فقط، وافصل بينهم بكلمة "---SPLIT---".`:`أنت كاتب محتوى تسويقي مصري محترف، مثقف، ولبق جداً. مهمتك كتابة 3 نماذج لبوستات سوشيال ميديا بالعامية المصرية الراقية (لغة الطبقة المثقفة).
ممنوع تماماً استخدام لغة عربية فصحى (زي: هذا، سوف، نحن، رائع، مذهل).
استخدم بدائل مصرية مهذبة وشيك (زي: "ده"، "دي"، "هنـ"، "إحنا"، "حاجة راقية"، "ممتاز"، "اتفضلوا").
الأسلوب لازم يكون "سمبل" وشيك، كأنك بتكلم عميل VIP في مكان هادي.
إذا وجدت صورة، حللها كأنك خبير: "شوف" التفاصيل، الألوان، والجودة، واستخدم ده في الإقناع.
اكتب 3 بوستات فقط، بدون أي رغي زيادة.
افصل بين كل بوست والتاني بكلمة "---SPLIT---".`;let p="";h&&(p+=`اسم المنتج/الموضوع: ${h}. 
`),K&&(p+=`تفاصيل: ${K}. 
`),$&&(p+=`بص على الصورة دي كويس وحللها واكتب عنها بأسلوب شيك. 
`),j&&(p+=`ملحوظة مهمة من المستخدم: ${j} 
`);try{const v=[{text:p}];$&&v.push({inlineData:{data:$.base64,mimeType:$.type}});const nt=(await W.models.generateContent({model:"gemini-3-flash-preview",contents:[{role:"user",parts:v}],config:{systemInstruction:c,temperature:.7}})).text;if(nt){const ot=nt.split("---SPLIT---").map(R=>R.trim()).filter(R=>R.length>0);e?L(ot.slice(0,3)):E(ot.slice(0,3)),m(e?"السكربتات جاهزة يا نجم! 🎬":"البوستات جاهزة يا فنان! ✨");const H={aiRequestsCount:M(1)};n||(e?H.trialScriptsCount=M(-1):H.trialPostsCount=M(-1)),await f(x(i,"users",u.uid),H).catch(()=>{}),await f(x(i,"stats","global"),{aiRequestsCount:M(1)}).catch(()=>{})}else throw new Error("جيمناي مطلعش رد، جرب تاني")}catch(v){console.error("AI Error:",v),d("مشكلة في الذكاء الاصطناعي: "+v.message)}T(!1)},Ct=async()=>{var e;if(S)try{const a=await rt(x(i,"activationKeys",S));if(!a.exists()||(e=a.data())!=null&&e.used)return d("الكود ده غلط أو استُخدم قبل كده");const n=a.data(),c={};let p="";if(n.days){const v=(t==null?void 0:t.isActiveUntil)||Date.now();c.isActiveUntil=Math.max(v,Date.now())+n.days*24*60*60*1e3,p=`تم التفعيل بنجاح لمدة ${n.days} يوم!`}else c.trialPostsCount=((t==null?void 0:t.trialPostsCount)||0)+(n.posts||0),c.trialScriptsCount=((t==null?void 0:t.trialScriptsCount)||0)+(n.scripts||0),p=`تم إضافة ${n.posts||0} بوست و ${n.scripts||0} سكربت لرصيدك!`;await f(x(i,"users",u.uid),c),await f(x(i,"activationKeys",S),{used:!0}),m(p),at("")}catch(a){d(a.message)}},V=async e=>{try{const a=Math.random().toString(36).substring(2,10).toUpperCase();await Y(x(i,"activationKeys",a),{...e,used:!1,createdAt:Date.now()}),m("تم توليد الكود بنجاح: "+a)}catch(a){d("فشل توليد الكود: "+a.message)}},O=async()=>{if(!G)return;const e=B(A(i,"users"),U("shortId","==",G)),a=await D(e);if(a.empty)return d("المستخدم مش موجود");yt({uid:a.docs[0].id,...a.docs[0].data()})},At=()=>{g(null),localStorage.removeItem("app_user")};return u?s`
                <div class="min-h-screen bg-gray-50 pb-24" dir="rtl">
                    <header class="bg-white border-b sticky top-0 z-50">
                        <div class="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md"><${o} name="PenTool" className="text-white w-6 h-6" /></div>
                                <div>
                                    <h1 class="font-black text-blue-900 leading-tight">مسوقاتي AI</h1>
                                    <span class="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">V42</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="text-left hidden sm:block">
                                    <p class="text-xs font-bold text-gray-900">${t==null?void 0:t.displayName}</p>
                                    <p class="text-[10px] text-gray-500">ID: ${t==null?void 0:t.shortId}</p>
                                </div>
                                <button onClick=${At} class="p-2 text-gray-400 hover:text-red-500 transition-colors"><${o} name="LogOut" className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </header>

                    <main class="max-w-4xl mx-auto p-4">
                        <div class="flex bg-gray-100 p-1 rounded-2xl mb-8">
                            <button onClick=${()=>{b("generate"),E([]),L([])}} class=${`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${l==="generate"?"bg-white text-blue-600 shadow-sm":"text-gray-500"}`}><${o} name="PenTool" className="w-4 h-4" /> بوست فيسبوك</button>
                            <button onClick=${()=>{b("tiktok"),E([]),L([])}} class=${`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${l==="tiktok"?"bg-white text-blue-600 shadow-sm":"text-gray-500"}`}><${o} name="Video" className="w-4 h-4" /> سكربت تيك توك</button>
                            ${(t==null?void 0:t.role)==="admin"&&s`<button onClick=${()=>b("admin")} class=${`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${l==="admin"?"bg-white text-blue-600 shadow-sm":"text-gray-500"}`}><${o} name="Settings" className="w-4 h-4" /> الإدارة</button>`}
                        </div>

                        ${(l==="generate"||l==="tiktok")&&s`
                            <div class="space-y-6">
                                <div class="bg-blue-600 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-blue-100">
                                    <div class="flex items-center gap-2">
                                        <${o} name="BarChart3" className="w-5 h-5 opacity-80" />
                                        <span class="text-xs font-bold">رصيدك المتبقي:</span>
                                    </div>
                                    <div class="flex gap-3">
                                        <div class="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black">
                                            ${t!=null&&t.isActiveUntil&&t.isActiveUntil>Date.now()?"اشتراك نشط":`بوستات: ${(t==null?void 0:t.trialPostsCount)||0}`}
                                        </div>
                                        <div class="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black">
                                            ${t!=null&&t.isActiveUntil&&t.isActiveUntil>Date.now()?"غير محدود":`سكربتات: ${(t==null?void 0:t.trialScriptsCount)||0}`}
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-white p-6 rounded-[2rem] shadow-sm border space-y-6">
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-2">${l==="tiktok"?"عنوان الفيديو أو الموضوع":"اسم المنتج"}</label>
                                            <input type="text" placeholder=${l==="tiktok"?"مثلاً: نصائح للعناية بالبشرة...":"مثلاً: طقم كاجوال صيفي"} value=${h} onInput=${e=>it(e.target.value)} class="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold" />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-2">وصف إضافي (اختياري)</label>
                                            <textarea placeholder="اكتب أي تفاصيل تانية عايزها تظهر..." value=${K} onInput=${e=>dt(e.target.value)} class="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold min-h-[100px] resize-none" />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-2 text-blue-600">محتاج تعديل إيه؟ (اختياري)</label>
                                            <input type="text" placeholder="مثلاً: خليه أقصر، أو ركز على السعر..." value=${j} onInput=${e=>ct(e.target.value)} class="w-full p-4 bg-blue-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold" />
                                        </div>
                                        <div class="flex items-center gap-4">
                                            <label class="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-3xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                                                <${o} name="ImageIcon" className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                                                <span class="text-xs font-bold text-gray-500 group-hover:text-blue-600">ارفع صورة</span>
                                                <input type="file" accept="image/*" onChange=${kt} class="hidden" />
                                            </label>
                                            ${tt&&s`<div class="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-blue-100 shadow-sm"><img src=${tt} class="w-full h-full object-cover" /><button onClick=${()=>{Z(null),et(null)}} class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-lg"><${o} name="X" className="w-3 h-3" /></button></div>`}
                                        </div>
                                    </div>
                                    <button onClick=${It} disabled=${X} class="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 flex justify-center items-center gap-3 disabled:opacity-50">
                                        ${X?s`<${o} name="Loader2" className="w-6 h-6 animate-spin" /><span>بنكتبلك عظمة...</span>`:s`${l==="tiktok"?s`<${o} name="Video" className="w-6 h-6" />`:s`<${o} name="PenTool" className="w-6 h-6" />`}<span>${l==="tiktok"?"اكتبلي السكربتات ✨":"اكتبلي البوستات ✨"}</span>`}
                                    </button>
                                    ${(l==="tiktok"?Q:J).length>0&&s`
                                        <div class="space-y-6 mt-8">
                                            <h3 class="text-lg font-black text-gray-900 text-center">${l==="tiktok"?"اختار السكربت اللي يعجبك 🎬":"اختار البوست اللي يعجبك ✨"}</h3>
                                            ${(l==="tiktok"?Q:J).map((e,a)=>s`
                                                <div key=${a} class="p-6 bg-white rounded-[2rem] border-2 border-blue-100 relative shadow-sm">
                                                    <div class="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm">${a+1}</div>
                                                    <p class="text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">${e}</p>
                                                    <button onClick=${()=>{navigator.clipboard.writeText(e),m("تم النسخ بنجاح! ✅"),setTimeout(()=>m(null),2e3)}} class="mt-4 w-full py-3 bg-blue-50 text-blue-600 font-black rounded-xl border border-blue-100 flex items-center justify-center gap-2 text-sm"><${o} name="Copy" className="w-4 h-4" /> نسخ هذا النص</button>
                                                </div>
                                            `)}
                                        </div>
                                    `}
                                </div>
                            </div>
                        `}
                        
                        ${l==="subscription"&&s`
                            <div class="space-y-6">
                                <div class="bg-white p-8 rounded-[2rem] shadow-sm border space-y-8">
                                    <div class="text-center space-y-2"><h2 class="text-2xl font-black text-gray-900">خطط الاشتراك</h2><p class="text-gray-500 font-medium">اختار الخطة اللي تناسبك وفعل حسابك فوراً</p></div>
                                    
                                    <div class="grid grid-cols-1 gap-4">
                                        <div class="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 flex justify-between items-center">
                                            <div>
                                                <p class="font-black text-blue-900">الخطة الأساسية</p>
                                                <p class="text-xs text-blue-600 font-bold">30 بوست + 30 سكربت</p>
                                            </div>
                                            <p class="text-xl font-black text-blue-900">100 ج.م</p>
                                        </div>
                                        <div class="p-6 bg-indigo-50 rounded-3xl border-2 border-indigo-100 flex justify-between items-center">
                                            <div>
                                                <p class="font-black text-indigo-900">الخطة الاحترافية</p>
                                                <p class="text-xs text-indigo-600 font-bold">100 بوست + 100 سكربت</p>
                                            </div>
                                            <p class="text-xl font-black text-indigo-900">250 ج.م</p>
                                        </div>
                                        <div class="p-6 bg-purple-50 rounded-3xl border-2 border-purple-100 flex justify-between items-center">
                                            <div>
                                                <p class="font-black text-purple-900">الخطة الملكية</p>
                                                <p class="text-xs text-purple-600 font-bold">500 بوست + 500 سكربت</p>
                                            </div>
                                            <p class="text-xl font-black text-purple-900">500 ج.م</p>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="bg-gray-50 p-6 rounded-3xl border text-center"><p class="text-xs text-gray-500 mb-1 font-bold">رصيد البوستات</p><p class="text-lg font-black text-blue-900">${t!=null&&t.isActiveUntil&&t.isActiveUntil>Date.now()?"غير محدود":(t==null?void 0:t.trialPostsCount)||0}</p></div>
                                        <div class="bg-gray-50 p-6 rounded-3xl border text-center"><p class="text-xs text-gray-500 mb-1 font-bold">رصيد السكربتات</p><p class="text-lg font-black text-blue-900">${t!=null&&t.isActiveUntil&&t.isActiveUntil>Date.now()?"غير محدود":(t==null?void 0:t.trialScriptsCount)||0}</p></div>
                                    </div>
                                    <div class="space-y-4">
                                        <h3 class="font-black text-gray-800 flex items-center gap-2"><${o} name="Key" className="w-5 h-5 text-blue-600" /> تفعيل كود جديد</h3>
                                        <div class="flex gap-2">
                                            <input type="text" placeholder="ادخل الكود هنا" value=${S} onInput=${e=>at(e.target.value)} class="flex-1 p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl text-center font-black uppercase tracking-widest outline-none transition-all" />
                                            <button onClick=${Ct} class="bg-blue-600 text-white px-8 rounded-2xl font-black">تفعيل</button>
                                        </div>
                                    </div>
                                    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white text-center space-y-4 shadow-xl shadow-blue-200"><p class="font-bold opacity-90">للاشتراك أو تجديد الخدمة تواصل معنا:</p><p class="text-4xl font-black tracking-tighter">01090746032</p></div>
                                </div>
                            </div>
                        `}

                        ${l==="admin"&&(t==null?void 0:t.role)==="admin"&&s`
                            <div class="space-y-6">
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div class="bg-white p-6 rounded-3xl border shadow-sm"><div class="flex items-center gap-3 mb-2"><div class="p-2 bg-blue-100 rounded-lg text-blue-600"><${o} name="Users" className="w-5 h-5" /></div><span class="text-xs font-bold text-gray-500">إجمالي المستخدمين</span></div><p class="text-2xl font-black text-gray-900">${ht}</p></div>
                                    <div class="bg-white p-6 rounded-3xl border shadow-sm"><div class="flex items-center gap-3 mb-2"><div class="p-2 bg-purple-100 rounded-lg text-purple-600"><${o} name="BarChart3" className="w-5 h-5" /></div><span class="text-xs font-bold text-gray-500">طلبات الـ AI</span></div><p class="text-2xl font-black text-gray-900">${(z==null?void 0:z.aiRequestsCount)||0}</p></div>
                                    <div class="bg-white p-6 rounded-3xl border shadow-sm"><div class="flex items-center gap-3 mb-2"><div class="p-2 bg-orange-100 rounded-lg text-orange-600"><${o} name="Key" className="w-5 h-5" /></div><span class="text-xs font-bold text-gray-500">الأكواد المتاحة</span></div><p class="text-2xl font-black text-gray-900">${lt.filter(e=>!e.used).length}</p></div>
                                </div>
                                <div class="bg-white p-8 rounded-[2rem] border shadow-sm space-y-8">
                                    <div class="space-y-4"><h3 class="font-black text-gray-800 flex items-center gap-2"><${o} name="Plus" className="w-5 h-5 text-blue-600" /> توليد أكواد تفعيل</h3>
                                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            <button onClick=${()=>V({posts:30,scripts:30})} class="p-4 bg-blue-50 border-2 border-blue-100 hover:border-blue-500 rounded-2xl font-bold text-xs transition-all text-blue-700">30 بوست (100ج)</button>
                                            <button onClick=${()=>V({posts:100,scripts:100})} class="p-4 bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-500 rounded-2xl font-bold text-xs transition-all text-indigo-700">100 بوست (250ج)</button>
                                            <button onClick=${()=>V({posts:500,scripts:500})} class="p-4 bg-purple-50 border-2 border-purple-100 hover:border-purple-500 rounded-2xl font-bold text-xs transition-all text-purple-700">500 بوست (500ج)</button>
                                        </div>
                                    </div>
                                    <div class="space-y-4">
                                        <h3 class="font-black text-gray-800 flex items-center gap-2"><${o} name="Search" className="w-5 h-5 text-blue-600" /> البحث عن مستخدم</h3>
                                        <div class="flex gap-2"><input type="text" placeholder="ادخل الـ ID" value=${G} onInput=${e=>ft(e.target.value)} class="flex-1 p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl text-center font-bold outline-none transition-all" /><button onClick=${O} class="bg-blue-600 text-white px-8 rounded-2xl font-black">بحث</button></div>
                                        ${C&&s`<div class="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 flex justify-between items-center"><div><p class="font-black text-blue-900">${C.displayName}</p><p class="text-xs text-blue-600 font-bold">${C.phone}</p></div><div class="flex gap-2"><button onClick=${async()=>{const e=Date.now()+2592e6;await f(x(i,"users",C.uid),{isActiveUntil:e}),m("تم تفعيل شهر"),O()}} class="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold">تفعيل شهر</button><button onClick=${async()=>{await f(x(i,"users",C.uid),{isActiveUntil:null}),m("تم إلغاء التفعيل"),O()}} class="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold">إلغاء</button></div></div>`}
                                    </div>
                                    <div class="space-y-4"><h3 class="font-black text-gray-800">الأكواد الأخيرة</h3><div class="space-y-2 max-h-[300px] overflow-y-auto pr-2">${lt.map(e=>s`<div key=${e.id} class=${`p-4 rounded-2xl border flex justify-between items-center ${e.used?"bg-gray-50 opacity-50":"bg-white border-blue-100"}`}><div><p class="font-black text-sm tracking-widest">${e.id}</p><p class="text-[10px] font-bold text-gray-500">${e.days?`${e.days} يوم`:`${e.posts} بوست / ${e.scripts} سكربت`}</p></div><div class="flex items-center gap-3">${!e.used&&s`<button onClick=${()=>{navigator.clipboard.writeText(e.id),m("تم النسخ"),setTimeout(()=>m(null),2e3)}} class="p-2 text-blue-600"><${o} name="Copy" className="w-4 h-4" /></button>`}<button onClick=${async()=>{await Kt(x(i,"activationKeys",e.id))}} class="p-2 text-red-400"><${o} name="Trash2" className="w-4 h-4" /></button></div></div>`)}</div></div>
                                </div>
                            </div>
                        `}
                    </main>

                    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
                        <div class="max-w-4xl mx-auto flex justify-around items-center">
                            <button onClick=${()=>b("generate")} class=${`flex flex-col items-center gap-1 transition-all ${l==="generate"?"text-blue-600 scale-110":"text-gray-400"}`}><${o} name="LayoutDashboard" className="w-6 h-6" /><span class="text-[10px] font-black">الرئيسية</span></button>
                            <button onClick=${()=>b("subscription")} class=${`flex flex-col items-center gap-1 transition-all ${l==="subscription"?"text-blue-600 scale-110":"text-gray-400"}`}><${o} name="CreditCard" className="w-6 h-6" /><span class="text-[10px] font-black">الاشتراك</span></button>
                        </div>
                    </nav>

                    ${st&&s`<div class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg z-[100] animate-bounce">${st}</div>`}
                    ${P&&s`<div class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg z-[100] animate-shake">${P}</div>`}
                </div>
            `:s`
                    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-900" dir="rtl">
                        <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all">
                            <div class="p-8 text-center bg-blue-50">
                                <div class="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg rotate-3">
                                    <${o} name="PenTool" className="text-white w-10 h-10 -rotate-3" />
                                </div>
                                <h1 class="text-3xl font-black text-blue-900 mb-2">مسوقاتي AI</h1>
                                <p class="text-blue-600 font-medium">كاتب البوستات المصري الاحترافي</p>
                            </div>
                            <div class="p-8 space-y-4">
                                ${P&&s`<div class="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold border border-red-100"><${o} name="AlertCircle" className="w-4 h-4" /> ${P}</div>`}
                                <div class="space-y-3">
                                    <div class="relative">
                                        <${o} name="Smartphone" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" placeholder="رقم الموبايل" value=${y} onInput=${e=>ut(e.target.value)} class="w-full p-4 pr-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold" />
                                    </div>
                                    <div class="relative">
                                        <${o} name="Key" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="password" placeholder="كلمة السر" value=${k} onInput=${e=>bt(e.target.value)} class="w-full p-4 pr-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold" />
                                    </div>
                                    ${I==="register"&&s`
                                        <div class="relative">
                                            <${o} name="Users" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input type="text" placeholder="اسمك بالكامل" value=${_} onInput=${e=>pt(e.target.value)} class="w-full p-4 pr-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold" />
                                        </div>
                                    `}
                                </div>
                                <button onClick=${I==="login"?wt:$t} class="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">${I==="login"?"دخول يا بطل":"سجل حساب جديد"}</button>
                                <button onClick=${()=>xt(I==="login"?"register":"login")} class="w-full text-gray-500 font-bold text-sm hover:text-blue-600 transition-colors">${I==="login"?"معندكش حساب؟ سجل من هنا":"عندك حساب؟ ادخل من هنا"}</button>
                                
                                <div class="pt-6 border-t space-y-4">
                                    <p class="text-center text-xs font-black text-gray-400 uppercase tracking-widest">خطط الاشتراك المتاحة</p>
                                    <div class="grid grid-cols-1 gap-2">
                                        <div class="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                                            <span class="text-xs font-black text-blue-900">30 بوست + 30 سكربت</span>
                                            <span class="text-xs font-black text-blue-600">100 ج.م</span>
                                        </div>
                                        <div class="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
                                            <span class="text-xs font-black text-indigo-900">100 بوست + 100 سكربت</span>
                                            <span class="text-xs font-black text-indigo-600">250 ج.م</span>
                                        </div>
                                        <div class="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex justify-between items-center">
                                            <span class="text-xs font-black text-purple-900">500 بوست + 500 سكربت</span>
                                            <span class="text-xs font-black text-purple-600">500 ج.م</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `};Pt(s`<${Tt} />`,document.getElementById("root"));
