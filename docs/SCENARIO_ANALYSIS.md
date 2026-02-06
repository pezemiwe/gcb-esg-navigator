# Climate Scenario Analysis Module

## Overview

The GCB ESG Navigator's Climate Scenario Analysis module provides comprehensive stress testing capabilities aligned with **NGFS (Network for Greening the Financial System) Phase 5** scenarios and **IFRS 9** ECL (Expected Credit Loss) principles.

This module enables GCB Bank Ghana to assess climate-related financial risks across different transition and physical risk scenarios, supporting strategic planning, regulatory compliance, and climate risk management.

---

## NGFS Scenario Framework

### 1. **Orderly Transition (Net Zero 2050)**

- **Description**: Immediate and ambitious climate action starting now, with smooth transition to net zero emissions by 2050
- **Temperature Rise**: Limited to **1.5°C** by 2100
- **Characteristics**:
  - High transition risk (carbon price: $75 → $250/tCO2)
  - Low physical risk (damage index: 5% → 12%)
  - Immediate policy implementation
  - Manageable economic disruption
- **Use Case**: Best-case scenario planning, green asset strategy development

### 2. **Disorderly Transition**

- **Description**: Climate action delayed until 2030, followed by abrupt and disruptive policy tightening
- **Temperature Rise**: **1.8°C** by 2100
- **Characteristics**:
  - Very high transition risk shock (carbon price spike: $35 → $280/tCO2)
  - Medium physical risk (damage index: 8% → 20%)
  - Severe economic disruption post-2030
  - Mixed transition and physical impacts
- **Use Case**: Stress testing for policy shock, worst-case transition scenario

### 3. **Hot House World (Current Policies)**

- **Description**: Only currently implemented policies continue; emissions remain high leading to severe physical impacts
- **Temperature Rise**: **>3.2°C** by 2100
- **Characteristics**:
  - Low transition risk (minimal carbon pricing: $10 → $30/tCO2)
  - Extreme physical risk (damage index: 10% → 60%)
  - Severe floods, droughts, heat waves, cyclones
  - Long-term economic degradation
- **Use Case**: Physical risk stress testing, climate adaptation planning

### 4. **Custom Scenario**

- **Description**: User-defined scenario with adjustable parameters
- **Use Case**: Sensitivity analysis, Ghana-specific climate pathways

---

## Technical Methodology

### Probability of Default (PD) Uplift Calculation

The module uses **logit transformation** methodology to calculate stressed PD:

```
Logit(PD₀) = ln(PD₀ / (1 - PD₀))

Logit(PD_stressed) = Logit(PD₀) + βcarbon × CarbonPrice × HighCarbonExposure%
                                 + βGDP × GDPShock

PD_stressed = 1 / (1 + e^(-Logit(PD_stressed)))
```

**Calibrated Parameters** (from Bank CRA MODEL.ipynb):

- `βcarbon` = 0.0008 (carbon price sensitivity per $1/tCO2)
- `βGDP` = -0.15 (GDP shock sensitivity)
- High-carbon exposure = 30% (Oil & Gas, heavy industry)
- PD uplift capped at 50 percentage points

### Loss Given Default (LGD) Adjustment

Physical damage impacts collateral values:

```
LGD_stressed = LGD₀ + (PhysicalDamageIndex × βphysical × 0.25)
```

- `βphysical` = 1.0 (physical damage multiplier)
- Physical damage index ranges: 5% (orderly) to 60% (hot house)
- LGD capped at 100%

### Expected Credit Loss (ECL) Calculation

```
ECL_baseline = Exposure × PD₀ × LGD₀

ECL_stressed = Exposure × PD_stressed × LGD_stressed

ΔECL = ECL_stressed - ECL_baseline
```

**Sector Breakdown**: ECL calculated separately for:

- Oil & Gas (highest transition risk)
- Agriculture (high physical risk)
- Real Estate (medium physical risk)
- Manufacturing (medium transition risk)
- Other sectors

### Market Revaluation

**Equity Portfolio Impact**:

```
Transition Shock = -15% per $100/tCO2 carbon price
Physical Shock = -20% × Physical Damage Index

Equity Revaluation = Equity Exposure × (Transition + Physical Shocks)
```

**Bond Portfolio Impact**:

```
Duration Shock = Interest Rate Shock × Modified Duration (5.5 years)

Bond Revaluation = Bond Exposure × (Duration Shock / 100)
```

### Monte Carlo Catastrophic (CAT) Modeling

Ghana-specific catastrophe probabilities adjusted by physical damage index:

| Event Type | Base Frequency | Base Severity | Physical Multiplier |
| ---------- | -------------- | ------------- | ------------------- |
| Flooding   | 0.2%           | 40%           | 1 + Damage Index    |
| Drought    | 0.15%          | 30%           | 1 + Damage Index    |
| Cyclone    | 0.1%           | 50%           | 1 + Damage Index    |
| Wildfire   | 0.05%          | 35%           | 1 + Damage Index    |

**Total CAT Loss** = Σ (Exposure × Frequency × Severity × Multiplier)

### Value at Risk (VaR) Calculation

99.9% confidence interval using normal distribution approximation:

```
Expected Loss = ΔECL + CAT Loss Total
Volatility = Expected Loss × 35%
Z-score (99.9%) = 3.09

VaR₉₉.₉% = Expected Loss + (3.09 × Volatility)
```

### Regulatory Capital Impact

**Pillar 2 Capital Add-on**:

```
Capital Add-on = ΔECL × 12.5% (Basel III multiplier)
Capital Impact % = (Capital Add-on / Total Exposure) × 100
```

**Liquidity Impact** (collateral haircut):

```
Liquidity Impact = Exposure × Physical Damage Index × 15%
```

---

## Time Horizons

### Short-Term (1-3 years)

- **2026-2028**
- Immediate transition policy impacts
- Near-term physical risk events
- Portfolio rebalancing period

### Medium-Term (3-10 years)

- **2028-2035**
- Carbon price trajectories materialize
- Structural economic changes
- Strategic adaptation phase

### Long-Term (10-30 years)

- **2035-2055**
- Full temperature rise impacts
- Cumulative physical damages
- Long-term sustainability outcomes

---

## Key Outputs

### 1. Expected Credit Loss (ECL) Analysis

- **Baseline ECL**: Current portfolio ECL under business-as-usual
- **Stressed ECL**: Climate-adjusted ECL under scenario
- **ΔECL**: Incremental loss from climate impacts
- **ΔECL %**: Percentage of total exposure
- **Sector Breakdown**: ECL by economic sector

### 2. Portfolio Value at Risk

- **VaR₉₉.₉%**: 99.9% confidence loss threshold
- **CAT Model Results**: Catastrophic event breakdown
- **Market Revaluation**: Equity and bond portfolio impacts

### 3. Capital and Liquidity Impacts

- **Pillar 2 Capital Add-on**: Additional regulatory capital needed
- **Capital Impact %**: Percentage increase in capital requirements
- **Liquidity Impact**: Collateral valuation haircuts

### 4. Climate Metrics

- **Implied Temperature Rise**: Scenario temperature pathway
- **Carbon Price Trajectory**: $/tCO2 over time
- **Physical Damage Index**: Cumulative damage percentage
- **Macroeconomic Shocks**: GDP, inflation, interest rate impacts

---

## Data Requirements

### Portfolio Data Integration

The module integrates with uploaded portfolio data from the CRA Data Upload module:

**Required Fields**:

- `outstandingBalance` (or `exposure`, `notional`, `parValue`) - Total exposure
- `sector` - Economic sector classification
- `assetType` - Equities, Bonds, Loans, Commodities, etc.
- `maturityDate` - For duration calculations
- `couponRate` - For bond valuation

**Data Sources**:

- `loans_portfolio_Q1_2026.csv`
- `equities_portfolio.csv`
- `corporate_bonds_mixed.csv`

**Sector Classification** (aligned with Ghana market):

- Oil & Gas
- Agriculture
- Real Estate
- Manufacturing
- Financial Services
- Telecommunications
- Mining
- Other

---

## Usage Workflow

### Step 1: Select Scenario

Choose from:

- Orderly Transition (Net Zero 2050)
- Disorderly Transition
- Hot House World (Current Policies)
- Custom Scenario

### Step 2: Configure Parameters (Custom Scenario)

Adjust key assumptions:

- **Carbon Price** ($/tCO2): 0-500
- **GDP Shock** (%): -5% to +2%
- **Inflation Shock** (%): -2% to +5%
- **Interest Rate Shock** (%): -2% to +5%
- **Physical Damage Index**: 0-100%
- **Beta Sensitivities**: βcarbon, βGDP, βphysical
- **Monte Carlo Trials**: 100-10,000
- **VaR Confidence**: 95%-99.9%

### Step 3: Run Scenario Analysis

The module executes:

1. PD/LGD stress calculations
2. ECL computations across sectors
3. Market revaluation (equities, bonds)
4. Monte Carlo CAT simulations
5. VaR and capital impact calculations

### Step 4: Review Results

Interactive dashboards display:

- ECL delta heatmaps (scenario × time horizon)
- Sector vulnerability bar charts
- PD/LGD uplift metrics
- Temperature rise indicators
- Capital impact waterfall charts
- CAT model event breakdown

### Step 5: Export and Share

- **PDF Reports**: Executive summaries with charts
- **JSON Data**: Full results for further analysis
- **Share Links**: Collaborative review

---

## Alignment with Standards

### NGFS Phase 5 (2024)

- ✅ Three core scenarios (Orderly, Disorderly, Hot House)
- ✅ Carbon price pathways
- ✅ Macroeconomic shock parameters
- ✅ Physical damage indices
- ✅ Temperature rise projections

### IFRS 9 ECL Principles

- ✅ Forward-looking credit loss estimation
- ✅ Probability-weighted scenarios
- ✅ Staging and lifetime ECL concepts
- ✅ Macroeconomic factor integration

### TCFD (Task Force on Climate-related Financial Disclosures)

- ✅ Scenario analysis requirement
- ✅ 2°C and >3°C pathways
- ✅ Transition and physical risk separation
- ✅ Metrics and targets disclosure

### Bank of Ghana Regulatory Guidance

- ✅ Climate risk stress testing
- ✅ Pillar 2 capital adequacy
- ✅ Liquidity risk management
- ✅ Sectoral exposure analysis

---

## Ghana-Specific Considerations

### High-Risk Sectors for Ghana

1. **Agriculture** (25% of GDP)
   - High vulnerability to drought and flooding
   - Critical for food security and employment
2. **Oil & Gas** (10% of GDP)
   - High transition risk from carbon pricing
   - Stranded asset risk in disorderly scenarios

3. **Mining** (15% of GDP)
   - Physical risk from water scarcity
   - Transition risk from energy-intensive operations

4. **Real Estate** (Coastal Areas)
   - Sea level rise impacts Accra, Tema
   - Flood risk in major urban centers

### Physical Hazards in Ghana

- **Flooding**: Rainy season impacts (April-October)
- **Drought**: Northern regions (Savannah, Upper regions)
- **Heat Stress**: Temperature rise 2-4°C by 2050
- **Coastal Erosion**: Atlantic coastline degradation

### Transition Opportunities

- Renewable energy expansion (solar, hydro)
- Green bonds for climate adaptation
- Sustainable agriculture financing
- Climate-resilient infrastructure

---

## Calculation Examples

### Example 1: Orderly Transition - Medium Horizon (3-10 years)

**Inputs**:

- Total Exposure: GHS 15 billion
- Baseline PD: 2.5%
- Baseline LGD: 45%
- Carbon Price: $160/tCO2
- GDP Shock: -1.0%
- Physical Damage Index: 8%

**PD Calculation**:

```
Logit(PD₀) = ln(0.025 / 0.975) = -3.66
Carbon Impact = 0.0008 × 160 × 0.30 = 0.0384
GDP Impact = -0.15 × (-1.0) = 0.15
Logit(PD_stressed) = -3.66 + 0.0384 + 0.15 = -3.47
PD_stressed = 1/(1 + e^3.47) = 3.0%
PD Uplift = 3.0% - 2.5% = 0.5 percentage points
```

**LGD Calculation**:

```
LGD_uplift = 0.08 × 1.0 × 0.25 = 0.02 (2%)
LGD_stressed = 45% + 2% = 47%
```

**ECL Calculation**:

```
ECL_baseline = 15B × 0.025 × 0.45 = GHS 168.75M
ECL_stressed = 15B × 0.030 × 0.47 = GHS 211.5M
ΔECL = 211.5M - 168.75M = GHS 42.75M (0.285% of exposure)
```

**Capital Impact**:

```
Pillar 2 Add-on = 42.75M × 12.5% = GHS 5.34M
Capital Impact = (5.34M / 15B) × 100 = 0.036%
```

### Example 2: Hot House World - Long Horizon (10-30 years)

**Inputs**:

- Total Exposure: GHS 15 billion
- Baseline PD: 2.5%
- Baseline LGD: 45%
- Carbon Price: $30/tCO2 (low)
- GDP Shock: -3.5% (severe physical impacts)
- Physical Damage Index: 60%

**Results**:

- PD_stressed: 5.8%
- LGD_stressed: 60%
- ΔECL: GHS 445M (2.97% of exposure)
- VaR₉₉.₉%: GHS 682M
- Capital Impact: 0.37%

---

## Technical Implementation

### Store Architecture (`scenarioStore.ts`)

**State Management**: Zustand with localStorage persistence

**Key Functions**:

- `createScenario()`: Initialize scenario with NGFS parameters
- `updateParameter()`: Adjust custom scenario assumptions
- `runScenario()`: Execute single scenario analysis
- `runAllScenarios()`: Batch run all scenarios × horizons
- `exportResults()`: JSON export for reporting

**Calculation Engine**:

- `calculateScenarioImpact()`: Main ECL calculation
- `calculateEquityImpact()`: Equity revaluation
- `calculateBondImpact()`: Bond duration shock
- `runMonteCarloCAT()`: Catastrophic event simulation
- `calculateVaR()`: Value at risk computation

### UI Components

**ScenarioSelection.tsx**:

- NGFS scenario cards with descriptions
- Visual indicators (icons, colors)
- Scenario parameter previews

**AssumptionEditor.tsx**:

- Interactive parameter sliders
- Real-time validation
- Contextual help tooltips
- Default NGFS values pre-filled

**ScenarioResults.tsx**:

- Multi-tab scenario comparison
- ECL heatmaps (Recharts)
- Sector vulnerability bar charts
- Key metrics cards (VaR, capital impact)
- PDF/JSON export

---

## Future Enhancements

### Planned Features

1. **Multi-Scenario Probability Weighting**
   - Assign probabilities to scenarios (e.g., 30% Orderly, 50% Disorderly, 20% Hot House)
   - Calculate probability-weighted ECL

2. **Dynamic Sector Mapping**
   - Automatic sector classification from counterparty data
   - Ghana-specific sector taxonomy

3. **Enhanced CAT Modeling**
   - Geospatial risk mapping for Ghana regions
   - Historical loss data integration
   - Climate model ensemble forecasts

4. **Sensitivity Analysis Dashboard**
   - Tornado charts for parameter sensitivities
   - Monte Carlo parameter distributions
   - Scenario convergence testing

5. **TCFD Report Generator**
   - Automated disclosure templates
   - Narrative generation (AI-assisted)
   - Governance and strategy sections

6. **API Integration**
   - NGFS scenario data feeds
   - Climate model APIs (CMIP6)
   - Real-time carbon price indices

---

## References

### Regulatory and Standards

- **NGFS**: [Climate Scenarios for Central Banks and Supervisors](https://www.ngfs.net/en/ngfs-scenarios-portal)
- **IFRS 9**: Financial Instruments - Expected Credit Loss Model
- **TCFD**: [Recommendations of the Task Force on Climate-related Financial Disclosures](https://www.fsb-tcfd.org/)
- **Bank of Ghana**: Climate Risk Guidance Notes

### Technical Sources

- **Bank CRA MODEL.ipynb**: Internal stress testing methodology notebook
- **Ghana Climate Vulnerability Report**: Physical hazard assessments
- **IPCC AR6**: Climate change projections for West Africa

### Academic Literature

- Battiston et al. (2017): "A climate stress-test of the financial system"
- Vermeulen et al. (2019): "The heat is on: A framework for measuring financial stress under disruptive energy transition scenarios"
- Roncoroni et al. (2021): "Climate risk and financial stability in the network of banks and investment funds"

---

## Support and Feedback

**GCB ESG Navigator Team**

- **Technical Support**: [esg-navigator@gcbbank.com.gh](mailto:esg-navigator@gcbbank.com.gh)
- **User Guides**: `/docs` folder in repository
- **Bug Reports**: GitHub Issues
- **Feature Requests**: Product roadmap board

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained by**: GCB Bank Ghana - Climate Risk Analytics Team
