# AI Sevak Portal (Main Product Document)

## 1) Introduction and Context

### 1.1 Organization Context
Shrimad Rajchandra Mission Dharampur (SRMD) and SRLC run seva-driven initiatives across multiple social impact programs. Volunteers (Sevaks) are central to delivery.

As seva activity scales across chapters and projects, existing coordination patterns (manual registration, informal messaging groups, repeated onboarding by humans, fragmented status tracking) create operational friction.

### 1.2 Terminology
- **Seva**: A service initiative/project.
- **Sevak**: A volunteer contributing time/skills.
- **Mumukshu**: A spiritual aspirant seeking liberation; in this context, a mission-aligned participant who may also volunteer.
- **Seva Leader**: Operational owner for one or more sevas.
- **POC**: Point of contact for execution coordination.

### 1.3 Core Problem Statement
Current volunteer operations are fragmented and hard to scale:
- Volunteer intake and assignment often happen manually and inconsistently.
- Updates are scattered across channels, reducing visibility and accountability.
- Seva leaders repeatedly share the same instructions and onboarding context.
- Reporting, auditability, and impact storytelling are difficult due to missing structured data.

### 1.4 Product Vision
Build one unified **AI Sevak Portal** that standardizes the end-to-end volunteer lifecycle:
1. Registration
2. Intelligent allocation guidance
3. Structured onboarding
4. Calendarized execution
5. In-app collaboration
6. Daily/weekly logs and impact timeline
7. Controlled expense logging

The portal should reduce admin overhead, improve volunteer experience, and create a reliable seva operations data layer.

---

## 2) Objectives, Scope, and Principles

### 2.1 Primary Objectives
- Reduce time to onboard and allocate volunteers.
- Improve match quality between volunteer profile and seva requirement.
- Centralize updates, communication, and evidence of progress.
- Provide role-based operational control and reporting.
- Build trusted data for leadership decisions and donor-facing narratives.

### 2.2 In-Scope (Current Product)
- Volunteer profile and availability capture.
- Seva discovery and registration flow.
- AI-assisted allocation recommendations.
- AI-assisted onboarding and progress briefing.
- Calendar and hours logging.
- In-app messaging scoped to seva groups.
- Update timeline with text/image/video.
- Expense logging with document attachment.
- Multi-level role-based dashboards and approvals.

### 2.3 Out-of-Scope (For Later Versions)
- Advanced performance scoring of individuals.
- Fully automated approval without human override.
- Public external portal for all donors.
- Deep ERP/finance system integration.

### 2.4 Product Principles
- Human-led, AI-assisted.
- Process discipline with compassion and flexibility.
- Privacy-first for volunteer data.
- Auditability for decisions and updates.
- Simple first release, iterative upgrades.

---

## 3) Users and Access Model

### 3.1 User Personas
- **C1 – Trustees / Senior Leadership**: Portfolio-level oversight, strategic review.
- **C2 – Seva Leaders**: Own planning, approvals, team management, progress review.
- **C3 – Seva Coordinators / Managers**: Operate execution workflows within a seva.
- **C4 – Sevaks (Volunteers)**: Join sevas, log work, collaborate, submit updates/expenses.
- **Platform Admin**: Governance, policy, moderation, configuration, audit.

### 3.2 Role Capabilities (High-Level)
- **C4**: Profile, apply/join, receive onboarding, log hours, post updates, submit expenses.
- **C3**: Approve/decline where delegated, monitor logs, issue updates/reminders.
- **C2**: Configure seva requirements, assign POCs, approve restricted sevas, review health.
- **C1**: Cross-seva analytics, capacity trends, escalation view.
- **Admin**: Role management, moderation controls, compliance and archive policies.

---

## 4) End-to-End Product Modules

### 4.1 Registration and Profile
**Purpose:** Create structured volunteer identity and readiness profile.

**Data Collected:**
- Personal basics (name, contact, city/location).
- Availability (hours/week, preferred days/time slots).
- Skills and proficiency levels (basic/intermediate/advanced).
- Interest areas and willingness to learn new skills.
- Optional prior seva experience.

**Expected Outcomes:**
- Every sevak has a searchable profile.
- Allocation engine gets structured inputs.

### 4.2 Seva Allocation and Discovery
**Purpose:** Match volunteers to the right seva faster and more accurately.

**Core Flows:**
- Seva catalog visible by status, location, and skill demand.
- Open-to-all sevas: instant join (subject to capacity).
- Approval-based sevas: request + leader review flow.
- AI recommendation list explains match rationale (skills, availability, proximity, interest).

**Controls:**
- Capacity limits per seva.
- Over-commitment warnings if volunteer exceeds weekly availability.

### 4.3 Onboarding
**Purpose:** Reduce repetitive onboarding effort and improve readiness quality.

**Onboarding Types:**
1. **General onboarding kit** for first-time sevaks:
	- Mission, values, decorum, expected conduct.
	- App tour and module usage guidance.
2. **Seva-specific onboarding**:
	- SOPs, goals, deliverables, contact structure.
	- Current status brief for mid-cycle joiners.

**AI Role:**
- Conversational Q&A from approved onboarding content.
- Progress briefing summarization from existing logs.

### 4.4 Calendar and Time Logging
**Purpose:** Track commitment and operational rhythm.

**Features:**
- Weekly/daily hour entries per seva.
- Auto-check against declared weekly availability.
- Seva meetings/standups published in the portal calendar.
- Optional external calendar sync (Google/Outlook) in later iterations.

### 4.5 Messaging
**Purpose:** Replace fragmented communication channels with structured seva communication.

**Features:**
- Seva-specific group threads.
- Role-tagged announcements by leaders/coordinators.
- Update reminders and key alerts.

**Note:** Keep messaging scope operational; avoid becoming a generic social chat platform.

### 4.6 Logs and Timeline
**Purpose:** Build a living seva record and preserve learning.

**Volunteer Log Input:**
- Optional daily update (text/image/video).
- Work progress notes.
- Heartfelt reflections/experiences.

**Admin/Leader Layer:**
- Moderation and publish controls.
- Distinct official updates from leadership.
- Daily/weekly summary generation (reviewable before publish).

**Long-Term Value:**
- New joiners can understand past context quickly.
- Leadership gets cumulative operational evidence.
- Donor communication can reference a verified timeline.

### 4.7 Impact Storytelling and Contribution Visibility
**Purpose:** Show beneficiaries, donors, and supporters how seva efforts and donations are translating into real impact.

**How It Works (Using Logs Data):**
- Daily/weekly seva logs (text/image/video) become structured impact events after moderation.
- Events are mapped to seva goals, activity categories, and (where applicable) donation-supported initiatives.
- AI-assisted summaries generate narrative arcs (need -> action -> progress -> outcome).
- Leaders/admin review and approve impact stories before internal/external sharing.

**Outputs:**
- Seva impact timeline view (chronological milestones).
- Story cards (before/after, work completed, beneficiaries reached, volunteer effort).
- Monthly impact digest with verified highlights and media evidence.

**Guardrails:**
- No auto-publishing of unreviewed stories.
- Beneficiary dignity, privacy, and consent rules applied to media/storytelling.
- Traceability from each story element back to approved logs.

### 4.8 Expense Logging
**Purpose:** Provide transparent process for authorized seva-related reimbursement entries.

**Fields:**
- Expense date, amount, category, seva mapping, purpose.
- Bill/invoice attachment.
- Submitter and reviewer metadata.

**Controls:**
- Role-gated submission and approval.
- Clear status lifecycle (submitted/reviewed/approved/rejected).

---

## 5) Workflow Blueprint

1. Sevak signs up and completes profile.
2. Sevak explores seva catalog and receives AI suggestions.
3. Sevak joins or requests approval-based seva.
4. Seva leader/coordinator approves where required.
5. AI + static onboarding kits prepare sevak.
6. Sevak logs hours, messages team, and posts updates.
7. Leaders/admin moderate, summarize, and monitor health.
8. Timeline and metrics feed reporting and continuous improvement.
9. Approved impact stories are generated for leadership, beneficiary communication, and donation transparency.

---

## 6) Data and Governance (Non-Technical View)

### 6.1 Core Data Domains
- Volunteer profile and availability.
- Seva catalog and capacity.
- Onboarding knowledge base (general + seva specific).
- Activity logs and timeline media metadata.
- Messaging and meeting context.
- Expense records and attachments.

### 6.2 Governance Controls
- Role-based permissions by C1/C2/C3/C4/Admin.
- Approval workflows for restricted sevas and expenses.
- Moderation workflow for publishable timeline content.
- Audit logs for key actions (assignment, approvals, edits).
- Data retention and privacy policies defined before production.

---

## 7) AI Assistance Boundaries

### 7.1 AI Should Assist With
- Recommendation ranking for seva allocation.
- Onboarding Q&A using approved documentation.
- Mid-cycle joiner context summaries.
- Draft daily/weekly seva summaries for reviewer approval.

### 7.2 AI Should Not Decide Alone
- Final approvals in sensitive or restricted workflows.
- Financial approvals.
- Policy exceptions.

### 7.3 Safety and Quality
- Human review before publishing broad updates.
- Basic content safety checks for uploaded timeline content.
- Transparent reason snippets for AI recommendations.

---

## 8) Success Metrics (Product + Operations)

### 8.1 Efficiency
- Median time from signup to first active seva.
- Median time spent by leaders on onboarding per volunteer.
- Weekly admin effort saved in assignment/reporting.

### 8.2 Quality
- Onboarding completion rate.
- Seva assignment acceptance and retention.
- Consistency of weekly update submissions.

### 8.3 Experience
- Sevak satisfaction pulse score.
- Leader satisfaction with platform usefulness.

### 8.4 Governance
- % approval workflows completed within SLA.
- % timeline posts moderated within defined window.

### 8.5 Impact Transparency
- % approved timeline entries usable for impact storytelling.
- Story publication turnaround after log moderation.
- Donor/supporter engagement with impact updates.
- Beneficiary-facing communication completeness by active seva.

---

## 9) Versioned Delivery Plan (Step-by-Step Build)

### 9.0 Program Deadline Anchor
- Final build deadline: **31 August 2026**.
- Offering milestone: **26 September 2026** (Bapa’s 60th birthday).
- September window is reserved for presentation readiness, handover quality, and controlled showcase updates (not net-new core scope).

### V0: Discovery and Process Design
- Target: April 2026.
- Confirm role matrix, workflow rules, and minimum data model.
- Define approval ladders, moderation policies, and storytelling governance.
- Finalize MVP acceptance criteria.

### V1: Core Operations MVP
- Target: May 2026.
- Registration/profile.
- Seva catalog and join/request flow.
- Role-based dashboards (basic).
- Calendar + hours logging (basic).

### V2: Structured Collaboration
- Target: June 2026.
- Messaging (seva-scoped).
- Logs/timeline with media upload.
- Leader/admin moderation panel.

### V3: AI-Assisted Productivity
- Target: July 2026.
- Recommendation engine v1 (rules-based guidance).
- Onboarding assistant from approved docs.
- Daily/weekly summary drafts with human approval.

### V4: Reliability and Reporting
- Target: 1 August to 31 August 2026.
- Cross-seva analytics and performance dashboards.
- Audit views, policy controls, and operational hardening.
- Impact storytelling pack readiness (internal first, then controlled external narratives).

---

## 10) Team Execution Model (Current Team of 3)

### 10.1 Team Members
- Dhairya Veera
- Tanvi Savani
- Avani Jariwala

### 10.2 Suggested Work Split (Can Evolve)
- **Product and Operations:** workflows, SOPs, role matrix, adoption.
- **Application and Integration:** frontend/backend module delivery.
- **AI and Data:** recommendation logic, onboarding AI, summaries, metrics.

### 10.3 Collaboration Model
- Weekly planning and review.
- Fortnightly demo to stakeholders.
- Early coordination with overlapping teams; merge points to be defined later.

---

## 11) Risks and Mitigations

### 11.1 Adoption Risk
**Risk:** Volunteers continue to use legacy channels.
**Mitigation:** Keep onboarding friction low, make leader workflows clearly better, phase migration by seva.

### 11.2 Data Quality Risk
**Risk:** Incomplete profiles/logs reduce AI usefulness.
**Mitigation:** Guided forms, minimum required fields, nudges/reminders.

### 11.3 AI Trust Risk
**Risk:** Recommendations perceived as opaque.
**Mitigation:** Show recommendation factors and keep human override always available.

### 11.4 Governance Risk
**Risk:** Inappropriate content or unreviewed updates.
**Mitigation:** Moderation queues, policy checks, audit trails.

---

## 12) Open Decisions (To Finalize Before Production Build)

- Exact technical stack for web + mobile + backend (to be chosen after documentation freeze).
- Notification channels and frequency policy.
- Data retention periods by module.
- Cross-team integration boundaries and ownership.
- Donor/beneficiary-facing visibility scope and approval workflow.

---

## 13) Immediate Next Documentation Outputs

1. Feature-level user stories and acceptance criteria for V1.
2. Role-permission matrix table (C1/C2/C3/C4/Admin).
3. Data dictionary draft for profile, seva, logs, and expenses.
4. Wireframe-level screen inventory for volunteer and leader flows.

This document is the primary source of truth for AI Sevak Portal and should be updated version by version as execution progresses.





















