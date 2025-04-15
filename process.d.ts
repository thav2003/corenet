declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_NETWORK: WalletAdapterNetwork;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
  }
}
