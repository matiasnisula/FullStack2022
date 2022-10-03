import blogs from "../services/blogs";

const CreateNewBlogForm = (props) => {

    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        props.setBlog({
            ...props.blog,
            [name]: value
        });
    }
    
    return (
        <form onSubmit={props.handleSubmit}>
          <div>
            title:
              <input 
              type="text"
              value={props.blog.title}
              name="title"
              onChange={handleInputChange}
              />
          </div>
          <div>
            author:
              <input 
              type="text"
              value={props.blog.author}
              name="author"
              onChange={handleInputChange}
              />
          </div>
          <div>
            url:
              <input 
              type="text"
              value={props.blog.url}
              name="url"
              onChange={handleInputChange}
              />
          </div>
          <button type="submit">Create</button>
        </form>
      );
}

export default CreateNewBlogForm; 