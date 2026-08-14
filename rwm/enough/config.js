/* =========================================================================
   Tool 4. How Much Is Enough? (Sufficiency & Peace)
   Three statuses, all of which deliver real content. No "Unclear" dead end.
   ========================================================================= */
(function () {
  'use strict';

  const ASSET_MID = { lt250: 125, '250to1m': 625, '1to3m': 2000, gt3m: 4000 };
  const SPEND_MID = { lt60: 45, '60to100': 80, '100to200': 150, gt200: 275 };

  function ratioBand(assetsKey, spendKey) {
    const a = ASSET_MID[assetsKey];
    const s = SPEND_MID[spendKey];
    if (!a || !s) return 'mid';
    const years = a / s;
    if (years >= 28) return 'high';
    if (years >= 16) return 'mid';
    return 'low';
  }

  function flexScore(a) {
    return (a.flex_cut === 'yes' ? 1 : 0) + (a.flex_work === 'yes' ? 1 : 0);
  }

  function status(a) {
    const ratio = ratioBand(a.assets, a.spending);
    const grow = a.savings_rate === '20plus' ? 1 : a.savings_rate === '10to20' ? 0 : -1;
    const drag = a.lifestyle === 'higher' ? -1 : a.lifestyle === 'lower' ? 1 : 0;
    const horizon = a.horizon;

    if (horizon === 'retired' && ratio === 'low') return tierMore();
    if (horizon === 'retired' && ratio === 'high') return tierLikely();

    if (ratio === 'high' && grow >= 0 && drag >= 0) return tierLikely();
    if (ratio === 'low' && grow < 0) return tierMore();
    if (ratio === 'low' && grow >= 0 && (horizon === '10to20' || horizon === 'gt20')) return tierClose();
    if (ratio === 'mid' && grow >= 0 && (horizon !== 'lt5')) return tierClose();
    if (ratio === 'high' && (drag < 0 || grow < 0)) return tierClose();

    if (ratio === 'high') return tierClose();
    if (ratio === 'mid') return tierClose();
    return tierMore();
  }

  function tierLikely() {
    return {
      slug: 'likely_enough',
      label: 'Likely Enough',
      blurb: 'Based on what you told us, your assets and habits are tracking toward sufficiency. The work now is protecting what you\'ve built and not undoing it.',
    };
  }
  function tierClose() {
    return {
      slug: 'close_tightening',
      label: 'Close. Tightening Gets You There.',
      blurb: 'You\'re inside the zip code. A few specific tightenings, none of them heroic, can meaningfully change your trajectory.',
    };
  }
  function tierMore() {
    return {
      slug: 'more_distance',
      label: 'More Distance to Cover',
      blurb: 'The honest answer is you have ground to make up. The encouraging part is the levers are real and they work, especially if you start now.',
    };
  }

  function buildDrivers(a, s) {
    const out = [];
    const ratio = ratioBand(a.assets, a.spending);

    if (s.slug === 'likely_enough') {
      if (ratio === 'high') out.push({ heading: 'Asset base is strong relative to your spending.', body: 'Your investable assets, divided by current spending, sit comfortably above common sufficiency thresholds.' });
      if (a.savings_rate === '20plus') out.push({ heading: 'You\'re still adding meaningfully.', body: 'A 20%+ savings rate means even a "good enough" portfolio will keep compounding ahead of inflation.' });
      if (a.lifestyle !== 'higher') out.push({ heading: 'Lifestyle expectations are aligned.', body: 'You\'re not assuming a step-up in retirement spending, which is the most common reason "enough" stops being enough.' });
      if (a.debt === 'none' || a.debt === 'mortgage') out.push({ heading: 'Debt isn\'t pulling against you.', body: 'No consumer debt means more of every future dollar compounds for you, not for the lender.' });
    } else if (s.slug === 'close_tightening') {
      if (ratio === 'mid') out.push({ heading: 'Assets are in the middle band.', body: 'You\'re not far behind, but you\'re also not yet far enough ahead to coast. Small course corrections matter here.' });
      if (a.lifestyle === 'higher') out.push({ heading: 'Higher-lifestyle goal stretches the math.', body: 'Wanting a step-up in retirement spending makes the same assets work less hard. It\'s worth naming that out loud.' });
      if (a.savings_rate === 'lt10' || a.savings_rate === 'none') out.push({ heading: 'Savings rate is the easiest lever you\'re not pulling.', body: 'Even a 5-percentage-point increase compounds dramatically over 10+ years.' });
      if (a.debt === 'consumer') out.push({ heading: 'Consumer debt is leaking compounding.', body: 'High-rate debt is a guaranteed negative return. Eliminating it is one of the cleanest financial wins available.' });
    } else {
      if (ratio === 'low') out.push({ heading: 'Asset base needs to grow.', body: 'Given your current spending, your investable assets cover fewer years than typical sufficiency targets.' });
      if (a.savings_rate === 'none' || a.savings_rate === 'lt10') out.push({ heading: 'Savings rate is too low for your horizon.', body: 'At the current pace, the math doesn\'t bend. The fastest fix is increasing the savings rate by 5 to 10 percentage points.' });
      if (a.lifestyle === 'higher') out.push({ heading: 'Higher-lifestyle goal raises the bar.', body: 'A step-up in spending in retirement requires a meaningful step-up in assets. It\'s worth questioning whether the goal is what you actually want.' });
      if (a.debt === 'consumer') out.push({ heading: 'Consumer debt is a near-term anchor.', body: 'Eliminating high-rate debt converts a guaranteed loss into freed-up monthly cashflow.' });
    }
    return out.slice(0, 3);
  }

  function buildGuardrails(a, s) {
    const out = [];
    if (a.fear === 'market' || a.horizon === 'lt5' || a.horizon === 'retired') {
      out.push('Hold 18 to 24 months of essential spending in cash equivalents, not invested. This is sequence-of-returns insurance.');
    } else {
      out.push('Hold 6 to 12 months of essential spending in cash. Replenish before any market downturn forces a withdrawal.');
    }
    if (s.slug === 'more_distance' || a.lifestyle === 'higher') {
      out.push('Cap discretionary spending at 30% of essentials until your assets and savings rate close the gap.');
    } else if (a.fear === 'inflation') {
      out.push('Keep essential spending under 50% of total spending so inflation can be absorbed without panic.');
    } else if (a.fear === 'healthcare') {
      out.push('Set aside an HSA or healthcare-dedicated account explicitly. Don\'t blend healthcare into general retirement assets.');
    } else if (a.fear === 'longevity') {
      out.push('Plan to age 95 in any modeling. Outliving a plan built for 85 is a crisis. The reverse is just leftover.');
    } else if (a.fear === 'taxes') {
      out.push('Diversify across tax-treatment buckets (taxable, tax-deferred, Roth). Tax flexibility is its own form of safety.');
    } else {
      out.push('Set automatic rebalancing at fixed thresholds. Rebalance based on math, not based on news.');
    }
    return out.slice(0, 2);
  }

  function buildActions(a, s) {
    const out = [];
    if (s.slug === 'likely_enough') {
      out.push({ heading: 'Confirm the math with a personal model.', body: 'A coarse quiz gives you direction. A real plan accounts for taxes, sequence risk, and your specific accounts. Worth doing once.' });
      if (a.lifestyle !== 'higher') {
        out.push({ heading: 'Consider whether to spend more, give more, or both.', body: 'Sufficiency makes "what next" the real question. Most people leave both intentions on the table.' });
      } else {
        out.push({ heading: 'Stress-test the higher-lifestyle assumption.', body: 'A higher-lifestyle retirement is doable from a strong base, but it should be a deliberate plan, not a drift.' });
      }
    } else if (s.slug === 'close_tightening') {
      if (a.savings_rate === 'none' || a.savings_rate === 'lt10') {
        out.push({ heading: 'Increase your savings rate by 5 percentage points within 60 days.', body: 'When you\'re close, this is one of the highest-leverage moves available. Automate it on payday so you don\'t have to revisit the decision.' });
      } else if (a.lifestyle === 'higher') {
        out.push({ heading: 'Re-examine the lifestyle target, or fund the gap.', body: 'Either right-size the goal or add the savings (or working years) needed to fund it. Both are valid choices. Drift isn\'t.' });
      } else {
        out.push({ heading: 'Tighten one specific spending category.', body: 'Pick the category most disproportionate to its joy. Cut it by 25%. Redirect that money to investments automatically.' });
      }
      out.push({ heading: 'Build a one-page personal plan with an advisor.', body: 'You\'re close enough that the difference between making it and not making it is execution detail. A plan removes the drift.' });
    } else {
      if (a.debt === 'consumer') {
        out.push({ heading: 'Eliminate consumer debt before increasing investing.', body: 'High-rate debt is a guaranteed negative return. Knocking it out is mathematically and emotionally the right starting point.' });
      } else {
        out.push({ heading: 'Increase your savings rate and lock it in automatically.', body: 'Even 5 percentage points changes the math materially. Automate the increase so willpower isn\'t the gating factor.' });
      }
      out.push({ heading: 'Schedule a planning conversation this month.', body: 'When the gap is real, getting honest counsel and a written plan is the move. Not next year. This month.' });
    }
    return out.slice(0, 2);
  }

  // =========================================================================
  window.TOOL_CONFIG = {
    id: 'enough',
    brand: { product: 'How Much Is Enough?', org: 'Ryleigh Wealth Management' },

    landing: {
      badge: 'Free 8-minute Tool',
      headline: 'When Can I Stop Worrying About Money?',
      subhead: 'A 10-question read on whether you\'re tracking toward "enough." Coarse but honest, with specific guardrails and next actions either way.',
      trustItems: ['CRPC™ Fiduciary Advisor', 'Pastor of 10+ Years', 'Honest, Not Salesy'],
      bullets: [
        'A directional read on your sufficiency, in plain language',
        'Two or three specific drivers for what\'s pushing the result',
        'Guardrails tailored to your biggest fear',
        'Two next actions you can start this week',
      ],
      ctaLabel: 'Start the calculator',
      fineprint: 'Email required to view your results. We protect your information; unsubscribe any time.',
    },

    questions: [
      { id: 'age', category: 'You', kind: 'single',
        prompt: 'Age range?',
        options: [
          { value: 'lt40', label: 'Under 40' },
          { value: '40to50', label: '40 to 50' },
          { value: '50to60', label: '50 to 60' },
          { value: '60to70', label: '60 to 70' },
          { value: 'gt70',   label: '70+' },
        ] },
      { id: 'horizon', category: 'Time', kind: 'single',
        prompt: 'Years to retirement?',
        options: [
          { value: 'lt5',    label: 'Less than 5' },
          { value: '5to10',  label: '5 to 10' },
          { value: '10to20', label: '10 to 20' },
          { value: 'gt20',   label: '20 or more' },
          { value: 'retired',label: 'Already retired' },
        ] },
      { id: 'spending', category: 'Spending', kind: 'single',
        prompt: 'Annual household spending today?',
        help: 'Total, not just essentials.',
        options: [
          { value: 'lt60',     label: 'Under $60k' },
          { value: '60to100',  label: '$60k to $100k' },
          { value: '100to200', label: '$100k to $200k' },
          { value: 'gt200',    label: '$200k or more' },
        ] },
      { id: 'lifestyle', category: 'Spending', kind: 'single',
        prompt: 'Desired retirement lifestyle vs. today?',
        options: [
          { value: 'lower',  label: 'Lower spending' },
          { value: 'same',   label: 'About the same' },
          { value: 'higher', label: 'Higher spending' },
        ] },
      { id: 'assets', category: 'Assets', kind: 'single',
        prompt: 'Investable assets (retirement, brokerage, cash)?',
        help: 'Exclude home equity. A best estimate is fine.',
        options: [
          { value: 'lt250',   label: 'Under $250k' },
          { value: '250to1m', label: '$250k to $1M' },
          { value: '1to3m',   label: '$1M to $3M' },
          { value: 'gt3m',    label: '$3M or more' },
        ] },
      { id: 'savings_rate', category: 'Savings', kind: 'single',
        prompt: 'Annual savings rate (% of gross income saved or invested)?',
        options: [
          { value: 'none',    label: 'Not actively saving' },
          { value: 'lt10',    label: 'Under 10%' },
          { value: '10to20',  label: '10 to 20%' },
          { value: '20plus',  label: '20% or more' },
        ] },
      { id: 'fear', category: 'Worry', kind: 'single',
        prompt: 'When you worry about money, what\'s usually the fear?',
        options: [
          { value: 'market',     label: 'A market drop' },
          { value: 'inflation',  label: 'Inflation' },
          { value: 'healthcare', label: 'Healthcare costs' },
          { value: 'longevity',  label: 'Outliving the money' },
          { value: 'taxes',      label: 'Taxes' },
        ] },
      { id: 'debt', category: 'Debt', kind: 'single',
        prompt: 'Debt situation?',
        options: [
          { value: 'none',     label: 'None' },
          { value: 'mortgage', label: 'Mortgage only' },
          { value: 'consumer', label: 'Consumer debt present' },
        ] },
      { id: 'flex_cut', category: 'Flexibility', kind: 'single',
        prompt: 'Willing to cut spending in a downturn?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no',  label: 'No' },
        ] },
      { id: 'flex_work', category: 'Flexibility', kind: 'single',
        prompt: 'Willing to work part-time longer if needed?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no',  label: 'No' },
        ] },
    ],

    gate: {
      headline: 'Where should we send your read?',
      body: 'Enter your name and email to view your sufficiency status, drivers, guardrails, and a printable PDF.',
      fineprint: 'No spam. Unsubscribe any time. We never share your information.',
    },

    computeResults: function (a, ctx) {
      const s = status(a);
      const drivers = buildDrivers(a, s);
      const guardrails = buildGuardrails(a, s);
      const actions = buildActions(a, s);

      const blocks = [
        {
          kind: 'priority-list',
          title: 'What\'s driving this',
          items: drivers,
        },
        {
          kind: 'checklist',
          title: 'Your guardrails',
          items: guardrails,
        },
        {
          kind: 'priority-list',
          title: 'Two next actions',
          items: actions,
        },
      ];

      const ctaCopy = (function () {
        if (s.slug === 'likely_enough') return {
          headline: 'Worth confirming with a real model.',
          body: 'A coarse read is a starting point. A 30-minute conversation can confirm whether the math actually holds for your specific accounts, taxes, and timeline.',
        };
        if (s.slug === 'close_tightening') return {
          headline: 'A real plan closes the gap fast.',
          body: 'When you\'re this close, execution is everything. A 30-minute conversation turns "tightening gets you there" into specific dollars and dates.',
        };
        return {
          headline: 'Don\'t carry this alone.',
          body: 'When the gap is real, a written plan is the difference between drift and momentum. Let\'s talk through what could actually change your trajectory.',
        };
      })();

      return {
        overline: (ctx.firstName + '\'s Read').trim(),
        tierOverline: 'Your Status',
        tierLabel: s.label,
        tierBlurb: s.blurb,
        blocks: blocks,
        cta: {
          headshot: 'https://raw.githubusercontent.com/azoll/andrewzoll.com/main/rwm/assets/headshot.jpeg',
          headline: ctaCopy.headline,
          body: ctaCopy.body,
          label: 'Book a Stewardship Clarity Call',
          signature: 'Andrew Zoll, CRPC™',
        },
        disclosure: 'This is an educational overview, not financial advice. A directional read like this can\'t replace personal modeling that accounts for taxes, sequence risk, and your specific accounts. Use it as a starting point.',
        mailchimp: {
          tagId: 'TODO_TAG_ID_LM_Enough',
          mergeFields: {
            STATUS_SLUG: s.slug,
            STATUS:      s.label,
            DRIVER1:     drivers[0] ? drivers[0].heading : '',
            DRIVER2:     drivers[1] ? drivers[1].heading : '',
            DRIVER3:     drivers[2] ? drivers[2].heading : '',
            GUARD1:      guardrails[0] || '',
            GUARD2:      guardrails[1] || '',
            NEXT1:       actions[0] ? actions[0].heading : '',
            NEXT2:       actions[1] ? actions[1].heading : '',
            FEAR:        a.fear || '',
            HORIZON:     a.horizon || '',
            FLEX_SCORE:  String(flexScore(a)),
          },
        },
      };
    },

    mailchimp: {
      url:  'https://ryleighwm.us4.list-manage.com/subscribe/post-json',
      u:    '2eb7d0c1b3419f0b9bf268d01',
      id:   '6e456e6462',
      f_id: 'TODO_FORM_ID_Enough',
    },

    pdf: {
      title: 'How Much Is Enough? Your Read',
      footer: 'Ryleigh Wealth Management · ryleighwm.com',
      disclosure: 'This is an educational overview, not financial advice. A directional read like this can\'t replace personal modeling that accounts for taxes, sequence risk, and your specific accounts.',
    },

    calendly: {
      url: 'https://calendly.com/andrew-zoll/clarity-call?hide_gdpr_banner=1&primary_color=C8962E',
      title: 'Pick a time that works for you.',
      body: 'Twenty-five minutes, focused on your situation. No pressure, no sales pitch.',
    },

    faqTitle: 'Before You Book',
    faq: [
      { q: 'What does the call actually cover?',
        a: 'We\'ll talk through your status, the drivers that landed for you, and what a next faithful step could look like. The honest answer to "how much is enough" requires real modeling. A 25-minute call helps you decide whether that work is worth doing now.' },
      { q: 'Is this a sales call?',
        a: 'No. The call is a conversation, not a pitch. If we both think working together would serve your family well, we can talk about next steps. If not, you walk away with clarity and a next step you can take on your own.' },
      { q: 'My result said "More Distance to Cover." Should I still book?',
        a: 'Especially then. Distance is closeable, but the gap rarely closes by accident. A 25-minute call helps name the specific moves that matter most for your situation.' },
      { q: 'Do I need to prepare anything?',
        a: 'A general knowledge of your financial position is plenty. No paperwork, no spreadsheets. Bringing your read results helps but isn\'t required.' },
      { q: 'What if my spouse and I aren\'t on the same page financially?',
        a: 'More common than you\'d think. Sufficiency questions touch values and fears as much as math. These conversations tend to strengthen marriages rather than strain them.' },
    ],

    disclosure: 'This tool is for educational purposes only and does not constitute financial, tax, or legal advice. A directional read like this cannot replace personal modeling that accounts for taxes, sequence risk, and your specific accounts. No specific investment recommendations are provided. Securities offered through Kestra Investment Services, LLC (Kestra IS), member FINRA/SIPC. Investment advisory services offered through Kestra Advisory Services, LLC (Kestra AS), an affiliate of Kestra IS. Ryleigh Wealth Management and any other entity listed herein are not affiliated with Kestra IS or Kestra AS. Ryleigh Wealth Management does not offer tax or legal advice. Investor Disclosures: <a href="https://www.kestrafinancial.com/disclosures" target="_blank" rel="noopener">https://www.kestrafinancial.com/disclosures</a>',
  };
})();
