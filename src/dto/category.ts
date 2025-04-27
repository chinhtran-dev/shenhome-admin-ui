export interface Category {
  id: string;
  status?: string;
  name: string;
  createdOn?: string;
  modifiedOn?: string;
}

// Mock data
export const mockCategories: Category[] = [
  { id: "1", status: "Enabled", name: "Switch" },
  { id: "2", status: "Enabled", name: "Lighting" },
  { id: "3", status: "Enabled", name: "Sensor" },
];

export const mockSelectCategories: Category[] = [
	{ id: "1", name: "Switch" },
	{ id: "2", name: "Lighting" },
	{ id: "3", name: "Sensor" },
]
