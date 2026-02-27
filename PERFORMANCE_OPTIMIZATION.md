# ⚡ HarmoniFace - Performance Optimization Guide

## Database Optimization

### 1. Indexes Strategy

#### Already Implemented
```sql
-- Patients
CREATE INDEX idx_patients_cpf ON patients(cpf);
CREATE INDEX idx_patients_email ON patients(email);

-- Sessions
CREATE INDEX idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX idx_sessions_date ON sessions(date DESC);

-- Appointments
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Financial Records
CREATE INDEX idx_financial_records_patient_id ON financial_records(patient_id);
CREATE INDEX idx_financial_records_session_id ON financial_records(session_id);
CREATE INDEX idx_financial_records_status ON financial_records(status);
CREATE INDEX idx_financial_records_paid_at ON financial_records(paid_at DESC);

-- Inventory
CREATE INDEX idx_inventory_items_expiry_date ON inventory_items(expiry_date);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);

-- Knowledge Base (AI)
CREATE INDEX idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_knowledge_base_content_fts ON knowledge_base USING gin(to_tsvector('portuguese', content));
```

#### Recommended Additional Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_sessions_patient_date ON sessions(patient_id, date DESC);
CREATE INDEX idx_appointments_patient_scheduled ON appointments(patient_id, scheduled_at);
CREATE INDEX idx_financial_paid_date ON financial_records(status, paid_at) WHERE status = 'paid';

-- Partial indexes for specific queries
CREATE INDEX idx_appointments_upcoming ON appointments(scheduled_at) 
  WHERE status IN ('scheduled', 'confirmed');

CREATE INDEX idx_inventory_low_stock ON inventory_items(quantity_available) 
  WHERE quantity_available <= min_stock_alert;

CREATE INDEX idx_inventory_expiring ON inventory_items(expiry_date) 
  WHERE expiry_date <= (current_date + interval '30 days');
```

### 2. Query Optimization

#### Use Query Planning
```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM sessions
WHERE patient_id = 'uuid-here'
ORDER BY date DESC
LIMIT 10;

-- Update statistics
ANALYZE sessions;
ANALYZE appointments;
ANALYZE financial_records;
```

#### Optimize N+1 Queries
```typescript
// ❌ Bad: N+1 query
const sessions = await supabase.from('sessions').select('*');
for (const session of sessions) {
  const patient = await supabase
    .from('patients')
    .select('*')
    .eq('id', session.patient_id)
    .single();
}

// ✅ Good: Single query with join
const sessions = await supabase
  .from('sessions')
  .select('*, patients(*)');
```

#### Use Count Queries Efficiently
```typescript
// ❌ Bad: Fetches all rows
const { data } = await supabase.from('sessions').select('*');
const count = data?.length || 0;

// ✅ Good: Count-only query
const { count } = await supabase
  .from('sessions')
  .select('*', { count: 'exact', head: true });
```

### 3. Connection Pooling

#### Supabase Configuration
```typescript
// lib/supabase/server.ts
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            return;
          }
        }
      }
    }
  );
}

// Reuse connections
const supabase = await createServerSupabaseClient();
```

## React & Next.js Optimization

### 1. Server Components (Default)

```typescript
// ✅ Default to Server Components
// app/(dashboard)/reports/page.tsx
export default async function ReportsPage() {
  // Data fetching on server
  const kpis = await getDashboardKPIs();
  
  return <DashboardView kpis={kpis} />;
}
```

### 2. Client Components (Only When Needed)

```typescript
// ✅ Use 'use client' only for interactivity
'use client';

import { useState } from 'react';

export function InteractiveChart({ data }) {
  const [filter, setFilter] = useState('month');
  // Interactive chart logic
}
```

### 3. Dynamic Imports (Code Splitting)

```typescript
// ❌ Bad: Loads heavy chart library upfront
import { RevenueChart } from '@/components/dashboard/revenue-chart';

// ✅ Good: Lazy load when needed
import dynamic from 'next/dynamic';

const RevenueChart = dynamic(() => import('@/components/dashboard/revenue-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR for client-only components
});
```

### 4. Memoization

```typescript
// React.memo for expensive renders
export const KPICard = React.memo(function KPICard({ title, value }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardValue>{value}</CardValue>
    </Card>
  );
});

// useMemo for expensive calculations
const chartData = useMemo(() => {
  return processLargeDataset(rawData);
}, [rawData]);

// useCallback for stable function references
const handleExport = useCallback(() => {
  exportToCSV(data);
}, [data]);
```

### 5. Image Optimization

```typescript
import Image from 'next/image';

// ✅ Use Next.js Image component
<Image
  src="/patient-photo.jpg"
  alt="Patient photo"
  width={200}
  height={200}
  quality={85}
  loading="lazy"
  placeholder="blur"
/>
```

## Caching Strategies

### 1. Next.js Cache Configuration

```typescript
// app/(dashboard)/reports/page.tsx
export const revalidate = 3600; // Revalidate every hour

// API Route caching
export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### 2. React Query (Recommended for Client-Side)

```typescript
// lib/react-query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function ReactQueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Usage in components
'use client';

import { useQuery } from '@tanstack/react-query';

export function DashboardStats() {
  const { data: kpis } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/kpis');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
  
  return <KPICards kpis={kpis} />;
}
```

### 3. Redis Caching (Production)

```typescript
// lib/cache/redis.ts
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch and cache
  const data = await fetcher();
  await redis.setEx(key, ttl, JSON.stringify(data));
  
  return data;
}

// Usage
export async function getDashboardKPIs() {
  return getCachedData(
    'dashboard:kpis',
    async () => {
      // Expensive database queries
      return await calculateKPIs();
    },
    300 // 5 minutes TTL
  );
}
```

## Bundle Optimization

### 1. Analyze Bundle Size

```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your config
});

# Run analysis
ANALYZE=true npm run build
```

### 2. Tree Shaking

```typescript
// ❌ Bad: Imports entire library
import _ from 'lodash';

// ✅ Good: Import only what you need
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

// ✅ Even better: Use native alternatives
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
```

### 3. Remove Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove
npm uninstall package-name
```

## AI Service Optimization

### 1. Batch Processing

```typescript
// ❌ Bad: Process one by one
for (const text of texts) {
  const result = await performNER(text);
}

// ✅ Good: Batch processing
const results = await performNERBatch(texts);
```

### 2. Response Streaming (LLM)

```typescript
// For large LLM responses
export async function streamRAGResponse(query: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: query }],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(chunk.choices[0]?.delta?.content || '');
      }
      controller.close();
    },
  });
}
```

### 3. Embeddings Caching

```typescript
// Cache embeddings for frequently accessed documents
const embeddingCache = new Map<string, number[]>();

export async function getEmbedding(text: string): Promise<number[]> {
  const cacheKey = hash(text);
  
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }
  
  const embedding = await generateEmbedding(text);
  embeddingCache.set(cacheKey, embedding);
  
  return embedding;
}
```

## Monitoring & Profiling

### 1. Performance Monitoring (Vercel Analytics)

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking (Sentry)

```typescript
// instrumentation.ts
import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }
}
```

### 3. Database Query Logging

```typescript
// lib/supabase/server.ts
export async function createServerSupabaseClient() {
  const client = createServerClient(/* ... */);
  
  // Log slow queries in development
  if (process.env.NODE_ENV === 'development') {
    return new Proxy(client, {
      get(target, prop) {
        const original = target[prop];
        if (prop === 'from') {
          return (...args) => {
            const start = Date.now();
            const result = original.apply(target, args);
            
            // Wrap query execution
            return new Proxy(result, {
              get(qTarget, qProp) {
                if (qProp === 'then') {
                  return async (...thenArgs) => {
                    const response = await qTarget;
                    const duration = Date.now() - start;
                    
                    if (duration > 1000) {
                      console.warn(`Slow query (${duration}ms):`, args);
                    }
                    
                    return thenArgs[0](response);
                  };
                }
                return qTarget[qProp];
              },
            });
          };
        }
        return original;
      },
    });
  }
  
  return client;
}
```

## Performance Checklist

### Frontend
- [ ] Use Server Components by default
- [ ] Lazy load heavy components
- [ ] Optimize images with Next.js Image
- [ ] Minimize client-side JavaScript
- [ ] Implement proper caching strategies
- [ ] Use React.memo for expensive renders
- [ ] Debounce/throttle user inputs
- [ ] Virtualize long lists (react-window)

### Backend
- [ ] Add database indexes for common queries
- [ ] Optimize N+1 queries with joins
- [ ] Implement connection pooling
- [ ] Cache expensive computations
- [ ] Use batch operations where possible
- [ ] Implement rate limiting
- [ ] Compress API responses (gzip)
- [ ] Use CDN for static assets

### Database
- [ ] Regular VACUUM and ANALYZE
- [ ] Monitor slow queries
- [ ] Partition large tables (if needed)
- [ ] Archive old data
- [ ] Use read replicas for heavy reads
- [ ] Optimize indexes (remove unused)
- [ ] Use prepared statements
- [ ] Implement proper RLS policies

### AI Services
- [ ] Cache embeddings
- [ ] Batch AI requests
- [ ] Use streaming for long responses
- [ ] Implement request queuing
- [ ] Monitor token usage
- [ ] Set timeout limits
- [ ] Implement fallback strategies
- [ ] Cache RAG results

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| **Lighthouse Performance** | ≥90 | TBD |
| **First Contentful Paint** | <1.5s | TBD |
| **Time to Interactive** | <3.5s | TBD |
| **Largest Contentful Paint** | <2.5s | TBD |
| **Cumulative Layout Shift** | <0.1 | TBD |
| **API Response Time (p95)** | <500ms | TBD |
| **Database Query Time (p95)** | <100ms | TBD |
| **Bundle Size (First Load)** | <200KB | TBD |

## Tools

- **Bundle Analysis**: `@next/bundle-analyzer`
- **Lighthouse**: Chrome DevTools
- **React DevTools Profiler**: Chrome Extension
- **Database Monitoring**: Supabase Dashboard
- **Performance Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry
- **Query Profiling**: `EXPLAIN ANALYZE` (PostgreSQL)
