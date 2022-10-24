import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    removeBlogById(state, action) {
      const id = action.payload;
      return state.filter((blog) => {
        return blog.id !== id;
      });
    },
    appendUpdatedBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) => {
        return blog.id !== updatedBlog.id ? blog : updatedBlog;
      });
    },
  },
});

export const { appendBlog, setBlogs, removeBlogById, appendUpdatedBlog } =
  blogSlice.actions;

export const createBlog = (blogObject) => {
  return async (dispatch, getState) => {
    const newBlog = await blogService.create(blogObject);
    dispatch(appendBlog(newBlog));
  };
};

export const deleteBlogById = (id) => {
  return async (dispatch, getState) => {
    await blogService.remove(id);
    dispatch(removeBlogById(id));
  };
};

export const addLikeToBlog = (id) => {
  return async (dispatch, getState) => {
    const blogObjectToBeUpdated = getState().blogs.find((blog) => {
      return blog.id === id;
    });
    const newBlogObject = {
      ...blogObjectToBeUpdated,
      likes: blogObjectToBeUpdated.likes + 1,
    };
    const updatedBlogObject = await blogService.update(newBlogObject);
    dispatch(appendUpdatedBlog(updatedBlogObject));
  };
};

export const initBlogs = () => {
  return async (dispatch, getState) => {
    const blogs = await blogService.getAll();
    dispatch(
      setBlogs(
        blogs.map((blog) => {
          return {
            id: blog.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes,
            user: blog.user.id,
          };
        })
      )
    );
  };
};

export default blogSlice.reducer;
