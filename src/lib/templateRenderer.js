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
    
    // Handle loops {{#array}}...{{/array}}
    result = this.handleLoops(result, this.data);
    
    return result;
  }

  replaceVariables(template, data, prefix = '') {
    return template.replace(/\{\{([^#\/][^}]*)\}\}/g, (match, path) => {
      const fullPath = prefix ? `${prefix}.${path}` : path;
      const value = this.getNestedValue(data, path);
      return value !== undefined ? value : match;
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
      
      return array.map(item => {
        // Handle {{.}} for current item
        let itemContent = content.replace(/\{\{\.\}\}/g, item);
        
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
      return current && current[key] !== undefined ? current[key] : undefined;
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

export const generateLandingPage = async (templateData, assets = []) => {
  const templateHtml = await loadTemplateFile();
  if (!templateHtml) {
    throw new Error('Failed to load template file');
  }
  
  // Replace asset paths with base64 data for preview
  const processedData = replaceAssetPaths(templateData, assets);
  
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
    
    // Convert absolute paths to relative paths for local file usage
    const localTemplateData = convertPathsToRelative(templateData);
    
    // Generate HTML with relative asset paths for local usage
    const html = await generateLandingPage(localTemplateData, assets); // Use relative paths for ZIP export
    
    // Add the HTML file to ZIP
    zip.file(`${templateName}.html`, html);
    
    // Create assets folder and add all assets
    const assetsFolder = zip.folder('assets');
    
    for (const asset of assets) {
      // Convert base64 data URL back to binary data
      const base64Data = asset.data.split(',')[1]; // Remove data:mime;base64, prefix
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      // Add to assets folder with original filename
      assetsFolder.file(asset.name, binaryData);
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

