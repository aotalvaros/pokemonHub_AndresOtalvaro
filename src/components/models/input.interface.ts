export type SearchType = "name" | "number" | "type";
export type SortOption = "number" | "name" | "type";

export interface SearchConfig {
  type: SearchType;
  placeholder: string;
  badgeMessage: string;
  minLength: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}