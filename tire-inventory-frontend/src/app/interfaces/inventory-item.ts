export interface InventoryItem {
  id?: number;
  name: string; // Add this field
  sku: string;
  quantity: number;
  price?: number; // Unified to `cost`
  brand?: string;
  model?: string;
  size?: string;
  type?: string;
  location?: string;
  minimumStock?: number;
  season?: string;
  speedRating?: string;
  loadIndex?: string;
  dot?: string;
  imageUrl?: string;
  notes?: string;
  warrantyMonths?: number;
  manufactureDate?: Date;
  treadDepth?: number;
  weight?: number;
  lastUpdated?: Date;
}
