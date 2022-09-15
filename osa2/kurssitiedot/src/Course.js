const Header = (props) => {
    return (
      <h1>
        {props.name}
      </h1>
    )
  }
  
const Part = (props) => {
  return (
    <p>
      {props.name} {props.count}
    </p>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => {
        return (
        <Part key={part.id} name={part.name} count={part.exercises}/>
        )
      }
      )}
    </div>
  )
}

const Total = (props) => {
  const count = props.parts.reduce(
    (previous, current) => {
      return previous + current.exercises;
    }, 0
  );
  return (
    <p>
      <strong>
        total of exercises {count}
      </strong>
    </p>
  )
}



const Course = (props) => {
  return (
    <div>
      <Header name={props.course.name} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
    </div>
  )
};

export {
  Header,
  Part,
  Content,
  Total,
  Course
};