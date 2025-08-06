# app.py - Inicialización del servidor Flask y configuración de rutas principales

from flask import Flask
from flask_cors import CORS

# Importación de módulos personalizados
from auth import login as auth_login
from productos import obtener_vinilos
from carrito import agregar_carrito, confirmar_compra, obtener_carrito
from usuario import obtener_usuario

app = Flask(__name__, static_folder='static')
CORS(app)

# 👉 Servimos el HTML principal
@app.route('/')
def index():
    return app.send_static_file('index.html')

# 🔐 Login del usuario
@app.route('/login', methods=['POST'])
def login():
    return auth_login()

# 🎵 Obtener lista filtrada de vinilos
@app.route('/vinilos', methods=['GET'])
def vinilos():
    return obtener_vinilos()

# ➕ Agregar vinilo al carrito
@app.route('/carrito', methods=['POST'])
def agregar():
    return agregar_carrito()

# 🛒 Ver contenido del carrito
@app.route('/carrito', methods=['GET'])
def ver_carrito():
    return obtener_carrito()

# ✅ Confirmar compra y actualizar stock
@app.route('/comprar', methods=['POST'])
def comprar():
    return confirmar_compra()

# 👤 Ver perfil del usuario
@app.route('/usuario/<int:usuario_id>', methods=['GET'])
def ver_usuario(usuario_id):
    return obtener_usuario(usuario_id)

# 🚀 Ejecutamos el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')
