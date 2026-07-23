import { useCallback, useEffect, useState } from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ROUTES, ROLE_LABELS, PERMISSIONS, type Role } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { profilesService, type UserListItem } from '@/services/profiles.service';
import { configuracoesService, CONFIGURACAO_CHAVES } from '@/services/configuracoes.service';
import type { Configuracao } from '@/types/domain.types';
import { useNavigate } from 'react-router-dom';

import styles from './ConfiguracoesPage.module.css';

type ConfigFormState = Record<string, string>;

export function ConfiguracoesPage() {
  const { user, profile, role, isBackendConfigured, signOut } = useAuth();
  const { can } = usePermission();
  const { theme, resolved, setTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const canManageUsers = can(PERMISSIONS.USUARIOS_MANAGE);
  const canManageConfig = can(PERMISSIONS.CONFIGURACOES_MANAGE);

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [configForm, setConfigForm] = useState<ConfigFormState>({});
  const [configSaving, setConfigSaving] = useState(false);

  const displayName = profile?.nome ?? user?.email ?? 'Usuário';
  const displayRole = role ? ROLE_LABELS[role] : 'sem papel';

  const loadUsers = useCallback(async () => {
    if (!canManageUsers || !isBackendConfigured) return;
    setUsersLoading(true);
    setUsersError(null);
    try {
      const result = await profilesService.list({ pageSize: 100 });
      setUsers(result.items);
    } catch {
      setUsersError('Erro ao carregar usuários.');
    } finally {
      setUsersLoading(false);
    }
  }, [canManageUsers, isBackendConfigured]);

  const loadConfig = useCallback(async () => {
    if (!canManageConfig || !isBackendConfigured) return;
    setConfigLoading(true);
    setConfigError(null);
    try {
      const data = await configuracoesService.list();
      setConfiguracoes(data);
      const form: ConfigFormState = {};
      for (const cfg of data) {
        form[cfg.chave] = typeof cfg.valor === 'string' ? cfg.valor : JSON.stringify(cfg.valor ?? '');
      }
      setConfigForm(form);
    } catch {
      setConfigError('Erro ao carregar configurações.');
    } finally {
      setConfigLoading(false);
    }
  }, [canManageConfig, isBackendConfigured]);

  useEffect(() => {
    loadUsers();
    loadConfig();
  }, [loadUsers, loadConfig]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!canManageUsers) return;
    try {
      await profilesService.updateRole(userId, newRole as Role);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as Role } : u)),
      );
      toast.success('Papel alterado com sucesso.');
    } catch {
      toast.error('Erro ao alterar papel.');
    }
  };

  const handleToggleAtivo = async (userId: string, currentAtivo: boolean) => {
    if (!canManageUsers) return;
    try {
      await profilesService.setAtivo(userId, !currentAtivo);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ativo: !currentAtivo } : u)),
      );
      toast.success(currentAtivo ? 'Usuário desativado.' : 'Usuário ativado.');
    } catch {
      toast.error('Erro ao alterar status do usuário.');
    }
  };

  const handleConfigChange = (chave: string, value: string) => {
    setConfigForm((prev) => ({ ...prev, [chave]: value }));
  };

  const handleSaveConfig = async () => {
    if (!canManageConfig) return;
    setConfigSaving(true);
    try {
      for (const chave of Object.keys(configForm)) {
        const valor = configForm[chave];
        let parsed: unknown = valor;
        if (valor !== '' && !isNaN(Number(valor))) {
          parsed = Number(valor);
        }
        await configuracoesService.upsert(chave, { valor: parsed });
      }
      toast.success('Configurações salvas com sucesso.');
      await loadConfig();
    } catch {
      toast.error('Erro ao salvar configurações.');
    } finally {
      setConfigSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.info('Você saiu da conta.');
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const configFields: { chave: string; label: string }[] = [
    { chave: CONFIGURACAO_CHAVES.ASSOCIACAO_NOME, label: 'Nome da Associação' },
    { chave: CONFIGURACAO_CHAVES.ASSOCIACAO_CNPJ, label: 'CNPJ' },
    { chave: CONFIGURACAO_CHAVES.MENSALIDADE_VALOR_PADRAO, label: 'Valor Padrão Mensalidade' },
    { chave: CONFIGURACAO_CHAVES.MENSALIDADE_VENCIMENTO_DIA, label: 'Dia de Vencimento' },
    { chave: CONFIGURACAO_CHAVES.SUPORTE_EMAIL, label: 'E-mail de Suporte' },
    { chave: CONFIGURACAO_CHAVES.SUPORTE_TELEFONE, label: 'Telefone de Suporte' },
  ];

  return (
    <PageContainer>
      <div className={styles.page}>
        <SectionTitle
          as="h1"
          title="Configurações"
          subtitle="Perfil, conta e configurações do sistema"
        />

        <section className={styles.section} aria-labelledby="section-perfil">
          <div id="section-perfil">
            <SectionTitle as="h2" title="Meu Perfil" />
          </div>
          <div className={styles.cardGrid}>
            <Card
              category="blue"
              title={displayName}
              subtitle={user?.email ?? 'Sessão ativa'}
              value={displayRole}
              caption={profile?.ativo === false ? 'Conta desabilitada' : 'Sessão autenticada'}
            />
          </div>
        </section>

        {canManageUsers && (
          <section className={styles.section} aria-labelledby="section-usuarios">
            <div id="section-usuarios">
              <SectionTitle as="h2" title="Gestão de Usuários" />
            </div>

            {usersLoading && (
              <div className={styles.info} role="status" aria-busy="true">
                Carregando usuários...
              </div>
            )}

            {usersError && (
              <div className={styles.info} role="alert">
                {usersError}
              </div>
            )}

            {!usersLoading && !usersError && users.length === 0 && (
              <div className={styles.info}>
                {isBackendConfigured
                  ? 'Nenhum usuário encontrado.'
                  : 'Supabase não configurado. Usuários indisponíveis.'}
              </div>
            )}

            {!usersLoading && !usersError && users.length > 0 && (
              <div className={styles.userList} role="list">
                {users.map((u) => (
                  <div key={u.id} className={styles.userCard} role="listitem">
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>
                        {u.nome || 'Sem nome'}
                        {u.id === user?.id && ' (você)'}
                      </span>
                      <span className={styles.userEmail}>{u.email || 'Sem e-mail'}</span>
                    </div>

                    <div className={styles.userActions}>
                      <Badge variant={u.ativo ? 'success' : 'danger'} showDot>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>

                      {u.id !== user?.id && (
                        <>
                          <select
                            className={styles.roleSelect}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            aria-label={`Papel de ${u.nome || u.email}`}
                          >
                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>

                          <Button
                            variant={u.ativo ? 'secondary' : 'primary'}
                            onClick={() => handleToggleAtivo(u.id, u.ativo)}
                            aria-label={u.ativo ? `Desativar ${u.nome}` : `Ativar ${u.nome}`}
                          >
                            {u.ativo ? 'Desativar' : 'Ativar'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {canManageConfig && (
          <section className={styles.section} aria-labelledby="section-config">
            <div id="section-config">
              <SectionTitle as="h2" title="Configurações da Associação" />
            </div>

            {configLoading && (
              <div className={styles.info} role="status" aria-busy="true">
                Carregando configurações...
              </div>
            )}

            {configError && (
              <div className={styles.info} role="alert">
                {configError}
              </div>
            )}

            {!configLoading && !configError && (
              <>
                <div className={styles.configGrid}>
                  {configFields.map(({ chave, label }) => (
                    <div key={chave} className={styles.configItem}>
                      <label className={styles.configLabel} htmlFor={`config-${chave}`}>
                        {label}
                      </label>
                      <Input
                        id={`config-${chave}`}
                        value={configForm[chave] ?? ''}
                        onChange={(e) => handleConfigChange(chave, e.target.value)}
                        placeholder={label}
                        disabled={!isBackendConfigured}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  onClick={handleSaveConfig}
                  disabled={!isBackendConfigured || configSaving}
                  fullWidth
                >
                  {configSaving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </>
            )}
          </section>
        )}

        {!canManageConfig && (
          <section className={styles.section} aria-labelledby="section-config-view">
            <div id="section-config-view">
              <SectionTitle as="h2" title="Configurações da Associação" />
            </div>

            {configLoading && (
              <div className={styles.info} role="status" aria-busy="true">
                Carregando configurações...
              </div>
            )}

            {!configLoading && configuracoes.length === 0 && (
              <div className={styles.info}>
                {isBackendConfigured
                  ? 'Nenhuma configuração encontrada.'
                  : 'Supabase não configurado. Configurações indisponíveis.'}
              </div>
            )}

            {!configLoading && configuracoes.length > 0 && (
              <div className={styles.configGrid}>
                {configFields.map(({ chave, label }) => {
                  const cfg = configuracoes.find((c) => c.chave === chave);
                  const valor = cfg?.valor;
                  return (
                    <div key={chave} className={styles.configItem}>
                      <span className={styles.configLabel}>{label}</span>
                      <span className={valor ? styles.configValue : styles.configValueEmpty}>
                        {valor != null && valor !== '' ? String(valor) : 'Não definido'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <section className={styles.section} aria-labelledby="section-tema">
          <div id="section-tema">
            <SectionTitle as="h2" title="Aparência" subtitle="Alternar entre tema claro e escuro" />
          </div>

          <ThemeToggle theme={theme} resolved={resolved} onThemeChange={setTheme} />
        </section>

        <section className={styles.section} aria-labelledby="section-conta">
          <div id="section-conta">
            <SectionTitle as="h2" title="Conta" />
          </div>

          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={!isBackendConfigured}
            fullWidth
          >
            Sair da conta
          </Button>
        </section>
      </div>
    </PageContainer>
  );
}
