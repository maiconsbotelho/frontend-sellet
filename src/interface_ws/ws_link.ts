export const WS_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL === 'production'
    ? 'https://api.selletesmalteria.com.br'
    : 'https://api.selletesmalteria.com.br'; // ou outro para homologação
