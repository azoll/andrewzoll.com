// Google Calendar Appointment Schedule link. Google blocks iframe embedding
// with X-Frame-Options: DENY, so we open it in a new tab instead of embedding.
const BOOKING_URL = "https://calendar.app.google/jrXRdB1hXyHRtqqz7";

function BookingSheetNew({ open, onClose }) {
  if (!open) return null;

  const handleBook = () => {
    window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div style={bs.scrim} onClick={onClose}/>
      <div style={bs.modal} role="dialog" aria-modal="true" aria-label="Book the audit">
        <button onClick={onClose} style={bs.close} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div style={bs.body}>
          <div style={bs.eyebrow}>Book the audit</div>
          <h2 style={bs.h2}>30 minutes on the calendar.<br/>A plan in your inbox 48 hours later.</h2>

          <div style={bs.summary}>
            <div style={bs.summaryRow}>
              <div style={bs.summaryLabel}>Session</div>
              <div style={bs.summaryValue}>30 minutes on Google Meet</div>
            </div>
            <div style={bs.summaryRow}>
              <div style={bs.summaryLabel}>Deliverable</div>
              <div style={bs.summaryValue}>Written plan within 48 hours</div>
            </div>
            <div style={bs.summaryRow}>
              <div style={bs.summaryLabel}>Fee</div>
              <div style={bs.summaryValue}>$1,000 flat, invoiced after the call</div>
            </div>
          </div>

          <button onClick={handleBook} style={bs.primary} className="az-btn-primary">
            Pick a time on my calendar
            <span className="az-arrow" style={{marginLeft:10, display:'inline-flex'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </span>
          </button>

          <p style={bs.fine}>
            Opens Google Calendar in a new tab. You'll pick a slot that works, and Google sends us both the invite with the Meet link.
          </p>
        </div>
      </div>
    </>
  );
}

const bs = {
  scrim: { position:'fixed', inset:0, background:'rgba(11,26,54,0.55)', zIndex:40, animation:'fade 180ms ease-out', backdropFilter:'blur(2px)' },
  modal: {
    position:'fixed', top:'50%', left:'50%',
    width:'min(560px, 94vw)',
    background:'#fff', borderRadius:14, zIndex:50,
    boxShadow:'0 24px 64px rgba(11,26,54,0.28)',
    overflow:'hidden',
    animation:'modalIn 240ms cubic-bezier(0.2,0.6,0.2,1) forwards',
  },
  close: { position:'absolute', top:18, right:18, width:36, height:36, borderRadius:8, border:'none', background:'#F4F4F5', color:'#0B1A36', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 },
  body: { padding:'52px 48px 40px' },
  eyebrow: { fontSize:11, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#2F5D3E', marginBottom:16 },
  h2: { fontSize:28, fontWeight:700, lineHeight:1.15, letterSpacing:'-0.02em', color:'#0B1A36', margin:'0 0 32px' },
  summary: { border:'1px solid #E8E9EB', borderRadius:10, marginBottom:28, overflow:'hidden' },
  summaryRow: { display:'grid', gridTemplateColumns:'120px 1fr', padding:'14px 18px', borderBottom:'1px solid #E8E9EB', fontSize:14, alignItems:'baseline' },
  summaryLabel: { fontSize:12, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#888C94' },
  summaryValue: { color:'#0B1A36', fontWeight:500 },
  primary: { fontFamily:'inherit', fontSize:15, fontWeight:600, padding:'16px 24px', background:'#2F5D3E', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', width:'100%', display:'flex', alignItems:'center', justifyContent:'center' },
  fine: { fontSize:13, color:'#888C94', textAlign:'center', marginTop:16, lineHeight:1.55, margin:'16px 0 0' },
};

// Strip the trailing border-bottom from the last summary row
if (typeof document !== 'undefined') {
  const styleId = 'az-booking-summary-last';
  if (!document.getElementById(styleId)) {
    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = '[role="dialog"] > div > div > div > div:last-child{border-bottom:none !important;}';
    document.head.appendChild(s);
  }
}

window.BookingSheetNew = BookingSheetNew;
