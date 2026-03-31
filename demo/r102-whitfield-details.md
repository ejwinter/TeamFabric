From: James Whitfield <j.whitfield@riverdale.org>
To: Dana Torres <d.torres@riverdale.org>
Subject: Heart Failure Readmission Prediction — Additional Details
Date: March 29, 2026, 2:15 PM

Dana —

Thanks for asking me to put this in writing. Here's what I can tell you.

**What We're Trying to Do**

We want to predict which heart failure patients are likely to be readmitted within 30 days of discharge, and surface that risk score to the care coordination team at the time of discharge. The care coordinators currently prioritize follow-up calls based on clinical intuition — we think a risk score could help them focus on the patients who actually need it.

The output doesn't need to be fancy. A color-coded risk tier (low / medium / high) on the discharge summary in Epic would be sufficient. We are not trying to build a research tool; we want something that becomes part of the workflow.

**Cohort**

I looked into this after your question. Riverdale discharges approximately 800-900 heart failure patients per year. With five years of data (2021-2025) that's roughly 4,000-4,500 encounters. Readmission rate is around 22% based on our quality dashboard, so approximately 900-1,000 positive cases in the full cohort. I think that's workable — let me know if you need more.

**Data**

We have access to Epic data through the Clarity database. The features I'd want to use are:
- Discharge diagnosis codes (HF subtype — HFrEF vs HFpEF matters clinically)
- BNP/NT-proBNP at discharge
- Prior admission history (number and recency)
- Medications at discharge (particularly diuretics, beta-blockers, ACE inhibitors)
- Social determinants: insurance type, zip code (as a proxy for social support / access)
- Length of stay on current admission

I don't know exactly what's extractable vs. what needs custom queries, but I assume your team does this kind of thing.

**Our Data Scientist**

Dr. Anil Mehta is my postdoctoral fellow. He has Python experience and has done some ML work — he built a logistic regression model for a prior QI project — but he hasn't done time-series EHR work before. He's available roughly 50% effort and is eager to be involved. I'm hoping the collaboration model means he learns from your team and does a fair amount of the hands-on work with guidance from Marcus or Priya. I want to be realistic with you that I'm not a data scientist and won't be doing any of the technical work myself.

**Funding**

This is the weak spot. Right now we don't have dedicated funding. My departmental budget could cover a small amount (maybe $5-10K) but not a full engagement. I'm planning to submit a proposal to the Riverdale Quality Innovation Fund in June — the next cycle closes June 15 and awards are announced in August. That funding is specifically for operational AI/ML projects, so this would be a strong fit. I'd want your team's involvement described in the proposal.

I'm also in early conversations with UPMC about a multi-site extension of this work — that's speculative but could bring external funding by late 2026.

**IRB**

I haven't submitted yet. My understanding is that a retrospective analysis of EHR data for quality improvement purposes can go through expedited review, which typically takes 4-6 weeks at Riverdale. I'd want guidance from your team on exactly what the IRB application should say about the ML methods.

Happy to meet and discuss. What does your team's capacity look like?

— James

James Whitfield, MD
Associate Professor, Cardiology
Director, Heart Failure Program
Riverdale Medical Center
j.whitfield@riverdale.org | (555) 318-0042
