import database from "../../database.js";

export const GetAllProducts = (req, res) => {
  return res.status(200).send(database)
}

export const AddNewProduct = (req, res) => {
  const checkDuplicate = (database, field, value) => {
    return database.some((product) => product[field] === value);
  };
  try {
    const { title, img, price, tags, url, description } = req.body;

    if (checkDuplicate(database, 'title', title)) {
      return res.status(400).send({ message: 'Já existe uma atividade com esse nome' });
    }

    if (checkDuplicate(database, 'url', url)) {
      return res.status(400).send({ message: 'Já existe uma atividade com esse link' });
    }

    const id = database.length + 1;

    const product = { id, title, img, price, tags, url, description };

    database.push(product);

    return res.status(201).send({ message: 'Produto registrado com sucesso', product });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error', error: error.message });
  }
}

export const DeleteProduct = (req, res) => {
  try {
    const { id } = req.params;

    const indiceConta = database.findIndex((conta) => conta.id === Number(id));

    if (indiceConta === -1) {
      return res.status(404).send({ message: 'Produto não encontrada' });
    }

    database.splice(indiceConta, 1);

    return res.status(200).send({ message: 'Produto excluído com sucesso' });

  } catch (error) {
    return res.status(500).send({ message: 'Internal server error', error: error.message });
  }
}
