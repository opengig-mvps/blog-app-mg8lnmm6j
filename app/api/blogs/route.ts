import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type BlogRequestBody = {
  tags?: string[];
  title: string;
  content: string;
};

export async function POST(request: Request) {
  try {
    const body: BlogRequestBody = await request.json();

    const { title, content, tags } = body;
    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Title and content are required' }, { status: 400 });
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: 123, // Assuming a fixed authorId for this example
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully!',
      data: {
        id: newBlog.id,
        title: newBlog.title,
        content: newBlog.content,
        authorId: newBlog.authorId,
        createdAt: newBlog.createdAt.toISOString(),
        updatedAt: newBlog.updatedAt.toISOString(),
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blogs fetched successfully!',
      data: blogs,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: error,
    }, { status: 500 });
  }
}