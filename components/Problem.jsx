function Problem() {
  const items = [
    { n:'6.3', u:'hrs/wk', lbl:'Email, inbox triage, rewriting the same reply' },
    { n:'4.1', u:'hrs/wk', lbl:'Scheduling, follow-ups, rescheduling' },
    { n:'3.8', u:'hrs/wk', lbl:'Quotes, invoices, and one-off documents' },
    { n:'2.5', u:'hrs/wk', lbl:'Reporting, weekly summaries, status updates' },
  ];
  return (
    <section style={pr.root}>
      <div style={pr.inner}>
        <div style={pr.head}>
          <div style={pr.eyebrow}>The problem</div>
          <h2 style={pr.h2} className="az-h2">
            The week disappears<br className="az-hide-mobile"/> into the same four places.
          </h2>
          <p style={pr.lead}>
            Averages from small-business owners I've audited. Your numbers will differ. The shape is almost always the same.
          </p>
        </div>

        <div style={pr.grid} className="az-problem-grid">
          {items.map((it,i) => (
            <div key={i} style={pr.card}>
              <div style={pr.num}>
                {it.n}
                <span style={pr.unit}>{it.u}</span>
              </div>
              <div style={pr.lbl}>{it.lbl}</div>
            </div>
          ))}
        </div>

        <div style={pr.footer}>
          <div style={pr.footerRule}/>
          <div style={pr.footerText}>
            <span style={pr.footerBig}>≈ 16 hours</span>
            <span style={pr.footerSmall}>of weekly repetition, most of it automatable.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const pr = {
  root: { background:'#FAFAFA', padding:'112px 24px', borderTop:'1px solid #E8E9EB', borderBottom:'1px solid #E8E9EB' },
  inner: { maxWidth:1200, margin:'0 auto' },
  head: { maxWidth:760, marginBottom:64 },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:20 },
  h2: { fontSize:'clamp(32px, 4.4vw, 52px)', fontWeight:700, lineHeight:1.08, letterSpacing:'-0.025em', color:'#0B1A36', margin:'0 0 20px' },
  lead: { fontSize:17, lineHeight:1.6, color:'#5E6169', margin:0, maxWidth:600 },
  grid: { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0, background:'#fff', border:'1px solid #E8E9EB', borderRadius:10, overflow:'hidden' },
  card: { padding:'36px 32px', borderRight:'1px solid #E8E9EB', borderBottom:'1px solid #E8E9EB' },
  num: { fontSize:'clamp(44px, 5vw, 64px)', fontWeight:700, lineHeight:1, letterSpacing:'-0.03em', color:'#0F2144', marginBottom:16, display:'flex', alignItems:'baseline', gap:6 },
  unit: { fontSize:13, fontWeight:500, color:'#888C94', letterSpacing:'0', fontFamily:'ui-monospace, SF Mono, Menlo, monospace' },
  lbl: { fontSize:14, lineHeight:1.5, color:'#5E6169' },
  footer: { marginTop:40, display:'flex', alignItems:'center', gap:24 },
  footerRule: { flex:1, height:1, background:'#D4D6DA' },
  footerText: { display:'flex', alignItems:'baseline', gap:14 },
  footerBig: { fontSize:22, fontWeight:700, color:'#2F5D3E', letterSpacing:'-0.01em' },
  footerSmall: { fontSize:15, color:'#5E6169' },
};

window.Problem = Problem;
