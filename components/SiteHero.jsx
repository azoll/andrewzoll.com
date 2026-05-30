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
          AI Efficiency Assessment
        </div>

        <h1 style={{...hs.h1}} className="az-hero-h1">
          {renderHeadline(tweaks.heroHeadline, dark)}
        </h1>

        <p style={{...hs.lead, color:fg}} className="az-hero-lead">
          You have the apps. You have the subscriptions. So why are the missed calls still piling up?
        </p>

        <p style={{...hs.body, color:muted}} className="az-hero-body">
          Most owners buy the tool before they map the work. That is the mistake. You end up with five logins and the same lost hours. Start with the task, not the tool. I sit with your actual week, find the 5 to 10 hours a week you are losing to repetitive work, and hand you the order to automate it. First fix, second fix, third. Named tools, estimated hours, ranked.
        </p>

        <p style={{...hs.body, color:muted}} className="az-hero-body">
          A $10,000-a-month automation agency sells you a retainer. This is a one-time $997 Assessment, which is less than one day of a full-time hire, and it tells you which tools actually matter so you never need the retainer.
        </p>

        <p style={{...hs.guarantee, color:muted}} className="az-hero-guarantee">
          A 45-minute call. A written plan in 45 hours. If it does not name at least 5 hours a week you can win back, you do not pay.
        </p>

        <div style={hs.ctas} className="az-hero-ctas">
          <button onClick={onBook} style={{...hs.primary, background:ctaBg, color:ctaFg}} className="az-btn-primary">
            Book the Assessment <span className="az-arrow" style={{marginLeft:8}}>→</span>
          </button>
          <a href="#audit" onClick={(e)=>{e.preventDefault();document.getElementById('audit')?.scrollIntoView({behavior:'smooth'});}} style={{...hs.ghost, color:ghostFg, borderBottomColor: dark ? 'rgba(255,255,255,0.3)' : '#D4D6DA'}}>
            See what you get
          </a>
        </div>

        <p style={{...hs.ctaSub, color: dark ? 'rgba(255,255,255,0.5)' : '#888C94'}} className="az-hero-ctasub">
          $997 flat. The plan is yours either way.
        </p>

        <div style={{...hs.meta, color: dark ? 'rgba(255,255,255,0.5)' : '#888C94', borderTopColor: ruleColor}} className="az-hero-meta">
          <div style={hs.metaItem}><span style={{...hs.metaKey, color: dark ? 'rgba(255,255,255,0.4)' : '#B6B9BF'}}>01</span> 45-min discovery call</div>
          <div style={hs.metaItem}><span style={{...hs.metaKey, color: dark ? 'rgba(255,255,255,0.4)' : '#B6B9BF'}}>02</span> Ranked plan in 45 hrs</div>
          <div style={hs.metaItem}><span style={{...hs.metaKey, color: dark ? 'rgba(255,255,255,0.4)' : '#B6B9BF'}}>03</span> 5+ hrs/wk or no charge</div>
        </div>
      </div>
    </section>
  );
}

function renderHeadline(text, dark) {
  // Color the first sentence in brand green. Falls back to highlighting an
  // hours-range pattern (e.g. "5 to 10 hours") if no sentence break is found.
  const sentenceIdx = text.search(/[.!?]\s/);
  if (sentenceIdx !== -1) {
    const first = text.slice(0, sentenceIdx + 1);
    const rest = text.slice(sentenceIdx + 1);
    return (<><span style={{color:'#5E9573'}}>{first}</span>{rest}</>);
  }
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
  lead: { fontSize:'clamp(19px, 1.9vw, 24px)', lineHeight:1.45, maxWidth:620, margin:'0 0 28px', fontWeight:600, letterSpacing:'-0.01em' },
  body: { fontSize:'clamp(15px, 1.4vw, 18px)', lineHeight:1.6, maxWidth:620, margin:'0 0 20px', fontWeight:400 },
  guarantee: { fontSize:'clamp(15px, 1.4vw, 18px)', lineHeight:1.55, maxWidth:620, margin:'0 0 40px', fontWeight:500 },
  ctaSub: { fontSize:13, fontWeight:500, margin:'18px 0 0', letterSpacing:'0.005em' },
  ctas: { display:'flex', gap:18, alignItems:'center', flexWrap:'wrap', marginBottom:0 },
  primary: { fontFamily:'inherit', fontSize:15, fontWeight:600, padding:'15px 26px', border:'none', borderRadius:6, cursor:'pointer', letterSpacing:'-0.005em' },
  ghost: { fontFamily:'inherit', fontSize:15, fontWeight:500, padding:'15px 4px', textDecoration:'none', borderBottom:'1px solid' },
  meta: { display:'flex', gap:40, marginTop:56, paddingTop:24, borderTop:'1px solid', fontSize:13, fontWeight:500, flexWrap:'wrap' },
  metaItem: { display:'flex', alignItems:'center', gap:10 },
  metaKey: { fontFamily:'ui-monospace, SF Mono, Menlo, monospace', fontSize:11 },
};

window.SiteHero = SiteHero;
