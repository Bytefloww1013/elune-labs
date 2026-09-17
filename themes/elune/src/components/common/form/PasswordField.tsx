import { Tooltip } from '@components/common/form/Tooltip.js';
import { getNestedError } from '@components/common/form/utils/getNestedError.js';
import { useScopedFieldName } from '@components/common/page-builder/WidgetSettingsScope.js';
import { Field, FieldError, FieldLabel } from '@components/common/ui/Field.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@components/common/ui/InputGroup.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { Eye, EyeClosed } from 'lucide-react';
import React from 'react';
import {
  useFormContext,
  RegisterOptions,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Controller
} from 'react-hook-form';

/**
 * WHY THIS FILE EXISTS
 *
 * A theme override of core's `components/common/form/PasswordField.tsx`, and it
 * overrides exactly one thing: the reveal control had no accessible name. Core
 * renders a bare 20x20 `<button>` holding an `aria-hidden` icon, so the sign-in
 * and register forms announced an unnamed button, and no stylesheet can fix that
 * — a generated `::after` is not part of an accessible name. The label is
 * supplied where the control is authored instead: the button names the action it
 * performs, and names the opposite action once the password is visible.
 *
 * Everything else is core's component, unchanged, including `tabIndex={-1}`:
 * core deliberately keeps the reveal out of the tab order and it stays reachable
 * to assistive technology in browse mode. Presentation is untouched here too —
 * the 44x44 hit box and the flush right edge are geometry, so they live in
 * `pages/all/global.scss` beside the rest of the core-field geometry.
 *
 * This file replaces core's whole component rather than extending it, so it must
 * be re-checked against core on every EverShop upgrade.
 */

interface PasswordFieldProps<T extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: FieldPath<T>;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  minLength?: number;
  showToggle?: boolean;
  validation?: RegisterOptions<T>;
  wrapperClassName?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export function PasswordField<T extends FieldValues = FieldValues>({
  name,
  label,
  error,
  helperText,
  required,
  minLength = 6,
  showToggle = false,
  validation,
  wrapperClassName,
  className,
  defaultValue,
  prefixIcon,
  suffixIcon,
  ...props
}: PasswordFieldProps<T>) {
  const {
    control,
    formState: { errors }
  } = useFormContext<T>();
  const resolvedName = useScopedFieldName(name) as FieldPath<T>;

  const fieldError = getNestedError(resolvedName, errors, error);
  const fieldId = `field-${resolvedName}`;
  const [showPassword, setShowPassword] = React.useState(false);

  const validationRules = {
    ...validation,
    ...(required &&
      !validation?.required && {
        required: _('${field} is required', { field: label || name })
      }),
    minLength: validation?.minLength || {
      value: minLength,
      message: _('Password must be at least ${minLength} characters long', {
        minLength: minLength.toString()
      })
    }
  };

  return (
    <Field
      data-invalid={fieldError ? 'true' : 'false'}
      className={wrapperClassName}
    >
      {label && (
        <FieldLabel htmlFor={fieldId}>
          <>
            {label}
            {required && <span className="text-destructive">*</span>}
            {helperText && <Tooltip content={helperText} position="top" />}
          </>
        </FieldLabel>
      )}
      <InputGroup>
        <Controller
          name={resolvedName}
          control={control}
          // Core's prop is the DOM's `defaultValue` (string | number | string[])
          // and react-hook-form types the same slot as the field path's value;
          // the two cannot be unified generically, so this one boundary is an
          // unchecked cast.
          defaultValue={
            defaultValue as unknown as FieldPathValue<T, FieldPath<T>>
          }
          rules={validationRules}
          render={({ field }) => (
            <InputGroupInput
              {...field}
              value={field.value ?? ''}
              id={fieldId}
              type={showToggle && showPassword ? 'text' : 'password'}
              aria-invalid={fieldError !== undefined ? 'true' : 'false'}
              aria-describedby={
                fieldError !== undefined ? `${fieldId}-error` : undefined
              }
              {...props}
            />
          )}
        />
        {prefixIcon && (
          <InputGroupAddon align={'inline-start'}>{prefixIcon}</InputGroupAddon>
        )}
        {(suffixIcon || showToggle) && (
          <InputGroupAddon align={'inline-end'}>
            {suffixIcon || (
              <button
                type="button"
                className="transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={
                  showPassword ? _('Hide password') : _('Show password')
                }
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
            )}
          </InputGroupAddon>
        )}
      </InputGroup>
      {fieldError && (
        <FieldError id={`${fieldId}-error`}>{fieldError}</FieldError>
      )}
    </Field>
  );
}
