export interface ValidationResult {
  isValid: boolean
  error?: string
}

export type SearchType = "name" | "number"

export function validatePokemonSearch(searchValue: string, searchType: SearchType): ValidationResult {
  if (!searchValue || searchValue.trim().length === 0) {
    return {
      isValid: true
    }
  }

  const trimmedValue = searchValue.trim()

  if (searchType === "name") {
    if (trimmedValue.length < 3) {
      return {
        isValid: false,
        error: "El nombre debe tener al menos 3 caracteres.",
      }
    }

    const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    if (!onlyLettersRegex.test(trimmedValue)) {
      return {
        isValid: false,
        error: "El nombre no debe contener caracteres especiales ni números.",
      }
    }
  } else {

    const numberValue = trimmedValue.replace("#", "")

    const onlyNumbersRegex = /^\d+$/
    if (!onlyNumbersRegex.test(numberValue)) {
      return {
        isValid: false,
        error: "El número debe contener solo dígitos (ej: 25 o #025).",
      }
    }

    const pokemonNumber = Number.parseInt(numberValue, 10)
    if (pokemonNumber < 1) {
      return {
        isValid: false,
        error: "El número debe ser mayor a 0.",
      }
    }
  }

  return {
    isValid: true,
  }
}
