export enum UserRole {
    Customer = "customer",
    Pilot = "pilot",
    Admin = "admin"
}

export enum ShipmentStatus {
    WaitingForApproval = 'WaitingForApproval',
    Approved = 'Approved',
    Denied = 'Denied',
    Assigned = 'Assigned',
    InTransit = 'InTransit',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled'
}

export enum RiskLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical'
}
