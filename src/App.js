import './App.css';
import Profile from './components/Profile';
import axios from 'axios';

import { useAuth0 } from '@auth0/auth0-react';
import Table from './components/Table';
import { useState } from 'react';
import NavbarComp from './components/NavbarComp';


function App() {

  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [eventList, setEventList] = useState([]);
  const [userId, setUserId] = useState(0);
  const [entra, setEntra] = useState(false);

  function addEvento(nombre, categoria, lugar, direccion, fechaInicio, fechaFinal, virtual) {
    if (isAuthenticated && userId != 0) {
      getAccessTokenSilently().then((token) => {
        axios.post("/api/eventos/" + userId, {
          nombre: nombre,
          categoria: categoria,
          lugar: lugar,
          direccion: direccion,
          fechaInicio: fechaInicio,
          fechaFin: fechaFinal,
          virtual: virtual
        }
          , {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        )
          .then(function (response) {
            let newEvents = [...eventList];
            newEvents.unshift({
              id: response.data['id'],
              nombre: nombre,
              categoria: categoria,
              lugar: lugar,
              direccion: direccion,
              fechaCreacion: response.data['fechaCreacion'],
              fechaInicio: fechaInicio,
              fechaFin: fechaFinal,
              virtual: virtual
            });
            setEventList(newEvents);
          }).catch((error) => {
            alert("Revise bien los campos del evento y asegúrese que todos están completos. Adicionalmente, recuerde que no pueden existir dos eventos con el mismo nombre.");
          });
      });
    }
  }

  function deleteEvento(idE) {
    getAccessTokenSilently().then((token) => {
      axios.delete("/api/eventos/" + idE, {
        headers: {
          authorization: `Bearer ${token}`
        }
      }).then(() => {
        let newEvents = [...eventList];
        for (var i = 0; i < newEvents.length; i++) {
          if (newEvents[i].id == idE) {
            newEvents.splice(i, 1);
          }
        }
        setEventList(newEvents);
      });
    });
  }

  function updateEvento(idE, nombre, categoria, lugar, direccion, fechaInicio, fechaFinal, virtual, fechaCreacion) {
    getAccessTokenSilently().then((token) => {
      axios.put("/api/eventos/" + userId + "/" + idE,
        {
          nombre: nombre,
          categoria: categoria,
          lugar: lugar,
          direccion: direccion,
          fechaInicio: fechaInicio,
          fechaFin: fechaFinal,
          virtual: virtual
        }
        , {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      ).then((response) => {
        let newEvents = [...eventList];
        for (var i = 0; i < newEvents.length; i++) {
          if (newEvents[i].id == idE) {
            newEvents[i] = {
              id: idE,
              nombre: nombre,
              categoria: categoria,
              lugar: lugar,
              direccion: direccion,
              fechaCreacion: fechaCreacion,
              fechaInicio: fechaInicio,
              fechaFin: fechaFinal,
              virtual: virtual
            }
          }
        }
        setEventList(newEvents);
      });
    });
  }

  if (isAuthenticated) {
    getAccessTokenSilently().then((token) => {
      console.log(token);
      axios.get("/api/usuarios/" + user.email, {
        headers: {
          authorization: `Bearer ${token}`
        }
      }).then((respEmail) => {
        if (respEmail.data == "No existe ese usuario.") {
          axios.post("/api/usuarios", {
            email: user.email,
          }, {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
          )
            .then(function (response) {
              axios.get("/api/usuarios/" + user.email, {
                headers: {
                  authorization: `Bearer ${token}`
                }
              }).then((respUId) => {
                setUserId(respUId.data['id']);
              })
            });
        } else {
          axios.get("/api/usuarios/" + user.email, {
            headers: {
              authorization: `Bearer ${token}`
            }
          }).then((response) => {
            setUserId(response.data['id']);
            if (userId != 0) {
              if (entra == false) {
                setEntra(true);
                axios.get("/api/eventos/" + userId, {
                  headers: {
                    authorization: `Bearer ${token}`
                  }
                }).then((response) => {
                  if (response.data == "Aún no existen eventos.") {
                    setEventList([]);
                  } else {
                    setEventList(response['data']);
                  }
                });
              }
            }
          });
        }
      });
    });
  }

  return (
    <div className="App">
      <NavbarComp />
      {
        isAuthenticated ?
          <>
            <Profile />
            <Table list={eventList} func={addEvento} funcDel={deleteEvento} funcUpdt={updateEvento} />
          </>
          :
          <></>
      }
    </div>
  );
}

export default App;
