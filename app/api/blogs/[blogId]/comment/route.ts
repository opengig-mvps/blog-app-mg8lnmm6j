import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type CommentRequestBody = {
  content: string;
};

export async function POST(
  request: Request,
  { params }: { params: { blogId: string, userId: string } }
) {
  try {
    const blogId = parseInt(params.blogId, 10);
    const userId = parseInt(params.userId, 10);

    if (isNaN(blogId) || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid blog ID or user ID' }, { status: 400 });
    }

    const body: CommentRequestBody = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid comment content' }, { status: 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        blogId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment added successfully!',
      data: {
        id: comment.id,
        blogId: comment.blogId,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}