// export const WS_BASE = verificaIsProd() ? "https://localhost:3000/" : "https://selletesmalteria.com.br/";

// export function verificaIsProd(): boolean {
//   return false;
// }

export const WS_BASE = process.env.NEXT_PUBLIC_API_URL;
