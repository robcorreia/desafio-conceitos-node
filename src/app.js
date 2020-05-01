const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateRepositoryId = function (request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) response.status(400).json({ error: "Repository id invalid!" })

  return next();
};

app.get("/repositories", (request, response) => response.status(200).json(repositories))

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) response.status(400).json({ error: "Repository not exist!" });

  const repository = {
    title,
    url,
    techs
  };

  repositories[repositoryIndex] = { ...repositories[repositoryIndex], ...repository }

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) response.status(400).json({ error: "Repository not exist!" });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) response.status(400).json({ error: "Repository not found!" });

  const { likes } = repositories[repositoryIndex];

  repositories[repositoryIndex] = { ...repositories[repositoryIndex], likes: likes + 1 };

  return response.status(200).json(repositories[repositoryIndex])
});

module.exports = app;