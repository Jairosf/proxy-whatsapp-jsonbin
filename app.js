const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const payload = req.body;

  const numero = payload?.from?.split("@")[0];
  const mensagem = payload?.body;

  if (!numero || !mensagem) {
    console.log("⚠️ Payload incompleto:", payload);
    return res.status(400).send("Ignorado");
  }

  const jsonAtualizado = {
    numero: numero,
    mensagem: mensagem,
    timestamp: new Date().toISOString()
  };

  try {
    const resposta = await fetch("https://api.jsonbin.io/v3/b/683cbabb8a456b7966a82c9d", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2a$10$1LxBuf8fuu/HziVrO9mefO6ZXsPaqVMa9A7xpi6yFHGqgHhqkO4aW",
        "X-Bin-Private": "true",
        "X-Bin-Versioning": "false"
      },
      body: JSON.stringify(jsonAtualizado)
    });

    const jsonRetorno = await resposta.json();
    console.log("✅ JSONBin atualizado:", jsonRetorno);
    res.status(200).send("Mensagem salva com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao salvar no JSONBin:", error);
    res.status(500).send("Erro ao atualizar JSONBin.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("🚀 Servidor pronto na porta", port);
});