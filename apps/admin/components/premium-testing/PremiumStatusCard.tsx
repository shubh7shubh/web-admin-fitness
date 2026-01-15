export function PremiumStatusCard({ status }: { status: any }) {
  if (!status) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Current Premium Status</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-zinc-400">Assessment Status</p>
          <p className="text-white font-medium">{status.assessment_status || "None"}</p>
        </div>
        <div>
          <p className="text-zinc-400">Has Diet Plan</p>
          <p className="text-white font-medium">{status.has_diet_plan ? "✓ Yes" : "✗ No"}</p>
        </div>
        <div>
          <p className="text-zinc-400">Has Workout Plan</p>
          <p className="text-white font-medium">{status.has_workout_plan ? "✓ Yes" : "✗ No"}</p>
        </div>
      </div>
    </div>
  );
}
