import React, { useState } from "react";
import {
  ChevronDown,
  FileText,
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  User,
  X,
  Shield,
  Send,
} from "lucide-react";
import ProgressBar from "./ProgressBar";

interface ProjectData {
  clientName: string;
  facilityType: string;
  sector: string;
  subSector: string;
  projectLocation: string;
  projectType: string;
  currency: string;
  estimatedAmount: string;
  estimatedEmployees: string;
}

interface ExclusionData {
  [key: string]: boolean;
}

interface RiskQuestions {
  [key: string]: "yes" | "no" | "na" | "";
}

const ESSStep: React.FC = () => {
  const [activeTab, setActiveTab] = useState("project-info");
  const [showApproverModal, setShowApproverModal] = useState(false);
  const [nextPreparer, setNextPreparer] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);

  const [projectData, setProjectData] = useState<ProjectData>({
    clientName: "",
    facilityType: "",
    sector: "General",
    subSector: "Logistics",
    projectLocation: "Abia",
    projectType: "CAPEX",
    currency: "Naira",
    estimatedAmount: "0",
    estimatedEmployees: "1-20",
  });

  const [exclusionData, setExclusionData] = useState<ExclusionData>({
    weapons: false,
    tobacco: false,
    adultEntertainment: false,
    gambling: false,
    forcedLabor: false,
    illegalLogging: false,
    radioactiveMaterials: false,
    hazardousChemicals: false,
    conflictMinerals: false,
    unlicensedWaste: false,
    coralReef: false,
    culturalHeritage: false,
    bannedActivities: false,
  });

  const [riskQuestions, setRiskQuestions] = useState<RiskQuestions>({
    ps1_significant_risks: "",
    ps1_impact_assessment: "",
    ps2_employment: "",
    ps2_health_safety: "",
    ps3_emissions: "",
    ps3_water_energy: "",
    ps4_communities: "",
    ps4_health_risks: "",
    ps5_land_acquisition: "",
    ps5_economic_displacement: "",
    ps6_biodiversity: "",
    ps6_endangered_species: "",
    ps7_indigenous_peoples: "",
    ps7_fpic: "",
    ps8_cultural_heritage: "",
    ps8_tangible_heritage: "",
  });

  const tabs = [
    { id: "project-info", label: "Project Information", icon: FileText },
    {
      id: "exclusion-screening",
      label: "Exclusion List Screening",
      icon: AlertTriangle,
    },
    {
      id: "risk-questions",
      label: "E&S Risk Trigger Questions",
      icon: HelpCircle,
    },
    {
      id: "recommendation",
      label: "Screening Recommendation",
      icon: CheckCircle,
    },
  ];

  const sectors = ["General", "Manufacturing", "Energy", "ICT", "Agriculture"];
  const subSectors = [
    "Logistics",
    "Construction",
    "Services",
    "Technology",
    "Finance",
  ];
  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];
  const projectTypes = ["CAPEX", "OPEX", "Working Capital", "Guarantee"];
  const currencies = ["Naira", "USD", "EUR", "GBP"];
  const employeeRanges = ["1-20", "21-50", "51-100", "101-500", "500+"];

  const exclusionItems = [
    { key: "weapons", label: "Weapons, firearms or ammunition" },
    { key: "tobacco", label: "Tobacco production" },
    { key: "adultEntertainment", label: "Adult entertainment / pornography" },
    { key: "gambling", label: "Gambling or betting activities" },
    { key: "forcedLabor", label: "Forced or child labor" },
    { key: "illegalLogging", label: "Illegal logging / wildlife trade" },
    { key: "radioactiveMaterials", label: "Radioactive materials" },
    { key: "hazardousChemicals", label: "Hazardous chemicals or asbestos" },
    {
      key: "conflictMinerals",
      label: "Conflict minerals or unregulated mining",
    },
    { key: "unlicensedWaste", label: "Unlicensed waste disposal" },
    { key: "coralReef", label: "Coral reef destruction or marine dumping" },
    { key: "culturalHeritage", label: "Cultural heritage destruction" },
    { key: "bannedActivities", label: "Activities banned by national law" },
  ];

  const performanceStandards = [
    {
      title:
        "Performance Standard 1: Assessment and Management of E&S Risks and Impacts",
      questions: [
        {
          key: "ps1_significant_risks",
          text: "Does the project pose potentially significant E&S risks and impacts?",
        },
        {
          key: "ps1_impact_assessment",
          text: "Has the client conducted prior E&S impact assessments?",
        },
      ],
    },
    {
      title: "Performance Standard 2: Labor and Working Conditions",
      questions: [
        {
          key: "ps2_employment",
          text: "Will the project create employment for >20 people?",
        },
        {
          key: "ps2_health_safety",
          text: "Could the project pose occupational health and safety risks?",
        },
      ],
    },
    {
      title:
        "Performance Standard 3: Resource Efficiency and Pollution Prevention",
      questions: [
        {
          key: "ps3_emissions",
          text: "Will the project generate significant emissions, effluents, or waste?",
        },
        {
          key: "ps3_water_energy",
          text: "Will the project consume large quantities of water or energy?",
        },
      ],
    },
    {
      title: "Performance Standard 4: Community Health, Safety, and Security",
      questions: [
        {
          key: "ps4_communities",
          text: "Is the project located near residential communities or public facilities?",
        },
        {
          key: "ps4_health_risks",
          text: "Could project activities pose health and safety risks to communities?",
        },
      ],
    },
    {
      title:
        "Performance Standard 5: Land Acquisition and Involuntary Resettlement",
      questions: [
        {
          key: "ps5_land_acquisition",
          text: "Will the project require land acquisition or cause physical displacement?",
        },
        {
          key: "ps5_economic_displacement",
          text: "Will the project cause economic displacement (loss of income)?",
        },
      ],
    },
    {
      title:
        "Performance Standard 6: Biodiversity Conservation and Natural Resource Management",
      questions: [
        {
          key: "ps6_biodiversity",
          text: "Is the project located in or near sensitive ecosystems?",
        },
        {
          key: "ps6_endangered_species",
          text: "Could project activities affect endangered species or critical habitats?",
        },
      ],
    },
    {
      title: "Performance Standard 7: Indigenous Peoples",
      questions: [
        {
          key: "ps7_indigenous_peoples",
          text: "Will the project affect Indigenous Peoples or customary land users?",
        },
        {
          key: "ps7_fpic",
          text: "Has the client obtained Free, Prior, and Informed Consent (FPIC)?",
        },
      ],
    },
    {
      title: "Performance Standard 8: Cultural Heritage",
      questions: [
        {
          key: "ps8_cultural_heritage",
          text: "Are there known cultural, religious, or archaeological sites nearby?",
        },
        {
          key: "ps8_tangible_heritage",
          text: "Could the project disturb or damage tangible heritage?",
        },
      ],
    },
  ];

  const handleApproverSubmit = () => {
    setNotificationSent(true);
    setTimeout(() => {
      setNotificationSent(false);
      setShowApproverModal(false);
    }, 2000);
  };

  const calculateRiskCategory = () => {
    const hasExclusions = Object.values(exclusionData).some((value) => value);
    if (hasExclusions) return "Excluded";

    const yesAnswers = Object.values(riskQuestions).filter(
      (answer) => answer === "yes",
    ).length;

    if (yesAnswers >= 6) return "Category A";
    if (yesAnswers >= 3) return "Category B";
    return "Category C";
  };

  const getRecommendationColor = (category: string) => {
    switch (category) {
      case "Excluded":
        return "text-red-700 bg-red-50 border-red-200";
      case "Category A":
        return "text-red-700 bg-red-50 border-red-200";
      case "Category B":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "Category C":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const renderProjectInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Client Name
          </label>
          <input
            type="text"
            value={projectData.clientName}
            onChange={(e) =>
              setProjectData({ ...projectData, clientName: e.target.value })
            }
            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="Enter client name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Facility Type
          </label>
          <input
            type="text"
            value={projectData.facilityType}
            onChange={(e) =>
              setProjectData({ ...projectData, facilityType: e.target.value })
            }
            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="Enter facility type"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Sector
          </label>
          <div className="relative">
            <select
              value={projectData.sector}
              onChange={(e) =>
                setProjectData({ ...projectData, sector: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-10"
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Sub-sector
          </label>
          <div className="relative">
            <select
              value={projectData.subSector}
              onChange={(e) =>
                setProjectData({ ...projectData, subSector: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-10"
            >
              {subSectors.map((subSector) => (
                <option key={subSector} value={subSector}>
                  {subSector}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Project Location
          </label>
          <div className="relative">
            <select
              value={projectData.projectLocation}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  projectLocation: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-10"
            >
              {nigerianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Project Type
          </label>
          <div className="relative">
            <select
              value={projectData.projectType}
              onChange={(e) =>
                setProjectData({ ...projectData, projectType: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-10"
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Currency
            </label>
            <div className="relative">
              <select
                value={projectData.currency}
                onChange={(e) =>
                  setProjectData({ ...projectData, currency: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-10"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Est. Amount
            </label>
            <input
              type="number"
              value={projectData.estimatedAmount}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  estimatedAmount: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Employees
          </label>
          <div className="relative">
            <select
              value={projectData.estimatedEmployees}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  estimatedEmployees: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-10"
            >
              {employeeRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => setActiveTab("exclusion-screening")}
          className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          Proceed to Exclusion Screening
          <ChevronDown className="w-4 h-4 -rotate-90" />
        </button>
      </div>
    </div>
  );

  const renderExclusionScreening = () => (
    <div className="space-y-6">
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div className="flex gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
            Check any activities that apply to the project. If any of these are
            selected, the project may be excluded from financing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exclusionItems.map((item) => (
          <label
            key={item.key}
            className={`
                flex items-center p-4 rounded-lg border cursor-pointer transition-all
                ${
                  exclusionData[item.key]
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }
            `}
          >
            <input
              type="checkbox"
              checked={exclusionData[item.key]}
              onChange={(e) =>
                setExclusionData({
                  ...exclusionData,
                  [item.key]: e.target.checked,
                })
              }
              className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500 mr-3"
            />
            <span
              className={`text-sm font-medium ${exclusionData[item.key] ? "text-red-800 dark:text-red-200" : "text-slate-700 dark:text-slate-300"}`}
            >
              {item.label}
            </span>
          </label>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => setActiveTab("risk-questions")}
          className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          Proceed to Risk Questions
          <ChevronDown className="w-4 h-4 -rotate-90" />
        </button>
      </div>
    </div>
  );

  const renderRiskQuestions = () => (
    <div className="space-y-8">
      {performanceStandards.map((ps, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
        >
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">
              {ps.title}
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {ps.questions.map((q) => (
              <div
                key={q.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-dashed border-slate-100 dark:border-slate-700 last:border-0"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-normal max-w-2xl">
                  {q.text}
                </span>
                <div className="flex items-center gap-4 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={q.key}
                      value="yes"
                      checked={riskQuestions[q.key] === "yes"}
                      onChange={() =>
                        setRiskQuestions({ ...riskQuestions, [q.key]: "yes" })
                      }
                      className="w-4 h-4 text-[#FDB913] border-slate-300 focus:ring-[#FDB913]"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Yes
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={q.key}
                      value="no"
                      checked={riskQuestions[q.key] === "no"}
                      onChange={() =>
                        setRiskQuestions({ ...riskQuestions, [q.key]: "no" })
                      }
                      className="w-4 h-4 text-[#FDB913] border-slate-300 focus:ring-[#FDB913]"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      No
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          onClick={() => setActiveTab("recommendation")}
          className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          View Recommendation
          <ChevronDown className="w-4 h-4 -rotate-90" />
        </button>
      </div>
    </div>
  );

  const renderRecommendation = () => {
    const category = calculateRiskCategory();
    const colorClass = getRecommendationColor(category);

    return (
      <div className="max-w-3xl mx-auto space-y-8 text-center pt-8">
        <div
          className={`p-8 rounded-xl border-2 ${colorClass} bg-opacity-10 dark:bg-opacity-10`}
        >
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            Risk Categorization Result
          </h2>
          <div className="text-5xl font-black my-6 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            {category}
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Based on the information provided, this project has been categorized
            as <strong>{category}</strong>.
            {category === "Category A" &&
              " Detailed ESDD and high-level approval required."}
            {category === "Category B" && " Standard ESDD required."}
            {category === "Category C" && " Minimal E&S risks expected."}
            {category === "Excluded" &&
              " Financing for this project is likely prohibited."}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
            Save Draft
          </button>
          <button
            onClick={() => setShowApproverModal(true)}
            className="px-6 py-3 bg-[#FDB913] hover:bg-yellow-500 text-slate-900 rounded-lg shadow-md transition-all font-bold flex items-center gap-2"
          >
            Submit for Review
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-900 px-6 py-5 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#FDB913]" />
                  Step 1: Environmental and Social Screening
                </h1>
                <p className="text-slate-300 mt-1 text-sm">
                  Initial project screening, exclusion list check, and risk
                  categorization.
                </p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                Phase 1 of 5
              </div>
            </div>
          </div>

          <div className="p-6">
            <ProgressBar currentStep={1} />

            {/* Tab Navigation */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer
                        ${
                          isActive
                            ? "border-[#FDB913] text-[#FDB913]"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                        }
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-[#FDB913]" : "text-slate-400"}`}
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-100">
              {activeTab === "project-info" && renderProjectInfo()}
              {activeTab === "exclusion-screening" &&
                renderExclusionScreening()}
              {activeTab === "risk-questions" && renderRiskQuestions()}
              {activeTab === "recommendation" && renderRecommendation()}
            </div>
          </div>
        </div>
      </div>

      {/* Next Preparer Modal */}
      {showApproverModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all">
            <div className="bg-slate-900 p-4 border-b border-[#FDB913] flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#FDB913]" />
                Select Next Preparer
              </h3>
              <button
                onClick={() => setShowApproverModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!notificationSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Assign to
                    </label>
                    <select
                      value={nextPreparer}
                      onChange={(e) => setNextPreparer(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="">Select a user...</option>
                      <option value="user1">Sarah Johnson - ESG Officer</option>
                      <option value="user2">
                        Michael Chen - Senior Risk Analyst
                      </option>
                      <option value="user3">David Wilson - Risk Manager</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md border border-slate-200 dark:border-slate-800">
                    <div className="flex gap-2">
                      <div className="shrink-0 text-slate-600 dark:text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        The selected user will be notified via email and
                        dashboard notification.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Notification Sent!
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    The next preparer has been notified successfully.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              {!notificationSent && (
                <>
                  <button
                    onClick={() => setShowApproverModal(false)}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApproverSubmit}
                    disabled={!nextPreparer}
                    className={`
                      px-4 py-2 rounded-md transition-colors font-medium text-sm flex items-center gap-2
                      ${
                        !nextPreparer
                          ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                          : "bg-[#FDB913] hover:bg-yellow-500 text-slate-900 shadow-sm"
                      }
                    `}
                  >
                    <Send className="w-4 h-4" />
                    Send Notification
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ESSStep;
