const charsContainer = document.querySelector(".chars-container");
const buscarFilter = document.querySelector("#buscar");
const speciesFilter = document.querySelector("#species");
const genderFilter = document.querySelector("#gender");
const statusFilter = document.querySelector("#status");
const loadBtn = document.querySelector("#load-more");
const API = "https://rickandmortyapi.com/api";
const defaultFiltrers = {
  id: "",
  name: "",
  species: "",
  gender: "",
  status: "",
  page: 1,
};
const queryParams = new URLSearchParams(window.location.search);
const characterId = queryParams.get("id");

async function getCharacters({ name, species, gender, status, page = 1 }) {
  const response = await fetch(
    `${API}/character?name=${name}&species=${species}&gender=${gender}&gender=${gender}&status=${status}&page=${page}`
  );
  const characters = await response.json();

  return characters.results;
}
async function getEpisodes() {
  let url = `${API}/episode`;
  let episodes = [];

  while (url) {
    const response = await fetch(url);
    const data = await response.json();
    episodes = episodes.concat(data.results);
    url = data.info.next;
  }

  return episodes;
}
async function getCharacterDetails(characterId) {
  const response = await fetch(`${API}/character/${characterId}`);
  const character = await response.json();
  return character;
}

async function render({ characters, episodes }) {
  for (const character of characters) {
    const detailLink = `detail.html?id=${character.id}`;
    charsContainer.innerHTML += `
      <a href="${detailLink}" >
            <div class="char"  data-charId="${character.id}">
              <img src="${character.image}" alt="">
              <div class="char-info">
                <h3>${character.name}</h3>
                <span>${character.status}</span>
                <span>${character.gender}</span>
                <span>${character.species}</span>
                <span>O(a) <strong>${character.name}</strong> aparece em <strong>${character.episode.length}</strong> episódio(s)</span>
              </div>
            </div>
        </a>
      `;
  }
}
function handleFilter(type, e) {
  return async () => {
    defaultFiltrers[type] = e.target.value;
    charsContainer.innerHTML = "";
    const characters = await getCharacters(defaultFiltrers);
    render({ characters });
  };
}
function addEvents() {
  speciesFilter.addEventListener("change", async (e) => {
    handleFilter("species", e)();
  });
  genderFilter.addEventListener("change", async (e) => {
    handleFilter("gender", e)();
  });
  statusFilter.addEventListener("change", async (e) => {
    handleFilter("status", e)();
  });
  buscarFilter.addEventListener("keyup", async (e) => {
    handleFilter("name", e)();
  });
  loadBtn.addEventListener("click", async () => {
    defaultFiltrers.page += 1;
    const characters = await getCharacters(defaultFiltrers);
    render({ characters });
  });
}
async function main() {
  const characters = await getCharacters(defaultFiltrers);
  const episodes = await getEpisodes();
  addEvents();
  render({ characters });
}
main();





