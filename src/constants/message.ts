import { SearchConfig, SortOption } from "@components/models/input.interface";

export const SEARCH_CONFIGS: Record<SortOption, SearchConfig> = {
  name: {
    type: "name",
    placeholder: "Buscar por nombre...",
    badgeMessage: "Presione Enter para buscar por nombre",
    minLength: 3,
  },
  number: {
    type: "number", 
    placeholder: "Buscar por número (ej: 001 o #025)...",
    badgeMessage: "Presione Enter para buscar por número",
    minLength: 1,
  },
  type: {
    type: "type",
    placeholder: "Buscar por tipo (ej: water, fire, poison)...",
    badgeMessage: "Presione Enter para buscar por tipo",
    minLength: 3,
  },
} as const;

export const VALIDATION_MESSAGES = {
  ENTER_TO_SEARCH: "Presione Enter para buscar",
  ESCAPE_TO_CLEAR: "Presione Escape para limpiar",
} as const;