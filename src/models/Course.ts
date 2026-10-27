export interface Course {
  id: number;
  title: string;
  description: string | null;

  instructorId: number;
  instructorName?: string | null;
  instructorSpecialty?: string | null;

  categoryId: number;
  categoryName?: string | null;

  locationId: number | null;
  locationName?: string | null;
  locationAddress?: string | null;

  modalityId: number;
  modalityName?: string | null;

  startDate: string;
  endDate: string;
  schedule: string | null;
  targetAudience: string | null;

  maxCapacity: number;
  occupiedCapacity: number | null;

  cost: string | null;
  imageUrl: string | null;

  active: boolean;

  createdAt?: string | null;
  updatedAt?: string | null;
}