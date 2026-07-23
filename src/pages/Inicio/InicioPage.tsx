import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROLE_LABELS, ROUTES } from '@/constants';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { dashboardService } from '@/services/dashboard.service';
import type { DashboardResumo } from '@/types/domain.types';
import { formatCurrency } from '@/utils/formatters';

import styles from './InicioPage.module.css';

const LOADING_CARDS = 6;

export function InicioPage() {
  const { user, profile, role, isBackendConfigured } = useAuth();
  const { can } = usePermission();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumo, setResumo] = useState<DashboardResumo | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getResumo();
      setResumo(data);
    } catch (err) {
      const message =
        AppError.isAppError(err) && err.code === ERROR_CODES.BACKEND_NOT_CONFIGURED
          ? err.userMessage
          : 'Não foi possível carregar os dados do dashboard.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const displayName = profile?.nome ?? user?.email ?? 'Usuário';
  const displayRole = role ? ROLE_LABELS[role] : null;

  const hasMensalidadesWrite = can('mensalidades.write');
  const hasAssociadosWrite = can('associados.write');
  const hasRelatoriosView = can('relatorios.view');

  return (
    <PageContainer>
      <main aria-label="Dashboard">
        {/* Greeting */}
        <div className={styles.greeting}>
          <SectionTitle
            as="h1"
            title={`Olá, ${displayName}`}
            {...(displayRole ? { subtitle: `Perfil: ${displayRole}` } : {})}
          />
        </div>

        {/* Loading */}
        {loading && (
          <section aria-label="Carregando dados" aria-busy="true">
            <SectionTitle as="h2" title="Resumo" />
            <div className={styles.cardGrid}>
              {Array.from({ length: LOADING_CARDS }).map((_, index) => (
                <Card key={`skeleton-${index}`} loading>
                  <Skeleton height={14} width="60%" />
                  <Skeleton height={32} width="50%" />
                  <Skeleton height={12} width="40%" />
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Error */}
        {!loading && error && (
          <EmptyState
            variant="error"
            title="Erro ao carregar dados"
            description={error}
            action={{ label: 'Tentar novamente', onClick: fetchData }}
          />
        )}

        {/* Empty — backend não configurado */}
        {!loading && !error && !resumo && (
          <EmptyState
            variant="first-use"
            title="Backend não configurado"
            description="Configure as variáveis de ambiente do Supabase para visualizar os dados reais."
          />
        )}

        {/* Empty — sem dados */}
        {!loading && !error && resumo && !isBackendConfigured && (
          <EmptyState
            variant="first-use"
            title="Bem-vindo ao ABSB"
            description="Configure o backend para começar a gerenciar associados e mensalidades."
          />
        )}

        {/* Success */}
        {!loading && !error && resumo && isBackendConfigured && (
          <section aria-label="Resumo">
            <SectionTitle as="h2" title="Resumo" />

            <div className={styles.cardGrid}>
              {hasAssociadosWrite && (
                <Card
                  category="blue"
                  title="Associados ativos"
                  value={resumo.totalAssociadosAtivos}
                  ariaLabel={`${resumo.totalAssociadosAtivos} associados ativos`}
                />
              )}

              {hasMensalidadesWrite && (
                <>
                  <Card
                    category="green"
                    title="Pagas no mês"
                    value={
                      <>
                        {resumo.totalPagasNoMes}{' '}
                        <Badge variant="success" showDot>
                          {formatCurrency(resumo.valorPagoNoMes)}
                        </Badge>
                      </>
                    }
                    ariaLabel={`${resumo.totalPagasNoMes} mensalidades pagas no mês, totalizando ${formatCurrency(resumo.valorPagoNoMes)}`}
                  />

                  <Card
                    category="yellow"
                    title="Em aberto"
                    value={
                      <>
                        {resumo.totalMensalidadesEmAberto}{' '}
                        <Badge variant="warning" showDot>
                          {formatCurrency(resumo.valorEmAberto)}
                        </Badge>
                      </>
                    }
                    ariaLabel={`${resumo.totalMensalidadesEmAberto} mensalidades em aberto, totalizando ${formatCurrency(resumo.valorEmAberto)}`}
                  />

                  <Card
                    category="red"
                    title="Vencidas"
                    value={resumo.totalVencidas}
                    ariaLabel={`${resumo.totalVencidas} mensalidades vencidas`}
                  />
                </>
              )}
            </div>
          </section>
        )}

        {/* Empty state quando todos os valores são zero */}
        {!loading && !error && resumo && isBackendConfigured && (
          (() => {
            const allZero =
              resumo.totalAssociadosAtivos === 0 &&
              resumo.totalMensalidadesEmAberto === 0 &&
              resumo.totalPagasNoMes === 0 &&
              resumo.totalVencidas === 0;
            if (!allZero) return null;
            return (
              <EmptyState
                variant="first-use"
                title="Nenhum dado encontrado"
                description="Adicione o primeiro associado para começar a gerenciar a associação."
                {...(hasAssociadosWrite
                  ? {
                      action: {
                        label: 'Adicionar associado',
                        onClick: () => navigate(ROUTES.ASSOCIADOS),
                      },
                    }
                  : {})}
              />
            );
          })()
        )}

        {/* Ações rápidas */}
        {!loading && !error && resumo && (
          <section aria-label="Ações rápidas">
            <SectionTitle as="h2" title="Ações rápidas" />
            <div className={styles.cardGrid}>
              {hasAssociadosWrite && (
                <Card
                  category="blue"
                  title="Associados"
                  subtitle="Gerenciar cadastro"
                  onClick={() => navigate(ROUTES.ASSOCIADOS)}
                  ariaLabel="Ir para gestão de associados"
                />
              )}
              {hasMensalidadesWrite && (
                <Card
                  category="green"
                  title="Mensalidades"
                  subtitle="Controle financeiro"
                  onClick={() => navigate(ROUTES.MENSALIDADES)}
                  ariaLabel="Ir para mensalidades"
                />
              )}
              {hasRelatoriosView && (
                <Card
                  category="yellow"
                  title="Relatórios"
                  subtitle="Exportar dados"
                  onClick={() => navigate(ROUTES.RELATORIOS)}
                  ariaLabel="Ir para relatórios"
                />
              )}
            </div>
          </section>
        )}
      </main>
    </PageContainer>
  );
}
