import { useSelector } from "react-redux";
import Blog from "./Blog";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  if (blogs.length === 0) return;
  const sortedBlogs = [...blogs].sort((a, b) => {
    return b.likes - a.likes;
  });

  return (
    <div>
      <h2>Blogs</h2>
      {sortedBlogs.map((blog) => {
        return <Blog key={blog.id} blog={blog} showInfo={false} />;
      })}
    </div>
  );
};

export default BlogList;
