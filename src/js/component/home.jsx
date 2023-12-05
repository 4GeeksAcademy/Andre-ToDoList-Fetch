import React, { useState, useEffect } from "react";

const Home = () => {
  const [entradaTarea, setEntradaTarea] = useState('');
  const [nuevasTareas, setNuevasTareas] = useState([]);
  const [indiceHover, setIndiceHover] = useState(null);

  useEffect(() => {
    obtenerTareas();
  }, []);

  useEffect(() => {
    crearUsuario();
  }, []);

  const obtenerTareas = async () => {
    try {
      const response = await fetch("https://playground.4geeks.com/apis/fake/todos/user/AndreAbreo");

      if (response.ok) {
        const data = await response.json();
        setNuevasTareas(data);
      } else {
        console.error("Error al obtener las tareas:", response.statusText);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud de tareas:", error);
    }
  };

  const crearUsuario = async () => {
    try {
      const response = await fetch("https://playground.4geeks.com/apis/fake/todos/user/AndreAbreo");
  
      if (response.status === 404) {
        await fetch("https://playground.4geeks.com/apis/fake/todos/user/AndreAbreo", {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify([])
        });
        console.log("Usuario creado exitosamente.");
      } else if (!response.ok) {
        console.error("Error al crear o verificar el usuario:", response.statusText);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud de creación o verificación de usuario:", error);
    }
  };

  const manejarEntradaTarea = (e) => {
    setEntradaTarea(e.target.value);
  };

  const manejarTeclaEnter = async (e) => {
    if (e.key === "Enter" && entradaTarea.trim() !== "") {
      const nuevaTarea = { done: false, id: Date.now().toString(), label: entradaTarea };
      setNuevasTareas([...nuevasTareas, nuevaTarea]);
      await actualizarTareas([...nuevasTareas, nuevaTarea]);

      setEntradaTarea("");
    }
  };

  const actualizarTareas = async (tareas) => {
    try {
      const response = await fetch("https://playground.4geeks.com/apis/fake/todos/user/AndreAbreo", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tareas.map(({ id, label, done }) => ({ id, label, done }))),
      });
  
      if (!response.ok) {
        console.error("Error al actualizar las tareas:", response.statusText);
      } else {
        console.log("Tareas actualizadas exitosamente.");
      }
    } catch (error) {
      console.error("Error al procesar la solicitud de actualización de tareas:", error);
    }
  };

  const eliminarTarea = async (id) => {
    let eliminadas = nuevasTareas.filter((tarea, index) => {
      return index !== id;
    });

    setNuevasTareas(eliminadas);
    await actualizarTareas(eliminadas);
  };

  const eliminarTodasLasTareas = async () => {
    try {
      if (nuevasTareas.length === 0) {
        console.log("No hay tareas para eliminar.");
        return;
      }
  
      const response = await fetch(
        "https://playground.4geeks.com/apis/fake/todos/user/AndreAbreo",
        {
          method: "DELETE",
        }
      );
  
      if (response.ok) {
        console.log("Todas las tareas eliminadas exitosamente.");
        setNuevasTareas([]);
        await crearUsuario(); // Vuelve a crear el usuario después de eliminar todas las tareas
      } else {
        console.error("Error al eliminar todas las tareas:", response.statusText);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud de eliminación de tareas:", error);
    }
  };
  

  return (
    <div className="container containerEstilo">
      <h1>To-Do-List</h1>
      <input
        type="text"
        placeholder="¿Qué se debe hacer?"
        onChange={manejarEntradaTarea}
        value={entradaTarea}
        onKeyDown={manejarTeclaEnter}
        className="form-control entradaFormulario"
      />
      <ul className="todo-list listaDeTareas">
        {nuevasTareas.map((tarea, i) => (
          <li
            key={i}
            onMouseEnter={() => setIndiceHover(i)}
            onMouseLeave={() => setIndiceHover(null)}
            className="todo-item elementoDeTarea"
          >
            <span className="textoTarea">{tarea.label}</span>
            {indiceHover === i && (
              <button onClick={() => eliminarTarea(i)} className="btnEliminar">
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>
      <div>{nuevasTareas.length} Items Pendientes</div>
      <button onClick={eliminarTodasLasTareas} className="btnEliminar">
        Eliminar Todas las Tareas
      </button>
    </div>
  );
};

export default Home;



