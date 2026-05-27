// src/data/client-templates.js
// Pre-written client communication templates for the 6 most common
// contractor-client permit conversations. Editable before sending.

export const TEMPLATES = [
  {
    id: 'timeline_explainer',
    label: 'Permit timeline explainer',
    icon: '📅',
    when: 'Send before or right after starting the permit process',
    subject: 'What to expect with your permits — {{project_type}} at {{address}}',
    body: `Hi {{client_name}},

I wanted to give you a clear picture of what the permit process looks like for your {{project_type}} in {{jurisdiction}}.

Here's the timeline you should expect:

→ Permit application submitted: I'll handle this within the next few days
→ Plan review: {{jurisdiction}} typically takes {{review_time}} to review and approve plans
→ Permit issued: Once approved, we can officially start work
→ Inspections: Throughout construction, a {{jurisdiction}} inspector will visit at key stages (foundation, framing, rough-in, final)
→ Certificate of Occupancy: Issued after all final inspections pass

Total time from application to final approval: approximately {{total_timeline}}

A few things that can add time:
• If the plan reviewer requests corrections, we'll need to revise and resubmit (adds 1–2 weeks)
• Inspection scheduling depends on inspector availability — I'll coordinate this directly

I know the waiting can be frustrating, but the permit process is what ensures your project is built safely and legally. I'll keep you updated at every stage.

Any questions, just reply to this message.

{{contractor_name}}
{{business_name}}
{{phone}}`,
  },
  {
    id: 'application_submitted',
    label: 'Application submitted',
    icon: '📬',
    when: 'Send the day you submit the permit application',
    subject: 'Permit application submitted — {{project_type}} at {{address}}',
    body: `Hi {{client_name}},

Good news — I've submitted your permit application to {{jurisdiction}} today.

Application details:
• Project: {{project_type}}
• Address: {{address}}
• Submitted: {{today}}
• Estimated plan review time: {{review_time}}

What happens next:
{{jurisdiction}} plan reviewers will check the drawings against the NC Building Code. This typically takes {{review_time}}. If they have questions or require corrections, I'll handle that directly and keep you posted.

I'll reach out as soon as the permit is approved so we can schedule the start date.

{{contractor_name}}
{{business_name}}
{{phone}}`,
  },
  {
    id: 'plan_review_delay',
    label: 'Plan review delay',
    icon: '⏳',
    when: 'Send if review is taking longer than the original estimate',
    subject: 'Permit update — review is taking a bit longer than expected',
    body: `Hi {{client_name}},

I wanted to give you an update on your permit for {{address}}.

The plan review is taking a bit longer than the original estimate. This is common during busy construction seasons — {{jurisdiction}} is currently reviewing a high volume of applications.

Current status: Under review
Original estimate: {{review_time}}
Revised estimate: {{revised_estimate}}

This doesn't affect the quality of your project — it's just a queue issue on the city's side. I'm monitoring it closely and will let you know the moment the permit is approved.

If you have any questions or concerns, please don't hesitate to reach out.

{{contractor_name}}
{{business_name}}
{{phone}}`,
  },
  {
    id: 'inspection_scheduled',
    label: 'Inspection scheduled',
    icon: '🔍',
    when: 'Send when you schedule an inspection',
    subject: '{{inspection_type}} inspection scheduled — {{address}}',
    body: `Hi {{client_name}},

Your {{inspection_type}} inspection has been scheduled.

Inspection details:
• Type: {{inspection_type}}
• Date: {{inspection_date}}
• Inspector arrives: {{inspection_window}}
• Address: {{address}}

What the inspector will check:
{{inspection_checklist}}

What you need to know:
• The inspector needs clear access to {{access_notes}}
• Please make sure no drywall or insulation covers the work being inspected
• I'll be on site for the inspection

I'll update you on the results as soon as the inspection is complete.

{{contractor_name}}
{{business_name}}
{{phone}}`,
  },
  {
    id: 'inspection_failed',
    label: 'Inspection failed — correction needed',
    icon: '⚠️',
    when: 'Send if an inspection fails',
    subject: 'Permit update — minor correction needed after inspection',
    body: `Hi {{client_name}},

I want to be upfront with you — the {{inspection_type}} inspection at {{address}} flagged an item that needs to be corrected before we can move forward.

What was flagged:
{{correction_description}}

What this means:
This is a normal part of the construction process — corrections happen on a significant number of projects. It does not mean the work was done poorly; it means the inspector identified something that needs adjustment to meet code.

What I'm doing:
{{correction_plan}}

Timeline impact:
I expect this to add approximately {{delay_estimate}} before we can reschedule the inspection.

I'll keep you posted as we work through this. Please don't hesitate to call me directly if you have questions — {{phone}}.

{{contractor_name}}
{{business_name}}`,
  },
  {
    id: 'co_issued',
    label: 'Permit approved / CO issued',
    icon: '🏠',
    when: 'Send when the Certificate of Occupancy is issued',
    subject: 'Your Certificate of Occupancy has been issued — {{address}}',
    body: `Hi {{client_name}},

Great news — {{jurisdiction}} has issued your Certificate of Occupancy for {{address}}.

This means:
✓ All required inspections have passed
✓ Your {{project_type}} complies with the NC Building Code
✓ The project is legally complete and ready for occupancy

A few things to keep:
• I'll send you a copy of the CO for your records — keep it with your property documents
• Your homeowner's insurance carrier may want to know about the completed work
• If you ever sell the property, the CO is part of the permit history

It's been a pleasure working on this project with you. If you need anything else — another project, a referral to a specialist, or just a question — don't hesitate to reach out.

{{contractor_name}}
{{business_name}}
{{phone}}`,
  },
]

// Replace template variables with actual values
export function fillTemplate(template, vars = {}) {
  let filled = template.body
  let subject = template.subject

  const defaults = {
    client_name: '[Client name]',
    contractor_name: '[Your name]',
    business_name: '[Business name]',
    phone: '[Phone number]',
    address: '[Property address]',
    jurisdiction: '[Jurisdiction]',
    project_type: '[Project type]',
    review_time: '10–15 business days',
    total_timeline: '3–5 months',
    today: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    inspection_type: '[Inspection type]',
    inspection_date: '[Date]',
    inspection_window: 'between 7:30 AM and 4:00 PM',
    inspection_checklist: '[Inspector will check framing, connections, and penetrations]',
    access_notes: 'the work area',
    correction_description: '[Description of what was flagged]',
    correction_plan: '[What you plan to do to fix it]',
    delay_estimate: '3–5 business days',
    revised_estimate: '[Revised date]',
  }

  const merged = { ...defaults, ...vars }

  Object.entries(merged).forEach(([key, val]) => {
    filled = filled.replaceAll(`{{${key}}}`, val)
    subject = subject.replaceAll(`{{${key}}}`, val)
  })

  return { ...template, filledBody: filled, filledSubject: subject }
}
