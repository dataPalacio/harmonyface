/**
 * AI Assistant Page
 * Unified interface for all AI-powered clinical features
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileSearch, Shield } from 'lucide-react';
import NEREditor from '@/components/ai/ner-editor';
import RAGAssistant from '@/components/ai/rag-assistant';
import ComplianceDashboard from '@/components/ai/compliance-dashboard';

export default function AiAssistantPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assistente de IA Clínico</h1>
        <p className="text-muted-foreground">
          Ferramentas inteligentes para análise de prontuários, consulta de conhecimento e
          verificação de conformidade
        </p>
      </div>

      <Tabs defaultValue="ner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ner" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>Análise de Texto</span>
          </TabsTrigger>
          <TabsTrigger value="rag" className="flex items-center gap-2">
            <FileSearch className="h-4 w-4" />
            <span>Base de Conhecimento</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Conformidade</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ner">
          <NEREditor />
        </TabsContent>

        <TabsContent value="rag">
          <RAGAssistant />
        </TabsContent>

        <TabsContent value="compliance">
          <div className="max-w-4xl mx-auto">
            <ComplianceDashboard />
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Como usar:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Navegue até uma sessão específica para verificar conformidade</li>
                <li>O sistema analisa automaticamente 8 regras regulatórias</li>
                <li>Problemas críticos impedem finalização da sessão</li>
                <li>Avisos sugerem melhorias mas não bloqueiam</li>
              </ol>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Footer */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">ℹ️ Sobre o Assistente de IA</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Análise de Texto (NER):</strong> Extrai automaticamente procedimentos, regiões,
            produtos, lotes e intercorrências das anotações clínicas usando processamento de
            linguagem natural.
          </p>
          <p>
            <strong>Base de Conhecimento (RAG):</strong> Consulte protocolos, bulas e diretrizes
            clínicas indexadas com busca semântica e respostas geradas por IA.
          </p>
          <p>
            <strong>Conformidade:</strong> Verifica automaticamente 8 regras regulatórias incluindo
            consentimento informado, rastreabilidade de produtos, documentação adequada e prazos de
            retorno.
          </p>
          <p className="font-medium mt-4 pt-4 border-t border-blue-300">
            ⚠️ Importante: Todas as sugestões são geradas por IA e devem ser revisadas por um
            profissional habilitado. A decisão clínica final é sempre responsabilidade do médico.
          </p>
        </div>
      </div>
    </div>
  );
}
