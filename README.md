# Paytm Recovery Copilot (Enterprise LSP & RBI Edition)

**Track 3:** Autonomous AI Teammates (*"Build AI teammates that don't just respond; they get the job done"*)  
**Domain:** Paytm LSP Micro-Lending Collections, SMA-to-NPA Prevention, Regional Macro Telemetry & Full RBI Regulatory Compliance  
**Tech Stack:** FastAPI, SQLite/SQLAlchemy, Sarvam AI (`sarvamai` SDK, `bulbul:v4-flash` TTS & `sarvam-105b-conversations`), Google Gemini 2.5 Flash, React 19, TypeScript, Tailwind CSS, Framer Motion.

---

## 1. Real-World Lending Context & Problem Statement

Paytm operates as a **Lending Service Provider (LSP)** under RBI Digital Lending Guidelines, partnering with **Regulated Entities (REs / NBFCs & Banks)** such as *SMFG India Credit, Aditya Birla Finance, and Piramal Finance*.

Small merchants repay daily working-capital loans via Equated Daily Installments (EDIs) deducted automatically during the **T+1 Morning Settlement Sweep**.

When hyper-local regional cash-flow shocks hit (monsoons, road closures, civil excavations), traditional recovery engines cause three major failures:
1. **Context-Blind Bounces:** Repeated rigid sweep failures push viable **SMA-0 (1–30 DPD)** borrowers into **SMA-2 / NPA** defaults.
2. **Regulatory Non-Compliance:** Unregulated calling violates the **RBI Fair Practices Code**, the **RBI 08:00–19:00 IST contact window**, and the **DPDP Act 2023**.
3. **Cash-Diversion Blindness:** Human collectors cannot distinguish genuine regional distress from deliberate QR suppression or cash diversion.

---

## 2. Architecture & The 5-Node Autonomous Pipeline

```text
[ Trigger: Missed T+1 Settlement Sweep / SMA-0 Flag ]
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Node 1: Telemetry & Regional Macro Diagnostician           │
│  • Verifies DPDP Act 2023 Consent ID                        │
│  • Computes 30-day UPI QR settlement drop % & Soundbox uptime│
│  • Evaluates Pin-Code Peer Cluster (>70% nearby shops down?)│
│  • Ingests IMD Weather & Civil Infrastructure signals       │
└─────────────────────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
[ SMA-2 / Cash Diversion ]   [ Verified Shock / NPCI Timeout ]
        │                         │
        ▼                         ▼
┌─────────────────────────┐  ┌─────────────────────────────────┐
│ Node 5: HITL Escalation │  │ Node 2: RBI & NBFC Gatekeeper   │
│ • Compiles DRA Dossier  │  │ • Enforces 08:00–19:00 IST window│
│ • Attaches divergence   │  │ • Guarantees ₹0.00 Penal Fee    │
│ • Dispatches body-cam   │  │ • Computes Dual Restructure     │
│   DRA physical queue    │  └─────────────────────────────────┘
└─────────────────────────┘                   │
                                              ▼
                             ┌─────────────────────────────────┐
                             │ Node 3: Multilingual Voice & AI │
                             │ • Gemini 2.5 Flash + Sarvam AI  │
                             │ • Speaks Telugu/Hindi/English   │
                             │ • Interactive Soundbox & Chat   │
                             └─────────────────────────────────┘
                                              │
                                     { Borrower Consent }
                                              │
                                              ▼
                             ┌─────────────────────────────────┐
                             │ Node 4: Action & KFS Executor   │
                             │ • Mutates SQL Loan EDI to ₹150  │
                             │ • Issues Digital RBI KFS Pass   │
                             │ • Updates T+1 Morning Sweep     │
                             │ • Cures SMA-0 bucket            │
                             └─────────────────────────────────┘
```

---

## 3. The 3 Seed Merchant Archetypes

1. **Ramesh Kumar — Ramesh Kirana Store (`MCH_001`, Pin Code `500081` Hyderabad, Telugu)**
   - **Telemetry:** Baseline ₹4,200/day dropped by **-45%** to ₹2,310/day. Soundbox uptime: **99.4%**.
   - **Peer Cluster:** **20 of 24 (83.3%)** neighboring shops in Pin Code 500081 down -41% due to IMD Orange Alert Monsoon and arterial metro drainage excavation.
   - **Outcome:** Verified regional shock. Approved for **₹150/day Step-Down** via WhatsApp or **Paytm Soundbox Double-Tap Button**, generating a Digital KFS pass with **₹0 Penal Interest**.

2. **Priya Sharma — Priya Handloom Textiles (`MCH_002`, Pin Code `302001` Jaipur, Hinglish)**
   - **Telemetry:** Steady ₹6,800/day. Soundbox uptime: **99.8%**.
   - **Macro Signal:** Normal weather (3.6% peer dip). Single missed sweep due to NPCI bank switch timeout.
   - **Outcome:** Recommends **1-Click T+1 Settlement Retry** with **₹0 Bounce Charges**.

3. **Vikram Reddy — Apex Electronics (`MCH_003`, Pin Code `500032` Hyderabad, English)**
   - **Telemetry:** ₹0.00 for 25 consecutive days. Soundbox heartbeat: **0.0% Offline**.
   - **Peer Cluster:** 97.9% of neighboring shops operating normally (**Severe Peer Divergence**).
   - **Outcome:** Bypasses LLM negotiation; immediately escalates to **Node 5 (RBI Debt Recovery Agent Queue)** with formal fraud risk dossier.

---

## 4. Key Interactive Components (React Bits, Componentry & Vengeance UI)

- **Interactive 2-Way Paytm Soundbox Hardware Simulator (`SoundboxWidget.tsx`):**
  - Styled in authentic Paytm Navy (`#002970`) and Cyan (`#00BAF2`) with perforated speaker mesh and glowing LED ring.
  - Web Audio API synthesizer for the signature Paytm chime.
  - **`[🔘 Double-Tap Soundbox Button]`**: accepts the ₹150/day restructured plan with 1 physical tap!
- **Magnetic IST Clock Scrub Slider (`ComplianceSimulator.tsx`):**
  - Scrub from 00:00 to 23:59 IST.
  - Dynamically enforces the **RBI 08:00–19:00 IST Fair Practices Code**. Scrub past 19:00 to see outreach instantly blocked and queued for 08:05 AM T+1 morning run.
- **Pin-Code Peer Cluster Radar (`MacroRadarCard.tsx`):**
  - Displays 24 local merchant nodes in the pin code, distinguishing genuine macro shocks from fraudulent diversion.
- **3D Tilt Digital RBI KFS Pass Card (`KFSMandateCard.tsx`):**
  - Perspective 3D tilt with holographic sheen displaying Partner NBFC (RE), revised terms, ₹0 penal charges, and Grievance Redressal Officer (GRO) contact.
- **`SpotlightCard` & `AnimatedCounter`:**
  - Cursor-tracking radial cyan glow and spring-physics Indian Rupee odometer rolls.

---

## 5. Quickstart

### 1. Backend
```bash
# Navigate to project root
pip install -r requirements.txt # or uv pip install
python backend/run.py
# Server runs on http://localhost:8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Vite runs on http://localhost:5173
```
