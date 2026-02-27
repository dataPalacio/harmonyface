/**
 * RAG Assistant Component
 * Query clinical knowledge base with AI-powered answers
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, BookOpen } from 'lucide-react';
import type { RAGResult } from '@/types/ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  result?: RAGResult;
}

export default function RAGAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim() || query.length < 5) {
      return;
    }

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Falha ao consultar assistente');
      }

      const data = (await response.json()) as { data: RAGResult; disclaimer: string };
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.data.answer,
        result: data.data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    'Quais os cuidados pós-operatório para toxina botulínica?',
    'Qual o intervalo recomendado entre aplicações de ácido hialurônico?',
    'Como tratar edema após preenchimento?',
    'Contraindicações para uso de Radiesse',
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Assistente de Conhecimento Clínico
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Faça perguntas sobre procedimentos, protocolos e bulas de produtos
          </p>
        </CardHeader>
        <CardContent>
          {/* Example Questions */}
          {messages.length === 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Exemplos de perguntas:</div>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => setQuery(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
            {messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                  {/* Sources */}
                  {message.result && message.result.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                      <div className="text-xs font-medium mb-2">Fontes:</div>
                      <div className="space-y-1">
                        {message.result.sources.map((source, sourceIdx) => (
                          <div key={sourceIdx} className="text-xs">
                            <div className="font-medium">{source.title}</div>
                            <div className="text-muted-foreground">
                              {source.source} · Relevância: {(source.relevanceScore * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confidence */}
                  {message.result && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Confiança: {(message.result.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Digite sua pergunta sobre procedimentos clínicos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading || query.length < 5}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Disclaimer */}
          <div className="mt-4 p-3 text-xs text-amber-800 bg-amber-50 rounded-md border border-amber-200">
            ⚠️ Sugestão gerada por IA baseada em base de conhecimento. A decisão clínica é responsabilidade do profissional.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
