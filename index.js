const express = require("express");
const app = express();

const PORT = 3000;

app.use(express.json());
app.get("/", (req,res) => res.send("Test"));

app.use("/products", require("./routes/products"));

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
