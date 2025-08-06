import bcrypt
from db import conectar

clave = "contraseña123"
hash = bcrypt.hashpw(clave.encode('utf-8'), bcrypt.gensalt())

conn = conectar()
cursor = conn.cursor()
cursor.execute("INSERT INTO usuarios (username, password) VALUES (%s, %s)", ("usuario_test", hash.decode('utf-8')))
conn.commit()
conn.close()

print("✅ Usuario creado exitosamente.")
