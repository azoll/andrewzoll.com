const { useState: useStateSite, useEffect: useEffectSite } = React;

/* ==========================================================
   TWEAKS — persistent, toolbar-toggled
   ========================================================== */
const TWEAKS = /*EDITMODE-BEGIN*/{
  "darkHero": true,
  "heroHeadline": "You're losing deals and time every week. I'll show you exactly where and fix it.",
  "accentCta": true
}/*EDITMODE-END*/;

function useTweaks() {
  const [t, setT] = useStateSite(TWEAKS);
  const [visible, setVisible] = useStateSite(false);
  useEffectSite(() => {
    function onMsg(e) {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setVisible(true);
      else if (d.type === '__deactivate_edit_mode') setVisible(false);
    }
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const set = (k, v) => {
    setT(prev => ({...prev, [k]: v}));
    try { window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[k]: v}}, '*'); } catch(e){}
  };
  return { tweaks: t, set, visible };
}

function TweaksPanel({ tweaks, set, visible }) {
  if (!visible) return null;
  return (
    <div style={tp.root}>
      <div style={tp.title}>Tweaks</div>
      <label style={tp.row}>
        <span>Dark hero</span>
        <input type="checkbox" checked={!!tweaks.darkHero} onChange={e=>set('darkHero', e.target.checked)}/>
      </label>
      <label style={tp.row}>
        <span>Green CTA (vs. navy)</span>
        <input type="checkbox" checked={!!tweaks.accentCta} onChange={e=>set('accentCta', e.target.checked)}/>
      </label>
      <div style={{...tp.row, flexDirection:'column', alignItems:'stretch', gap:6}}>
        <span>Hero headline</span>
        <input style={tp.input} value={tweaks.heroHeadline} onChange={e=>set('heroHeadline', e.target.value)}/>
      </div>
    </div>
  );
}

const tp = {
  root: { position:'fixed', right:20, bottom:20, zIndex:100, width:260, background:'#fff', border:'1px solid #E8E9EB', borderRadius:10, padding:'16px 18px', boxShadow:'0 12px 32px rgba(11,26,54,0.12)', fontFamily:'Inter, sans-serif' },
  title: { fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:14 },
  row: { display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:13, color:'#0B1A36', marginBottom:12, gap:12, cursor:'pointer' },
  input: { fontFamily:'inherit', fontSize:13, padding:'8px 10px', border:'1px solid #D4D6DA', borderRadius:6, outline:'none' },
};

window.useTweaks = useTweaks;
window.TweaksPanel = TweaksPanel;
