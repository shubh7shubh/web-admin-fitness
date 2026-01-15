import { Button } from "@/components/ui/button";

interface StateButtonsProps {
  onStateChange: (state: string) => Promise<void>;
  loading: boolean;
}

export function StateButtons({ onStateChange, loading }: StateButtonsProps) {
  const states = [
    {
      value: "upsell",
      label: "Set to Upsell",
      description: "Free user, no plans",
      icon: "🔓",
      variant: "outline" as const,
    },
    {
      value: "needs_assessment",
      label: "Needs Assessment",
      description: "Premium, no assessment",
      icon: "📝",
      variant: "default" as const,
    },
    {
      value: "pending",
      label: "Set to Pending",
      description: "Assessment submitted",
      icon: "⏳",
      variant: "secondary" as const,
    },
    {
      value: "active",
      label: "Set to Active",
      description: "Full premium with plans",
      icon: "✅",
      variant: "default" as const,
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Quick State Changes</h3>
      <div className="grid grid-cols-2 gap-4">
        {states.map((state) => (
          <Button
            key={state.value}
            onClick={() => onStateChange(state.value)}
            disabled={loading}
            variant={state.variant}
            className="flex flex-col items-start p-6 h-auto"
          >
            <span className="text-3xl mb-2">{state.icon}</span>
            <span className="font-semibold">{state.label}</span>
            <span className="text-xs opacity-70">{state.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
