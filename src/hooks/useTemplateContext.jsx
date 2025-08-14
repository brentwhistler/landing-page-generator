import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createDefaultTemplate } from '../types/template';

const TemplateContext = createContext();

const STORAGE_KEY = 'landing-page-templates';

// Action types
const ACTIONS = {
  SET_CURRENT_TEMPLATE: 'SET_CURRENT_TEMPLATE',
  UPDATE_TEMPLATE_DATA: 'UPDATE_TEMPLATE_DATA',
  SAVE_TEMPLATE: 'SAVE_TEMPLATE',
  LOAD_TEMPLATES: 'LOAD_TEMPLATES',
  DELETE_TEMPLATE: 'DELETE_TEMPLATE',
  CREATE_NEW_TEMPLATE: 'CREATE_NEW_TEMPLATE',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  ADD_ASSET: 'ADD_ASSET',
  REMOVE_ASSET: 'REMOVE_ASSET'
};

const initialState = {
  currentTemplate: createDefaultTemplate(),
  savedTemplates: [],
  activeTab: 'editor',
  assets: []
};

function templateReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_TEMPLATE:
      return {
        ...state,
        currentTemplate: action.payload
      };

    case ACTIONS.UPDATE_TEMPLATE_DATA:
      const updatedTemplate = {
        ...state.currentTemplate,
        data: { ...state.currentTemplate.data, ...action.payload },
        modified: new Date()
      };
      return {
        ...state,
        currentTemplate: updatedTemplate
      };

    case ACTIONS.SAVE_TEMPLATE:
      const templateToSave = action.payload || state.currentTemplate;
      const existingIndex = state.savedTemplates.findIndex(t => t.id === templateToSave.id);
      
      let updatedTemplates;
      if (existingIndex >= 0) {
        updatedTemplates = [...state.savedTemplates];
        updatedTemplates[existingIndex] = templateToSave;
      } else {
        updatedTemplates = [...state.savedTemplates, templateToSave];
      }
      
      return {
        ...state,
        savedTemplates: updatedTemplates,
        currentTemplate: templateToSave
      };

    case ACTIONS.LOAD_TEMPLATES:
      return {
        ...state,
        savedTemplates: action.payload
      };

    case ACTIONS.DELETE_TEMPLATE:
      return {
        ...state,
        savedTemplates: state.savedTemplates.filter(t => t.id !== action.payload)
      };

    case ACTIONS.CREATE_NEW_TEMPLATE:
      const newTemplate = createDefaultTemplate();
      return {
        ...state,
        currentTemplate: newTemplate
      };

    case ACTIONS.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };

    case ACTIONS.ADD_ASSET:
      return {
        ...state,
        assets: [...state.assets, action.payload]
      };

    case ACTIONS.REMOVE_ASSET:
      return {
        ...state,
        assets: state.assets.filter(asset => asset.id !== action.payload)
      };

    default:
      return state;
  }
}

export function TemplateProvider({ children }) {
  const [state, dispatch] = useReducer(templateReducer, initialState);

  // Load templates from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const templates = JSON.parse(saved);
        dispatch({ type: ACTIONS.LOAD_TEMPLATES, payload: templates });
      } catch (error) {
        console.error('Failed to load templates from storage:', error);
      }
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedTemplates));
  }, [state.savedTemplates]);

  const actions = {
    setCurrentTemplate: (template) => {
      dispatch({ type: ACTIONS.SET_CURRENT_TEMPLATE, payload: template });
    },

    updateTemplateData: (data) => {
      dispatch({ type: ACTIONS.UPDATE_TEMPLATE_DATA, payload: data });
    },

    saveTemplate: (template) => {
      dispatch({ type: ACTIONS.SAVE_TEMPLATE, payload: template });
    },

    deleteTemplate: (templateId) => {
      dispatch({ type: ACTIONS.DELETE_TEMPLATE, payload: templateId });
    },

    createNewTemplate: () => {
      dispatch({ type: ACTIONS.CREATE_NEW_TEMPLATE });
    },

    setActiveTab: (tab) => {
      dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });
    },

    addAsset: (asset) => {
      dispatch({ type: ACTIONS.ADD_ASSET, payload: asset });
    },

    removeAsset: (assetId) => {
      dispatch({ type: ACTIONS.REMOVE_ASSET, payload: assetId });
    },

    // Helper methods
    duplicateTemplate: (template) => {
      const duplicated = {
        ...template,
        id: crypto.randomUUID(),
        name: `${template.name} (Copy)`,
        created: new Date(),
        modified: new Date()
      };
      dispatch({ type: ACTIONS.SAVE_TEMPLATE, payload: duplicated });
      dispatch({ type: ACTIONS.SET_CURRENT_TEMPLATE, payload: duplicated });
    },

    loadTemplate: (template) => {
      dispatch({ type: ACTIONS.SET_CURRENT_TEMPLATE, payload: template });
    },

    exportTemplate: (template) => {
      const dataStr = JSON.stringify(template, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },

    importTemplate: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            
            // Check if this is a full template or just template data
            let template;
            if (importedData.id && importedData.data) {
              // Full template structure
              template = {
                ...importedData,
                id: crypto.randomUUID(), // Ensure unique ID
                created: new Date(),
                modified: new Date()
              };
            } else {
              // Just template data - wrap it in the proper structure
              template = {
                id: crypto.randomUUID(),
                name: importedData.site?.title || 'Imported Template',
                description: '',
                created: new Date(),
                modified: new Date(),
                data: importedData
              };
            }
            
            dispatch({ type: ACTIONS.SAVE_TEMPLATE, payload: template });
            dispatch({ type: ACTIONS.SET_CURRENT_TEMPLATE, payload: template });
            resolve(template);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
  };

  return (
    <TemplateContext.Provider value={{ state, actions }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
}

