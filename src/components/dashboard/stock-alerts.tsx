/**
 * Stock Alerts Component
 * Displays low stock and expiring product alerts
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, PackageX, Calendar } from 'lucide-react';
import type { StockAlert } from '@/types/analytics';
import Link from 'next/link';

interface StockAlertsProps {
  lowStock?: StockAlert[];
  expiring?: StockAlert[];
}

export function StockAlerts({ lowStock = [], expiring = [] }: StockAlertsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Low Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageX className="h-5 w-5" />
            Estoque Baixo
          </CardTitle>
          <CardDescription>Produtos com quantidade mínima</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todos os produtos estão com estoque adequado</p>
            ) : (
              lowStock.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/inventory`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      Disponível: {alert.quantityAvailable} {alert.minStockAlert && `(mín: ${alert.minStockAlert})`}
                    </p>
                  </div>
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.severity === 'critical' ? 'Crítico' : 'Baixo'}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expiring Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Produtos Vencendo
          </CardTitle>
          <CardDescription>Validade próxima (30 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expiring.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum produto próximo ao vencimento</p>
            ) : (
              expiring.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/inventory`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.daysUntilExpiry !== undefined && alert.daysUntilExpiry <= 0
                        ? 'VENCIDO'
                        : `Vence em ${alert.daysUntilExpiry} dias`}
                      {alert.expiryDate && ` (${new Date(alert.expiryDate).toLocaleDateString('pt-BR')})`}
                    </p>
                  </div>
                  <Badge
                    variant={
                      alert.severity === 'critical'
                        ? 'destructive'
                        : alert.severity === 'warning'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className="mr-1 h-3 w-3" />
                    ) : null}
                    {alert.severity === 'critical' ? 'Vencido' : alert.severity === 'warning' ? 'Urgente' : 'Atenção'}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
