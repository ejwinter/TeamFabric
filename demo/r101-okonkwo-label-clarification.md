From: Sarah Okonkwo <s.okonkwo@riverdale.org>
To: Dana Torres <d.torres@riverdale.org>; Marcus Chen <m.chen@riverdale.org>
Subject: RE: R-101 L2 Consultation Follow-up — Sepsis Label Definition
Date: March 28, 2026, 9:47 AM

Dana, Marcus —

Thanks for the productive session on Tuesday. I wanted to follow up on the open question about how we define sepsis onset for the training labels. I know this was the main risk you flagged, so I want to give you a full picture of what we have.

**Label Source**

My team has already completed chart review on a subset of the ICU cohort as part of a prior quality improvement project. We have physician-adjudicated sepsis onset timestamps for approximately 4,200 encounters (out of the ~12,000 total). The remaining encounters are either sepsis-negative or were not reviewed. The reviewed cohort has a sepsis prevalence of roughly 28% (~1,175 positive cases).

For the unreviewed encounters, we plan to use the Sepsis-3 criteria applied algorithmically to EHR data as a proxy label. Marcus — I believe your team has done this before for the readmission work? Happy to align on the exact implementation if so.

**Onset Timestamp Definition**

For the adjudicated cases, onset is defined as the time of the first clinical intervention consistent with sepsis management (antibiotics + fluids within 3 hours, or ICU physician note documenting suspected sepsis). We believe this is a more actionable anchor than the Sepsis-3 organ dysfunction criteria because it reflects the clinical decision point.

For the algorithm-derived labels on the unadjudicated cohort, we would use the Sepsis-3 onset definition (SOFA score increase ≥ 2 from baseline). There's some inconsistency between the two label sources that we'll need to address in the model design — I'd recommend treating this as a training data uncertainty problem rather than a preprocessing problem, but I'm open to other approaches.

**Data Extract**

Marcus asked about the specific Epic tables. I've attached a data dictionary from our QI project that lists the fields we used. The short list:
- Vitals: flowsheet rows for HR, BP, RR, SpO2, Temp (all documented)
- Labs: BMP, CBC, lactate, blood cultures (ordered/resulted flags)
- Medications: antibiotic and vasopressor administration MAR records
- Nursing assessments: Glasgow Coma Scale, RASS sedation scores

All of this is in Clarity. I've already talked to the Epic team and they confirmed there are no restrictions on this data for research use under our existing IRB. Dr. Lena Park (Epic analyst) is our contact — I'll copy her on a separate email so you can loop her in directly.

**Timeline**

Our R01 aims are due for renewal in October. We'd like to have at least a preliminary model by August to include in the renewal narrative. I realize that's aggressive given everything, so please be candid with me about what's realistic.

Let me know if you have more questions. Happy to jump on a call if it's easier.

— Sarah

Sarah Okonkwo, MD, PhD
Associate Professor, Critical Care Medicine
Riverdale Medical Center
s.okonkwo@riverdale.org | (555) 204-7831
