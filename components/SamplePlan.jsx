function SamplePlan() {
  return (
    <section style={sp.root}>
      <div style={sp.inner}>
        <div style={sp.head} className="az-reveal">
          <div style={sp.eyebrow}>A peek at the deliverable</div>
          <h2 style={sp.h2} className="az-h2">This is what lands<br className="az-hide-mobile"/> in your inbox.</h2>
          <p style={sp.lead}>An eight-page PDF report. Real format, redacted client. Specific tools, ordered by hours saved, with a four-day plan to put them in motion.</p>
        </div>

        <div style={sp.doc} className="az-reveal az-card-hover az-deliverable-card" data-reveal-delay="120">
          {/* Cover strip */}
          <div style={sp.cover}>
            <div style={sp.coverBar}/>
            <div style={sp.coverBody}>
              <div style={sp.coverTop}>
                <div style={sp.coverBrand}>
                  <img src="../assets/logo-icon-primary.png" alt="" style={{width:28, height:28, borderRadius:5}}/>
                  <span style={sp.coverBrandText}>Andrew Zoll · AI Efficiency Audits</span>
                </div>
                <div style={sp.coverDate}>Assessment Date<strong>April 14, 2026</strong></div>
              </div>
              <div style={sp.coverMid}>
                <span style={sp.coverEyebrow}>AI Efficiency Audit</span>
                <h3 style={sp.coverHeadline}>Eight hours back, every week.</h3>
                <p style={sp.coverTagline}>Four quick wins, a four-day plan, and the math behind it.</p>
              </div>
              <div style={sp.coverBottom} data-spgrid="cover-bottom">
                <div><div style={sp.coverLbl}>Prepared For</div><div style={sp.coverVal}>Ridgeline Dental</div></div>
                <div><div style={sp.coverLbl}>Engagement</div><div style={sp.coverVal}>48-hour delivery</div></div>
                <div><div style={sp.coverLbl}>Prepared By</div><div style={sp.coverVal}>Andrew Zoll</div></div>
              </div>
            </div>
            <div style={sp.coverFoot}>01 · Cover</div>
          </div>

          {/* Executive summary */}
          <div style={sp.section}>
            <div style={sp.eyebrowSm}>Executive Summary</div>
            <h4 style={sp.sectionH}>The opportunity at a glance.</h4>
            <div style={sp.execGrid} data-spgrid="exec">
              <div style={sp.poStack}>
                <div style={sp.poCard}>
                  <div style={sp.poLbl}>Pain</div>
                  <div style={sp.poText}>Front desk burns 10+ hours a week on confirmations, treatment-plan write-ups, and insurance follow-ups.</div>
                </div>
                <div style={{...sp.poCard, ...sp.poCardOutcome}}>
                  <div style={sp.poLbl}>Outcome</div>
                  <div style={sp.poText}>Eight hours back across four small automations. No new headcount, no platform switch.</div>
                </div>
              </div>
              <div style={sp.heroStat}>
                <div style={sp.heroLbl}>Hours You Can Reclaim Weekly</div>
                <div style={sp.heroBig}>8<span style={sp.heroBigSuf}>+ hrs</span></div>
                <div style={sp.heroSub}>Across four Quick Wins, recurring every week.</div>
                <div style={sp.heroFocus}>Primary Focus<strong>Front-desk operations</strong></div>
              </div>
            </div>
            <div style={sp.pgFoot}>02 · Executive Summary</div>
          </div>

          {/* Quick wins */}
          <div style={sp.section}>
            <div style={sp.eyebrowSm}>Impact-Effort Matrix</div>
            <h4 style={sp.sectionH}>Where to spend the next four days.</h4>
            <div style={sp.qwList}>
              <div style={sp.qwItem}>
                <div style={sp.qwNum}>1</div>
                <div style={sp.qwText}>
                  <div style={sp.qwPain}>Front desk confirms 40–60 appointments by hand each week.</div>
                  <div style={sp.qwFix}>→ <b>Claude + Zapier</b> drafts confirmations from your scheduling inbox; staff approves with one click.</div>
                </div>
                <div style={sp.qwSaved}>+3.2 hrs</div>
              </div>
              <div style={sp.qwItem}>
                <div style={sp.qwNum}>2</div>
                <div style={sp.qwText}>
                  <div style={sp.qwPain}>Treatment-plan summaries get rewritten from scratch after every visit.</div>
                  <div style={sp.qwFix}>→ <b>Claude</b> turns Dr. Okafor's dictated chart notes into a patient-ready summary in her voice.</div>
                </div>
                <div style={sp.qwSaved}>+2.6 hrs</div>
              </div>
              <div style={sp.qwItem}>
                <div style={sp.qwNum}>3</div>
                <div style={sp.qwText}>
                  <div style={sp.qwPain}>Insurance verification calls eat 90 minutes a day before the first patient.</div>
                  <div style={sp.qwFix}>→ <b>Fathom</b> transcribes the calls; a prompt extracts coverage, copay, and limits into your chart template.</div>
                </div>
                <div style={sp.qwSaved}>+1.4 hrs</div>
              </div>
              <div style={sp.qwItem}>
                <div style={sp.qwNum}>4</div>
                <div style={sp.qwText}>
                  <div style={sp.qwPain}>Hygienist no-show follow-ups slip past 48 hours and you lose the rebook.</div>
                  <div style={sp.qwFix}>→ <b>Make</b> triggers a same-day SMS draft to the patient with two reschedule options.</div>
                </div>
                <div style={sp.qwSaved}>+0.8 hrs</div>
              </div>
            </div>
            <div style={sp.pgFoot}>03 · Impact-Effort Matrix</div>
          </div>

          {/* 4-day plan */}
          <div style={sp.section}>
            <div style={sp.eyebrowSm}>Implementation Plan</div>
            <h4 style={sp.sectionH}>Your 4-day Quick Wins plan.</h4>
            <p style={sp.planLead}>One task per day. Each builds on the last. Total active time across four days: under four hours.</p>
            <div style={sp.planGrid} data-spgrid="plan">
              <div style={sp.day}>
                <div style={sp.dayNum}>Day 01</div>
                <div style={sp.dayBig}>01</div>
                <div style={sp.dayTask}>Wire the confirmation responder. 40 minutes.</div>
                <div style={sp.dayTool}>Tool<b>Claude + Zapier</b></div>
              </div>
              <div style={sp.day}>
                <div style={sp.dayNum}>Day 02</div>
                <div style={sp.dayBig}>02</div>
                <div style={sp.dayTask}>Build the chart-note → summary prompt. 50 minutes.</div>
                <div style={sp.dayTool}>Tool<b>Claude</b></div>
              </div>
              <div style={sp.day}>
                <div style={sp.dayNum}>Day 03</div>
                <div style={sp.dayBig}>03</div>
                <div style={sp.dayTask}>Stand up the insurance-call extractor. 60 minutes.</div>
                <div style={sp.dayTool}>Tool<b>Fathom</b></div>
              </div>
              <div style={sp.day}>
                <div style={sp.dayNum}>Day 04</div>
                <div style={sp.dayBig}>04</div>
                <div style={sp.dayTask}>Turn on the no-show SMS workflow. 45 minutes.</div>
                <div style={sp.dayTool}>Tool<b>Make</b></div>
              </div>
            </div>
            <div style={sp.pgFoot}>05 · 4-Day Plan</div>
          </div>

          {/* Financial impact */}
          <div style={sp.section}>
            <div style={sp.eyebrowSm}>Financial Impact</div>
            <h4 style={sp.sectionH}>The math.</h4>
            <div style={sp.finGrid} data-spgrid="fin">
              <div style={sp.finCard}>
                <div style={sp.finLbl}>Weekly Time Returned</div>
                <div style={sp.finBig}>8<span style={sp.finBigSuf}>hrs</span></div>
                <div style={sp.finSub}>Across four Quick Wins, weekly recurring.</div>
              </div>
              <div style={{...sp.finCard, ...sp.finCardRoi}}>
                <div style={sp.finLbl}>Monthly Net ROI</div>
                <div style={sp.finBig}>$5,200<span style={sp.finBigSuf}>+</span></div>
                <div style={sp.finSub}>32 reclaimed hours @ $40/hr blended, less tools.</div>
              </div>
            </div>
            <div style={sp.finFoot}>
              <span>Total monthly tool cost</span>
              <span><strong>$84</strong> · payback in week one</span>
            </div>
            <div style={sp.pgFoot}>07 · Financial Impact</div>
          </div>

          <div style={sp.docFoot}>
            <span style={sp.docFootDots}>···</span>
            <span>Plus: recommended solutions, what comes after, and your move.</span>
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

  cover: { background:'#FAFAFA', borderBottom:'1px solid #E8E9EB', position:'relative' },
  coverBar: { height:4, background:'linear-gradient(90deg, #2F5D3E 0%, #5E9573 100%)' },
  coverBody: { padding:'32px 40px 28px' },
  coverTop: { display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap', marginBottom:32 },
  coverBrand: { display:'flex', alignItems:'center', gap:12 },
  coverBrandText: { fontSize:13, fontWeight:600, color:'#0B1A36', letterSpacing:'-0.01em' },
  coverDate: { fontSize:11, color:'#888C94', letterSpacing:'0.08em', textTransform:'uppercase', display:'flex', flexDirection:'column' },
  coverMid: { marginBottom:32, maxWidth:640 },
  coverEyebrow: { display:'inline-block', padding:'5px 12px', background:'#EEF3EF', color:'#234A2F', fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius:100, marginBottom:18 },
  coverHeadline: { fontSize:36, fontWeight:700, lineHeight:1.08, letterSpacing:'-0.02em', color:'#0B1A36', margin:'0 0 12px' },
  coverTagline: { fontSize:16, color:'#5E6169', lineHeight:1.5, margin:0 },
  coverBottom: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24, paddingTop:24, borderTop:'1px solid #E8E9EB' },
  coverLbl: { fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#888C94', marginBottom:6 },
  coverVal: { fontSize:14, fontWeight:600, color:'#0B1A36' },
  coverFoot: { padding:'10px 40px', fontSize:11, color:'#888C94', fontFamily:'ui-monospace, SF Mono, Menlo, monospace', textAlign:'right', borderTop:'1px solid #E8E9EB' },

  section: { padding:'36px 40px 14px', borderBottom:'1px solid #E8E9EB', position:'relative' },
  eyebrowSm: { fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:8 },
  sectionH: { fontSize:24, fontWeight:700, color:'#0B1A36', letterSpacing:'-0.02em', margin:'0 0 24px', lineHeight:1.2 },
  pgFoot: { marginTop:24, paddingTop:14, borderTop:'1px dashed #E8E9EB', fontSize:11, color:'#888C94', fontFamily:'ui-monospace, SF Mono, Menlo, monospace', textAlign:'right' },

  execGrid: { display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:20 },
  poStack: { display:'flex', flexDirection:'column', gap:12 },
  poCard: { background:'#FAFAFA', border:'1px solid #E8E9EB', borderRadius:8, padding:'14px 16px' },
  poCardOutcome: { background:'#EEF3EF', borderColor:'#CFE0D5' },
  poLbl: { fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#888C94', marginBottom:6 },
  poText: { fontSize:13, lineHeight:1.55, color:'#0B1A36' },
  heroStat: { background:'#0B1A36', color:'#fff', borderRadius:8, padding:'20px 22px', display:'flex', flexDirection:'column', justifyContent:'center' },
  heroLbl: { fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)', marginBottom:10 },
  heroBig: { fontSize:56, fontWeight:800, color:'#fff', letterSpacing:'-0.03em', lineHeight:0.95 },
  heroBigSuf: { fontSize:18, fontWeight:600, color:'rgba(255,255,255,0.7)', marginLeft:6 },
  heroSub: { fontSize:13, color:'rgba(255,255,255,0.72)', margin:'10px 0 18px', lineHeight:1.45 },
  heroFocus: { fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.12)', display:'flex', flexDirection:'column', gap:4 },

  qwList: { display:'flex', flexDirection:'column', gap:14 },
  qwItem: { display:'grid', gridTemplateColumns:'auto 1fr auto', gap:16, alignItems:'start', padding:'14px 16px', background:'#FAFAFA', border:'1px solid #E8E9EB', borderRadius:8 },
  qwNum: { width:28, height:28, borderRadius:'50%', background:'#2F5D3E', color:'#fff', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  qwText: { minWidth:0 },
  qwPain: { fontSize:14, fontWeight:600, color:'#0B1A36', lineHeight:1.4, marginBottom:4 },
  qwFix: { fontSize:13, color:'#5E6169', lineHeight:1.5 },
  qwSaved: { fontSize:13, fontWeight:700, color:'#2F5D3E', whiteSpace:'nowrap', alignSelf:'center' },

  planLead: { fontSize:13, color:'#5E6169', margin:'0 0 18px', maxWidth:560, lineHeight:1.5 },
  planGrid: { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 },
  day: { background:'#FAFAFA', border:'1px solid #E8E9EB', borderRadius:8, padding:'14px 14px 16px', position:'relative', overflow:'hidden' },
  dayNum: { fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#888C94', fontFamily:'ui-monospace, SF Mono, Menlo, monospace' },
  dayBig: { fontSize:36, fontWeight:800, color:'#EEF3EF', letterSpacing:'-0.04em', lineHeight:1, margin:'2px 0 8px' },
  dayTask: { fontSize:13, fontWeight:600, color:'#0B1A36', lineHeight:1.4, marginBottom:10, minHeight:54 },
  dayTool: { fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#888C94', display:'flex', flexDirection:'column', gap:2, paddingTop:10, borderTop:'1px solid #E8E9EB' },

  finGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  finCard: { background:'#FAFAFA', border:'1px solid #E8E9EB', borderRadius:8, padding:'18px 20px' },
  finCardRoi: { background:'#EEF3EF', borderColor:'#CFE0D5' },
  finLbl: { fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#888C94', marginBottom:8 },
  finBig: { fontSize:40, fontWeight:800, color:'#0B1A36', letterSpacing:'-0.03em', lineHeight:1 },
  finBigSuf: { fontSize:16, fontWeight:600, color:'#5E6169', marginLeft:4 },
  finSub: { fontSize:12, color:'#5E6169', marginTop:8, lineHeight:1.45 },
  finFoot: { marginTop:14, padding:'12px 16px', background:'#0B1A36', color:'rgba(255,255,255,0.85)', borderRadius:6, display:'flex', justifyContent:'space-between', gap:12, fontSize:12, flexWrap:'wrap' },

  docFoot: { padding:'24px 40px', display:'flex', alignItems:'center', gap:12, fontSize:13, color:'#888C94', fontStyle:'italic', background:'#FAFAFA' },
  docFootDots: { fontSize:18, color:'#B6B9BF' },
};

window.SamplePlan = SamplePlan;
