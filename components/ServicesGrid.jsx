function ServicesGrid() {
  const cards = [
    {
      label: 'Start here',
      name: 'AI Efficiency Assessment',
      price: '$997',
      priceNote: 'flat',
      desc: 'A ranked, written plan in 45 hours that names the exact AI tools for your business and the hours each one saves. Most owners start here.',
      href: '/audit/',
      cta: 'See the assessment',
      featured: false,
    },
    {
      label: 'Build it',
      name: 'AI Implementation',
      price: 'Custom',
      priceNote: 'by scope',
      desc: 'Done-for-you build of the top items from your plan. Integrations across Claude, GPT, Zapier, Make, and n8n, scoped and priced by project.',
      href: '/services/',
      cta: 'See all services',
      featured: false,
    },
    {
      label: 'Run on it',
      name: 'OS Builder',
      price: 'From $2,500',
      priceNote: 'one-time',
      desc: 'A custom AI setup that remembers your whole business, with a team of assistants that handle the repeatable work while you approve every call. Do it yourself, or build it together.',
      href: '/os-builder/',
      cta: 'Explore the OS Builder',
      featured: true,
    },
  ];

  return (
    <section id="services" style={sv.root}>
      <div style={sv.inner}>
        <div style={sv.head} className="az-reveal">
          <div style={sv.eyebrow}>Ways to work together</div>
          <h2 style={sv.h2} className="az-h2">Start with a plan.<br/>Build when you are ready.</h2>
          <p style={sv.lead}>Three ways in, from a one-time plan to a full operating system that runs the way you do. Each one stands on its own, and each one feeds the next.</p>
        </div>

        <div style={sv.grid} className="az-services-grid">
          {cards.map((c, i) => (
            <a
              key={i}
              href={c.href}
              style={{...sv.card, ...(c.featured ? sv.cardFeatured : {})}}
              className="az-card-hover"
              data-reveal-delay={i * 90}
            >
              {c.featured && <div style={sv.badge}>New</div>}
              <div style={{...sv.cardLabel, color: c.featured ? '#5E9573' : '#888C94'}}>{c.label}</div>
              <h3 style={{...sv.cardName, color: c.featured ? '#fff' : '#0B1A36'}}>{c.name}</h3>
              <div style={sv.priceRow}>
                <span style={{...sv.price, color: c.featured ? '#fff' : '#2F5D3E'}}>{c.price}</span>
                <span style={{...sv.priceNote, color: c.featured ? 'rgba(255,255,255,0.55)' : '#888C94'}}>{c.priceNote}</span>
              </div>
              <p style={{...sv.desc, color: c.featured ? 'rgba(255,255,255,0.78)' : '#5E6169'}}>{c.desc}</p>
              <span style={{...sv.link, color: c.featured ? '#fff' : '#2F5D3E'}}>
                {c.cta} <span className="az-arrow" style={{marginLeft:6}}>→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const sv = {
  root: { background:'#FAFAFA', borderTop:'1px solid #E8E9EB', borderBottom:'1px solid #E8E9EB', padding:'120px 24px' },
  inner: { maxWidth:1200, margin:'0 auto' },
  head: { maxWidth:780, marginBottom:56 },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:20 },
  h2: { fontSize:'clamp(36px, 5vw, 60px)', fontWeight:700, lineHeight:1.04, letterSpacing:'-0.03em', color:'#0B1A36', margin:'0 0 24px' },
  lead: { fontSize:19, lineHeight:1.6, color:'#5E6169', margin:0, maxWidth:640 },
  grid: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, alignItems:'stretch' },
  card: { position:'relative', display:'flex', flexDirection:'column', background:'#fff', border:'1px solid #E8E9EB', borderRadius:14, padding:'32px 30px', textDecoration:'none', borderBottom:'1px solid #E8E9EB' },
  cardFeatured: { background:'#0B1A36', border:'1px solid #0B1A36', boxShadow:'0 20px 48px rgba(11,26,54,0.22)' },
  badge: { position:'absolute', top:24, right:26, fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', background:'#2F5D3E', color:'#fff', padding:'5px 10px', borderRadius:999 },
  cardLabel: { fontSize:12, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14 },
  cardName: { fontSize:23, fontWeight:700, letterSpacing:'-0.02em', margin:'0 0 14px', lineHeight:1.1 },
  priceRow: { display:'flex', alignItems:'baseline', gap:8, marginBottom:16 },
  price: { fontSize:28, fontWeight:800, letterSpacing:'-0.02em', lineHeight:1 },
  priceNote: { fontSize:13, fontWeight:500 },
  desc: { fontSize:15, lineHeight:1.6, margin:'0 0 26px', flex:1 },
  link: { fontSize:15, fontWeight:600, display:'inline-flex', alignItems:'center', marginTop:'auto' },
};

window.ServicesGrid = ServicesGrid;
