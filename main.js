const fs = require("fs");
const express = require ("express");
const app = express();
const PORT = 8080

class Contenedor {
    constructor(file) {
        this.file = file
    }

    async save(obj){
        try{
            const objects = await this.getAllObjects()
            const lastId = objects.length > 0 ? objects[
                objects.length -1].id : 0
            const newId = lastId + 1
            const newObj = {id: newId, ...obj}
            objects.push(newObj)
            await this.saveObjects(objects)
            return newId
        }catch(error){
            throw new Error("Error al guardar el objeto")
        }
    }

    async getById(id){
        try{
            const objects = await this.getAllObjects()
            const obj = objects.find((o)=> o.id === id)
            return obj || null
        }catch(error){
            throw new Error("Error al obtener ID")
        }
    }
    
    async deleteById(id){
        try{
            let objects =await this.getAllObjects()
            objects = objects.filter((o)=> o.id !== id)
            await this.saveObjects(objects)
        }catch(error){
            throw new Error ("Error al eliminar los objetos")
        }
    }
    async deleteAll(){
        try{
            await this.saveObjects([])
        }catch(error){
            throw new Error("Error al eliminar los objetos")
        }
    }
    async getAllObjects(){
        try{
            const data = await fs.promises.readFile(this.file, "utf-8")
            return data ? JSON.parse(data) : []
        }catch(error){
           return []
        }
    }

    
   async getRandom(){   
        try {
            if (!fs.existsSync(this.file)) {
            return "No hay productos";
            } else {
            let data = await fs.promises.readFile(this.file, "utf-8");
            let products = JSON.parse(data);
            const randomProduct =
                products[Math.floor(Math.random() * products.length)];
            return randomProduct;
            }
        }catch(error){
            throw new Error("Error al obtener los productos")
    };
    }

    async saveObjects(objects){
        try{
            await fs.promises.writeFile(this.file, JSON.stringify(objects, null, 2))
        }catch(error){
            throw new Error("Error al guardar objetos")
        }
    }
}

const main = async () => {
    const productos = new Contenedor ("productos.txt")

    //obtener todos los objetos   

        const allObjects = await productos.getAllObjects()
        console.log("Objetos guardados", allObjects)
        app.get ('/productos', async(req, res)=> {
            res.json(allObjects)
        })

//     //Obtener producto random
//     app.get("/randomproducto", async (req, res) => {
//         try {
//           const randomProduct = await productos.getRandom();
//           res.json(randomProduct);
//         } catch {
//           console.error(err);
//         }
//       });

    //Guardar un objeto

    // const id = await productos.save(
    //     {title:"Producto", Price: 4200}
    // )
    // console.log("Objeto guardado con ID:", id)

    //Obtener objeto por id

    // const obj = await productos.getById(2)
    // console.log("Objeto obtenido", obj)

    //Eliminar un objeto

    // await productos.deleteById(1)
    // console.log("Objeto eliminado")

    //Eliminar todos los objetos

    // await productos.deleteAll()
    // console.log("Objetos eliminados")
}

main().catch((error) => console.error(error))

const server = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})

server.on("error", error => console.log(`Error en el servidor ${error}`))