import React, { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Users,
  Shield,
  Eye,
  User,
  X,
  Send,
  Info,
} from "lucide-react";
import ProgressBar from "./ProgressBar";

const ESDDStep: React.FC = () => {
  const [activeTab, setActiveTab] = useState("due-diligence-form");
  const [showApproverModal, setShowApproverModal] = useState(false);
  const [nextPreparer, setNextPreparer] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);

  const [formData, setFormData] = useState({
    managementCapacity: "Strong",
    additionalNotes: "",
    keyRisks: "",
    mitigationMeasures: "",
    siteVisitRecommended: "",
    siteVisitReason: "",
    dueDiligenceSummary: "",
    esapRecommendations: "",
  });

  const tabs = [
    {
      id: "due-diligence-form",
      label: "Due Diligence Form",
      icon: FileText,
    },
    {
      id: "document-manager",
      label: "Document Manager",
      icon: Upload,
    },
  ];

  const managementCapacityOptions = ["Strong", "Moderate", "Weak", "Unknown"];

  const handleApproverSubmit = () => {
    setNotificationSent(true);
    setTimeout(() => {
      setNotificationSent(false);
      setShowApproverModal(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownloadReport = () => {
    console.log("Downloading ESDD Report...");
    alert("Report download started");
  };

  const renderDueDiligenceForm = () => (
    <div className="space-y-8">
      {/* Management Capacity Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 border-l-4 border-l-slate-600 dark:border-l-slate-400">
          <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Management Capacity
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Client's E&S Management Capacity
              </label>
              <select
                value={formData.managementCapacity}
                onChange={(e) =>
                  handleInputChange("managementCapacity", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {managementCapacityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Capacity Assessment Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Enter notes..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Key E&S Risks Identified Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 border-l-4 border-l-amber-500">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Key E&S Risks Identified
            </h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Summarize key risks
            </label>
            <textarea
              value={formData.keyRisks}
              onChange={(e) => handleInputChange("keyRisks", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Key environmental and social risks..."
            />
          </div>
        </div>

        {/* Mitigation Measures Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 border-l-4 border-l-emerald-500">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Mitigation Measures
            </h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Proposed mitigation actions
            </label>
            <textarea
              value={formData.mitigationMeasures}
              onChange={(e) =>
                handleInputChange("mitigationMeasures", e.target.value)
              }
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Describe proposed mitigation measures..."
            />
          </div>
        </div>
      </div>

      {/* Site Visit Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 border-l-4 border-l-cyan-500">
          <MapPin className="w-5 h-5 text-cyan-500" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Site Visit
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Is a site visit recommended?
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full">
                  <input
                    type="radio"
                    name="siteVisit"
                    value="Yes"
                    checked={formData.siteVisitRecommended === "Yes"}
                    onChange={(e) =>
                      handleInputChange("siteVisitRecommended", e.target.value)
                    }
                    className="w-4 h-4 text-[#FDB913] border-slate-300 focus:ring-[#FDB913]"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Yes
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full">
                  <input
                    type="radio"
                    name="siteVisit"
                    value="No"
                    checked={formData.siteVisitRecommended === "No"}
                    onChange={(e) =>
                      handleInputChange("siteVisitRecommended", e.target.value)
                    }
                    className="w-4 h-4 text-[#FDB913] border-slate-300 focus:ring-[#FDB913]"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    No
                  </span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Reason for Site Visit Recommendation
              </label>
              <textarea
                value={formData.siteVisitReason}
                onChange={(e) =>
                  handleInputChange("siteVisitReason", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Explain the reason..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Due Diligence Summary Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 border-l-4 border-l-purple-500">
            <Eye className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Due Diligence Summary
            </h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Summary of findings
            </label>
            <textarea
              value={formData.dueDiligenceSummary}
              onChange={(e) =>
                handleInputChange("dueDiligenceSummary", e.target.value)
              }
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Summarize key findings..."
            />
          </div>
        </div>

        {/* ESAP Recommendations Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 border-l-4 border-l-orange-500">
            <CheckCircle className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              ESAP Recommendations
            </h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Recommended actions for ESAP
            </label>
            <textarea
              value={formData.esapRecommendations}
              onChange={(e) =>
                handleInputChange("esapRecommendations", e.target.value)
              }
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Recommend specific actions..."
            />
          </div>
        </div>
      </div>

      {/* Download Report Button */}
      <div className="flex justify-center pt-8 pb-4">
        <button
          onClick={handleDownloadReport}
          className="px-8 py-3 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all font-semibold shadow-lg flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download ESDD Report
        </button>
      </div>
    </div>
  );

  const renderDocumentManager = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
      <div className="text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          Document Manager
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          No triggered PS found. Nothing to upload.
        </p>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-left max-w-2xl mx-auto">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Note:</strong> Documents will be available for upload once
              Performance Standards are triggered in Step 1: ESS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-900 px-6 py-5 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#FDB913]" />
                Step 3: Environmental and Social Due Diligence
              </h1>
              <button
                onClick={() => setShowApproverModal(true)}
                className="px-4 py-2 bg-[#FDB913] hover:bg-yellow-500 text-slate-900 rounded-md transition-colors flex items-center gap-2 font-medium text-sm shadow-sm"
              >
                <User className="w-4 h-4" />
                Select Next Preparer
              </button>
            </div>
          </div>

          <div className="p-6">
            <ProgressBar currentStep={3} />

            {/* Tab Navigation */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                         flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors
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

            {activeTab === "due-diligence-form"
              ? renderDueDiligenceForm()
              : renderDocumentManager()}
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
                      <option value="user1">
                        Lisa Brown - Environmental Specialist
                      </option>
                      <option value="user2">
                        James Miller - Risk Assessment Lead
                      </option>
                      <option value="user3">
                        Emma Davis - Sustainability Manager
                      </option>
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

export default ESDDStep;
