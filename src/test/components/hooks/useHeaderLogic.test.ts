import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, it, afterEach, vi, expect, beforeEach } from "vitest";
import { useHeaderLogic } from "../../../components/hooks/useHeaderLogic";
import { validatePokemonSearch } from '../../../utils/validatePokemonSearch';
import { ValidationResult } from "../../../components/models/input.interface";

vi.mock('../../../utils/validatePokemonSearch');

const mocksearchValue = 'pikachu';
const mockonInputChange = vi.fn();
const mockonSearchChange = vi.fn();
const mocksort = "name";

describe("useHeaderLogic", () => {

    const returnValidatePokemonSearch: ValidationResult = {
        isValid: true,
        error: ""
    }

    beforeEach(() => {
        vi.mocked(validatePokemonSearch).mockReturnValue(returnValidatePokemonSearch);
    })

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        expect(result.current.isSortMenuOpen).toBe(false);
        expect(result.current.showValidationPopup).toBe(false);
        expect(result.current.validationMessage).toBe("");
        expect(result.current.isInputFocused).toBe(false);
    });

    it('should toggle sort menu', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        act(() => {
            result.current.toggleSortMenu();
        });

        expect(result.current.isSortMenuOpen).toBe(true);

        act(() => {
            result.current.toggleSortMenu();
        });

        expect(result.current.isSortMenuOpen).toBe(false);
    });

    it('should close validation popup', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        act(() => {
            result.current.closeValidationPopup();
        });

        expect(result.current.showValidationPopup).toBe(false);
    });

    it('should handle search input change', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        const mockEvent = {
            target: { value: 'charizard' }
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleSearchChange(mockEvent);
        });

        expect(mockonInputChange).toHaveBeenCalledWith('charizard');
    });

    it('should handle Enter key with valid search', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "name"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(validatePokemonSearch).toHaveBeenCalledWith('pikachu', 'name');
        expect(mockonSearchChange).toHaveBeenCalledWith('pikachu');
    });

    it('should handle Enter key with invalid search', () => {
        const invalidValidationResult: ValidationResult = {
            isValid: false,
            error: "Invalid Pokemon name"
        };

        vi.mocked(validatePokemonSearch).mockReturnValue(invalidValidationResult);

        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "name"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(validatePokemonSearch).toHaveBeenCalledWith('pikachu', 'name');
        expect(result.current.showValidationPopup).toBe(true);
        expect(result.current.validationMessage).toBe("Invalid Pokemon name");
        expect(mockonSearchChange).toHaveBeenCalledWith("");
    });

    it('should handle Enter key with number sort type', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: "25",
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "number"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(validatePokemonSearch).toHaveBeenCalledWith('25', 'number');
        expect(mockonSearchChange).toHaveBeenCalledWith('25');
    });

    it('should handle Enter key with type sort', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: "electric",
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "type"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(validatePokemonSearch).toHaveBeenCalledWith('electric', 'type');
        expect(mockonSearchChange).toHaveBeenCalledWith('electric');
    });

    it('should handle Escape key', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        const mockEvent = {
            key: 'Escape'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyUp(mockEvent);
        });

        expect(mockonInputChange).toHaveBeenCalledWith("");
        expect(mockonSearchChange).toHaveBeenCalledWith("");
    });

    it('should not trigger on non-Enter key down', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        const mockEvent = {
            key: 'Tab'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(validatePokemonSearch).not.toHaveBeenCalled();
        expect(mockonSearchChange).not.toHaveBeenCalled();
    });

    it('should not trigger on non-Escape key up', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        const mockEvent = {
            key: 'Tab'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyUp(mockEvent);
        });

        expect(mockonInputChange).not.toHaveBeenCalled();
        expect(mockonSearchChange).not.toHaveBeenCalled();
    });

    it('should set sort menu open state', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        act(() => {
            result.current.setIsSortMenuOpen(true);
        });

        expect(result.current.isSortMenuOpen).toBe(true);
    });

    it('should set input focused state', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        act(() => {
            result.current.setIsInputFocused(true);
        });

        expect(result.current.isInputFocused).toBe(true);
    });

    it('should work with default props', () => {
        const { result } = renderHook(() => useHeaderLogic({}));

        expect(result.current.isSortMenuOpen).toBe(false);
        expect(result.current.showValidationPopup).toBe(false);
        expect(result.current.isInputFocused).toBe(false);
    });

    it('should handle search change when onInputChange is undefined', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onSearchChange: mockonSearchChange,
            sort: mocksort
        }));

        const mockEvent = {
            target: { value: 'charizard' }
        } as React.ChangeEvent<HTMLInputElement>;

        expect(() => {
            act(() => {
                result.current.handleSearchChange(mockEvent);
            });
        }).not.toThrow();
    });

    it('should handle trimmed values correctly for name search', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: "  pikachu  ",
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "name"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(mockonSearchChange).toHaveBeenCalledWith('pikachu');
    });

    it('should handle trimmed values correctly for number search', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: "  25  ",
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "number"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(mockonSearchChange).toHaveBeenCalledWith('25');
    });

    it('should handle Enter key when onSearchChange is undefined', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            sort: "name"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        expect(() => {
            act(() => {
                result.current.handleKeyDown(mockEvent);
            });
        }).not.toThrow();
    });

    it('should handle Escape key when callbacks are undefined', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            sort: mocksort
        }));

        const mockEvent = {
            key: 'Escape'
        } as React.KeyboardEvent<HTMLInputElement>;

        expect(() => {
            act(() => {
                result.current.handleKeyUp(mockEvent);
            });
        }).not.toThrow();
    });

    it('should return correct searchConfig for name sort', () => {
        const { result } = renderHook(() => useHeaderLogic({
            sort: "name"
        }));

        expect(result.current.searchConfig).toEqual({
            placeholder: "Buscar por nombre...",
            badgeMessage: "Presione Enter para buscar por nombre",
            type: "name",
        });
    });

    it('should return correct searchConfig for number sort', () => {
        const { result } = renderHook(() => useHeaderLogic({
            sort: "number"
        }));

        expect(result.current.searchConfig).toEqual({
            placeholder: "Buscar por número (ej: 001 o #025)...",
            badgeMessage: "Presione Enter para buscar por número",
            type: "number",
        });
    });

    it('should return correct searchConfig for type sort', () => {
        const { result } = renderHook(() => useHeaderLogic({
            sort: "type"
        }));

        expect(result.current.searchConfig).toEqual({
            placeholder: "Buscar por tipo (ej: water, fire, poison)...",
            badgeMessage: "Presione Enter para buscar por tipo",
            type: "type",
        });
    });

    it('should handle empty searchValue on Enter', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: "",
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "name"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(validatePokemonSearch).toHaveBeenCalledWith('', 'name');
    });

    it('should handle validation error without error message', () => {
        const invalidValidationResult: ValidationResult = {
            isValid: false,
            error: undefined
        };

        vi.mocked(validatePokemonSearch).mockReturnValue(invalidValidationResult);

        const { result } = renderHook(() => useHeaderLogic({
            searchValue: mocksearchValue,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "name"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        // Cuando error es undefined pero isValid es false, 
        // el código va al path de éxito porque requiere error truthy
        expect(mockonSearchChange).toHaveBeenCalledWith('pikachu');
        expect(result.current.showValidationPopup).toBe(false);
    });

    it('should handle undefined searchValue on Enter', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: undefined,
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "name"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(validatePokemonSearch).toHaveBeenCalledWith('', 'name');
        expect(mockonSearchChange).toHaveBeenCalledWith('');
    });

    it('should maintain state independence between multiple instances', () => {
        const { result: result1 } = renderHook(() => useHeaderLogic({}));
        const { result: result2 } = renderHook(() => useHeaderLogic({}));

        act(() => {
            result1.current.toggleSortMenu();
        });

        expect(result1.current.isSortMenuOpen).toBe(true);
        expect(result2.current.isSortMenuOpen).toBe(false);
    });

    it('should handle case sensitivity correctly for name search', () => {
        const { result } = renderHook(() => useHeaderLogic({
            searchValue: "PIKACHU",
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: "name"
        }));

        const mockEvent = {
            key: 'Enter'
        } as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyDown(mockEvent);
        });

        expect(mockonSearchChange).toHaveBeenCalledWith('pikachu');
    });

})