import { mbParseDecimals } from "@/lib/strings";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { id, content, title } = await req.json();
  const authorId = mbParseDecimals(id)
  if (authorId === undefined) {
    return NextResponse.json({
      status: 400,
      body: { message: "invalid author id" },
    });
  }

  const data: Prisma.PostCreateInput = {
    content,
    title,
    author: {
      connect: { systemId: authorId }
    },
  }
  console.log(data)

  try {
    await prisma.post.create({
      data
    })
  } catch (err) {
    return NextResponse.json({
      status: 400,
      body: { message: "fail to save table", error: err.message },
    });
  }

}
