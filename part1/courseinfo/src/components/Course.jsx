function Header({ name }) {
  return <h1>{name}</h1>;
}

function Content({ parts }) {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  );
}

function Part({ part }) {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
}

function Total({ parts }) {
  const total = parts.reduce((acc, { exercises }) => acc + exercises, 0);
  return (
    <p>
      <strong>total of {total} exercises</strong>
    </p>
  );
}

function Course({ course }) {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
}

export default Course;
