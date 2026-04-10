import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  CreditCard, 
  Settings, 
  LogOut, 
  Plus, 
  Image as ImageIcon, 
  X, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Users,
  Key,
  BarChart3,
  Search,
  Trash2,
  Smartphone,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  updateDoc, 
  increment,
  deleteDoc
} from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import { db } from './lib/firebase';
import { cn } from './lib/utils';

// --- Constants ---
const APP_VERSION = "42";
const GEMINI_KEY = (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "undefined" && process.env.GEMINI_API_KEY !== "null") 
  ? process.env.GEMINI_API_KEY 
  : ((import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY && (import.meta as any).env.VITE_GEMINI_API_KEY !== "undefined" && (import.meta as any).env.VITE_GEMINI_API_KEY !== "null")
    ? (import.meta as any).env.VITE_GEMINI_API_KEY
    : null;
const ai = (GEMINI_KEY && GEMINI_KEY.trim() !== "") ? new GoogleGenAI({ apiKey: GEMINI_KEY }) : null;
const DEFAULT_GROQ_KEY = "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";

// --- Types ---
interface UserProfile {
  uid: string;
  phone: string;
  displayName: string;
  role: 'user' | 'admin';
  shortId: string;
  createdAt: number;
  isActiveUntil: number | null;
  trialPostsCount?: number;
  trialScriptsCount?: number;
  password?: string;
}

interface ActivationKey {
  id: string;
  days: number;
  used: boolean;
  createdAt: number;
}

interface GlobalStats {
  aiRequestsCount: number;
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('app_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [refinement, setRefinement] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  const [generatedScripts, setGeneratedScripts] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [image, setImage] = useState<{type: string, base64: string} | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Auth States
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Admin States
  const [activationKey, setActivationKey] = useState('');
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [adminKeys, setAdminKeys] = useState<ActivationKey[]>([]);
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('custom_groq_key') || DEFAULT_GROQ_KEY);

  // --- Effects ---
  useEffect(() => {
    if (user?.uid) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data() as UserProfile;
          setProfile(data);
          if (data.phone === 'admin' && data.role !== 'admin') {
            updateDoc(doc.ref, { role: 'admin' });
          }
        }
      });
      return unsub;
    }
  }, [user]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      const unsubStats = onSnapshot(doc(db, 'stats', 'global'), d => setStats(d.data() as GlobalStats));
      const unsubKeys = onSnapshot(collection(db, 'activationKeys'), s => {
        setAdminKeys(s.docs.map(d => ({id: d.id, ...d.data()} as ActivationKey)).sort((a,b)=>b.createdAt-a.createdAt));
      });
      getDocs(collection(db, 'users')).then(s => setAllUsersCount(s.size));
      return () => { unsubStats(); unsubKeys(); };
    }
  }, [profile]);

  useEffect(() => {
    const bootstrap = async () => {
      const adminDoc = await getDoc(doc(db, 'users', 'admin'));
      if (!adminDoc.exists()) {
        await setDoc(doc(db, 'users', 'admin'), {
          uid: 'admin',
          phone: 'admin',
          password: '1182019', 
          displayName: 'المدير العام',
          role: 'admin',
          shortId: '000000',
          createdAt: Date.now(),
          isActiveUntil: null
        });
      }
    };
    bootstrap();
  }, []);

  // --- Handlers ---
  const handleLogin = async () => {
    setError(null);
    if (!phone || !password) return setError('كمل البيانات يا بطل');
    try {
      const q = query(collection(db, 'users'), where('phone', '==', phone), where('password', '==', password));
      const s = await getDocs(q);
      if (s.empty) return setError('البيانات غلط، ركز شوية');
      const userData = { uid: s.docs[0].id, ...s.docs[0].data() } as UserProfile;
      setUser(userData);
      localStorage.setItem('app_user', JSON.stringify(userData));
    } catch (e: any) { setError(e.message); }
  };

  const handleRegister = async () => {
    setError(null);
    if (!phone || !password || !displayName) return setError('كمل البيانات كلها');
    try {
      const q = query(collection(db, 'users'), where('phone', '==', phone));
      const s = await getDocs(q);
      if (!s.empty) return setError('الرقم ده مسجل قبل كده');
      const uid = 'u_' + Date.now();
      const shortId = Math.floor(100000 + Math.random() * 900000).toString();
      const userData: UserProfile = { 
        uid, phone, password, displayName, role: 'user', shortId, createdAt: Date.now(), isActiveUntil: null,
        trialPostsCount: 6, trialScriptsCount: 6
      };
      await setDoc(doc(db, 'users', uid), userData);
      setUser(userData);
      localStorage.setItem('app_user', JSON.stringify(userData));
    } catch (e: any) { setError(e.message); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage({ type: file.type, base64 });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!ai) {
      return setError('مفتاح Gemini مش موجود. لو رفعت الموقع على GitHub، لازم تروح لإعدادات الاستضافة (زي Vercel أو Netlify) وتضيف Environment Variable جديد باسم VITE_GEMINI_API_KEY وتحط فيه المفتاح بتاعك.');
    }
    if (!productName && !image) return setError('اكتب اسم المنتج أو ارفع صورة الأول');
    
    const now = Date.now();
    const hasActiveSubscription = profile?.isActiveUntil && profile.isActiveUntil > now;
    const hasPosts = (profile?.trialPostsCount || 0) > 0;
    const hasScripts = (profile?.trialScriptsCount || 0) > 0;
    
    const isTikTok = activeTab === 'tiktok';

    if (profile?.role !== 'admin' && !hasActiveSubscription) {
      if (isTikTok && !hasScripts) return setError('رصيد السكربتات خلص يا نجم، اشحن كود جديد');
      if (!isTikTok && !hasPosts) return setError('رصيد البوستات خلص يا نجم، اشحن كود جديد');
    }

    setGenerating(true); setError(null);
    
    const systemPrompt = isTikTok 
      ? `أنت خبير صناعة محتوى تيك توك (TikTok Creator) مصري محترف، مثقف، ولبق جداً. مهمتك كتابة 3 نماذج لسكربتات فيديو تيك توك قصيرة ومبهرة بالعامية المصرية الراقية.
السكربت لازم يكون "خاطف" من أول ثانية، بأسلوب ذكي ومحترم (لغة ولاد الناس).
ممنوع الفصحى تماماً، وممنوع الابتذال. استخدم تعبيرات مصرية شيك (زي: "يا أهلاً بيكم"، "حاجة في منتهى الشياكة"، "تجربة تستحق").
إذا وجدت صورة، حللها وادمج تفاصيلها في السكربت بذكاء.
اكتب 3 سكربتات فقط، بدون أي مقدمات.
افصل بين كل سكربت والتاني بكلمة "---SPLIT---".`
      : `أنت كاتب محتوى تسويقي مصري محترف، مثقف، ولبق جداً. مهمتك كتابة 3 نماذج لبوستات سوشيال ميديا بالعامية المصرية الراقية (لغة الطبقة المثقفة).
ممنوع تماماً استخدام لغة عربية فصحى (زي: هذا، سوف، نحن، رائع، مذهل).
استخدم بدائل مصرية مهذبة وشيك (زي: "ده"، "دي"، "هنـ"، "إحنا"، "حاجة راقية"، "ممتاز"، "اتفضلوا").
الأسلوب لازم يكون "سمبل" وشيك، كأنك بتكلم عميل VIP في مكان هادي.
إذا وجدت صورة، حللها كأنك خبير: "شوف" التفاصيل، الألوان، والجودة، واستخدم ده في الإقناع.
اكتب 3 بوستات فقط، بدون أي رغي زيادة.
افصل بين كل بوست والتاني بكلمة "---SPLIT---".`;

    let promptText = "";
    if (productName) promptText += `اسم المنتج/الموضوع: ${productName}. \n`;
    if (productDesc) promptText += `تفاصيل: ${productDesc}. \n`;
    if (image) promptText += `بص على الصورة دي كويس وحللها واكتب عنها بأسلوب شيك. \n`;
    if (refinement) promptText += `ملحوظة مهمة من المستخدم: ${refinement} \n`;
    
    try {
      let contents: any;

      if (image) {
        contents = {
          parts: [
            { inlineData: { data: image.base64, mimeType: image.type } },
            { text: promptText }
          ]
        };
      } else {
        contents = promptText;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });
      
      const text = response.text;
      
      if (text) {
        const results = text.split('---SPLIT---').map(p => p.trim()).filter(p => p.length > 0);
        if (isTikTok) {
          setGeneratedScripts(results.slice(0, 3));
        } else {
          setGeneratedPosts(results.slice(0, 3));
        }
        setSuccess(isTikTok ? 'السكربتات جاهزة يا نجم! 🎬' : 'البوستات جاهزة يا فنان! ✨');
        
        const updates: any = { aiRequestsCount: increment(1) };
        if (profile?.role !== 'admin' && !hasActiveSubscription) {
          if (isTikTok) updates.trialScriptsCount = increment(-1);
          else updates.trialPostsCount = increment(-1);
        }
        
        await updateDoc(doc(db, 'stats', 'global'), updates).catch(()=>{});
        if (profile?.role !== 'admin' && !hasActiveSubscription) {
          await updateDoc(doc(db, 'users', user!.uid), {
            trialPostsCount: isTikTok ? profile?.trialPostsCount : (profile?.trialPostsCount || 0) - 1,
            trialScriptsCount: isTikTok ? (profile?.trialScriptsCount || 0) - 1 : profile?.trialScriptsCount
          }).catch(()=>{});
        }
      } else {
        throw new Error('جيمناي مطلعش رد، جرب تاني');
      }
    } catch (e: any) {
      setError('مشكلة في الذكاء الاصطناعي: ' + e.message);
    }
    setGenerating(false);
  };

  const handleActivate = async () => {
    if (!activationKey) return;
    try {
      const keyDoc = await getDoc(doc(db, 'activationKeys', activationKey));
      if (!keyDoc.exists() || keyDoc.data()?.used) return setError('الكود ده غلط أو استُخدم قبل كده');
      const data = keyDoc.data()!;
      const updates: any = {};
      let msg = "";
      
      if (data.days) {
        const currentEnd = profile?.isActiveUntil || Date.now();
        updates.isActiveUntil = Math.max(currentEnd, Date.now()) + (data.days * 24 * 60 * 60 * 1000);
        msg = `تم التفعيل بنجاح لمدة ${data.days} يوم!`;
      } else {
        updates.trialPostsCount = (profile?.trialPostsCount || 0) + (data.posts || 0);
        updates.trialScriptsCount = (profile?.trialScriptsCount || 0) + (data.scripts || 0);
        msg = `تم إضافة ${data.posts || 0} بوست و ${data.scripts || 0} سكربت لرصيدك!`;
      }
      
      await updateDoc(doc(db, 'users', user!.uid), updates);
      await updateDoc(doc(db, 'activationKeys', activationKey), { used: true });
      setSuccess(msg);
      setActivationKey('');
    } catch (e: any) { setError(e.message); }
  };

  const generateKey = async (config: any) => {
    try {
      const id = Math.random().toString(36).substring(2, 10).toUpperCase();
      await setDoc(doc(db, 'activationKeys', id), { ...config, used: false, createdAt: Date.now() });
      setSuccess('تم توليد الكود بنجاح: ' + id);
    } catch (e: any) { setError('فشل توليد الكود: ' + e.message); }
  };

  const searchUser = async () => {
    if (!searchId) return;
    const q = query(collection(db, 'users'), where('shortId', '==', searchId));
    const s = await getDocs(q);
    if (s.empty) return setError('المستخدم مش موجود');
    setFoundUser({ uid: s.docs[0].id, ...s.docs[0].data() } as UserProfile);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-900 font-cairo" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8 text-center bg-blue-50">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg rotate-3">
              <PenTool className="text-white w-10 h-10 -rotate-3" />
            </div>
            <h1 className="text-3xl font-black text-blue-900 mb-2">مسوقاتي AI</h1>
            <p className="text-blue-600 font-medium">كاتب البوستات المصري الاحترافي</p>
          </div>

          <div className="p-8 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold border border-red-100">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            
            <div className="space-y-3">
              <div className="relative">
                <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="رقم الموبايل" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-4 pr-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold"
                />
              </div>
              
              <div className="relative">
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="كلمة السر" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold"
                />
              </div>

              {authMode === 'register' && (
                <div className="relative">
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="اسمك بالكامل" 
                    value={displayName} 
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full p-4 pr-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold"
                  />
                </div>
              )}
            </div>

            <button 
              onClick={authMode === 'login' ? handleLogin : handleRegister}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              {authMode === 'login' ? 'دخول يا بطل' : 'سجل حساب جديد'}
            </button>

            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="w-full text-gray-500 font-bold text-sm hover:text-blue-600 transition-colors"
            >
              {authMode === 'login' ? 'معندكش حساب؟ سجل من هنا' : 'عندك حساب؟ ادخل من هنا'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-cairo pb-24" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <PenTool className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-blue-900 leading-tight">مسوقاتي AI</h1>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">V{APP_VERSION}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-gray-900">{profile?.displayName}</p>
              <p className="text-[10px] text-gray-500">ID: {profile?.shortId}</p>
            </div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => { setActiveTab('generate'); setGeneratedPosts([]); setGeneratedScripts([]); }}
            className={cn(
              "flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2",
              activeTab === 'generate' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <PenTool className="w-4 h-4" />
            بوست فيسبوك
          </button>
          <button 
            onClick={() => { setActiveTab('tiktok'); setGeneratedPosts([]); setGeneratedScripts([]); }}
            className={cn(
              "flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2",
              activeTab === 'tiktok' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Video className="w-4 h-4" />
            سكربت تيك توك
          </button>
          {profile?.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={cn(
                "flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2",
                activeTab === 'admin' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Settings className="w-4 h-4" />
              الإدارة
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {(activeTab === 'generate' || activeTab === 'tiktok') && (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {activeTab === 'tiktok' ? 'عنوان الفيديو أو الموضوع' : 'اسم المنتج'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={activeTab === 'tiktok' ? "مثلاً: نصائح للعناية بالبشرة..." : "مثلاً: طقم كاجوال صيفي"}
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">وصف إضافي (اختياري)</label>
                    <textarea 
                      placeholder="اكتب أي تفاصيل تانية عايزها تظهر..." 
                      value={productDesc}
                      onChange={e => setProductDesc(e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold min-h-[100px] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 text-blue-600">محتاج تعديل إيه؟ (اختياري)</label>
                    <input 
                      type="text" 
                      placeholder="مثلاً: خليه أقصر، أو ركز على السعر..." 
                      value={refinement}
                      onChange={e => setRefinement(e.target.value)}
                      className="w-full p-4 bg-blue-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-3xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                      <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                      <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600">ارفع صورة</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    
                    {imagePreview && (
                      <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-blue-100 shadow-sm">
                        <img src={imagePreview} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => {setImage(null); setImagePreview(null);}}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleGenerate} 
                  disabled={generating}
                  className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 flex justify-center items-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>بنكتبلك عظمة...</span>
                    </>
                  ) : (
                    <>
                      {activeTab === 'tiktok' ? <Video className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
                      <span>{activeTab === 'tiktok' ? 'اكتبلي السكربتات ✨' : 'اكتبلي البوستات ✨'}</span>
                    </>
                  )}
                </button>

                {(activeTab === 'tiktok' ? generatedScripts : generatedPosts).length > 0 && (
                  <div className="space-y-6 mt-8">
                    <h3 className="text-lg font-black text-gray-900 text-center">
                      {activeTab === 'tiktok' ? 'اختار السكربت اللي يعجبك 🎬' : 'اختار البوست اللي يعجبك ✨'}
                    </h3>
                    {(activeTab === 'tiktok' ? generatedScripts : generatedPosts).map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white rounded-[2rem] border-2 border-blue-100 relative shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm">
                          {index + 1}
                        </div>
                        <div className="prose prose-blue max-w-none">
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">{item}</p>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(item);
                            setSuccess('تم النسخ بنجاح! ✅');
                          }}
                          className="mt-4 w-full py-3 bg-blue-50 text-blue-600 font-black rounded-xl border border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Copy className="w-4 h-4" />
                          نسخ هذا النص
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'subscription' && (
            <motion.div 
              key="subscription"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-gray-900">حالة الاشتراك</h2>
                  <p className="text-gray-500 font-medium">فعل حسابك عشان تستخدم الذكاء الاصطناعي براحتك</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-6 rounded-3xl border text-center">
                    <p className="text-xs text-gray-500 mb-1 font-bold">تاريخ الانتهاء</p>
                    <p className="text-lg font-black text-blue-900">
                      {profile?.isActiveUntil ? new Date(profile.isActiveUntil).toLocaleDateString('ar-EG') : 'غير مفعل'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border text-center">
                    <p className="text-xs text-gray-500 mb-1 font-bold">حالة الحساب</p>
                    <p className={cn(
                      "text-lg font-black",
                      profile?.isActiveUntil && profile.isActiveUntil > Date.now() ? "text-green-600" : "text-red-500"
                    )}>
                      {profile?.isActiveUntil && profile.isActiveUntil > Date.now() ? 'نشط ✅' : 'منتهي ❌'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-black text-gray-800 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    تفعيل كود جديد
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="ادخل الكود هنا" 
                      value={activationKey} 
                      onChange={e => setActivationKey(e.target.value)}
                      className="flex-1 p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl text-center font-black uppercase tracking-widest outline-none transition-all"
                    />
                    <button 
                      onClick={handleActivate}
                      className="bg-blue-600 text-white px-8 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                      تفعيل
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white text-center space-y-4 shadow-xl shadow-blue-200">
                  <p className="font-bold opacity-90">للاشتراك أو تجديد الخدمة تواصل معنا:</p>
                  <p className="text-4xl font-black tracking-tighter">01090746032</p>
                  <div className="flex justify-center gap-4 text-xs font-bold opacity-80">
                    <span>فودافون كاش</span>
                    <span>•</span>
                    <span>واتساب</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && profile?.role === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
                    <span className="text-xs font-bold text-gray-500">إجمالي المستخدمين</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{allUsersCount}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><BarChart3 className="w-5 h-5" /></div>
                    <span className="text-xs font-bold text-gray-500">طلبات الـ AI</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stats?.aiRequestsCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Key className="w-5 h-5" /></div>
                    <span className="text-xs font-bold text-gray-500">الأكواد المتاحة</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{adminKeys.filter(k=>!k.used).length}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-8">
                <div className="space-y-4">
                  <h3 className="font-black text-gray-800 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    توليد أكواد تفعيل
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button onClick={() => generateKey({ posts: 30, scripts: 30 })} className="p-4 bg-blue-50 border-2 border-blue-100 hover:border-blue-500 rounded-2xl font-bold text-xs transition-all text-blue-700">30 بوست (100ج)</button>
                    <button onClick={() => generateKey({ posts: 100, scripts: 100 })} className="p-4 bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-500 rounded-2xl font-bold text-xs transition-all text-indigo-700">100 بوست (250ج)</button>
                    <button onClick={() => generateKey({ posts: 500, scripts: 500 })} className="p-4 bg-purple-50 border-2 border-purple-100 hover:border-purple-500 rounded-2xl font-bold text-xs transition-all text-purple-700">500 بوست (500ج)</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-black text-gray-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    البحث عن مستخدم
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="ادخل الـ ID المكون من 6 أرقام" 
                      value={searchId} 
                      onChange={e => setSearchId(e.target.value)}
                      className="flex-1 p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl text-center font-bold outline-none transition-all"
                    />
                    <button onClick={searchUser} className="bg-blue-600 text-white px-8 rounded-2xl font-black">بحث</button>
                  </div>

                  {foundUser && (
                    <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 flex justify-between items-center">
                      <div>
                        <p className="font-black text-blue-900">{foundUser.displayName}</p>
                        <p className="text-xs text-blue-600 font-bold">{foundUser.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={async () => {
                            const newEnd = Date.now() + (30 * 24 * 60 * 60 * 1000);
                            await updateDoc(doc(db, 'users', foundUser.uid), { isActiveUntil: newEnd });
                            setSuccess('تم تفعيل شهر للمستخدم');
                            searchUser();
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                        >
                          تفعيل شهر
                        </button>
                        <button 
                          onClick={async () => {
                            await updateDoc(doc(db, 'users', foundUser.uid), { isActiveUntil: null });
                            setSuccess('تم إلغاء التفعيل');
                            searchUser();
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-black text-gray-800">الأكواد الأخيرة</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {adminKeys.map(k => (
                      <div key={k.id} className={cn(
                        "p-4 rounded-2xl border flex justify-between items-center",
                        k.used ? "bg-gray-50 opacity-50" : "bg-white border-blue-100"
                      )}>
                        <div>
                          <p className="font-black text-sm tracking-widest">{k.id}</p>
                          <p className="text-[10px] font-bold text-gray-500">{k.days} يوم • {new Date(k.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {k.used ? (
                            <span className="text-[10px] font-bold text-gray-400">مستخدم</span>
                          ) : (
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(k.id);
                                setSuccess('تم نسخ الكود');
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={async () => {
                              await deleteDoc(doc(db, 'activationKeys', k.id));
                            }}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
        <div className="max-w-4xl mx-auto flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('generate')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === 'generate' ? "text-blue-600 scale-110" : "text-gray-400"
            )}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-black">الرئيسية</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('subscription')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === 'subscription' ? "text-blue-600 scale-110" : "text-gray-400"
            )}
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-[10px] font-black">الاشتراك</span>
          </button>

          {profile?.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeTab === 'admin' ? "text-blue-600 scale-110" : "text-gray-400"
              )}
            >
              <Settings className="w-6 h-6" />
              <span className="text-[10px] font-black">المدير</span>
            </button>
          )}
        </div>
      </nav>

      {/* Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 z-[100]"
          >
            <div className="bg-green-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm">{success}</span>
              </div>
              <button onClick={() => setSuccess(null)}><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
