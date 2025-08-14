import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function FooterSection({ data }) {
  const { actions } = useTemplate();

  const handleChange = (field, value) => {
    actions.updateTemplateData({
      footer: {
        ...data,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Footer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="footer-copyright">Copyright Text</Label>
          <Input
            id="footer-copyright"
            value={data.copyright}
            onChange={(e) => handleChange('copyright', e.target.value)}
            placeholder="© 2025 Your Company. All rights reserved."
          />
        </div>
      </CardContent>
    </Card>
  );
}

