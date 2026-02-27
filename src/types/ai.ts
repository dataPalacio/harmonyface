/**
 * AI Module Types
 * Structures for NLP/NER, RAG, summarization, and compliance checking
 */

// ============ NLP/NER TYPES ============

export interface NEREntity {
  text: string;
  label: string; // PROCEDURE, REGION, PRODUCT, QUANTITY, INTERCURRENCE, RETURN_DATE, etc.
  confidence: number; // 0-1
  startChar: number;
  endChar: number;
}

export interface NERResult {
  originalText: string;
  entities: NEREntity[];
  procedures: ExtractedProcedure[];
  intercurrences: string[];
  returnDate?: string;
  suggestedProcedures: SuggestedProcedure[];
  confidence: number; // 0-1, overall
  processingTimeMs: number;
}

export interface ExtractedProcedure {
  type: string; // Toxina Botulínica, Preenchimento, etc.
  regions: string[];
  product?: string;
  productLot?: string;
  quantity?: string;
  technique?: string;
  complications?: string;
  confidence: number;
}

export interface SuggestedProcedure {
  type: string;
  region?: string;
  reason: string; // motivo da sugestão
  confidence: number;
}

// ============ RAG TYPES ============

export interface RAGQuery {
  question: string;
  context?: string; // contexto do paciente, se houver
  topK?: number; // número de documentos a recuperar
}

export interface RAGResult {
  answer: string;
  sources: RAGSource[];
  confidence: number; // 0-1
  disclaimer: string; // texto obrigatório de AI
  processingTimeMs: number;
}

export interface RAGSource {
  documentId: string;
  title: string;
  source: string; // bula, protocolo, artigo, guideline
  relevanceScore: number; // 0-1
  excerpt: string; // trecho relevante
  metadata?: Record<string, unknown>;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  source: string; // bula, protocolo, artigo, guideline
  content: string;
  embedding?: number[]; // vetor para pgvector
  metadata?: {
    author?: string;
    date?: string;
    category?: string;
    keywords?: string[];
  };
  createdAt: string; // ISO 8601
}

// ============ SUMMARIZATION TYPES ============

export interface SummarizationResult {
  sessionId: string;
  originalNotes: string;
  summary: string;
  structuredData: SessionStructuredData;
  completenessScore: number; // 0-100
  qualityScore: number; // 0-100
  missingFields: string[];
  processingTimeMs: number;
}

export interface SessionStructuredData {
  patient?: {
    name?: string;
    age?: number;
  };
  proceduresPerformed: StructuredProcedure[];
  intercurrences: string[];
  clinicalComments?: string;
  returnSchedule?: string;
  medicationsApplied?: {
    name: string;
    lot?: string;
    quantity?: string;
  }[];
  consentStatus?: boolean;
}

export interface StructuredProcedure {
  type: string;
  region: string;
  product: string;
  lot: string;
  quantity: string;
  technique?: string;
  complications?: string;
}

// ============ COMPLIANCE TYPES ============

export interface ComplianceCheckResult {
  sessionId: string;
  overallScore: number; // 0-100
  compliant: boolean; // true se score >= 80
  flags: ComplianceFlag[];
  recommendations: string[];
  lastCheckedAt: string; // ISO 8601
}

export interface ComplianceFlag {
  severity: 'critical' | 'warning' | 'info'; // crítico, aviso, informação
  code: string; // ID da regra
  message: string;
  field?: string; // campo relacionado
  suggestion?: string; // como corrigir
}

export interface ComplianceRule {
  code: string;
  name: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  check: (session: Record<string, unknown>) => boolean;
  suggestion?: string;
  applicableTo?: string[]; // tipos de procedimentos
}

// ============ AI PROCESSING LOG ============

export interface AIProcessingLog {
  id: string;
  sessionId: string;
  processType: 'ner' | 'rag' | 'summarization' | 'compliance'; // tipo de processamento
  inputText?: string;
  inputQuery?: string;
  output?: Record<string, unknown>;
  model?: string;
  tokensUsed?: number;
  costUsd?: number;
  processingTimeMs: number;
  status: 'success' | 'error' | 'partial';
  errorMessage?: string;
  createdAt: string; // ISO 8601
}

// ============ AI CONFIGURATION ============

export interface AIConfig {
  nerEnabled: boolean;
  ragEnabled: boolean;
  summarizationEnabled: boolean;
  complianceCheckingEnabled: boolean;
  provider: 'huggingface' | 'openai' | 'groq' | 'local'; // provedor de LLM
  embeddingModel: 'sentence-transformers' | 'openai' | 'cohere'; // modelo de embedding
  defaultTopKDocuments: number;
  complianceScoreThreshold: number; // 0-100
}
