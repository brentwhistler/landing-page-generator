import React, { useRef } from 'react';
import { useTemplate } from '../hooks/useTemplateContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Save, 
  Download, 
  Upload, 
  Plus, 
  FileText,
  Settings,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { generateLandingPage, downloadFile, downloadZip } from '../lib/templateRenderer';
import { toast } from 'sonner';

export function Header() {
  const { state, actions } = useTemplate();
  const { currentTemplate, assets } = state;
  const fileInputRef = useRef(null);

  const handleSave = () => {
    actions.saveTemplate();
    toast.success(`"${currentTemplate.name}" has been saved successfully.`);
  };

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
      if (assets.length === 0) {
        toast.error("No assets to export. Use HTML export for pages without uploaded assets.");
        return;
      }
      
      await downloadZip(currentTemplate.data, assets, currentTemplate.name.replace(/[^a-z0-9]/gi, '_').toLowerCase());
      toast.success("ZIP package has been downloaded with separate asset files.");
    } catch (error) {
      toast.error("Failed to create ZIP package. Please try again.");
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await actions.importTemplate(file);
        toast.success("Template has been imported successfully.");
      } catch (error) {
        toast.error("Failed to import template. Please check the file format.");
      }
    }
    // Reset file input
    event.target.value = '';
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    actions.updateTemplateData({ 
      ...currentTemplate.data,
      _templateName: newName 
    });
    actions.setCurrentTemplate({
      ...currentTemplate,
      name: newName
    });
  };

  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Landing Page Generator</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Template:</span>
          <Input
            value={currentTemplate.name}
            onChange={handleNameChange}
            className="w-48"
            placeholder="Template name"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={actions.createNewTemplate}
        >
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>

        <Button onClick={handleSave} variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
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
            <DropdownMenuItem onClick={handleExportZip} disabled={assets.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              ZIP Package (Separate Assets)
              {assets.length === 0 && <span className="ml-2 text-xs text-muted-foreground">(No assets)</span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions.exportTemplate(currentTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Export Template JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Template
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => actions.createNewTemplate()}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import Template JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </header>
  );
}

