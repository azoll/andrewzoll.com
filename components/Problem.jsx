const { useState: useStateProblem, useEffect: useEffectProblem, useRef: useRefProblem } = React;

function useCountUp(target, { duration = 1400, decimals = 0, start = false } = {}) {
  const [val, setVal] = useStateProblem(start ? target : 0);
  useEffectProblem(() => {
    if (!start) return;
    const t0 = Date.now();
    const ease = (p) => 1 - Math.pow(1 - p, 3);
    let done = false;
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / duration);
      setVal(target * ease(p));
      if (p >= 1 && !done) { done = true; clearInterval(id); }
    }, 16);
    return () => clearInterval(id);
  }, [target, duration, start]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
}

function StatNumber({ value, start, delay = 0 }) {
  const decimals = (value.toString().split('.')[1] || '').length;
  const [go, setGo] = useStateProblem(false);
  useEffectProblem(() => {
    if (!start) return;
    if (delay <= 0) { setGo(true); return; }
    const t = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(t);
  }, [start, delay]);
  const display = useCountUp(parseFloat(value), { duration: 1300, decimals, start: go });
  return <>{display}</>;
}

function Problem() {
  const items = [
    { n:'6.3', u:'hrs/wk', lbl:'Email, inbox triage, rewriting the same reply' },
    { n:'4.1', u:'hrs/wk', lbl:'Scheduling, follow-ups, rescheduling' },
    { n:'3.8', u:'hrs/wk', lbl:'Quotes, invoices, and one-off documents' },
    { n:'2.5', u:'hrs/wk', lbl:'Reporting, weekly summaries, status updates' },
  ];

  const ref = useRefProblem(null);
  const [inView, setInView] = useStateProblem(false);
  useEffectProblem(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    // Respect reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  const totalDisplay = useCountUp(16, { duration: 1500, decimals: 0, start: inView });

  return (
    <section style={pr.root} ref={ref}>
      <div style={pr.inner}>
        <div style={pr.head} className="az-reveal">
          <div style={pr.eyebrow}>The problem</div>
          <h2 style={pr.h2} className="az-h2">
            The week disappears<br className="az-hide-mobile"/> into the same four places.
          </h2>
          <p style={pr.lead}>
            Most small businesses do not lose money in one obvious place. They lose it through slow replies, missed follow-ups, manual admin, and work that should have been systemized years ago.
          </p>
          <p style={{...pr.lead, marginTop:16}}>
            Averages from small-business owners I've audited. Your numbers will differ. The shape is almost always the same.
          </p>
        </div>

        <div style={pr.grid} className="az-problem-grid">
          {items.map((it,i) => (
            <div
              key={i}
              style={pr.card}
              className={`az-reveal az-card-hover az-stat-card`}
              data-reveal-delay={i * 110}
            >
              <div style={pr.num}>
                <span style={{fontVariantNumeric:'tabular-nums'}}>
                  <StatNumber value={it.n} start={inView} delay={i * 120} />
                </span>
                <span style={pr.unit}>{it.u}</span>
              </div>
              <div style={pr.lbl}>{it.lbl}</div>
            </div>
          ))}
        </div>

        <div style={pr.footer} className="az-reveal" data-reveal-delay="200">
          <div style={pr.footerRule}/>
          <div style={pr.footerText}>
            <span style={pr.footerBig}>
              ≈ <span style={{fontVariantNumeric:'tabular-nums'}}>{totalDisplay}</span> hours
            </span>
            <span style={pr.footerSmall}>of weekly repetition, usually showing up as slow response times, missed follow-ups, and revenue leaks.</span>
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
