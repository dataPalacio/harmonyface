/**
 * Compliance Dashboard Component
 * Display compliance score and flags for clinical sessions
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ComplianceCheckResult } from '@/types/ai';

interface ComplianceDashboardProps {
  sessionId?: string;
  sessionData?: Record<string, unknown>;
}

export default function ComplianceDashboard({ sessionId, sessionData }: ComplianceDashboardProps) {
  const [result, setResult] = useState<ComplianceCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckCompliance = async () => {
    if (!sessionId || !sessionData) {
      setError('Dados da sessão não fornecidos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, session: sessionData }),
      });

      if (!response.ok) {
        throw new Error('Falha ao verificar conformidade');
      }

      const data = (await response.json()) as { data: ComplianceCheckResult };
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar conformidade');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verificação de Conformidade</CardTitle>
          <p className="text-sm text-muted-foreground">
            Analise conformidade com regras regulatórias e boas práticas clínicas
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-800 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {!result && (
            <Button onClick={handleCheckCompliance} disabled={loading} className="w-full">
              {loading ? 'Verificando...' : 'Verificar Conformidade'}
            </Button>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Score de Conformidade</div>
                  <div className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}/100
                  </div>
                </div>
                <div className="text-right">
                  {result.compliant ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-8 w-8" />
                      <span className="font-medium">Conforme</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-8 w-8" />
                      <span className="font-medium">Não Conforme</span>
                    </div>
                  )}
                </div>
              </div>
              <Progress value={result.overallScore} className="h-2" />
            </CardContent>
          </Card>

          {/* Flags */}
          {result.flags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Problemas Identificados ({result.flags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.flags.map((flag, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-md border ${getSeverityColor(flag.severity)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getSeverityIcon(flag.severity)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {flag.code}
                            </Badge>
                            <span className="text-xs font-medium uppercase">{flag.severity}</span>
                          </div>
                          <div className="font-medium mb-1">{flag.message}</div>
                          {flag.suggestion && (
                            <div className="text-sm mt-2 italic">
                              💡 {flag.suggestion}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recomendações</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((recommendation, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {result.flags.filter((f) => f.severity === 'critical').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Críticos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">
                    {result.flags.filter((f) => f.severity === 'warning').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Avisos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.flags.filter((f) => f.severity === 'info').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Informativos</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-center text-muted-foreground">
                Verificado em: {new Date(result.lastCheckedAt).toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleCheckCompliance} variant="outline" className="w-full">
            Verificar Novamente
          </Button>
        </div>
      )}
    </div>
  );
}
