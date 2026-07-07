// Configuração central do Google AdSense.
//
// Enquanto ADSENSE_CLIENT_ID estiver vazio, NENHUM anúncio é exibido —
// o componente AdSlot simplesmente não renderiza nada. Isso é proposital:
// você só preenche isso depois que sua conta for APROVADA pelo Google.
//
// Como preencher depois da aprovação:
// 1. No painel do AdSense, vá em Anúncios > Por unidade de anúncio > Criar.
// 2. Copie o "client" (algo como "ca-pub-1234567890123456") e cole abaixo.
// 3. Para cada bloco de anúncio criado, copie o "slot" (um número) e
//    preencha no lugar correspondente.
export const ADSENSE_CLIENT_ID = ''; // ex: 'ca-pub-1234567890123456'

export const AD_SLOTS = {
  toolBottom: '', // anúncio abaixo da ferramenta/artigo
  homeMiddle: '', // anúncio no meio da home
};
