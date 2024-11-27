import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { blogId: string; userId: string } }
) {
  try {
    const blogId = parseInt(params.blogId, 10);
    const userId = parseInt(params.userId, 10);

    if (isNaN(blogId) || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid blog ID or user ID' }, { status: 400 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        blogId,
        userId,
      },
    });

    if (existingLike) {
      return NextResponse.json({ success: false, message: 'Blog already liked by the user' }, { status: 400 });
    }

    await prisma.like.create({
      data: {
        blogId,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog liked successfully!',
      data: { blogId, userId },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error liking blog:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}