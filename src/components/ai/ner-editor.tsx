/**
 * NER Editor Component
 * Real-time entity extraction from clinical notes
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { NERResult } from '@/types/ai';

export default function NEREditor() {
  const [clinicalText, setClinicalText] = useState('');
  const [nerResult, setNerResult] = useState<NERResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!clinicalText.trim() || clinicalText.length < 10) {
      setError('Por favor, insira ao menos 10 caracteres de texto clínico');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/ner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalText }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar NER');
      }

      const data = (await response.json()) as { data: NERResult; disclaimer: string };
      setNerResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar texto');
    } finally {
      setLoading(false);
    }
  };

  const getEntityColor = (label: string): string => {
    const colors: Record<string, string> = {
      PROCEDURE: 'bg-blue-100 text-blue-800',
      REGION: 'bg-green-100 text-green-800',
      PRODUCT_LOT: 'bg-purple-100 text-purple-800',
      QUANTITY: 'bg-orange-100 text-orange-800',
      INTERCURRENCE: 'bg-red-100 text-red-800',
    };
    return colors[label] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análise de Entidades Clínicas (NER)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Extraia automaticamente procedimentos, regiões, produtos e complicações das anotações clínicas
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="clinical-notes" className="block text-sm font-medium mb-2">
              Anotações Clínicas
            </label>
            <Textarea
              id="clinical-notes"
              placeholder="Ex: Paciente recebeu 50U de Botox Allergan (lote ABC123) na região frontal e glabela. Técnica de injeção em leque. Sem intercorrências. Retorno em 15 dias."
              rows={8}
              value={clinicalText}
              onChange={(e) => setClinicalText(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              'Analisar Texto'
            )}
          </Button>
        </CardContent>
      </Card>

      {nerResult && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Entities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Entidades Extraídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {nerResult.entities.length > 0 ? (
                  nerResult.entities.map((entity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Badge className={getEntityColor(entity.label)}>{entity.label}</Badge>
                      <span className="text-sm">{entity.text}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {(entity.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma entidade encontrada</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Procedures */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Procedimentos Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nerResult.procedures.length > 0 ? (
                  nerResult.procedures.map((proc, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2">
                      <div className="font-medium">{proc.type}</div>
                      {proc.regions && proc.regions.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Região: {proc.regions.join(', ')}
                        </div>
                      )}
                      {proc.product && (
                        <div className="text-sm text-muted-foreground">
                          Produto: {proc.product}
                          {proc.productLot && ` (Lote: ${proc.productLot})`}
                        </div>
                      )}
                      {proc.quantity && (
                        <div className="text-sm text-muted-foreground">
                          Quantidade: {proc.quantity}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Confiança: {(proc.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum procedimento identificado</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Intercurrences */}
          {nerResult.intercurrences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Intercorrências</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {nerResult.intercurrences.map((intercurrence, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {intercurrence}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Return Date */}
          {nerResult.returnDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data de Retorno</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{nerResult.returnDate}</p>
              </CardContent>
            </Card>
          )}

          {/* Suggested Procedures */}
          {nerResult.suggestedProcedures.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Procedimentos Sugeridos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {nerResult.suggestedProcedures.map((suggested, idx) => (
                    <div key={idx} className="p-3 border rounded-md">
                      <div className="font-medium">{suggested.type}</div>
                      <div className="text-sm text-muted-foreground mt-1">{suggested.reason}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Confiança: {(suggested.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Stats */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Confiança Geral: {(nerResult.confidence * 100).toFixed(1)}%</span>
                <span>Tempo de Processamento: {nerResult.processingTimeMs}ms</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
