import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import ModalFunc from './ModalFunc';
import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';

const Table = (props) => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [lugar, setLugar] = useState("");
    const [direccion, setDireccion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [virtual, setVirtual] = useState(true);
    const [idEvent, setIdEvent] = useState(0);
    const [fechaCreacion, setFechaCreacion] = useState("");

    return <div>
        <ModalFunc func={props.func} />
        {props.list.length != 0 && (
            <table className='table'>
                <thead>
                    <tr>
                        <td>NOMBRE</td>
                        <td>CATEGORÍA</td>
                        <td>LUGAR</td>
                        <td>DIRECCIÓN</td>
                        <td>FECHA CREACIÓN</td>
                        <td>FECHA INICIO</td>
                        <td>FECHA FIN</td>
                        <td>VIRTUAL</td>
                        <td>EDITAR</td>
                        <td>ELIMINAR</td>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(props.list).map((obj, index) => (

                        <tr key={index}>

                            <td>{obj.nombre}</td>
                            <td>{obj.categoria}</td>
                            <td>{obj.lugar}</td>
                            <td>{obj.direccion}</td>
                            <td>{obj.fechaCreacion}</td>
                            <td>{obj.fechaInicio}</td>
                            <td>{obj.fechaFin}</td>
                            <td>{obj.virtual ? "SI" : "NO"}</td>
                            <td><button onClick={() => {
                                handleShow();
                                setIdEvent(obj.id);
                                setNombre(obj.nombre);
                                setCategoria(obj.categoria);
                                setLugar(obj.lugar);
                                setDireccion(obj.direccion);
                                setFechaInicio(obj.fechaInicio);
                                setFechaFinal(obj.fechaFin);
                                setVirtual(obj.virtual);
                                setFechaCreacion(obj.fechaCreacion);
                            }} type="button" className="btn btn-primary">Editar</button></td>
                            <td><button onClick={() => { props.funcDel(obj.id) }} type="button" className="btn btn-danger">Eliminar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

        <Modal show={show} >
            <Modal.Header>
                <Modal.Title>
                    Editar evento
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicName" onChange={evt => setNombre(evt.target.value)}>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" defaultValue={nombre}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCategory" onChange={evt => setCategoria(evt.target.value)}>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select
                            defaultValue={categoria}
                        >
                            <option>Conferencia</option>
                            <option>Seminario</option>
                            <option>Congreso</option>
                            <option>Curso</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicLugar" onChange={evt => setLugar(evt.target.value)}>
                        <Form.Label>Lugar</Form.Label>
                        <Form.Control type="text" placeholder="Ingrese el lugar del evento" defaultValue={lugar}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicDireccion" onChange={evt => setDireccion(evt.target.value)}>
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control type="text" placeholder="Ingrese la dirección del evento" defaultValue={direccion}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicFI" onChange={evt => setFechaInicio(evt.target.value)}>
                        <Form.Label>Fecha de inicio</Form.Label>
                        <Form.Control type="datetime-local" placeholder="Ingrese la fecha de inicio del evento" defaultValue={fechaInicio}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicFF" onChange={evt => setFechaFinal(evt.target.value)}>
                        <Form.Label>Fecha de finalización</Form.Label>
                        <Form.Control type="datetime-local" placeholder="Ingrese la fecha de finalización del evento" defaultValue={fechaFinal}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicVirtual" onChange={evt => { evt.target.value == "NO" ? setVirtual(false) : setVirtual(true) }}>
                        <Form.Label>Virtual</Form.Label>
                        <Form.Select
                            defaultValue={virtual ? "SI" : "NO"}
                        >
                            <option>SI</option>
                            <option>NO</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" onClick={() => { if (nombre == "" || categoria == "" || lugar == "" || direccion == "" || fechaInicio == "" || fechaFinal == "") { alert("Los campos no pueden quedar vacíos.") } else { props.funcUpdt(idEvent, nombre, categoria, lugar, direccion, fechaInicio, fechaFinal, virtual, fechaCreacion); handleClose() } }}>
                        Actualizar evento
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} varian="secondary">Close</Button>
            </Modal.Footer>
        </Modal>
    </div>
};

export default Table;
