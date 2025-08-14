import React from 'react';
import './App.css';
import { TemplateProvider } from './hooks/useTemplateContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <TemplateProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <MainContent />
        </div>
        <Toaster />
      </div>
    </TemplateProvider>
  );
}

export default App;

