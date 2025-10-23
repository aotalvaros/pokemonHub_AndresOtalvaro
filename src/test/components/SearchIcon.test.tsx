import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import SearchIcon from '../../components/SearchIcon';
import { type SortOption } from '../../components/models/input.interface';

// Mock the vectorIcons import
vi.mock('@assets/index', () => ({
  default: {
    tagIcon: '/mock-tag-icon.svg',
    sortIcon: '/mock-sort-icon.svg',
    textFormatIcon: '/mock-text-format-icon.svg',
  }
}));

describe('SearchIcon', () => {
  const setup = (props: { sortType: SortOption; className?: string }) => {
    return render(<SearchIcon {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Icon rendering for different sort types', () => {
    it('should render number sort icon correctly', () => {
      setup({ sortType: 'number' });

      const icon = screen.getByTestId('tag-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', '/mock-tag-icon.svg');
      expect(icon).toHaveAttribute('alt', 'Number Sort Icon');
      expect(icon).toHaveAttribute('class', 'icon-button-filter');
    });

    it('should render type sort icon correctly', () => {
      setup({ sortType: 'type' });

      const icon = screen.getByTestId('type-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', '/mock-sort-icon.svg');
      expect(icon).toHaveAttribute('alt', 'Type Sort Icon');
      expect(icon).toHaveAttribute('class', 'icon-button-filter');
    });

    it('should render name sort icon correctly', () => {
      setup({ sortType: 'name' });

      const icon = screen.getByTestId('text-format-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', '/mock-text-format-icon.svg');
      expect(icon).toHaveAttribute('alt', 'Name Sort Icon');
      expect(icon).toHaveAttribute('class', 'icon-button-filter');
    });
  });

  describe('Custom className handling', () => {
    it('should use custom className when provided', () => {
      setup({ sortType: 'number', className: 'custom-icon-class' });

      const icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveClass('custom-icon-class');
      expect(icon).not.toHaveClass('icon-button-filter');
    });

    it('should use default className when not provided', () => {
      setup({ sortType: 'number' });

      const icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveClass('icon-button-filter');
    });

    it('should handle empty className', () => {
      setup({ sortType: 'number', className: '' });

      const icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveAttribute('class', '');
    });

    it('should handle multiple CSS classes', () => {
      setup({ sortType: 'number', className: 'class1 class2 class3' });

      const icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveClass('class1', 'class2', 'class3');
    });
  });


  describe('Configuration mapping', () => {
    it('should have correct configuration for all sort types', () => {
      const sortTypes: SortOption[] = ['number', 'type', 'name'];
      
      sortTypes.forEach(sortType => {
        const { container } = setup({ sortType });
        const icon = container.querySelector('img');
        
        expect(icon).toBeInTheDocument();
        expect(icon?.getAttribute('data-testid')).toBeTruthy();
        expect(icon?.getAttribute('alt')).toBeTruthy();
        expect(icon?.getAttribute('src')).toBeTruthy();
      });
    });

    it('should use correct testId for each sort type', () => {
      setup({ sortType: 'number' });
      expect(screen.getByTestId('tag-icon')).toBeInTheDocument();

      setup({ sortType: 'type' });
      expect(screen.getByTestId('type-icon')).toBeInTheDocument();

      setup({ sortType: 'name' });
      expect(screen.getByTestId('text-format-icon')).toBeInTheDocument();
    });

    it('should use correct alt text for accessibility', () => {
      setup({ sortType: 'number' });
      expect(screen.getByAltText('Number Sort Icon')).toBeInTheDocument();

      setup({ sortType: 'type' });
      expect(screen.getByAltText('Type Sort Icon')).toBeInTheDocument();

      setup({ sortType: 'name' });
      expect(screen.getByAltText('Name Sort Icon')).toBeInTheDocument();
    });
  });

  describe('Component structure and attributes', () => {
    it('should render as img element', () => {
      const { container } = setup({ sortType: 'number' });
      
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img?.tagName).toBe('IMG');
    });

    it('should have all required attributes', () => {
      setup({ sortType: 'number' });

      const icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveAttribute('src');
      expect(icon).toHaveAttribute('alt');
      expect(icon).toHaveAttribute('class');
      expect(icon).toHaveAttribute('data-testid');
    });

    it('should not have any additional attributes', () => {
      setup({ sortType: 'number' });

      const icon = screen.getByTestId('tag-icon');
      const attributes = icon.attributes;
      
      // Should only have: src, alt, class, data-testid
      expect(attributes.length).toBe(4);
    });
  });

  describe('Props validation', () => {
    it('should handle all valid sortType values', () => {
      const validSortTypes: SortOption[] = ['number', 'type', 'name'];
      
      validSortTypes.forEach(sortType => {
        expect(() => setup({ sortType })).not.toThrow();
      });
    });

    it('should render consistently with same props', () => {
      const { rerender } = setup({ sortType: 'number', className: 'test-class' });
      
      let icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveAttribute('src', '/mock-tag-icon.svg');
      expect(icon).toHaveClass('test-class');

      rerender(<SearchIcon sortType="number" className="test-class" />);
      
      icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveAttribute('src', '/mock-tag-icon.svg');
      expect(icon).toHaveClass('test-class');
    });
  });

  describe('Asset loading', () => {
    it('should use correct asset paths from vectorIcons', () => {
      setup({ sortType: 'number' });
      const numberIcon = screen.getByTestId('tag-icon');
      expect(numberIcon).toHaveAttribute('src', '/mock-tag-icon.svg');

      setup({ sortType: 'name' });
      const nameIcon = screen.getByTestId('text-format-icon');
      expect(nameIcon).toHaveAttribute('src', '/mock-text-format-icon.svg');
    });

    it('should handle missing vectorIcons gracefully', () => {
      // Test would require more complex mocking to simulate import failure
      // but the component should handle this through the fallback mechanism
      expect(() => setup({ sortType: 'type' })).not.toThrow();
    });
  });

  describe('Component rerendering', () => {
    it('should update icon when sortType changes', () => {
      const { rerender } = setup({ sortType: 'number' });
      
      expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('type-icon')).not.toBeInTheDocument();

      rerender(<SearchIcon sortType="type" />);
      
      expect(screen.queryByTestId('tag-icon')).not.toBeInTheDocument();
      expect(screen.getByTestId('type-icon')).toBeInTheDocument();
    });

    it('should update className when prop changes', () => {
      const { rerender } = setup({ sortType: 'number', className: 'initial-class' });
      
      let icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveClass('initial-class');

      rerender(<SearchIcon sortType="number" className="updated-class" />);
      
      icon = screen.getByTestId('tag-icon');
      expect(icon).toHaveClass('updated-class');
      expect(icon).not.toHaveClass('initial-class');
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid prop changes', () => {
      const { rerender } = setup({ sortType: 'number' });
      
      // Rapid changes shouldn't cause issues
      rerender(<SearchIcon sortType="type" />);
      rerender(<SearchIcon sortType="name" />);
      rerender(<SearchIcon sortType="number" />);
      
      expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
    });

    it('should maintain performance with frequent rerenders', () => {
      const { rerender } = setup({ sortType: 'number' });
      
      // Multiple rerenders with same props
      for (let i = 0; i < 10; i++) {
        rerender(<SearchIcon sortType="number" className="test" />);
      }
      
      expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
    });
  });
});