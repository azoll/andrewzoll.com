function AboutInline() {
  return (
    <section id="about" style={ab.root}>
      <div style={ab.inner}>
        <div style={ab.grid} className="az-about-grid">
          <div style={ab.photoWrap}>
            <div style={ab.photo}>
              <img src="../assets/andrew-headshot.png" alt="Andrew Zoll" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
            </div>
            <div style={ab.photoMeta}>
              <div style={ab.photoName}>Andrew Zoll</div>
              <div style={ab.photoRole}>Founder and Builder · Colorado</div>
            </div>
          </div>

          <div style={ab.copy}>
            <div style={ab.eyebrow}>About</div>
            <h2 style={ab.h2} className="az-h2">Hi, I'm Andrew.</h2>
            <div style={ab.body}>
              <p>I grew up in Colorado. I'm a financial advisor by trade and a builder by wiring. Husband, dad of four, business owner. I spend most of my time trying to build things that actually matter.</p>

              <p>For the last five years I've worked as a financial advisor with high-income Christian families. That work sharpened how I think about stewardship, long-term planning, and what matters once you strip the noise away.</p>

              <p>Alongside that, I've always been wired to build. Systems, workflows, automations. That eventually turned into software. FieldCommand is the current version of it, a bid-to-payment platform for commercial electricians.</p>

              <p>I didn't come up through a traditional tech path. I learned by doing, breaking things, and using AI as a lever to move faster. I use it aggressively, but I stress-test everything it produces until it actually works in the real world.</p>

              <p>The audits came out of frustration. I kept seeing business owners either ignore AI completely, or use it in shallow ways that wasted more time than they saved. Meanwhile I was using it to build real systems. The gap stuck out, so I started auditing workflows instead of just talking about tools.</p>

              <p>My worldview shapes how I work. Stewardship, responsibility, clarity over noise. That shows up whether we're talking about money, business, or systems.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ab = {
  root: { background:'#fff', padding:'120px 24px', borderTop:'1px solid #E8E9EB' },
  inner: { maxWidth:1100, margin:'0 auto' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:64, alignItems:'start' },
  photoWrap: { position:'sticky', top:100 },
  photo: { aspectRatio:'1/1', background:'#F4F4F5', borderRadius:10, border:'1px solid #E8E9EB', marginBottom:18, overflow:'hidden', position:'relative' },
  photoMeta: {},
  photoName: { fontSize:15, fontWeight:600, color:'#0B1A36' },
  photoRole: { fontSize:13, color:'#5E6169', marginTop:2 },
  copy: {},
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:20 },
  h2: { fontSize:'clamp(36px, 5vw, 56px)', fontWeight:700, lineHeight:1.04, letterSpacing:'-0.03em', color:'#0B1A36', margin:'0 0 32px' },
  body: { display:'flex', flexDirection:'column', gap:18, fontSize:17, lineHeight:1.7, color:'#3F434B' },
};

window.AboutInline = AboutInline;
