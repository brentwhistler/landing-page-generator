import React from 'react';
import { useTemplate } from '../hooks/useTemplateContext';
import { TemplateEditor } from './TemplateEditor/TemplateEditor';
import { BrandingEditor } from './BrandingEditor/BrandingEditor';
import { AssetManager } from './AssetManager/AssetManager';
import { PreviewPane } from './PreviewPane/PreviewPane';

export function MainContent() {
  const { state } = useTemplate();
  const { activeTab } = state;

  const renderContent = () => {
    switch (activeTab) {
      case 'editor':
        return <TemplateEditor />;
      case 'branding':
        return <BrandingEditor />;
      case 'assets':
        return <AssetManager />;
      case 'preview':
        return <PreviewPane />;
      default:
        return <TemplateEditor />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {renderContent()}
    </div>
  );
}

