# Climate Risk Stress Testing - User Flow Documentation

## Overview

This document outlines the comprehensive user flow for the **Climate Risk Scenario Analysis and Stress Testing** module, based on the Bank CRA Model methodology. The module provides professional-grade climate risk assessment aligned with NGFS scenarios, IFRS 9 ECL principles, and regulatory requirements.

---

## Complete User Journey

### Phase 1: Data Preparation & Portfolio Setup

#### Step 1.1: Portfolio Data Upload

**Location**: CRA Data Upload Module

**Actions**:

1. **Upload Loan Book** (`loans_portfolio_Q1_2026.csv`)
   - Required fields:
     - `loanId`: Unique loan identifier
     - `outstandingBalance` (or `ead`): Exposure at Default
     - `pd0`: Baseline Probability of Default (0-1)
     - `lgd0`: Baseline Loss Given Default (0-1)
     - `sector`: Economic sector (e.g., Oil & Gas, Agriculture, Real Estate)
     - `country`: Geographic location
     - `ratingGrade`: Credit rating (AAA to CCC)
     - `collateralType`: Type of collateral (Real Estate, Machinery, Financial Assets, etc.)
     - `collateralLocation`: Physical location of collateral
     - `revenueShareHighCarbon`: % of revenue from high-carbon activities (0-1)
     - `maturityDate`: Loan maturity

2. **Upload Equity Holdings** (`equities_portfolio.csv`)
   - Required fields:
     - `equityId`: Position identifier
     - `marketValue`: Current market value
     - `sector`: Sector classification
     - `numberOfShares`: Share quantity
     - `acquisitionPrice`: Purchase price

3. **Upload Bond Portfolio** (`corporate_bonds_mixed.csv`)
   - Required fields:
     - `bondId`: Bond identifier
     - `faceValue` (or `parValue`): Bond face value
     - `marketValue`: Current market value
     - `couponRate`: Coupon rate (decimal)
     - `yieldBase`: Current yield (%)
     - `ttm`: Time to maturity (years)
     - `closingPrice`: Current bond price
     - `couponFrequency`: Payment frequency (typically 2 for semi-annual)
     - `positionSize`: Number of bonds held

**Validation**:

- System validates data quality:
  - PD and LGD values between 0 and 1
  - No negative exposures
  - All required fields present
  - Sector/country classifications match taxonomy

**User Feedback**:

- ✅ Success: "Portfolio data uploaded successfully. Total EAD: GHS 15.5 billion"
- ⚠️ Warnings: "15 loans missing collateral location - will use default assumptions"
- ❌ Errors: "Validation failed: 23 loans have PD > 1.0"

#### Step 1.2: Portfolio Overview Dashboard

**Displays**:

- Total Exposure by Asset Type (Loans, Equities, Bonds)
- Sector Concentration (pie chart with % breakdown)
- Geographic Distribution (map or bar chart)
- High-Carbon vs Low-Carbon Exposure (transition risk indicator)
- Rating Distribution (histogram)
- Collateral Type Breakdown

**Interactive Elements**:

- Drill-down by sector to see sub-sectors
- Filter by country/region
- Export portfolio summary (PDF/Excel)

---

### Phase 2: Scenario Configuration

#### Step 2.1: Navigate to Scenario Analysis Module

**Location**: Dashboard → "Climate Risk Analysis" → "Scenario Analysis & Stress Testing"

**Landing Page Shows**:

- Intro text: "Assess portfolio resilience under climate transition and physical risk scenarios"
- Quick stats from portfolio: "Analyzing 2,500 exposures across 10 sectors"
- "Start New Scenario Analysis" button
- Historical results (if any): "Previous runs: 3 scenarios completed"

#### Step 2.2: Scenario Selection

**Screen**: `ScenarioSelection.tsx`

**User sees 4 scenario cards**:

1. **Orderly Transition (Net Zero 2050)** 🌱
   - **Description**: "Immediate climate policy action with smooth transition to net zero by 2050"
   - **Key Parameters**:
     - Temperature rise: **1.5°C by 2100**
     - Carbon price trajectory: **$75 → $250/tCO2**
     - Physical damage index: **5% → 12%**
   - **Features**:
     - ✅ High transition risk / Low physical risk
     - ✅ Gradual policy implementation
     - ✅ Manageable economic disruption
   - **Use Case**: "Best-case scenario planning, green asset strategy"
   - **Select Button**

2. **Disorderly Transition** ⚡
   - **Description**: "Climate action delayed until 2030, followed by abrupt policy tightening"
   - **Key Parameters**:
     - Temperature rise: **1.8°C by 2100**
     - Carbon price trajectory: **$35 → $280/tCO2** (sharp spike post-2030)
     - Physical damage index: **8% → 20%**
   - **Features**:
     - ✅ Very high transition risk shock
     - ✅ Severe economic disruption
     - ✅ Mixed transition + physical impacts
   - **Use Case**: "Stress testing for policy shock, worst-case transition"
   - **Select Button**

3. **Hot House World (Current Policies)** 🔥
   - **Description**: "Only current policies continue; severe physical climate impacts"
   - **Key Parameters**:
     - Temperature rise: **>3.2°C by 2100**
     - Carbon price trajectory: **$10 → $30/tCO2** (minimal)
     - Physical damage index: **10% → 60%**
   - **Features**:
     - ✅ Low transition risk
     - ✅ Extreme physical risk (floods, droughts, heat)
     - ✅ Long-term economic degradation
   - **Use Case**: "Physical risk stress testing, climate adaptation planning"
   - **Select Button**

4. **Custom Scenario** ⚙️
   - **Description**: "User-defined scenario with custom parameters"
   - **Use Case**: "Sensitivity analysis, Ghana-specific climate pathways"
   - **Select Button**

**User Action**: Click "Select Scenario" on desired card

**System Response**:

- Loads default parameters for selected scenario
- Transitions to **Step 2.3** (Time Horizon Selection)

#### Step 2.3: Time Horizon Selection

**Screen**: Embedded in `AssumptionEditor.tsx` or separate modal

**User sees 3 time horizon options**:

1. **Short-Term (1-3 years)** - 2026-2028
   - **Focus**: "Immediate transition policy impacts and near-term physical events"
   - **Key Metrics**: "Short-term credit deterioration, market volatility"
   - **Recommended for**: "Tactical planning, 1-year stress testing"

2. **Medium-Term (3-10 years)** - 2028-2035
   - **Focus**: "Carbon price trajectories materialize, structural economic changes"
   - **Key Metrics**: "Strategic portfolio shifts, sector reallocation"
   - **Recommended for**: "Strategic planning, ICAAP/ILAAP"

3. **Long-Term (10-30 years)** - 2035-2055
   - **Focus**: "Full temperature rise impacts, cumulative physical damages"
   - **Key Metrics**: "Long-term sustainability, stranded asset risk"
   - **Recommended for**: "Long-term strategy, TCFD disclosures"

**User Action**: Select time horizon (radio buttons or cards)

**System Response**:

- Updates scenario parameters based on horizon
- Shows preview: "Orderly Transition - Medium Horizon: Carbon price $160/tCO2, GDP shock -1.0%"
- Button: "Continue to Parameter Customization" or "Run with Defaults"

---

### Phase 3: Parameter Customization (Optional)

#### Step 3.1: Assumption Editor

**Screen**: `AssumptionEditor.tsx`

**User can customize (if "Custom" or "Advanced Settings" selected)**:

**Section 1: Transition Risk Parameters**

1. **Carbon Price** ($/tCO2)
   - Slider: 0 - 500
   - Default from NGFS: 160 (for Orderly-Medium)
   - Help tooltip: "Price on carbon emissions; drives PD uplift via logit transformation"

2. **GDP Shock** (percentage points)
   - Slider: -5.0 to +2.0
   - Default from NGFS: -1.0%
   - Help tooltip: "GDP growth deviation from baseline; affects PD via beta_GDP parameter"

3. **Inflation Shock** (percentage points)
   - Slider: -2.0 to +5.0
   - Default: +0.3%
   - Help tooltip: "Inflation rate change; impacts debt servicing capacity"

4. **Interest Rate Shock** (percentage points)
   - Slider: -2.0 to +5.0
   - Default: +0.3%
   - Help tooltip: "Policy rate change; affects bond valuations via duration"

**Section 2: Physical Risk Parameters** 5. **Physical Damage Index** (0-100%)

- Slider: 0% - 100%
- Default: 8% (Orderly-Medium)
- Help tooltip: "Collateral damage from climate events; affects LGD uplift"

**Section 3: Calibrated Beta Parameters (Advanced)** 6. **Beta Carbon** (sensitivity)

- Slider: 0.0005 - 0.0050
- Default: 0.0025 (base) or sector-specific
- Help tooltip: "Carbon price sensitivity; higher for Oil & Gas (0.0045), Coal (0.0050)"

7. **Beta GDP** (sensitivity)
   - Slider: -0.60 to 0.00
   - Default: -0.35 (base) or sector-specific
   - Help tooltip: "GDP shock sensitivity; more negative for cyclical sectors (Air Transport: -0.55)"

8. **Beta Physical** (multiplier)
   - Slider: 0.5 - 2.0
   - Default: 1.0
   - Help tooltip: "Physical damage multiplier for LGD calculation"

**Section 4: Monte Carlo CAT Modeling** 9. **Number of Trials**

- Dropdown: 100, 500, 1000, 5000, 10000
- Default: 1000
- Help tooltip: "Monte Carlo simulation trials; more trials = higher precision"

10. **VaR Confidence Level**
    - Dropdown: 95%, 99%, 99.5%, 99.9%
    - Default: 99.9%
    - Help tooltip: "Value at Risk confidence threshold for capital adequacy"

**Section 5: Geographic Adjustments** 11. **Country/Region Multipliers** - Ghana: Default 1.3 (developing market sensitivity) - Nigeria: Default 1.3 - South Africa: Default 1.1 - Help tooltip: "Higher sensitivity for emerging markets due to limited fiscal buffers"

**Visual Feedback**:

- Real-time parameter preview chart showing carbon price trajectory
- Comparison to NGFS benchmark: "Your custom scenario: +25% above NGFS Orderly Medium"

**User Actions**:

- "Reset to Defaults" button
- "Run Single Scenario" button
- "Run All Combinations" button (runs all scenarios × horizons in batch)

---

### Phase 4: Stress Testing Execution

#### Step 4.1: Calculation Progress Screen

**Screen**: Modal or full-page loader

**User sees**:

- **Progress Bar**: "Running stress calculations... 45%"
- **Status Updates** (live):
  1. ✅ "Loading portfolio data... 2,500 loans, 150 equities, 75 bonds"
  2. ✅ "Applying scenario parameters... Orderly - Medium Horizon"
  3. ⏳ "Calculating PD uplift via logit transformation..."
     - "Processing Oil & Gas sector (beta_carbon = 0.0045)..."
     - "Applying GDP shock: -1.0% with beta_GDP = -0.35..."
  4. ⏳ "Calculating LGD stress from physical damage..."
     - "Applying location factors: Lagos (2.0), Accra (1.5)..."
     - "Adjusting for collateral types: Real Estate (1.5), Machinery (1.2)..."
  5. ⏳ "Computing Expected Credit Loss (ECL)..."
  6. ⏳ "Revaluating equity portfolio..."
     - "Applying transition shocks by sector..."
     - "Applying physical shocks..."
  7. ⏳ "Revaluating bond portfolio..."
     - "Calculating modified duration and convexity..."
     - "Applying interest rate shock: +0.3%..."
  8. ⏳ "Running Monte Carlo CAT simulation (1,000 trials)..."
     - "Simulating flood events (20% frequency, 40% severity)..."
     - "Simulating drought events (15% frequency, 30% severity)..."
     - "Simulating cyclone events (10% frequency, 50% severity)..."
     - "Simulating wildfire events (8% frequency, 35% severity)..."
  9. ⏳ "Calculating Value at Risk (99.9% confidence)..."
  10. ⏳ "Computing capital and liquidity impacts..."
  11. ✅ "Generating results and visualizations..."

**Time Estimate**: "Estimated completion: ~30 seconds" (for single scenario)

**For Batch Run** ("Run All Scenarios"):

- "Processing 9 scenario combinations (3 scenarios × 3 horizons)..."
- Parallel progress bars for each combination
- "Estimated completion: ~3-5 minutes"

---

### Phase 5: Results Dashboard

#### Step 5.1: Executive Summary Screen

**Screen**: `ScenarioResults.tsx` - Top Section

**User sees at a glance**:

**Key Metrics Cards (4 cards in a row)**:

1. **Total ΔECL (Delta ECL)**
   - Large number: **"GHS 425 million"**
   - Subtitle: "+2.83% of total EAD"
   - Trend icon: 🔺 (upward arrow)
   - Color: Red (negative impact)

2. **Portfolio Value at Risk (VaR 99.9%)**
   - Large number: **"GHS 682 million"**
   - Subtitle: "From Monte Carlo CAT modeling"
   - Trend icon: ⚠️ (warning)
   - Color: Orange

3. **Pillar 2 Capital Add-on**
   - Large number: **"GHS 53 million"**
   - Subtitle: "Additional regulatory capital needed"
   - Trend icon: 💰 (money)
   - Color: Yellow

4. **Implied Temperature Rise**
   - Large number: **"1.8°C"**
   - Subtitle: "By 2100 (Disorderly scenario)"
   - Trend icon: 🌡️ (thermometer)
   - Color: Based on scenario (green <2°C, orange 2-3°C, red >3°C)

**Scenario Header**:

- **Active Scenario**: "Disorderly Transition - Medium Horizon (2028-2035)"
- **Carbon Price**: "$180/tCO2"
- **Physical Damage Index**: "10%"
- **Tabs** to switch scenarios:
  - [ Orderly Transition ]
  - [ **Disorderly Transition** ] ← Active
  - [ Hot House World ]
  - [ Custom ]

#### Step 5.2: ECL Analysis Section

**Components**:

**1. ΔECL Heatmap** (interactive)

- **Axes**:
  - X-axis: Time Horizons (Short, Medium, Long)
  - Y-axis: Scenarios (Orderly, Disorderly, Hot House)
- **Color Scale**:
  - Green (low ΔECL) → Yellow → Orange → Red (high ΔECL)
- **Values in cells**:
  - Absolute: "GHS 425M"
  - Percentage: "2.83% of EAD"
- **Hover tooltip**: "Disorderly - Medium: GHS 425M ΔECL (2.83% of GHS 15B EAD)"
- **Highest value highlighted**: Red border around "Disorderly - Long: GHS 892M"

**2. ECL Breakdown Table**
| Metric | Baseline | Stressed | Delta | % Change |
|--------|----------|----------|-------|----------|
| Expected Credit Loss (ECL) | GHS 169M | GHS 594M | **+GHS 425M** | **+252%** |
| Average PD | 2.5% | 3.8% | +1.3pp | +52% |
| Average LGD | 45% | 52% | +7pp | +16% |

**3. PD/LGD Uplift Metrics**

- **Average PD Uplift**: 1.3 percentage points (130 basis points)
  - Progress bar visualization: 52% increase from baseline
  - Breakdown: "Carbon impact: +0.8pp, GDP impact: +0.5pp"
- **Average LGD Uplift**: 7 percentage points
  - Progress bar: 16% increase from baseline
  - Breakdown: "Physical damage (10% index) × location factors (avg 1.2) × collateral factors (avg 1.3)"

**4. Sector Breakdown** (interactive bar chart)

- **Horizontal bars** showing ΔECL by sector:
  1. Oil & Gas: GHS 127M (30% of total ΔECL) ← Highest
  2. Agriculture: GHS 93M (22%)
  3. Real Estate: GHS 77M (18%)
  4. Cement & Construction: GHS 51M (12%)
  5. Electricity Generation: GHS 42M (10%)
  6. Financial Services: GHS 17M (4%)
  7. Technology: GHS 8M (2%)
  8. Healthcare: GHS 5M (1%)
  9. Air Transport: GHS 3M (1%)
  10. Other: GHS 2M (<1%)
- **Click to drill down**: Shows sub-sector breakdown (e.g., Oil & Gas → Crude Extraction, Refining, Distribution)

**5. Geographic Breakdown** (map or bar chart)

- **Countries/Regions** with highest ΔECL:
  1. Ghana: GHS 276M (65% of ΔECL)
  2. Nigeria: GHS 106M (25%)
  3. South Africa: GHS 25M (6%)
  4. Kenya: GHS 13M (3%)
  5. Other: GHS 5M (1%)
- **Map visualization**: Color-coded by ΔECL intensity

#### Step 5.3: Market Revaluation Section

**1. Equity Portfolio Impact**

- **Baseline Value**: GHS 1.2 billion
- **Stressed Value**: GHS 985 million
- **Mark-to-Market Change**: **-GHS 215 million (-17.9%)**
- **Breakdown**:
  - Transition Risk Shock: -GHS 180M (Oil & Gas -35%, Electricity -25%)
  - Physical Risk Shock: -GHS 35M (Agriculture -10%, Real Estate -8%)
- **Chart**: Waterfall chart showing baseline → transition shock → physical shock → stressed value

**2. Bond Portfolio Impact**

- **Baseline Value**: GHS 1.8 billion
- **Stressed Value**: GHS 1.72 billion
- **Mark-to-Market Change**: **-GHS 80 million (-4.4%)**
- **Methodology**:
  - Modified Duration: 5.5 years (average)
  - Interest Rate Shock: +0.3% (30 bps)
  - Price Change: -1.65% (Duration × IR Shock)
  - Convexity Adjustment: +0.05% (second-order correction)
- **Chart**: Duration sensitivity chart showing price/yield relationship

#### Step 5.4: CAT Modeling Results

**1. Monte Carlo Simulation Summary**

- **Number of Trials**: 1,000
- **VaR Confidence**: 99.9%
- **Expected Loss (EL)**: GHS 125 million
- **VaR (99.9%)**: **GHS 682 million**
- **Maximum Simulated Loss**: GHS 1.15 billion
- **Standard Deviation**: GHS 187 million

**2. Event Type Breakdown** (pie chart or bars)
| Event Type | Contribution to VaR | Affected Sectors | Affected Locations |
|------------|---------------------|------------------|-------------------|
| Flooding | GHS 273M (40%) | Real Estate, Agriculture, Oil & Gas | Lagos, Port Harcourt, Accra |
| Drought | GHS 205M (30%) | Agriculture, Electricity | Kano, Abuja, Northern regions |
| Cyclone | GHS 136M (20%) | Real Estate, Agriculture, Air Transport | Lagos, Accra (coastal) |
| Wildfire | GHS 68M (10%) | Agriculture, Real Estate | Abuja, Kano, savannah regions |

**3. VaR Distribution Chart**

- **Histogram**: Showing distribution of 1,000 simulated losses
- **Green line**: Expected Loss (GHS 125M)
- **Red line**: VaR 99.9% (GHS 682M)
- **Shaded tail**: Losses exceeding VaR (0.1% of trials)
- **Annotations**:
  - "99.9% of scenarios result in losses below GHS 682M"
  - "Tail events (1 in 1000) can exceed GHS 1B"

**4. Top 10 Riskiest Loans by CAT VaR**
| Loan ID | Sector | Location | Collateral Type | CAT VaR | % of EAD |
|---------|--------|----------|----------------|---------|----------|
| LN-12345 | Real Estate | Lagos | Real Estate | GHS 15M | 2.2% |
| LN-67890 | Agriculture | Port Harcourt | Inventory | GHS 12M | 1.8% |
| ... | ... | ... | ... | ... | ... |

#### Step 5.5: Capital & Liquidity Impacts

**1. Capital Requirements Summary**
| Metric | Baseline | With Climate Risk | Delta |
|--------|----------|-------------------|-------|
| Total EAD | GHS 15.0B | GHS 15.0B | - |
| Risk-Weighted Assets (RWA) | GHS 12.5B | GHS 12.5B | - |
| Pillar 1 Min Capital (15%) | GHS 1.88B | GHS 1.88B | - |
| **Pillar 2 Climate Add-on** | - | **GHS 53M** | **+GHS 53M** |
| **Total Capital Requirement** | GHS 1.88B | **GHS 1.93B** | **+GHS 53M** |
| **As % of RWA** | 15.0% | **15.4%** | **+0.4pp** |

**2. Pillar 2 Add-on Calculation**

- Formula: ΔECL + CAT VaR
- Worst-Case ΔECL (Disorderly-Long): GHS 892M
- CAT VaR (99.9%): GHS 682M
- **Total Climate Risk Capital**: GHS 1.57B
- **Conservative buffer (10%)**: GHS 157M
- **Pillar 2 Add-on**: GHS 53M (chosen conservatively)

**3. Liquidity Impact Analysis**

- **Total Collateral Value (Eligible)**: GHS 10.5B
- **Physical Damage-Driven Haircut**: 19.5% (Hot House-Long scenario)
- **Liquidity Buffer Reduction**: GHS 2.05B
- **Implications**:
  - ⚠️ Reduced High-Quality Liquid Assets (HQLA) if loans used in repo
  - ⚠️ Potential LCR shortfall requiring additional liquid assets
  - ⚠️ NSFR impact if collateral value reduces Available Stable Funding

**4. Capital Adequacy Visualization**

- **Stacked bar chart**:
  - Bar 1: Current Capital Held: GHS 2.3B
  - Bar 2: Pillar 1 Requirement: GHS 1.88B
  - Bar 3: Pillar 2 Climate Add-on: +GHS 53M
  - Bar 4: Total Requirement: GHS 1.93B
  - Surplus: GHS 370M (green segment)

#### Step 5.6: Sensitivity Analysis

**User can click "Sensitivity Analysis" tab**

**1. Tornado Chart: Parameter Sensitivity**

- **Shows impact of ±50% parameter changes on ΔECL**
- Horizontal bars (baseline in center):
  - Carbon Price: ±GHS 212M (±50%)
  - Beta Parameters: ±GHS 212M (±50%)
  - Physical Damage Index: ±GHS 64M (±15%)
  - GDP Shock: ±GHS 127M (±30%)
- **Insights**: "ΔECL is most sensitive to carbon price and beta parameters"

**2. Scenario Comparison Table**
| Scenario | Horizon | ΔECL | VaR 99.9% | Capital Add-on | Temp Rise |
|----------|---------|------|-----------|----------------|-----------|
| Orderly | Short | GHS 75M | GHS 210M | GHS 12M | 1.5°C |
| Orderly | Medium | GHS 168M | GHS 385M | GHS 25M | 1.5°C |
| Orderly | Long | GHS 252M | GHS 520M | GHS 35M | 1.5°C |
| Disorderly | Short | GHS 312M | GHS 580M | GHS 45M | 1.8°C |
| **Disorderly** | **Medium** | **GHS 425M** | **GHS 682M** | **GHS 53M** | **1.8°C** |
| Disorderly | Long | GHS 892M | GHS 1.1B | GHS 98M | 1.8°C |
| Hot House | Short | GHS 95M | GHS 310M | GHS 18M | 3.2°C |
| Hot House | Medium | GHS 378M | GHS 725M | GHS 58M | 3.2°C |
| Hot House | Long | GHS 1.45B | GHS 2.3B | GHS 185M | 3.2°C |

**3. Trajectory Charts**

- **Carbon Price Trajectories**: Line chart showing 2026-2055 pathways
  - Orderly: Smooth rise to $250/tCO2
  - Disorderly: Spike post-2030 to $280/tCO2
  - Hot House: Flat at $20-30/tCO2
- **Physical Damage Trajectories**: Line chart showing cumulative damage
  - Hot House: Exponential rise to 60% by 2055
  - Disorderly: Moderate rise to 20%
  - Orderly: Contained at 12%

#### Step 5.7: Detailed Breakdown (Drill-Down)

**User can click "View Detailed Breakdown" button**

**Tabbed Interface**:

**Tab 1: Sector Analysis**

- Table with all 10 sectors showing:
  - Baseline ECL
  - Stressed ECL
  - ΔECL (absolute and %)
  - Average PD Uplift
  - Average LGD Uplift
  - % of Total ΔECL
- **Sortable** columns
- **Export to Excel** button

**Tab 2: Geographic Analysis**

- Similar table for 6 countries/regions
- Map visualization option

**Tab 3: Rating Grade Analysis**

- Breakdown by AAA → CCC ratings
- Shows migration: "12 loans downgraded from A to BBB due to climate stress"

**Tab 4: Collateral Type Analysis**

- Real Estate: Highest LGD uplift (physical damage)
- Financial Assets: Minimal LGD uplift
- Uncollateralized: LGD unchanged (already 100%)

**Tab 5: Loan-Level Details**

- Full loan book with stressed PD, LGD, ECL columns
- Filter/search functionality
- Download CSV: "stressed_loan_book_disorderly_medium_2026.csv"

---

### Phase 6: Reporting & Export

#### Step 6.1: Report Generation

**User clicks "Generate Report" button**

**Report Options Modal**:

1. **Executive Summary** (PDF, 5 pages)
   - Key metrics dashboard
   - ECL heatmap
   - Sector concentration chart
   - Top 3 recommendations
2. **Full Technical Report** (PDF, 25-30 pages)
   - Methodology documentation
   - All visualizations
   - Detailed breakdowns
   - Sensitivity analysis
   - Assumptions and parameters
   - Appendix: loan-level data summary

3. **TCFD Disclosure Template** (Word/PDF)
   - Pre-populated sections:
     - Governance
     - Strategy (with scenario analysis results)
     - Risk Management
     - Metrics and Targets
   - Editable fields for narrative text

4. **ICAAP/ILAAP Annex** (Excel)
   - Capital adequacy calculations
   - Pillar 2 add-on justification
   - Liquidity stress testing results
   - Regulatory submission format

**User Actions**:

- Select report type(s): Checkboxes
- Add custom notes: Text field ("Add management commentary...")
- Select language: Dropdown (English, French)
- Click "Generate Report"

**System Response**:

- Progress: "Generating report... 80%"
- Download link: "Your report is ready! [Download PDF]"
- Auto-email option: "Send to: cfo@gcbbank.com.gh"

#### Step 6.2: Data Export

**User clicks "Export Data" button**

**Export Options**:

1. **Full Results (JSON)**
   - Includes all scenario runs
   - Structured for API integration
   - Filename: `scenario_results_2026-02-04.json`

2. **ECL Results (Excel)**
   - Tabs:
     - Summary (ΔECL heatmap table)
     - Sector Breakdown
     - Geographic Breakdown
     - Rating Breakdown
     - Loan-Level Stressed PD/LGD/ECL
   - Filename: `ecl_stress_results.xlsx`

3. **Visualizations (PNG/SVG)**
   - Zip file containing all charts:
     - ΔECL heatmap
     - Sector breakdown bar chart
     - VaR distribution histogram
     - Waterfall chart
     - Trajectory charts
   - Filename: `visualizations.zip`

4. **Monte Carlo Trials (CSV)**
   - All 1,000 trial results
   - Columns: TrialID, FloodLoss, DroughtLoss, CycloneLoss, WildfireLoss, TotalLoss
   - Filename: `monte_carlo_cat_trials.csv`

#### Step 6.3: Share & Collaborate

**User clicks "Share" button**

**Sharing Options**:

1. **Generate Link**
   - Creates unique URL: `https://gcb-esg.app/scenario/results/abc123`
   - Expiry: 7 days (configurable)
   - Access control: Password-protected or SSO

2. **Email Results**
   - To: Multiple recipients (comma-separated)
   - Subject: Auto-filled "Climate Scenario Analysis Results - Disorderly Medium"
   - Message: Custom text
   - Attachments: Select from report types

3. **Add to Dashboard**
   - Save scenario results to user's personal dashboard
   - Pin as "Favorite Scenario"
   - Set alerts: "Notify me if ΔECL exceeds GHS 500M in future runs"

---

### Phase 7: Continuous Monitoring & Updates

#### Step 7.1: Scenario Comparison Dashboard

**User navigates to "My Scenarios" page**

**Displays**:

- **Scenario History Table**:
  | Date Run | Scenario | Horizon | ΔECL | VaR | Capital Impact | Status | Actions |
  |----------|----------|---------|------|-----|----------------|--------|---------|
  | 2026-02-04 | Disorderly | Medium | GHS 425M | GHS 682M | +GHS 53M | ✅ Complete | View / Export / Delete |
  | 2026-01-15 | Orderly | Long | GHS 252M | GHS 520M | +GHS 35M | ✅ Complete | View / Export / Delete |
  | 2025-12-10 | Hot House | Long | GHS 1.45B | GHS 2.3B | +GHS 185M | ✅ Complete | View / Export / Delete |

- **Comparison Mode**:
  - User selects 2-3 scenarios (checkboxes)
  - Click "Compare Selected"
  - Side-by-side dashboard with difference highlighting:
    - "Disorderly-Medium ΔECL is 68% higher than Orderly-Medium"
    - Chart: Overlaid ΔECL bars
    - Chart: VaR distribution comparison

#### Step 7.2: Parameter Update & Re-run

**User clicks "Edit & Re-run" on historical scenario**

**System**:

- Pre-loads previous parameters
- User adjusts (e.g., update carbon price to latest NGFS Phase 6 data)
- Click "Re-run with Updated Parameters"
- New results saved separately: "Disorderly-Medium (Updated 2026-02-04)"
- Comparison view: "ΔECL increased by GHS 38M (+9%) due to carbon price update"

#### Step 7.3: Automated Alerts

**User navigates to "Settings" → "Alerts"**

**Configurable Alerts**:

1. **Threshold Alerts**:
   - "Alert me when ΔECL exceeds GHS 500M" → Email/SMS
   - "Alert me when VaR exceeds GHS 750M" → Email/SMS
   - "Alert me when Pillar 2 add-on > GHS 75M" → Email

2. **Data Update Alerts**:
   - "Notify me when new NGFS scenarios are released" → Email
   - "Remind me to re-run quarterly" → Calendar invite

3. **Portfolio Change Alerts**:
   - "Alert me when high-carbon exposure exceeds 35%" → Dashboard notification
   - "Notify me when new sector exposures are added" → Email

---

## Advanced Features

### Multi-Scenario Batch Processing

**Location**: Scenario Selection → "Run All Scenarios"

**Workflow**:

1. User clicks "Run All Scenarios"
2. System runs **9 combinations** (3 scenarios × 3 horizons)
3. Progress dashboard shows:
   - Parallel execution (if backend supports)
   - Estimated time: 3-5 minutes
   - Status for each: ✅ Complete | ⏳ Running | ⏸️ Queued
4. Results: Comprehensive heatmap with all 9 cells populated
5. Automatic identification: "Worst case: Hot House-Long with ΔECL of GHS 1.45B"

### Probability-Weighted ECL

**Location**: Advanced Settings

**Workflow**:

1. User assigns probabilities to scenarios:
   - Orderly: 30%
   - Disorderly: 50%
   - Hot House: 20%
2. System calculates probability-weighted ΔECL:
   - ΔECL_weighted = (0.30 × ΔECL_Orderly) + (0.50 × ΔECL_Disorderly) + (0.20 × ΔECL_Hot House)
3. Result: "Probability-weighted ΔECL: GHS 598M"
4. Use case: "IFRS 9 Stage 2/3 ECL estimation with multiple scenarios"

### Geographic Risk Mapping

**Location**: Results → "Geographic Analysis" → "Map View"

**Features**:

- **Interactive Map of Ghana**:
  - Color-coded regions by ΔECL intensity
  - Clickable locations (Lagos, Accra, Kano, etc.)
  - Popup tooltips: "Lagos: GHS 127M ΔECL, 340 loans, High flood risk"
- **Overlay Options**:
  - Physical hazard layers: Flood zones, drought-prone areas, coastal erosion
  - Collateral concentrations: Circles sized by total collateral value
  - Branch locations: Show bank branches overlaid on risk map

### Integration with Risk Systems

**API Endpoints** (for developers):

- `POST /api/scenario/run`: Submit scenario parameters, receive results
- `GET /api/scenario/results/{id}`: Retrieve historical results
- `POST /api/portfolio/upload`: Upload portfolio data programmatically
- `GET /api/ngfs/scenarios`: Fetch latest NGFS data

**Webhook Notifications**:

- Notify external systems when scenario completes
- Push results to enterprise risk dashboard
- Trigger downstream processes (e.g., capital allocation model)

---

## User Roles & Permissions

### Risk Analyst

**Can**:

- Run scenarios
- Customize parameters
- View all results
- Export data
- Generate technical reports

**Cannot**:

- Approve capital add-ons
- Change portfolio data
- Configure system-wide settings

### Risk Manager

**Can**:

- All Risk Analyst permissions
- Approve/reject scenario assumptions
- Add management commentary to reports
- Configure alerts
- Share results with Board

**Cannot**:

- Modify backend calculation methodology
- Change beta parameters system-wide

### CFO/CRO (Executive)

**Can**:

- View executive summaries
- Access all historical scenarios
- Download TCFD disclosure templates
- Configure capital adequacy thresholds

**Cannot**:

- Run scenarios directly (delegated to team)
- Modify technical parameters

### System Administrator

**Can**:

- All permissions
- Configure NGFS data sources
- Update beta parameters
- Manage user access
- Export audit logs

---

## Error Handling & Edge Cases

### Invalid Portfolio Data

**Scenario**: User uploads loan book with PD > 1.0

**System Response**:

- ❌ Validation error: "23 loans have invalid PD values (must be 0-1)"
- Highlight rows in red: "Row 145: PD = 1.25"
- Offer fix: "Auto-cap at 1.0?" → User clicks "Yes"
- Re-validate: ✅ "All PD values corrected"

### Missing Required Fields

**Scenario**: Collateral location missing for 150 loans

**System Response**:

- ⚠️ Warning: "150 loans missing collateral location"
- Default behavior: "Will use 'Other' location (risk factor = 0.5)"
- User option: "Upload collateral mapping file" or "Proceed with defaults"

### Extreme Parameter Values

**Scenario**: User sets carbon price to $1,000/tCO2

**System Response**:

- ⚠️ Caution modal: "Carbon price $1,000/tCO2 is 4x higher than NGFS maximum. Results may be unrealistic."
- Options:
  - "Proceed anyway" (for extreme stress testing)
  - "Reset to NGFS maximum ($250/tCO2)"

### Calculation Timeout

**Scenario**: Monte Carlo with 10,000 trials takes too long

**System Response**:

- After 2 minutes: "Calculation taking longer than expected... 65% complete"
- After 5 minutes: Offer option to "Continue in background and email results"
- User clicks "Continue in background"
- Email sent when complete: "Your scenario analysis is ready!"

---

## Performance Optimization

### Caching

- **Scenario Parameters**: Cache NGFS default parameters (refreshed quarterly)
- **Portfolio Data**: Cache uploaded data for 24 hours (session-based)
- **Results**: Cache completed scenarios for 30 days (user can extend)

### Parallel Processing

- **Batch Runs**: Process all 9 scenarios in parallel (if backend supports multi-threading)
- **Monte Carlo**: Distribute 1,000 trials across 10 workers (100 trials each)

### Progressive Loading

- **Results Dashboard**: Load executive summary first (1 second)
- **Detailed Tables**: Load on-demand when user clicks tab (2-3 seconds)
- **Visualizations**: Render charts asynchronously (SVG for faster rendering)

---

## Future Enhancements (Roadmap)

### Q2 2026

1. **AI-Powered Insights**
   - Natural language summary: "Your portfolio is most vulnerable to Disorderly scenario due to 30% exposure to Oil & Gas sector"
   - Recommendation engine: "Consider reducing high-carbon exposure by 10% to lower ΔECL to GHS 340M"

2. **Real-Time NGFS Updates**
   - Auto-refresh scenario parameters when NGFS releases new data
   - Notification: "New NGFS Phase 6 data available. Re-run your scenarios?"

### Q3 2026

3. **Machine Learning Calibration**
   - Train beta parameters on historical loan performance data
   - Sector-specific PD models: "Oil & Gas beta_carbon optimized to 0.0052 based on 2020-2025 data"

4. **Integration with TCFD Platform**
   - One-click export to TCFD reporting tool
   - Auto-populate climate risk disclosures

### Q4 2026

5. **Transition Planning Module**
   - "What-if" analysis: "If we reduce Oil & Gas exposure to 15%, ΔECL drops to GHS 310M (-27%)"
   - Portfolio optimization: Suggest reallocation strategies to minimize climate risk

6. **Board Dashboard**
   - Executive-level visualization: Traffic light system (green/yellow/red for scenarios)
   - Quarterly trend charts: "ΔECL trending down 8% since Q1 2026"

---

## Appendix: Technical Methodology Summary

### PD Stress Testing (Logit Transformation)

```
Logit(PD₀) = ln(PD₀ / (1 - PD₀))
Logit(PD_stressed) = Logit(PD₀) + βcarbon × CarbonPrice × HighCarbonShare + βGDP × GDPShock + βrating
PD_stressed = 1 / (1 + e^(-Logit(PD_stressed)))
```

### LGD Adjustment (Physical Damage)

```
LGD_stressed = LGD₀ + (1 - LGD₀) × PhysicalDamageIndex × LocationFactor × CollateralFactor
```

### ECL Calculation

```
ECL_baseline = EAD × PD₀ × LGD₀
ECL_stressed = EAD × PD_stressed × LGD_stressed
ΔECL = ECL_stressed - ECL_baseline
```

### Monte Carlo CAT Simulation

```
For each trial (1 to 1000):
  For each event type (Flood, Drought, Cyclone, Wildfire):
    If random() < adjusted_frequency:
      severity = sample from Beta(α, β)
      loss = Σ (EAD × severity × LGD_incremental) for affected loans
  trial_loss = Σ event_losses

VaR(99.9%) = 99.9th percentile of trial_losses
```

### Bond Revaluation (Duration + Convexity)

```
ΔPrice/Price = -ModifiedDuration × ΔYield + 0.5 × Convexity × (ΔYield)²
```

---

## Contact & Support

**GCB ESG Navigator Support Team**

- **Email**: esg-support@gcbbank.com.gh
- **Phone**: +233 (0) 302 664 910
- **User Guide**: Available in-app under "Help" menu
- **Training Sessions**: Monthly webinars (register via dashboard)

**Feedback**:

- Submit feature requests: "Feedback" button in top-right corner
- Bug reports: Auto-logged with screenshot and user session data

---

**Document Version**: 2.0  
**Last Updated**: February 4, 2026  
**Based on**: Bank CRA MODEL.ipynb (2205-line comprehensive stress testing framework)  
**Maintained by**: GCB Bank Ghana - Climate Risk Analytics Team
