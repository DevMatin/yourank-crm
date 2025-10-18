'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare,
  Sparkles,
  Lightbulb,
  TrendingUp,
  Hash,
  Search,
  Globe,
  BarChart3,
  Target,
  Zap,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { modules } from '@/config/modules.config';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Kontextuelle Quick Actions basierend auf der aktuellen Seite
const getContextualQuickActions = (pathname: string) => {
  const basePath = pathname.split('/')[1];
  const toolId = pathname.split('/')[2];
  
  const actions: { icon: any; text: string; color: string }[] = [];
  
  switch (basePath) {
    case 'keywords':
      actions.push(
        { icon: Hash, text: 'Keyword Schwierigkeit bewerten', color: 'bg-red-500' },
        { icon: Search, text: 'Verwandte Keywords finden', color: 'bg-blue-500' },
        { icon: TrendingUp, text: 'Suchvolumen analysieren', color: 'bg-green-500' },
        { icon: Target, text: 'Long-tail Keywords', color: 'bg-purple-500' }
      );
      break;
    case 'domain':
      actions.push(
        { icon: Globe, text: 'Domain Authority prüfen', color: 'bg-blue-500' },
        { icon: BarChart3, text: 'Traffic Analyse', color: 'bg-green-500' },
        { icon: Target, text: 'Ranking Keywords', color: 'bg-orange-500' }
      );
      break;
    case 'serp':
      actions.push(
        { icon: Search, text: 'SERP Features analysieren', color: 'bg-blue-500' },
        { icon: Lightbulb, text: 'Content Lücken finden', color: 'bg-yellow-500' },
        { icon: Target, text: 'Konkurrenz analysieren', color: 'bg-red-500' }
      );
      break;
    case 'backlinks':
      actions.push(
        { icon: Zap, text: 'Backlink Qualität prüfen', color: 'bg-blue-500' },
        { icon: Target, text: 'Link Building Strategien', color: 'bg-green-500' },
        { icon: Globe, text: 'Referring Domains', color: 'bg-purple-500' }
      );
      break;
    default:
      actions.push(
        { icon: Sparkles, text: 'Allgemeine SEO Hilfe', color: 'bg-blue-500' },
        { icon: Lightbulb, text: 'Content Ideen', color: 'bg-yellow-500' },
        { icon: TrendingUp, text: 'Trend Analyse', color: 'bg-green-500' }
      );
  }
  
  return actions;
};

// Kontextuelle Willkommensnachricht basierend auf der aktuellen Seite
const getContextualWelcomeMessage = (pathname: string) => {
  const basePath = pathname.split('/')[1];
  const toolId = pathname.split('/')[2];
  
  const moduleData = modules.find(m => m.basePath === `/${basePath}`);
  const tool = moduleData?.tools.find(t => t.id === toolId);
  
  if (tool) {
    return `Hallo! Ich bin hier, um dir bei "${tool.name}" zu helfen. ${tool.description}\n\nWas möchtest du über dieses Tool wissen?`;
  } else if (moduleData) {
    return `Willkommen bei "${moduleData.name}"! Ich kann dir bei verschiedenen Aspekten helfen:\n\n${moduleData.tools.map(t => `• ${t.name}`).join('\n')}\n\nWomit kann ich dir helfen?`;
  } else {
    return 'Hallo! Ich bin dein AI-Assistent für SEO-Analysen. Wie kann ich dir heute helfen?';
  }
};

// Kontextuelle Antworten basierend auf der aktuellen Seite und der Frage
const getContextualResponse = (question: string, pathname: string) => {
  const basePath = pathname.split('/')[1];
  const toolId = pathname.split('/')[2];
  
  const moduleData = modules.find(m => m.basePath === `/${basePath}`);
  const tool = moduleData?.tools.find(t => t.id === toolId);
  
  const questionLower = question.toLowerCase();
  
  // Generische Antworten für verschiedene Themen
  if (questionLower.includes('schwierigkeit') || questionLower.includes('difficulty')) {
    return `Die Keyword-Schwierigkeit wird anhand verschiedener Faktoren bewertet:\n\n• Domain Authority der konkurrierenden Seiten\n• Anzahl der Backlinks\n• Content-Qualität\n• Suchvolumen\n\nEin niedriger Schwierigkeitsgrad (0-30) bedeutet einfache Rankings, während hohe Werte (70-100) sehr schwierig sind.`;
  }
  
  if (questionLower.includes('suchvolumen') || questionLower.includes('volume')) {
    return `Das Suchvolumen zeigt, wie oft ein Keyword monatlich gesucht wird:\n\n• Niedrig: < 100 Suchanfragen/Monat\n• Mittel: 100-1.000 Suchanfragen/Monat\n• Hoch: > 1.000 Suchanfragen/Monat\n\nWichtig: Hohes Suchvolumen bedeutet nicht automatisch bessere Rankings!`;
  }
  
  if (questionLower.includes('verwandt') || questionLower.includes('related')) {
    return `Verwandte Keywords helfen dir dabei:\n\n• Deine Content-Strategie zu erweitern\n• Long-tail Keywords zu finden\n• Semantische Clusters zu bilden\n• Die Suchintention besser zu verstehen\n\nNutze diese für umfassendere Content-Strategien!`;
  }
  
  if (questionLower.includes('backlink') || questionLower.includes('link')) {
    return `Backlinks sind wichtig für SEO:\n\n• Qualität > Quantität\n• Relevante Domains bevorzugen\n• Natürliche Anchor-Texte verwenden\n• Regelmäßig das Linkprofil überwachen\n\nVermeide Spam-Links und konzentriere dich auf hochwertige Verlinkungen.`;
  }
  
  if (questionLower.includes('content') || questionLower.includes('inhalt')) {
    return `Für guten Content:\n\n• Beantworte die Suchintention\n• Verwende relevante Keywords natürlich\n• Strukturiere mit Überschriften\n• Füge interne Verlinkungen hinzu\n• Optimiere für Featured Snippets\n\nContent ist King - aber nur wenn er wirklich hilft!`;
  }
  
  // Spezifische Antworten basierend auf dem aktuellen Tool
  if (tool) {
    return `Das ist eine kontextuelle Antwort für "${tool.name}". ${tool.description}\n\nHier sind einige Tipps:\n\n• Nutze die verfügbaren Daten optimal\n• Analysiere die Ergebnisse gründlich\n• Kombiniere verschiedene Metriken\n• Dokumentiere deine Erkenntnisse\n\nMöchtest du mehr über ein spezifisches Feature wissen?`;
  }
  
  // Fallback-Antwort
  return `Das ist eine kontextuelle Dummy-Antwort für die Seite "${pathname}". Die echte AI-Integration wird später implementiert!\n\nIch kann dir bei verschiedenen SEO-Themen helfen. Stelle gerne spezifische Fragen!`;
};

export function AIChat() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true); // Standard: geschlossen
  
  // Lade Kollabierungs-Status aus localStorage
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('ai-chat-collapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(JSON.parse(savedCollapsedState));
    } else {
      // Wenn kein gespeicherter Zustand existiert, Chat geschlossen lassen
      setIsCollapsed(true);
    }
  }, []);
  
  // Speichere Kollabierungs-Status in localStorage
  useEffect(() => {
    localStorage.setItem('ai-chat-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);
  
  const initializeNewChat = useCallback(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: getContextualWelcomeMessage(pathname),
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [pathname]);
  
  // Chat-Verlauf pro Seite laden und speichern
  useEffect(() => {
    setIsLoading(true);
    const storageKey = `chat-history-${pathname}`;
    
    // Lade gespeicherten Chat-Verlauf für diese Seite
    const savedMessages = localStorage.getItem(storageKey);
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Konvertiere timestamp strings zurück zu Date Objekten
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Fehler beim Laden des Chat-Verlaufs:', error);
        // Fallback: Neue Willkommensnachricht
        initializeNewChat();
      }
    } else {
      // Erste Besuche: Neue Willkommensnachricht
      initializeNewChat();
    }
    
    setIsLoading(false);
  }, [pathname, initializeNewChat]);
  
  // Speichere Chat-Verlauf bei jeder Änderung
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = `chat-history-${pathname}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, pathname]);
  
  const quickActions = getContextualQuickActions(pathname);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simuliere kontextuelle AI-Antwort nach kurzer Verzögerung
    setTimeout(() => {
      const contextualResponse = getContextualResponse(inputValue, pathname);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: contextualResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: action,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const clearChatHistory = () => {
    const storageKey = `chat-history-${pathname}`;
    localStorage.removeItem(storageKey);
    initializeNewChat();
  };

  const toggleChat = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Dünne Leiste wenn Chat kollabiert ist
  if (isCollapsed) {
    return (
      <div className="flex h-full w-12 flex-col bg-card border-l transition-all duration-300 ease-in-out">
        {/* Kollabierte Leiste */}
        <div className="flex h-full flex-col items-center justify-between py-4">
          <div className="flex flex-col items-center space-y-4">
            <div 
              className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={toggleChat}
              title="AI Chat öffnen"
            >
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div 
                className="cursor-pointer hover:text-blue-500 transition-colors duration-200"
                onClick={toggleChat}
                title="AI Chat öffnen"
              >
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Badge 
                variant="secondary" 
                className="text-xs px-1 py-0 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                onClick={toggleChat}
                title="AI Chat öffnen"
              >
                {messages.length - 1}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleChat}
            className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/10 transition-colors duration-200"
            title="AI Chat öffnen"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-80 flex-col bg-card border-l transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {(() => {
                const basePath = pathname.split('/')[1];
                const toolId = pathname.split('/')[2];
                const moduleData = modules.find(m => m.basePath === `/${basePath}`);
                const tool = moduleData?.tools.find(t => t.id === toolId);
                return tool ? tool.name : moduleData ? moduleData.name : 'Dashboard';
              })()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {messages.length - 1} Nachrichten
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChatHistory}
            className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/10 transition-colors duration-200"
            title="Chat-Verlauf löschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleChat}
            className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/10 transition-colors duration-200"
            title="AI Chat schließen"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b">
        <p className="text-xs text-muted-foreground mb-2">Schnellaktionen:</p>
        <div className="space-y-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs h-8 hover:bg-white/20 dark:hover:bg-white/10 transition-colors duration-200"
                onClick={() => handleQuickAction(action.text)}
              >
                <Icon className="h-3 w-3 mr-2" />
                {action.text}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Chat-Verlauf wird geladen...</div>
          </div>
        ) : (
          messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <Avatar className="h-6 w-6">
              {message.sender === 'ai' ? (
                <Bot className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
            </Avatar>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.sender === 'ai'
                  ? 'bg-muted text-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Frage stellen..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI Assistant • Dummy Version
        </p>
      </div>
    </div>
  );
}
