import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function FAQSection({ data }) {
  const { actions } = useTemplate();

  const handleChange = (index, field, value) => {
    const updatedFAQ = [...data];
    updatedFAQ[index] = {
      ...updatedFAQ[index],
      [field]: value
    };
    
    actions.updateTemplateData({
      faq: updatedFAQ
    });
  };

  const addFAQ = () => {
    const newFAQ = {
      q: 'New question?',
      a: 'Answer to the question.'
    };
    
    actions.updateTemplateData({
      faq: [...data, newFAQ]
    });
  };

  const removeFAQ = (index) => {
    const updatedFAQ = data.filter((_, i) => i !== index);
    actions.updateTemplateData({
      faq: updatedFAQ
    });
  };

  const moveFAQ = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.length) return;

    const updatedFAQ = [...data];
    [updatedFAQ[index], updatedFAQ[newIndex]] = 
    [updatedFAQ[newIndex], updatedFAQ[index]];
    
    actions.updateTemplateData({
      faq: updatedFAQ
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">FAQ Items</CardTitle>
          <Button onClick={addFAQ} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No FAQ items added yet.</p>
            <Button onClick={addFAQ} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First FAQ
            </Button>
          </div>
        ) : (
          data.map((faq, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">FAQ {index + 1}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFAQ(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFAQ(index, 'down')}
                      disabled={index === data.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFAQ(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`faq-question-${index}`}>Question</Label>
                  <Input
                    id={`faq-question-${index}`}
                    value={faq.q}
                    onChange={(e) => handleChange(index, 'q', e.target.value)}
                    placeholder="What is your question?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                  <Textarea
                    id={`faq-answer-${index}`}
                    value={faq.a}
                    onChange={(e) => handleChange(index, 'a', e.target.value)}
                    placeholder="Answer to the question."
                    rows={3}
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

