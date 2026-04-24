const { useState: useStateFAQ } = React;

function FAQNew() {
  const [open, setOpen] = useStateFAQ(0);
  const qs = [
    { q:'How much does the audit cost?', a:'The audit is $1,000, flat. That covers the 30-minute call and the written plan you get within 48 hours. If you want help implementing the plan afterward, that is separate work and priced based on scope. The plan is yours to keep either way.' },
    { q:'Who is this for?', a:'Small business owners who are losing time and momentum to repetitive admin, missed follow-ups, slow quoting, scheduling friction, inbox drag, or manual reporting. The best fit is a 1 to 15 person business where the owner is still close enough to the work to know where things get stuck.' },
    { q:'Do I need to know anything about AI?', a:'No. The audit is not about making you an AI expert. It is about finding practical places where simple tools can reduce repetitive work, improve follow-up, and make the business easier to run.' },
    { q:'What if AI is not the right answer for my business?', a:'Then I will say so. Sometimes the best fix is a better process, a template, a checklist, or a simpler tool. I am not trying to force AI where it does not belong.' },
    { q:'Do you do the implementation for me?', a:'Yes, when it makes sense. The audit is the first step. If you want help putting the plan in place, implementation is separate and priced based on the scope of the work.' },
    { q:'How do you handle my data?', a:'I only ask for what is needed to understand the workflow. Do not send sensitive client, customer, medical, financial, or employee information unless we have agreed on how it will be handled. The goal is to map the process, not collect private data.' },
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
