import { useSelector } from "react-redux";
import Blog from "./Blog";

const BlogList = ({ loggedUser }) => {
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
            id={blog.id}
            author={blog.author}
            title={blog.title}
            url={blog.url}
            likes={blog.likes}
            blogUserId={blog.user}
            loggedUser={loggedUser}
          />
        );
      })}
    </div>
  );
};

export default BlogList;
