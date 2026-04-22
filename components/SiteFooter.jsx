function SiteFooter() {
  return (
    <footer style={ft.root}>
      <div style={ft.inner}>
        <div style={ft.top} className="az-footer-top">
          <div>
            <img src="../assets/logo-primary.png" alt="" style={{height:26, marginBottom:14, display:'block'}}/>
            <div style={ft.desc}>AI Efficiency Audits for small-business owners who want their week back.</div>
          </div>
          <div style={ft.cols} className="az-footer-cols">
            <div style={ft.col}>
              <div style={ft.colTitle}>Site</div>
              <a href="#audit" style={ft.link}>The audit</a>
              <a href="#how" style={ft.link}>How it works</a>
              <a href="#faq" style={ft.link}>FAQ</a>
              <a href="#about" style={ft.link}>About</a>
            </div>
            <div style={ft.col}>
              <div style={ft.colTitle}>Contact</div>
              <a href="tel:+17199645175" style={ft.linkMono}>(719) 964-5175</a>
            </div>
          </div>
        </div>
        <div style={ft.bottom}>
          <div style={ft.copy}>© 2026 Andrew Zoll · AI Efficiency Audits</div>
          <div style={ft.copy}>Pueblo, CO</div>
        </div>
      </div>
    </footer>
  );
}

const ft = {
  root: { background:'#fff', padding:'64px 24px 32px', borderTop:'1px solid #E8E9EB' },
  inner: { maxWidth:1200, margin:'0 auto' },
  top: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, paddingBottom:40, borderBottom:'1px solid #E8E9EB' },
  desc: { fontSize:14, color:'#5E6169', lineHeight:1.5, maxWidth:320 },
  cols: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 },
  col: { display:'flex', flexDirection:'column', gap:10 },
  colTitle: { fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#888C94', marginBottom:6 },
  link: { fontSize:14, color:'#0B1A36', textDecoration:'none', border:'none' },
  linkMono: { fontSize:13, color:'#0B1A36', textDecoration:'none', fontFamily:'ui-monospace, SF Mono, Menlo, monospace', border:'none' },
  bottom: { display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:24, flexWrap:'wrap', gap:12 },
  copy: { fontSize:12, color:'#888C94' },
};

window.SiteFooter = SiteFooter;
