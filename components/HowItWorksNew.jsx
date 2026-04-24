function HowItWorksNew() {
  const steps = [
    { n:'01', t:'The call', d:'30 minutes on Zoom. I ask about your week, where work gets stuck, what repeats, and where follow-ups or admin are costing you.', time:'30 min' },
    { n:'02', t:'The audit', d:'I map your actual workflow and identify the three to five places simple automation can remove repetition, tighten follow-up, or reduce operational drag.', time:'Offline' },
    { n:'03', t:'The plan', d:'A written document in your inbox. Ranked by time saved, business impact, and ease of implementation. Tools named, steps listed.', time:'Within 48 hrs' },
    { n:'04', t:'Your call', d:'Take the plan and run with it yourself. Or, if you want help putting it in place, we can talk about implementation.', time:'You decide' },
  ];
  return (
    <section id="how" style={hw.root}>
      <div style={hw.inner}>
        <div style={hw.head} className="az-reveal">
          <div style={hw.eyebrow}>How it works</div>
          <h2 style={hw.h2} className="az-h2">Four steps. No surprises.</h2>
        </div>
        <div style={hw.list}>
          {steps.map((s,i) => (
            <div key={i} style={hw.step} className="az-reveal" data-reveal-delay={i * 90}>
              <div style={hw.stepNum}>{s.n}</div>
              <div style={hw.stepBody}>
                <div style={hw.stepHead}>
                  <h3 style={hw.stepTitle}>{s.t}</h3>
                  <div style={hw.stepTime}>{s.time}</div>
                </div>
                <p style={hw.stepDesc}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const hw = {
  root: { background:'#FAFAFA', padding:'120px 24px', borderTop:'1px solid #E8E9EB', borderBottom:'1px solid #E8E9EB' },
  inner: { maxWidth:1000, margin:'0 auto' },
  head: { marginBottom:64 },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:20 },
  h2: { fontSize:'clamp(36px, 5vw, 56px)', fontWeight:700, lineHeight:1.05, letterSpacing:'-0.03em', color:'#0B1A36', margin:0 },
  list: { display:'flex', flexDirection:'column' },
  step: { display:'grid', gridTemplateColumns:'120px 1fr', gap:32, padding:'36px 0', borderTop:'1px solid #E8E9EB' },
  stepNum: { fontSize:48, fontWeight:800, letterSpacing:'-0.03em', color:'#2F5D3E', lineHeight:1, fontFamily:'Inter, sans-serif' },
  stepBody: {},
  stepHead: { display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:16, marginBottom:10 },
  stepTitle: { fontSize:24, fontWeight:700, letterSpacing:'-0.015em', color:'#0B1A36', margin:0 },
  stepTime: { fontSize:12, fontWeight:600, color:'#888C94', fontFamily:'ui-monospace, SF Mono, Menlo, monospace', letterSpacing:'0.04em' },
  stepDesc: { fontSize:16, lineHeight:1.6, color:'#5E6169', margin:0, maxWidth:640 },
};

window.HowItWorksNew = HowItWorksNew;
