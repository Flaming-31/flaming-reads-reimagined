import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/lib/blog";
import { format } from "date-fns";

const posts = getAllBlogPosts();

const Blog = () => {
  return (
    <section className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.4em] text-primary mb-4">Journal</p>
          <h1 className="font-playfair text-4xl font-bold mb-4">Flaming Books Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Curated reflections, reading guides, and ministry resources straight from the Flaming books team.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="card-shadow h-full flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="text-sm text-primary font-medium mb-2">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </div>
                <h2 className="font-playfair text-2xl font-bold mb-3">{post.title}</h2>
                {post.author && (
                  <p className="text-sm text-muted-foreground mb-3">By {post.author}</p>
                )}
                <p className="text-muted-foreground flex-1">{post.excerpt}</p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button className="mt-6 w-full" asChild>
                  <Link to={`/blog/${post.slug}`}>Read Article</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
