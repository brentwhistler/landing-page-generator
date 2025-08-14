import React from 'react';
import { useTemplate } from '../hooks/useTemplateContext';
import { Button } from './ui/button';
// import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { 
  FileText, 
  Trash2, 
  Copy, 
  Calendar,
  Edit3,
  Palette,
  Image,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

export function Sidebar() {
  const { state, actions } = useTemplate();
  const { savedTemplates, currentTemplate, activeTab } = state;

  const handleDeleteTemplate = (templateId) => {
    actions.deleteTemplate(templateId);
    toast.success("Template has been deleted successfully.");
  };

  const handleDuplicateTemplate = (template) => {
    actions.duplicateTemplate(template);
    toast.success(`"${template.name}" has been duplicated successfully.`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'assets', label: 'Assets', icon: Image },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  return (
    <div className="w-80 border-r bg-card flex flex-col">
      {/* Navigation Tabs */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-2 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => actions.setActiveTab(tab.id)}
                className="justify-start"
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Template Library */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Template Library
          </h3>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {savedTemplates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No saved templates yet.
                  <br />
                  Create your first template!
                </p>
              </div>
            ) : (
              savedTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    currentTemplate.id === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => actions.loadTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium truncate">
                        {template.name}
                      </CardTitle>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateTemplate(template);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Template</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{template.name}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {template.description && (
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(template.modified)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.data.features?.length || 0} features
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

