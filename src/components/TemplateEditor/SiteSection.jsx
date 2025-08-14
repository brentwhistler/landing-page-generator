import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function SiteSection({ data }) {
  const { actions } = useTemplate();

  const handleChange = (field, value) => {
    actions.updateTemplateData({
      site: {
        ...data,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Site Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-title">Page Title</Label>
          <Input
            id="site-title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter page title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-favicon">Favicon Path</Label>
          <Input
            id="site-favicon"
            value={data.favicon}
            onChange={(e) => handleChange('favicon', e.target.value)}
            placeholder="/assets/favicon.ico"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-logo">Logo URL</Label>
          <Input
            id="site-logo"
            value={data.logoUrl}
            onChange={(e) => handleChange('logoUrl', e.target.value)}
            placeholder="/assets/logo.svg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-header">Header Elements (HTML)</Label>
          <Textarea
            id="site-header"
            value={data.headerElements}
            onChange={(e) => handleChange('headerElements', e.target.value)}
            placeholder="<!-- GA / Pixel Scripts -->"
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Add custom HTML elements like analytics scripts, meta tags, etc.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

