const { useState: useStateNav, useEffect: useEffectNav } = React;

function SiteNav({ onBook, tweaks }) {
  const [scrolled, setScrolled] = useStateNav(false);
  const [mobileOpen, setMobileOpen] = useStateNav(false);

  useEffectNav(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, {passive:true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dark = tweaks.darkHero && !scrolled;
  const logoSrc = dark ? '../assets/logo-secondary.png' : '../assets/logo-primary.png';

  const linkStyle = {
    fontSize:14, fontWeight:500, textDecoration:'none', cursor:'pointer',
    color: dark ? 'rgba(255,255,255,0.82)' : '#0B1A36',
    transition:'color 180ms',
  };
  const rootStyle = {
    position:'fixed', top:0, left:0, right:0, zIndex:30,
    background: dark ? 'transparent' : 'rgba(255,255,255,0.92)',
    backdropFilter: dark ? 'none' : 'blur(8px)',
    borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : (scrolled ? '1px solid #E0E2E6' : '1px solid #E8E9EB'),
    boxShadow: (!dark && scrolled) ? '0 2px 12px rgba(11,26,54,0.05)' : 'none',
    transition:'background 220ms ease-out, border-color 220ms ease-out, box-shadow 220ms ease-out',
  };
  const ctaStyle = {
    fontFamily:'inherit', fontSize:13, fontWeight:600, padding:'10px 18px',
    background: dark ? '#fff' : (tweaks.accentCta ? '#2F5D3E' : '#0F2144'),
    color: dark ? '#0B1A36' : '#fff',
    border:'none', borderRadius:6, cursor:'pointer', letterSpacing:'-0.005em',
    whiteSpace:'nowrap',
  };

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({top: el.offsetTop - 72, behavior:'smooth'});
  };

  return (
    <nav style={rootStyle}>
      <div style={nv.inner}>
        <a href="#" onClick={(e)=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}} style={{display:'flex',alignItems:'center',border:'none'}}>
          <img src={logoSrc} alt="Andrew Zoll" style={{height:28, display:'block'}}/>
        </a>
        <div style={nv.links} className="az-desktop-nav">
          <a onClick={()=>scrollTo('audit')} style={linkStyle}>The audit</a>
          <a onClick={()=>scrollTo('how')} style={linkStyle}>How it works</a>
          <a onClick={()=>scrollTo('faq')} style={linkStyle}>FAQ</a>
          <a onClick={()=>scrollTo('about')} style={linkStyle}>About</a>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <button onClick={onBook} style={ctaStyle} className="az-desktop-cta az-btn-primary">Book the audit <span className="az-arrow" style={{marginLeft:6}}>→</span></button>
          <button
            onClick={()=>setMobileOpen(v=>!v)}
            aria-label="Menu"
            className="az-mobile-menu-btn"
            style={{...nv.menuBtn, color: dark ? '#fff' : '#0B1A36'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div style={nv.mobileSheet}>
          <a onClick={()=>scrollTo('audit')} style={nv.mobileLink}>The audit</a>
          <a onClick={()=>scrollTo('how')} style={nv.mobileLink}>How it works</a>
          <a onClick={()=>scrollTo('faq')} style={nv.mobileLink}>FAQ</a>
          <a onClick={()=>scrollTo('about')} style={nv.mobileLink}>About</a>
          <button onClick={()=>{setMobileOpen(false);onBook();}} style={nv.mobileCta} className="az-btn-primary">Book the audit <span className="az-arrow">→</span></button>
        </div>
      )}
    </nav>
  );
}

const nv = {
  inner: { maxWidth:1200, margin:'0 auto', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 },
  links: { display:'flex', gap:32 },
  menuBtn: { display:'none', width:40, height:40, background:'transparent', border:'none', borderRadius:6, cursor:'pointer', alignItems:'center', justifyContent:'center' },
  mobileSheet: { background:'#fff', borderTop:'1px solid #E8E9EB', padding:'16px 24px', display:'flex', flexDirection:'column', gap:4 },
  mobileLink: { fontSize:16, fontWeight:500, color:'#0B1A36', padding:'14px 0', borderBottom:'1px solid #F4F4F5', cursor:'pointer', textDecoration:'none' },
  mobileCta: { marginTop:12, fontFamily:'inherit', fontSize:15, fontWeight:600, padding:'14px 20px', background:'#2F5D3E', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' },
};

window.SiteNav = SiteNav;
