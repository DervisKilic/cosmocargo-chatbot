import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
  disabled?: boolean;
}

interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
  layout?: "horizontal" | "vertical";
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  title, 
  actions, 
  layout = "horizontal" 
}) => {
  return (
    <Card className="space-card">
      <CardHeader>
        <CardTitle className="font-orbitron">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`flex gap-4 ${layout === "vertical" ? "flex-col" : "flex-wrap"}`}>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={action.onClick}
                variant={action.variant || "default"}
                disabled={action.disabled}
                className={
                  action.variant === "outline"
                    ? "border-space-secondary hover:bg-space-secondary/30"
                    : action.variant === "default"
                    ? "bg-space-accent-purple hover:bg-space-accent-purple/80"
                    : undefined
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions; 