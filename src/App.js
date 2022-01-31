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
  let userId = 0;
  const [entra, setEntra] = useState(false);

  function addEvento(nombre, categoria, lugar, direccion, fechaInicio, fechaFinal, virtual) {
    if (isAuthenticated && userId != 0) {
      getAccessTokenSilently().then((token) => {
        axios.post("http://172.24.41.253:8080/api/eventos/" + userId, {
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
          });
      });
    }
  }

  function deleteEvento(idE) {
    getAccessTokenSilently().then((token) => {
      axios.delete("http://172.24.41.253:8080/api/eventos/" + idE, {
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
      axios.put("http://172.24.41.253:8080/api/eventos/" + userId + "/" + idE,
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
        console.log(response);
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
      axios.get("http://172.24.41.253:8080/api/usuarios/" + user.email, {
        headers: {
          authorization: `Bearer ${token}`
        }
      }).then((respEmail) => {
        if (respEmail.data == "No existe ese usuario.") {
          console.log("REGISTRAR");
          axios.post("http://172.24.41.253:8080/api/usuarios", {
            email: user.email,
          }, {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
          )
            .then(function (response) {
              console.log(response);
              axios.get("http://172.24.41.253:8080/api/usuarios/" + user.email, {
                headers: {
                  authorization: `Bearer ${token}`
                }
              }).then((respUId) => {
                console.log(respUId);
                userId = respUId.data['id'];
              })
            });
        } else {
          axios.get("http://172.24.41.253:8080/api/usuarios/" + user.email, {
            headers: {
              authorization: `Bearer ${token}`
            }
          }).then((response) => {
            userId = response.data['id'];
            if (userId != 0) {
              if (entra == false) {
                setEntra(true);
                axios.get("http://172.24.41.253:8080/api/eventos/" + userId, {
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
