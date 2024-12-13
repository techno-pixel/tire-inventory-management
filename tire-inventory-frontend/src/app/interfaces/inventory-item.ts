export interface InventoryItem {
  id?: number;
  sku: string;
  brand: string;
  model: string;
  size: string;  // e.g., "225/45R17"
  type: string;  // e.g., "All Season", "Winter", "Summer"
  quantity: number;
  price: number;
  cost: number;
  location: string;
  minimumStock: number;
  season: string;
  speedRating: string;
  loadIndex: string;
  dot: string;  // DOT code
  imageUrl?: string;
  notes?: string;
  lastUpdated?: Date;
  warrantyMonths?: number;
  manufactureDate?: Date;
}