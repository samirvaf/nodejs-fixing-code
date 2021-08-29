const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function getRepositoryById (id) {
  return repositories.find(repository => repository.id === id);
}

function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repository = getRepositoryById(id);

  if(!repository) {
    return response.status(404).json({ error: 'Repository not found!' })
  }

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = getRepositoryById(id);

  if (title) { repository.title = title; }
  if (url) { repository.url = url; }
  if (techs) { repository.techs = techs; }

  return response.json(repository);
});

app.delete("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repository = getRepositoryById(id);

  repository.likes += 1;

  return response.status(201).json(repository);
});

module.exports = app;
