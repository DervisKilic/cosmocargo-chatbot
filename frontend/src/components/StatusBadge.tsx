import { ShipmentStatus } from "@/model/types";
import { getStatusColorClass, getStatusDisplayText } from "@/utils/shipment-status";

const StatusBadge = ({ status }: { status: ShipmentStatus }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(status)}`}>
      {getStatusDisplayText(status)}
    </span>
  );
};

export default StatusBadge;