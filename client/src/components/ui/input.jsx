import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/utils";
import { FiEye, FiEyeOff, FiX, FiAlertCircle } from "react-icons/fi";

// Define input variants using cva for consistent styling
const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-all outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-sm",
  {
    variants: {
      variant: {
        default: "dark:bg-input/30",
        filled: "bg-muted/50 dark:bg-input/50 border-transparent",
        flushed: "border-x-0 border-t-0 rounded-none px-0",
        unstyled: "border-0 shadow-none p-0 bg-transparent",
        outlined: "bg-transparent",
      },
      size: {
        default: "h-9",
        sm: "h-8 text-xs px-2 py-0.5",
        lg: "h-10 text-base px-4 py-2",
        xl: "h-12 text-lg px-5 py-2.5",
        "2xl": "h-14 text-xl px-6 py-3",
      },
      rounded: {
        default: "rounded-md",
        none: "rounded-none",
        sm: "rounded",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      width: {
        default: "w-full",
        auto: "w-auto",
        xs: "w-20",
        sm: "w-32",
        md: "w-48",
        lg: "w-64",
        xl: "w-80",
        "2xl": "w-96",
      },
      state: {
        default:
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        error:
          "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        success:
          "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20 dark:focus-visible:ring-green-500/40",
        warning:
          "border-amber-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-500/40",
      },
      animation: {
        none: "",
        fadeIn: "animate-fadeIn",
        slideIn: "animate-slideIn",
      },
      disabled: {
        true: "pointer-events-none cursor-not-allowed opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      width: "default",
      state: "default",
      animation: "none",
      disabled: false,
    },
  }
);

// Main Input Component with extensive features
const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      variant,
      size,
      rounded,
      width,
      state,
      animation,
      label,
      error,
      hint,
      leftElement,
      rightElement,
      leftAddon,
      rightAddon,
      isRequired = false,
      isReadOnly = false,
      isInvalid = false,
      isDisabled = false,
      isSuccess = false,
      isWarning = false,
      clearable = false,
      onClear,
      showPasswordToggle = false,
      containerClassName,
      labelClassName,
      errorClassName,
      hintClassName,
      onValueChange,
      id: propId,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      inputMode,
      autoComplete,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const uniqueId = React.useId();
    const id = propId || `input-${uniqueId}`;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    // State for password visibility toggle
    const [showPassword, setShowPassword] = React.useState(false);

    // Determine input type based on password toggle state
    const inputType = type === "password" && showPassword ? "text" : type;

    // Handle internal input state
    const inputRef = React.useRef(null);
    React.useImperativeHandle(ref, () => inputRef.current);

    // Determine the current state
    const inputState =
      isInvalid || error
        ? "error"
        : isSuccess
          ? "success"
          : isWarning
            ? "warning"
            : "default";

    // Handle value clearing
    const handleClear = (e) => {
      if (inputRef.current) {
        inputRef.current.value = "";

        // Create and dispatch input event for controlled components
        const inputEvent = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(inputEvent);

        // Create and dispatch change event
        const changeEvent = new Event("change", { bubbles: true });
        inputRef.current.dispatchEvent(changeEvent);

        // Focus input after clearing
        inputRef.current.focus();

        if (onClear) {
          onClear(e);
        }
      }
    };

    // Handle value change for easier state management
    const handleChange = (e) => {
      if (onValueChange) {
        onValueChange(e.target.value, e);
      }

      if (props.onChange) {
        props.onChange(e);
      }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // Determine the describedby ID for accessibility
    const describedById =
      [ariaDescribedBy, hint ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    // Render the full input component with all features
    return (
      <div className={cn("relative flex flex-col gap-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              isRequired &&
                "after:text-destructive after:content-['*'] after:ml-0.5",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {/* Left Addon (outside input) */}
          {leftAddon && (
            <div className="inline-flex h-full items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
              {leftAddon}
            </div>
          )}

          {/* Input Container */}
          <div
            className={cn(
              "relative flex items-center w-full",
              leftAddon && "rounded-l-none",
              rightAddon && "rounded-r-none"
            )}
          >
            {/* Left Element (inside input) */}
            {leftElement && (
              <div className="absolute left-2.5 flex h-full items-center pointer-events-none text-muted-foreground">
                {leftElement}
              </div>
            )}

            {/* Input Element */}
            <input
              id={id}
              ref={inputRef}
              type={inputType}
              data-slot="input"
              disabled={isDisabled}
              readOnly={isReadOnly}
              required={isRequired}
              aria-invalid={isInvalid || !!error}
              aria-describedby={describedById}
              aria-labelledby={ariaLabelledBy}
              aria-required={isRequired}
              inputMode={inputMode}
              autoComplete={autoComplete}
              data-state={inputState}
              onChange={handleChange}
              className={cn(
                inputVariants({
                  variant,
                  size,
                  rounded,
                  width,
                  state: inputState,
                  animation,
                  disabled: isDisabled,
                }),
                leftElement && "pl-9",
                (rightElement ||
                  (clearable && props.value) ||
                  (type === "password" && showPasswordToggle)) &&
                  "pr-9",
                className
              )}
              {...props}
            />

            {/* Input Validation Icon */}
            {inputState === "error" && !rightElement && (
              <div className="absolute right-2.5 text-destructive">
                <FiAlertCircle aria-hidden="true" />
              </div>
            )}

            {/* Password Toggle Button */}
            {type === "password" && showPasswordToggle && (
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={togglePasswordVisibility}
                className="absolute right-2.5 p-1 text-muted-foreground hover:text-foreground"
                tabIndex={-1} // Remove from tab order to improve UX
              >
                {showPassword ? (
                  <FiEyeOff aria-hidden="true" />
                ) : (
                  <FiEye aria-hidden="true" />
                )}
              </button>
            )}

            {/* Clear Button */}
            {clearable &&
              props.value &&
              !(type === "password" && showPasswordToggle) && (
                <button
                  type="button"
                  aria-label="Clear input"
                  onClick={handleClear}
                  className="absolute right-2.5 p-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1} // Remove from tab order
                >
                  <FiX aria-hidden="true" />
                </button>
              )}

            {/* Right Element (inside input) */}
            {rightElement &&
              !(type === "password" && showPasswordToggle) &&
              !clearable && (
                <div className="absolute right-2.5 flex h-full items-center pointer-events-none text-muted-foreground">
                  {rightElement}
                </div>
              )}
          </div>

          {/* Right Addon (outside input) */}
          {rightAddon && (
            <div className="inline-flex h-full items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-muted-foreground">
              {rightAddon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className={cn(
              "text-xs font-medium text-destructive",
              errorClassName
            )}
          >
            {error}
          </p>
        )}

        {/* Hint Text */}
        {hint && !error && (
          <p
            id={hintId}
            className={cn("text-xs text-muted-foreground", hintClassName)}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// NumberInput component with increment/decrement controls
const NumberInput = React.forwardRef(
  (
    {
      min,
      max,
      step = 1,
      precision = 0,
      onValueChange,
      defaultValue,
      value: controlledValue,
      allowMouseWheel = false,
      ...props
    },
    ref
  ) => {
    // State for controlled/uncontrolled component
    const [internalValue, setInternalValue] = React.useState(
      defaultValue !== undefined ? defaultValue : ""
    );

    // Determine if component is controlled
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Step handlers
    const increment = () => {
      const currentValue = parseFloat(value) || 0;
      const newValue = Math.min(
        max !== undefined ? max : Infinity,
        currentValue + step
      );
      const formattedValue =
        precision !== undefined
          ? newValue.toFixed(precision)
          : newValue.toString();

      if (!isControlled) {
        setInternalValue(formattedValue);
      }

      if (onValueChange) {
        onValueChange(formattedValue);
      }
    };

    const decrement = () => {
      const currentValue = parseFloat(value) || 0;
      const newValue = Math.max(
        min !== undefined ? min : -Infinity,
        currentValue - step
      );
      const formattedValue =
        precision !== undefined
          ? newValue.toFixed(precision)
          : newValue.toString();

      if (!isControlled) {
        setInternalValue(formattedValue);
      }

      if (onValueChange) {
        onValueChange(formattedValue);
      }
    };

    // Handle mouse wheel events
    const handleWheel = React.useCallback(
      (e) => {
        if (!allowMouseWheel) return;

        if (e.deltaY < 0) {
          increment();
        } else {
          decrement();
        }

        // Prevent scrolling the page
        e.preventDefault();
      },
      [allowMouseWheel, increment, decrement]
    );

    // Handle internal change
    const handleChange = (e) => {
      const newValue = e.target.value;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (onValueChange) {
        onValueChange(newValue);
      }

      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <Input
        ref={ref}
        type="number"
        value={value}
        onChange={handleChange}
        onWheel={handleWheel}
        min={min}
        max={max}
        step={step}
        rightAddon={
          <div className="flex flex-col">
            <button
              type="button"
              aria-label="Increment value"
              className="flex h-4 w-6 items-center justify-center text-xs hover:bg-accent"
              onClick={increment}
              tabIndex={-1} // Remove from tab order for better keyboard UX
            >
              ▲
            </button>
            <button
              type="button"
              aria-label="Decrement value"
              className="flex h-4 w-6 items-center justify-center text-xs hover:bg-accent"
              onClick={decrement}
              tabIndex={-1} // Remove from tab order for better keyboard UX
            >
              ▼
            </button>
          </div>
        }
        {...props}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

// TextArea component with auto-resize capability
const TextArea = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      rounded,
      width,
      state,
      animation,
      label,
      error,
      hint,
      isRequired = false,
      isReadOnly = false,
      isInvalid = false,
      isDisabled = false,
      isSuccess = false,
      isWarning = false,
      autoResize = false,
      maxRows,
      minRows = 3,
      containerClassName,
      labelClassName,
      errorClassName,
      hintClassName,
      onValueChange,
      id: propId,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const uniqueId = React.useId();
    const id = propId || `textarea-${uniqueId}`;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    // Handle auto-resize
    const textareaRef = React.useRef(null);
    React.useImperativeHandle(ref, () => textareaRef.current);

    // Auto-resize function
    const autoResizeTextarea = () => {
      if (!autoResize || !textareaRef.current) return;

      // Reset height to get correct scrollHeight
      textareaRef.current.style.height = "auto";

      // Calculate new height
      let newHeight = textareaRef.current.scrollHeight;

      // Apply minRows constraint
      const lineHeight =
        parseInt(getComputedStyle(textareaRef.current).lineHeight) || 20;
      const minHeight = minRows * lineHeight;

      if (minHeight > newHeight) {
        newHeight = minHeight;
      }

      // Apply maxRows constraint
      if (maxRows) {
        const maxHeight = maxRows * lineHeight;
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          textareaRef.current.style.overflowY = "auto";
        } else {
          textareaRef.current.style.overflowY = "hidden";
        }
      }

      textareaRef.current.style.height = `${newHeight}px`;
    };

    // Handle text change for resize and callbacks
    const handleChange = (e) => {
      if (autoResize) {
        autoResizeTextarea();
      }

      if (onValueChange) {
        onValueChange(e.target.value, e);
      }

      if (props.onChange) {
        props.onChange(e);
      }
    };

    // Initialize auto-resize
    React.useEffect(() => {
      if (autoResize) {
        autoResizeTextarea();
      }
    }, [autoResize, props.value, props.defaultValue]);

    // Determine the current state
    const inputState =
      isInvalid || error
        ? "error"
        : isSuccess
          ? "success"
          : isWarning
            ? "warning"
            : "default";

    // Determine the describedby ID for accessibility
    const describedById =
      [ariaDescribedBy, hint ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={cn("relative flex flex-col gap-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              isRequired &&
                "after:text-destructive after:content-['*'] after:ml-0.5",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea Element */}
        <textarea
          id={id}
          ref={textareaRef}
          data-slot="textarea"
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={isRequired}
          aria-invalid={isInvalid || !!error}
          aria-describedby={describedById}
          aria-labelledby={ariaLabelledBy}
          aria-required={isRequired}
          data-state={inputState}
          onChange={handleChange}
          className={cn(
            inputVariants({
              variant,
              rounded,
              width,
              state: inputState,
              animation,
              disabled: isDisabled,
            }),
            "min-h-[80px] resize-y",
            className
          )}
          {...props}
        />

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className={cn(
              "text-xs font-medium text-destructive",
              errorClassName
            )}
          >
            {error}
          </p>
        )}

        {/* Hint Text */}
        {hint && !error && (
          <p
            id={hintId}
            className={cn("text-xs text-muted-foreground", hintClassName)}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

// SearchInput component with search icon and clear button
const SearchInput = React.forwardRef(
  ({ onSearch, onValueChange, onClear, searchDelay = 300, ...props }, ref) => {
    const [searchTimer, setSearchTimer] = React.useState(null);

    // Debounced search handler
    const handleChange = (e) => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }

      if (onValueChange) {
        onValueChange(e.target.value, e);
      }

      if (props.onChange) {
        props.onChange(e);
      }

      if (onSearch) {
        const timer = setTimeout(() => {
          onSearch(e.target.value, e);
        }, searchDelay);

        setSearchTimer(timer);
      }
    };

    // Clear timer on unmount
    React.useEffect(() => {
      return () => {
        if (searchTimer) {
          clearTimeout(searchTimer);
        }
      };
    }, [searchTimer]);

    return (
      <Input
        ref={ref}
        type="search"
        onChange={handleChange}
        onClear={(e) => {
          if (onClear) onClear(e);
          if (onSearch) onSearch("", e);
        }}
        clearable
        leftElement={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

export { Input, NumberInput, TextArea, SearchInput, inputVariants };
