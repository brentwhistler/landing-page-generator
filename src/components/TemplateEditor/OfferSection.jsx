import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function OfferSection({ data }) {
  const { actions } = useTemplate();

  const handleChange = (field, value) => {
    actions.updateTemplateData({
      offer: {
        ...data,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Offer Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="offer-headline">Headline</Label>
          <Input
            id="offer-headline"
            value={data.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="Special Offer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="offer-description">Description</Label>
          <Textarea
            id="offer-description"
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Limited time offer for early adopters."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="offer-cta-text">CTA Button Text</Label>
            <Input
              id="offer-cta-text"
              value={data.ctaText}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              placeholder="Claim Offer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer-cta-link">CTA Link</Label>
            <Input
              id="offer-cta-link"
              value={data.ctaLink}
              onChange={(e) => handleChange('ctaLink', e.target.value)}
              placeholder="#apply"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

