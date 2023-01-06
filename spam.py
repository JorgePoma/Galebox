import smtplib

emisor = 'spam.etica.prueba@gmail.com'
passw = 'irktqclbeiisiyxo'

#mensaje
mensaje = '''
Subject: Promoción de hoy

¡Hola!

Acabas de ganar un viaje a Montañita por carnaval!!

ingresa al link para reclamar tu boleto GRATIS
https://www.google.com/?hl=es

Saludos,
Equipo de marketing de ética 8v0 ciclo
'''

#direccion  de correo de la victima
eVictima = 'jorge.poma@unl.edu.ec'

#conexion SMTP
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()

#iniciar sesion con el servidor SMTP
server.login(emisor, passw)

#envio del correo electronico
nroCorreos = input("Numero de envios: ")

for i in range(int(nroCorreos)):
  server.sendmail(emisor, eVictima, mensaje.encode('utf-8'))
  print("correo " + str(i) + " enviado")
server.quit()