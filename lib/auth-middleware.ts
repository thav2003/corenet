import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";
import { User, Wallet } from "@prisma/client";

export interface AuthData {
  wallet: Wallet;
  user: User;
}

// Xóa các hằng số không sử dụng
// const TEST_WALLET_ADDRESS = "test-wallet-address";
// const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

export async function getAuthUser(): Promise<AuthData | null> {
  // Lấy thông tin từ session
  const session = await getServerSession();
  if (!session?.user?.address) {
    return null;
  }
  
  const walletAddress = session.user.address;
  
  // Tìm wallet theo địa chỉ
  const wallet = await prisma.wallet.findUnique({
    where: { address: walletAddress },
  });

  if (!wallet) {
    return null;
  }

  // Tìm user liên kết với wallet
  const user = await prisma.user.findUnique({
    where: { walletId: wallet.id },
  });

  // Nếu chưa có user, tạo mới
  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        walletId: wallet.id,
      }
    });
    return { wallet, user: newUser };
  }

  return { wallet, user };
}
// export async function getAuthUser(): Promise<AuthData | null> {
//   let walletAddress: string | undefined;
  
//   // Trong môi trường phát triển, cho phép sử dụng địa chỉ ví test
//   if (IS_DEVELOPMENT) {
//     walletAddress = TEST_WALLET_ADDRESS;
//   } else {
//     // Trong môi trường production, lấy từ session
//     const session = await getServerSession();
//     if (!session?.user?.address) {
//       return null;
//     }
//     walletAddress = session.user.address;
//   }
  
//   // Tìm wallet theo địa chỉ
//   const wallet = await prisma.wallet.findUnique({
//     where: { address: walletAddress },
//   });

//   if (!wallet) {
//     return null;
//   }

//   // Tìm user liên kết với wallet
//   const user = await prisma.user.findUnique({
//     where: { walletId: wallet.id },
//   });

//   // Nếu chưa có user, tạo mới
//   if (!user) {
//     const newUser = await prisma.user.create({
//       data: {
//         walletId: wallet.id,
//       }
//     });
//     return { wallet, user: newUser };
//   }

//   return { wallet, user };
// }

export function withAuth<T>(
  handler: (req: NextRequest, context: { params: T }, authData: AuthData) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params: T }) => {
    const authData = await getAuthUser();
    
    if (!authData) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return handler(req, context, authData);
  };
} 