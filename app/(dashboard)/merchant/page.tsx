'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Store, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'google-shopping',
    name: 'Google Shopping',
    description: 'Analysiere Google Shopping Ergebnisse',
    icon: ShoppingCart,
    credits: 2,
    status: 'active',
    href: '/merchant/google-shopping'
  },
  {
    id: 'seller-data',
    name: 'Seller Data',
    description: 'Analysiere Verkäufer-Daten und Bewertungen',
    icon: Store,
    credits: 1,
    status: 'active',
    href: '/merchant/seller-data'
  }
];

export default function MerchantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Merchant API</h1>
        <p className="text-muted-foreground">
          Google Shopping und E-Commerce Analyse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          
          return (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {tool.credits} Credits
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={tool.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {tool.status === 'active' ? 'Verfügbar' : 'In Entwicklung'}
                  </Badge>
                  
                  <Button asChild disabled={tool.status !== 'active'}>
                    <Link href={tool.href}>
                      Tool öffnen
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Über Merchant API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Merchant API Modul bietet dir umfassende E-Commerce und Google Shopping Analysen. 
              Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Google Shopping</strong> - Analysiere Shopping-Ergebnisse und Preise</li>
              <li><strong>Seller Data</strong> - Überprüfe Verkäufer-Daten und Bewertungen</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, deine E-Commerce-Strategie zu optimieren, 
              Preise zu vergleichen und die Konkurrenz zu analysieren.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
