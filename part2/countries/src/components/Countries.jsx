function Countries({ countries }) {
  return (
    <>
      {countries.map((country) => (
        <div key={country.name.common}>
          {country.name.common} <button>show</button>
        </div>
      ))}
    </>
  );
}

export default Countries;
