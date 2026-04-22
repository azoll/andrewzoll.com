function CTABand({ onBook }) {
  return (
    <section style={cb.root}>
      <div style={cb.motif} aria-hidden="true">AZ</div>
      <div style={cb.inner}>
        <div style={cb.eyebrow}>Ready when you are</div>
        <h2 style={cb.h2} className="az-h2">
          Let's get<br/>your hours back.
        </h2>
        <p style={cb.lead}>A 30-minute call. A plan in 48 hours. The plan is yours either way.</p>
        <div style={cb.ctas}>
          <button onClick={onBook} style={cb.primary}>Book the audit <span style={{marginLeft:8}}>→</span></button>
          <a href="tel:+17199645175" style={cb.ghost}>(719) 964-5175</a>
        </div>
      </div>
    </section>
  );
}

const cb = {
  root: { position:'relative', background:'#0B1A36', color:'#fff', padding:'140px 24px', overflow:'hidden' },
  motif: { position:'absolute', bottom:'-16%', right:'-4%', fontSize:'min(60vw, 720px)', fontWeight:800, letterSpacing:'-0.08em', color:'rgba(94,149,115,0.08)', lineHeight:0.8, userSelect:'none', pointerEvents:'none', fontFamily:'Inter, sans-serif' },
  inner: { maxWidth:1100, margin:'0 auto', position:'relative', zIndex:2 },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#5E9573', marginBottom:24 },
  h2: { fontSize:'clamp(44px, 7vw, 88px)', fontWeight:700, lineHeight:1.02, letterSpacing:'-0.035em', color:'inherit', margin:'0 0 32px' },
  lead: { fontSize:19, color:'rgba(255,255,255,0.72)', margin:'0 0 40px' },
  ctas: { display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' },
  primary: { fontFamily:'inherit', fontSize:16, fontWeight:600, padding:'16px 28px', background:'#2F5D3E', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' },
  ghost: { fontFamily:'ui-monospace, SF Mono, Menlo, monospace', fontSize:14, color:'#fff', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,0.3)', padding:'4px 0' },
};

window.CTABand = CTABand;
