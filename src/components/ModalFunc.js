import React from 'react';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

const ModalFunc = (props) => {

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

    return (
        <>
            <Button variant="outline-success" onClick={handleShow}>Añadir un nuevo evento</Button>
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>
                        Añadir evento
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicName" onChange={evt => setNombre(evt.target.value)}>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el nombre del evento"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCategory" onChange={evt => setCategoria(evt.target.value)}>
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select>
                                <option>Conferencia</option>
                                <option>Seminario</option>
                                <option>Congreso</option>
                                <option>Curso</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicLugar" onChange={evt => setLugar(evt.target.value)}>
                            <Form.Label>Lugar</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el lugar del evento"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicDireccion" onChange={evt => setDireccion(evt.target.value)}>
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese la dirección del evento"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFI" onChange={evt => setFechaInicio(evt.target.value)}>
                            <Form.Label>Fecha de inicio</Form.Label>
                            <Form.Control type="datetime-local" placeholder="Ingrese la fecha de inicio del evento"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFF" onChange={evt => setFechaFinal(evt.target.value)}>
                            <Form.Label>Fecha de finalización</Form.Label>
                            <Form.Control type="datetime-local" placeholder="Ingrese la fecha de finalización del evento"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicVirtual" onChange={evt => { evt.target.value == "NO" ? setVirtual(false) : setVirtual(true) }}>
                            <Form.Label>Virtual</Form.Label>
                            <Form.Select>
                                <option>SI</option>
                                <option>NO</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" onClick={() => { if (nombre == "" || categoria == "" || lugar == "" || direccion == "" || fechaInicio == "" || fechaFinal == "") { alert("Debe completar todos los campos.") } else { props.func(nombre, categoria, lugar, direccion, fechaInicio, fechaFinal, virtual); handleClose() } }}>
                            Crear evento
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} varian="secondary">Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalFunc;
