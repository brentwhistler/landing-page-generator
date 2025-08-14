import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function SocialSection({ data }) {
  const { actions } = useTemplate();

  const handleChange = (field, value) => {
    actions.updateTemplateData({
      socialLinks: {
        ...data,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Social Media Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="social-twitter">Twitter URL</Label>
          <Input
            id="social-twitter"
            value={data.twitter}
            onChange={(e) => handleChange('twitter', e.target.value)}
            placeholder="https://twitter.com/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-linkedin">LinkedIn URL</Label>
          <Input
            id="social-linkedin"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-facebook">Facebook URL</Label>
          <Input
            id="social-facebook"
            value={data.facebook}
            onChange={(e) => handleChange('facebook', e.target.value)}
            placeholder="https://facebook.com/yourcompany"
          />
        </div>
      </CardContent>
    </Card>
  );
}

