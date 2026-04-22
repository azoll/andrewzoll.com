function SiteHero({ onBook, tweaks }) {
  const dark = !!tweaks.darkHero;
  const bg = dark ? '#0B1A36' : '#fff';
  const fg = dark ? '#fff' : '#0B1A36';
  const muted = dark ? 'rgba(255,255,255,0.72)' : '#5E6169';
  const eyebrow = dark ? '#5E9573' : '#2F5D3E';
  const ctaBg = tweaks.accentCta ? '#2F5D3E' : (dark ? '#fff' : '#0F2144');
  const ctaFg = tweaks.accentCta ? '#fff' : (dark ? '#0B1A36' : '#fff');
  const ghostFg = dark ? '#fff' : '#0B1A36';
  const ruleColor = dark ? 'rgba(255,255,255,0.15)' : '#E8E9EB';

  return (
    <section style={{...hs.root, background:bg, color:fg}}>
      {/* Oversized AZ motif */}
      <div style={{...hs.motif, color: dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,33,68,0.045)'}} aria-hidden="true">AZ</div>

      <div style={hs.inner}>
        <div style={{...hs.eyebrow, color:eyebrow}}>
          <span style={{...hs.eyebrowDot, background:eyebrow}}/>
          AI Efficiency Audits
        </div>

        <h1 style={{...hs.h1}} className="az-hero-h1">
          {renderHeadline(tweaks.heroHeadline, dark)}
        </h1>

        <p style={{...hs.lead, color:muted}} className="az-hero-lead">
          A 30-minute audit. A short list of fixes.
          Things you can use on Monday.
        </p>

        <div style={hs.ctas} className="az-hero-ctas">
          <button onClick={onBook} style={{...hs.primary, background:ctaBg, color:ctaFg}} className="az-btn-primary">
            Book the audit <span className="az-arrow" style={{marginLeft:8}}>→</span>
          </button>
          <a href="#audit" onClick={(e)=>{e.preventDefault();document.getElementById('audit')?.scrollIntoView({behavior:'smooth'});}} style={{...hs.ghost, color:ghostFg, borderBottomColor: dark ? 'rgba(255,255,255,0.3)' : '#D4D6DA'}}>
            See what you get
          </a>
        </div>

        <div style={{...hs.meta, color: dark ? 'rgba(255,255,255,0.5)' : '#888C94', borderTopColor: ruleColor}} className="az-hero-meta">
          <div style={hs.metaItem}><span style={{...hs.metaKey, color: dark ? 'rgba(255,255,255,0.4)' : '#B6B9BF'}}>01</span> 30-minute call</div>
          <div style={hs.metaItem}><span style={{...hs.metaKey, color: dark ? 'rgba(255,255,255,0.4)' : '#B6B9BF'}}>02</span> Written plan in 48 hrs</div>
          <div style={hs.metaItem}><span style={{...hs.metaKey, color: dark ? 'rgba(255,255,255,0.4)' : '#B6B9BF'}}>03</span> No strings attached</div>
        </div>
      </div>
    </section>
  );
}

function renderHeadline(text, dark) {
  // Highlight "5 to 10 hours", "5–10 hours", "5-10 hours" (number range + hours)
  const re = /(\d+\s*(?:to|–|-)\s*\d+\s+hours?)/i;
  const m = text.match(re);
  if (!m) return text;
  const [before, after] = text.split(m[0]);
  return (<>{before}<span style={{color:'#5E9573'}}>{m[0]}</span>{after}</>);
}

const hs = {
  root: { position:'relative', overflow:'hidden', padding:'160px 24px 120px', transition:'background 240ms, color 240ms' },
  inner: { maxWidth:1160, margin:'0 auto', position:'relative', zIndex:2 },
  motif: { position:'absolute', top:'50%', right:'-4vw', transform:'translateY(-48%)', fontSize:'min(62vw, 780px)', fontWeight:800, letterSpacing:'-0.08em', lineHeight:0.8, userSelect:'none', pointerEvents:'none', fontFamily:'Inter, sans-serif', zIndex:1, transition:'color 240ms' },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:32, display:'inline-flex', alignItems:'center', gap:10 },
  eyebrowDot: { width:6, height:6, borderRadius:'50%' },
  h1: { fontSize:'clamp(40px, 7vw, 88px)', fontWeight:700, lineHeight:1.02, letterSpacing:'-0.035em', margin:'0 0 32px', maxWidth:960, color:'inherit' },
  lead: { fontSize:'clamp(17px, 1.6vw, 21px)', lineHeight:1.55, maxWidth:520, margin:'0 0 44px', fontWeight:400 },
  ctas: { display:'flex', gap:18, alignItems:'center', flexWrap:'wrap', marginBottom:72 },
  primary: { fontFamily:'inherit', fontSize:15, fontWeight:600, padding:'15px 26px', border:'none', borderRadius:6, cursor:'pointer', letterSpacing:'-0.005em' },
  ghost: { fontFamily:'inherit', fontSize:15, fontWeight:500, padding:'15px 4px', textDecoration:'none', borderBottom:'1px solid' },
  meta: { display:'flex', gap:40, paddingTop:24, borderTop:'1px solid', fontSize:13, fontWeight:500, flexWrap:'wrap' },
  metaItem: { display:'flex', alignItems:'center', gap:10 },
  metaKey: { fontFamily:'ui-monospace, SF Mono, Menlo, monospace', fontSize:11 },
};

window.SiteHero = SiteHero;
