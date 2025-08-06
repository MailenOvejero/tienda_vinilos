import bcrypt

original = "contraseña123".encode('utf-8')
hash_guardado = b"$2b$12$XCGJApYxTIA4YxpMZC89HOBHyUmmRMkZz6lSOwHy/YWyNSUWUhGe"

print(bcrypt.checkpw(original, hash_guardado))
