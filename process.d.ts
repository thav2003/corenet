declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_NETWORK: WalletAdapterNetwork;
    NEXT_PUBLIC_BACKEND_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
  }
}
