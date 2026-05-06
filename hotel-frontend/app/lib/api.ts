const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.10:5199";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("hotel_auth");
  if (!raw) return null;
  try {
    return JSON.parse(raw).token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  console.log("Environment Var:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Calculated BASE_URL:", BASE_URL);
  console.log("Final Fetch URL:", `${BASE_URL}${path}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; fullName: string; role: string; staffId: number }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ username, password }) }
    ),
};

export const roomsApi = {
  getAll: () => request<import("@/app/types").Room[]>("/api/rooms"),
  updateStatus: (id: number, status: string) =>
    request<void>(`/api/rooms/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

export const reservationsApi = {
  getActive: () =>
    request<import("@/app/types").Reservation[]>("/api/reservations"),
  phoneBooking: (data: {
    guestFullName: string;
    guestPhone: string;
    checkInDate: string;
    checkOutDate: string;
  }) =>
    request<import("@/app/types").Reservation>("/api/reservations/phone", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  checkIn: (data: {
    guestFullName: string;
    guestPhone: string;
    nationalId?: string;
    roomId: number;
    checkOutDate: string;
    existingReservationId?: number | null;
  }) =>
    request<import("@/app/types").Reservation>("/api/reservations/checkin", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};


export const folioApi = {
  getByGuest: (guestId: number) =>
    request<import("@/app/types").Folio>(`/api/folio/guest/${guestId}`),
  getByReservation: (reservationId: number) =>
    request<import("@/app/types").Folio>(`/api/folio/reservation/${reservationId}`),
  confirmPayment: (folioId: number) =>
    request<void>(`/api/folio/${folioId}/confirm-payment`, {
      method: "POST",
    }),
};

export const restaurantApi = {
  addCharge: (data: {
    guestId: number;
    description: string;
    amount: number;
  }) =>
    request<void>("/api/restaurant/charge", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const inventoryApi = {
  getAll: () =>
    request<import("@/app/types").InventoryItem[]>("/api/inventory"),
  use: (data: { roomId: number; itemId: number; quantity: number }) =>
    request<void>("/api/inventory/use", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const staffApi = {
  getAll: () => request<import("@/app/types").Staff[]>("/api/staff"),
};