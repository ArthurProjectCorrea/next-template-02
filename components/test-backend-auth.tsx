'use client';

import { useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function TestBackendAuth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    user: { userId: string; email: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testAuth = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetchWithAuth(`${backendUrl}/auth/test`);
      const data = (await response.json()) as {
        message: string;
        user: { userId: string; email: string };
      };
      if (response.ok) {
        setResult(data);
      } else {
        const errorData = data as Record<string, unknown>;
        setError(
          (errorData.message as string) || 'Erro ao autenticar no backend'
        );
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Erro de conexão com o backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex w-full max-w-md flex-col gap-4">
      <Button onClick={testAuth} disabled={loading} className="rounded-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Testar Autenticação no Backend
      </Button>

      {result && (
        <Alert
          variant="default"
          className="border-green-500 bg-green-50 dark:bg-green-900/10"
        >
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-400">
            Sucesso!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {result.message} <br />
            <span className="text-xs opacity-70">
              User ID: {result.user.userId}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
