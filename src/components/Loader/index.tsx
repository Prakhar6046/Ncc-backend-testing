const Loader = () => {
  return (
    <>
      {/* START SHOW LOADER WHEN LOAD RECORDS */}
      <div className="loader_container">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      {/* END SHOW LOADER WHEN LOAD RECORDS */}
    </>
  );
};
export default Loader;
