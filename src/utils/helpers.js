module.exports = {
    ordenar: function ordenar(a,b){
        console.log("Hola");
        if (a.Nombre > b.Nombre){
            return 1;
        }
        if (a.Nombre < b.Nombre){
            return -1;
        }
        return 0;
    }
}