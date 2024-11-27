"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from 'next/navigation';
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, Heart, MessageSquare } from "lucide-react";
import api from "@/lib/api";

const BlogDetailsPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [blog, setBlog] = useState<any>(null);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/blogs/${blogId}`);
      if (res?.data?.success) {
        setBlog(res?.data?.data);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      return;
    }
    fetchBlogDetails();
  }, [session, blogId]);

  if (!session || loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircleIcon className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Blog Details</h2>
      {blog && (
        <Card>
          <CardHeader>
            <CardTitle>{blog?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{blog?.content}</p>
          </CardContent>
          <div className="flex justify-between p-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BlogDetailsPage;