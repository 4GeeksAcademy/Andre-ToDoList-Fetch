import React, { useState, useEffect } from "react";

const Home = () => {
  const [entradaTarea, setEntradaTarea] = useState("");
  const [nuevasTareas, setNuevasTareas] = useState([]);
  const [indiceHover, setIndiceHover] = useState(null);

  useEffect(() => {
    getTodoList();
  }, []);

  async function manejarTeclaEnter(e) {
    if (e.key === "Enter") {
      try {
        const response = await fetch("https://playground.4geeks.com/apis/fake/todos/user/andre.abreo");
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          console.log("El usuario ya existe");
        } else {
          const nuevaTarea = { done: false, id: Date.now().toString(), label: entradaTarea };

          const postResponse = await fetch("https://playground.4geeks.com/apis/fake/todos/user/andre.abreo", {
            method: "POST",
            body: JSON.stringify([nuevaTarea]), // Enviar como array con la nueva tarea
            headers: {
              "Content-Type": "application/json",
            },
          });

          const postData = await postResponse.json();

          if (postData && postData.data && Array.isArray(postData.data)) {
            setNuevasTareas(postData.data);
          } else {
            console.error("La respuesta del servidor no tiene el formato esperado:", postData);
          }

          setEntradaTarea("");
        }
      } catch (error) {
        console.error("Error al procesar la solicitud:", error);
      }
    }
  }

  function getTodoList() {
    fetch("https://playground.4geeks.com/apis/fake/todos/user/andre.abreo")
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        if (data && data.data && Array.isArray(data.data)) {
          setNuevasTareas(data.data);
        } else {
          console.error("La respuesta del servidor no tiene el formato esperado:", data);
        }
      })
      .catch((error) => console.log(error));
  }

  const eliminarTarea = (id) => {
    const eliminadas = nuevasTareas.filter((tarea) => tarea.id !== id);

    fetch("https://playground.4geeks.com/apis/fake/todos/user/andre.abreo", {
      method: "PUT",
      body: JSON.stringify(eliminadas),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setNuevasTareas(data.data);
        } else {
          console.error("La respuesta del servidor no tiene el formato esperado:", data);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container containerEstilo">
      <h1>To-Do-List</h1>
      <input
        type="text"
        placeholder="¿Qué se debe hacer?"
        onChange={(e) => setEntradaTarea(e.target.value)}
        value={entradaTarea}
        onKeyDown={manejarTeclaEnter}
        className="form-control entradaFormulario"
      />
      <ul className="todo-list listaDeTareas">
        {nuevasTareas.map((tarea) => (
          <li
            key={tarea.id}
            onMouseEnter={() => setIndiceHover(tarea.id)}
            onMouseLeave={() => setIndiceHover(null)}
            className="todo-item elementoDeTarea"
          >
            <span className="textoTarea">{tarea.label}</span>
            {indiceHover === tarea.id && (
              <button onClick={() => eliminarTarea(tarea.id)} className="btnEliminar">
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>
      <div>{nuevasTareas.length} Items Pendientes</div>
    </div>
  );
};

export default Home;
