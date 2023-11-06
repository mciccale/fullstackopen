function Country({ country }) {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <span>
        capital {country.capital[0]}
        <br />
      </span>
      <span>
        area {country.area}
        <br />
      </span>
      <span>
        <br />
        <strong>languages:</strong>
        <br />
      </span>
      <ul>
        {Object.entries(country.languages).map(([id, lang]) => (
          <li key={id}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
    </div>
  );
}

export default Country;
