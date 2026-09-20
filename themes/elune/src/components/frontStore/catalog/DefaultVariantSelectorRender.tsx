import type {
  VariantAttributeGroupProps,
  VariantOptionItemProps
} from '@components/frontStore/catalog/VariantSelector.js';
import React from 'react';

export const DefaultVariantOptionItem: React.FC<VariantOptionItemProps> = () => null;

export const DefaultVariantAttribute: React.FC<VariantAttributeGroupProps> = ({
  attribute,
  options,
  onSelect
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium" htmlFor={`variant-${attribute.attributeCode}`}>
      {attribute.attributeName}
    </label>
    <select
      id={`variant-${attribute.attributeCode}`}
      className="w-full"
      value={attribute.selectedOption ?? ''}
      onChange={(event) => onSelect(attribute.attributeCode, Number(event.currentTarget.value))}
    >
      <option value="" disabled>
        Select {attribute.attributeName.toLowerCase()}
      </option>
      {options.map((option) => (
        <option key={option.optionId} value={option.optionId} disabled={!option.available}>
          {option.optionText}{option.available ? '' : ' — Unavailable'}
        </option>
      ))}
    </select>
  </div>
);
