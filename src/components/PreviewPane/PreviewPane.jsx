import React, { useState, useEffect, useCallback } from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Maximize, 
  RefreshCw,
  Download,
  Eye,
  ChevronDown
} from 'lucide-react';
import { generateLandingPage, downloadFile, downloadZip } from '../../lib/templateRenderer';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function PreviewPane() {
  const { state, actions } = useTemplate();
  const { currentTemplate, assets } = state;
  const [previewHtml, setPreviewHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalAssetCount, setTotalAssetCount] = useState(0);

  // Device size configurations
  const deviceSizes = {
    desktop: { width: '100%', height: '100%', icon: Monitor },
    tablet: { width: '768px', height: '1024px', icon: Tablet },
    mobile: { width: '375px', height: '667px', icon: Smartphone }
  };

  // Count both uploaded and static assets
  useEffect(() => {
    const countStaticAssets = () => {
      if (!currentTemplate?.data) return;
      
      let staticCount = 0;
      const processedPaths = new Set();
      
      const countFromObject = (obj) => {
        if (typeof obj === 'string') {
          if (obj.startsWith('/assets/') && !processedPaths.has(obj)) {
            processedPaths.add(obj);
            staticCount++;
          }
        } else if (Array.isArray(obj)) {
          obj.forEach(countFromObject);
        } else if (obj && typeof obj === 'object') {
          Object.values(obj).forEach(countFromObject);
        }
      };
      
      countFromObject(currentTemplate.data);
      setTotalAssetCount(assets.length + staticCount);
    };
    
    countStaticAssets();
  }, [currentTemplate?.data, assets.length]);

  const generatePreview = useCallback(async () => {
    if (!currentTemplate) return;
    
    setIsLoading(true);
    try {
      const html = await generateLandingPage(currentTemplate.data, assets);
      setPreviewHtml(html);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      toast.error('Failed to generate preview. Please check your template data.');
    } finally {
      setIsLoading(false);
    }
  }, [currentTemplate, assets]);

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const handleExportHtml = async () => {
    try {
      const html = await generateLandingPage(currentTemplate.data, assets);
      downloadFile(html, `${currentTemplate.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`);
      toast.success("HTML file has been downloaded with embedded images.");
    } catch (error) {
      toast.error("Failed to generate landing page. Please check your template data.");
    }
  };

  const handleExportZip = async () => {
    try {
      if (totalAssetCount === 0) {
        toast.error("No assets to export. Use HTML export for pages without assets.");
        return;
      }
      
      await downloadZip(currentTemplate.data, assets, currentTemplate.name.replace(/[^a-z0-9]/gi, '_').toLowerCase());
      toast.success("ZIP package has been downloaded with separate asset files.");
    } catch (error) {
      toast.error("Failed to create ZIP package. Please try again.");
    }
  };

  const DeviceButton = ({ mode, size, icon: Icon }) => (
    <Button
      variant={previewMode === mode ? "default" : "outline"}
      size="sm"
      onClick={() => setPreviewMode(mode)}
      className="flex items-center space-x-2"
    >
      <Icon className="h-4 w-4" />
      <span className="capitalize">{mode}</span>
    </Button>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Preview - {currentTemplate.name}</h2>
              <Badge variant="secondary">{previewMode}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={generatePreview}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)}>
                Exit Fullscreen
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4 bg-muted">
            <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Landing Page Preview"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Preview</h2>
            <p className="text-muted-foreground">
              Live preview of your landing page
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={generatePreview} variant="outline" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportHtml}>
                  <Download className="h-4 w-4 mr-2" />
                  HTML File (Embedded Images)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportZip} disabled={totalAssetCount === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  ZIP Package (Separate Assets)
                  {totalAssetCount === 0 && <span className="ml-2 text-xs text-muted-foreground">(No assets)</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Device Selection */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {Object.entries(deviceSizes).map(([mode, { icon }]) => (
                <DeviceButton key={mode} mode={mode} icon={icon} />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-6 bg-muted/50 overflow-auto">
          <div className="flex justify-center">
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
              style={{
                width: deviceSizes[previewMode].width,
                height: previewMode === 'desktop' ? '80vh' : deviceSizes[previewMode].height,
                maxWidth: '100%'
              }}
            >
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Generating preview...</p>
                  </div>
                </div>
              ) : previewHtml ? (
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Landing Page Preview"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Template: {currentTemplate.name}</span>
              <span>•</span>
              <span>Last updated: {new Date(currentTemplate.modified).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {previewMode === 'desktop' ? 'Responsive' : deviceSizes[previewMode].width}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

