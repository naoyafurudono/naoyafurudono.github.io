import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id || typeof id !== "string") {
    return NextResponse.json({
      status: 400,
      body: { message: "User not created" },
    });
  }
  try {
    await prisma.user.create({
      data: {
        userID: id,
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
    body: { message: "User created", id: id },
  });
}