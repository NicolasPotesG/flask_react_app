from datetime import datetime
import json
from urllib.request import urlopen
from functools import wraps
from flask import Flask, request,  _app_ctx_stack
from flask_cors import cross_origin
from jose import jwt
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api
from flask_cors.extension import CORS
from dateutil import parser

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///eventos.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)
CORS(app)

AUTH0_DOMAIN = 'dev-0xngp3to.us.auth0.com'
API_AUDIENCE = 'this is a unique identifier'
ALGORITHMS = ["RS256"]

# Error handler


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

# Models


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    eventos = db.relationship('Evento', backref='usuario', lazy=1)


class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    categoria = db.Column(db.String(12))
    lugar = db.Column(db.String(255))
    direccion = db.Column(db.String(255))
    fechaCreacion = db.Column(db.DateTime)
    fechaInicio = db.Column(db.DateTime)
    fechaFin = db.Column(db.DateTime)
    virtual = db.Column(db.Boolean)
    usuarioId = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=0)

# Schemas


class Usuario_Schema(ma.Schema):
    class Meta:
        fields = ("id", "email")


schema_usuario = Usuario_Schema()
schema_usuarios = Usuario_Schema(many=True)


class Evento_Schema(ma.Schema):
    class Meta:
        fields = ("id", "nombre", "categoria", "lugar",
                  "direccion", "fechaCreacion", "fechaInicio", "fechaFin", "virtual", "usuarioId")


schema_evento = Evento_Schema()
schema_eventos = Evento_Schema(many=True)

# Routes


def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token


def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer="https://"+AUTH0_DOMAIN+"/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                "description":
                                    "incorrect claims,"
                                    "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                "description":
                                    "Unable to parse authentication"
                                    " token."}, 400)

            _app_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                        "description": "Unable to find appropriate key"}, 400)
    return decorated


@app.route('/api/usuarios', methods=['POST'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def createUser():
    data = json.loads(request.data)
    print(data)
    if Usuario.query.filter(Usuario.email == data["email"]).first():
        return {"error": "El usuario ya se encuentra registrado."}, 403
    else:
        usuario = Usuario(
            email=data["email"]
        )
        db.session.add(usuario)
        db.session.commit()

    return {
        'id': usuario.id,
        'email': usuario.email
    }


@app.route('/api/usuarios/<emailU>', methods=['GET'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def getUser(emailU):
    print(emailU)
    user = Usuario.query.filter(Usuario.email == emailU).first()
    print(user)
    if user != None:
        return schema_usuario.dumps(user)
    else:
        return "No existe ese usuario."


@app.route('/api/eventos/<int:idU>', methods=['GET'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def getEventos(idU):
    events = Evento.query.filter(Evento.usuarioId == idU)
    if events.first() != None:
        events = events.order_by(Evento.fechaCreacion.desc())
        return schema_eventos.dumps(events)
    else:
        return "Aún no existen eventos."


@app.route('/api/eventos/<int:idU>', methods=['POST'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def postEvento(idU):
    data = json.loads(request.data)
    if not data:
        return {"error": "No se proporcionó la información del evento."}, 403
    if Usuario.query.filter(Usuario.id == idU).first() == None:
        return {"error": "El usuario no se encuentra registrado."}, 403
    if Evento.query.filter(Evento.usuarioId == idU).filter(Evento.nombre == data["nombre"]).first():
        return {"error": "Ya existe un evento con el mismo nombre"}, 403
    fechaInicio = parser.parse(data["fechaInicio"], ignoretz=True)
  #  if fechaInicio < datetime.now():
    #    return {"error": "La fecha de inicio del evento es menor a la fecha actual"}, 403
    fechaFin = parser.parse(data["fechaFin"], ignoretz=True)
    if(fechaInicio >= fechaFin):
        return {"error": "La fecha de inicio del evento es igual o mayor a la de fin"}, 403
    event = Evento(
        nombre=data['nombre'],
        categoria=data['categoria'],
        lugar=data['lugar'],
        direccion=data['direccion'],
        fechaCreacion=datetime.now(),
        fechaInicio=fechaInicio,
        fechaFin=fechaFin,
        virtual=data['virtual'],
        usuarioId=idU
    )
    db.session.add(event)
    db.session.commit()
    print(event.fechaCreacion)
    return {"success": "Evento creado.", "id": event.id, "fechaCreacion": str(event.fechaCreacion)}


@app.route('/api/eventos/<int:idU>/<int:idE>', methods=['PUT'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def updateEvento(idU, idE):
    event = Evento.query.get_or_404(idE)
    data = json.loads(request.data)
    if event:
        if 'nombre' in data:
            # if Evento.query.filter(Evento.usuarioId == idU).filter(Evento.nombre == data["nombre"]).first():
            #     return {"error": "Ya existe un evento con el mismo nombre"}, 403
            event.nombre = data['nombre']
            event.categoria = data['categoria']
            event.lugar = data['lugar']
            event.direccion = data['direccion']
            fechaInicio = parser.parse(data["fechaInicio"], ignoretz=True)
            fechaFin = parser.parse(data["fechaFin"], ignoretz=True)
            if fechaInicio >= fechaFin:
                return {"error": "La fecha de inicio es igual o mayor a la de fin"}, 403
            event.fechaInicio = fechaInicio
            event.fechaFin = fechaFin
            event.virtual = data['virtual']
        db.session.commit()
        return {"success": 'Evento actualizado'}
    else:
        return {"error": 'Evento no actualizado'}


@app.route('/api/eventos/<int:idE>', methods=['DELETE'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def deleteEvento(idE):
    event = Evento.query.get_or_404(idE)
    if event:
        db.session.delete(event)
        db.session.commit()
        return {"success": "Evento eliminado"}


if __name__ == '__main__':

    app.run(debug=True)
