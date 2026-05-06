export type StaffRole =
  | "Admin"
  | "Reception"
  | "Cashier"
  | "RoomService"
  | "Restaurant";


export interface AuthUser {
  staffId: number;
  fullName: string;
  role: StaffRole;
  token: string;
}

export interface Room {
  id: number;
  roomNumber: string;
  type: "Single" | "Double" | "Suite";
  status: "Available" | "Occupied" | "Dirty" | "Maintenance";
  pricePerNight: number;
}

export interface Reservation {
  id: number;
  guestName: string;
  guestPhone: string;
  roomNumber: string | null;
  status: "Pending" | "CheckedIn" | "CheckedOut" | "Cancelled";
  source: "Phone" | "WalkIn";
  checkInDate: string;
  checkOutDate: string;
}

export interface FolioLine {
  id: number;
  lineType: "RoomCharge" | "RestaurantCharge" | "Other";
  description: string;
  amount: number;
  createdAt: string;
}

export interface Folio {
  id: number;
  reservationId: number;
  guestName: string;
  roomNumber: string;
  isPaid: boolean;
  total: number;
  createdAt: string;
  lines: FolioLine[];
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
}

export interface Staff {
  id: number;
  fullName: string;
  username: string;
  role: StaffRole;
  isActive: boolean;
}