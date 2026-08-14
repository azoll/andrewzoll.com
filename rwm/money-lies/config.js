/* =========================================================================
   Tool 2. Money Lies + Generosity Framework
   No scoring math: the user's selections are the result.
   ========================================================================= */
(function () {
  'use strict';

  // ---- Lie library --------------------------------------------------------
  const LIES = {
    greed: {
      slug: 'greed',
      statement: 'If I pursue more profit, I\'m being greedy.',
      scriptureRef: 'Proverbs 13:11',
      reframe: 'Profit earned by serving people well isn\'t greed. It\'s the fruit of stewardship. Greed is a posture toward money, not the presence of it. The real question is who profit is for, not whether you have it.',
      action: 'Write down one specific way your business profit serves people other than you.',
    },
    guilt_wealth: {
      slug: 'guilt_wealth',
      statement: 'If I\'m wealthy, I should feel guilty.',
      scriptureRef: '1 Timothy 6:17–19',
      reframe: 'Scripture doesn\'t tell wealthy believers to feel bad. It tells them not to be arrogant, to put hope in God rather than money, and to be rich in good deeds. The assignment is stewardship, not guilt.',
      action: 'Replace one guilty thought this week with a concrete act of generosity, however small.',
    },
    prefer_broke: {
      slug: 'prefer_broke',
      statement: 'God prefers me to be broke.',
      scriptureRef: 'Deuteronomy 8:18',
      reframe: 'God doesn\'t prefer your scarcity. He prefers your dependence. Those aren\'t the same thing. Plenty of wealthy believers in Scripture stayed faithful, and plenty of broke ones didn\'t.',
      action: 'Name one gift God has actually given you, financial or otherwise, and thank Him out loud today.',
    },
    not_yet: {
      slug: 'not_yet',
      statement: 'I can\'t be generous until I\'m "set."',
      scriptureRef: '2 Corinthians 8:1–4',
      reframe: 'The most generous people in the New Testament were poor. Generosity tends to be a habit you build, not a milestone you cross. If you can\'t give a little now, you probably won\'t give a lot later. You\'ll just have more reasons.',
      action: 'Set up one recurring gift this week, even if it\'s small. Build the rhythm before the amount.',
    },
    worldly: {
      slug: 'worldly',
      statement: 'Wanting a bigger business is worldly.',
      scriptureRef: 'Matthew 25:14–30',
      reframe: 'In Jesus\' parable, the servants who multiplied what they were given were commended. Worldly ambition serves you. Faithful ambition serves people through you. Same fire, different aim.',
      action: 'Write a one-sentence growth goal that names who it serves, not just how big it gets.',
    },
    enjoy: {
      slug: 'enjoy',
      statement: 'If I enjoy money, I\'m compromising.',
      scriptureRef: '1 Timothy 6:17',
      reframe: 'Paul says God "richly provides everything for our enjoyment." Enjoyment isn\'t the compromise. Hoarding is. Joy isn\'t. Self-medication is. Part of the work is learning to tell those apart.',
      action: 'Pick one good thing your money has provided and savor it without apologizing this week.',
    },
    corrupt: {
      slug: 'corrupt',
      statement: 'Wealth always corrupts.',
      scriptureRef: '1 Timothy 6:10',
      reframe: 'The verse is "the love of money is a root of all kinds of evil," not "money is." Money tends to amplify what\'s already there. It makes you more of who you already are. Character is the variable.',
      action: 'Write down one character trait that money has tested in you. Pray about that one specifically.',
    },
    give_hurt: {
      slug: 'give_hurt',
      statement: 'I should give until it hurts, even if it destabilizes my household.',
      scriptureRef: '1 Timothy 5:8',
      reframe: 'Provision for your household isn\'t the opposite of generosity. Scripture treats it as a prerequisite. Giving that destabilizes the people you owe isn\'t faith. It\'s often guilt wearing a faith costume.',
      action: 'Write down a stable percentage you can give consistently without destabilizing your home, then keep that promise.',
    },
    fix_others: {
      slug: 'fix_others',
      statement: 'I\'m responsible to fix everyone\'s problems financially.',
      scriptureRef: 'Galatians 6:2,5',
      reframe: 'Paul holds two truths together: bear one another\'s burdens, and each person carry his own load. Some financial requests are burdens to share. Others are loads that belong to someone else. Telling the difference is part of the work.',
      action: 'Before your next giving decision, write one sentence on whether this is a burden to share or a load to respect.',
    },
  };

  // ---- Generosity framework (lightly tailored by giving answer) ----------
  function generosityFramework(giving) {
    const provideLine = 'Stabilize your household first. Generosity that destabilizes the people you owe isn\'t the assignment.';
    const saveLine = 'Build margin so generosity can scale. A few months of buffer turns giving from anxious to consistent.';
    let giveLine;
    switch (giving) {
      case 'none':
        giveLine = 'Start with consistent before heroic. A small recurring gift this month builds something you can\'t build any other way.';
        break;
      case 'sporadic':
        giveLine = 'Move from sporadic to steady. Pick a percentage, even a small one, and automate it before you optimize it.';
        break;
      case 'consistent':
        giveLine = 'You have the rhythm. The next question is who one specific gift could change this year.';
        break;
      case 'strategic':
        giveLine = 'You\'re past rhythm and into strategy. A giving fund or DAF is worth considering if you don\'t already have one.';
        break;
      default:
        giveLine = 'Start with consistent before heroic. Build the rhythm, then scale the amount.';
    }
    return [
      'Provide. ' + provideLine,
      'Save. ' + saveLine,
      'Give. ' + giveLine,
    ];
  }

  function buildPairedItems(selectedLies) {
    return selectedLies
      .map(slug => LIES[slug])
      .filter(Boolean)
      .map(L => ({
        heading: L.statement,
        scriptureRef: L.scriptureRef,
        reframe: L.reframe,
        action: L.action,
      }));
  }

  // =========================================================================
  window.TOOL_CONFIG = {
    id: 'money-lies',
    brand: { product: 'Money Lies + Generosity Framework', org: 'Ryleigh Wealth Management' },

    landing: {
      badge: 'Free 7-minute Tool',
      headline: 'Which Money Beliefs Are Quietly Running You?',
      subhead: 'Pick the statements that sound like you. Get a biblical reframe for each, plus a generosity framework you can actually live by.',
      trustItems: ['CRPC™ Fiduciary Advisor', 'Pastor of 10+ Years', 'For Christian Households'],
      bullets: [
        'Identify the 3 money lies you\'ve quietly believed',
        'A scripture anchor and pastoral reframe for each',
        'One practical action per lie, small enough to actually do',
        'A stability-first generosity framework you can keep',
      ],
      ctaLabel: 'Start the diagnostic',
      fineprint: 'Email required to view your results. We protect your information; unsubscribe any time.',
    },

    questions: [
      { id: 'lies', category: 'Money Beliefs', kind: 'multi-capped', maxSelections: 3,
        prompt: 'Which of these have you quietly believed? Pick up to 3.',
        help: 'Choose the ones that sting a little when you read them. Honesty here is the whole point.',
        options: [
          { value: 'greed',         label: 'If I pursue more profit, I\'m being greedy.' },
          { value: 'guilt_wealth',  label: 'If I\'m wealthy, I should feel guilty.' },
          { value: 'prefer_broke',  label: 'God prefers me to be broke.' },
          { value: 'not_yet',       label: 'I can\'t be generous until I\'m "set."' },
          { value: 'worldly',       label: 'Wanting a bigger business is worldly.' },
          { value: 'enjoy',         label: 'If I enjoy money, I\'m compromising.' },
          { value: 'corrupt',       label: 'Wealth always corrupts.' },
          { value: 'give_hurt',     label: 'I should give until it hurts, even if it destabilizes my household.' },
          { value: 'fix_others',    label: 'I\'m responsible to fix everyone\'s problems financially.' },
        ] },
      { id: 'giving', category: 'Today', kind: 'single',
        prompt: 'Which best describes your current giving pattern?',
        options: [
          { value: 'none',       label: 'Not really giving right now' },
          { value: 'sporadic',   label: 'Sporadic, when I think of it' },
          { value: 'consistent', label: 'Consistent percentage' },
          { value: 'strategic',  label: 'Strategic and planned' },
        ] },
      { id: 'emotion', category: 'Today', kind: 'single',
        prompt: 'When you think about money, the loudest emotion is…',
        options: [
          { value: 'guilt',     label: 'Guilt' },
          { value: 'fear',      label: 'Fear' },
          { value: 'pressure',  label: 'Pressure' },
          { value: 'confusion', label: 'Confusion' },
          { value: 'peace',     label: 'Peace' },
        ] },
      { id: 'want', category: 'Direction', kind: 'single',
        prompt: 'What do you most want money to bring you in this season?',
        options: [
          { value: 'clarity',    label: 'Clarity' },
          { value: 'generosity', label: 'Generosity' },
          { value: 'growth',     label: 'Growth' },
          { value: 'simplicity', label: 'Simplicity' },
        ] },
    ],

    gate: {
      headline: 'Where should we send your reframes?',
      body: 'Enter your name and email to view the reframes and download a printable PDF.',
      fineprint: 'No spam. Unsubscribe any time. We never share your information.',
    },

    computeResults: function (a, ctx) {
      const lies = a.lies || [];
      const items = buildPairedItems(lies);
      const lead = lies[0] || '';
      const framework = generosityFramework(a.giving);

      const tierLabel = lies.length === 1
        ? 'One lie named'
        : (lies.length === 2 ? 'Two lies named' : 'Three lies named');
      const tierBlurb = 'You named these out loud. That\'s the move most people skip. The reframes below aren\'t a fix. They\'re a beginning.';

      const blocks = [];
      if (items.length) {
        blocks.push({
          kind: 'paired-list',
          title: 'Reframes for what you named',
          items: items,
        });
      }
      blocks.push({
        kind: 'checklist',
        title: 'Generosity Framework: Provide, Save, Give',
        items: framework,
      });

      const lieField = i => (lies[i] && LIES[lies[i]]) ? LIES[lies[i]].statement : '';
      const actField = i => (lies[i] && LIES[lies[i]]) ? LIES[lies[i]].action    : '';

      return {
        overline: (ctx.firstName + '\'s Reframes').trim(),
        tierOverline: 'What You Named',
        tierLabel: tierLabel,
        tierBlurb: tierBlurb,
        blocks: blocks,
        cta: {
          headshot: 'https://raw.githubusercontent.com/azoll/andrewzoll.com/main/rwm/assets/headshot.jpeg',
          headline: 'Want to talk this through with someone who gets it?',
          body: 'I\'m a CRPC™ fiduciary advisor and a pastor of 10+ years. A Stewardship Clarity Call is a focused 25 minutes on your beliefs, your money, and your real questions. No sales pitch.',
          label: 'Book a Stewardship Clarity Call',
          signature: 'Andrew Zoll, CRPC™',
        },
        mailchimp: {
          tagId: 'TODO_TAG_ID_LM_MoneyLies',
          mergeFields: {
            LIE1_SLUG: lies[0] || '',
            LIE2_SLUG: lies[1] || '',
            LIE3_SLUG: lies[2] || '',
            LEAD_LIE:  lead,
            LIE1:      lieField(0),
            LIE2:      lieField(1),
            LIE3:      lieField(2),
            ACTION1:   actField(0),
            ACTION2:   actField(1),
            ACTION3:   actField(2),
            GIVING:    a.giving || '',
            EMOTION:   a.emotion || '',
            WANT:      a.want || '',
          },
        },
      };
    },

    mailchimp: {
      url:  'https://ryleighwm.us4.list-manage.com/subscribe/post-json',
      u:    '2eb7d0c1b3419f0b9bf268d01',
      id:   '6e456e6462',
      f_id: 'TODO_FORM_ID_MoneyLies',
    },

    pdf: {
      title: 'Money Lies + Generosity Framework',
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
        a: 'We\'ll talk through the lies you named, the reframes that landed, and what a next faithful step could look like for your family. By the end, you\'ll have a clearer picture of where the work is and whether deeper conversation makes sense.' },
      { q: 'Is this a sales call?',
        a: 'No. The call is a conversation, not a pitch. If we both think working together would serve your family well, we can talk about next steps. If not, you walk away with clarity and a next step you can take on your own.' },
      { q: 'I\'m not sure if I want financial advice. I just wanted the reframes.',
        a: 'Totally fine. The reframes are yours to keep. The call is for people who want to think out loud about money with someone who shares the underlying convictions.' },
      { q: 'Will I be added to a list?',
        a: 'Submitting your email signs you up for occasional notes on biblical stewardship. You can unsubscribe at any time. Booking the call doesn\'t add you to anything else.' },
      { q: 'What if my spouse and I aren\'t on the same page financially?',
        a: 'More common than you\'d think. Money reveals differences in values, fears, and communication, not just math. These conversations tend to strengthen marriages rather than strain them.' },
    ],

    disclosure: 'This tool is for educational purposes only and does not constitute financial, tax, or legal advice. No specific investment recommendations are provided. Securities offered through Kestra Investment Services, LLC (Kestra IS), member FINRA/SIPC. Investment advisory services offered through Kestra Advisory Services, LLC (Kestra AS), an affiliate of Kestra IS. Ryleigh Wealth Management and any other entity listed herein are not affiliated with Kestra IS or Kestra AS. Ryleigh Wealth Management does not offer tax or legal advice. Investor Disclosures: <a href="https://www.kestrafinancial.com/disclosures" target="_blank" rel="noopener">https://www.kestrafinancial.com/disclosures</a>',
  };
})();
