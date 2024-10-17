export interface Maintenance {
  id: number;
  vehicleId: number;
  date: string;
  serviceType: string;
  cost: number;
  observations: string;
}