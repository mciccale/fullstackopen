import { useEffect, useState } from 'react';
import numbersService from './services/numbers';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  useEffect(() => {
    numbersService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);
  const registerPerson = (event) => {
    event.preventDefault();
    const person = persons.find(({ name }) => name === newName);
    if (person) {
      window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      ) &&
        numbersService
          .update(person.id, { ...person, number: newNumber })
          .then((data) => {
            setPersons(persons.map((p) => (p.id !== data.id ? p : data)));
            setNewName('');
            setNewNumber('');
          });
      return;
    }
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    numbersService.create(newPerson).then((data) => {
      setPersons(persons.concat(data));
      setNewName('');
      setNewNumber('');
    });
  };
  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    window.confirm(`Delete ${person.name} ?`) &&
      numbersService.deleteObject(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
  };
  const handleNewName = (event) => {
    setNewName(event.target.value);
  };
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };
  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} filter={filter} />
      <h3>add a new</h3>
      <PersonForm
        registerPerson={registerPerson}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
        newName={newName}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  );
}

export default App;
