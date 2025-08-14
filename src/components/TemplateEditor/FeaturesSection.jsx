import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function FeaturesSection({ data, sectionData }) {
  const { actions } = useTemplate();

  const handleSectionTitleChange = (value) => {
    actions.updateTemplateData({
      featuresSection: {
        ...sectionData,
        title: value
      }
    });
  };

  const handleChange = (index, field, value) => {
    const updatedFeatures = [...data];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    
    actions.updateTemplateData({
      features: updatedFeatures
    });
  };

  const addFeature = () => {
    const newFeature = {
      title: 'New Feature',
      description: 'Feature description',
      icon: '/assets/icons/feature.svg'
    };
    
    actions.updateTemplateData({
      features: [...data, newFeature]
    });
  };

  const removeFeature = (index) => {
    const updatedFeatures = data.filter((_, i) => i !== index);
    actions.updateTemplateData({
      features: updatedFeatures
    });
  };

  const moveFeature = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.length) return;

    const updatedFeatures = [...data];
    [updatedFeatures[index], updatedFeatures[newIndex]] = 
    [updatedFeatures[newIndex], updatedFeatures[index]];
    
    actions.updateTemplateData({
      features: updatedFeatures
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Features</CardTitle>
          <Button onClick={addFeature} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="section-title">Section Title</Label>
          <Input
            id="section-title"
            value={sectionData?.title || ''}
            onChange={(e) => handleSectionTitleChange(e.target.value)}
            placeholder="Features Section Title"
          />
        </div>
        
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No features added yet.</p>
            <Button onClick={addFeature} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Feature
            </Button>
          </div>
        ) : (
          data.map((feature, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Feature {index + 1}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFeature(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFeature(index, 'down')}
                      disabled={index === data.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`feature-title-${index}`}>Title</Label>
                  <Input
                    id={`feature-title-${index}`}
                    value={feature.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    placeholder="Feature title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`feature-description-${index}`}>Description</Label>
                  <Textarea
                    id={`feature-description-${index}`}
                    value={feature.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    placeholder="Feature description"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`feature-icon-${index}`}>Icon Path</Label>
                  <Input
                    id={`feature-icon-${index}`}
                    value={feature.icon}
                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                    placeholder="/assets/icons/feature.svg"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}

