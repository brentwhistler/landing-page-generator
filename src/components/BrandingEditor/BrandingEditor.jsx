import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
// import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TAILWIND_COLORS, TAILWIND_SHADES, FONT_FAMILIES, TEXT_SIZES } from '../../types/template';

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

  const ColorSelector = ({ label, value, onChange, description }) => {
    const [color, shade] = value.split('-');
    
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <div className="flex space-x-2">
          <Select value={color} onValueChange={(newColor) => onChange(`${newColor}-${shade}`)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              {TAILWIND_COLORS.map((colorName) => (
                <SelectItem key={colorName} value={colorName}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-4 h-4 rounded bg-${colorName}-500`}
                      style={{ backgroundColor: `var(--${colorName}-500)` }}
                    />
                    <span className="capitalize">{colorName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={shade} onValueChange={(newShade) => onChange(`${color}-${newShade}`)}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Shade" />
            </SelectTrigger>
            <SelectContent>
              {TAILWIND_SHADES.map((shadeName) => (
                <SelectItem key={shadeName} value={shadeName}>
                  {shadeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div 
            className={`w-6 h-6 rounded border bg-${value}`}
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
          Customize colors, fonts, and visual styling for your landing page
        </p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorSelector
                label="Primary Color"
                value={branding.primaryColor}
                onChange={(value) => handleChange('primaryColor', value)}
                description="Main brand color for buttons and accents"
              />
              
              <ColorSelector
                label="Primary Hover Color"
                value={branding.primaryColorHover}
                onChange={(value) => handleChange('primaryColorHover', value)}
                description="Color when hovering over primary elements"
              />
              
              <ColorSelector
                label="Secondary Color"
                value={branding.secondaryColor}
                onChange={(value) => handleChange('secondaryColor', value)}
                description="Secondary accent color"
              />
              
              <ColorSelector
                label="Background Color"
                value={branding.bgColor}
                onChange={(value) => handleChange('bgColor', value)}
                description="Main page background color"
              />
              
              <ColorSelector
                label="Section Background"
                value={branding.sectionBgAlt}
                onChange={(value) => handleChange('sectionBgAlt', value)}
                description="Alternate background for sections"
              />
              
              <ColorSelector
                label="Text Color"
                value={branding.textColor}
                onChange={(value) => handleChange('textColor', value)}
                description="Main text color"
              />
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select value={branding.fontFamily} onValueChange={(value) => handleChange('fontFamily', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span className={font}>{font.replace('font-', '').toUpperCase()}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Heading Size</Label>
                <Select value={branding.headingSize} onValueChange={(value) => handleChange('headingSize', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEXT_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        <span className={size}>{size}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Body Text Size</Label>
                <Select value={branding.bodySize} onValueChange={(value) => handleChange('bodySize', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEXT_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        <span className={size}>{size}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Style Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-6 rounded-lg bg-${branding.bgColor} text-${branding.textColor} ${branding.fontFamily}`}>
                <h1 className={`${branding.headingSize} font-bold mb-4`}>
                  Sample Heading
                </h1>
                <p className={`${branding.bodySize} mb-4`}>
                  This is how your body text will look with the current styling settings.
                </p>
                <button className={`bg-${branding.primaryColor} hover:bg-${branding.primaryColorHover} text-white px-4 py-2 rounded transition-colors`}>
                  Sample Button
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

