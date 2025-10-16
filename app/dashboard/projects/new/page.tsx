'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const normalizeDomain = (domain: string): string => {
    return domain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedDomain = normalizeDomain(domain);
      
      if (!validateDomain(normalizedDomain)) {
        setError('Bitte geben Sie eine gültige Domain ein (z.B. example.com)');
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Sie müssen angemeldet sein');
        return;
      }

      // Check if domain already exists for this user
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)
        .eq('domain', normalizedDomain)
        .single();

      if (existingProject) {
        setError('Ein Projekt mit dieser Domain existiert bereits');
        return;
      }

      // Create project
      const { data, error: createError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: name.trim(),
          domain: normalizedDomain
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating project:', createError);
        setError('Fehler beim Erstellen des Projekts');
        return;
      }

      // Redirect to project details
      router.push(`/dashboard/projects/${data.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu Projekten
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Neues Projekt erstellen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Projektname</Label>
              <Input
                id="name"
                type="text"
                placeholder="z.B. Meine Website"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Geben Sie einen aussagekräftigen Namen für Ihr Projekt ein
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Geben Sie die Domain ohne http:// oder www. ein
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={loading || !name.trim() || !domain.trim()}
                className="flex-1"
              >
                {loading ? 'Erstelle...' : 'Projekt erstellen'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/projects">Abbrechen</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
