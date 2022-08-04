let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
let pokemonRepository = (function () {
  let pokemonList = [];

  return {
    add: function (pokemon) {
      if (
        typeof pokemon === "object" &&
        "name" in pokemon &&
        "detailsUrl" in pokemon
      ) {
        pokemonList.push(pokemon);
      } else {
        console.log("Pokemon is not correct");
      }
    },
    getAll: function () {
      return pokemonList;
    },

    addListItem: function (pokemon) {
      let pokemonList = document.querySelector(".pokemon-list");
      let listPokemon = document.createElement("li");
      let button = document.createElement("button");
      button.innerText = pokemon.name;
      button.classList.add("button-class");
      listPokemon.appendChild(button);
      pokemonList.appendChild(listPokemon);
      pokemonRepository.addNewListener(button, pokemon);
    },
    //new code below for assignment 1.6
    addNewListener: function (button, pokemon) {
      button.addEventListener("click", function (event) {
        pokemonRepository.showDetails(pokemon);
      });
    },

    loadList: function () {
      return fetch(apiUrl)
        .then(function (response) {
          console.log(response);
          return response.json();
        })
        .then(function (json) {
          console.log(json);
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url,
            };
            pokemonRepository.add(pokemon);
          });
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    loadDetails: function (pokemon) {
      let url = pokemon.detailsUrl;
      return fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (details) {
          pokemon.imageUrl = details.sprites.front_default;
          pokemon.name = details.species.name;
          pokemon.height = details.height;
          pokemon.weight = details.weight;
          pokemon.types = details.types.map((type) => type.type.name).join(",");
          pokemon.abilities = details.abilities
            .map((ability) => ability.ability.name)
            .join(",");
          return pokemon;
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    showDetails: function (pokemon) {
      pokemonRepository.loadDetails(pokemon).then(function (item) {
        console.log(item);
        document.querySelector("#modal_img").setAttribute("src", item.imageUrl);
        // document.querySelector("#modal_name").innerText = item.name;
        // document.querySelector(
        //   "#modal_height"
        // ).innerText = `${item.height} meters.`;
        modalOperator.showModal(pokemon);
      });
    },
  };
})();

let modalOperator = (function () {
  let modalContainer = document.querySelector("#modal-container");

  function showModal(pokemon) {
    modalContainer.innerHTML = "";
    let modal = document.createElement("div");
    modal.classList.add("modal");

    let closeButtonElement = document.createElement("button");
    closeButtonElement.classList.add("modal-close");
    closeButtonElement.innerText = "Close";
    closeButtonElement.addEventListener("click", hideModal);

    let titleElement = document.createElement("h1");
    titleElement.innerText = `${pokemon.name}`;

    let contentElement = document.createElement("p");
    contentElement.innerText = `${pokemon.height} meters tall.`;
    let imgElement = document.createElement("img");
    imgElement.src = pokemon.imageUrl;

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modal.appendChild(imgElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add("show-modal");
  }

  function hideModal() {
    modalContainer.classList.remove("show-modal");
  }

  // window.addEventListener("keydown", (e) => {
  //   if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
  //     hideModal();
  //   }
  // });

  // modalContainer.addEventListener("click", (e) => {
  //   // Since this is also triggered when clicking INSIDE the modal
  //   // We only want to close if the user clicks directly on the overlay
  //   let target = e.target;
  //   if (target === modalContainer) {
  //     hideModal();
  //   }
  // });

  // document.querySelector("#show-modal").addEventListener("click", () => {
  //   showModal("Modal title", "This is the modal content!");
  // });

  return {
    showModal: showModal,
    hideModal: hideModal,
    modalContainer: modalContainer,
  };
})();

// Code for exercise 1.8
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

// let show_modal = document.getElementById("show_modal");
// let modal_container = document.getElementById("modal_container");
// let close_modal = document.getElementById("close_modal");
let modalContainer = document.querySelector("#modal_container");
// show_modal.addEventListener("click", () => {
//   modal_container.classList.add("show-modal");
// });

// close_modal.addEventListener("click", () => {
//   modal_container.classList.remove("show-modal");
// });

window.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key === "Escape") {
    modalOperator.hideModal();
  }
});

// window.addEventListener("keydown", (e) => {
//   if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
//     hideModal();
//   }
// });

// function hideModal() {
//   modalContainer.classList.remove("show-modal");
// }

// modalContainer.addEventListener("click", (e) => {
//   let target = e.target;
//   if (target === modalContainer) {
//     hideModal();
//   }
// });
