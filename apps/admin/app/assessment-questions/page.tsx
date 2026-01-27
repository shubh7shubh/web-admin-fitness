"use client";

import { useState, useEffect, useCallback } from "react";
import { QuestionFormModal } from "@/components/assessment-questions/QuestionFormModal";

interface QuestionOption {
  value: string;
  label: string;
}

interface AssessmentQuestion {
  id: string;
  field_key: string;
  label: string;
  section: string;
  field_type: string;
  placeholder: string | null;
  options: QuestionOption[] | null;
  is_required: boolean;
  max_length: number | null;
  min_value: number | null;
  max_value: number | null;
  sort_order: number;
  is_active: boolean;
  is_legacy: boolean;
  default_value: string | null;
  created_at: string;
  updated_at: string;
}

const sectionLabels: Record<string, string> = {
  general: "General",
  nutrition: "Nutrition",
  workout: "Workout",
};

const sectionColors: Record<string, string> = {
  general: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  nutrition: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  workout: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const typeLabels: Record<string, string> = {
  textarea: "Text Area",
  select: "Dropdown",
  number: "Number",
};

export default function AssessmentQuestionsPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/assessment-questions");
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async (question: AssessmentQuestion) => {
    if (question.is_legacy) {
      alert("Legacy questions cannot be deleted. You can deactivate them instead.");
      return;
    }

    if (!confirm(`Delete question "${question.label}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(question.id);
    try {
      const res = await fetch(`/api/assessment-questions/${question.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchQuestions();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (question: AssessmentQuestion) => {
    try {
      const res = await fetch(`/api/assessment-questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !question.is_active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchQuestions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openCreate = () => {
    setEditingQuestion(null);
    setModalOpen(true);
  };

  const openEdit = (question: AssessmentQuestion) => {
    setEditingQuestion(question);
    setModalOpen(true);
  };

  const handleModalSave = () => {
    setModalOpen(false);
    setEditingQuestion(null);
    fetchQuestions();
  };

  const filtered =
    filter === "all"
      ? questions
      : questions.filter((q) => q.section === filter);

  // Group by section for display
  const sections = ["general", "nutrition", "workout"];
  const grouped = sections
    .map((sec) => ({
      section: sec,
      questions: filtered.filter((q) => q.section === sec),
    }))
    .filter((g) => g.questions.length > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Assessment Questions</h1>
          <p className="text-zinc-400 mt-1">
            Manage the questions shown in the premium assessment form
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Question
        </button>
      </div>

      {/* Section Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "general", label: "General" },
          { key: "nutrition", label: "Nutrition" },
          { key: "workout", label: "Workout" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({tab.key === "all"
                ? questions.length
                : questions.filter((q) => q.section === tab.key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      )}

      {/* Questions grouped by section */}
      {!loading && grouped.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-lg">No questions found</p>
        </div>
      )}

      {!loading &&
        grouped.map((group) => (
          <div key={group.section} className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  sectionColors[group.section]
                }`}
              >
                {sectionLabels[group.section]}
              </span>
              <span className="text-zinc-600 text-sm font-normal">
                {group.questions.length} question{group.questions.length !== 1 ? "s" : ""}
              </span>
            </h2>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Label
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">
                      Type
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">
                      Required
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-40">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.questions.map((q) => (
                    <tr
                      key={q.id}
                      className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30"
                    >
                      <td className="px-4 py-3 text-sm text-zinc-500">
                        {q.sort_order}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{q.label}</span>
                          {q.is_legacy && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              LEGACY
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          {q.field_key}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-400">
                        {typeLabels[q.field_type] || q.field_type}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {q.is_required ? (
                          <span className="text-emerald-400 text-sm">Yes</span>
                        ) : (
                          <span className="text-zinc-600 text-sm">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(q)}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            q.is_active
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-zinc-700/50 text-zinc-500 hover:bg-zinc-700"
                          }`}
                        >
                          {q.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(q)}
                            className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          {!q.is_legacy && (
                            <button
                              onClick={() => handleDelete(q)}
                              disabled={deleting === q.id}
                              className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-900/20 hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deleting === q.id ? "..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      {/* Modal */}
      {modalOpen && (
        <QuestionFormModal
          question={editingQuestion as any}
          onClose={() => {
            setModalOpen(false);
            setEditingQuestion(null);
          }}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
