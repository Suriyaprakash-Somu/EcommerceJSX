import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/utils";

// Import some common icons from react-icons for convenience
import { FiLoader } from "react-icons/fi";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // New variants
        success: "bg-green-600 text-white shadow-xs hover:bg-green-700",
        warning: "bg-amber-500 text-white shadow-xs hover:bg-amber-600",
        info: "bg-blue-500 text-white shadow-xs hover:bg-blue-600",
        subtle: "bg-muted/50 text-muted-foreground hover:bg-muted/80",
        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-md px-8 has-[>svg]:px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      rounded: {
        default: "",
        full: "rounded-full",
        none: "rounded-none",
        pill: "rounded-3xl",
      },
      elevation: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      },
      iconPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
      },
      fullWidth: {
        true: "w-full",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      iconPosition: "left",
      rounded: "default",
      elevation: "none",
      animation: "none",
      disabled: false,
    },
  }
);

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      rounded,
      elevation,
      animation,
      iconPosition,
      fullWidth,
      asChild = false,
      isLoading = false,
      loadingText = "Loading...",
      startIcon,
      endIcon,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      disabled = false,
      disabledTooltip,
      disabledReason,
      ariaLabel,
      ariaDescribedBy,
      ariaLabelledBy,
      ariaExpanded,
      ariaControls,
      ariaHaspopup,
      ariaPressed,
      ariaSelected,
      children,
      activeDescendant,
      longPressTimeMs = 500,
      onLongPress,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;

    // Reference for the tooltip
    const [showTooltip, setShowTooltip] = React.useState(false);
    const tooltipTimeoutRef = React.useRef(null);

    // Long press handler
    const [pressTimer, setPressTimer] = React.useState(null);
    const [isPressing, setIsPressing] = React.useState(false);

    const startPressTimer = React.useCallback(() => {
      if (onLongPress && !isDisabled) {
        setIsPressing(true);
        const timer = setTimeout(() => {
          onLongPress();
          setIsPressing(false);
        }, longPressTimeMs);
        setPressTimer(timer);
      }
    }, [onLongPress, longPressTimeMs, isDisabled]);

    const clearPressTimer = React.useCallback(() => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        setPressTimer(null);
        setIsPressing(false);
      }
    }, [pressTimer]);

    React.useEffect(() => {
      return () => {
        clearPressTimer();
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
      };
    }, [clearPressTimer]);

    // Handle loading state
    const renderContent = () => {
      if (isLoading) {
        return (
          <>
            <FiLoader className="animate-spin" aria-hidden="true" />
            {loadingText && <span>{loadingText}</span>}
            <span className="sr-only">Loading</span>
          </>
        );
      }

      return (
        <>
          {startIcon || (LeadingIcon && <LeadingIcon aria-hidden="true" />)}
          {children}
          {endIcon || (TrailingIcon && <TrailingIcon aria-hidden="true" />)}
        </>
      );
    };

    const handleMouseEnter = (e) => {
      if (isDisabled && disabledTooltip) {
        tooltipTimeoutRef.current = setTimeout(() => {
          setShowTooltip(true);
        }, 500);
      }
      if (props.onMouseEnter) {
        props.onMouseEnter(e);
      }
    };

    const handleMouseLeave = (e) => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = null;
      }
      setShowTooltip(false);
      if (props.onMouseLeave) {
        props.onMouseLeave(e);
      }
    };

    // Added keyboard accessibility
    const handleKeyDown = (e) => {
      // Space or Enter key triggers the button
      if (e.key === " " || e.key === "Enter") {
        if (!isDisabled && props.onClick) {
          props.onClick(e);
        }
      }

      // Start long press on Space hold
      if (e.key === " " && onLongPress) {
        startPressTimer();
      }

      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === " " || e.key === "Enter") {
        clearPressTimer();
      }

      if (props.onKeyUp) {
        props.onKeyUp(e);
      }
    };

    return (
      <div className="relative inline-block">
        <Comp
          ref={ref}
          data-slot="button"
          data-loading={isLoading || undefined}
          data-disabled={isDisabled || undefined}
          data-variant={variant}
          data-pressing={isPressing || undefined}
          type={Comp === "button" ? props.type || "button" : undefined}
          className={cn(
            buttonVariants({
              variant,
              size,
              rounded,
              elevation,
              animation,
              iconPosition,
              fullWidth,
              disabled: isDisabled,
              className,
            })
          )}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-busy={isLoading}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          aria-haspopup={ariaHaspopup}
          aria-pressed={ariaPressed}
          aria-selected={ariaSelected}
          aria-activedescendant={activeDescendant}
          role={props.role || "button"}
          tabIndex={isDisabled ? -1 : props.tabIndex || 0}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={startPressTimer}
          onMouseUp={clearPressTimer}
          onTouchStart={startPressTimer}
          onTouchEnd={clearPressTimer}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          {...props}
        >
          {renderContent()}
        </Comp>

        {/* Disabled Tooltip */}
        {isDisabled && disabledTooltip && showTooltip && (
          <div
            role="tooltip"
            className="absolute z-50 px-2 py-1 text-xs text-white bg-black rounded shadow-lg -top-8 whitespace-nowrap"
          >
            {disabledTooltip}
          </div>
        )}

        {/* Hidden span for screen readers to explain disabled reason */}
        {isDisabled && disabledReason && (
          <span className="sr-only">{disabledReason}</span>
        )}
      </div>
    );
  }
);

Button.displayName = "Button";

// ButtonGroup with enhanced accessibility
const ButtonGroup = React.forwardRef(
  (
    {
      children,
      variant = "default",
      size = "default",
      orientation = "horizontal",
      attached = false,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const isVertical = orientation === "vertical";
    const groupId = React.useId();

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label || "Button group"}
        id={groupId}
        className={cn(
          "inline-flex",
          isVertical ? "flex-col" : "flex-row",
          attached &&
            !isVertical &&
            "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px",
          attached &&
            isVertical &&
            "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          return React.cloneElement(child, {
            variant: child.props.variant || variant,
            size: child.props.size || size,
            // Set positional data attributes for styling and testing
            "data-group-id": groupId,
            "data-group-item": true,
            "data-group-index": index,
            "data-group-position":
              index === 0
                ? "first"
                : index === React.Children.count(children) - 1
                  ? "last"
                  : "middle",
            className: cn(child.props.className),
          });
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

// IconButton component with improved accessibility
const IconButton = React.forwardRef(
  ({ icon: Icon, children, size = "icon", ariaLabel, ...props }, ref) => {
    // Ensure icon buttons have an accessible name
    const accessibleLabel =
      ariaLabel ||
      (typeof children === "string"
        ? children
        : props["aria-label"] || "Button");

    return (
      <Button ref={ref} size={size} aria-label={accessibleLabel} {...props}>
        {Icon && <Icon aria-hidden="true" />}
        {children}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";

// Toggle Button with accessibility enhancements
const ToggleButton = React.forwardRef(
  (
    {
      pressed,
      defaultPressed = false,
      onPressedChange,
      pressedVariant = "primary",
      unpressedVariant = "outline",
      ariaControls,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const [isPressedState, setIsPressedState] = React.useState(defaultPressed);
    const isControlled = pressed !== undefined;
    const isPressed = isControlled ? pressed : isPressedState;

    const handleClick = (event) => {
      if (!isControlled) {
        setIsPressedState(!isPressedState);
      }

      if (onPressedChange) {
        onPressedChange(!isPressed);
      }

      if (props.onClick) {
        props.onClick(event);
      }
    };

    return (
      <Button
        ref={ref}
        variant={isPressed ? pressedVariant : unpressedVariant}
        aria-pressed={isPressed}
        aria-controls={ariaControls}
        aria-label={ariaLabel}
        role="switch"
        onClick={handleClick}
        {...props}
      />
    );
  }
);

ToggleButton.displayName = "ToggleButton";

// Loading Button with automated state management
const LoadingButton = React.forwardRef(
  (
    {
      onClick,
      loadingText = "Loading...",
      loadingDelay = 400,
      onLoadingComplete,
      children,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const isMounted = React.useRef(true);

    React.useEffect(() => {
      return () => {
        isMounted.current = false;
      };
    }, []);

    const handleClick = async (event) => {
      if (isLoading || !onClick) return;

      try {
        setIsLoading(true);

        // Add a minimum loading time for better UX
        const [result] = await Promise.all([
          onClick(event),
          new Promise((resolve) => setTimeout(resolve, loadingDelay)),
        ]);

        if (isMounted.current) {
          setIsLoading(false);
          if (onLoadingComplete) onLoadingComplete(result);
        }
      } catch (error) {
        if (isMounted.current) {
          setIsLoading(false);
          console.error("Button action failed:", error);
        }
      }
    };

    return (
      <Button
        ref={ref}
        isLoading={isLoading}
        loadingText={loadingText}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export {
  Button,
  ButtonGroup,
  IconButton,
  ToggleButton,
  LoadingButton,
  buttonVariants,
};
