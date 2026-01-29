/* eslint-disable @typescript-eslint/no-explicit-any */
export const TEMPLATE_DEFINITIONS = {
  loans_advances: {
    name: "Loans & Advances",
    columns: [
      {
        field: "Facility ID",
        type: "string",
        required: true,
        description: "Unique identifier for the facility",
      },
      {
        field: "Borrower Name",
        type: "string",
        required: true,
        description: "Name of the borrower",
      },
      {
        field: "Sector",
        type: "string",
        required: true,
        description: "Economic sector",
      },
      {
        field: "Subsector",
        type: "string",
        required: false,
        description: "Economic subsector",
      },
      {
        field: "Product Type",
        type: "string",
        required: true,
        description: "Type of loan product",
      },
      {
        field: "Loan Amount",
        type: "number",
        required: true,
        description: "Original loan amount",
      },
      {
        field: "Outstanding Balance",
        type: "number",
        required: true,
        description: "Current outstanding balance",
      },
      {
        field: "Currency",
        type: "string",
        required: true,
        description: "Currency code (e.g., GHS, USD)",
      },
      {
        field: "Tenor (months)",
        type: "number",
        required: true,
        description: "Loan tenor in months",
      },
      {
        field: "Interest Rate (%)",
        type: "number",
        required: true,
        description: "Annual interest rate",
      },
      {
        field: "Origination Date",
        type: "date",
        required: true,
        description: "Date when loan was originated",
      },
      {
        field: "Maturity Date",
        type: "date",
        required: true,
        description: "Loan maturity date",
      },
      {
        field: "Status",
        type: "string",
        required: true,
        description: "Loan status (Active, NPL, Written-off, etc.)",
      },
      {
        field: "Address",
        type: "string",
        required: false,
        description: "Physical address",
      },
      {
        field: "Region",
        type: "string",
        required: true,
        description: "Administrative region",
      },
      { field: "City", type: "string", required: false, description: "City" },
      {
        field: "Country",
        type: "string",
        required: true,
        description: "Country",
      },
      {
        field: "Latitude",
        type: "number",
        required: false,
        description: "GPS latitude",
      },
      {
        field: "Longitude",
        type: "number",
        required: false,
        description: "GPS longitude",
      },
      {
        field: "Collateral Type",
        type: "string",
        required: false,
        description: "Type of collateral",
      },
      {
        field: "Collateral Value",
        type: "number",
        required: false,
        description: "Value of collateral",
      },
      {
        field: "Collateral Location",
        type: "string",
        required: false,
        description: "Location of collateral",
      },
      {
        field: "Counterparty Type",
        type: "string",
        required: true,
        description: "Type of counterparty",
      },
      {
        field: "Group/Parent",
        type: "string",
        required: false,
        description: "Parent company or group",
      },
    ],
  },

  equities: {
    name: "Equities",
    columns: [
      {
        field: "Asset ID",
        type: "string",
        required: true,
        description: "Unique asset identifier",
      },
      {
        field: "Equity Name",
        type: "string",
        required: true,
        description: "Name of the equity",
      },
      {
        field: "Issuer",
        type: "string",
        required: true,
        description: "Issuing company",
      },
      {
        field: "Sector",
        type: "string",
        required: true,
        description: "Economic sector",
      },
      {
        field: "Subsector",
        type: "string",
        required: false,
        description: "Economic subsector",
      },
      {
        field: "Number of Shares",
        type: "number",
        required: true,
        description: "Number of shares held",
      },
      {
        field: "Market Value",
        type: "number",
        required: true,
        description: "Current market value",
      },
      {
        field: "Currency",
        type: "string",
        required: true,
        description: "Currency code",
      },
      {
        field: "Acquisition Date",
        type: "date",
        required: true,
        description: "Date of acquisition",
      },
      {
        field: "Status",
        type: "string",
        required: true,
        description: "Investment status",
      },
      {
        field: "Counterparty Type",
        type: "string",
        required: true,
        description: "Type of counterparty",
      },
      {
        field: "Region",
        type: "string",
        required: true,
        description: "Geographic region",
      },
      {
        field: "Country",
        type: "string",
        required: true,
        description: "Country of issuer",
      },
    ],
  },

  bonds_fixed_income: {
    name: "Bonds & Fixed Income",
    columns: [
      {
        field: "Asset ID",
        type: "string",
        required: true,
        description: "Unique asset identifier",
      },
      {
        field: "Bond Name",
        type: "string",
        required: true,
        description: "Name of the bond",
      },
      {
        field: "Issuer",
        type: "string",
        required: true,
        description: "Issuing entity",
      },
      {
        field: "Sector",
        type: "string",
        required: true,
        description: "Economic sector",
      },
      {
        field: "Subsector",
        type: "string",
        required: false,
        description: "Economic subsector",
      },
      {
        field: "Face Value",
        type: "number",
        required: true,
        description: "Face value of bond",
      },
      {
        field: "Currency",
        type: "string",
        required: true,
        description: "Currency code",
      },
      {
        field: "Coupon Rate (%)",
        type: "number",
        required: true,
        description: "Annual coupon rate",
      },
      {
        field: "Issue Date",
        type: "date",
        required: true,
        description: "Bond issue date",
      },
      {
        field: "Maturity Date",
        type: "date",
        required: true,
        description: "Bond maturity date",
      },
      {
        field: "Status",
        type: "string",
        required: true,
        description: "Bond status",
      },
      {
        field: "Credit Rating",
        type: "string",
        required: false,
        description: "Credit rating",
      },
      {
        field: "Market Value",
        type: "number",
        required: true,
        description: "Current market value",
      },
      {
        field: "Counterparty Type",
        type: "string",
        required: true,
        description: "Type of counterparty",
      },
      {
        field: "Region",
        type: "string",
        required: true,
        description: "Geographic region",
      },
      {
        field: "Country",
        type: "string",
        required: true,
        description: "Country of issuer",
      },
    ],
  },

  derivatives: {
    name: "Derivatives",
    columns: [
      {
        field: "Asset ID",
        type: "string",
        required: true,
        description: "Unique asset identifier",
      },
      {
        field: "Derivative Type",
        type: "string",
        required: true,
        description: "Type of derivative",
      },
      {
        field: "Underlying Asset",
        type: "string",
        required: true,
        description: "Underlying asset",
      },
      {
        field: "Notional Amount",
        type: "number",
        required: true,
        description: "Notional amount",
      },
      {
        field: "Currency",
        type: "string",
        required: true,
        description: "Currency code",
      },
      {
        field: "Counterparty Name",
        type: "string",
        required: true,
        description: "Counterparty name",
      },
      {
        field: "Counterparty Type",
        type: "string",
        required: true,
        description: "Type of counterparty",
      },
      {
        field: "Trade Date",
        type: "date",
        required: true,
        description: "Trade date",
      },
      {
        field: "Maturity/Expiry Date",
        type: "date",
        required: true,
        description: "Maturity or expiry date",
      },
      {
        field: "Status",
        type: "string",
        required: true,
        description: "Derivative status",
      },
      {
        field: "Region",
        type: "string",
        required: true,
        description: "Geographic region",
      },
      {
        field: "Country",
        type: "string",
        required: true,
        description: "Country",
      },
    ],
  },

  guarantees_obs: {
    name: "Guarantees & Off-Balance Sheet",
    columns: [
      {
        field: "Asset ID",
        type: "string",
        required: true,
        description: "Unique asset identifier",
      },
      {
        field: "Guarantee Type",
        type: "string",
        required: true,
        description: "Type of guarantee",
      },
      {
        field: "Beneficiary Name",
        type: "string",
        required: true,
        description: "Beneficiary name",
      },
      {
        field: "Amount",
        type: "number",
        required: true,
        description: "Guarantee amount",
      },
      {
        field: "Currency",
        type: "string",
        required: true,
        description: "Currency code",
      },
      {
        field: "Issue Date",
        type: "date",
        required: true,
        description: "Issue date",
      },
      {
        field: "Expiry Date",
        type: "date",
        required: true,
        description: "Expiry date",
      },
      {
        field: "Status",
        type: "string",
        required: true,
        description: "Guarantee status",
      },
      {
        field: "Counterparty Type",
        type: "string",
        required: true,
        description: "Type of counterparty",
      },
      {
        field: "Region",
        type: "string",
        required: true,
        description: "Geographic region",
      },
      {
        field: "Country",
        type: "string",
        required: true,
        description: "Country",
      },
    ],
  },
};

type ValidationRule = (value: any) => string | null;

export const VALIDATION_RULES: Record<string, ValidationRule> = {
  required: (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "This field is required";
    }
    return null;
  },

  number: (value: any) => {
    if (isNaN(Number(value))) {
      return "Must be a valid number";
    }
    return null;
  },

  date: (value: any) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return "Must be a valid date";
    }
    return null;
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Must be a valid email address";
    }
    return null;
  },

  currency: (value: string) => {
    const validCurrencies = ["GHS", "USD", "EUR", "GBP"];
    if (!validCurrencies.includes(value.toUpperCase())) {
      return `Must be one of: ${validCurrencies.join(", ")}`;
    }
    return null;
  },
};

type AssetType = keyof typeof TEMPLATE_DEFINITIONS;

interface SampleData {
  [key: string]: Array<Record<string, any>>;
}

export const SAMPLE_DATA: SampleData = {
  loans_advances: [
    {
      "Facility ID": "LN-2024-001",
      "Borrower Name": "ABC Manufacturing Ltd",
      Sector: "Manufacturing",
      Subsector: "Textiles",
      "Product Type": "Term Loan",
      "Loan Amount": 500000,
      "Outstanding Balance": 450000,
      Currency: "GHS",
      "Tenor (months)": 36,
      "Interest Rate (%)": 15.5,
      "Origination Date": "2024-01-15",
      "Maturity Date": "2027-01-15",
      Status: "Active",
      Address: "123 Industrial Area",
      Region: "Greater Accra",
      City: "Accra",
      Country: "Ghana",
      Latitude: 5.6037,
      Longitude: -0.187,
      "Collateral Type": "Real Estate",
      "Collateral Value": 750000,
      "Collateral Location": "Accra",
      "Counterparty Type": "Corporate",
      "Group/Parent": "ABC Group",
    },
  ],

  equities: [
    {
      "Asset ID": "EQ-2024-001",
      "Equity Name": "Ghana Commercial Bank",
      Issuer: "GCB Bank Limited",
      Sector: "Financial Services",
      Subsector: "Banking",
      "Number of Shares": 10000,
      "Market Value": 45000,
      Currency: "GHS",
      "Acquisition Date": "2024-01-10",
      Status: "Active",
      "Counterparty Type": "Listed Company",
      Region: "Greater Accra",
      Country: "Ghana",
    },
  ],
};

export const generateCSVTemplate = (assetType: AssetType): string => {
  const template = TEMPLATE_DEFINITIONS[assetType];
  if (!template) return "";

  const headers = template.columns.map((col) => col.field).join(",");
  const sampleRow = SAMPLE_DATA[assetType]?.[0];

  if (sampleRow) {
    const values = template.columns
      .map((col) => {
        const value = sampleRow[col.field];
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      })
      .join(",");
    return `${headers}\n${values}`;
  }

  return headers;
};

interface ValidationError {
  row: number;
  field: string;
  error: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateUploadedData = (
  data: any[],
  assetType: AssetType,
): ValidationResult => {
  const template = TEMPLATE_DEFINITIONS[assetType];
  const errors: ValidationError[] = [];

  data.forEach((row, rowIndex) => {
    template.columns.forEach((column) => {
      const value = row[column.field];

      if (column.required) {
        const error = VALIDATION_RULES.required(value);
        if (error) {
          errors.push({
            row: rowIndex + 1,
            field: column.field,
            error: error,
          });
        }
      }

      if (value !== null && value !== undefined && value !== "") {
        if (column.type === "number") {
          const error = VALIDATION_RULES.number(value);
          if (error) {
            errors.push({
              row: rowIndex + 1,
              field: column.field,
              error: error,
            });
          }
        } else if (column.type === "date") {
          const error = VALIDATION_RULES.date(value);
          if (error) {
            errors.push({
              row: rowIndex + 1,
              field: column.field,
              error: error,
            });
          }
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};
