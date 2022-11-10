import { CoursePart } from "../types";

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
  switch (coursePart.type) {
    case "normal":
      return (
        <>
          <p>
            <strong>
              {coursePart.name} {coursePart.exerciseCount}
            </strong>
          </p>
          <p>{coursePart.description}</p>
        </>
      );
    case "groupProject":
      return (
        <>
          <p>
            <strong>
              {coursePart.name} {coursePart.exerciseCount}
            </strong>
          </p>
          <p>project exercises {coursePart.groupProjectCount}</p>
        </>
      );
    case "submission":
      return (
        <>
          <p>
            <strong>
              {coursePart.name} {coursePart.exerciseCount}
            </strong>
          </p>
          <p>{coursePart.description}</p>
          <p>submit to {coursePart.exerciseSubmissionLink}</p>
        </>
      );
    case "special":
      return (
        <>
          <strong>
            {coursePart.name} {coursePart.exerciseCount}
          </strong>
          <p>{coursePart.description}</p>
          <p>required skills: {coursePart.requirements.join(", ")}</p>
        </>
      );
    default:
      return assertNever(coursePart);
  }
};

const Content = ({ courseParts }: { courseParts: Array<CoursePart> }) => {
  return (
    <div>
      {courseParts.map((coursePart) => {
        return <Part key={coursePart.name} coursePart={coursePart} />;
      })}
    </div>
  );
};

export default Content;
