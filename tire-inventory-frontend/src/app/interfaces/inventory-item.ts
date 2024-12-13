export interface InventoryItem {
  id?: number;
  sku: string;
  brand: string;
  model: string;
  size: string;
  type: string;
  quantity: number;
  price: number;
  cost: number;
  location: string;
  minimumStock: number;
  season: string;
  speedRating: string;
  loadIndex: string;
  dot?: string;
  imageUrl?: string;
  notes?: string;
  lastUpdated?: Date;
  warrantyMonths?: number;
  manufactureDate?: Date;
  treadDepth?: number; // Example of new field
  weight?: number; // Example of new field
}