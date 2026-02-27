/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    // Otimiza imports de bibliotecas grandes: tree-shaking automático
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-popover',
      '@radix-ui/react-dropdown-menu'
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60
  },
  // Compressão automática de respostas
  compress: true,
  // Remover logs de console em produção via compilação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

export default nextConfig;
