import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function HeroSection({ data }) {
  const { actions } = useTemplate();

  const handleChange = (field, value) => {
    actions.updateTemplateData({
      hero: {
        ...data,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hero Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-headline">Headline</Label>
          <Input
            id="hero-headline"
            value={data.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="Your Amazing Product"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-subheadline">Subheadline</Label>
          <Textarea
            id="hero-subheadline"
            value={data.subheadline}
            onChange={(e) => handleChange('subheadline', e.target.value)}
            placeholder="Transform your business with our innovative solution."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hero-cta-text">CTA Button Text</Label>
            <Input
              id="hero-cta-text"
              value={data.ctaText}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              placeholder="Get Started"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-cta-link">CTA Link</Label>
            <Input
              id="hero-cta-link"
              value={data.ctaLink}
              onChange={(e) => handleChange('ctaLink', e.target.value)}
              placeholder="#apply"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-note">Note Text</Label>
          <Input
            id="hero-note"
            value={data.note}
            onChange={(e) => handleChange('note', e.target.value)}
            placeholder="No credit card required."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-image">Hero Image Path</Label>
          <Input
            id="hero-image"
            value={data.heroImage}
            onChange={(e) => handleChange('heroImage', e.target.value)}
            placeholder="/assets/hero-image.png"
          />
        </div>
      </CardContent>
    </Card>
  );
}

