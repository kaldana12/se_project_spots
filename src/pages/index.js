import "./index.css";
import { settings } from "../scripts/validation.js";
import { disabledButton } from "../scripts/validation.js";
import { resetValidation } from "../scripts/validation.js";
import { enableValidation } from "../scripts/validation.js";
import avatarSrc from "../images/avatar.jpg";
import Api from "../utils/api.js";
import { setButtonText } from "../utils/helpers.js";

const avatarImage = document.getElementById("image-avatar");
avatarImage.src = avatarSrc;

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//     alt: "val thorens photograph",
//   },

//   {
//     name: "Restaurant Terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//     alt: "restaurant storefront",
//   },

//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//     alt: "italy cafe style",
//   },

//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//     alt: "outdoor wooden long bridewalk",
//   },

//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//     alt: "light at the end of the tunner",
//   },

//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//     alt: "snowy cabbin",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "bd0dda27-19f5-4140-81e1-0cd5551e39ec",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, users]) => {
    console.log(cards, users);
    console.log("User data:", users); // Let's keep this to see what we get
    currentUserId = users._id;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
    const profileImage = document.querySelector("#image-avatar");
    profileImage.src = users.avatar;

    const profileTitle = document.querySelector(".profile__title");
    const profileDescription = document.querySelector(".profile__description");

    profileTitle.textContent = users.name; // We might need to adjust this property name
    profileDescription.textContent = users.about;
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

//Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalCloseBttn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Delete form elemmts
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

//Edit modal
const editModal = document.querySelector("#edit-modal");
const editModalCloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editFormInput = document.querySelector(".modal__form");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBttn = cardModal.querySelector(".modal__close-btn");
const cardLink = document.querySelector(".card__image");
const cardName = document.querySelector(".card__title");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalNameInput = cardModal.querySelector("#add-card-name-input");
const cardFormInput = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");

//Card elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;
let currentUserId;

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");
const deleteCancelButton = document.getElementById("cancel-delete-btn");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNamedl = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  cardNamedl.textContent = data.name;
  console.log("Card data:", data);
  console.log("Card image element src:", cardImage.src);

  console.log("Card name:", data.name);
  console.log("Card link:", data.link);

  cardImage.src = data.link;
  cardImage.alt = data.name;

  const isLikedByCurrentUser = data.isLiked === true;

  if (isLikedByCurrentUser) {
    likeButton.classList.add("card__like-btn_liked");
  }

  // likeButton.addEventListener("click", (evt) => {
  //   handleLike(evt, data._id);
  // });

  // deleteButton.addEventListener("click", () =>
  //   handleDeleteCard(cardElement, data._id)
  // );

  // cardImage.addEventListener("click", () => {
  //   openModal(previewModal);
  //   previewModalCaptionEl.textContent = data.name;
  //   previewModalImageEl.src = data.link;
  //   previewModalImageEl.alt = data.name;
  // });

  // return cardElement;
  if (
    Array.isArray(data.likes) &&
    data.likes.some((user) => user._id === currentUserId)
  ) {
    likeButton.classList.add("card__like-btn_liked");
  }

  likeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
  });

  return cardElement;
}

function handleeditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, true);
    });
}

function handlecardFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCard({
      name: cardModalNameInput.value,
      link: cardModalLinkInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      evt.target.reset();
      disabledButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, true);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      document.getElementById("image-avatar").src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, true);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, true, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, cardId) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_liked");

  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      // Toggle the like class manually based on previous state
      likeButton.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormInput,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});
editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});
cardModalCloseBttn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

editFormInput.addEventListener("submit", handleeditFormSubmit);
cardFormInput.addEventListener("submit", handlecardFormSubmit);

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarModalCloseBttn.addEventListener("click", () => {
  closeModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

editModal.addEventListener("click", (evt) => {
  if (evt.target === editModal) {
    closeModal(editModal);
  }
});

cardModal.addEventListener("click", (evt) => {
  if (evt.target === cardModal) {
    closeModal(cardModal);
  }
});

previewModal.addEventListener("click", (evt) => {
  if (evt.target === previewModal) {
    closeModal(previewModal);
  }
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    console.log("Closing modal:", modal);
    if (modal) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
