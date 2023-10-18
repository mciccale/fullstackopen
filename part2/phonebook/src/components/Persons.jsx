function Persons({ persons, filter }) {
  return (
    <>
      {persons
        .filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase()))
        .map((person) => (
          <span key={person.name}>
            {person.name} {person.number}
            <br />
          </span>
        ))}
    </>
  );
}

export default Persons;
