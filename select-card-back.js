const cardBackGrid = document.querySelector("#card-back-grid");

function createCardBackGrid() {
    cardBackOptions.forEach((cardName, index) => {
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card-container");

        const cardBack = document.createElement("div");
        cardBack.classList.add("card");

        const cardBackImg = document.createElement("img");
        cardBackImg.setAttribute("src", `images/${cardName}.png`);
        cardBackImg.setAttribute("data-id", index);
        cardBackImg.classList.add("cardback-option");

        cardBack.appendChild(cardBackImg);
        cardContainer.appendChild(cardBack);
        cardBackGrid.appendChild(cardContainer);
    });
}

createCardBackGrid();

const cardBackOptionsElements = document.querySelectorAll(".cardback-option");

/* cardBackOptionsElements.forEach((cardBackOption) => {
    cardBackOption.addEventListener("click", () => {
        cardBackOptionsElements.forEach((option) => {
            option.classList.remove("selected");
        });
        cardBackOption.classList.add("selected");
    });
}); */

cardBackOptionsElements.forEach((cardBackOption) => {
    cardBackOption.addEventListener("click", () => {
        cardBackOptionsElements.forEach((option) => {
            option.classList.remove("selected");
        });
        cardBackOption.classList.add("selected");

        const selectedCardBackIndex = cardBackOption.getAttribute("data-id");
        localStorage.setItem("selectedCardBackIndex", selectedCardBackIndex);
        console.log("printing the current data id:")
        console.log(selectedCardBackIndex);

    });
});

document.querySelector("#back-to-game").addEventListener("click", () => {
    const selectedCardBackIndex = localStorage.getItem("selectedCardBackIndex");
    window.location.href = `./index.html?cardBackIndex=${selectedCardBackIndex}`;
});

