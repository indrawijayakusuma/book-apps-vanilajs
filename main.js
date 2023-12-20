const books = [];
const RENDER_EVENT = 'render';
const STORAGE_KEY = 'TODO_APPS';

const sendData = () => {
    if(isStorageExist) {
        const dataConverted = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, dataConverted);
    }
}


function isStorageExist() {
    if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
    }
    return true;
}

const addBook = () => {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const checkbox = document.getElementById('inputBookIsComplete');    
    const isComplete = checkbox.checked;
    const id = +new Date();

    const bookObj  = {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete,
    }
    books.push(bookObj);
    document.dispatchEvent(new Event(RENDER_EVENT));
    sendData();
}

const moveToUnread = (id) => {
    const bookObj = books.find(book => book.id === id);
    bookObj.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    sendData();
}

const moveToReaded = (id) => {
    const bookObj = books.find(book => book.id === id);
    bookObj.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    sendData();
}

const deleteBook = (id) => {
    const index = books.findIndex(book => book.id === id);
    books.splice(index, 1)
    document.dispatchEvent(new Event(RENDER_EVENT));
    sendData();
}

const makeBook = ({id, title, author, year, isComplete}) => {
    const titleText = document.createElement('h3');
    titleText.classList.add('text-xl', 'font-semibold', 'mb-2');
    titleText.innerText = `${title}`;
    
    const penulis = document.createElement('p');
    penulis.innerText = `Penulis: ${author}`

    const tahun = document.createElement('p');
    tahun.innerText = `tahun: ${year}` 

    let button;

    if(isComplete) {
        button = document.createElement('button');
        button.classList.add('px-2', 'text-white', 'py-1', 'rounded-md', 'bg-[#374151]');
        button.innerText = 'Belum selesai di baca';
        button.addEventListener('click', () => {
            moveToUnread(id);
        })
    } else {
        button = document.createElement('button');
        button.classList.add('px-8', 'text-white', 'py-1', 'rounded-md', 'bg-[#374151]');
        button.innerText = 'Selesai di baca';
        button.addEventListener('click', () => {
            moveToReaded(id);
        })
    }

    const buttonHapus = document.createElement('button');
    buttonHapus.classList.add('px-2', 'text-white', 'py-1', 'rounded-md', 'bg-[#374151]');
    buttonHapus.innerText = 'Hapus Buku';
    buttonHapus.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                deleteBook(id);
            }
        })
    })

    const container =  document.createElement('div');
    container.classList.add('mt-3', 'flex', 'flex-col', 'gap-2');
    container.append(button, buttonHapus);

    const article = document.createElement('article');
    article.classList.add('shadow-lg', 'rounded-md', 'p-6');
    article.append(titleText, penulis, tahun, container);

    return article;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', (e) => {
    const form = document.getElementById('inputBook');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

const search = () => {
    const searchForm = document.getElementById('searchBook');
    let WordSearch;
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        document.dispatchEvent(new Event(RENDER_EVENT))
    })
    WordSearch = document.getElementById('searchBookTitle').value;
    return WordSearch;
}

document.addEventListener(RENDER_EVENT, () => {
    const WordSearch = search().toLowerCase();
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList =  document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerText = '';
    completeBookshelfList.innerText = '';
    let viewBook = [];

    if(!WordSearch) {
        viewBook = books;
    } else {
        viewBook = books.filter(book => book.title.toLowerCase().includes(WordSearch));
    }

    if (viewBook.filter(book => book.isComplete === true).length === 0){
        completeBookshelfList.innerText = 'tidak ada buku';
    }
    if (viewBook.filter(book => book.isComplete === false).length === 0) {
        incompleteBookshelfList.innerText = 'tidak ada buku';
    }


    for (const book of viewBook) {
        const bookList = makeBook(book); 

        if(book.isComplete) {
            completeBookshelfList.append(bookList);
        } else {
            incompleteBookshelfList.append(bookList);
        }
    }
})

