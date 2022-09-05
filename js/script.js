const books = [];
const RENDER_EVENT = 'render-book';


function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function findBook(bookId) {
  for (const bookItem of books) {

    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {

  const { id, title, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis :' + ' ' + author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun : ' + ' ' + year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('item');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);



  if (isCompleted) {

    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.innerText = 'Belum dibaca'
    undoButton.addEventListener('click', function () {
      undotitleFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.innerText = 'Hapus Buku'
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function () {
      let text = "yakin dihapus???";
      if (confirm(text) == true) {

        removetitleFromCompleted(id);
      }
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.innerText = 'Sudah dibaca'
    checkButton.classList.add('check-button');

    checkButton.addEventListener('click', function () {
      addtitleToCompleted(id);
    });
    const trashButton = document.createElement('button');
    trashButton.innerText = 'Hapus Buku'
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      let text = "yakin dihapus???";
      if (confirm(text) == true) {

        removetitleFromCompleted(id);
      }
    });

    container.append(checkButton, trashButton);
  }
  return container;
}

function addBook() {
  const textTitle = document.getElementById('title').value;
  const textAuthor = document.getElementById('author').value;
  const textYear = document.getElementById('year').value;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, false)
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addtitleToCompleted(bookId /* HTMLELement */) {

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removetitleFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undotitleFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm /* HTMLFormElement */ = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});


document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('books');
  const listCompleted = document.getElementById('completed-books');

  // clearing list item
  uncompletedBOOKList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {

    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});

function saveData() {

  if (isStorageExist()) {

    const parsed = JSON.stringify(books);

    localStorage.setItem(STORAGE_KEY, parsed);

    document.dispatchEvent(new Event(SAVED_EVENT));

  }

}

const SAVED_EVENT = 'saved-book';

const STORAGE_KEY = 'BOOK_STORAGE';

function isStorageExist() {

  if (typeof (Storage) === undefined) {

    alert('Browser kamu tidak mendukung local storage');

  } else {

    return true;

  }


}




function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (let book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
