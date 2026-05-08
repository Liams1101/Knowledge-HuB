import { useState, useEffect, useRef, useCallback, createContext, useContext, lazy, Suspense } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --gold: #C9A84C;
      --gold-light: #E8C97A;
      --gold-pale: #F5E9C8;
      --cream: #FAF7F2;
      --cream-dark: #F0EAE0;
      --ink: #1A1612;
      --ink-muted: #4A4540;
      --ink-faint: #8A8278;
      --rust: #A0522D;
      --sage: #7C9070;
      --shadow-soft: 0 4px 24px rgba(26,22,18,0.08);
      --shadow-card: 0 8px 40px rgba(26,22,18,0.12);
      --shadow-float: 0 20px 60px rgba(26,22,18,0.18);
      --radius: 12px;
      --radius-lg: 20px;
      --transition: cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dark {
      --cream: #141210;
      --cream-dark: #1E1A16;
      --ink: #F5F0E8;
      --ink-muted: #C5BFB5;
      --ink-faint: #8A8278;
      --shadow-soft: 0 4px 24px rgba(0,0,0,0.3);
      --shadow-card: 0 8px 40px rgba(0,0,0,0.4);
      --shadow-float: 0 20px 60px rgba(0,0,0,0.5);
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--cream);
      color: var(--ink);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream-dark); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

    /* Focus visible */
    *:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 3px;
      border-radius: 4px;
    }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes pulse-gold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
      50% { box-shadow: 0 0 0 10px rgba(201,168,76,0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    .animate-fadeUp { animation: fadeUp 0.6s var(--transition) both; }
    .animate-fadeIn { animation: fadeIn 0.4s ease both; }
    .animate-float { animation: float 3s ease-in-out infinite; }

    /* Skeleton */
    .skeleton {
      background: linear-gradient(90deg, var(--cream-dark) 25%, var(--cream) 50%, var(--cream-dark) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }

    /* Glassmorphism */
    .glass {
      background: rgba(250,247,242,0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .dark .glass {
      background: rgba(20,18,16,0.85);
    }

    /* Typography */
    h1, h2, h3, h4 { font-family: 'Cormorant Garamond', serif; font-weight: 600; line-height: 1.2; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px; border-radius: 50px; border: none;
      font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
      cursor: pointer; transition: all 0.3s var(--transition);
      text-decoration: none; white-space: nowrap;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      color: var(--ink); box-shadow: 0 4px 16px rgba(201,168,76,0.35);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(201,168,76,0.5);
    }
    .btn-secondary {
      background: transparent; border: 1.5px solid var(--gold);
      color: var(--gold);
    }
    .btn-secondary:hover {
      background: var(--gold); color: var(--ink);
      transform: translateY(-2px);
    }
    .btn-ghost {
      background: transparent; color: var(--ink-muted);
    }
    .btn-ghost:hover { color: var(--gold); }

    /* Cards */
    .card {
      background: var(--cream-dark);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-soft);
      transition: all 0.3s var(--transition);
      overflow: hidden;
    }
    .card:hover {
      box-shadow: var(--shadow-float);
      transform: translateY(-4px);
    }

    /* Badges */
    .badge {
      display: inline-flex; align-items: center;
      padding: 4px 12px; border-radius: 50px;
      font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .badge-gold { background: var(--gold-pale); color: var(--rust); }
    .badge-dark { background: var(--ink); color: var(--gold); }

    /* Input */
    .input {
      width: 100%; padding: 12px 16px;
      background: var(--cream); border: 1.5px solid var(--cream-dark);
      border-radius: var(--radius); color: var(--ink);
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      transition: all 0.2s; outline: none;
    }
    .input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.15); }
    .input::placeholder { color: var(--ink-faint); }

    /* Overlay */
    .overlay {
      position: fixed; inset: 0;
      background: rgba(26,22,18,0.7);
      backdrop-filter: blur(4px);
      z-index: 100;
      animation: fadeIn 0.2s ease;
    }

    /* Modal */
    .modal {
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      z-index: 101;
      width: min(560px, 95vw);
      background: var(--cream);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-float);
      animation: fadeUp 0.3s var(--transition);
      overflow: hidden;
    }

    /* Nav */
    nav {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 50; height: 72px;
      display: flex; align-items: center;
      padding: 0 clamp(16px, 4vw, 48px);
      transition: all 0.3s;
    }
    nav.scrolled {
      box-shadow: var(--shadow-soft);
    }

    /* Section */
    .section { padding: clamp(48px, 8vw, 96px) clamp(16px, 4vw, 48px); }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 600; margin-bottom: 8px;
    }
    .section-subtitle {
      color: var(--ink-faint); font-size: 15px; margin-bottom: 40px;
    }

    /* Book Grid */
    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 24px;
    }

    /* Book Card */
    .book-card {
      cursor: pointer; border-radius: var(--radius-lg); overflow: hidden;
      background: var(--cream-dark); transition: all 0.35s var(--transition);
      box-shadow: var(--shadow-soft);
    }
    .book-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-float); }
    .book-cover {
      width: 100%; aspect-ratio: 2/3; object-fit: cover;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .book-info { padding: 16px; }
    .book-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px; font-weight: 600;
      margin-bottom: 4px; line-height: 1.3;
    }
    .book-author { font-size: 12px; color: var(--ink-faint); }
    .book-price { font-size: 15px; font-weight: 600; color: var(--gold); margin-top: 8px; }

    /* Hero */
    .hero {
      min-height: 100vh; display: flex; align-items: center;
      padding: 120px clamp(16px, 4vw, 48px) 80px;
      position: relative; overflow: hidden;
    }

    /* Stars */
    .stars {
      display: flex; gap: 2px; color: var(--gold); font-size: 13px;
    }

    /* Reading progress */
    .progress-bar {
      height: 3px; background: var(--cream-dark);
      border-radius: 2px; overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      transition: width 0.3s;
    }

    /* Tabs */
    .tabs { display: flex; gap: 4px; padding: 4px;
      background: var(--cream-dark); border-radius: 50px; }
    .tab {
      padding: 8px 20px; border-radius: 50px; border: none;
      font-family: 'DM Sans', sans-serif; font-size: 13px;
      cursor: pointer; transition: all 0.2s;
      background: transparent; color: var(--ink-muted);
    }
    .tab.active {
      background: var(--gold);
      color: var(--ink); font-weight: 600;
    }

    /* Toast */
    .toast {
      position: fixed; bottom: 24px; right: 24px;
      padding: 14px 20px; border-radius: var(--radius);
      background: var(--ink); color: var(--cream);
      font-size: 14px; z-index: 200;
      animation: fadeUp 0.3s var(--transition);
      display: flex; align-items: center; gap: 10px;
      box-shadow: var(--shadow-float);
      max-width: 320px;
    }

    /* Sidebar reader */
    .reader-sidebar {
      position: fixed; left: 0; top: 0; bottom: 0;
      width: 280px; background: var(--cream);
      box-shadow: var(--shadow-float); z-index: 60;
      transform: translateX(-100%); transition: transform 0.3s var(--transition);
      overflow-y: auto; padding: 24px;
    }
    .reader-sidebar.open { transform: translateX(0); }

    /* Reader toolbar */
    .reader-toolbar {
      position: fixed; top: 0; left: 0; right: 0;
      height: 60px; display: flex; align-items: center;
      padding: 0 24px; gap: 16px; z-index: 55;
    }

    /* Category pill */
    .cat-pill {
      padding: 8px 20px; border-radius: 50px;
      border: 1.5px solid var(--cream-dark);
      font-size: 13px; cursor: pointer;
      transition: all 0.2s; background: transparent;
      color: var(--ink-muted); font-family: 'DM Sans', sans-serif;
      white-space: nowrap;
    }
    .cat-pill:hover, .cat-pill.active {
      border-color: var(--gold); color: var(--gold);
      background: rgba(201,168,76,0.08);
    }

    /* Carousel */
    .carousel-track {
      display: flex; gap: 24px;
      overflow-x: auto; padding-bottom: 8px;
      scrollbar-width: none;
    }
    .carousel-track::-webkit-scrollbar { display: none; }
    .carousel-item { flex-shrink: 0; width: 200px; }

    /* Divider */
    .divider {
      height: 1px; background: var(--cream-dark);
      margin: 24px 0;
    }

    /* Avatar */
    .avatar {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 16px; flex-shrink: 0;
    }

    /* Ticker */
    .ticker { overflow: hidden; }
    .ticker-inner { display: flex; animation: marquee 30s linear infinite; white-space: nowrap; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

    @media (max-width: 768px) {
      .book-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
      .hero { padding-top: 100px; }
      nav { padding: 0 16px; }
    }
  `}</style>
);

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

const useApp = () => useContext(AppContext);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Fiction", "Philosophy", "Science", "History", "Children", "Technology", "Self-Development"];

const BOOKS = [
  { id: 1, title: "Atomic Habits", author: "James Clear", category: "Self-Development", price: 14.99, rating: 4.9, reviews: 8420, cover: "#8B6914", pages: 320, chapters: 20, description: "Tiny changes, remarkable results. A proven framework for getting 1% better every day.", featured: true, trending: true, badge: "Bestseller", readTime: "5h 20min" },
  { id: 2, title: "The Midnight Library", author: "Matt Haig", category: "Fiction", price: 12.99, rating: 4.7, reviews: 6210, cover: "#1B4F72", pages: 288, chapters: 18, description: "Between life and death there is a library. Its books give you the chance to live differently.", featured: true, trending: true, badge: "Award Winner", readTime: "4h 48min" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", category: "History", price: 16.99, rating: 4.8, reviews: 12400, cover: "#6E2C00", pages: 443, chapters: 20, description: "A brief history of humankind — from the Stone Age to the 21st century.", featured: true, badge: "Classic", readTime: "7h 23min" },
  { id: 4, title: "The Philosophy of Now", author: "A.C. Grayling", category: "Philosophy", price: 13.99, rating: 4.5, reviews: 3100, cover: "#2C3E50", pages: 256, chapters: 14, description: "A meditation on time, consciousness, and what it means to be present.", readTime: "4h 16min" },
  { id: 5, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", price: 11.99, rating: 4.9, reviews: 15600, cover: "#0B5345", pages: 212, chapters: 12, description: "From the Big Bang to black holes — Hawking's classic exploration of the universe.", badge: "Classic", readTime: "3h 32min" },
  { id: 6, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", price: 10.99, rating: 4.6, reviews: 9870, cover: "#7B241C", pages: 208, chapters: 16, description: "A magical tale about following your dreams and the journey of self-discovery.", trending: true, readTime: "3h 28min" },
  { id: 7, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Science", price: 15.99, rating: 4.7, reviews: 7650, cover: "#154360", pages: 499, chapters: 38, description: "A groundbreaking tour of the mind exploring two systems that drive the way we think.", readTime: "8h 19min" },
  { id: 8, title: "The Wonder Years", author: "Sophie Allen", category: "Children", price: 8.99, rating: 4.8, reviews: 2100, cover: "#E67E22", pages: 180, chapters: 22, description: "A heartwarming story of childhood wonder and imagination for young readers.", badge: "New", readTime: "3h 0min" },
  { id: 9, title: "Clean Code", author: "Robert C. Martin", category: "Technology", price: 18.99, rating: 4.6, reviews: 5400, cover: "#1C2833", pages: 431, chapters: 17, description: "A handbook of agile software craftsmanship for the modern developer.", readTime: "7h 11min" },
  { id: 10, title: "Being Mortal", author: "Atul Gawande", category: "Philosophy", price: 13.49, rating: 4.8, reviews: 4300, cover: "#4A235A", pages: 282, chapters: 8, description: "On aging, medicine, and what matters in the end — a profound meditation.", trending: true, readTime: "4h 42min" },
  { id: 11, title: "The Name of the Wind", author: "Patrick Rothfuss", category: "Fiction", price: 14.49, rating: 4.9, reviews: 11200, cover: "#1A5276", pages: 662, chapters: 92, description: "The legendary Kingkiller Chronicle begins — a legend told in his own words.", badge: "Fan Favourite", readTime: "11h 2min" },
  { id: 12, title: "Educated", author: "Tara Westover", category: "History", price: 13.99, rating: 4.8, reviews: 8900, cover: "#5D4037", pages: 334, chapters: 40, description: "A memoir about the transformative power of education and family secrets.", trending: true, badge: "Memoir", readTime: "5h 34min" },
];

const TESTIMONIALS = [
  { name: "Sarah Mitchell", role: "Avid Reader", text: "Ofem's Library transformed how I read. The chapter tax system is genius — I can try before I commit!", avatar: "#9B59B6", rating: 5 },
  { name: "David Okafor", role: "Book Club Organiser", text: "The reading interface is absolutely beautiful. My whole book club has switched over.", avatar: "#E74C3C", rating: 5 },
  { name: "Priya Sharma", role: "Student", text: "Accessibility features are outstanding. As a screen reader user, this is the most inclusive bookstore I've used.", avatar: "#27AE60", rating: 5 },
  { name: "Marcus Wells", role: "Author", text: "The platform respects both readers and writers. Anti-piracy measures give me confidence publishing here.", avatar: "#F39C12", rating: 5 },
];

const CHAPTER_PRICE = 0.99;

// ─── UTILS ───────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 13 }) => (
  <span className="stars" aria-label={`${rating} out of 5 stars`} style={{ fontSize: size }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} aria-hidden="true">{i <= Math.floor(rating) ? "★" : i - rating < 1 ? "½" : "☆"}</span>
    ))}
  </span>
);

const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
    <div style={{ width: 32, height: 32, border: "3px solid var(--cream-dark)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>
);

const BookCoverArt = ({ book, style = {} }) => {
  const colors = {
    "#8B6914": { bg: "#8B6914", accent: "#F5D37A" },
    "#1B4F72": { bg: "#1B4F72", accent: "#85C1E9" },
    "#6E2C00": { bg: "#6E2C00", accent: "#F0B27A" },
    "#2C3E50": { bg: "#2C3E50", accent: "#AEB6BF" },
    "#0B5345": { bg: "#0B5345", accent: "#7DCEA0" },
    "#7B241C": { bg: "#7B241C", accent: "#F1948A" },
    "#154360": { bg: "#154360", accent: "#5DADE2" },
    "#E67E22": { bg: "#E67E22", accent: "#FDEBD0" },
    "#1C2833": { bg: "#1C2833", accent: "#85929E" },
    "#4A235A": { bg: "#4A235A", accent: "#C39BD3" },
    "#1A5276": { bg: "#1A5276", accent: "#7FB3D3" },
    "#5D4037": { bg: "#5D4037", accent: "#BCAAA4" },
  };
  const c = colors[book.cover] || { bg: "#5D4037", accent: "#BCAAA4" };
  return (
    <div style={{ background: c.bg, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "20px 14px", position: "relative", ...style }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.1, background: `radial-gradient(circle at 70% 30%, ${c.accent}, transparent 60%)` }} />
      <div style={{ color: c.accent, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.9, alignSelf: "flex-start" }}>Ofem's Library</div>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ width: 40, height: 2, background: c.accent, margin: "0 auto 12px", opacity: 0.6 }} />
        <div style={{ color: c.accent, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(12px,3vw,15px)", fontWeight: 600, lineHeight: 1.3, maxWidth: 120 }}>{book.title}</div>
        <div style={{ width: 40, height: 2, background: c.accent, margin: "12px auto 0", opacity: 0.6 }} />
      </div>
      <div style={{ color: c.accent, fontSize: 10, opacity: 0.7, alignSelf: "flex-end" }}>{book.author}</div>
    </div>
  );
};

// ─── TOAST ───────────────────────────────────────────────────────────────────
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const colors = { success: "#27AE60", error: "#E74C3C", info: "var(--gold)" };
  return (
    <div className="toast" role="alert" aria-live="polite">
      <span style={{ color: colors[type], fontWeight: 700, fontSize: 16 }}>{icons[type]}</span>
      {message}
    </div>
  );
};

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
const AuthModal = ({ mode: initialMode = "login", onClose, onSuccess }) => {
  const { login, signup } = useApp();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await signup(form.name, form.email, form.password);
      onSuccess?.();
      onClose();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)", padding: "32px 32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
          <h2 id="auth-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "var(--ink)" }}>
            {mode === "login" ? "Welcome Back" : "Join the Library"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 4 }}>
            {mode === "login" ? "Continue your reading journey" : "Start your reading adventure today"}
          </p>
        </div>
        <div style={{ padding: "28px 32px 32px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {["login","signup"].map(m => (
              <button key={m} className={`tab ${mode===m?"active":""}`} style={{ flex: 1 }} onClick={() => { setMode(m); setError(""); }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--ink-muted)" }} htmlFor="name">Full Name</label>
              <input id="name" className="input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--ink-muted)" }} htmlFor="email">Email Address</label>
            <input id="email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--ink-muted)" }} htmlFor="password">Password</label>
            <input id="password" className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
          </div>
          {error && <p style={{ color: "#E74C3C", fontSize: 13, margin: "8px 0" }} role="alert">{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={handleSubmit} disabled={loading} aria-busy={loading}>
            {loading ? <Spinner /> : mode === "login" ? "Sign In" : "Create Account"}
          </button>
          <button className="btn" style={{ marginTop: 12, width: "100%", justifyContent: "center", border: "1.5px solid var(--cream-dark)", color: "var(--ink-muted)" }} onClick={() => {}}>
            <span>G</span> Continue with Google
          </button>
        </div>
      </div>
    </>
  );
};

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
const PaymentModal = ({ item, type = "book", onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const price = type === "chapter" ? CHAPTER_PRICE : item?.price;

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    onSuccess?.();
    onClose();
    setLoading(false);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
        <div style={{ padding: "28px 32px", borderBottom: "1px solid var(--cream-dark)" }}>
          <h2 id="payment-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, marginBottom: 4 }}>
            {type === "chapter" ? "Unlock Chapter" : "Purchase Book"}
          </h2>
          <p style={{ color: "var(--ink-faint)", fontSize: 14 }}>
            {type === "chapter" ? `Unlock Chapter ${item?.num} — ${item?.title}` : item?.title}
          </p>
        </div>
        <div style={{ padding: "24px 32px" }}>
          <div style={{ background: "var(--cream-dark)", borderRadius: var_radius, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ color: "var(--ink-muted)", fontSize: 14 }}>
              {type === "chapter" ? "Chapter Tax" : "Book Price"}
            </span>
            <span style={{ fontWeight: 700, fontSize: 20, color: "var(--gold)" }}>${price}</span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--ink-muted)" }}>Card Number</label>
            <input className="input" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--ink-muted)" }}>Expiry</label>
              <input className="input" placeholder="MM/YY" defaultValue="12/28" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--ink-muted)" }}>CVV</label>
              <input className="input" placeholder="123" type="password" defaultValue="123" />
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }} onClick={handlePay} disabled={loading}>
            {loading ? <Spinner /> : `Pay $${price}`}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--ink-faint)", marginTop: 12 }}>
            🔒 Secured with 256-bit encryption
          </p>
        </div>
      </div>
    </>
  );
};

// hack for the var_radius reference in JSX
const var_radius = "var(--radius)";

// ─── BOOK DETAIL MODAL ────────────────────────────────────────────────────────
const BookDetailModal = ({ book, onClose, onRead }) => {
  const { user, purchasedBooks, addToWishlist, wishlist, showToast } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const owned = purchasedBooks.includes(book.id);
  const wished = wishlist.includes(book.id);

  if (showAuth) return <AuthModal mode="login" onClose={() => setShowAuth(false)} onSuccess={() => setShowPayment(true)} />;
  if (showPayment) return <PaymentModal item={book} type="book" onClose={() => setShowPayment(false)} onSuccess={() => { showToast(`"${book.title}" purchased! Happy reading 📚`, "success"); onClose(); onRead(book); }} />;

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={`book-${book.id}-title`} style={{ maxWidth: 640, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 0, minHeight: 240 }}>
          <div style={{ height: 240 }}>
            <BookCoverArt book={book} />
          </div>
          <div style={{ padding: "24px 24px 24px 20px" }}>
            {book.badge && <span className="badge badge-gold" style={{ marginBottom: 8 }}>{book.badge}</span>}
            <h2 id={`book-${book.id}-title`} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1.2, marginBottom: 4 }}>{book.title}</h2>
            <p style={{ color: "var(--ink-faint)", fontSize: 14, marginBottom: 12 }}>by {book.author}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Stars rating={book.rating} />
              <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>{book.reviews.toLocaleString()} reviews</span>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>${book.price}</div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>Full Access</div>
              </div>
              <div style={{ width: 1, background: "var(--cream-dark)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--sage)" }}>${CHAPTER_PRICE}</div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>Per Chapter</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: 20 }}>{book.description}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { label: "Pages", value: book.pages },
              { label: "Chapters", value: book.chapters },
              { label: "Read Time", value: book.readTime },
              { label: "Category", value: book.category },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "var(--cream-dark)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {owned ? (
              <button className="btn btn-primary" onClick={() => { onClose(); onRead(book); }}>
                📖 Continue Reading
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => user ? setShowPayment(true) : setShowAuth(true)}>
                  🛒 Buy Full Access — ${book.price}
                </button>
                <button className="btn btn-secondary" onClick={() => { onClose(); onRead(book); }}>
                  📄 Read by Chapter
                </button>
              </>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => { addToWishlist(book.id); showToast(wished ? "Removed from wishlist" : "Added to wishlist ❤️"); }}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              style={{ color: wished ? "#E74C3C" : "var(--ink-faint)" }}
            >
              {wished ? "♥" : "♡"} Wishlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── BOOK CARD ────────────────────────────────────────────────────────────────
const BookCard = ({ book, onClick, delay = 0 }) => (
  <article
    className="book-card animate-fadeUp"
    style={{ animationDelay: `${delay}ms`, cursor: "pointer" }}
    onClick={() => onClick(book)}
    onKeyDown={e => e.key === "Enter" && onClick(book)}
    tabIndex={0}
    role="button"
    aria-label={`${book.title} by ${book.author}, $${book.price}`}
  >
    <div className="book-cover">
      <BookCoverArt book={book} />
    </div>
    <div className="book-info">
      {book.badge && <span className="badge badge-gold" style={{ marginBottom: 6, fontSize: 10 }}>{book.badge}</span>}
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">{book.author}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
        <Stars rating={book.rating} size={11} />
        <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>({book.reviews.toLocaleString()})</span>
      </div>
      <p className="book-price">${book.price}</p>
    </div>
  </article>
);

// ─── READER ──────────────────────────────────────────────────────────────────
const SAMPLE_CONTENT = `The morning mist clung to the cobblestones as Eleanor stepped out of the archive. She carried with her a single manila envelope, its edges worn soft from years of careful handling.

Inside were forty-seven pages — the only surviving copies of a correspondence that had, according to the scholars who dismissed it as forgery, never existed.

But Eleanor knew better. She had spent eleven years reconstructing the chain of provenance: a footnote in a 1923 Viennese catalogue, a postcard sold at Sotheby's in 1987, and finally, a letter in the possession of an elderly bookseller in Lisbon who did not know what he had.

She paused beneath the stone archway. The city hummed around her, oblivious to what she held.

The truth about the Vienna Circle — about what Wittgenstein had actually said to Russell in that final meeting — would rewrite every philosophy textbook published in the last century.

She tucked the envelope under her arm and walked into the crowd.

There were three men following her. She had noticed them an hour ago.`;

const Reader = ({ book, onClose }) => {
  const { purchasedBooks, unlockedChapters, unlockChapter, showToast } = useApp();
  const [chapter, setChapter] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState(17);
  const [lineHeight, setLineHeight] = useState(1.9);
  const [theme, setTheme] = useState("cream");
  const [progress, setProgress] = useState(12);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingChapter, setPendingChapter] = useState(null);
  const owned = purchasedBooks.includes(book.id);
  const chapKey = `${book.id}-${chapter}`;
  const chapterUnlocked = owned || unlockedChapters.includes(chapKey) || chapter <= 1;

  const themes = {
    cream: { bg: "#FAF7F2", text: "#1A1612" },
    sepia: { bg: "#F4ECD8", text: "#3B2F1E" },
    dark: { bg: "#1A1612", text: "#E8DFD0" },
    night: { bg: "#0D1117", text: "#CDD9E5" },
  };
  const t = themes[theme];

  const handleChapterSelect = (num) => {
    const key = `${book.id}-${num}`;
    if (owned || unlockedChapters.includes(key) || num <= 1) {
      setChapter(num); setSidebarOpen(false);
    } else {
      setPendingChapter(num);
      setShowPayment(true);
    }
  };

  useEffect(() => {
    const onScroll = (e) => {
      const el = e.target;
      if (el.tagName !== "DIV") return;
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
      setProgress(Math.max(12, pct));
    };
    document.addEventListener("scroll", onScroll, true);
    return () => document.removeEventListener("scroll", onScroll, true);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, background: t.bg, color: t.text, transition: "background 0.3s, color 0.3s" }}>
      {/* Toolbar */}
      <header className="reader-toolbar glass" style={{ background: `${t.bg}ee`, borderBottom: "1px solid rgba(128,128,128,0.15)" }}>
        <button className="btn btn-ghost" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle chapter list" style={{ color: t.text, padding: "8px 12px" }}>☰</button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600 }}>{book.title}</div>
          <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>Chapter {chapter} of {book.chapters}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["A-", "A+"].map((label, i) => (
            <button key={label} onClick={() => setFontSize(f => Math.max(13, Math.min(22, f + (i===0?-1:1)))} style={{ background: "transparent", border: "1px solid rgba(128,128,128,0.2)", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: t.text, fontSize: 13 }} aria-label={i===0?"Decrease font size":"Increase font size"}>{label}</button>
          ))}
          <div style={{ display: "flex", gap: 4 }}>
            {Object.entries(themes).map(([key, val]) => (
              <button key={key} onClick={() => setTheme(key)} style={{ width: 20, height: 20, borderRadius: "50%", background: val.bg, border: `2px solid ${key===theme?"var(--gold)":"rgba(128,128,128,0.3)"}`, cursor: "pointer" }} aria-label={`${key} theme`} title={key} />
            ))}
          </div>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close reader" style={{ color: t.text, fontSize: 18, padding: "4px 8px" }}>✕</button>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 60, left: 0, right: 0, height: 3, zIndex: 81 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--gold), var(--gold-light))", transition: "width 0.5s" }} />
      </div>

      {/* Chapter sidebar */}
      <nav className={`reader-sidebar ${sidebarOpen?"open":""}`} style={{ background: t.bg, color: t.text }} aria-label="Chapter navigation">
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 16 }}>Chapters</h3>
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map(num => {
          const key = `${book.id}-${num}`;
          const accessible = owned || unlockedChapters.includes(key) || num <= 1;
          return (
            <button key={num} onClick={() => handleChapterSelect(num)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: chapter===num?"rgba(201,168,76,0.15)":"transparent", cursor: "pointer", color: t.text, textAlign: "left", marginBottom: 2, fontSize: 13 }}
              aria-current={chapter===num?"page":undefined}
            >
              <span style={{ opacity: accessible?1:0.4 }}>{accessible ? "📄" : "🔒"}</span>
              <span style={{ opacity: accessible?1:0.5 }}>Chapter {num}{chapter===num?" ←":""}</span>
              {!accessible && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--gold)" }}>${CHAPTER_PRICE}</span>}
            </button>
          );
        })}
      </nav>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 59, background: "rgba(0,0,0,0.3)" }} aria-hidden="true" />}

      {/* Content */}
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "100px 24px 80px", minHeight: "100vh" }} role="main" aria-label={`Chapter ${chapter} content`}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginBottom: 32, fontStyle: "italic" }}>
          Chapter {chapter}
        </h2>
        {chapterUnlocked ? (
          <div style={{ fontSize, lineHeight, letterSpacing: "0.01em" }}>
            {SAMPLE_CONTENT.split("\n\n").map((para, i) => (
              <p key={i} style={{ marginBottom: "1.5em" }}>{para}</p>
            ))}
            <p style={{ marginBottom: "1.5em", opacity: 0.5, fontStyle: "italic" }}>[Chapter continues... This is a demonstration of the reading interface.]</p>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 8 }}>Chapter {chapter} is Locked</h3>
            <p style={{ color: "var(--ink-faint)", marginBottom: 24, fontSize: 14 }}>Unlock this chapter for just ${CHAPTER_PRICE}</p>
            <div style={{ background: "rgba(128,128,128,0.08)", borderRadius: 12, padding: 20, marginBottom: 24, fontSize: 14, lineHeight: 1.7, fontStyle: "italic", opacity: 0.7 }}>
              "The archive was silent except for the soft thud of her footsteps on the marble floor..."
              <div style={{ background: "linear-gradient(transparent, rgba(128,128,128,0.3))", height: 60, marginTop: -20, borderRadius: "0 0 8px 8px" }} />
            </div>
            <button className="btn btn-primary" onClick={() => setShowPayment(true)}>
              🔓 Unlock for ${CHAPTER_PRICE}
            </button>
            {!owned && (
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--ink-faint)" }}>
                Or <button onClick={() => {}} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: 13 }}>buy the full book</button> for ${book.price}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(128,128,128,0.15)" }}>
          <button className="btn btn-secondary" onClick={() => chapter > 1 && setChapter(c => c-1)} disabled={chapter <= 1} style={{ opacity: chapter <= 1 ? 0.4 : 1 }}>← Previous</button>
          <span style={{ fontSize: 13, color: "var(--ink-faint)", alignSelf: "center" }}>{chapter} / {book.chapters}</span>
          <button className="btn btn-secondary" onClick={() => chapter < book.chapters && handleChapterSelect(chapter+1)} disabled={chapter >= book.chapters} style={{ opacity: chapter >= book.chapters ? 0.4 : 1 }}>Next →</button>
        </div>
      </main>

      {showPayment && (
        <PaymentModal
          item={{ ...book, num: pendingChapter || chapter, title: `Chapter ${pendingChapter || chapter}` }}
          type="chapter"
          onClose={() => { setShowPayment(false); setPendingChapter(null); }}
          onSuccess={() => {
            const num = pendingChapter || chapter;
            unlockChapter(`${book.id}-${num}`);
            setChapter(num);
            showToast(`Chapter ${num} unlocked! 🎉`, "success");
            setPendingChapter(null);
          }}
        />
      )}
    </div>
  );
};

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
const Nav = ({ onAuthClick, activeSection, onSectionChange }) => {
  const { user, logout, darkMode, toggleDark, cartCount } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navItems = ["Home", "Browse", "Featured", "About"];

  return (
    <nav className={`glass ${scrolled ? "scrolled" : ""}`} aria-label="Main navigation">
      <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 24 }}>
        {/* Logo */}
        <button onClick={() => onSectionChange("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }} aria-label="Go to homepage">
          <span style={{ fontSize: 24 }}>📚</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "var(--gold)", whiteSpace: "nowrap" }}>Ofem's Library</span>
        </button>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 4, flex: 1 }} role="menubar">
          {navItems.map(item => (
            <button
              key={item}
              className="btn btn-ghost"
              style={{ fontSize: 14, color: activeSection===item.toLowerCase()?"var(--gold)":"var(--ink-muted)", padding: "8px 14px" }}
              onClick={() => onSectionChange(item.toLowerCase())}
              role="menuitem"
              aria-current={activeSection===item.toLowerCase()?"page":undefined}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: "0 0 200px" }}>
          <input
            className="input"
            placeholder="Search books..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: "8px 36px 8px 14px", fontSize: 13, height: 38 }}
            aria-label="Search books"
          />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-faint)", fontSize: 14 }} aria-hidden="true">🔍</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={toggleDark} className="btn btn-ghost" style={{ padding: "8px 10px", fontSize: 17 }} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar" style={{ background: "var(--gold-pale)", color: "var(--rust)" }}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <button className="btn btn-ghost" onClick={logout} style={{ fontSize: 13 }}>Sign Out</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onAuthClick} style={{ fontSize: 13, padding: "8px 20px" }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

// ─── HERO ────────────────────────────────────────────────────────────────────
const Hero = ({ onBrowse, onBookClick }) => {
  const featuredBook = BOOKS[0];
  const [currentBook, setCurrentBook] = useState(0);
  const featured = BOOKS.filter(b => b.featured);

  useEffect(() => {
    const t = setInterval(() => setCurrentBook(i => (i+1) % featured.length), 4000);
    return () => clearInterval(t);
  }, []);

  const book = featured[currentBook];

  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden="true">
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", width: 1, height: "40%", background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.2), transparent)" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(480px, 40%)", gap: "clamp(40px, 6vw, 80px)", alignItems: "center", maxWidth: 1200, margin: "0 auto", width: "100%", zIndex: 1 }}>
        {/* Text */}
        <div>
          <div className="badge badge-gold animate-fadeUp" style={{ marginBottom: 20 }}>✦ Premium Digital Library</div>
          <h1 id="hero-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 20, animationDelay: "0.1s" }} className="animate-fadeUp">
            Where Stories <br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>Come Alive</em>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "var(--ink-muted)", lineHeight: 1.8, maxWidth: 480, marginBottom: 32, animationDelay: "0.2s" }} className="animate-fadeUp">
            Discover, read, and collect the world's greatest books. 
            Purchase full access or explore chapter by chapter with our unique reading model.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", animationDelay: "0.3s" }} className="animate-fadeUp">
            <button className="btn btn-primary" onClick={onBrowse} style={{ fontSize: 15, padding: "14px 32px" }}>
              Explore Library →
            </button>
            <button className="btn btn-secondary" onClick={() => onBookClick(featuredBook)} style={{ fontSize: 15, padding: "14px 32px" }}>
              Today's Pick
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, marginTop: 48 }} className="animate-fadeUp" aria-label="Library statistics">
            {[["12K+", "Books"], ["180K+", "Readers"], ["4.9", "Avg Rating"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "var(--gold)" }}>{val}</div>
                <div style={{ fontSize: 12, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Book showcase */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }} className="animate-float">
          <div style={{ position: "relative", width: 260, height: 390 }}>
            {/* Shadow books */}
            <div style={{ position: "absolute", top: 20, left: -20, width: 220, height: 330, borderRadius: 12, transform: "rotate(-5deg)", overflow: "hidden", opacity: 0.5, filter: "blur(1px)" }}>
              <BookCoverArt book={featured[(currentBook+1)%featured.length]} />
            </div>
            {/* Main book */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-float)", cursor: "pointer", transition: "all 0.5s" }} onClick={() => onBookClick(book)}>
              <BookCoverArt book={book} />
            </div>
            {/* Badge */}
            <div style={{ position: "absolute", bottom: -16, right: -16, background: "var(--gold)", color: "var(--ink)", borderRadius: "50%", width: 72, height: 72, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-card)", animation: "pulse-gold 2s infinite" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>★{book.rating}</div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em" }}>Rated</div>
            </div>
          </div>
          {/* Book info */}
          <div style={{ position: "absolute", bottom: -60, left: 0, right: 0, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600 }}>{book.title}</div>
            <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>{book.author}</div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid var(--cream-dark)", padding: "12px 0", overflow: "hidden" }} aria-hidden="true">
        <div className="ticker">
          <div className="ticker-inner" style={{ gap: 40 }}>
            {[...BOOKS, ...BOOKS].map((b, i) => (
              <span key={i} style={{ fontSize: 13, color: "var(--ink-faint)", padding: "0 20px" }}>
                ✦ {b.title} by {b.author}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── BROWSE SECTION ───────────────────────────────────────────────────────────
const BrowseSection = ({ onBookClick }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const filtered = BOOKS
    .filter(b => (activeCategory === "All" || b.category === activeCategory))
    .filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <section className="section" id="browse" aria-labelledby="browse-heading">
      <h2 id="browse-heading" className="section-title">Browse the Collection</h2>
      <p className="section-subtitle">Discover your next favourite read</p>

      {/* Search & Sort */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          className="input"
          placeholder="Search by title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
          aria-label="Search books"
        />
        <select
          className="input"
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ maxWidth: 180 }}
          aria-label="Sort books"
        >
          <option value="featured">Featured</option>
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 32 }} role="group" aria-label="Filter by category">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`cat-pill ${activeCategory===cat?"active":""}`} onClick={() => setActiveCategory(cat)} aria-pressed={activeCategory===cat}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 20 }} aria-live="polite">
        Showing {filtered.length} {filtered.length === 1 ? "book" : "books"}
        {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        {search ? ` matching "${search}"` : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="book-grid">
          {filtered.map((book, i) => (
            <BookCard key={book.id} book={book} onClick={onBookClick} delay={i * 60} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--ink-faint)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 8 }}>No books found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </section>
  );
};

// ─── TRENDING SECTION ─────────────────────────────────────────────────────────
const TrendingSection = ({ onBookClick }) => {
  const trending = BOOKS.filter(b => b.trending);
  return (
    <section className="section" style={{ background: "var(--cream-dark)" }} aria-labelledby="trending-heading">
      <h2 id="trending-heading" className="section-title">🔥 Trending Now</h2>
      <p className="section-subtitle">What readers are talking about this week</p>
      <div className="carousel-track">
        {trending.map((book, i) => (
          <div key={book.id} className="carousel-item">
            <BookCard book={book} onClick={onBookClick} delay={i * 80} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const TestimonialsSection = () => (
  <section className="section" aria-labelledby="testimonials-heading">
    <h2 id="testimonials-heading" className="section-title">What Readers Say</h2>
    <p className="section-subtitle">Join over 180,000 satisfied readers</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
      {TESTIMONIALS.map((t, i) => (
        <article key={i} className="card animate-fadeUp" style={{ padding: 28, animationDelay: `${i * 100}ms` }}>
          <Stars rating={t.rating} size={14} />
          <p style={{ fontSize: 15, lineHeight: 1.7, margin: "16px 0 20px", color: "var(--ink-muted)", fontStyle: "italic" }}>"{t.text}"</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="avatar" style={{ background: t.avatar, color: "#fff" }}>{t.name[0]}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{t.role}</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDashboard = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const stats = [
    { label: "Total Books", value: "12,847", change: "+124 this month", icon: "📚" },
    { label: "Active Users", value: "182,340", change: "+2.1K this week", icon: "👥" },
    { label: "Revenue", value: "$48,291", change: "+18% vs last month", icon: "💰" },
    { label: "Chapter Unlocks", value: "8,420", change: "+340 today", icon: "🔓" },
  ];

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div style={{ position: "fixed", inset: 0, z: 101, background: "var(--cream)", overflow: "auto", animation: "fadeIn 0.3s ease", zIndex: 101 }} role="dialog" aria-modal="true" aria-label="Admin Dashboard">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32 }}>Admin Dashboard</h2>
              <p style={{ color: "var(--ink-faint)", fontSize: 14 }}>Ofem's Bestseller Library — Management Console</p>
            </div>
            <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: 20 }} aria-label="Close admin dashboard">✕</button>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 32, width: "fit-content" }}>
            {["overview", "books", "users", "analytics"].map(tab => (
              <button key={tab} className={`tab ${activeTab===tab?"active":""}`} onClick={() => setActiveTab(tab)} style={{ textTransform: "capitalize" }}>{tab}</button>
            ))}
          </div>

          {activeTab === "overview" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
                {stats.map((s, i) => (
                  <div key={i} className="card" style={{ padding: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "var(--gold)" }}>{s.value}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "var(--sage)" }}>{s.change}</div>
                  </div>
                ))}
              </div>

              {/* Recent books */}
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 16 }}>Recent Books</h3>
              <div style={{ background: "var(--cream-dark)", borderRadius: var_radius, overflow: "hidden" }}>
                {BOOKS.slice(0, 5).map((b, i) => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: i < 4 ? "1px solid var(--cream)" : "none" }}>
                    <div style={{ width: 40, height: 60, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                      <BookCoverArt book={b} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{b.author} · {b.category}</div>
                    </div>
                    <Stars rating={b.rating} size={12} />
                    <div style={{ fontWeight: 700, color: "var(--gold)", fontSize: 14, minWidth: 50, textAlign: "right" }}>${b.price}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 12px", border: "1px solid var(--cream)" }}>Edit</button>
                      <button className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 12px", border: "1px solid #E74C3C", color: "#E74C3C" }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "books" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22 }}>Manage Books</h3>
                <button className="btn btn-primary">+ Upload New Book</button>
              </div>
              <div style={{ background: "var(--cream-dark)", borderRadius: var_radius, padding: 24, textAlign: "center", color: "var(--ink-faint)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📤</div>
                <p>Drag and drop books here, or click to upload</p>
                <p style={{ fontSize: 12, marginTop: 8 }}>Supports PDF, EPUB formats</p>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 20 }}>User Management</h3>
              <p style={{ color: "var(--ink-faint)" }}>Manage user accounts, roles, and permissions. Connect Firebase to enable real user management.</p>
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 20 }}>Analytics Overview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {["Most Read Books", "Top Categories", "Revenue Trend", "User Growth"].map(title => (
                  <div key={title} className="card" style={{ padding: 24, height: 180, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h4>
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 4, padding: "12px 0 0" }}>
                      {[65, 82, 45, 90, 70, 55, 88].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: `linear-gradient(to top, var(--gold), var(--gold-light))`, height: `${h}%`, borderRadius: "4px 4px 0 0", opacity: 0.6 + i * 0.05 }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 8 }}>Last 7 days</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const Footer = ({ onAdminClick }) => (
  <footer style={{ background: "var(--ink)", color: "var(--cream)", padding: "60px clamp(16px, 4vw, 48px) 32px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>📚</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>Ofem's Library</span>
          </div>
          <p style={{ fontSize: 14, color: "rgba(250,247,242,0.6)", lineHeight: 1.8, marginBottom: 20, maxWidth: 280 }}>
            A premium digital library experience. Read, collect, and discover the world's greatest books.
          </p>
          {/* Newsletter */}
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" placeholder="your@email.com" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--cream)" }} aria-label="Newsletter email" />
            <button className="btn btn-primary" style={{ flexShrink: 0 }}>Subscribe</button>
          </div>
        </div>
        {[
          { title: "Library", links: ["Browse All", "Bestsellers", "New Arrivals", "Free Samples"] },
          { title: "Account", links: ["Sign In", "My Books", "Reading History", "Wishlist"] },
          { title: "Company", links: ["About Us", "Authors", "Blog", "Contact"] },
        ].map(({ title, links }) => (
          <nav key={title} aria-label={`${title} links`}>
            <h4 style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontSize: 16, marginBottom: 16, letterSpacing: "0.05em" }}>{title}</h4>
            <ul style={{ listStyle: "none" }}>
              {links.map(link => (
                <li key={link} style={{ marginBottom: 10 }}>
                  <button style={{ background: "none", border: "none", color: "rgba(250,247,242,0.6)", fontSize: 14, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "var(--gold)"}
                    onMouseLeave={e => e.target.style.color = "rgba(250,247,242,0.6)"}
                  >{link}</button>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="divider" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 13, color: "rgba(250,247,242,0.4)" }}>© 2026 Ofem's Bestseller Library. All rights reserved.</p>
        <button onClick={onAdminClick} style={{ background: "none", border: "none", color: "rgba(250,247,242,0.3)", fontSize: 12, cursor: "pointer" }} aria-label="Admin access">⚙ Admin</button>
      </div>
    </div>
  </footer>
);

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
const AboutSection = () => (
  <section className="section" id="about" aria-labelledby="about-heading">
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
      <h2 id="about-heading" className="section-title">About Ofem's Library</h2>
      <p style={{ fontSize: 17, color: "var(--ink-muted)", lineHeight: 1.9, marginBottom: 32 }}>
        Ofem's Bestseller Library is a premium digital reading platform that blends the intimacy of a local bookstore with the scale of a global library. We believe every reader deserves access to the world's best books — on their terms.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
        {[
          { icon: "🔓", title: "Chapter Tax Model", desc: "No need to buy the whole book upfront. Unlock chapter by chapter and only pay for what you read." },
          { icon: "♿", title: "Accessible First", desc: "Built to WCAG standards from the ground up. Every reader deserves a beautiful experience." },
          { icon: "🔒", title: "Secure & Private", desc: "Your reading data is yours. End-to-end encryption and zero data selling — ever." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="card" style={{ padding: 28, textAlign: "left" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 8 }}>{title}</h3>
            <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── PROFILE PANEL ────────────────────────────────────────────────────────────
const ProfilePanel = ({ onClose, onBookClick }) => {
  const { user, purchasedBooks, wishlist } = useApp();
  const [tab, setTab] = useState("library");
  const myBooks = BOOKS.filter(b => purchasedBooks.includes(b.id));
  const wishlisted = BOOKS.filter(b => wishlist.includes(b.id));

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "min(420px, 100vw)", background: "var(--cream)", z: 101, animation: "slideIn 0.3s var(--transition) reverse", zIndex: 101, boxShadow: "var(--shadow-float)", overflow: "auto" }} role="dialog" aria-modal="true" aria-label="Your profile">
        <div style={{ padding: "28px 24px", borderBottom: "1px solid var(--cream-dark)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar" style={{ background: "var(--gold-pale)", color: "var(--rust)", width: 48, height: 48, fontSize: 20 }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600 }}>{user?.name || "Reader"}</div>
                <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>{user?.email}</div>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: 20 }} aria-label="Close profile">✕</button>
          </div>
          {/* Reading streak */}
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            {[["🔥 12", "Day Streak"], ["📚 " + myBooks.length, "Books Owned"], ["❤️ " + wishlisted.length, "Wishlist"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center", flex: 1, background: "var(--cream-dark)", borderRadius: 10, padding: "10px 8px" }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div className="tabs" style={{ marginBottom: 20 }}>
            {[["library","My Books"],["wishlist","Wishlist"],["badges","Badges"]].map(([t,l]) => (
              <button key={t} className={`tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>
          {tab === "library" && (
            myBooks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {myBooks.map(b => (
                  <div key={b.id} style={{ display: "flex", gap: 12, background: "var(--cream-dark)", borderRadius: 12, padding: 12, cursor: "pointer" }} onClick={() => { onClose(); onBookClick(b); }}>
                    <div style={{ width: 40, height: 60, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}><BookCoverArt book={b} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600 }}>{b.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{b.author}</div>
                      <div style={{ marginTop: 8 }}>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: "35%" }} /></div>
                        <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 4 }}>35% complete</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--ink-faint)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
                <p>Your library is empty. Browse books to get started!</p>
              </div>
            )
          )}
          {tab === "wishlist" && (
            wishlisted.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {wishlisted.map(b => (
                  <div key={b.id} style={{ display: "flex", gap: 12, background: "var(--cream-dark)", borderRadius: 12, padding: 12 }}>
                    <div style={{ width: 40, height: 60, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}><BookCoverArt book={b} /></div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>{b.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{b.author}</div>
                      <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: 14, marginTop: 4 }}>${b.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--ink-faint)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>❤️</div>
                <p>No books in your wishlist yet.</p>
              </div>
            )
          )}
          {tab === "badges" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { icon: "🏆", title: "First Book", earned: true },
                { icon: "🔥", title: "7-Day Streak", earned: true },
                { icon: "📚", title: "5 Books Read", earned: false },
                { icon: "⭐", title: "Reviewer", earned: false },
                { icon: "🌙", title: "Night Owl", earned: true },
                { icon: "💎", title: "Collector", earned: false },
              ].map(({ icon, title, earned }) => (
                <div key={title} style={{ textAlign: "center", padding: "16px 8px", background: "var(--cream-dark)", borderRadius: 12, opacity: earned ? 1 : 0.4 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{title}</div>
                  {earned && <div style={{ fontSize: 10, color: "var(--sage)" }}>Earned!</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── APP PROVIDER ─────────────────────────────────────────────────────────────
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [unlockedChapters, setUnlockedChapters] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const login = useCallback(async (email, password) => {
    await new Promise(r => setTimeout(r, 800));
    if (!email || !password) throw new Error("Please fill in all fields");
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    setUser({ email, name, isAdmin: email.includes("admin") });
    showToast(`Welcome back, ${name}! 📚`, "success");
  }, [showToast]);

  const signup = useCallback(async (name, email, password) => {
    await new Promise(r => setTimeout(r, 1000));
    if (!name || !email || !password) throw new Error("Please fill in all fields");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    setUser({ email, name, isAdmin: false });
    showToast(`Welcome to Ofem's Library, ${name}! 🎉`, "success");
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    showToast("Signed out. See you soon! 👋", "info");
  }, [showToast]);

  const addToWishlist = useCallback((id) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  }, []);

  const unlockChapter = useCallback((key) => {
    setUnlockedChapters(c => [...c, key]);
  }, []);

  const purchaseBook = useCallback((id) => {
    setPurchasedBooks(b => [...b, id]);
  }, []);

  return (
    <AppContext.Provider value={{ user, darkMode, toggleDark: () => setDarkMode(d => !d), login, signup, logout, purchasedBooks, purchaseBook, unlockedChapters, unlockChapter, wishlist, addToWishlist, showToast, toasts }}>
      {children}
      {/* Toasts */}
      <div aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </AppContext.Provider>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const AppContent = () => {
  const { user } = useApp();
  const [activeSection, setActiveSection] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleBookClick = useCallback((book) => setSelectedBook(book), []);
  const handleRead = useCallback((book) => { setSelectedBook(null); setReadingBook(book); }, []);

  const handleNavSection = (section) => {
    setActiveSection(section);
    const el = document.getElementById(section === "home" ? "home" : section === "browse" ? "browse" : section === "featured" ? "trending" : "about");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  if (readingBook) return <Reader book={readingBook} onClose={() => setReadingBook(null)} />;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <Nav
        onAuthClick={() => setShowAuth(true)}
        activeSection={activeSection}
        onSectionChange={handleNavSection}
      />
      {user && (
        <button
          onClick={() => setShowProfile(true)}
          style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold), var(--gold-light))", border: "none", cursor: "pointer", zIndex: 40, boxShadow: "var(--shadow-float)", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-gold 3s infinite" }}
          aria-label="Open your profile"
        >
          👤
        </button>
      )}

      {/* Sections */}
      <main id="main-content" tabIndex={-1}>
        <Hero onBrowse={() => handleNavSection("browse")} onBookClick={handleBookClick} />
        <TrendingSection onBookClick={handleBookClick} />
        <BrowseSection onBookClick={handleBookClick} />
        <TestimonialsSection />
        <AboutSection />
      </main>

      <Footer onAdminClick={() => setShowAdmin(true)} />

      {/* Modals */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {selectedBook && <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} onRead={handleRead} />}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} onBookClick={handleRead} />}

      {/* Skip link */}
      <a href="#main-content" style={{ position: "absolute", left: -9999, top: 0, background: "var(--gold)", color: "var(--ink)", padding: "8px 16px", borderRadius: "0 0 8px 0", zIndex: 999 }} onFocus={e => e.target.style.left = "0"} onBlur={e => e.target.style.left = "-9999px"}>
        Skip to main content
      </a>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <GlobalStyles />
      <AppContent />
    </AppProvider>
  );
}
