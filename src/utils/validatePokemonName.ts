export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validatePokemonName(name: string): ValidationResult {

  if (!name || name.trim().length === 0) {
    return {
      isValid: true, 
    }
  }

  const trimmedName = name.trim()

  if (trimmedName.length < 3) {
    return {
      isValid: false,
      error: "El nombre debe tener al menos 3 caracteres.",
    }
  }

  const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  if (!onlyLettersRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: "El nombre no debe contener caracteres especiales ni números.",
    }
  }

  return {
    isValid: true,
  }
}
