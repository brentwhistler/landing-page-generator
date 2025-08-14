import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function HowItWorksSection({ data }) {
  const { actions } = useTemplate();

  const handleChange = (index, value) => {
    const updatedSteps = [...data];
    updatedSteps[index] = value;
    
    actions.updateTemplateData({
      howItWorks: updatedSteps
    });
  };

  const addStep = () => {
    actions.updateTemplateData({
      howItWorks: [...data, 'New step description']
    });
  };

  const removeStep = (index) => {
    const updatedSteps = data.filter((_, i) => i !== index);
    actions.updateTemplateData({
      howItWorks: updatedSteps
    });
  };

  const moveStep = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.length) return;

    const updatedSteps = [...data];
    [updatedSteps[index], updatedSteps[newIndex]] = 
    [updatedSteps[newIndex], updatedSteps[index]];
    
    actions.updateTemplateData({
      howItWorks: updatedSteps
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">How It Works Steps</CardTitle>
          <Button onClick={addStep} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No steps added yet.</p>
            <Button onClick={addStep} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Step
            </Button>
          </div>
        ) : (
          data.map((step, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium w-8">{index + 1}.</span>
              </div>
              
              <Input
                value={step}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Step description"
                className="flex-1"
              />
              
              <div className="flex space-x-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveStep(index, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveStep(index, 'down')}
                  disabled={index === data.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

