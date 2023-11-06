const url = "https://studies.cs.helsinki.fi/restcountries/api";

async function getAll() {
  try {
    const res = await fetch(`${url}/all`);
    const countries = await res.json();
    return countries;
  } catch (error) {
    console.error(error);
  }
}

export { getAll };
