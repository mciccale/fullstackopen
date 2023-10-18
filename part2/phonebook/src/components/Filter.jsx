function Filter({ handleFilter, filter }) {
  return (
    <>
      filter shown with <input onChange={handleFilter} value={filter} />
    </>
  );
}

export default Filter;
