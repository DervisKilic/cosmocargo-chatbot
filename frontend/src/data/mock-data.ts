export interface MockPilot {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    experience: string;
    assignedShipments: number;
    rating: number;
    available?: boolean;
}

export interface MockShipment {
    id: string;
    customer: string;
    origin: string;
    destination: string;
    scheduledDate: string;
    status: string;
    cargo: string;
    weight?: string;
    pilot?: string | null;
}

export interface MockOngoingShipment {
    id: string;
    from: string;
    to: string;
    date: string;
    status: string;
    progress: number;
    pilot: string;
    ship: string;
}

export const MOCK_PILOTS: MockPilot[] = [
    {
        id: "P1001",
        name: "Erik Nilsson",
        email: "pilot@example.com",
        status: "active",
        experience: "5 years",
        assignedShipments: 1,
        rating: 4.8,
        available: true
    },
    {
        id: "P1002",
        name: "Anna Lindberg",
        email: "anna.lindberg@example.com",
        status: "inactive",
        experience: "3 years",
        assignedShipments: 0,
        rating: 4.5,
        available: true
    },
    {
        id: "P1003",
        name: "Lars Svensson",
        email: "lars.svensson@example.com",
        status: "active",
        experience: "7 years",
        assignedShipments: 1,
        rating: 4.9,
        available: false
    }
];

export const MOCK_SHIPMENTS: MockShipment[] = [
    {
        id: "SHIP-1001",
        customer: "Johan Andersson",
        origin: "Stockholm, Sweden",
        destination: "Lunar Colony Alpha",
        scheduledDate: "2025-04-25",
        status: "pending_approval",
        cargo: "Scientific Equipment",
        weight: "250kg",
        pilot: null
    },
    {
        id: "SHIP-1002",
        customer: "Maria Johansson",
        origin: "Gothenburg, Sweden",
        destination: "Mars Base One",
        scheduledDate: "2025-04-28",
        status: "approved",
        cargo: "Medical Supplies",
        weight: "180kg",
        pilot: null
    },
    {
        id: "SHIP-1003",
        customer: "Erik Nilsson",
        origin: "Malmö, Sweden",
        destination: "Titan Research Station",
        scheduledDate: "2025-05-02",
        status: "assigned",
        cargo: "Construction Materials",
        weight: "500kg",
        pilot: "Lars Svensson"
    }
];

export const MOCK_ASSIGNED_SHIPMENTS: MockShipment[] = [
    {
        id: "SHIP-1001",
        customer: "Johan Andersson",
        origin: "Stockholm, Sweden",
        destination: "Lunar Colony Alpha",
        scheduledDate: "2025-04-25",
        status: "pending",
        cargo: "Scientific Equipment"
    },
    {
        id: "SHIP-1002",
        customer: "Maria Johansson",
        origin: "Gothenburg, Sweden",
        destination: "Mars Base One",
        scheduledDate: "2025-04-28",
        status: "in_transit",
        cargo: "Medical Supplies"
    },
    {
        id: "SHIP-1003",
        customer: "Erik Nilsson",
        origin: "Malmö, Sweden",
        destination: "Titan Research Station",
        scheduledDate: "2025-05-02",
        status: "completed",
        cargo: "Construction Materials"
    }
];

export const MOCK_ONGOING_SHIPMENTS: MockOngoingShipment[] = [
    {
        id: "SC-1234567",
        from: "Jorden, Alpha Station",
        to: "Mars, Olympus Station",
        date: "2023-04-10",
        status: "I transit",
        progress: 60,
        pilot: "Anna Karlsson",
        ship: "Stellar Phoenix IX"
    },
    {
        id: "SC-7654321",
        from: "Jorden, Beta Station",
        to: "Europa, Ice Harbor",
        date: "2023-04-12",
        status: "Förbereder",
        progress: 20,
        pilot: "Marcus Lindqvist",
        ship: "Quantum Voyager"
    },
    {
        id: "SC-9876543",
        from: "Mars, Olympus Station",
        to: "Jorden, Gamma Station",
        date: "2023-04-08",
        status: "Närmar sig destination",
        progress: 85,
        pilot: "Elsa Berg",
        ship: "Nebula Sprinter"
    }
];

export const SHIPMENT_STATUS_MAP = {
    pending_approval: { label: "Väntar på godkännande", color: "bg-amber-500" },
    approved: { label: "Godkänd", color: "bg-blue-500" },
    assigned: { label: "Tilldelad", color: "bg-green-500" },
    rejected: { label: "Nekad", color: "bg-red-500" },
    completed: { label: "Avslutad", color: "bg-purple-500" },
    pending: { label: "Väntar", color: "bg-amber-500" },
    in_transit: { label: "Under transport", color: "bg-blue-500" },
    preparing: { label: "Förbereder", color: "bg-yellow-500" },
    approaching: { label: "Närmar sig destination", color: "bg-indigo-500" }
}; 