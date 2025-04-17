// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/agendamento', // Rota local
        destination: 'https://api-mock.maiconbotelho.com.br/api/agendamento', // API real
      },
    ];
  },
};

module.exports = nextConfig;
