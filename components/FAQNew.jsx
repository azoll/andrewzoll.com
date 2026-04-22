const { useState: useStateFAQ } = React;

function FAQNew() {
  const [open, setOpen] = useStateFAQ(0);
  const qs = [
    { q:'How much does the audit cost?', a:'The audit is $1,000, flat. That covers the 30-minute call and the written plan you get within 48 hours. If you want me to help implement any of it afterward, that is separate work and priced based on the scope. The plan is yours to keep either way.' },
    { q:'Who is this for?', a:'Small business owners running teams of roughly 1 to 15 people. Service businesses, professional practices, trades, small agencies. If your week disappears into email, scheduling, and repeated admin, this is for you.' },
    { q:'Do I need to know anything about AI?', a:'No. The plan is written for business owners, not developers. Tools are named. Steps are listed. Nothing in the plan requires code.' },
    { q:'What if AI isn\'t the right answer for my business?', a:'Then I tell you that and refund your money. I\'d rather say "AI won\'t help here, you need an assistant or a better tool," than invent problems to solve.' },
    { q:'Do you do the implementation for me?', a:'Yes, if you want that. The audit stands alone, and plenty of people take the plan and run with it themselves. If you want help putting it in place, implementation is priced separately based on the scope of the work. We only talk about it after the plan lands, not before.' },
    { q:'How do you handle my data?', a:'I see whatever you show me during the call. I do not connect to your systems. I do not retain anything beyond the written plan. If you want a signed NDA before the call, just say so.' },
  ];
  return (
    <section id="faq" style={fq.root}>
      <div style={fq.inner}>
        <div style={fq.head} className="az-reveal">
          <div style={fq.eyebrow}>Questions</div>
          <h2 style={fq.h2} className="az-h2">The basics.</h2>
        </div>

        <div style={fq.list} className="az-reveal" data-reveal-delay="100">
          {qs.map((item,i) => (
            <div key={i} style={{...fq.item, borderBottom:i===qs.length-1?'1px solid #E8E9EB':'1px solid #E8E9EB'}}>
              <button onClick={()=>setOpen(open===i?-1:i)} style={fq.q}>
                <span style={fq.qText}>{item.q}</span>
                <span style={{...fq.plus, transform:open===i?'rotate(45deg)':'none'}}>+</span>
              </button>
              <div style={{...fq.aWrap, maxHeight: open===i ? 400 : 0}}>
                <div style={fq.a}>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const fq = {
  root: { background:'#FAFAFA', padding:'120px 24px', borderTop:'1px solid #E8E9EB' },
  inner: { maxWidth:960, margin:'0 auto' },
  head: { marginBottom:56 },
  eyebrow: { fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:20 },
  h2: { fontSize:'clamp(36px, 5vw, 56px)', fontWeight:700, lineHeight:1.04, letterSpacing:'-0.03em', color:'#0B1A36', margin:0 },
  list: { borderTop:'1px solid #E8E9EB' },
  item: {},
  q: { width:'100%', fontFamily:'inherit', fontSize:18, fontWeight:600, color:'#0B1A36', textAlign:'left', padding:'24px 4px', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, letterSpacing:'-0.01em' },
  qText: { flex:1 },
  plus: { fontSize:28, fontWeight:300, color:'#2F5D3E', transition:'transform 220ms ease-out', flexShrink:0, display:'inline-block' },
  aWrap: { overflow:'hidden', transition:'max-height 240ms ease-out' },
  a: { padding:'0 4px 24px', fontSize:16, lineHeight:1.65, color:'#5E6169', maxWidth:720 },
};

window.FAQNew = FAQNew;
