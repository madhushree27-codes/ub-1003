import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
}

const variantClasses = {
  default: "bg-card border-border",
  primary: "gradient-stat text-primary-foreground border-transparent",
  success: "bg-card border-success/20",
  warning: "bg-card border-warning/20",
  destructive: "bg-card border-destructive/20",
};

const iconVariants = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export default function StatsCard({ title, value, subtitle, icon: Icon, variant = "default" }: StatsCardProps) {
  return (
    <div className={`rounded-xl border p-5 shadow-card transition-all hover:shadow-elevated ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-sm font-medium ${variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {title}
          </p>
          <p className="text-2xl font-bold font-display">{value}</p>
          {subtitle && (
            <p className={`text-xs ${variant === "primary" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${iconVariants[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
