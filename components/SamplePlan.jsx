function SamplePlan() {
  return (
    <section style={sp.root}>
      <div style={sp.inner}>
        <div style={sp.head}>
          <div style={sp.eyebrow}>A peek at the deliverable</div>
          <h2 style={sp.h2} className="az-h2">This is what lands<br className="az-hide-mobile"/> in your inbox.</h2>
          <p style={sp.lead}>Real format, redacted client. Two to three pages. Specific tools, specific steps, ordered by hours saved.</p>
        </div>

        <div style={sp.doc}>
          <div style={sp.docHeader}>
            <div style={sp.docBrand}>
              <img src="../assets/logo-icon-primary.png" alt="" style={{width:28, height:28, borderRadius:5}}/>
              <div>
                <div style={sp.docTitle}>Efficiency Audit · Ridgeline Dental</div>
                <div style={sp.docMeta}>Prepared by Andrew Zoll · April 2026</div>
              </div>
            </div>
            <div style={sp.docTag}>Confidential</div>
          </div>

          <div style={sp.docBody}>
            <div style={sp.summary}>
              <div style={sp.sumItem}><div style={sp.sumNum}>8.4</div><div style={sp.sumLbl}>est. hrs/wk saved</div></div>
              <div style={sp.sumDiv}/>
              <div style={sp.sumItem}><div style={sp.sumNum}>4</div><div style={sp.sumLbl}>fixes</div></div>
              <div style={sp.sumDiv}/>
              <div style={sp.sumItem}><div style={sp.sumNum}>2 wks</div><div style={sp.sumLbl}>to implement</div></div>
            </div>

            <div style={sp.fix}>
              <div style={sp.fixHead}>
                <span style={sp.fixNum}>Fix 01</span>
                <span style={sp.fixSaved}>+3.2 hrs/wk</span>
              </div>
              <div style={sp.fixTitle}>Replace manual appointment confirmations with an AI-triaged responder.</div>
              <div style={sp.fixTools}>
                <span style={sp.fixTool}>Claude</span>
                <span style={sp.fixTool}>Zapier</span>
                <span style={sp.fixTool}>Your existing scheduling tool</span>
              </div>
              <div style={sp.fixNote}>
                Front desk currently confirms 40–60 appointments manually per week.
                Replace with an inbox trigger that drafts a confirmation; staff approves with one click.
              </div>
            </div>

            <div style={sp.fix}>
              <div style={sp.fixHead}>
                <span style={sp.fixNum}>Fix 02</span>
                <span style={sp.fixSaved}>+2.6 hrs/wk</span>
              </div>
              <div style={sp.fixTitle}>Pre-fill treatment plan summaries from chart notes.</div>
              <div style={sp.fixTools}>
                <span style={sp.fixTool}>Claude</span>
                <span style={sp.fixTool}>Your EHR export</span>
              </div>
              <div style={sp.fixNote}>
                Dr. Okafor dictates chart notes post-visit. A short prompt generates the patient-facing summary
                in her voice; she reviews and sends.
              </div>
            </div>

            <div style={sp.fixMore}>
              <span style={sp.fixMoreDots}>···</span>
              <span>2 more fixes in the full plan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const sp = {
  root: { background:'#0B1A36', color:'#fff', padding:'120px 24px', position:'relative', overflow:'hidden' },
  inner: { maxWidth:1100, margin:'0 auto', position:'relative', zIndex:2 },
  head: { maxWidth:760, marginBottom:64 },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#5E9573', marginBottom:20 },
  h2: { fontSize:'clamp(34px, 4.8vw, 56px)', fontWeight:700, lineHeight:1.06, letterSpacing:'-0.03em', color:'inherit', margin:'0 0 20px' },
  lead: { fontSize:17, lineHeight:1.6, color:'rgba(255,255,255,0.72)', margin:0, maxWidth:560 },
  doc: { background:'#fff', color:'#0B1A36', borderRadius:12, overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.15)' },
  docHeader: { padding:'20px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #E8E9EB', background:'#FAFAFA', gap:16, flexWrap:'wrap' },
  docBrand: { display:'flex', alignItems:'center', gap:14 },
  docTitle: { fontSize:15, fontWeight:600, color:'#0B1A36', letterSpacing:'-0.01em' },
  docMeta: { fontSize:12, color:'#888C94', marginTop:2, fontFamily:'ui-monospace, SF Mono, Menlo, monospace' },
  docTag: { fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#888C94', border:'1px solid #D4D6DA', padding:'4px 8px', borderRadius:4 },
  docBody: { padding:'36px 40px' },
  summary: { display:'flex', alignItems:'center', gap:28, padding:'20px 24px', background:'#EEF3EF', borderRadius:8, marginBottom:36, flexWrap:'wrap' },
  sumItem: {},
  sumNum: { fontSize:32, fontWeight:800, color:'#234A2F', letterSpacing:'-0.02em', lineHeight:1 },
  sumLbl: { fontSize:12, color:'#5E6169', marginTop:4, letterSpacing:'0.02em' },
  sumDiv: { width:1, height:32, background:'#B6B9BF', opacity:0.6 },
  fix: { paddingTop:28, paddingBottom:28, borderTop:'1px solid #E8E9EB' },
  fixHead: { display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10, gap:12, flexWrap:'wrap' },
  fixNum: { fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#888C94', fontFamily:'ui-monospace, SF Mono, Menlo, monospace' },
  fixSaved: { fontSize:14, fontWeight:700, color:'#2F5D3E' },
  fixTitle: { fontSize:18, fontWeight:600, color:'#0B1A36', lineHeight:1.35, marginBottom:12, letterSpacing:'-0.01em' },
  fixTools: { display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 },
  fixTool: { fontSize:11, fontWeight:500, color:'#5E6169', background:'#F4F4F5', border:'1px solid #E8E9EB', padding:'3px 8px', borderRadius:4 },
  fixNote: { fontSize:14, lineHeight:1.6, color:'#5E6169', maxWidth:640 },
  fixMore: { paddingTop:24, borderTop:'1px solid #E8E9EB', display:'flex', alignItems:'center', gap:12, fontSize:13, color:'#888C94', fontStyle:'italic' },
  fixMoreDots: { fontSize:18, color:'#B6B9BF' },
};

window.SamplePlan = SamplePlan;
