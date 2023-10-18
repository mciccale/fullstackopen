function Persons({ persons, filter, deletePerson }) {
  return (
    <>
      {persons
        .filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase()))
        .map((person) => (
          <span key={person.name}>
            {person.name} {person.number}{' '}
            <button onClick={() => deletePerson(person.id)}>delete</button>
            <br />
          </span>
        ))}
    </>
  );
}

export default Persons;
