export interface Maintenance {
  id: string;
  vehicleId: string;
  date: string;
  serviceType: string;
  cost: number;
  observations: string;
  userId?: string;
}