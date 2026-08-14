/* =========================================================================
   Tool 3. Stewardship Plan Builder
   Maps priorities + constraints to one of 6 plan profiles, then renders
   focus + 3 moves + 30/60/90 checklists.
   ========================================================================= */
(function () {
  'use strict';

  // ---- Profile library ----------------------------------------------------
  const PROFILES = {
    stabilize_simplify: {
      slug: 'stabilize_simplify',
      label: 'Stabilize & Simplify',
      focus: 'Your money is fine. It\'s scattered. The win this quarter is one place to look and one rhythm to keep.',
      moves: [
        'Consolidate to one primary checking, one savings, one brokerage. Close the rest.',
        'Set a 30-minute monthly money meeting on the same date each month, and protect it.',
        'List every recurring subscription. Cut anything you haven\'t used in the last 30 days.',
      ],
      day30: [
        'Inventory every account, login, and recurring charge in a single document.',
        'Cancel 3 subscriptions you don\'t actively use.',
        'Schedule the first monthly money meeting and put it on the calendar.',
      ],
      day60: [
        'Close or roll one redundant account.',
        'Set up automatic transfer to savings on payday.',
        'Move all logins into a password manager.',
      ],
      day90: [
        'Run a full monthly close (statements, P&L glance, top 3 questions).',
        'Compare net worth against your day 0 baseline.',
        'Choose one task to delegate next quarter.',
      ],
    },
    protect_provide: {
      slug: 'protect_provide',
      label: 'Protect & Provide',
      focus: 'You\'re building, but the protections are thin. Closing a few specific gaps changes the risk profile fast.',
      moves: [
        'Close the most obvious insurance gap (term life, disability, or umbrella) within 30 days.',
        'Confirm beneficiary designations on every account. Wrong beneficiaries override your will.',
        'Build toward a 6-month emergency fund if you don\'t already have one.',
      ],
      day30: [
        'Pull current life and disability coverage amounts and compare to a 10–15× income guideline.',
        'Audit beneficiaries on every retirement and life policy.',
        'Open a high-yield savings account labeled "Emergency."',
      ],
      day60: [
        'Get one term life quote (if needed) and one disability quote.',
        'Draft or refresh basic estate documents (will, healthcare directive, POA).',
        'Confirm umbrella liability coverage matches your net worth.',
      ],
      day90: [
        'Bind any insurance policies you decided to add.',
        'Store estate docs where your spouse can find them.',
        'Set a calendar reminder to re-audit coverage annually.',
      ],
    },
    taxes_growth: {
      slug: 'taxes_growth',
      label: 'Taxes & Growth',
      focus: 'You\'re past survival. The leverage now is tax-aware investing and a retirement plan that can carry weight.',
      moves: [
        'Maximize the tax-advantaged contributions you\'re leaving on the table this year.',
        'Decide on a target asset allocation in writing, and stop drifting from it.',
        'Schedule a tax-planning conversation before year-end, not after.',
      ],
      day30: [
        'List every retirement and tax-advantaged account, with current contribution rate.',
        'Increase 401(k)/SEP/IRA contribution by one step.',
        'Pick a target asset allocation and write it down.',
      ],
      day60: [
        'Review investment fees and consolidate where it costs nothing.',
        'Run a rough estimate of this year\'s taxable income.',
        'Identify one tax move (Roth, donor-advised fund, HSA) to act on by year-end.',
      ],
      day90: [
        'Rebalance to your target allocation if drift exceeds 5%.',
        'Hold the year-end tax conversation with your CPA.',
        'Set automatic contribution increases for next year.',
      ],
    },
    legacy_builder: {
      slug: 'legacy_builder',
      label: 'Legacy Builder',
      focus: 'You have enough. The next chapter is intent. What stays, what gets passed on, what gets multiplied.',
      moves: [
        'Define your "enough" number in writing. What you actually need, not what you could spend.',
        'Set a written giving plan (annual or DAF) that scales with returns.',
        'Begin estate conversations with the people they affect.',
      ],
      day30: [
        'Write one paragraph on what legacy means to you and your spouse.',
        'List the people, organizations, and causes you want to fund. Keep it short.',
        'Pull the current estate document set and check freshness.',
      ],
      day60: [
        'Open or contribute to a donor-advised fund or charitable account.',
        'Update beneficiaries to match your written intent.',
        'Hold one conversation with adult children about values, before about money.',
      ],
      day90: [
        'Refresh estate docs with an attorney if anything is older than 5 years.',
        'Write a one-page "letter of intent" describing the values behind the plan.',
        'Schedule the next legacy review (annually or semi-annually).',
      ],
    },
    debt_liberation: {
      slug: 'debt_liberation',
      label: 'Debt Liberation',
      focus: 'You\'re not dumb. You\'re stuck. The plan now is one method, sustained, until momentum is real.',
      moves: [
        'Pick one payoff method (smallest balance first or highest rate first) and commit. Don\'t toggle between them.',
        'Identify your monthly above-minimum payoff number and automate it.',
        'Stop using any account that creates new consumer debt this quarter.',
      ],
      day30: [
        'List every debt: balance, rate, minimum payment, due date.',
        'Choose your method (snowball or avalanche) in writing.',
        'Cut one expense to fund the first $200/month above minimums.',
      ],
      day60: [
        'Make the first above-minimum payment automatic on payday.',
        'Negotiate one rate down if possible (call your card company and ask).',
        'Track payoff progress visibly (whiteboard, app, spreadsheet).',
      ],
      day90: [
        'Eliminate or close the first debt. Celebrate it. Don\'t skip this.',
        'Roll its payment to the next debt to keep momentum.',
        'Re-baseline. Did monthly outflow drop? It should have.',
      ],
    },
    margin_recovery: {
      slug: 'margin_recovery',
      label: 'Margin Recovery',
      focus: 'You\'re running too hot. The fix isn\'t earning more right now. It\'s clawing back margin in the spend.',
      moves: [
        'Audit the last 90 days of spending. Cut the top 3 categories you can\'t justify.',
        'Set a weekly spending check-in. 10 minutes, same day every week.',
        'Build a 30-day cash buffer before optimizing anything else.',
      ],
      day30: [
        'Categorize the last 90 days of personal spending.',
        'Identify and cancel 3 expenses that don\'t earn their keep.',
        'Set a weekly check-in on the calendar.',
      ],
      day60: [
        'Open a separate savings labeled "Buffer" and start funding it.',
        'Hit a $1,000 minimum buffer balance.',
        'Compare current spending against your month-1 baseline. It should be lower.',
      ],
      day90: [
        'Reach 30 days of expenses in the buffer account.',
        'Set a new automatic savings rate now that the buffer is funded.',
        'Re-evaluate. Did the weekly check-in stick? If not, change the format.',
      ],
    },
  };

  const CONSTRAINT_TO_PROFILE = [
    ['high_debt',         'debt_liberation'],
    ['chaotic_spending',  'margin_recovery'],
    ['irregular_income',  'margin_recovery'],
    ['underinsured',      'protect_provide'],
    ['tax_confusion',     'taxes_growth'],
    ['unclear_retirement','taxes_growth'],
    ['scattered',         'stabilize_simplify'],
    ['spouse_misalign',   'stabilize_simplify'],
  ];
  const PRIORITY_FALLBACK = {
    legacy:        'legacy_builder',
    reduce_taxes:  'taxes_growth',
    save_future:   'taxes_growth',
    invest:        'taxes_growth',
    protect:       'protect_provide',
    provide:       'protect_provide',
    obligations:   'protect_provide',
    give:          'legacy_builder',
    enjoy:         'legacy_builder',
    simplify:      'stabilize_simplify',
  };

  function pickProfile(a) {
    const constraints = a.constraints || [];
    for (const [c, p] of CONSTRAINT_TO_PROFILE) {
      if (constraints.includes(c)) return PROFILES[p];
    }
    const priorities = a.priorities || [];
    for (const pri of priorities) {
      const p = PRIORITY_FALLBACK[pri];
      if (p) return PROFILES[p];
    }
    return PROFILES.stabilize_simplify;
  }

  // =========================================================================
  window.TOOL_CONFIG = {
    id: 'stewardship-plan',
    brand: { product: 'Stewardship Plan Builder', org: 'Ryleigh Wealth Management' },

    landing: {
      badge: 'Free 10-minute Tool',
      headline: 'Turn Your Faith Into a 90-Day Plan',
      subhead: 'Match your priorities and constraints to one of six stewardship profiles. Walk away with a focus statement, three moves, and a 30/60/90 checklist.',
      trustItems: ['CRPC™ Fiduciary Advisor', 'Pastor of 10+ Years', 'Built for Christian Households'],
      bullets: [
        'A profile that names what your season is actually about',
        'Three concrete moves, not a vague pep talk',
        'A 30/60/90 checklist you can hand to your spouse',
        'A printable PDF emailed straight to you',
      ],
      ctaLabel: 'Build my plan',
      fineprint: 'Email required to view your plan. We protect your information; unsubscribe any time.',
    },

    questions: [
      { id: 'priorities', category: 'Priorities', kind: 'multi-capped', maxSelections: 3,
        prompt: 'Which 3 priorities matter most this season?',
        help: 'Pick up to 3. Don\'t overthink it. Your gut order is probably right.',
        options: [
          { value: 'provide',      label: 'Provide for household needs' },
          { value: 'obligations',  label: 'Meet financial obligations' },
          { value: 'save_future',  label: 'Save for the future' },
          { value: 'give',         label: 'Give generously' },
          { value: 'enjoy',        label: 'Enjoy God\'s blessing without guilt' },
          { value: 'invest',       label: 'Invest confidently' },
          { value: 'reduce_taxes', label: 'Reduce taxes' },
          { value: 'protect',      label: 'Protect the family' },
          { value: 'legacy',       label: 'Build legacy' },
          { value: 'simplify',     label: 'Simplify life' },
        ] },
      { id: 'constraints', category: 'Constraints', kind: 'multi-capped', maxSelections: 2,
        prompt: 'Which 2 constraints are loudest right now?',
        help: 'Pick the two that get in your way most often.',
        options: [
          { value: 'chaotic_spending',   label: 'Chaotic spending' },
          { value: 'tax_confusion',      label: 'Tax confusion' },
          { value: 'scattered',          label: 'Scattered accounts' },
          { value: 'underinsured',       label: 'Underinsured' },
          { value: 'unclear_retirement', label: 'Unclear retirement plan' },
          { value: 'high_debt',          label: 'High debt load' },
          { value: 'irregular_income',   label: 'Irregular business income' },
          { value: 'spouse_misalign',    label: 'Spouse not aligned' },
        ] },
      { id: 'horizon', category: 'Time', kind: 'single',
        prompt: 'What time horizon are you planning against?',
        options: [
          { value: '90d',  label: 'Next 90 days' },
          { value: '12mo', label: 'Next 12 months' },
          { value: '3yr',  label: 'Next 3 years' },
        ] },
      { id: 'clarity', category: 'Self-rating', kind: 'single',
        prompt: 'How clear is your overall financial picture today?',
        options: [
          { value: 'foggy', label: 'Foggy. I avoid looking.' },
          { value: 'some',  label: 'Some clarity, but gaps' },
          { value: 'clear', label: 'Clear. I know my numbers.' },
        ] },
      { id: 'consistency', category: 'Self-rating', kind: 'single',
        prompt: 'How consistent are your financial habits?',
        options: [
          { value: 'inconsistent', label: 'Inconsistent' },
          { value: 'working',      label: 'Working on it' },
          { value: 'steady',       label: 'Steady, month after month' },
        ] },
      { id: 'complexity', category: 'Self-rating', kind: 'single',
        prompt: 'How complex is your financial situation?',
        options: [
          { value: 'simple',   label: 'Simple. Few moving parts.' },
          { value: 'moderate', label: 'Moderate (multiple accounts or income sources)' },
          { value: 'complex',  label: 'Complex (business, multiple entities, etc.)' },
        ] },
    ],

    gate: {
      headline: 'Where should we send your plan?',
      body: 'Enter your name and email to view your personalized stewardship plan and download a printable PDF.',
      fineprint: 'No spam. Unsubscribe any time. We never share your information.',
    },

    computeResults: function (a, ctx) {
      const profile = pickProfile(a);

      const blocks = [
        {
          kind: 'priority-list',
          title: 'Your three moves',
          items: profile.moves.map(m => ({ heading: m })),
        },
        {
          kind: 'checklist',
          title: 'Days 1–30',
          items: profile.day30,
        },
        {
          kind: 'checklist',
          title: 'Days 31–60',
          items: profile.day60,
        },
        {
          kind: 'checklist',
          title: 'Days 61–90',
          items: profile.day90,
        },
      ];

      const leadConstraint = (a.constraints && a.constraints[0]) || '';

      return {
        overline: (ctx.firstName + '\'s Plan').trim(),
        tierOverline: 'Your Profile',
        tierLabel: profile.label,
        tierBlurb: profile.focus,
        blocks: blocks,
        cta: {
          headshot: 'https://raw.githubusercontent.com/azoll/andrewzoll.com/main/rwm/assets/headshot.jpeg',
          headline: 'Want a thinking partner inside your plan?',
          body: 'A Stewardship Clarity Call is a focused 25 minutes that turns a profile-level plan into something specific to your numbers, your family, and your season.',
          label: 'Book a Stewardship Clarity Call',
          signature: 'Andrew Zoll, CRPC™',
        },
        mailchimp: {
          tagId: 'TODO_TAG_ID_LM_StewardshipPlan',
          mergeFields: {
            PROFILE_SLUG:    profile.slug,
            PROFILE:         profile.label,
            FOCUS:           profile.focus,
            MOVE1:           profile.moves[0] || '',
            MOVE2:           profile.moves[1] || '',
            MOVE3:           profile.moves[2] || '',
            D30_1:           profile.day30[0] || '',
            D30_2:           profile.day30[1] || '',
            D30_3:           profile.day30[2] || '',
            D60_1:           profile.day60[0] || '',
            D60_2:           profile.day60[1] || '',
            D60_3:           profile.day60[2] || '',
            D90_1:           profile.day90[0] || '',
            D90_2:           profile.day90[1] || '',
            D90_3:           profile.day90[2] || '',
            HORIZON:         a.horizon || '',
            LEAD_CONSTRAINT: leadConstraint,
          },
        },
      };
    },

    mailchimp: {
      url:  'https://ryleighwm.us4.list-manage.com/subscribe/post-json',
      u:    '2eb7d0c1b3419f0b9bf268d01',
      id:   '6e456e6462',
      f_id: 'TODO_FORM_ID_StewardshipPlan',
    },

    pdf: {
      title: 'Your Stewardship Plan',
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
        a: 'We\'ll talk through your plan profile, the moves that feel hardest or least clear, and what a next faithful step could look like for your family. By the end, you\'ll have a clearer picture of where you stand and whether deeper work together makes sense.' },
      { q: 'Is this a sales call?',
        a: 'No. The call is a conversation, not a pitch. If we both think working together would serve your family well, we can talk about next steps. If not, you walk away with a sharper plan and a next step you can take on your own.' },
      { q: 'Do I need to prepare anything?',
        a: 'A general knowledge of your financial position is plenty. No paperwork, no spreadsheets. Bringing your plan results helps but isn\'t required.' },
      { q: 'Will I be added to a list?',
        a: 'Submitting your email signs you up for occasional notes on biblical stewardship. You can unsubscribe at any time. Booking the call doesn\'t add you to anything else.' },
      { q: 'What if my spouse and I aren\'t on the same page financially?',
        a: 'More common than you\'d think. Money reveals differences in values, fears, and communication, not just math. The healthiest plans are built when husband and wife are moving in the same direction, and these conversations tend to strengthen marriages rather than strain them.' },
    ],

    disclosure: 'This tool is for educational purposes only and does not constitute financial, tax, or legal advice. No specific investment recommendations are provided. Securities offered through Kestra Investment Services, LLC (Kestra IS), member FINRA/SIPC. Investment advisory services offered through Kestra Advisory Services, LLC (Kestra AS), an affiliate of Kestra IS. Ryleigh Wealth Management and any other entity listed herein are not affiliated with Kestra IS or Kestra AS. Ryleigh Wealth Management does not offer tax or legal advice. Investor Disclosures: <a href="https://www.kestrafinancial.com/disclosures" target="_blank" rel="noopener">https://www.kestrafinancial.com/disclosures</a>',
  };
})();
