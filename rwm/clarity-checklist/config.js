/* =========================================================================
   Tool 1. Christian Business Owner Financial Clarity Checklist
   ========================================================================= */
(function () {
  'use strict';

  // ---- Recommendation library ---------------------------------------------
  // Each step is keyed by a tag. The result builder picks 3 by tag-priority,
  // dedup'd by id.
  const recos = {
    margin_negative: [
      { id: 'cut_one',   text: 'Cut one recurring business expense this week. Even $200 a month gives you a little breathing room.' },
      { id: 'price_audit', text: 'Audit your pricing on your top 2 services. Most owners undercharge by 15–25%.' },
    ],
    margin_thin: [
      { id: 'product_mix', text: 'Identify your most profitable offer. Consider concentrating sales effort there for 30 days.' },
      { id: 'expense_review', text: 'Pull last 90 days of expenses and flag anything you can\'t name a clear business reason for.' },
    ],
    runway_unknown: [
      { id: 'runway_calc', text: 'List all account balances and your average monthly outflow. Runway is balance divided by outflow. About 15 minutes of work.' },
    ],
    runway_short: [
      { id: 'cash_buffer', text: 'Stop new spending commitments for 30 days and route every dollar toward a 90-day cash buffer.' },
      { id: 'lender_talk', text: 'Talk to a lender about a line of credit while your numbers still look fine, before you actually need it.' },
    ],
    complexity_high: [
      { id: 'consolidate', text: 'Pick one redundant account or platform to close or consolidate this month.' },
      { id: 'separate_books', text: 'If your business and personal money are in the same account, separate them this week. It\'s probably the most useful thing you can do right now.' },
    ],
    complexity_medium: [
      { id: 'monthly_close', text: 'Schedule a 30-minute monthly close on the same date each month. Bank reconciliation, P&L glance, top 3 questions.' },
    ],
    no_books: [
      { id: 'bookkeeping', text: 'Hire a bookkeeper, or commit to monthly bookkeeping yourself before quarter-end. It\'s worth the cost at your stage.' },
    ],
    no_cpa: [
      { id: 'cpa_intro', text: 'Schedule one introductory call with a CPA who works with business owners in your industry.' },
    ],
    avoid_shame: [
      { id: 'name_shame', text: 'Write down the story you\'ve been telling yourself about money. Putting it in writing usually takes some of the weight off.' },
    ],
    avoid_fear: [
      { id: 'name_fear', text: 'Write down the specific worst-case scenario you\'re afraid of. Fears tend to feel smaller once they\'re on paper.' },
    ],
    avoid_overwhelm: [
      { id: 'one_thing', text: 'Pick one financial task this week. Just one. Building the habit matters more than catching everything up at once.' },
    ],
    avoid_spouse: [
      { id: 'spouse_meeting', text: 'Schedule a 30-minute money meeting with your spouse this week. No solving anything yet, just both of you looking at the same screen.' },
    ],
    avoid_time: [
      { id: 'delegate_books', text: 'Stop doing your own bookkeeping. Even cheap bookkeeping costs less than what you lose by avoiding it.' },
    ],
    debt_personal: [
      { id: 'consumer_debt', text: 'Choose a debt payoff order: smallest balance first (momentum) or highest rate first (math). Pick one and start.' },
    ],
    debt_biz_heavy: [
      { id: 'biz_debt_terms', text: 'Open every business debt statement. Write down balance, rate, and minimum payment. It\'s hard to make a plan when you haven\'t actually looked at the numbers.' },
    ],
  };

  // ---- Bands logic --------------------------------------------------------
  function bands(a) {
    let margin;
    if (a.margin === 'neg') margin = 'negative';
    else if (a.margin === 'unknown' || a.margin === '0-10') margin = 'thin';
    else margin = 'healthy';

    let runway;
    if (a.runway === 'unknown') runway = 'unknown';
    else if (a.runway === 'lt3') runway = 'short';
    else if (a.runway === '3to6') runway = 'moderate';
    else runway = 'strong';

    let c = 0;
    if (a.income_type === 'both') c += 1;
    if (a.biz_debt === 'heavy') c += 2; else if (a.biz_debt === 'some') c += 1;
    if (a.personal_debt === 'consumer') c += 1;
    if (a.books === 'yearly' || a.books === 'inconsistent') c += 1;
    const complexity = c >= 4 ? 'high' : c >= 2 ? 'medium' : 'low';

    return { margin, runway, complexity };
  }

  function tier(b) {
    if (b.margin === 'negative' || b.runway === 'short' || b.runway === 'unknown') return {
      slug: 'at_risk',
      label: 'At Risk',
      blurb: 'Some of what you marked is urgent. The encouraging part is you\'re here looking at it. The first 30 days should be about stabilizing, not optimizing.',
    };
    if (b.margin === 'thin' || b.complexity === 'high') return {
      slug: 'needs_structure',
      label: 'Needs Structure',
      blurb: 'You\'re not in trouble. You\'re in fog. With a little structure this quarter, guesswork can turn into a rhythm you can trust.',
    };
    return {
      slug: 'clear_enough',
      label: 'Clear Enough',
      blurb: 'You have a working picture of your finances. The next move is sharpening it. Small structural wins that compound.',
    };
  }

  function pickSteps(a, b) {
    const tags = [];
    if (b.margin === 'negative') tags.push('margin_negative');
    if (b.runway === 'unknown') tags.push('runway_unknown');
    if (b.runway === 'short') tags.push('runway_short');
    if (b.margin === 'thin') tags.push('margin_thin');
    if (a.books === 'inconsistent' || a.books === 'yearly') tags.push('no_books');
    if (b.complexity === 'high') tags.push('complexity_high');
    if (a.personal_debt === 'consumer') tags.push('debt_personal');
    if (a.biz_debt === 'heavy') tags.push('debt_biz_heavy');
    if (b.complexity === 'medium') tags.push('complexity_medium');
    if (a.cpa === 'no') tags.push('no_cpa');
    if (a.avoidance) tags.push('avoid_' + a.avoidance);

    const picked = [];
    const seen = new Set();
    for (const t of tags) {
      const list = recos[t] || [];
      for (const item of list) {
        if (seen.has(item.id)) continue;
        picked.push(item);
        seen.add(item.id);
        if (picked.length >= 3) return picked;
      }
    }
    return picked;
  }

  function pickChecklist(a, b) {
    const list = [];
    list.push('Open the last 3 months of bank and credit card statements. Just look. No fixing yet.');
    list.push('Write today\'s cash balance across all business and personal accounts on one piece of paper.');
    list.push('Estimate your monthly outflow (business plus personal). Round to the nearest $1,000.');
    if (a.cpa === 'no') list.push('Add "Find a CPA" as a single line item to your task list.');
    if (a.books === 'inconsistent' || a.books === 'yearly') list.push('Block 30 minutes on your calendar this month titled "Books."');
    if (b.complexity === 'high') list.push('List every account, login, and platform you touch monthly. The aim is just to know what exists.');
    list.push('Pray over what you saw. Not a performance, just an honest 60 seconds.');
    return list;
  }

  function snapshotRows(b) {
    const M = {
      healthy:  { label: 'Healthy', kind: 'good',    detail: 'Margin is supporting both household and reinvestment.' },
      thin:     { label: 'Thin',    kind: 'warn',    detail: 'Margin is real but fragile. One bad month creates pressure.' },
      negative: { label: 'Negative',kind: 'bad',     detail: 'Outflow is outrunning inflow. Stabilize before you optimize.' },
    };
    const R = {
      strong:   { label: 'Strong',  kind: 'good',    detail: '6+ months of expenses on hand.' },
      moderate: { label: 'Moderate',kind: 'neutral', detail: '3 to 6 months of cash. Not a crisis, but not enough to relax either.' },
      short:    { label: 'Short',   kind: 'bad',     detail: 'Less than 3 months of runway is a warning sign that gets worse fast.' },
      unknown:  { label: 'Unknown', kind: 'unknown', detail: 'The first job is to know.' },
    };
    const C = {
      low:      { label: 'Low',     kind: 'good',    detail: 'Few moving parts. A good season to build margin.' },
      medium:   { label: 'Medium',  kind: 'neutral', detail: 'Manageable, but a monthly rhythm is required.' },
      high:     { label: 'High',    kind: 'bad',     detail: 'Multiple debts, mixed accounts, or weak books. Simplifying is the work.' },
    };
    return [
      { label: 'Margin',     band: M[b.margin],     detail: M[b.margin].detail },
      { label: 'Runway',     band: R[b.runway],     detail: R[b.runway].detail },
      { label: 'Complexity', band: C[b.complexity], detail: C[b.complexity].detail },
    ];
  }

  // =========================================================================
  window.TOOL_CONFIG = {
    id: 'clarity-checklist',
    brand: { product: 'Financial Clarity Checklist', org: 'Ryleigh Wealth Management' },

    landing: {
      badge: 'Free 15-minute Tool',
      headline: 'Face Your Numbers Without the Shame',
      subhead: '11 questions for Christian business owners. Get a financial snapshot, your top 3 next steps, and a 15-minute checklist you can do today.',
      trustItems: ['CRPC™ Fiduciary Advisor', 'Pastor of 10+ Years', 'Built for Owners'],
      bullets: [
        'A clear snapshot of margin, runway, and complexity',
        'Your top 3 next steps, chosen for your situation',
        'A short checklist you can finish today',
        'A printable PDF emailed straight to you',
      ],
      ctaLabel: 'Start the checklist',
      fineprint: 'Email required to view results. We protect your information; unsubscribe any time.',
    },

    questions: [
      { id: 'income_type', category: 'Income', kind: 'single',
        prompt: 'How do you earn income today?',
        options: [
          { value: 'w2',   label: 'W-2 employee' },
          { value: 'biz',  label: 'Business owner' },
          { value: 'both', label: 'Both W-2 and business' },
        ] },
      { id: 'revenue', category: 'Business', kind: 'single',
        prompt: 'Annual business revenue (estimate)?',
        options: [
          { value: 'lt100k',  label: 'Under $100k' },
          { value: '100to500',label: '$100k to $500k' },
          { value: '500kto1m',label: '$500k to $1M' },
          { value: '1to3m',   label: '$1M to $3M' },
          { value: 'gt3m',    label: 'Over $3M' },
          { value: 'na',      label: 'Not applicable' },
        ] },
      { id: 'margin', category: 'Profit', kind: 'single',
        prompt: 'Approximate profit margin?',
        help: 'A best guess is fine. You don\'t need to look it up.',
        options: [
          { value: 'neg',     label: 'Negative (losing money)' },
          { value: '0-10',    label: '0 to 10%' },
          { value: '10-20',   label: '10 to 20%' },
          { value: 'gt20',    label: '20% or more' },
          { value: 'unknown', label: 'I genuinely don\'t know' },
        ] },
      { id: 'cash', category: 'Cash', kind: 'single',
        prompt: 'Cash on hand (business plus personal combined)?',
        options: [
          { value: 'lt1mo', label: 'Less than 1 month of expenses' },
          { value: '1to3',  label: '1 to 3 months' },
          { value: '3to6',  label: '3 to 6 months' },
          { value: 'gt6',   label: '6 or more months' },
          { value: 'unknown', label: 'I\'m not sure' },
        ] },
      { id: 'spending', category: 'Personal', kind: 'single',
        prompt: 'Monthly personal spending (household)?',
        options: [
          { value: 'lt5k',  label: 'Under $5k' },
          { value: '5to10', label: '$5k to $10k' },
          { value: '10to20',label: '$10k to $20k' },
          { value: 'gt20',  label: '$20k or more' },
        ] },
      { id: 'biz_debt', category: 'Debt', kind: 'single',
        prompt: 'Business debt situation?',
        options: [
          { value: 'none',  label: 'None' },
          { value: 'some',  label: 'Some, manageable' },
          { value: 'heavy', label: 'Heavy, it\'s on my mind' },
          { value: 'na',    label: 'Not applicable' },
        ] },
      { id: 'personal_debt', category: 'Debt', kind: 'single',
        prompt: 'Personal debt situation?',
        options: [
          { value: 'none',     label: 'None' },
          { value: 'mortgage', label: 'Mortgage only' },
          { value: 'consumer', label: 'Consumer debt present (credit cards, auto, etc.)' },
        ] },
      { id: 'runway', category: 'Stability', kind: 'single',
        prompt: 'How long could the business sustain a full revenue stop today?',
        help: 'Your gut answer is the right answer here.',
        options: [
          { value: 'unknown', label: 'Honestly, I don\'t know' },
          { value: 'lt3',     label: 'Less than 3 months' },
          { value: '3to6',    label: '3 to 6 months' },
          { value: 'gt6',     label: '6 or more months' },
        ] },
      { id: 'books', category: 'Bookkeeping', kind: 'single',
        prompt: 'How often are your books reconciled?',
        options: [
          { value: 'monthly',     label: 'Monthly' },
          { value: 'quarterly',   label: 'Quarterly' },
          { value: 'yearly',      label: 'Yearly (tax time)' },
          { value: 'inconsistent',label: 'Not consistently' },
        ] },
      { id: 'avoidance', category: 'Honest moment', kind: 'single',
        prompt: 'When you avoid your numbers, what\'s usually behind it?',
        options: [
          { value: 'fear',       label: 'Fear of what I\'ll find' },
          { value: 'shame',      label: 'Shame about past decisions' },
          { value: 'time',       label: 'No time' },
          { value: 'overwhelm',  label: 'Overwhelm, too many places to look' },
          { value: 'spouse',     label: 'Conflict with my spouse' },
        ] },
      { id: 'cpa', category: 'Support', kind: 'single',
        prompt: 'Do you have a CPA you trust?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no',  label: 'No' },
        ] },
    ],

    gate: {
      headline: 'Where should we send your snapshot?',
      body: 'Enter your name and email to view your personalized snapshot, top 3 next steps, and printable PDF.',
      fineprint: 'No spam. Unsubscribe any time. We never share your information.',
    },

    computeResults: function (a, ctx) {
      const b = bands(a);
      const t = tier(b);
      const steps = pickSteps(a, b);
      const checklist = pickChecklist(a, b);

      while (steps.length < 3) {
        steps.push({ id: 'monthly_close_default', text: 'Schedule a 30-minute monthly money meeting on the same date every month.' });
      }

      return {
        overline: (ctx.firstName + '\'s Snapshot').trim(),
        tierOverline: 'Your Tier',
        tierLabel: t.label,
        tierBlurb: t.blurb,
        blocks: [
          {
            kind: 'snapshot',
            title: 'Your snapshot',
            rows: snapshotRows(b),
          },
          {
            kind: 'priority-list',
            title: 'Your top 3 next steps',
            items: steps.map(s => ({ heading: s.text, body: '' })),
          },
          {
            kind: 'checklist',
            title: 'Your 15-minute checklist',
            items: checklist,
          },
        ],
        cta: {
          headshot: 'https://raw.githubusercontent.com/azoll/andrewzoll.com/main/rwm/assets/headshot.jpeg',
          headline: t.slug === 'at_risk'
            ? 'You don\'t have to figure this out alone.'
            : 'Want a second set of eyes on your snapshot?',
          body: t.slug === 'at_risk'
            ? 'A Stewardship Clarity Call is a focused conversation where we look honestly at where you stand and what it would take to move from confusion to confidence. No sales pitch.'
            : 'I help Christian business owners turn fog into a rhythm. A Stewardship Clarity Call is a focused 25 minutes on your numbers, your situation, and an honest plan.',
          label: 'Book a Stewardship Clarity Call',
          signature: 'Andrew Zoll, CRPC™',
        },
        mailchimp: {
          tagId: 'TODO_TAG_ID_LM_ClarityChecklist',
          mergeFields: {
            TIER:       t.label,
            TIER_SLUG:  t.slug,
            SMARGIN:    b.margin,
            SRUNWAY:    b.runway,
            SCOMPLEX:   b.complexity,
            AVOID_RSN:  a.avoidance || '',
            HAS_CPA:    a.cpa || '',
            TOPSTEP1:   steps[0] ? steps[0].text : '',
            TOPSTEP2:   steps[1] ? steps[1].text : '',
            TOPSTEP3:   steps[2] ? steps[2].text : '',
          },
        },
      };
    },

    mailchimp: {
      url:  'https://ryleighwm.us4.list-manage.com/subscribe/post-json',
      u:    '2eb7d0c1b3419f0b9bf268d01',
      id:   '6e456e6462',
      f_id: 'TODO_FORM_ID_ClarityChecklist',
    },

    pdf: {
      title: 'Your Financial Clarity Snapshot',
      footer: 'Ryleigh Wealth Management · ryleighwm.com',
    },

    calendly: {
      url: 'https://calendly.com/andrew-zoll/clarity-call?hide_gdpr_banner=1&primary_color=C8962E',
      title: 'Pick a time that works for you.',
      body: 'Twenty-five minutes, focused on your situation. No pressure, no sales pitch.',
    },

    faqTitle: 'Before You Book',
    faq: [
      { q: 'What does the call actually cover?',
        a: 'We\'ll talk through your snapshot, the biggest gaps you noticed, and what a next faithful step could look like for your business and family. By the end, you\'ll have a clearer picture of where you stand and whether deeper work together makes sense.' },
      { q: 'Is this a sales call?',
        a: 'No. The call is a conversation, not a pitch. If we both think working together would serve your family well, we can talk about next steps. If not, you walk away with clarity and a faithful next step you can take on your own.' },
      { q: 'Do I need to prepare anything?',
        a: 'A general knowledge of your financial position is plenty. No paperwork, no spreadsheets. Bringing your snapshot results helps but isn\'t required.' },
      { q: 'Will I be added to a list?',
        a: 'Submitting your email signs you up for occasional notes on biblical stewardship. You can unsubscribe at any time. Booking the call doesn\'t add you to anything else.' },
      { q: 'What if my spouse and I aren\'t on the same page financially?',
        a: 'More common than you\'d think. Money reveals differences in values, fears, and communication, not just math. The healthiest plans are built when husband and wife are moving in the same direction, and these conversations tend to strengthen marriages rather than strain them.' },
    ],

    disclosure: 'This assessment is for educational purposes only and does not constitute financial, tax, or legal advice. No specific investment recommendations are provided. Securities offered through Kestra Investment Services, LLC (Kestra IS), member FINRA/SIPC. Investment advisory services offered through Kestra Advisory Services, LLC (Kestra AS), an affiliate of Kestra IS. Ryleigh Wealth Management and any other entity listed herein are not affiliated with Kestra IS or Kestra AS. Ryleigh Wealth Management does not offer tax or legal advice. Investor Disclosures: <a href="https://www.kestrafinancial.com/disclosures" target="_blank" rel="noopener">https://www.kestrafinancial.com/disclosures</a>',
  };
})();
