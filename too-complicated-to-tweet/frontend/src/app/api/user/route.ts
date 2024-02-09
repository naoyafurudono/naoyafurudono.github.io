import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { name, email }: { name: string, email: string } = await req.json();
  try {
    await prisma.user.create({
      data: {
        name,
        email,
      },
    })
  } catch (err) {
    return NextResponse.json({
      status: 400,
      body: { message: "User not created" },
    });
  }
  return NextResponse.json({
    status: 200,
    body: { message: "User created" },
  });
}