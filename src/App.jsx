import { useState } from "react";

/* ─────────────────────────── Global Styles ─────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }

  .cs-analyze:hover:not(:disabled) {
    background: #00d4ff !important;
    color: #07091a !important;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0,212,255,.28) !important;
  }
  .cs-analyze:active:not(:disabled) { transform: translateY(0) !important; }
  .cs-analyze:disabled { opacity: .4; cursor: not-allowed; }

  .cs-issue:hover   { border-color: rgba(0,212,255,.28) !important; background: rgba(255,255,255,.025) !important; }
  .cs-chip:hover    { border-color: rgba(0,212,255,.4) !important; color: #a0b8d0 !important; }
  .cs-mode:hover    { color: #b8cce0 !important; }
  .cs-tab:hover     { color: #a0b8d0 !important; }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: rgba(0,212,255,.5) !important;
    box-shadow: 0 0 0 3px rgba(0,212,255,.07) !important;
  }
  select option { background: #0d1525; }

  ::-webkit-scrollbar       { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #07091a; }
  ::-webkit-scrollbar-thumb { background: #1a2645; border-radius: 4px; }
`;

/* ─────────────────────────── Config Maps ─────────────────────────── */
const SEV = {
  critical: { c:"#ff4757", bg:"rgba(255,71,87,.1)",  br:"rgba(255,71,87,.3)"  },
  high:     { c:"#ff8c42", bg:"rgba(255,140,66,.1)", br:"rgba(255,140,66,.28)"},
  medium:   { c:"#ffcc4d", bg:"rgba(255,204,77,.08)",br:"rgba(255,204,77,.25)"},
  low:      { c:"#4ecdc4", bg:"rgba(78,205,196,.08)",br:"rgba(78,205,196,.22)"},
  info:     { c:"#5d7a9a", bg:"rgba(93,122,154,.07)",br:"rgba(93,122,154,.18)"},
};
const CAT = {
  bug:             { icon:"🐛", label:"Bug"           },
  security:        { icon:"🔐", label:"Security"      },
  performance:     { icon:"⚡", label:"Performance"   },
  style:           { icon:"🎨", label:"Style"         },
  "best-practice": { icon:"✨", label:"Best Practice" },
};
const LANGS = ["javascript","typescript","python","java","c++","go","rust","php","ruby","swift","kotlin","c#"];

/* ─────────────────────────── Helpers ─────────────────────────── */
const dm   = { fontFamily:"'DM Sans',sans-serif" };
const mono = { fontFamily:"'JetBrains Mono',monospace" };
const syne = { fontFamily:"'Syne',sans-serif" };

/* ─────────────────────────── Sub-components ─────────────────────────── */

function ScoreRing({ score }) {
  const r=36, sw=7, circ=2*Math.PI*r, filled=(score/100)*circ;
  const col = score>=80?"#00e09a":score>=60?"#ffcc4d":"#ff4757";
  return (
    <div style={{ position:"relative",width:92,height:92,flexShrink:0 }}>
      <svg width="92" height="92" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={sw}/>
        <circle cx="46" cy="46" r={r} fill="none" stroke={col} strokeWidth={sw}
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1.3s cubic-bezier(.4,0,.2,1)" }}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1 }}>
        <span style={{ ...mono,fontSize:22,fontWeight:500,color:col,lineHeight:1 }}>{score}</span>
        <span style={{ ...dm,fontSize:9,color:"#2d4060",letterSpacing:1.8,textTransform:"uppercase",marginTop:1 }}>score</span>
      </div>
    </div>
  );
}

function StatCard({ icon, val, label, color }) {
  return (
    <div style={{ background:"#0a0e1e",border:"1px solid #192038",borderRadius:10,padding:"12px 14px",flex:1,minWidth:70 }}>
      <div style={{ fontSize:15,marginBottom:5 }}>{icon}</div>
      <div style={{ ...mono,fontSize:24,fontWeight:500,color:val>0?color:"#1e2d48",lineHeight:1 }}>{val}</div>
      <div style={{ ...dm,fontSize:10,color:"#2d4060",marginTop:3,textTransform:"uppercase",letterSpacing:1.2 }}>{label}</div>
    </div>
  );
}

function Badge({ severity }) {
  const s = SEV[severity] || SEV.info;
  return (
    <span style={{ background:s.bg,color:s.c,border:`1px solid ${s.br}`,borderRadius:5,padding:"2px 8px",...mono,fontSize:9,fontWeight:500,letterSpacing:1.3,flexShrink:0,whiteSpace:"nowrap" }}>
      {severity?.toUpperCase()}
    </span>
  );
}

function IssueCard({ issue, expanded, onToggle }) {
  const s = SEV[issue.severity] || SEV.info;
  const c = CAT[issue.category]  || { icon:"📋", label:issue.category };
  return (
    <div className="cs-issue" onClick={onToggle}
      style={{ background:"#0d1525",border:`1px solid ${expanded?s.br:"#192038"}`,borderRadius:10,padding:"13px 16px",marginBottom:8,cursor:"pointer",transition:"border-color .18s, background .18s",animation:"slideUp .3s ease" }}>
      
      {/* Row */}
      <div style={{ display:"flex",alignItems:"center",gap:9,minWidth:0,flexWrap:"nowrap" }}>
        <Badge severity={issue.severity}/>
        <span style={{ fontSize:13,flexShrink:0 }}>{c.icon}</span>
        <span style={{ ...dm,fontWeight:600,fontSize:13,color:"#c8daf0",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{issue.title}</span>
        {issue.line && <span style={{ ...mono,fontSize:10,color:"#2d4060",flexShrink:0 }}>:{issue.line}</span>}
        <span style={{ color:"#1e2d48",fontSize:11,marginLeft:4,flexShrink:0 }}>{expanded?"▲":"▼"}</span>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ marginTop:14,paddingTop:14,borderTop:"1px solid #192038",animation:"fadeIn .2s ease" }}>
          <p style={{ ...dm,fontSize:13,color:"#7090b0",lineHeight:1.68,marginBottom:12 }}>{issue.description}</p>
          {issue.codeSnippet && (
            <pre style={{ background:"#07091a",border:"1px solid #192038",borderRadius:7,padding:"10px 14px",...mono,fontSize:11,color:"#6a88a0",marginBottom:12,overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.55 }}>
              {issue.codeSnippet}
            </pre>
          )}
          <div style={{ background:s.bg,border:`1px solid ${s.br}`,borderRadius:7,padding:"10px 14px" }}>
            <span style={{ ...dm,fontSize:11,fontWeight:700,color:s.c,textTransform:"uppercase",letterSpacing:1 }}>Fix → </span>
            <span style={{ ...dm,fontSize:12,color:"#7090b0" }}>{issue.suggestion}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign:"center",padding:"52px 24px",animation:"slideUp .4s ease" }}>
      <div style={{ fontSize:46,marginBottom:18 }}>🔬</div>
      <h2 style={{ ...syne,fontWeight:700,fontSize:19,color:"#1e2d48",marginBottom:9 }}>Ready to Review</h2>
      <p style={{ ...dm,fontSize:13,color:"#1e2d48",maxWidth:400,margin:"0 auto",lineHeight:1.65 }}>
        Paste a public GitHub PR URL or drop in your code — the AI will instantly scan for bugs, security holes, performance bottlenecks, and style issues.
      </p>
      <div style={{ display:"flex",justifyContent:"center",gap:10,marginTop:24,flexWrap:"wrap" }}>
        {[["🐛","Bug Detection"],["🔐","Security Scan"],["⚡","Perf Analysis"],["🎨","Style Review"]].map(([ico,lbl]) => (
          <div key={lbl} style={{ background:"#0d1525",border:"1px solid #192038",borderRadius:9,padding:"9px 15px",display:"flex",alignItems:"center",gap:7 }}>
            <span style={{ fontSize:14 }}>{ico}</span>
            <span style={{ ...dm,fontSize:12,color:"#2d4060" }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main App ─────────────────────────── */
export default function CodeSenseAI() {
  const [mode,     setMode]    = useState("pr");
  const [prUrl,    setPrUrl]   = useState("");
  const [code,     setCode]    = useState("");
  const [lang,     setLang]    = useState("javascript");
  const [loading,  setLoading] = useState(false);
  const [step,     setStep]    = useState("");
  const [result,   setResult]  = useState(null);
  const [prInfo,   setPrInfo]  = useState(null);
  const [error,    setError]   = useState("");
  const [filter,   setFilter]  = useState("all");
  const [expanded, setExpanded]= useState(null);

  /* ── Helpers ── */
  const parseGhUrl = (url) => {
    const m = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    return m ? { owner:m[1], repo:m[2], pr:m[3] } : null;
  };

  const callAI = async (content, filename) => {
    const res = await fetch("/api/review", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are an expert senior software engineer doing a thorough code review. Return ONLY valid JSON with NO markdown, backticks, or extra text. Use this exact schema:
{"summary":"one sentence assessment","score":75,"stats":{"bugs":0,"security":0,"performance":0,"style":0},"issues":[{"id":1,"severity":"critical|high|medium|low|info","category":"bug|security|performance|style|best-practice","title":"concise title","description":"detailed explanation","line":"line number or null","suggestion":"specific actionable fix","codeSnippet":"relevant 1-3 line snippet or null"}],"positives":["thing done well"]}
List top 5 most impactful issues, sorted critical→info. Update stats counts to match. Be specific and actionable.`,
        messages:[{ role:"user", content:`Review this ${filename} code:\n\n${content.slice(0,2600)}` }]
      })
    });
    const d = await res.json();
    if (d.error) throw new Error(d.error.message || "Anthropic API error");
    const txt = d.content?.map(i => i.text||"").join("") || "";
    return JSON.parse(txt.replace(/```json|```/g,"").trim());
  };

  /* ── Main analyze function ── */
  const analyze = async () => {
    setError(""); setResult(null); setPrInfo(null);
    setLoading(true); setExpanded(null); setFilter("all");
    try {
      if (mode === "pr") {
        const p = parseGhUrl(prUrl.trim());
        if (!p) throw new Error("Invalid URL. Expected: https://github.com/owner/repo/pull/42");

        setStep("Connecting to GitHub API...");
        const [iRes, fRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${p.owner}/${p.repo}/pulls/${p.pr}`),
          fetch(`https://api.github.com/repos/${p.owner}/${p.repo}/pulls/${p.pr}/files`)
        ]);
        if (!iRes.ok) throw new Error(`GitHub returned ${iRes.status}. Ensure the repository is public.`);
        const [info, files] = await Promise.all([iRes.json(), fRes.json()]);
        setPrInfo(info);

        const codeFiles = (Array.isArray(files)?files:[]).filter(f =>
          f.patch && !f.filename.match(/\.(md|txt|json|yaml|yml|lock|png|jpg|gif|svg|ico|woff2?|css|less|scss)$/)
        );
        if (!codeFiles.length) throw new Error("No reviewable source files found (only config/asset files detected).");

        setStep(`Analyzing ${codeFiles[0].filename} with AI...`);
        const r = await callAI(codeFiles[0].patch, codeFiles[0].filename);
        r.filename   = codeFiles[0].filename;
        r.totalFiles = files.length;
        setResult(r);

      } else {
        if (!code.trim()) throw new Error("Please paste some code to analyze.");
        setStep("Running AI code review...");
        const r = await callAI(code, `snippet.${lang}`);
        setResult(r);
      }
    } catch(e) {
      setError(e.message || "Unexpected error. Please try again.");
    } finally { setLoading(false); setStep(""); }
  };

  const categories   = result ? ["all",...new Set(result.issues?.map(i=>i.category)||[])] : [];
  const filteredList = result?.issues?.filter(i => filter==="all"||i.category===filter) || [];

  /* ── Render ── */
  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight:"100vh",background:"#07091a",color:"#c8daf0",...dm }}>

        {/* ━━━ HEADER ━━━ */}
        <header style={{ borderBottom:"1px solid #192038",padding:"15px 22px",background:"#09101f",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:20,backdropFilter:"blur(8px)" }}>
          <div style={{ width:38,height:38,background:"linear-gradient(135deg,#0062d4,#00d4ff)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,boxShadow:"0 0 18px rgba(0,180,255,.2)" }}>
            🔍
          </div>
          <div>
            <h1 style={{ ...syne,fontWeight:800,fontSize:17,color:"#ddeeff",letterSpacing:-.4,lineHeight:1.1 }}>CodeSense <span style={{ color:"#00d4ff" }}>AI</span></h1>
            <p style={{ ...mono,fontSize:10,color:"#2d4060",marginTop:1 }}>AI-Powered Code Review Assistant</p>
          </div>
          <div style={{ marginLeft:"auto",display:"flex",gap:8,alignItems:"center" }}>
            <div style={{ background:"#0d1525",border:"1px solid #192038",borderRadius:7,padding:"5px 12px",...mono,fontSize:10,color:"#2d4060",display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#00d4ff",display:"inline-block",boxShadow:"0 0 6px #00d4ff" }}/>
              Claude Sonnet 4
            </div>
          </div>
        </header>

        <main style={{ maxWidth:840,margin:"0 auto",padding:"26px 18px 70px" }}>

          {/* ━━━ INPUT CARD ━━━ */}
          <section style={{ background:"#0d1525",border:"1px solid #192038",borderRadius:16,padding:24,marginBottom:22 }}>

            {/* Mode toggle */}
            <div style={{ display:"flex",gap:3,background:"#07091a",borderRadius:10,padding:4,marginBottom:22,width:"fit-content" }}>
              {[{id:"pr",icon:"⎇",label:"GitHub PR URL"},{id:"paste",icon:"⌘",label:"Paste Code"}].map(m => (
                <button key={m.id} className="cs-mode" onClick={() => setMode(m.id)}
                  style={{ background:mode===m.id?"#192038":"transparent",color:mode===m.id?"#c8daf0":"#2d4060",border:"none",borderRadius:8,padding:"8px 16px",...dm,fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"color .15s" }}>
                  <span style={{ fontSize:14 }}>{m.icon}</span>{m.label}
                </button>
              ))}
            </div>

            {mode === "pr" ? (
              <div>
                <label style={{ display:"block",...mono,fontSize:10,color:"#2d4060",letterSpacing:1.4,textTransform:"uppercase",marginBottom:9 }}>Pull Request URL</label>
                <input value={prUrl} onChange={e=>setPrUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&analyze()}
                  placeholder="https://github.com/facebook/react/pull/1234"
                  style={{ width:"100%",background:"#07091a",border:"1px solid #192038",borderRadius:10,padding:"12px 15px",color:"#c8daf0",...mono,fontSize:12.5,transition:"border-color .15s,box-shadow .15s" }}/>
                <p style={{ ...dm,fontSize:11,color:"#192038",marginTop:7 }}>ℹ️  Works with public GitHub repositories — no authentication needed</p>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9 }}>
                  <label style={{ ...mono,fontSize:10,color:"#2d4060",letterSpacing:1.4,textTransform:"uppercase" }}>Source Code</label>
                  <select value={lang} onChange={e=>setLang(e.target.value)}
                    style={{ background:"#07091a",border:"1px solid #192038",borderRadius:7,padding:"5px 10px",color:"#6a88a0",...mono,fontSize:11,cursor:"pointer",transition:"border-color .15s" }}>
                    {LANGS.map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
                <textarea value={code} onChange={e=>setCode(e.target.value)} rows={11}
                  placeholder={`// Paste your ${lang} code here\n// CodeSense AI will scan for:\n//   🐛 Bugs & logic errors\n//   🔐 Security vulnerabilities  \n//   ⚡ Performance bottlenecks\n//   🎨 Style & best practices`}
                  style={{ width:"100%",background:"#07091a",border:"1px solid #192038",borderRadius:10,padding:"14px 15px",color:"#c8daf0",...mono,fontSize:11.5,resize:"vertical",lineHeight:1.68,transition:"border-color .15s,box-shadow .15s" }}/>
              </div>
            )}

            {/* Action row */}
            <div style={{ marginTop:18,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
              <button className="cs-analyze" onClick={analyze} disabled={loading}
                style={{ background:"transparent",color:"#00d4ff",border:"1.5px solid #00d4ff",borderRadius:10,padding:"11px 28px",...dm,fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:10,letterSpacing:.2,transition:"all .2s" }}>
                {loading
                  ? <><span style={{ width:14,height:14,border:"2px solid rgba(0,212,255,.25)",borderTopColor:"#00d4ff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite" }}/>Analyzing...</>
                  : <><span style={{ fontSize:15 }}>⚡</span>Analyze Code</>
                }
              </button>
              {loading && step && (
                <span style={{ ...mono,fontSize:11,color:"#2d4060",animation:"pulse 1.5s ease-in-out infinite" }}>{step}</span>
              )}
            </div>
          </section>

          {/* ━━━ ERROR BANNER ━━━ */}
          {error && (
            <div style={{ background:"rgba(255,71,87,.07)",border:"1px solid rgba(255,71,87,.22)",borderRadius:11,padding:"14px 18px",marginBottom:22,display:"flex",gap:12,alignItems:"flex-start",animation:"slideUp .3s ease" }}>
              <span style={{ fontSize:16,flexShrink:0,marginTop:1 }}>⚠️</span>
              <div>
                <div style={{ ...dm,fontWeight:600,fontSize:13,color:"#ff4757",marginBottom:3 }}>Analysis Failed</div>
                <div style={{ ...mono,fontSize:11.5,color:"#7090b0" }}>{error}</div>
              </div>
              <button onClick={()=>setError("")} style={{ marginLeft:"auto",background:"none",border:"none",color:"#2d4060",cursor:"pointer",fontSize:16,flexShrink:0 }}>✕</button>
            </div>
          )}

          {/* ━━━ PR INFO CARD ━━━ */}
          {prInfo && (
            <div style={{ background:"#0d1525",border:"1px solid #192038",borderRadius:12,padding:"15px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:13,flexWrap:"wrap",animation:"slideUp .35s ease" }}>
              <img src={prInfo.user?.avatar_url} alt="" width={40} height={40}
                style={{ borderRadius:"50%",border:"2px solid #192038",flexShrink:0 }}/>
              <div style={{ flex:1,minWidth:180 }}>
                <div style={{ ...dm,fontWeight:600,fontSize:13,color:"#c8daf0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{prInfo.title}</div>
                <div style={{ ...mono,fontSize:10.5,color:"#2d4060",marginTop:3 }}>
                  #{prInfo.number} · @{prInfo.user?.login} · {prInfo.changed_files} file{prInfo.changed_files!==1?"s":""} changed
                  <span style={{ color:"#1a5c30",marginLeft:8 }}>+{prInfo.additions}</span>
                  <span style={{ color:"#6b1a1a",marginLeft:6 }}>−{prInfo.deletions}</span>
                </div>
              </div>
              <a href={prInfo.html_url} target="_blank" rel="noopener noreferrer"
                style={{ background:"#131e38",border:"1px solid #192038",borderRadius:8,padding:"6px 14px",...mono,fontSize:10.5,color:"#6a88a0",textDecoration:"none",flexShrink:0,transition:"color .15s" }}>
                Open on GitHub ↗
              </a>
            </div>
          )}

          {/* ━━━ RESULTS ━━━ */}
          {result && (
            <div style={{ animation:"slideUp .4s ease" }}>

              {/* Score + Stats */}
              <div style={{ background:"#0d1525",border:"1px solid #192038",borderRadius:16,padding:"22px 24px",marginBottom:18 }}>
                <div style={{ display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap",marginBottom:20 }}>
                  <ScoreRing score={result.score??0}/>
                  <div style={{ flex:1,minWidth:200 }}>
                    {result.filename && (
                      <div style={{ ...mono,fontSize:10,color:"#2d4060",textTransform:"uppercase",letterSpacing:1.4,marginBottom:8 }}>
                        📄 {result.filename}
                      </div>
                    )}
                    <p style={{ ...dm,fontSize:13.5,color:"#7090b0",lineHeight:1.68 }}>{result.summary}</p>
                  </div>
                </div>
                <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                  <StatCard icon="🐛" val={result.stats?.bugs??0}        label="Bugs"     color="#ff4757"/>
                  <StatCard icon="🔐" val={result.stats?.security??0}    label="Security" color="#ff8c42"/>
                  <StatCard icon="⚡" val={result.stats?.performance??0} label="Perf"     color="#ffcc4d"/>
                  <StatCard icon="🎨" val={result.stats?.style??0}       label="Style"    color="#a78bfa"/>
                </div>
              </div>

              {/* Issues Panel */}
              {(result.issues?.length??0) > 0 && (
                <div style={{ background:"#0d1525",border:"1px solid #192038",borderRadius:16,padding:"20px 22px",marginBottom:18 }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10 }}>
                    <h2 style={{ ...syne,fontWeight:700,fontSize:15,color:"#c8daf0" }}>
                      Issues Found
                      <span style={{ ...mono,color:"#2d4060",fontWeight:400,fontSize:12,marginLeft:8 }}>({result.issues.length})</span>
                    </h2>
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                      {categories.map(c => (
                        <button key={c} className="cs-chip" onClick={()=>setFilter(c)}
                          style={{ background:filter===c?"#192038":"transparent",color:filter===c?"#00d4ff":"#2d4060",border:`1px solid ${filter===c?"rgba(0,212,255,.3)":"#192038"}`,borderRadius:20,padding:"4px 13px",...dm,fontSize:11,cursor:"pointer",transition:"all .15s",textTransform:"capitalize" }}>
                          {c==="best-practice"?"Best Practice":c}
                        </button>
                      ))}
                    </div>
                  </div>
                  {filteredList.length > 0
                    ? filteredList.map(issue => (
                        <IssueCard key={issue.id} issue={issue}
                          expanded={expanded===issue.id}
                          onToggle={()=>setExpanded(expanded===issue.id?null:issue.id)}/>
                      ))
                    : <p style={{ ...dm,fontSize:13,color:"#192038",textAlign:"center",padding:"22px 0" }}>No issues in this category.</p>
                  }
                </div>
              )}

              {/* Positives */}
              {(result.positives?.length??0) > 0 && (
                <div style={{ background:"#0d1525",border:"1px solid #192038",borderRadius:16,padding:"20px 22px" }}>
                  <h2 style={{ ...syne,fontWeight:700,fontSize:15,color:"#c8daf0",marginBottom:16,display:"flex",alignItems:"center",gap:9 }}>
                    <span>✅</span> What's Looking Good
                  </h2>
                  <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                    {result.positives.map((p,i) => (
                      <div key={i} style={{ display:"flex",gap:11,alignItems:"flex-start" }}>
                        <span style={{ color:"#00e09a",flexShrink:0,marginTop:2,fontSize:12 }}>◆</span>
                        <span style={{ ...dm,fontSize:13,color:"#7090b0",lineHeight:1.65 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ━━━ EMPTY STATE ━━━ */}
          {!result && !loading && !error && <EmptyState/>}

        </main>
      </div>
    </>
  );
}
