# Deployment Instructions

## Quick Deploy (Static Hosting)

The `index.html` and `assets/` folder in this directory contain the built production version ready for deployment.

### Option 1: Static File Hosting
Upload these files to any static hosting service:
- **Netlify**: Drag and drop this folder to netlify.com/drop
- **Vercel**: Use `vercel --prod` command or drag to vercel.com
- **GitHub Pages**: Push to a repository and enable Pages
- **AWS S3**: Upload to S3 bucket with static website hosting
- **Any Web Server**: Upload files to your web server's public directory

### Option 2: Development Server
If you want to run the development version:

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Start development server:
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   # or
   pnpm run build
   ```

## File Structure

```
landing-page-generator-deploy/
├── index.html              # Main application entry point
├── assets/                 # Built CSS and JS files
│   ├── index-*.css        # Compiled styles
│   └── index-*.js         # Compiled JavaScript
├── favicon.ico            # Application favicon
├── template.html          # Base template for generation
├── template.json          # Default template data
├── src/                   # Source code (for development)
├── package.json           # Dependencies and scripts
├── README.md              # Full documentation
└── DEPLOYMENT.md          # This file
```

## Environment Requirements

- **Static Hosting**: Any web server that can serve HTML/CSS/JS
- **Development**: Node.js 18+ and pnpm/npm
- **Browser Support**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

## Configuration

The application works out of the box with no additional configuration needed. All data is stored in the browser's localStorage.

## Custom Domain

After deployment, you can point your custom domain to the hosting service. The application will work with any domain.

## HTTPS

Most hosting services provide HTTPS automatically. For custom servers, ensure HTTPS is enabled for security.

## Support

Refer to README.md for detailed usage instructions and troubleshooting.

