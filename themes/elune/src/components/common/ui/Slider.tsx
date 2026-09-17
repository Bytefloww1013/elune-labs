import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cn } from '@evershop/evershop/lib/util/cn';
import * as React from 'react';

/**
 * Core's `common/ui/Slider`, markup and classes verbatim, plus one addition:
 * `getAriaLabel`.
 *
 * base-ui names each thumb's generated `input[type=range]` through
 * `SliderThumb`'s own `getAriaLabel(index)` / `aria-label`; it has no equivalent
 * on `Root` (`@base-ui/react` 1.7.0 `slider/root/SliderRoot.d.ts`), and a prop
 * spread onto `Root` lands on its `<div>`, never on the input. Core renders its
 * thumbs internally and forwards every other prop to `Root`, so a range caller
 * had no way to name the two handles. Forwarding `getAriaLabel` to each thumb is
 * where base-ui merges it onto that thumb's input
 * (`slider/thumb/SliderThumb.js`: `ariaLabel = getAriaLabel(index)`).
 */
type SliderProps<Value extends number | readonly number[]> =
  SliderPrimitive.Root.Props<Value> & {
    /** Accessible name for the thumb at `index`, in value order. */
    getAriaLabel?: (index: number) => string;
  };

function Slider<
  Value extends number | readonly number[] = number | readonly number[]
>({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  ...props
}: SliderProps<Value>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      className="data-horizontal:w-full data-vertical:h-full"
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        className={cn(
          'data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col',
          className
        )}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="bg-muted rounded-full data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5 relative overflow-hidden select-none"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            getAriaLabel={getAriaLabel}
            className="border-primary ring-ring/50 size-4 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
