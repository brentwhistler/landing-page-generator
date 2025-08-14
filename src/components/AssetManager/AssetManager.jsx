import React, { useState, useRef } from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
// import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  Image, 
  File, 
  Trash2, 
  Copy, 
  Download,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';

export function AssetManager() {
  const { state, actions } = useTemplate();
  const { assets } = state;
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (files) => {
    Array.from(files).forEach(async (file) => {
      try {
        let processedFile = file;
        let fileName = file.name;
        let fileType = file.type;
        let fileData;

        // Check if it's an image that needs optimization (not SVG)
        if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
          const optimizedResult = await optimizeImage(file);
          if (optimizedResult) {
            fileData = optimizedResult.data;
            fileName = fileName.replace(/\.[^/.]+$/, '.webp'); // Change extension to .webp
            fileType = 'image/webp';
          } else {
            // Fallback to original if optimization fails
            fileData = await fileToDataURL(file);
          }
        } else {
          // For SVGs and non-images, use original
          fileData = await fileToDataURL(file);
        }

        const asset = {
          id: crypto.randomUUID(),
          name: fileName,
          type: fileType,
          size: fileData.length, // Approximate size of base64 data
          data: fileData,
          path: `/assets/${fileName}`,
          uploaded: new Date()
        };
        
        actions.addAsset(asset);
        toast.success(`${fileName} has been uploaded and optimized.`);
      } catch (error) {
        console.error('Failed to process file:', error);
        toast.error(`Failed to upload ${file.name}. Please try again.`);
      }
    });
  };

  // Helper function to convert file to data URL
  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Image optimization function
  const optimizeImage = (file) => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        try {
          // Calculate new dimensions (max 1000px on longest side)
          const maxSize = 1000;
          let { width, height } = img;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and resize image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP with 85% quality
          const webpData = canvas.toDataURL('image/webp', 0.85);
          
          resolve({
            data: webpData,
            width,
            height
          });
        } catch (error) {
          console.error('Image optimization failed:', error);
          resolve(null); // Fallback to original
        }
      };

      img.onerror = () => {
        console.error('Failed to load image for optimization');
        resolve(null); // Fallback to original
      };

      // Load the image
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => {
        console.error('Failed to read file for optimization');
        resolve(null); // Fallback to original
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
    // Reset input
    e.target.value = '';
  };

  const copyPath = (path) => {
    navigator.clipboard.writeText(path);
    toast.success(`Asset path "${path}" copied to clipboard.`);
  };

  const downloadAsset = (asset) => {
    const link = document.createElement('a');
    link.href = asset.data;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeAsset = (assetId) => {
    actions.removeAsset(assetId);
    toast.success("Asset has been removed from the library.");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold">Asset Manager</h2>
        <p className="text-muted-foreground">
          Upload and manage images and files for your landing page
        </p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Assets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  Drop files here or click to upload
                </h3>
                <p className="text-muted-foreground mb-4">
                  Supports images (PNG, JPG, SVG) and other files
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.svg,.ico"
                />
              </div>
            </CardContent>
          </Card>

          {/* Asset Library */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Asset Library</CardTitle>
                <Badge variant="secondary">
                  {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-4" />
                  <p>No assets uploaded yet.</p>
                  <p className="text-sm">Upload your first asset to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      {/* Preview */}
                      <div className="flex-shrink-0">
                        {asset.type.startsWith('image/') ? (
                          <img
                            src={asset.data}
                            alt={asset.name}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center">
                            {getFileIcon(asset.type)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{asset.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(asset.size)} • {asset.type}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            value={asset.path}
                            readOnly
                            className="text-xs h-6 font-mono"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPath(asset.path)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadAsset(asset)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAsset(asset.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Upload images and files that you want to use in your landing page</p>
              <p>• Copy the asset path and paste it into the appropriate fields in the editor</p>
              <p>• All assets will be organized in the /assets folder when you generate your landing page</p>
              <p>• Supported formats: PNG, JPG, SVG, ICO and other common file types</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

