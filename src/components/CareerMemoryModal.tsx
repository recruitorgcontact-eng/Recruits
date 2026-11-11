import React, { useState } from "react";
import { Database, X, Plus, Trash2, ShieldCheck, Check, Save, Trophy, Award, UserCheck } from "lucide-react";
import { CareerMemory } from "../types";
import { SkillMastery } from "./SkillMastery";

interface CareerMemoryModalProps {
  memory: CareerMemory;
  isOpen: boolean;
  onClose: () => void;
  onSaveMemory: (updated: CareerMemory) => void;
}

export const CareerMemoryModal: React.FC<CareerMemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  onSaveMemory,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"skill_mastery" | "memory_vault">("skill_mastery");
  const [formMemory, setFormMemory] = useState<CareerMemory>({ ...memory });
  const [newSkill, setNewSkill] = useState("");
  const [newCert, setNewCert] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const handleSave = () => {
    onSaveMemory(formMemory);
    onClose();
  };

  const addSkill = () => {
    if (newSkill.trim() && !formMemory.skills.includes(newSkill.trim())) {
      setFormMemory({ ...formMemory, skills: [...formMemory.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormMemory({ ...formMemory, skills: formMemory.skills.filter((s) => s !== skillToRemove) });
  };

  const addCert = () => {
    if (newCert.trim() && !formMemory.certifications.includes(newCert.trim())) {
      setFormMemory({ ...formMemory, certifications: [...formMemory.certifications, newCert.trim()] });
      setNewCert("");
    }
  };

  const removeCert = (certToRemove: string) => {
    setFormMemory({
      ...formMemory,
      certifications: formMemory.certifications.filter((c) => c !== certToRemove),
    });
  };

  const addLocation = () => {
    if (newLocation.trim() && !formMemory.preferredLocations.includes(newLocation.trim())) {
      setFormMemory({
        ...formMemory,
        preferredLocations: [...formMemory.preferredLocations, newLocation.trim()],
      });
      setNewLocation("");
    }
  };

  const removeLocation = (locToRemove: string) => {
    setFormMemory({
      ...formMemory,
      preferredLocations: formMemory.preferredLocations.filter((l) => l !== locToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          id="btn-close-memory-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header & Sub-Tab Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 via-amber-500 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Candidate User Profile & Skill Mastery</h2>
              <p className="text-xs text-slate-400">
                Earned Badges, Goal Readiness & Arohi Career Memory Vault
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              id="tab-skill-mastery"
              onClick={() => setActiveTab("skill_mastery")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "skill_mastery"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Trophy className="w-4 h-4 text-slate-900" /> Skill Mastery & Badges
            </button>

            <button
              id="tab-memory-vault"
              onClick={() => setActiveTab("memory_vault")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "memory_vault"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database className="w-4 h-4 text-indigo-300" /> Memory Vault Settings
            </button>
          </div>
        </div>

        {activeTab === "skill_mastery" ? (
          <SkillMastery
            memory={formMemory}
            onUpdateMemory={(updated) => {
              setFormMemory(updated);
              onSaveMemory(updated);
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Permission Toggle */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Career Memory Permission</p>
                  <p className="text-[11px] text-slate-400">
                    Allow Arohi Career AI to remember education, skills, and goals across sessions.
                  </p>
                </div>
              </div>
              <button
                id="toggle-memory-permission"
                onClick={() =>
                  setFormMemory({ ...formMemory, permissionGranted: !formMemory.permissionGranted })
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  formMemory.permissionGranted
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {formMemory.permissionGranted ? "Active (Granted)" : "Disabled"}
              </button>
            </div>

        <div className="space-y-6">
          {/* Target Role & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Role</label>
              <input
                type="text"
                value={formMemory.targetRole}
                onChange={(e) => setFormMemory({ ...formMemory, targetRole: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Target Salary (₹ Lakhs PA)
              </label>
              <input
                type="number"
                value={formMemory.expectedSalaryINR}
                onChange={(e) =>
                  setFormMemory({ ...formMemory, expectedSalaryINR: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Years of Experience</label>
              <input
                type="number"
                value={formMemory.experienceYears}
                onChange={(e) =>
                  setFormMemory({ ...formMemory, experienceYears: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Education */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-200">Education Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Degree (e.g. B.Tech CS)"
                value={formMemory.education.degree}
                onChange={(e) =>
                  setFormMemory({
                    ...formMemory,
                    education: { ...formMemory.education, degree: e.target.value },
                  })
                }
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Field / Major"
                value={formMemory.education.field}
                onChange={(e) =>
                  setFormMemory({
                    ...formMemory,
                    education: { ...formMemory.education, field: e.target.value },
                  })
                }
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Institution"
                value={formMemory.education.institution}
                onChange={(e) =>
                  setFormMemory({
                    ...formMemory,
                    education: { ...formMemory.education, institution: e.target.value },
                  })
                }
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Graduation Year"
                value={formMemory.education.graduationYear}
                onChange={(e) =>
                  setFormMemory({
                    ...formMemory,
                    education: { ...formMemory.education, graduationYear: e.target.value },
                  })
                }
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Skills & Tech Stack</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formMemory.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded-xl text-xs font-medium"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1"
              />
              <button
                onClick={addSkill}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Certifications</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formMemory.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-200 px-2.5 py-1 rounded-xl text-xs font-medium"
                >
                  {cert}
                  <button onClick={() => removeCert(cert)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add certification (e.g. AWS Cloud Practitioner)..."
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCert()}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1"
              />
              <button
                onClick={addCert}
                className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Goals Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Long-Term Career Vision</label>
            <textarea
              rows={3}
              value={formMemory.careerGoals}
              onChange={(e) => setFormMemory({ ...formMemory, careerGoals: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            id="btn-save-memory-vault"
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Memory Vault
          </button>
        </div>
      </div>
    )}
  </div>
</div>
  );
};
