# FredCMS Custom Sanity Studio Dashboard

This project features a custom-built dashboard for Sanity Studio that provides a modern, intuitive interface for content management while maintaining all the power and flexibility of Sanity's document editing capabilities.

## Features

### 1. Custom Dashboard with Widget-based Layout

The dashboard is built with a widget-based approach, displaying different content sections in an organized grid layout:

- **Analytics Widget**: Displays site traffic and engagement metrics
- **Content Widget**: Shows recent content updates and page counts
- **Ecommerce Widget**: Displays product data and order information
- **CRM Widget**: Shows customer information and message data
- **Settings Widget**: Provides quick access to site configuration

### 2. Dark Mode Support

The dashboard includes a theme toggle that allows users to switch between light and dark modes, with preferences stored in localStorage.

### 3. Responsive Design

All components are built with responsive design in mind, working seamlessly on mobile, tablet, and desktop devices.

### 4. Integrated Navigation

The navigation system provides quick access to all content types with a logical grouping structure:

- **Website Content**: Pages, Components, Media
- **Commerce**: Products, Categories, Quote Requests
- **CRM**: Customers, Messages
- **Settings**: Site Settings, Navigation, Footer

### 5. Real-time Data

Widgets display real-time data from your Sanity dataset, showing counts, recent updates, and other relevant information.

## Extending the Dashboard

### Adding a New Widget

To add a new widget to the dashboard:

1. Create a new component in the `components/widgets` directory
2. Use the `WidgetCard` component as a wrapper for consistent styling
3. Add the widget to the grid layout in `Dashboard.tsx`
4. Add a new tab to the `navItems` array in `Navbar.tsx`

Example:

```tsx
// components/widgets/MyNewWidget.tsx
import React from 'react';
import WidgetCard from './WidgetCard';

interface MyNewWidgetProps {
  client?: any;
  isWidget?: boolean;
}

const MyNewWidget: React.FC<MyNewWidgetProps> = ({ client, isWidget = false }) => {
  // Widget implementation
  return <WidgetCard title="My New Widget">{/* Widget content */}</WidgetCard>;
};

export default MyNewWidget;
```

### Modifying the Desk Structure

The desk structure is defined in `deskStructure.ts`. You can modify this file to change the navigation structure, add new sections, or customize the document listings.

#### Dynamic Component Loading in Desk Structure

This dashboard uses dynamic component loading to avoid circular dependencies when using components in the desk structure. This is particularly useful for the Analytics view which is both a standalone view and a widget in the dashboard.

Example:

```tsx
// In deskStructure.ts
S.component()
  .title('ComponentName')
  .id('component-id')
  .component(() => {
    const ComponentLoader = () => {
      const [Component, setComponent] = React.useState(null);

      React.useEffect(() => {
        // Dynamic import
        import('./components/path/to/Component').then((module) => {
          setComponent(() => module.default);
        });
      }, []);

      if (!Component) {
        return React.createElement('div', {}, 'Loading...');
      }

      return React.createElement(Component, { yourProps: true });
    };

    return React.createElement(ComponentLoader);
  });
```

This pattern ensures components are loaded only when needed and prevents circular dependency issues.

### Customizing Styles

Styles are implemented using Tailwind CSS. You can modify the styles by editing:

- `styles/tailwind.css` for global styles
- Component-specific styles within each component file

## Development

### Running the Studio

Standard method:

```bash
cd apps/studio
npm run dev
```

Using the management script:

```bash
cd apps/studio
./studio-manager.sh       # Start on default port 3334
./studio-manager.sh -p 3333  # Start on specific port
./studio-manager.sh -r    # Restart the server
```

The Studio will run on port 3334 by default (http://localhost:3334). You can modify the port in the `package.json` file or use the management script with the -p flag.

### Building for Production

```bash
cd apps/studio
npm run build
```

## Technical Details

- Built with React and TypeScript
- Styled with Tailwind CSS
- Uses Sanity Studio v3 APIs
- Component-based architecture for easy maintenance and extension

## Browser Compatibility and Recommendations

This custom Sanity Studio dashboard is optimized for modern browsers that support:

- CSS Grid and Flexbox
- ES6+ JavaScript features
- CSS custom properties (variables)

For the best experience, we recommend using:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

The dashboard also includes dark mode support which follows your system preferences by default but can be toggled manually using the theme toggle button in the bottom-right corner.

## License

This project is licensed under the MIT License.
