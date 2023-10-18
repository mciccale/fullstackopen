function PersonForm({
  registerPerson,
  handleNewName,
  handleNewNumber,
  newName,
  newNumber,
}) {
  return (
    <>
      <form onSubmit={registerPerson}>
        <div>
          name: <input onChange={handleNewName} value={newName} />
        </div>
        <div>
          number: <input onChange={handleNewNumber} value={newNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
}

export default PersonForm;
