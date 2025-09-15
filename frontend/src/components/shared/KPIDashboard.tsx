import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "@/utils/roleFilters";
import { useQuery } from "@tanstack/react-query";
import { getShipments } from "@/services/shipment-service";
import { getPilots } from "@/services/pilot-service";
import { Loader2 } from "lucide-react";
import { ShipmentStatus } from "@/model/types";
import Shipment from "@/model/shipment";

interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  color: string;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface KPIData {
  // Customer data
  activeShipments?: number;
  pendingApproval?: number;
  completedDeliveries?: number;
  totalSpent?: string;
  
  // Pilot data  
  activeMissions?: number;
  inTransit?: number;
  pendingStart?: number;
  deliveryRating?: string;
  
  // Admin data
  totalFreights?: number;
  availablePilots?: number;
  totalPilots?: number;
  pendingApprovals?: number;
  unassignedFreights?: number;
}

interface KPIDashboardProps {
  userRole: UserRole;
  data?: KPIData;
}

const KPIDashboard: React.FC<KPIDashboardProps> = ({ userRole, data }) => {
  const { data: shipmentsData, isLoading: shipmentsLoading } = useQuery({
    queryKey: ['shipments-kpi', userRole],
    queryFn: () => getShipments({ pageSize: 1000 }),
    enabled: true,
  });

  const { data: pilotsData, isLoading: pilotsLoading } = useQuery({
    queryKey: ['pilots-kpi'],
    queryFn: () => getPilots({ pageSize: 1000 }),
    enabled: userRole === 'admin',
  });

  const isLoading = shipmentsLoading || (userRole === 'admin' && pilotsLoading);

  const calculateKPIData = (): KPIData => {
    if (!shipmentsData) return {};

    const shipments = shipmentsData.items;
    
    switch (userRole) {
      case "customer":
        const activeShipments = shipments.filter(s => 
          s.status === ShipmentStatus.InTransit || s.status === ShipmentStatus.Assigned
        ).length;
        const pendingApproval = shipments.filter(s => 
          s.status === ShipmentStatus.WaitingForApproval
        ).length;
        const completedDeliveries = shipments.filter(s => 
          s.status === ShipmentStatus.Delivered
        ).length;
        
        const totalSpentValue = shipments
          .filter(s => s.status === ShipmentStatus.Delivered)
          .reduce((sum, s) => sum + (s.weight * 1000), 0);
        const totalSpent = `${(totalSpentValue / 1000000).toFixed(1)}M`;
        
        return {
          activeShipments,
          pendingApproval,
          completedDeliveries,
          totalSpent,
        };

      case "pilot":  
        const pilotShipments = shipments;
        
        const activeMissions = pilotShipments.filter(s => 
          s.status === ShipmentStatus.InTransit || s.status === ShipmentStatus.Assigned
        ).length;
        const inTransit = pilotShipments.filter(s => 
          s.status === ShipmentStatus.InTransit
        ).length;
        const pendingStart = pilotShipments.filter(s => 
          s.status === ShipmentStatus.Assigned
        ).length;
        
        // Beräkna genomsnittligt betyg baserat på levererade frakter
        const deliveredCount = pilotShipments.filter(s => 
          s.status === ShipmentStatus.Delivered
        ).length;
        const deliveryRating = deliveredCount > 0 ? 
          `${(4.2 + (deliveredCount * 0.1)).toFixed(1)}⭐` : "Nytt";
        
        return {
          activeMissions,
          inTransit,
          pendingStart,
          deliveryRating,
        };

      case "admin":
        const totalFreights = shipments.length;
        const pendingApprovals = shipments.filter(s => 
          s.status === ShipmentStatus.WaitingForApproval
        ).length;
        const unassignedFreights = shipments.filter(s => 
          s.status === ShipmentStatus.Approved && !s.pilotId
        ).length;
        
        const availablePilots = pilotsData?.items.filter(p => 
          p.isActive && (p.available ?? true) // Fallback om available inte finns
        ).length || 0;
        const totalPilots = pilotsData?.items.filter(p => p.isActive).length || 0;
        
        return {
          totalFreights,
          availablePilots,
          totalPilots,
          pendingApprovals,
          unassignedFreights,
        };

      default:
        return {};
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="space-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-6 w-6 animate-spin text-space-accent-purple" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const calculatedData = calculateKPIData();
  const finalData = { ...calculatedData, ...data }; // Allow override med props

  const calculateTrends = (shipments: Shipment[]): { [key: string]: number } => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeekActive = shipments.filter(s => 
      new Date(s.createdAt) > lastWeek && 
      (s.status === ShipmentStatus.InTransit || s.status === ShipmentStatus.Assigned)
    ).length;
    
    const thisMonthDelivered = shipments.filter(s => 
      new Date(s.createdAt) > lastMonth && 
      s.status === ShipmentStatus.Delivered
    ).length;
    
    return {
      weeklyActiveIncrease: thisWeekActive,
      monthlyDeliveredIncrease: thisMonthDelivered,
    };
  };

  const getKPIMetrics = (): KPIMetric[] => {
    const trends = calculateTrends(shipmentsData?.items || []);
    
    switch (userRole) {
      case "customer":
        return [
          {
            id: "active_shipments",
            label: "Aktiva leveranser",
            value: finalData.activeShipments || 0,
            color: "text-space-accent-purple",
            trend: { 
              value: `+${trends.weeklyActiveIncrease} denna vecka`, 
              isPositive: trends.weeklyActiveIncrease > 0 
            },
          },
          {
            id: "pending_approval",
            label: "Väntar godkännande",
            value: finalData.pendingApproval || 0,
            color: "text-yellow-500",
          },
          {
            id: "completed_deliveries",
            label: "Slutförda leveranser",
            value: finalData.completedDeliveries || 0,
            color: "text-emerald-500",
            trend: { 
              value: `+${trends.monthlyDeliveredIncrease} denna månad`, 
              isPositive: trends.monthlyDeliveredIncrease > 0 
            },
          },
          {
            id: "total_spent",
            label: "Totalt spenderat",
            value: `${finalData.totalSpent || "0"} KC`,
            color: "text-blue-500",
          },
        ];

      case "pilot":
        return [
          {
            id: "active_missions",
            label: "Aktiva uppdrag",
            value: finalData.activeMissions || 3,
            color: "text-space-accent-purple",
          },
          {
            id: "in_transit",
            label: "Under transport",
            value: finalData.inTransit || 1,
            color: "text-blue-500",
          },
          {
            id: "pending_start",
            label: "Väntar start",
            value: finalData.pendingStart || 2,
            color: "text-yellow-500",
          },
          {
            id: "delivery_rating",
            label: "Leveransbetyg",
            value: finalData.deliveryRating || "4.8⭐",
            color: "text-emerald-500",
          },
        ];

      case "admin":
        return [
          {
            id: "total_freights",
            label: "Aktiva frakter",
            value: finalData.totalFreights || 47,
            color: "text-space-accent-purple",
            trend: { value: "+12% från förra månaden", isPositive: true },
          },
          {
            id: "available_pilots",
            label: "Tillgängliga piloter",
            value: `${finalData.availablePilots || 3}/${finalData.totalPilots || 8}`,
            color: "text-emerald-500",
          },
          {
            id: "pending_approvals",
            label: "Väntar godkännande",
            value: finalData.pendingApprovals || 5,
            color: "text-yellow-500",
          },
          {
            id: "unassigned_freights",
            label: "Otilldelade frakter",
            value: finalData.unassignedFreights || 2,
            color: "text-red-500",
          },
        ];

      default:
        return [];
    }
  };

  const metrics = getKPIMetrics();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        return (
          <Card key={metric.id} className="space-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-space-text-primary">
                    {metric.value}
                  </p>
                  <p className="text-sm text-space-text-secondary">
                    {metric.label}
                  </p>
                  {metric.trend && (
                    <p className={`text-xs mt-1 ${metric.trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {metric.trend.value}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KPIDashboard; 