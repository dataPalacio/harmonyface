# 🧪 HarmoniFace - Testing Guide

## Testing Strategy

### 1. Unit Tests (Services & Utils)

#### Analytics Service Tests
```typescript
// tests/services/analytics-service.test.ts
import { describe, it, expect } from 'vitest';
import { getDashboardKPIs } from '@/lib/services/analytics-service';

describe('Analytics Service', () => {
  it('should calculate KPIs correctly', async () => {
    const kpis = await getDashboardKPIs();
    
    expect(kpis).toHaveProperty('patientsToday');
    expect(kpis).toHaveProperty('revenueThisMonth');
    expect(kpis.noShowRate).toBeGreaterThanOrEqual(0);
    expect(kpis.noShowRate).toBeLessThanOrEqual(100);
  });

  it('should return empty arrays when no data exists', async () => {
    const kpis = await getDashboardKPIs();
    
    expect(Array.isArray(kpis.topProcedures)).toBe(true);
    expect(Array.isArray(kpis.recentSessions)).toBe(true);
  });
});
```

#### Export Service Tests
```typescript
// tests/services/export-service.test.ts
import { describe, it, expect } from 'vitest';
import { exportToCSV } from '@/lib/services/export-service';

describe('Export Service', () => {
  it('should export data to CSV format', () => {
    const data = [
      { name: 'Product 1', quantity: 10, price: 100 },
      { name: 'Product 2', quantity: 5, price: 50 },
    ];

    const result = exportToCSV(data, {
      filename: 'test',
      format: 'csv',
    });

    expect(result.success).toBe(true);
    expect(result.filename).toContain('.csv');
  });

  it('should handle empty data gracefully', () => {
    const result = exportToCSV([], {
      filename: 'empty',
      format: 'csv',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

#### Notification Service Tests
```typescript
// tests/services/notification-service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { sendEmail } from '@/lib/services/notification-service';

describe('Notification Service', () => {
  it('should send email with correct parameters', async () => {
    const notification = {
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'This is a test email',
    };

    // Mock console.log to verify it's called
    const consoleSpy = vi.spyOn(console, 'log');

    const result = await sendEmail(notification);

    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

### 2. Integration Tests (API Routes)

```typescript
// tests/api/reports.test.ts
import { describe, it, expect } from 'vitest';

describe('Reports API', () => {
  it('should generate financial report', async () => {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'financial',
        format: 'json',
        filters: {
          startDate: '2026-02-01',
          endDate: '2026-02-28',
        },
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('summary');
  });

  it('should return 400 for invalid report type', async () => {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'invalid',
        format: 'json',
        filters: {},
      }),
    });

    expect(response.status).toBe(400);
  });
});
```

### 3. Component Tests (React Testing Library)

```typescript
// tests/components/dashboard/kpi-card.test.tsx
import { render, screen } from '@testing-library/react';
import { KPICard } from '@/components/dashboard/kpi-card';

describe('KPICard', () => {
  it('renders title and value correctly', () => {
    render(
      <KPICard
        title="Total Patients"
        value={150}
        format="number"
      />
    );

    expect(screen.getByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(
      <KPICard
        title="Revenue"
        value={1500.50}
        format="currency"
      />
    );

    expect(screen.getByText(/R\$.*1\.500,50/i)).toBeInTheDocument();
  });

  it('formats percentage correctly', () => {
    render(
      <KPICard
        title="Growth"
        value={25.5}
        format="percentage"
      />
    );

    expect(screen.getByText('25.5%')).toBeInTheDocument();
  });
});
```

### 4. E2E Tests (Playwright)

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should load dashboard with KPIs', async ({ page }) => {
    await page.goto('/reports');

    // Check if KPI cards are visible
    await expect(page.getByText('Pacientes Hoje')).toBeVisible();
    await expect(page.getByText('Faturamento (Mês)')).toBeVisible();

    // Check if charts are rendered
    await expect(page.locator('.recharts-responsive-container')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/reports');

    // Click on Financial tab
    await page.click('button:has-text("Financeiro")');
    await expect(page.getByText('Faturamento Anual')).toBeVisible();

    // Click on Clinical tab
    await page.click('button:has-text("Clínico")');
    await expect(page.getByText('Sessões (Mês)')).toBeVisible();
  });
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm test -- --testPathPattern=tests/services

# Run integration tests
npm test -- --testPathPattern=tests/api

# Run component tests
npm test -- --testPathPattern=tests/components

# Run E2E tests
npm run test:e2e

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Test Configuration

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Performance Testing

### Lighthouse CI
```bash
# Install
npm install -g @lhci/cli

# Run audit
lhci autorun --config=lighthouserc.json
```

### lighthouserc.json
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/reports"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: playwright-report/
```

## Best Practices

1. **Test Coverage Goals**
   - Services: >80%
   - Utils: 100%
   - Components: >70%
   - API Routes: >90%

2. **Naming Conventions**
   - Test files: `*.test.ts` or `*.spec.ts`
   - Describe blocks: Component/function name
   - Test names: Should be descriptive sentences

3. **Mocking**
   - Mock external services (Supabase, APIs)
   - Use factories for test data
   - Avoid mocking internal functions

4. **Assertions**
   - One assertion per test (when possible)
   - Use descriptive error messages
   - Test both success and failure cases

5. **Cleanup**
   - Reset mocks after each test
   - Clear database state in integration tests
   - Close connections properly
