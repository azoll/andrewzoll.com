function TheAudit({ onBook }) {
  const included = [
    'A 30-minute working session on Zoom',
    'A written plan delivered within 48 hours',
    'Three to five specific, ordered fixes',
    'Tool names, no jargon, no black boxes',
    'Estimated time saved and business impact for each fix',
    'You own the plan whether we work together after or not',
  ];
  return (
    <section id="audit" style={ta.root}>
      <div style={ta.inner}>
        <div style={ta.head} className="az-reveal">
          <div style={ta.eyebrow}>The audit</div>
          <h2 style={ta.h2} className="az-h2">One session.<br/>A leak-finding plan you can use.</h2>
          <p style={ta.lead}>
            I look at how you actually work: email, scheduling, quotes, reporting, follow-ups, and the admin that keeps pulling you away from higher-value work. Then I show you where simple automation can remove the repetitive parts and where your business is quietly leaking time and money.
          </p>
        </div>

        <div style={ta.grid} className="az-audit-grid">
          <div style={ta.left} className="az-reveal">
            <ul style={ta.list}>
              {included.map((it,i) => (
                <li key={i} style={ta.li}>
                  <span style={ta.check}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span style={ta.liText}>{it}</span>
                </li>
              ))}
            </ul>
            <button onClick={onBook} style={ta.cta} className="az-btn-primary">Book the audit <span className="az-arrow" style={{marginLeft:8}}>→</span></button>
          </div>

          <div style={ta.right} className="az-reveal" data-reveal-delay="120">
            <div style={ta.priceCard} className="az-card-hover az-price-card">
              <div style={ta.priceEyebrow}>The audit</div>
              <div style={ta.priceRow}>
                <span style={ta.priceDollar}>$</span>
                <span style={ta.price}>1,000</span>
              </div>
              <div style={ta.priceNote}>Flat fee. 30 minutes on a call, a written plan in your inbox within 48 hours, and a ranked list of the leaks worth fixing first.</div>
              <div style={ta.priceRule}/>
              <div style={ta.priceFine}>If you want help putting the plan in place after that, implementation is separate and priced based on scope.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ta = {
  root: { background:'#fff', padding:'120px 24px' },
  inner: { maxWidth:1200, margin:'0 auto' },
  head: { maxWidth:780, marginBottom:72 },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:20 },
  h2: { fontSize:'clamp(36px, 5vw, 60px)', fontWeight:700, lineHeight:1.04, letterSpacing:'-0.03em', color:'#0B1A36', margin:'0 0 24px' },
  lead: { fontSize:19, lineHeight:1.6, color:'#5E6169', margin:0, maxWidth:640 },
  grid: { display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:64, alignItems:'start' },
  left: {},
  list: { listStyle:'none', padding:0, margin:'0 0 40px', display:'flex', flexDirection:'column', gap:16 },
  li: { display:'flex', alignItems:'flex-start', gap:14, fontSize:17, color:'#0B1A36', lineHeight:1.45 },
  liText: { paddingTop:2 },
  check: { width:26, height:26, borderRadius:'50%', background:'#DDE8E0', color:'#2F5D3E', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  cta: { fontFamily:'inherit', fontSize:15, fontWeight:600, padding:'14px 24px', background:'#2F5D3E', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' },
  right: {},
  priceCard: { background:'#0B1A36', borderRadius:12, padding:'40px 36px', color:'#fff' },
  priceEyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#5E9573', marginBottom:24 },
  priceRow: { display:'flex', alignItems:'baseline', gap:6, marginBottom:16 },
  price: { fontSize:72, fontWeight:800, letterSpacing:'-0.03em', lineHeight:1, color:'#fff' },
  priceDollar: { fontSize:40, fontWeight:600, color:'rgba(255,255,255,0.55)', letterSpacing:'-0.02em' },
  priceNote: { fontSize:15, color:'rgba(255,255,255,0.75)', lineHeight:1.55, marginBottom:28 },
  priceRule: { height:1, background:'rgba(255,255,255,0.12)', marginBottom:20 },
  priceFine: { fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.55 },
};

window.TheAudit = TheAudit;
