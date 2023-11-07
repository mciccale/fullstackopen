import { useEffect, useState } from "react";
import numbersService from "./services/numbers.js";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  useEffect(() => {
    numbersService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);
  const registerPerson = (event) => {
    const showNotification = ({ action, person }) => {
      setMessage({
        type: "info",
        content:
          action === "create"
            ? `Added ${person.name}`
            : `Updated ${person.name}`,
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    };
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
            setNewName("");
            setNewNumber("");
            showNotification({ action: "update", person });
          })
          .catch((err) => {
            setMessage({
              type: "error",
              content:
                err.response.data.error ??
                `Information of ${person.name} has already been removed from the server`,
            });
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      return;
    }
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    numbersService
      .create(newPerson)
      .then((data) => {
        setPersons(persons.concat(data));
        setNewName("");
        setNewNumber("");
        showNotification({ action: "create", person: newPerson });
      })
      .catch((err) => {
        setMessage({
          type: "error",
          content: err.response.data.error,
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
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
      <Notification message={message} />
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
