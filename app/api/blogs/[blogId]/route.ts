import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type BlogRequestBody = {
  tags?: string[];
  title: string;
  content: string;
};

export async function GET(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const blogId = parseInt(params.blogId, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, message: 'Invalid blog ID' }, { status: 400 });
    }

    const blog = await prisma.blog.findFirst({
      where: { id: blogId },
      include: {
        comments: {
          select: {
            id: true,
            userId: true,
            content: true,
            createdAt: true,
          },
        },
        likes: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }

    const likesCount = blog.likes.length;

    const responseData = {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      authorId: blog.authorId,
      comments: blog.comments,
      likes: likesCount,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Blog fetched successfully!',
      data: responseData,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { blogId: string, userId: string } }
) {
  try {
    const blogId = parseInt(params.blogId, 10);
    const userId = parseInt(params.userId, 10);

    if (isNaN(blogId) || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid blog ID or user ID' }, { status: 400 });
    }

    const body: BlogRequestBody = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const blog = await prisma.blog.findFirst({
      where: { id: blogId, authorId: userId },
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found or does not belong to user' }, { status: 404 });
    }

    const updatedBlog = await prisma.blog.updateMany({
      where: { id: blogId, authorId: userId },
      data: { title, content, updatedAt: new Date() },
    });

    if (updatedBlog.count === 0) {
      return NextResponse.json({ success: false, message: 'Failed to update blog' }, { status: 500 });
    }

    const fullBlog = await prisma.blog.findFirst({
      where: { id: blogId },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully!',
      data: {
        id: fullBlog?.id,
        title: fullBlog?.title,
        content: fullBlog?.content,
        authorId: fullBlog?.authorId,
        createdAt: fullBlog?.createdAt.toISOString(),
        updatedAt: fullBlog?.updatedAt.toISOString(),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const blogId = parseInt(params.blogId, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, message: 'Invalid blog ID' }, { status: 400 });
    }

    const blog = await prisma.blog.findFirst({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }

    await prisma.blog.delete({
      where: { id: blogId },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully!',
      data: {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        authorId: blog.authorId,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}