"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import Link from "next/link";

// Zod schema for blog creation
const blogSchema = z.object({
  title: z.string().min(1, "Blog title is required"),
  content: z.string().min(1, "Blog content is required"),
  tags: z.array(z.string()).optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const BlogsPage: React.FC = () => {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    if (!session) return;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/blogs`);
        setBlogs(res?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [session]);

  const onSubmit = async (data: BlogFormData) => {
    try {
      const response = await api.post(`/api/blogs`, data);

      if (response?.data?.success) {
        toast.success("Blog created successfully!");
        setBlogs((prevBlogs) => [...prevBlogs, response?.data?.data]);
        reset();
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleDelete = async () => {
    if (blogToDelete === null) return;
    try {
      const response = await api.delete(`/api/blogs/${blogToDelete}`);

      if (response?.data?.success) {
        toast.success("Blog deleted successfully!");
        setBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog?.id !== blogToDelete)
        );
        setShowDeleteDialog(false);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Your Blogs</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create New Blog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title</Label>
              <Input {...register("title")} placeholder="Enter blog title" />
              {errors?.title && (
                <p className="text-red-500 text-sm">{errors?.title?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea {...register("content")} placeholder="Blog content" />
              {errors?.content && (
                <p className="text-red-500 text-sm">
                  {errors?.content?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional, comma separated)</Label>
              <Input {...register("tags")} placeholder="e.g., tech, finance" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Creating Blog...
                </>
              ) : (
                "Create Blog"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <h3 className="text-xl font-bold mt-8 mb-4">Your Blogs</h3>
      {loading ? (
        <LoaderCircleIcon className="animate-spin w-6 h-6" />
      ) : (
        blogs?.map((blog: any) => (
          <Card key={blog?.id} className="mb-4">
            <CardHeader>
              <CardTitle>{blog?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{blog?.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Link href={`/dashboard/user/blogs/${blog?.id}/edit`}>
                <Button>Edit</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => {
                  setBlogToDelete(blog?.id);
                  setShowDeleteDialog(true);
                }}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogsPage;