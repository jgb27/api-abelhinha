import app from "./src/app.js";

const PORT = process.env.PORT || 2727;

app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
