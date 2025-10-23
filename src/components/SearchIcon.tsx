import React from 'react';
import vectorIcons from '@assets/index';
import { SortOption } from './models/input.interface';


interface SearchIconProps {
  sortType: SortOption;
  className?: string;
}

const ICON_CONFIG: Record<SortOption, { src: string; alt: string; testId: string }> = {
  number: {
    src: vectorIcons.tagIcon,
    alt: "Number Sort Icon",
    testId: "tag-icon",
  },
  type: {
    src: vectorIcons.sortIcon || "/placeholder.svg",
    alt: "Type Sort Icon", 
    testId: "type-icon",
  },
  name: {
    src: vectorIcons.textFormatIcon,
    alt: "Name Sort Icon",
    testId: "text-format-icon",
  },
};

export const SearchIcon: React.FC<SearchIconProps> = ({ 
  sortType, 
  className = "icon-button-filter" 
}) => {
  const config = ICON_CONFIG[sortType];
  
  return (
    <img
      src={config.src}
      alt={config.alt}
      className={className}
      data-testid={config.testId}
    />
  );
};

export default SearchIcon;