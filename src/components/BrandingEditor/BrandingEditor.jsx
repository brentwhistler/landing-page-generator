import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export function BrandingEditor() {
  const { state, actions } = useTemplate();
  const { currentTemplate } = state;
  const { branding } = currentTemplate.data;

  const handleChange = (field, value) => {
    actions.updateTemplateData({
      branding: {
        ...branding,
        [field]: value
      }
    });
  };

  const ColorPicker = ({ label, value, onChange, description }) => {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <div className="flex items-center space-x-3">
          <Input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 h-10 p-1 border rounded cursor-pointer"
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 font-mono text-sm"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono">{value}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold">Branding & Styling</h2>
        <p className="text-muted-foreground">
          Customize colors for your landing page using hex color codes
        </p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ColorPicker
                label="Primary Color"
                value={branding.primaryColor}
                onChange={(value) => handleChange('primaryColor', value)}
                description="Main brand color for buttons and accents"
              />
              
              <ColorPicker
                label="Primary Hover Color"
                value={branding.primaryColorHover}
                onChange={(value) => handleChange('primaryColorHover', value)}
                description="Color when hovering over primary elements"
              />
              
              <ColorPicker
                label="Secondary Color"
                value={branding.secondaryColor}
                onChange={(value) => handleChange('secondaryColor', value)}
                description="Secondary accent color"
              />
              
              <ColorPicker
                label="Background Color"
                value={branding.bgColor}
                onChange={(value) => handleChange('bgColor', value)}
                description="Main page background color"
              />
              
              <ColorPicker
                label="Section Background"
                value={branding.sectionBgAlt}
                onChange={(value) => handleChange('sectionBgAlt', value)}
                description="Alternate background for sections"
              />
              
              <ColorPicker
                label="Text Color"
                value={branding.textColor}
                onChange={(value) => handleChange('textColor', value)}
                description="Main text color"
              />
              
              <ColorPicker
                label="Footer Background Color"
                value={branding.footerBgColor}
                onChange={(value) => handleChange('footerBgColor', value)}
                description="Footer background color (defaults to secondary color)"
              />
              
              <ColorPicker
                label="Footer Text Color"
                value={branding.footerTextColor}
                onChange={(value) => handleChange('footerTextColor', value)}
                description="Footer text and link colors"
              />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Style Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="p-6 rounded-lg"
                style={{ 
                  backgroundColor: branding.bgColor, 
                  color: branding.textColor 
                }}
              >
                <h1 className="text-4xl font-bold mb-4">
                  Sample Heading
                </h1>
                <p className="text-lg mb-4">
                  This is how your body text will look with the current styling settings.
                </p>
                <button 
                  className="px-4 py-2 rounded transition-colors text-white"
                  style={{ 
                    backgroundColor: branding.primaryColor,
                    ':hover': { backgroundColor: branding.primaryColorHover }
                  }}
                >
                  Sample Button
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Primary</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: branding.primaryColor }}
                    />
                    <span className="text-sm font-mono">{branding.primaryColor}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Secondary</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: branding.secondaryColor }}
                    />
                    <span className="text-sm font-mono">{branding.secondaryColor}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Background</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: branding.bgColor }}
                    />
                    <span className="text-sm font-mono">{branding.bgColor}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: branding.textColor }}
                    />
                    <span className="text-sm font-mono">{branding.textColor}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Footer Background</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: branding.footerBgColor }}
                    />
                    <span className="text-sm font-mono">{branding.footerBgColor}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Footer Text</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: branding.footerTextColor }}
                    />
                    <span className="text-sm font-mono">{branding.footerTextColor}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

