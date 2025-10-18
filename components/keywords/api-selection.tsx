import React, { useState } from 'react';
import { TrendingUp, Target, BarChart3, Users, Link2 } from 'lucide-react';

interface APIOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

interface ApiSelectionProps {
  selectedApis: string[];
  onSelectionChange: (apis: string[]) => void;
  totalCredits: number;
}

const apiOptions: APIOption[] = [
  {
    id: 'searchVolume',
    name: 'Search Volume',
    description: 'Suchvolumen, CPC und monatliche Trends',
    icon: TrendingUp,
    color: '#34A7AD'
  },
  {
    id: 'difficulty',
    name: 'Keyword Difficulty',
    description: 'Schwierigkeitsgrad des Keywords',
    icon: Target,
    color: '#9333EA'
  },
  {
    id: 'trends',
    name: 'Google Trends',
    description: 'Suchvolumen-Verlauf über Zeit',
    icon: BarChart3,
    color: '#F59E0B'
  },
  {
    id: 'demographics',
    name: 'Demographics',
    description: 'Altersverteilung der Nutzer',
    icon: Users,
    color: '#EC4899'
  },
  {
    id: 'relatedKeywords',
    name: 'Related Keywords',
    description: 'Verwandte Keywords und Konkurrenz',
    icon: Link2,
    color: '#10B981'
  }
];

export function ApiSelection({ selectedApis, onSelectionChange, totalCredits }: ApiSelectionProps) {
  const toggleAPI = (id: string) => {
    if (selectedApis.includes(id)) {
      onSelectionChange(selectedApis.filter(apiId => apiId !== id));
    } else {
      onSelectionChange([...selectedApis, id]);
    }
  };

  return (
    <div 
      className="rounded-3xl border overflow-hidden"
      style={{
        background: 'var(--glass-card-bg)',
        borderColor: 'var(--glass-card-border)',
        backdropFilter: 'blur(16px)',
        boxShadow: 'var(--glass-card-shadow)'
      }}
    >
      <div className="p-4">
        {/* Header mit Toggle */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            Datenquellen ({selectedApis.length} von {apiOptions.length} aktiv)
          </p>
          {selectedApis.length === apiOptions.length ? (
            <button
              onClick={() => onSelectionChange([])}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Alle deaktivieren
            </button>
          ) : (
            <button
              onClick={() => onSelectionChange(apiOptions.map(api => api.id))}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Alle aktivieren
            </button>
          )}
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {apiOptions.map((api) => {
            const isActive = selectedApis.includes(api.id);
            return (
              <button
                key={api.id}
                onClick={() => toggleAPI(api.id)}
                className={`flex items-start gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                  isActive ? 'ring-1 hover:ring-2' : 'hover:bg-white/5'
                }`}
                style={{
                  background: isActive 
                    ? `linear-gradient(145deg, ${api.color}10, ${api.color}05)` 
                    : 'var(--glass-card-bg)',
                  borderColor: isActive ? api.color : 'var(--glass-card-border)',
                  opacity: isActive ? 1 : 0.5
                }}
              >
                {/* Icon */}
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'scale-100' : 'scale-95'
                  }`}
                  style={{
                    background: isActive ? api.color : 'rgba(156, 163, 175, 0.3)',
                    boxShadow: isActive ? `0 2px 12px ${api.color}40` : 'none'
                  }}
                >
                  <api.icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-xs text-foreground mb-1">
                    {api.name}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {api.description}
                  </p>
                </div>

                {/* Checkbox */}
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                  style={{
                    borderColor: isActive ? api.color : 'rgba(156, 163, 175, 0.5)',
                    background: isActive ? api.color : 'transparent'
                  }}
                >
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {selectedApis.length === 0 && (
          <div className="text-center py-4 mt-2">
            <p className="text-xs text-muted-foreground">
              Wähle mindestens eine Datenquelle für die Analyse
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
