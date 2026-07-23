export { authService } from './auth.service';
export type { AuthState, Profile, AuthService } from './auth.service';

export { associadosService } from './associados.service';
export type { ListAssociadosParams } from '@/types/domain.types';

export { mensalidadesService } from './mensalidades.service';
export type { ListMensalidadesParams } from '@/types/domain.types';

export { pagamentosService } from './pagamentos.service';

export { profilesService } from './profiles.service';
export type { UserListItem } from './profiles.service';

export { configuracoesService, CONFIGURACAO_CHAVES } from './configuracoes.service';
export type { ConfiguracaoChave } from './configuracoes.service';

export { dashboardService } from './dashboard.service';

export { importacaoService } from './importacao.service';
