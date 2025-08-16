// Template rendering utility for Handlebars-like syntax

import JSZip from 'jszip';

export class TemplateRenderer {
  constructor(template, data) {
    this.template = template;
    this.data = data;
  }

  render() {
    let result = this.template;
    
    // Replace simple variables {{variable.path}}
    result = this.replaceVariables(result, this.data);
    
    // Handle loops {{#array}}...{{/array}} FIRST
    result = this.handleLoops(result, this.data);
    
    // Handle conditionals {{#variable}}...{{/variable}} AFTER loops
    result = this.handleConditionals(result, this.data);
    
    return result;
  }

  replaceVariables(template, data, prefix = '') {
    return template.replace(/\{\{([^#\/][^}]*)\}\}/g, (match, path) => {
      const fullPath = prefix ? `${prefix}.${path}` : path;
      const value = this.getNestedValue(data, path);
      return value !== undefined ? value : match;
    });
  }

  handleConditionals(template, data) {
    // Only handle socialLinks conditionals specifically to avoid conflicts
    const socialConditionalRegex = /\{\{#socialLinks\.(\w+)\}\}([\s\S]*?)\{\{\/socialLinks\.\1\}\}/g;
    
    return template.replace(socialConditionalRegex, (match, platform, content) => {
      const value = data.socialLinks?.[platform];
      
      // If the social link exists and has a value, return the content
      if (value && value.trim() !== '') {
        return content;
      }
      
      // If the social link is empty or undefined, return empty string
      return '';
    });
  }

  handleLoops(template, data) {
    // Handle {{#array}}...{{/array}} loops
    const loopRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    
    return template.replace(loopRegex, (match, arrayName, content) => {
      const array = this.getNestedValue(data, arrayName);
      
      if (!Array.isArray(array)) {
        return '';
      }
      
      return array.map((item, index) => {
        // Handle {{.}} for current item
        let itemContent = content.replace(/\{\{\.\}\}/g, item);
        
        // Handle {{@index}} for array index
        itemContent = itemContent.replace(/\{\{@index\}\}/g, index + 1);
        
        // Handle object properties {{property}}
        if (typeof item === 'object') {
          itemContent = this.replaceVariables(itemContent, item);
        }
        
        return itemContent;
      }).join('');
    });
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      if (current && current[key] !== undefined) {
        return current[key];
      }
      // Handle array indexing syntax like "howItWorks.[0]"
      if (key.startsWith('[') && key.endsWith(']')) {
        const index = parseInt(key.slice(1, -1));
        if (Array.isArray(current) && !isNaN(index) && index >= 0 && index < current.length) {
          return current[index];
        }
      }
      return undefined;
    }, obj);
  }
}

export const renderTemplate = async (templateHtml, templateData) => {
  const renderer = new TemplateRenderer(templateHtml, templateData);
  return renderer.render();
};

export const loadTemplateFile = async () => {
  try {
    const response = await fetch('/template.html');
    return await response.text();
  } catch (error) {
    console.error('Failed to load template file:', error);
    return null;
  }
};

export const loadDefaultTemplateData = async () => {
  try {
    const response = await fetch('/template.json');
    return await response.json();
  } catch (error) {
    console.error('Failed to load template data:', error);
    return null;
  }
};

// Helper function to fetch static assets and convert to base64
const fetchStaticAsset = async (assetPath) => {
  try {
    // Remove leading slash if present
    const cleanPath = assetPath.startsWith('/') ? assetPath.substring(1) : assetPath;
    
    const response = await fetch(`/${cleanPath}`);
    if (!response.ok) {
      console.warn(`Failed to fetch static asset: ${assetPath}`);
      return null;
    }
    
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Error fetching static asset ${assetPath}:`, error);
    return null;
  }
};

// Helper function to collect all static assets from template data
const collectStaticAssets = async (templateData) => {
  const staticAssets = [];
  const processedPaths = new Set();
  
  const collectFromObject = async (obj) => {
    if (typeof obj === 'string') {
      // Check if this is a static asset path
      if (obj.startsWith('/assets/') && !processedPaths.has(obj)) {
        processedPaths.add(obj);
        const base64Data = await fetchStaticAsset(obj);
        if (base64Data) {
          const fileName = obj.split('/').pop();
          staticAssets.push({
            name: fileName,
            path: obj,
            data: base64Data,
            type: 'static'
          });
        }
      }
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        await collectFromObject(item);
      }
    } else if (obj && typeof obj === 'object') {
      for (const value of Object.values(obj)) {
        await collectFromObject(value);
      }
    }
  };
  
  await collectFromObject(templateData);
  return staticAssets;
};

export const generateLandingPage = async (templateData, assets = []) => {
  const templateHtml = await loadTemplateFile();
  if (!templateHtml) {
    throw new Error('Failed to load template file');
  }
  
  // Collect static assets and combine with uploaded assets
  const staticAssets = await collectStaticAssets(templateData);
  const allAssets = [...assets, ...staticAssets];
  
  // Replace asset paths with base64 data for preview
  const processedData = replaceAssetPaths(templateData, allAssets);
  
  return renderTemplate(templateHtml, processedData);
};

// Helper function to replace asset paths with base64 data
const replaceAssetPaths = (data, assets) => {
  if (!assets || assets.length === 0) return data;
  
  // Create a map of asset paths to base64 data
  const assetMap = new Map();
  assets.forEach(asset => {
    assetMap.set(asset.path, asset.data);
  });
  
  // Recursively replace asset paths in the data
  const replaceInObject = (obj) => {
    if (typeof obj === 'string') {
      // Check if this string is an asset path
      if (assetMap.has(obj)) {
        return assetMap.get(obj);
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(replaceInObject);
    }
    
    if (obj && typeof obj === 'object') {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = replaceInObject(value);
      }
      return result;
    }
    
    return obj;
  };
  
  return replaceInObject(data);
};

export const downloadFile = (content, filename, mimeType = 'text/html') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadZip = async (templateData, assets, templateName) => {
  try {
    const zip = new JSZip();
    
    // Collect static assets and combine with uploaded assets
    const staticAssets = await collectStaticAssets(templateData);
    const allAssets = [...assets, ...staticAssets];
    
    console.log('ZIP Export - Assets found:', {
      uploadedAssets: assets.length,
      staticAssets: staticAssets.length,
      totalAssets: allAssets.length,
      staticAssetPaths: staticAssets.map(a => a.path)
    });
    
    // Convert absolute paths to relative paths for local file usage
    const localTemplateData = convertPathsToRelative(templateData);
    
    // Generate HTML with relative asset paths for local usage
    const html = await generateLandingPage(localTemplateData, allAssets);
    
    // Add the HTML file to ZIP
    zip.file(`${templateName}.html`, html);
    
    // Create assets folder and add all assets
    const assetsFolder = zip.folder('assets');
    
    for (const asset of allAssets) {
      // Convert base64 data URL back to binary data
      const base64Data = asset.data.split(',')[1]; // Remove data:mime;base64, prefix
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      // Preserve directory structure in ZIP
      if (asset.path.includes('/')) {
        // Extract the path after /assets/ to maintain subdirectory structure
        const relativePath = asset.path.replace('/assets/', '');
        const pathParts = relativePath.split('/');
        const fileName = pathParts.pop(); // Get the filename
        
        if (pathParts.length > 0) {
          // Create nested folder structure
          let currentFolder = assetsFolder;
          for (const folderName of pathParts) {
            currentFolder = currentFolder.folder(folderName);
          }
          currentFolder.file(fileName, binaryData);
          console.log(`Added to ZIP: assets/${relativePath}`);
        } else {
          // File is directly in assets folder
          assetsFolder.file(fileName, binaryData);
          console.log(`Added to ZIP: assets/${fileName}`);
        }
      } else {
        // File is directly in assets folder
        assetsFolder.file(asset.name, binaryData);
        console.log(`Added to ZIP: assets/${asset.name}`);
      }
    }
    
    // Generate ZIP and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Failed to create ZIP:', error);
    throw error;
  }
};

// Helper function to convert absolute paths to relative paths
const convertPathsToRelative = (data) => {
  const convertInObject = (obj) => {
    if (typeof obj === 'string') {
      // Convert /assets/ to assets/ (remove leading slash)
      if (obj.startsWith('/assets/')) {
        return obj.substring(1); // Remove the leading slash
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(convertInObject);
    }
    
    if (obj && typeof obj === 'object') {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = convertInObject(value);
      }
      return result;
    }
    
    return obj;
  };
  
  return convertInObject(data);
};

export const downloadZipOld = async (files) => {
  // Simple ZIP creation for browser (basic implementation)
  // In a real app, you'd use a library like JSZip
  const zip = new Map();
  
  files.forEach(({ name, content, type = 'text/html' }) => {
    zip.set(name, { content, type });
  });
  
  // For now, download files individually
  // TODO: Implement proper ZIP creation
  files.forEach(({ name, content, type }) => {
    downloadFile(content, name, type);
  });
};

