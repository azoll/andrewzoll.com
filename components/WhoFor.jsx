function WhoFor() {
  const forYou = [
    'You own a small business (1–15 people).',
    'Your week disappears into email, scheduling, and admin.',
    'You want specific fixes, not a strategy deck.',
    'You are the one who would actually implement them.',
  ];
  const notFor = [
    'You want a vendor who only works on retainer from day one.',
    'You want a 40-page report with charts.',
    'You run a 200-person company with a procurement process.',
  ];
  return (
    <section style={wf.root}>
      <div style={wf.inner}>
        <div style={wf.head}>
          <div style={wf.eyebrow}>Who it's for</div>
          <h2 style={wf.h2} className="az-h2">Honest about<br className="az-hide-mobile"/> the fit.</h2>
        </div>

        <div style={wf.grid} className="az-whofor-grid">
          <div style={wf.col}>
            <div style={wf.colHead}>
              <div style={{...wf.dot, background:'#2F5D3E'}}/>
              <div style={wf.colTitle}>This is for you if</div>
            </div>
            <ul style={wf.list}>
              {forYou.map((t,i)=>(<li key={i} style={wf.li}><span style={wf.bullet}>+</span>{t}</li>))}
            </ul>
          </div>
          <div style={{...wf.col, ...wf.colDim}}>
            <div style={wf.colHead}>
              <div style={{...wf.dot, background:'#B6B9BF'}}/>
              <div style={wf.colTitle}>Not the right fit if</div>
            </div>
            <ul style={wf.list}>
              {notFor.map((t,i)=>(<li key={i} style={{...wf.li, color:'#888C94'}}><span style={{...wf.bullet, color:'#B6B9BF'}}>×</span>{t}</li>))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const wf = {
  root: { background:'#fff', padding:'120px 24px' },
  inner: { maxWidth:1100, margin:'0 auto' },
  head: { marginBottom:64 },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:20 },
  h2: { fontSize:'clamp(36px, 5vw, 56px)', fontWeight:700, lineHeight:1.04, letterSpacing:'-0.03em', color:'#0B1A36', margin:0 },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 },
  col: { padding:'32px 32px 32px 0' },
  colDim: { opacity:0.92 },
  colHead: { display:'flex', alignItems:'center', gap:10, marginBottom:24 },
  dot: { width:8, height:8, borderRadius:'50%' },
  colTitle: { fontSize:13, fontWeight:600, color:'#0B1A36', letterSpacing:'0.04em', textTransform:'uppercase' },
  list: { listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:14 },
  li: { fontSize:17, lineHeight:1.5, color:'#0B1A36', display:'flex', gap:14 },
  bullet: { color:'#2F5D3E', flexShrink:0 },
};

window.WhoFor = WhoFor;
