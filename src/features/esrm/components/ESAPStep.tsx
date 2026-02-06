import { useState } from "react";
import {
  Plus,
  Download,
  Edit,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import ProgressBar from "./ProgressBar";

interface ActionItem {
  id: number;
  actionItem: string;
  ifcPsRef: string;
  responsibleParty: string;
  timeline: string;
  monitoringIndicator: string;
}

function ESAPStep() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showApproverModal, setShowApproverModal] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState("");
  const [expectedCompletionDate, setExpectedCompletionDate] = useState("");

  const [editForm, setEditForm] = useState<Partial<ActionItem>>({});

  const step5Approvers = [
    "James Miller - Risk Assessment Lead",
    "Emma Davis - Sustainability Manager",
    "Robert Taylor - Senior ESG Officer",
    "Maria Garcia - Chief Risk Officer",
  ];

  const handleApproverSubmit = () => {
    if (selectedApprover && expectedCompletionDate) {
      console.log("Approver selected:", selectedApprover);
      console.log("Expected completion:", expectedCompletionDate);
      setShowApproverModal(false);
      // Here you would typically save the approver assignment
    }
  };

  const addNewAction = () => {
    const newAction: ActionItem = {
      id: Date.now(),
      actionItem: "",
      ifcPsRef: "",
      responsibleParty: "",
      timeline: "",
      monitoringIndicator: "",
    };
    setActionItems((prev) => [...prev, newAction]);
    setEditingId(newAction.id);
    setEditForm(newAction);
  };

  const deleteAction = (id: number) => {
    setActionItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const startEdit = (item: ActionItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      setActionItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? ({ ...item, ...editForm } as ActionItem)
            : item,
        ),
      );
      setEditingId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    if (
      editingId &&
      actionItems.find((item) => item.id === editingId && !item.actionItem)
    ) {
      // If it's a new empty item, delete it
      deleteAction(editingId);
    }
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (field: keyof ActionItem, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const downloadESAPReport = () => {
    const csvContent = [
      [
        "Action Item",
        "IFC PS Ref",
        "Responsible Party",
        "Timeline",
        "Monitoring Indicator",
      ],
      ...actionItems.map((item) => [
        item.actionItem,
        item.ifcPsRef,
        item.responsibleParty,
        item.timeline,
        item.monitoringIndicator,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ESAP_Report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(actionItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = actionItems.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Step 4: Environmental & Social Action Plan
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Capture actionable steps to mitigate identified E&S risks
              </p>
            </div>
            <button
              onClick={() => setShowApproverModal(true)}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 font-bold shadow-lg shadow-slate-900/20"
            >
              <User className="w-4 h-4 text-[#FDB913]" />
              Select Next Preparer
            </button>
          </div>
        </div>

        <div className="p-6">
          <ProgressBar currentStep={4} />

          {/* Add Action Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={addNewAction}
              className="px-4 py-2 bg-[#FDB913] text-slate-900 rounded-lg hover:bg-[#e5a812] transition-colors flex items-center gap-2 font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Action Item
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Action Item
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    IFC PS Ref
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Responsible Party
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Indicator
                  </th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          <Plus className="w-6 h-6 text-slate-400" />
                        </div>
                        <p>No action items added yet</p>
                        <button
                          onClick={addNewAction}
                          className="text-[#FDB913] hover:underline font-bold text-sm"
                        >
                          Add your first action item
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-4 px-6">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editForm.actionItem || ""}
                            onChange={(e) =>
                              handleInputChange("actionItem", e.target.value)
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="Enter action item"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm text-slate-900 dark:text-white font-medium">
                            {item.actionItem || "-"}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editForm.ifcPsRef || ""}
                            onChange={(e) =>
                              handleInputChange("ifcPsRef", e.target.value)
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="e.g. PS1"
                          />
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {item.ifcPsRef || "-"}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editForm.responsibleParty || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "responsibleParty",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="Responsible party"
                          />
                        ) : (
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {item.responsibleParty || "-"}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editForm.timeline || ""}
                            onChange={(e) =>
                              handleInputChange("timeline", e.target.value)
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="Timeline"
                          />
                        ) : (
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {item.timeline || "-"}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editForm.monitoringIndicator || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "monitoringIndicator",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="Monitoring indicator"
                          />
                        ) : (
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {item.monitoringIndicator || "-"}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {editingId === item.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={saveEdit}
                              className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded transition-colors"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteAction(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Actions Footer */}
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            {actionItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadESAPReport}
                  className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 font-medium text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            )}

            {actionItems.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-slate-500 dark:text-slate-400 mr-4">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Approver Selection Modal */}
        {showApproverModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="bg-slate-900 p-6 border-b border-[#FDB913]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-[#FDB913]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Select Next Preparer
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Choose approver for Step 5
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowApproverModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Select Approver for Step 5: Appraisal & Conditions
                  </label>
                  <select
                    value={selectedApprover}
                    onChange={(e) => setSelectedApprover(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="">Choose an approver...</option>
                    {step5Approvers.map((approver) => (
                      <option key={approver} value={approver}>
                        {approver}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Expected Completion Date
                  </label>
                  <input
                    type="date"
                    value={expectedCompletionDate}
                    onChange={(e) => setExpectedCompletionDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => setShowApproverModal(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApproverSubmit}
                    disabled={!selectedApprover || !expectedCompletionDate}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-bold shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    Assign Approver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ESAPStep;
