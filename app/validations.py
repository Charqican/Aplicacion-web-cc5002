# clase que abstrae toda la implementacion de las validaciones
# Primero se instancia con los parametros que se quieran validar, y luego se llama a .val()
class FormValidate():
    def __init__(self, region="", comuna="", celular="", calle_numero="", tipo="", cantidad="", fecha="",
     condiciones="", descripcion="", nombre="",email=""):
        self.region = region
        self.comuna = comuna
        self.calle_numero = calle_numero
        self.celular = celular
        self.tipo = tipo
        self.cantidad=cantidad
        self.fecha = fecha
        self.condiciones=condiciones
        self.descripcion = descripcion
        self.nombre = nombre
        self.email = email

    def regionVal(self, string):
        if string == "": return True

    def comunaVal(self, string):
        if string == "": return True

    def calleNumeroVal(self, string):
        if string == "": return True

    def celularVal(self, string):
        if string == "": return True

    def tipoVal(self, string):
        if string == "": return True

    def cantidadVal(self, string):
        if string == "": return True

    def fechaVal(self, string):
        if string == "": return True

    def condicionesVal(self, string):
        if string == "": return True

    def descripcionVal(self, string):
        if string == "": return True

    def nombreVal(self, string):
        if string == "": return True

    def emailVal(self, string):
        if string == "": return True

    def val(self):
        boolean = self.regionVal(self.region) and self.comunaVal(self.comuna) and \
        self.celularVal(self.celular) and self.tipoVal(self.tipo) and \
        self.cantidadVal(self.cantidad) and self.fechaVal(self.fecha) and \
        self.condicionesVal(self.condiciones) and self.descripcionVal(self.descripcion) and \
        self.nombreVal(self.nombre) and self.emailVal(self.email) and self.calleNumeroVal(self.calle_numero)

        return boolean
    

#
def validateFiles(file):
    return True;