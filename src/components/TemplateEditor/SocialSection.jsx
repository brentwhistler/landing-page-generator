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
          <Label htmlFor="social-twitter">Twitter/X URL</Label>
          <Input
            id="social-twitter"
            value={data.twitter || ''}
            onChange={(e) => handleChange('twitter', e.target.value)}
            placeholder="https://x.com/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-linkedin">LinkedIn URL</Label>
          <Input
            id="social-linkedin"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-facebook">Facebook URL</Label>
          <Input
            id="social-facebook"
            value={data.facebook || ''}
            onChange={(e) => handleChange('facebook', e.target.value)}
            placeholder="https://facebook.com/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-whatsapp">WhatsApp URL</Label>
          <Input
            id="social-whatsapp"
            value={data.whatsapp || ''}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="https://wa.me/1234567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-pinterest">Pinterest URL</Label>
          <Input
            id="social-pinterest"
            value={data.pinterest || ''}
            onChange={(e) => handleChange('pinterest', e.target.value)}
            placeholder="https://pinterest.com/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-instagram">Instagram URL</Label>
          <Input
            id="social-instagram"
            value={data.instagram || ''}
            onChange={(e) => handleChange('instagram', e.target.value)}
            placeholder="https://instagram.com/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-tiktok">TikTok URL</Label>
          <Input
            id="social-tiktok"
            value={data.tiktok || ''}
            onChange={(e) => handleChange('tiktok', e.target.value)}
            placeholder="https://tiktok.com/@yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-mastodon">Mastodon URL</Label>
          <Input
            id="social-mastodon"
            value={data.mastodon || ''}
            onChange={(e) => handleChange('mastodon', e.target.value)}
            placeholder="https://mastodon.social/@yourcompany"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-bluesky">Bluesky URL</Label>
          <Input
            id="social-bluesky"
            value={data.bluesky || ''}
            onChange={(e) => handleChange('bluesky', e.target.value)}
            placeholder="https://bsky.app/profile/yourcompany.bsky.social"
          />
        </div>
      </CardContent>
    </Card>
  );
}

