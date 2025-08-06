# auth.py - Módulo para validar usuario con bcrypt y MySQL

from flask import request, jsonify
import bcrypt
from db import conectar

def login():
    data = request.json
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE username = %s", (data['username'],))
    user = cursor.fetchone()
    conn.close()

    if user:
        # user['password'] está guardado como string (hash bcrypt)
        password_enviado = data['password'].encode('utf-8')
        password_guardado = user['password'].encode('utf-8')
        
        if bcrypt.checkpw(password_enviado, password_guardado):
            return jsonify({"success": True, "usuario_id": user['id']})
    
    return jsonify({"success": False})
