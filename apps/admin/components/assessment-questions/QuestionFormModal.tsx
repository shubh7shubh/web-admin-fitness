"use client";

import { useState, useEffect } from "react";

interface QuestionOption {
  value: string;
  label: string;
}

interface QuestionData {
  id?: string;
  field_key: string;
  label: string;
  section: string;
  field_type: string;
  placeholder: string;
  options: QuestionOption[];
  is_required: boolean;
  max_length: number | null;
  min_value: number | null;
  max_value: number | null;
  sort_order: number;
  is_active: boolean;
  is_legacy: boolean;
  default_value: string;
}

interface Props {
  question: QuestionData | null; // null = creating new
  onClose: () => void;
  onSave: () => void;
}

const emptyForm: QuestionData = {
  field_key: "",
  label: "",
  section: "general",
  field_type: "textarea",
  placeholder: "",
  options: [],
  is_required: false,
  max_length: null,
  min_value: null,
  max_value: null,
  sort_order: 0,
  is_active: true,
  is_legacy: false,
  default_value: "",
};

export function QuestionFormModal({ question, onClose, onSave }: Props) {
  const isEditing = !!question?.id;
  const isLegacy = question?.is_legacy || false;

  const [form, setForm] = useState<QuestionData>(question || emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setForm({
        ...question,
        options: question.options || [],
        placeholder: question.placeholder || "",
        default_value: question.default_value || "",
      });
    }
  }, [question]);

  const updateField = (key: keyof QuestionData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { value: "", label: "" }],
    }));
  };

  const updateOption = (index: number, key: "value" | "label", val: string) => {
    setForm((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [key]: val };
      return { ...prev, options: newOptions };
    });
  };

  const removeOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        label: form.label,
        section: form.section,
        placeholder: form.placeholder || null,
        is_required: form.is_required,
        max_length: form.max_length || null,
        min_value: form.min_value || null,
        max_value: form.max_value || null,
        sort_order: form.sort_order,
        is_active: form.is_active,
        default_value: form.default_value || null,
      };

      // Only include these for non-legacy or when creating
      if (!isLegacy) {
        payload.field_key = form.field_key;
        payload.field_type = form.field_type;
      }

      if (form.field_type === "select") {
        payload.options = form.options;
      } else {
        payload.options = null;
      }

      const url = isEditing
        ? `/api/assessment-questions/${question!.id}`
        : "/api/assessment-questions";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save question");
      }

      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Edit Question" : "Add New Question"}
          </h2>
          {isLegacy && (
            <p className="text-sm text-amber-400 mt-1">
              Legacy question -- field key and type cannot be changed
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Field Key */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Field Key *
            </label>
            <input
              type="text"
              value={form.field_key}
              onChange={(e) => updateField("field_key", e.target.value)}
              disabled={isLegacy}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., sleep_quality"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">
              Lowercase snake_case. Used as database key.
            </p>
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Question Label *
            </label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => updateField("label", e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., How many hours do you sleep?"
              required
            />
          </div>

          {/* Section + Field Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Section *
              </label>
              <select
                value={form.section}
                onChange={(e) => updateField("section", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="general">General</option>
                <option value="nutrition">Nutrition</option>
                <option value="workout">Workout</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Field Type *
              </label>
              <select
                value={form.field_type}
                onChange={(e) => updateField("field_type", e.target.value)}
                disabled={isLegacy}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="textarea">Text Area</option>
                <option value="select">Dropdown (Select)</option>
                <option value="number">Number</option>
              </select>
            </div>
          </div>

          {/* Placeholder */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Placeholder Text
            </label>
            <input
              type="text"
              value={form.placeholder}
              onChange={(e) => updateField("placeholder", e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Placeholder shown in the input..."
            />
          </div>

          {/* Options (for select type) */}
          {form.field_type === "select" && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Options *
              </label>
              <div className="space-y-2">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={opt.value}
                      onChange={(e) => updateOption(i, "value", e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Value (stored)"
                      required
                    />
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => updateOption(i, "label", e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Label (displayed)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="mt-2 text-sm text-emerald-400 hover:text-emerald-300"
              >
                + Add Option
              </button>
            </div>
          )}

          {/* Max Length (for textarea) */}
          {form.field_type === "textarea" && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Max Character Length
              </label>
              <input
                type="number"
                value={form.max_length ?? ""}
                onChange={(e) =>
                  updateField("max_length", e.target.value ? parseInt(e.target.value) : null)
                }
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., 500"
              />
            </div>
          )}

          {/* Min/Max Value (for number) */}
          {form.field_type === "number" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Min Value
                </label>
                <input
                  type="number"
                  value={form.min_value ?? ""}
                  onChange={(e) =>
                    updateField("min_value", e.target.value ? parseInt(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Max Value
                </label>
                <input
                  type="number"
                  value={form.max_value ?? ""}
                  onChange={(e) =>
                    updateField("max_value", e.target.value ? parseInt(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 10"
                />
              </div>
            </div>
          )}

          {/* Default Value */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Default Value
            </label>
            <input
              type="text"
              value={form.default_value}
              onChange={(e) => updateField("default_value", e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Pre-selected value (optional)"
            />
          </div>

          {/* Sort Order + Required + Active row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_required}
                  onChange={(e) => updateField("is_required", e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-zinc-300">Required</span>
              </label>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateField("is_active", e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-zinc-300">Active</span>
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Update Question" : "Create Question"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
