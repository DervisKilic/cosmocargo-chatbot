namespace CosmoCargo.Model
{
    /// <summary>
    /// Represents the current status of a shipment in the system.
    /// </summary>
    /// <remarks>
    /// - Initial state: WaitingForApproval
    /// - Final states: Delivered, Cancelled, Denied
    /// - Only admins can approve/deny shipments
    /// - Only pilots can update status to InTransit
    /// - Any role can cancel a shipment
    /// </remarks>
    public enum ShipmentStatus
    {
        /// <summary>
        /// Shipment is waiting for admin approval
        /// </summary>
        WaitingForApproval,

        /// <summary>
        /// Shipment has been approved by admin
        /// </summary>
        Approved,

        /// <summary>
        /// Shipment has been denied by admin
        /// </summary>
        Denied,

        /// <summary>
        /// Shipment has been assigned to a pilot
        /// </summary>
        Assigned,

        /// <summary>
        /// Shipment is currently in transit
        /// </summary>
        InTransit,

        /// <summary>
        /// Shipment has been delivered to its destination
        /// </summary>
        Delivered,

        /// <summary>
        /// Shipment has been cancelled
        /// </summary>
        Cancelled
    }
} 