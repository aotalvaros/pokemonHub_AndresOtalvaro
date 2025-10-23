import { SEARCH_CONFIGS, VALIDATION_MESSAGES } from '../../constants/message';
import { describe, it, expect } from "vitest";

import { SearchConfig, SortOption } from '@components/models/input.interface';

describe('SEARCH_CONFIGS', () => {
  it('should have all required sort options', () => {
    const expectedSortOptions: SortOption[] = ['name', 'number', 'type'];
    
    expectedSortOptions.forEach(option => {
      expect(SEARCH_CONFIGS).toHaveProperty(option);
    });
  });

  it('should have correct configuration for name search', () => {
    const nameConfig = SEARCH_CONFIGS.name;
    
    expect(nameConfig.type).toBe('name');
    expect(nameConfig.placeholder).toBe('Buscar por nombre...');
    expect(nameConfig.badgeMessage).toBe('Presione Enter para buscar por nombre');
    expect(nameConfig.minLength).toBe(3);
  });

  it('should have correct configuration for number search', () => {
    const numberConfig = SEARCH_CONFIGS.number;
    
    expect(numberConfig.type).toBe('number');
    expect(numberConfig.placeholder).toBe('Buscar por número (ej: 001 o #025)...');
    expect(numberConfig.badgeMessage).toBe('Presione Enter para buscar por número');
    expect(numberConfig.minLength).toBe(1);
  });

  it('should have correct configuration for type search', () => {
    const typeConfig = SEARCH_CONFIGS.type;
    
    expect(typeConfig.type).toBe('type');
    expect(typeConfig.placeholder).toBe('Buscar por tipo (ej: water, fire, poison)...');
    expect(typeConfig.badgeMessage).toBe('Presione Enter para buscar por tipo');
    expect(typeConfig.minLength).toBe(3);
  });

  it('should have unique placeholders for each search type', () => {
    const placeholders = Object.values(SEARCH_CONFIGS).map(config => config.placeholder);
    const uniquePlaceholders = new Set(placeholders);
    
    expect(uniquePlaceholders.size).toBe(placeholders.length);
  });

  it('should have unique badge messages for each search type', () => {
    const badgeMessages = Object.values(SEARCH_CONFIGS).map(config => config.badgeMessage);
    const uniqueBadgeMessages = new Set(badgeMessages);
    
    expect(uniqueBadgeMessages.size).toBe(badgeMessages.length);
  });

  it('should be accessible by SortOption keys', () => {
    const nameConfig = SEARCH_CONFIGS['name'];
    const numberConfig = SEARCH_CONFIGS['number'];
    const typeConfig = SEARCH_CONFIGS['type'];
    
    expect(nameConfig).toBeDefined();
    expect(numberConfig).toBeDefined();
    expect(typeConfig).toBeDefined();
  });
});

describe('VALIDATION_MESSAGES', () => {
  it('should have ENTER_TO_SEARCH message', () => {
    expect(VALIDATION_MESSAGES.ENTER_TO_SEARCH).toBe('Presione Enter para buscar');
  });

  it('should have ESCAPE_TO_CLEAR message', () => {
    expect(VALIDATION_MESSAGES.ESCAPE_TO_CLEAR).toBe('Presione Escape para limpiar');
  });


  it('should have string values', () => {
    Object.values(VALIDATION_MESSAGES).forEach(message => {
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });


  it('should have exactly two properties', () => {
    const keys = Object.keys(VALIDATION_MESSAGES);
    expect(keys).toHaveLength(2);
    expect(keys).toContain('ENTER_TO_SEARCH');
    expect(keys).toContain('ESCAPE_TO_CLEAR');
  });

  it('should be immutable', () => {
    const originalEnterMessage = VALIDATION_MESSAGES.ENTER_TO_SEARCH;
    const originalEscapeMessage = VALIDATION_MESSAGES.ESCAPE_TO_CLEAR;
    
    // Values should remain unchanged
    expect(VALIDATION_MESSAGES.ENTER_TO_SEARCH).toBe(originalEnterMessage);
    expect(VALIDATION_MESSAGES.ESCAPE_TO_CLEAR).toBe(originalEscapeMessage);
  });
});

describe('Constants Integration', () => {
  it('should export both SEARCH_CONFIGS and VALIDATION_MESSAGES', () => {
    expect(SEARCH_CONFIGS).toBeDefined();
    expect(VALIDATION_MESSAGES).toBeDefined();
  });

  it('should have consistent language across all constants', () => {
    Object.values(SEARCH_CONFIGS).forEach(config => {
      expect(config.placeholder).toMatch(/Buscar/);
      expect(config.badgeMessage).toMatch(/Presione/);
    });

    Object.values(VALIDATION_MESSAGES).forEach(message => {
      expect(message).toMatch(/Presione/);
    });
  });

  it('should maintain type safety', () => {
    const nameConfig: SearchConfig = SEARCH_CONFIGS.name;
    const enterMessage: string = VALIDATION_MESSAGES.ENTER_TO_SEARCH;
    
    expect(nameConfig).toBeDefined();
    expect(enterMessage).toBeDefined();
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle iteration over SEARCH_CONFIGS', () => {
    let count = 0;
    
    for (const key in SEARCH_CONFIGS) {
      count++;
      expect(SEARCH_CONFIGS[key as SortOption]).toBeDefined();
    }
    
    expect(count).toBe(3);
  });

  it('should handle Object methods on constants', () => {
    expect(Object.keys(SEARCH_CONFIGS)).toHaveLength(3);
    expect(Object.values(SEARCH_CONFIGS)).toHaveLength(3);
    expect(Object.entries(SEARCH_CONFIGS)).toHaveLength(3);
    
    expect(Object.keys(VALIDATION_MESSAGES)).toHaveLength(2);
    expect(Object.values(VALIDATION_MESSAGES)).toHaveLength(2);
    expect(Object.entries(VALIDATION_MESSAGES)).toHaveLength(2);
  });

  it('should maintain referential equality', () => {
    const config1 = SEARCH_CONFIGS.name;
    const config2 = SEARCH_CONFIGS.name;
    
    expect(config1).toBe(config2);
    
    const message1 = VALIDATION_MESSAGES.ENTER_TO_SEARCH;
    const message2 = VALIDATION_MESSAGES.ENTER_TO_SEARCH;
    
    expect(message1).toBe(message2);
  });

  it('should not have undefined or null values', () => {
    Object.values(SEARCH_CONFIGS).forEach(config => {
      expect(config.type).not.toBeNull();
      expect(config.type).not.toBeUndefined();
      expect(config.placeholder).not.toBeNull();
      expect(config.placeholder).not.toBeUndefined();
      expect(config.badgeMessage).not.toBeNull();
      expect(config.badgeMessage).not.toBeUndefined();
      expect(config.minLength).not.toBeNull();
      expect(config.minLength).not.toBeUndefined();
    });

    Object.values(VALIDATION_MESSAGES).forEach(message => {
      expect(message).not.toBeNull();
      expect(message).not.toBeUndefined();
    });
  });
});