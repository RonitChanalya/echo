export interface MemoryMedia {
  url: string;
  storageKey: string;
  mimeType: string;
  size?: number;
}

export interface Memory {
  _id: string;
  ownerId: string;

  title?: string;
  description?: string;

  media: MemoryMedia[];

  capturedAt?: string;

  location?: {
    name?: string;
    latitude?: number;
    longitude?: number;
  };

  aiStatus:
    | "not_processed"
    | "processing"
    | "processed"
    | "failed";

  createdAt: string;
  updatedAt: string;
}