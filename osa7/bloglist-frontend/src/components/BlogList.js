import { useSelector } from "react-redux";
import Blog from "./Blog";

const BlogList = ({ updateBlog, deleteBlog, user }) => {
  const blogs = useSelector((state) => state.blogs);
  if (blogs.length === 0) return;
  const sortedBlogs = [...blogs].sort((a, b) => {
    return b.likes - a.likes;
  });

  return (
    <div>
      {sortedBlogs.map((blog) => {
        return (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            loggedUser={user}
          />
        );
      })}
    </div>
  );
};

export default BlogList;
