/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  FileText,
  BarChart3,
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import ProgressBar from "./ProgressBar";

interface PSQuestions {
  [key: string]: "yes" | "no" | "na" | "";
}

const CategorizationStep: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ps-questions");
  const [showApproverModal, setShowApproverModal] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState("");
  const [expectedCompletionDate, setExpectedCompletionDate] = useState("");
  const [psQuestions, setPsQuestions] = useState<PSQuestions>({
    ps1_q1: "",
    ps1_q2: "",
    ps1_q3: "",
    ps2_q1: "",
    ps2_q2: "",
    ps2_q3: "",
    ps3_q1: "",
    ps3_q2: "",
    ps3_q3: "",
    ps4_q1: "",
    ps4_q2: "",
    ps4_q3: "",
    ps5_q1: "",
    ps5_q2: "",
    ps5_q3: "",
    ps6_q1: "",
    ps6_q2: "",
    ps6_q3: "",
    ps7_q1: "",
    ps7_q2: "",
    ps7_q3: "",
    ps8_q1: "",
    ps8_q2: "",
    ps8_q3: "",
  });

  const tabs = [
    {
      id: "ps-questions",
      label: "PS1-PS8 Questions",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      id: "categorization-result",
      label: "Categorization Result",
      icon: BarChart3,
      color: "text-amber-600",
    },
  ];

  const step3Approvers = [
    "David Wilson - Senior ESG Analyst",
    "Lisa Brown - Environmental Specialist",
    "James Miller - Risk Assessment Lead",
    "Emma Davis - Sustainability Manager",
  ];

  const handleApproverSubmit = () => {
    if (selectedApprover && expectedCompletionDate) {
      console.log("Approver selected:", selectedApprover);
      console.log("Expected completion:", expectedCompletionDate);
      setShowApproverModal(false);
      // Here you would typically save the approver assignment
    }
  };

  const performanceStandards = [
    {
      id: "ps1",
      title:
        "Performance Standard 1: Assessment and Management of Environmental and Social Risks and Impacts",
      questions: [
        {
          key: "ps1_q1",
          text: "Does the project pose potentially significant adverse environmental and social risks and impacts?",
        },
        {
          key: "ps1_q2",
          text: "Will the project require an Environmental and Social Impact Assessment (ESIA)?",
        },
        {
          key: "ps1_q3",
          text: "Does the project involve activities that are subject to environmental licensing?",
        },
      ],
    },
    {
      id: "ps2",
      title: "Performance Standard 2: Labor and Working Conditions",
      questions: [
        { key: "ps2_q1", text: "Will the project employ 20 or more workers?" },
        {
          key: "ps2_q2",
          text: "Could the project pose occupational health and safety risks to workers?",
        },
        {
          key: "ps2_q3",
          text: "Will the project involve the use of migrant workers or contractors?",
        },
      ],
    },
    {
      id: "ps3",
      title:
        "Performance Standard 3: Resource Efficiency and Pollution Prevention",
      questions: [
        {
          key: "ps3_q1",
          text: "Will the project generate significant air emissions, effluents, or solid waste?",
        },
        {
          key: "ps3_q2",
          text: "Will the project consume large quantities of water or energy?",
        },
        {
          key: "ps3_q3",
          text: "Will the project use or produce hazardous materials or chemicals?",
        },
      ],
    },
    {
      id: "ps4",
      title: "Performance Standard 4: Community Health, Safety, and Security",
      questions: [
        {
          key: "ps4_q1",
          text: "Is the project located near residential communities or public facilities?",
        },
        {
          key: "ps4_q2",
          text: "Could project activities pose health and safety risks to communities?",
        },
        {
          key: "ps4_q3",
          text: "Will the project require security arrangements that could affect communities?",
        },
      ],
    },
    {
      id: "ps5",
      title:
        "Performance Standard 5: Land Acquisition and Involuntary Resettlement",
      questions: [
        {
          key: "ps5_q1",
          text: "Will the project require land acquisition or cause physical displacement?",
        },
        {
          key: "ps5_q2",
          text: "Will the project cause economic displacement (loss of income or livelihood)?",
        },
        {
          key: "ps5_q3",
          text: "Will the project restrict access to natural resources or legally designated areas?",
        },
      ],
    },
    {
      id: "ps6",
      title:
        "Performance Standard 6: Biodiversity Conservation and Sustainable Management of Living Natural Resources",
      questions: [
        {
          key: "ps6_q1",
          text: "Is the project located in or near areas of high biodiversity value?",
        },
        {
          key: "ps6_q2",
          text: "Could project activities affect endangered species or critical habitats?",
        },
        {
          key: "ps6_q3",
          text: "Will the project involve the sustainable management of living natural resources?",
        },
      ],
    },
    {
      id: "ps7",
      title: "Performance Standard 7: Indigenous Peoples",
      questions: [
        {
          key: "ps7_q1",
          text: "Will the project affect Indigenous Peoples or traditional communities?",
        },
        {
          key: "ps7_q2",
          text: "Are there Indigenous Peoples with collective attachment to the project area?",
        },
        {
          key: "ps7_q3",
          text: "Has the client obtained Free, Prior, and Informed Consent (FPIC) where required?",
        },
      ],
    },
    {
      id: "ps8",
      title: "Performance Standard 8: Cultural Heritage",
      questions: [
        {
          key: "ps8_q1",
          text: "Are there known cultural, religious, or archaeological sites in the project area?",
        },
        {
          key: "ps8_q2",
          text: "Could the project disturb or damage tangible cultural heritage?",
        },
        {
          key: "ps8_q3",
          text: "Will the project affect intangible cultural heritage or traditional practices?",
        },
      ],
    },
  ];

  const calculatePSScores = () => {
    const scores: { [key: string]: number } = {};

    performanceStandards.forEach((ps) => {
      const yesCount = ps.questions.filter(
        (q) => psQuestions[q.key] === "yes",
      ).length;
      scores[ps.id] = yesCount;
    });

    return scores;
  };

  const calculateTotalScore = () => {
    const scores = calculatePSScores();
    return Object.values(scores).reduce((total, score) => total + score, 0);
  };

  const calculateRiskCategory = () => {
    const totalScore = calculateTotalScore();
    // const totalQuestions = Object.keys(psQuestions).length;

    if (totalScore >= 12) return "Category A";
    if (totalScore >= 6) return "Category B";
    return "Category C";
  };

  const getTriggeredPS = () => {
    const scores = calculatePSScores();
    const triggered = Object.entries(scores)
      .filter(([_, score]) => score > 0)
      .map(([psId, _]) => psId.toUpperCase());

    return triggered.length > 0 ? triggered.join(", ") : "None";
  };

  const downloadCategorizationReport = () => {
    const scores = calculatePSScores();
    const totalScore = calculateTotalScore();
    const riskCategory = calculateRiskCategory();
    const triggeredPS = getTriggeredPS();

    const reportData = [
      ["Categorization Summary"],
      ["Client:", "Sample Client"],
      ["Project:", "Sample Project"],
      ["Sector:", "General"],
      [
        "Total Score:",
        `${totalScore} out of ${Object.keys(psQuestions).length} (${Math.round((totalScore / Object.keys(psQuestions).length) * 100)}%)`,
      ],
      ["Triggered PS:", triggeredPS],
      ["Final Risk Category:", riskCategory],
      [""],
      ["Performance Standard Scores"],
      ["Performance Standard", "Score"],
      ...performanceStandards.map((ps) => [ps.title, scores[ps.id].toString()]),
    ];

    const csvContent = reportData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Risk_Categorization_Report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const renderPSQuestions = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF8E6] border border-[#FDB913] rounded-lg p-4 mb-6">
        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-[#FDB913]" />
          Performance Standards Assessment
        </h3>
        <p className="text-sm text-slate-700">
          Answer the following questions for each Performance Standard to
          determine the project's risk category.
        </p>
      </div>

      {performanceStandards.map((standard) => (
        <div
          key={standard.id}
          className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm"
        >
          <div className="bg-slate-900 px-6 py-4 border-b border-[#FDB913]">
            <h3 className="font-bold text-lg text-white">{standard.title}</h3>
          </div>
          <div className="p-6 space-y-6">
            {standard.questions.map((question) => (
              <div key={question.key} className="space-y-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {question.text}
                </p>
                <div className="flex space-x-6">
                  {["yes", "no", "na"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer group"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name={question.key}
                          value={option}
                          checked={psQuestions[question.key] === option}
                          onChange={(e) =>
                            setPsQuestions({
                              ...psQuestions,
                              [question.key]: e.target.value as
                                | "yes"
                                | "no"
                                | "na",
                            })
                          }
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 peer-checked:border-[#FDB913] peer-checked:bg-[#FDB913] transition-all relative"></div>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 capitalize font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {option === "na" ? "N/A" : option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCategorizationResult = () => {
    // const scores = calculatePSScores();
    const totalScore = calculateTotalScore();
    const riskCategory = calculateRiskCategory();
    const triggeredPS = getTriggeredPS();
    const totalQuestions = Object.keys(psQuestions).length;

    const getCategoryStyles = (category: string) => {
      switch (category) {
        case "Category A":
          return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800";
        case "Category B":
          return "text-[#FDB913] bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800";
        case "Category C":
          return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800";
        default:
          return "text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
      }
    };

    return (
      <div className="space-y-6">
        {/* Categorization Summary */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
          <div className="bg-slate-900 px-6 py-4 border-b border-[#FDB913] flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">
              Categorization Summary
            </h3>
            <button
              onClick={downloadCategorizationReport}
              className="flex items-center gap-2 px-4 py-2 bg-[#FDB913] text-slate-900 rounded-lg hover:bg-[#e0a800] transition-colors text-sm font-bold"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <span className="font-bold text-slate-500 text-xs uppercase tracking-wider block mb-1">
                  Client Name
                </span>
                <div className="text-slate-900 dark:text-white font-medium">
                  Sample Client
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <span className="font-bold text-slate-500 text-xs uppercase tracking-wider block mb-1">
                  Project Name
                </span>
                <div className="text-slate-900 dark:text-white font-medium">
                  Sample Project
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <span className="font-bold text-slate-500 text-xs uppercase tracking-wider block mb-1">
                  Sector
                </span>
                <div className="text-slate-900 dark:text-white font-medium">
                  General
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <span className="font-bold text-slate-500 text-xs uppercase tracking-wider block mb-1">
                  Total Score
                </span>
                <div className="text-slate-900 dark:text-white font-medium">
                  {totalScore} out of {totalQuestions} (
                  {Math.round((totalScore / totalQuestions) * 100)}%)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Triggered Performance Standards
                </h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 min-h-20">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {triggeredPS}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Final Risk Category
                </h4>
                <div
                  className={`p-4 rounded-lg border flex items-center gap-3 min-h-20 ${getCategoryStyles(riskCategory)}`}
                >
                  <AlertTriangle className="w-6 h-6" />
                  <div>
                    <span className="text-lg font-bold block">
                      {riskCategory}
                    </span>
                    <span className="text-xs opacity-75">
                      Based on PS assessment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps / Approval */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
            Submission & Approval
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Review the categorization results above. If correct, proceed to
            submit for approval by a senior risk officer.
          </p>

          <button
            onClick={() => setShowApproverModal(true)}
            className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-bold shadow-lg shadow-slate-900/20"
          >
            <CheckCircle className="w-5 h-5 mr-2 text-[#FDB913]" />
            Submit for Approval
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Risk Categorization
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Step 2: Determine project risk category based on Performance
            Standards
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-[#FDB913]" : ""}`}
                />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <ProgressBar currentStep={2} totalSteps={5} />

      {activeTab === "ps-questions"
        ? renderPSQuestions()
        : renderCategorizationResult()}

      {/* Approver Modal */}
      {showApproverModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit for Approval
              </h3>
              <button
                onClick={() => setShowApproverModal(false)}
                className="text-slate-400 hover:text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Approver
                </label>
                <select
                  value={selectedApprover}
                  onChange={(e) => setSelectedApprover(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none text-slate-900 dark:text-white"
                >
                  <option value="">Select an approver...</option>
                  {step3Approvers.map((approver) => (
                    <option key={approver} value={approver}>
                      {approver}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Expected Completion Date
                </label>
                <input
                  type="date"
                  value={expectedCompletionDate}
                  onChange={(e) => setExpectedCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button
                onClick={() => setShowApproverModal(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApproverSubmit}
                disabled={!selectedApprover || !expectedCompletionDate}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/10"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorizationStep;
