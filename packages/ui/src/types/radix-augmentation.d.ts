// Type augmentations for Radix UI components to support className and children props
declare module "@radix-ui/react-context-menu" {
  interface ContextMenuSubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  interface ContextMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface ContextMenuCheckboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    checked?: boolean;
  }
  
  interface ContextMenuRadioItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  interface ContextMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface ContextMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}
}

declare module "@radix-ui/react-menubar" {
  interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface MenubarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}
  
  interface MenubarSubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  interface MenubarSubContentProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface MenubarItemProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface MenubarCheckboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    checked?: boolean;
  }
  
  interface MenubarRadioItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  interface MenubarLabelProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface MenubarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}
}

declare module "@radix-ui/react-navigation-menu" {
  interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  
  interface NavigationMenuListProps extends React.HTMLAttributes<HTMLUListElement> {}
  
  interface NavigationMenuTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
  }
  
  interface NavigationMenuViewportProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface NavigationMenuIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
}

declare module "@radix-ui/react-radio-group" {
  interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  interface RadioGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
  }
  
  interface RadioGroupIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
  }
}

declare module "@radix-ui/react-scroll-area" {
  interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  interface ScrollAreaViewportProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  interface ScrollAreaThumbProps extends React.HTMLAttributes<HTMLDivElement> {}
}

declare module "@radix-ui/react-slider" {
  interface SliderProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
  }
  
  interface SliderTrackProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
  }
  
  interface SliderRangeProps extends React.HTMLAttributes<HTMLSpanElement> {}
  
  interface SliderThumbProps extends React.HTMLAttributes<HTMLSpanElement> {}
}

declare module "@radix-ui/react-switch" {
  interface SwitchProps extends React.HTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
  }
  
  interface SwitchThumbProps extends React.HTMLAttributes<HTMLSpanElement> {}
}

declare module "@radix-ui/react-toggle-group" {
  interface ToggleGroupSingleProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  interface ToggleGroupMultipleProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  interface ToggleGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
  }
}

declare module "@radix-ui/react-toggle" {
  interface ToggleProps extends React.HTMLAttributes<HTMLButtonElement> {}
}
