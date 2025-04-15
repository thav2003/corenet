import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { prisma } from "./prisma";

type SignMessage = {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;
};

export class SigninMessage {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;

  constructor({ domain, publicKey, nonce, statement }: SignMessage) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.nonce = nonce;
    this.statement = statement;
  }

  prepare() {
    return `${this.statement}${this.nonce}`;
  }

  async validate(signature: string) {
    const msg = this.prepare();
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(msg);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
        csrfToken: {
          label: "CSRF Token",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          if (signinMessage.nonce !== credentials?.csrfToken) {
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );

          if (!validationResult)
            throw new Error("Could not validate the signed message");

          // Check if wallet already exists
          const existingWallet = await prisma.wallet.findUnique({
            where: {
              address: signinMessage.publicKey,
            },
          });

          console.log(existingWallet);
          if (!existingWallet) {
            // Store new wallet
            await prisma.wallet.create({
              data: {
                address: signinMessage.publicKey,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.sub;
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
        session.user.address = token.sub;
        session.user.publicKey = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions);
