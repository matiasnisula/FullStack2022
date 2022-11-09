interface CoursePart {
  name: string;
  exerciseCount: number;
}

const Content = ({ courseParts }: { courseParts: Array<CoursePart>}) => {
  return (
    <>
      {courseParts.map((coursePart) => {
        return (
          <p key={coursePart.name}>
            {coursePart.name} {coursePart.exerciseCount}
          </p>
        );
      })}
    </>
  );
};

export default Content;