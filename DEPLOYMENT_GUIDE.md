# 🚀 HarmoniFace - Deployment Guide

## Pre-Deployment Checklist

### 1. Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Environment variables documented

### 2. Security
- [ ] All API routes have authentication
- [ ] RLS policies enabled on all tables
- [ ] Secrets stored in environment variables
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (parameterized queries)

### 3. Performance
- [ ] Database indexes created
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Caching strategies implemented
- [ ] Lighthouse score >90

### 4. Monitoring
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Logging system in place
- [ ] Health check endpoint (`/api/health`)

---

## Option 1: Vercel (Recommended) ⭐

### Advantages
- ✅ Zero configuration for Next.js
- ✅ Automatic preview deployments
- ✅ Edge functions worldwide
- ✅ Built-in analytics
- ✅ Free tier sufficient for MVP

### Setup

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Link Project
```bash
vercel login
vercel link
```

#### 3. Configure Environment Variables
```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=your-groq-api-key
ADMIN_EMAIL=admin@harmoniface.com
RESEND_API_KEY=re_...
```

Add to Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Select Production, Preview, Development

#### 4. Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["gru1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=10, stale-while-revalidate=59"
        }
      ]
    }
  ]
}
```

### Custom Domain Setup
1. Go to Vercel Dashboard → Domains
2. Add custom domain: `harmoniface.com.br`
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## Option 2: Netlify

### Advantages
- ✅ Easy setup like Vercel
- ✅ Generous free tier
- ✅ Good for static sites

### Setup

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Deploy
```bash
netlify login
netlify init
netlify deploy --prod
```

#### 3. Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "https://your-project.supabase.co"
```

---

## Option 3: Railway

### Advantages
- ✅ Supports Docker
- ✅ Database + app in one place
- ✅ Affordable pricing

### Setup

#### 1. Create railway.json
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 2. Deploy
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

---

## Option 4: Docker + VPS

### Advantages
- ✅ Full control
- ✅ Cost-effective at scale
- ✅ No vendor lock-in

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  redis_data:
```

### Build and Deploy
```bash
# Build image
docker build -t harmoniface:latest .

# Run locally
docker-compose up

# Deploy to VPS
docker save harmoniface:latest | gzip | ssh user@vps 'gunzip | docker load'
ssh user@vps 'cd /app && docker-compose up -d'
```

---

## Supabase Setup

### 1. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note the URL and anon key

### 2. Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or manually via dashboard:
# Go to SQL Editor → paste migration content → Run
```

### 3. Configure Storage
```sql
-- Create storage bucket for patient photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('patient-photos', 'patient-photos', false);

-- RLS policy
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'patient-photos');

CREATE POLICY "Authenticated users can view"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'patient-photos');
```

### 4. Enable Extensions
```sql
-- pgvector for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

## Environment Variables Reference

### Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# AI Services
GROQ_API_KEY=gsk_...
```

### Optional
```env
# Admin
ADMIN_EMAIL=admin@harmoniface.com

# Email (Resend)
RESEND_API_KEY=re_...

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=prj_...

# Monitoring (Sentry)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...

# Redis (Production caching)
REDIS_URL=redis://localhost:6379
```

---

## SSL/HTTPS Configuration

### Option 1: Vercel/Netlify (Automatic)
- SSL certificates automatically provisioned via Let's Encrypt
- No configuration needed

### Option 2: Manual (Nginx + Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d harmoniface.com.br -d www.harmoniface.com.br

# Auto-renewal
sudo certbot renew --dry-run
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name harmoniface.com.br www.harmoniface.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name harmoniface.com.br www.harmoniface.com.br;

    ssl_certificate /etc/letsencrypt/live/harmoniface.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/harmoniface.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Monitoring & Maintenance

### 1. Health Check Endpoint
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Check database connection
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('patients').select('id').limit(1);
    
    if (error) throw error;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

### 2. Uptime Monitoring
- **UptimeRobot** (Free): Monitor `/api/health` endpoint
- **BetterUptime**: Advanced monitoring with status page
- **Cronitor**: Scheduled task monitoring

### 3. Error Tracking (Sentry)
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### 4. Database Backups
```bash
# Supabase automatic backups (Pro plan)
# Or manual backup:
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Restore
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

### 5. Scheduled Tasks (Cron Jobs)
```bash
# Vercel Cron (vercel.json)
{
  "crons": [
    {
      "path": "/api/notifications?action=process_due_reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/maintenance/cleanup",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

---

## Post-Deployment Checklist

### Immediately After Deploy
- [ ] Verify site loads at production URL
- [ ] Test authentication flow
- [ ] Create test patient record
- [ ] Test CRUD operations
- [ ] Verify file uploads work
- [ ] Check email notifications
- [ ] Test report generation
- [ ] Verify AI features work
- [ ] Check mobile responsiveness

### Week 1
- [ ] Monitor error rates
- [ ] Review performance metrics
- [ ] Check database query times
- [ ] Verify backups are running
- [ ] Test recovery procedures
- [ ] Collect user feedback
- [ ] Fix critical bugs

### Monthly
- [ ] Review analytics
- [ ] Check database growth
- [ ] Optimize slow queries
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] Backup validation

---

## Rollback Procedure

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

### Docker
```bash
# Keep previous images
docker tag harmoniface:latest harmoniface:backup

# Rollback
docker-compose down
docker tag harmoniface:backup harmoniface:latest
docker-compose up -d
```

---

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs

### Community
- GitHub Issues: https://github.com/yourrepo/harmoniface/issues
- Discord: (create community server)

### Professional Support
- Email: support@harmoniface.com
- Response Time: 24-48 hours

---

## Estimated Costs (Monthly)

### Free Tier (MVP)
- Vercel: Free (Hobby plan)
- Supabase: Free (500MB database, 1GB bandwidth)
- Groq API: Free (14,400 requests/day)
- **Total: R$ 0/month** ✅

### Production (Small Clinic)
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Groq API: Free tier sufficient
- Domain: ~R$ 40/year
- **Total: ~$45/month (~R$ 225/month)**

### Scale (Multiple Clinics)
- Vercel Enterprise: $40/month
- Supabase Pro + Add-ons: $50/month
- OpenAI API: ~$30/month
- Redis Cloud: $15/month
- **Total: ~$135/month (~R$ 675/month)**

---

## Deployment Complete! 🎉

Your HarmoniFace CRM is now live and ready to transform your aesthetic clinic operations.

**Next Steps:**
1. Import initial data (procedures catalog)
2. Create first user account
3. Configure notification templates
4. Test all workflows
5. Train staff on system usage
6. Launch! 🚀
