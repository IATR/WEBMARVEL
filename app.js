const publicKey = '5394cf3deedaa712ffc9208560141fd0'; // Tu clave pública de la API de Marvel
const privateKey = '29c1a3a1662c8cdfc29827035acbf1cd62dc01b7'; // Tu clave privada de la API de Marvel
const baseURL = 'https://gateway.marvel.com/v1/public/';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');

searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value;
  if (searchTerm) {
    searchCharacter(searchTerm);
  }
});

async function searchCharacter(searchTerm) {
  resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

  const timestamp = Date.now();
  const hash = SparkMD5.hash(timestamp + privateKey + publicKey);

  const url = `${baseURL}characters?nameStartsWith=${searchTerm}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.data && data.data.results) {
      data.data.results.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'character';

        const name = document.createElement('h2');
        name.textContent = character.name;
        characterDiv.appendChild(name);

        if (character.thumbnail) {
          const image = document.createElement('img');
          image.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
          characterDiv.appendChild(image);
        }

        if (character.description) {
          const description = document.createElement('p');
          description.textContent = character.description;
          characterDiv.appendChild(description);
        }

        resultsContainer.appendChild(characterDiv);
      });
    } else {
      resultsContainer.textContent = 'No results found.';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    resultsContainer.textContent = 'An error occurred while fetching data.';
  }
}