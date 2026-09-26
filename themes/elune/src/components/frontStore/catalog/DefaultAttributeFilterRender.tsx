import { Button } from '@components/common/ui/Button.js';
import { Checkbox } from '@components/common/ui/Checkbox.js';
import { Input } from '@components/common/ui/Input.js';
import { Label } from '@components/common/ui/Label.js';
import {
  type FilterableAttribute,
  type FilterInput,
  useProductFilter
} from '@components/frontStore/catalog/ProductFilter.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React, { useState } from 'react';

/**
 * Core's `DefaultAttributeFilterRender`, logic verbatim. Only change: the
 * option `id`/`htmlFor` pair carries a `React.useId()` prefix.
 *
 * Core hardcodes `id={`${attributeCode}-${optionId}`}`, but
 * `DefaultProductFilterRender` mounts this widget twice — desktop tree
 * (`hidden md:block`) and the always-mounted mobile `Sheet` — so both copies
 * emitted `id="size-9"` and `id="size-9-label"` (base-ui's
 * `useAriaLabelledBy` derives the label id from the input id), and every
 * `<label for>` resolved to the first match: the invisible desktop input.
 */
export const DefaultAttributeFilterRender: React.FC<{
  availableAttributes: FilterableAttribute[];
  currentFilters: FilterInput[];
}> = ({ availableAttributes, currentFilters }) => {
  const { updateFilter } = useProductFilter();
  const idPrefix = React.useId();
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const [expandedAttributes, setExpandedAttributes] = useState<{
    [key: string]: boolean;
  }>({});

  const handleAttributeChange = (
    attributeCode: string,
    optionId: string,
    checked: boolean
  ) => {
    let newFilters = [...currentFilters];
    const existingFilterIndex = newFilters.findIndex(
      (f) => f.key === attributeCode
    );

    if (checked) {
      if (existingFilterIndex !== -1) {
        const existingFilter = newFilters[existingFilterIndex];
        const values = existingFilter.value.split(',');
        if (!values.includes(optionId)) {
          values.push(optionId);
          newFilters[existingFilterIndex] = {
            ...existingFilter,
            value: values.join(',')
          };
        }
      } else {
        newFilters.push({
          key: attributeCode,
          operation: 'in',
          value: optionId
        });
      }
    } else if (existingFilterIndex !== -1) {
      const existingFilter = newFilters[existingFilterIndex];
      const values = existingFilter.value
        .split(',')
        .filter((v) => v !== optionId);
      if (values.length === 0) {
        newFilters = newFilters.filter((f) => f.key !== attributeCode);
      } else {
        newFilters[existingFilterIndex] = {
          ...existingFilter,
          value: values.join(',')
        };
      }
    }

    updateFilter(newFilters);
  };

  const isOptionSelected = (attributeCode: string, optionId: string) => {
    const filter = currentFilters.find((f) => f.key === attributeCode);
    return filter
      ? filter.value.split(',').includes(optionId.toString())
      : false;
  };

  const getSelectedCount = (attributeCode: string) => {
    const filter = currentFilters.find((f) => f.key === attributeCode);
    return filter ? filter.value.split(',').length : 0;
  };

  const getFilteredOptions = (attribute: FilterableAttribute) => {
    const searchTerm = searchTerms[attribute.attributeCode] || '';
    if (!searchTerm) return attribute.options;

    return attribute.options.filter((option) =>
      option.optionText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const clearAttributeFilter = (attributeCode: string) => {
    const newFilters = currentFilters.filter((f) => f.key !== attributeCode);
    updateFilter(newFilters);
  };

  return (
    <>
      {availableAttributes.map((attribute) => {
        const selectedCount = getSelectedCount(attribute.attributeCode);
        const filteredOptions = getFilteredOptions(attribute);
        const isExpanded = !!expandedAttributes[attribute.attributeCode];

        return (
          <div
            key={attribute.attributeCode}
            className="attribute__filter__section border-b border-border pb-8 mb-8 last:mb-0 last:border-b-0 last:pb-0"
          >
            <div className="filter__header flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">
                {attribute.attributeName}
              </h3>

              {selectedCount > 0 && (
                <Button
                  variant={'link'}
                  onClick={() => clearAttributeFilter(attribute.attributeCode)}
                  className="hover:text-destructive text-sm transition-colors"
                  title={_('Clear all')}
                >
                  ✕
                </Button>
              )}
            </div>

            <div className="filter__content">
              {attribute.options.length > 5 && (
                <div className="mb-3">
                  <Input
                    type="search"
                    placeholder={_('Search options')}
                    value={searchTerms[attribute.attributeCode] || ''}
                    onChange={(e) =>
                      setSearchTerms((prev) => ({
                        ...prev,
                        [attribute.attributeCode]: e.target.value
                      }))
                    }
                  />
                </div>
              )}

              <div
                className={`attribute__options space-y-2.5 ${
                  isExpanded ? '' : 'max-h-48 overflow-y-auto'
                }`}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isSelected = isOptionSelected(
                      attribute.attributeCode,
                      option.optionId.toString()
                    );
                    const optionId = `${idPrefix}-${attribute.attributeCode}-${option.optionId}`;
                    return (
                      <div
                        key={option.optionId}
                        className="flex items-center gap-2.5 cursor-pointer"
                      >
                        <Checkbox
                          checked={isSelected}
                          id={optionId}
                          onCheckedChange={(checked) =>
                            handleAttributeChange(
                              attribute.attributeCode,
                              option.optionId.toString(),
                              checked
                            )
                          }
                        />
                        <Label
                          htmlFor={optionId}
                          className="cursor-pointer font-normal leading-5 text-muted-foreground"
                        >
                          {option.optionText}
                        </Label>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-muted-foreground text-sm text-center py-4">
                    {_('No options found for "${code}"', {
                      code: searchTerms[attribute.attributeCode]
                    })}
                  </div>
                )}
              </div>

              {!searchTerms[attribute.attributeCode] &&
                attribute.options.length > 10 && (
                  <Button
                    type="button"
                    variant={'link'}
                    className="text-primary text-sm mt-2 hover:underline"
                    onClick={() =>
                      setExpandedAttributes((prev) => ({
                        ...prev,
                        [attribute.attributeCode]:
                          !prev[attribute.attributeCode]
                      }))
                    }
                  >
                    {isExpanded
                      ? _('Show less')
                      : _('Show all ${count} options', {
                          count: attribute.options.length.toString()
                        })}
                  </Button>
                )}
            </div>
          </div>
        );
      })}
    </>
  );
};
