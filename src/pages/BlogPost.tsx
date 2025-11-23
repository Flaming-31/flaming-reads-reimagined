import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogPostBySlug } from "@/lib/blog";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getBlogPostBySlug(slug) : null;

  if (!post) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-sm uppercase tracking-[0.4em] text-primary mb-4">Blog</p>
        <h1 className="font-playfair text-4xl font-bold mb-4">Article not found</h1>
        <p className="text-muted-foreground mb-6 max-w-xl">
          The article you are looking for might have been unpublished. Please browse the latest stories from our blog.
        </p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.4em] text-primary mb-4">Journal</p>
          <h1 className="font-playfair text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-muted-foreground text-sm space-x-4">
            <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
            {post.author && <span>• Written by {post.author}</span>}
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {post.image && (
          <div className="mb-10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[360px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        <Card className="card-shadow">
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-8">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Enjoyed this article?</p>
          <Button asChild>
            <Link to="/blog">Discover more stories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
