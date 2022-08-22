import classes from "./Complaints.module.css";

const Complaints = () => {
  return (
    <form
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "10px",
        textAlign: "center",
        fontSize: "1.2rem",
      }}
      className={classes.form}
    >
      <div className={classes.form_group}>
        <label htmlFor="exampleFormControlTextarea1">
          Escreva aqui sua reclamação
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        ></textarea>
        <div className="submit-image">
          <button>
            <img src="https://img.icons8.com/color/48/000000/camera.png" />
          </button>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="exampleFormControlSelect1">
          Selecione o tipo de reclamação
        </label>
        <select className="form-control" id="exampleFormControlSelect1">
          <option>Selecione</option>
          <option>Reclamação</option>
          <option>Sugestão</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Enviar
      </button>
    </form>
  );
};

export default Complaints;
