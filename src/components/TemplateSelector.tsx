import React from 'react';
import { ResumeTemplate } from '../types';
import { resumeTemplates } from '../data/templates';
import { FileText, CheckCircle, Zap, Palette, Building2, Sparkles, Lock } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
}) => {
  const getTemplateIcon = (style: ResumeTemplate['style']) => {
    switch (style) {
      case 'modern':
        return Zap;
      case 'classic':
        return Building2;
      case 'technical':
        return FileText;
      case 'creative':
        return Palette;
      default:
        return FileText;
    }
  };

  const getTemplateColor = (style: ResumeTemplate['style']) => {
    switch (style) {
      case 'modern':
        return 'bg-blue-500';
      case 'classic':
        return 'bg-gray-700';
      case 'technical':
        return 'bg-purple-500';
      case 'creative':
        return 'bg-pink-500';
      default:
        return 'bg-blue-500';
    }
  };

  const isTemplateAvailable = (template: ResumeTemplate) => {
    return template.style === 'modern';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Resume Templates</span>
        </h2>
        <p className="text-purple-100 text-sm">Choose a professional template that matches your style</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumeTemplates.map((template) => {
            const IconComponent = getTemplateIcon(template.style);
            const isSelected = template.id === selectedTemplate;
            const colorClass = getTemplateColor(template.style);
            const available = isTemplateAvailable(template);

            return (
              <div
                key={template.id}
                onClick={() => available && onTemplateSelect(template.id)}
                role="button"
                aria-disabled={!available}
                className={`relative p-6 border-2 rounded-xl transition-all transform ${
                  available ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                } ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                {!available && (
                  <div className="absolute inset-0 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="bg-white/90 p-2 rounded-full shadow">
                        <Lock className="w-5 h-5 text-gray-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Locked</span>
                    </div>
                  </div>
                )}

                <div className={`flex items-center space-x-3 mb-4 ${!available ? 'filter blur-sm opacity-80' : ''}`}>
                  <div className={`${colorClass} p-3 rounded-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    {template.atsOptimized && (
                      <span className="inline-flex items-center space-x-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3" />
                        <span>ATS Optimized</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className={`text-gray-600 text-sm mb-4 ${!available ? 'filter blur-sm opacity-70' : ''}`}>
                  {template.description}
                </p>

                <div className={`flex items-center justify-between ${!available ? 'filter blur-sm opacity-70' : ''}`}>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {template.style.charAt(0).toUpperCase() + template.style.slice(1)} Style
                  </span>
                  <div className="flex items-center space-x-1 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Production Ready</span>
                  </div>
                </div>

                <div className={`mt-4 bg-gray-50 rounded-lg p-3 border ${!available ? 'opacity-60' : ''}`}>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Template Optimization</h4>
              <p className="text-sm text-gray-600">
                All templates are optimized for ATS systems and will be dynamically populated with your profile data.
                Each AI provider will generate content that fits perfectly within your selected template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
