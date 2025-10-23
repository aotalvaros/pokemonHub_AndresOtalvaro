import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from '../../context/FavoritesContext';
import type { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock console.error
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('FavoritesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  describe('FavoritesProvider', () => {
    it('should render children correctly', () => {
      const TestComponent = () => <div>Test Child</div>;
      
      const { getByText } = render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      expect(getByText('Test Child')).toBeDefined();
    });

    it('should initialize with empty favorites when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      expect(result.current.favorites).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pokemon_favorites');
    });

    it('should load favorites from localStorage on initialization', () => {
      const storedFavorites = [1, 2, 3];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedFavorites));

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      expect(result.current.favorites).toEqual(storedFavorites);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      expect(result.current.favorites).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing favorites from localStorage:', expect.any(SyntaxError));
    });

    it('should handle non-array data in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('{"key": "value"}');

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      expect(result.current.favorites).toEqual([]);
    });

    it('should save favorites to localStorage when favorites change', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      act(() => {
        result.current.addFavorite(1);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('pokemon_favorites', JSON.stringify([1]));
    });
  });

  describe('useFavorites hook', () => {
    it('should throw error when used outside of FavoritesProvider', () => {
      expect(() => {
        renderHook(() => useFavorites());
      }).toThrow('useFavorites must be used within a FavoritesProvider');
    });

    it('should add favorite correctly', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      act(() => {
        result.current.addFavorite(1);
      });

      expect(result.current.favorites).toEqual([1]);
    });

    it('should not add duplicate favorites', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([1]));

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      act(() => {
        result.current.addFavorite(1);
      });

      expect(result.current.favorites).toEqual([1]);
    });

    it('should remove favorite correctly', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      act(() => {
        result.current.removeFavorite(2);
      });

      expect(result.current.favorites).toEqual([1, 3]);
    });

    it('should check if pokemon is favorite correctly', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.isFavorite(4)).toBe(false);
    });

    it('should toggle favorite - add when not favorite', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([1]));

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      act(() => {
        result.current.toggleFavorite(2);
      });

      expect(result.current.favorites).toEqual([1, 2]);
    });

    it('should toggle favorite - remove when is favorite', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([1, 2]));

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites).toEqual([2]);
    });

    it('should handle multiple operations correctly', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useFavorites(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FavoritesProvider>{children}</FavoritesProvider>
        ),
      });

      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
        result.current.addFavorite(3);
      });

      expect(result.current.favorites).toEqual([1, 2, 3]);

      act(() => {
        result.current.removeFavorite(2);
      });

      expect(result.current.favorites).toEqual([1, 3]);

      act(() => {
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites).toEqual([3, 4]);
    });
  });
});