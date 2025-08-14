# Landing Page Generator

A comprehensive React-based web application for creating and managing landing page templates with live preview and export functionality.

## Features

### 🎨 Template Management
- Create, save, load, and delete templates
- Duplicate existing templates
- Import/export templates as JSON files
- Auto-save to browser localStorage

### ✏️ Content Editor
- **Site Configuration**: Page title, favicon, logo, custom HTML
- **Hero Section**: Headlines, subheadlines, CTA buttons, hero images
- **Features Section**: Add/remove/reorder feature cards with icons
- **How It Works**: Step-by-step process lists
- **Offer Section**: Special offers and promotions
- **FAQ Section**: Question and answer pairs
- **Social Links**: Twitter, LinkedIn, Facebook links
- **Footer**: Copyright and legal information

### 🎨 Branding & Styling
- Color scheme customization with Tailwind CSS colors
- Typography settings (font family, heading sizes, body text)
- Live preview of styling changes
- Primary/secondary color selection with hover states

### 📁 Asset Management
- Drag-and-drop file upload
- Image preview and management
- Automatic path generation for assets
- Copy asset paths for use in templates
- Support for images (PNG, JPG, SVG) and other files

### 👀 Live Preview
- Real-time preview of landing pages
- Responsive design testing (Desktop, Tablet, Mobile)
- Fullscreen preview mode
- Interactive preview with working links

### 📤 Export & Generation
- Generate complete HTML landing pages
- Download ready-to-use files
- Template rendering with Handlebars-like syntax
- Asset path resolution

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS + Shadcn/UI components
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications
- **State Management**: React Context + useReducer
- **Template Engine**: Custom Handlebars-like parser
- **File Handling**: Browser File API
- **Storage**: localStorage for persistence

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation
1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Development
Start the development server:
```bash
pnpm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production
```bash
pnpm run build
```

## Usage Guide

### Creating Your First Template

1. **Start with Site Configuration**
   - Set your page title and branding elements
   - Upload your logo and favicon to the Assets tab
   - Copy the asset paths and paste them in the site configuration

2. **Design Your Hero Section**
   - Write compelling headlines and subheadlines
   - Set up your call-to-action button
   - Add a hero image

3. **Add Features**
   - Click "Add Feature" to create feature cards
   - Upload icons for each feature
   - Write clear titles and descriptions

4. **Configure Additional Sections**
   - Add "How It Works" steps
   - Create an offer section
   - Set up FAQ items
   - Add social media links

5. **Customize Branding**
   - Switch to the Branding tab
   - Choose your color scheme
   - Select typography settings
   - Preview changes in real-time

6. **Preview and Export**
   - Use the Preview tab to see your landing page
   - Test on different device sizes
   - Export the final HTML file

### Template Management

- **Save**: Click the Save button to store your template
- **Load**: Click on any saved template in the sidebar to load it
- **Duplicate**: Use the copy icon to duplicate a template
- **Delete**: Use the trash icon to remove templates
- **Export**: Use the dropdown menu to export template JSON
- **Import**: Use the dropdown menu to import template JSON files

### Asset Management

1. Go to the Assets tab
2. Drag and drop files or click "Choose Files"
3. Copy the generated asset path
4. Paste the path in the appropriate form fields
5. Assets are automatically organized in the `/assets/` folder structure

## Template Structure

Templates use a JSON configuration format with the following structure:

```json
{
  "id": "unique-id",
  "name": "Template Name",
  "data": {
    "site": { "title": "...", "logoUrl": "...", ... },
    "branding": { "primaryColor": "...", "fontFamily": "...", ... },
    "hero": { "headline": "...", "subheadline": "...", ... },
    "features": [{ "title": "...", "description": "...", "icon": "..." }],
    "howItWorks": ["Step 1", "Step 2", ...],
    "offer": { "headline": "...", "description": "...", ... },
    "faq": [{ "q": "Question?", "a": "Answer" }],
    "socialLinks": { "twitter": "...", "linkedin": "...", ... },
    "footer": { "copyright": "..." }
  }
}
```

## Template Rendering

The application uses a custom template rendering engine that supports:

- **Variables**: `{{variable.path}}` - Replaced with data values
- **Loops**: `{{#array}}...{{/array}}` - Iterate over arrays
- **Current Item**: `{{.}}` - Reference current item in loops
- **Object Properties**: `{{property}}` - Access object properties in loops

## File Structure

```
landing-page-generator/
├── src/
│   ├── components/
│   │   ├── ui/                 # Shadcn/UI components
│   │   ├── TemplateEditor/     # Template editing components
│   │   ├── BrandingEditor/     # Branding customization
│   │   ├── AssetManager/       # File upload and management
│   │   ├── PreviewPane/        # Live preview component
│   │   ├── Header.jsx          # Main navigation
│   │   ├── Sidebar.jsx         # Template library
│   │   └── MainContent.jsx     # Content router
│   ├── hooks/
│   │   └── useTemplateContext.jsx  # State management
│   ├── lib/
│   │   └── templateRenderer.js     # Template engine
│   ├── types/
│   │   └── template.js             # Type definitions
│   └── App.jsx                     # Main application
├── public/
│   ├── template.html           # Base HTML template
│   └── template.json           # Default template data
└── package.json
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires modern browser features:
- ES6+ JavaScript
- File API
- localStorage
- CSS Grid and Flexbox

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is available for use and modification. Please maintain attribution to the original creators.

## Support

For issues, questions, or feature requests, please refer to the project documentation or contact the development team.

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies.**

