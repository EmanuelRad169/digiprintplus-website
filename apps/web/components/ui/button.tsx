import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:shadow-md active:shadow-inner',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95',
        outline:
          'border-2 border-primary/20 bg-background text-primary hover:bg-primary/5 hover:border-primary/40 active:bg-primary/10',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/95',
        ghost: 'hover:bg-blue-gray-50 hover:text-blue-gray-700 text-blue-gray-600',
        link: 'text-primary underline-offset-4 hover:underline shadow-none',
        // Material variants
        filled: 'bg-primary text-primary-foreground hover:bg-primary-600 active:bg-primary-700',
        gradient: 'bg-gradient-to-tr from-primary-400 to-primary-600 text-white hover:shadow-lg',
        text: 'bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100 shadow-none',
        outlined: 'border-2 border-primary bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
        xl: 'h-14 rounded-xl px-10 text-base font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xl';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'filled' | 'gradient' | 'text' | 'outlined';
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp: any = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
