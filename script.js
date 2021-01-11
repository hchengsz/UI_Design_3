const model = {
    movieData: [],
    currentPage: null,
    totalPage: null,
    likedMovie: []
};

const baseUrl = "https://api.themoviedb.org/3/movie/";
const myKey = "?api_key=bb8c35abad01decf94d738c76ecd3cb7";
const image = "https://www.themoviedb.org/t/p/w1280/";
let pageNum = 1;
const mySelection = document.getElementById("form");

const fetchMovies = (movies) => {
    return fetch(`${baseUrl}${movies}${myKey}&page=${pageNum}`)
        .then((resp) => {
            if (resp.ok) {
                return resp.json();
            } else {
                console.error("error!");
            }
        })
        .then((movies) => {
            model.movieData = movies.results;
            model.currentPage = movies.page;
            model.totalPage = movies.total_pages;
        });
};

const fetchLikedMovie = (moive) => {
    return fetch(`${baseUrl}${moive}${myKey}&language=en-US`)
        .then((resp) => {
            if (resp.ok) {
                return resp.json();
            } else {
                console.error("error!");
            }
        })
        .then((targetMovie) => {
            model.movieData.push(targetMovie);

        });
}

const loadData = () => {
    let index = mySelection.selectedIndex;
    let selectionValue = mySelection.options[index].value

    const fetchPromise = fetchMovies(selectionValue);
    fetchPromise.then(() => {
        updateView();
    });
};

const createCard = (movie) => {
    const div = document.createElement("div");
    div.className = "movie";
    let html = `<ion-icon name="heart-empty" class="icon-unlock"></ion-icon>
    <ion-icon name="heart" class="icon-lock" style="color: red;"></ion-icon>`

    if (model.likedMovie.find(function(id) { return id === parseInt(movie.id); })) {
        html = `<ion-icon name="heart-empty" class="icon-lock"></ion-icon>
        <ion-icon name="heart" class="icon-unlock" style="color: red;"></ion-icon>`
    }

    const innerHtml = `
    <img class="movie__img" id="${movie.id}" onclick="handleMovieListClick(this)" src="${image}${movie.poster_path}" />
    <h4 class="movie__name" id="${movie.id}" onclick="handleMovieListClick(this)">${movie.title}</h4>
    <div class="movie__data">
        <p class="movie__row">
        <a>
            <ion-icon name="star" class="icon-unlock" style="color: gold;"></ion-icon>
        </a>${movie.vote_average}</p>
        <p class="movie__row">
        <a class="lock" onclick="saveToLikedMovie(this)" id="${movie.id}">
            ${html}
        </a>
        </p>
    </div>`;
    div.innerHTML = innerHtml;
    return div;
};

const creatWindow = (movie) => {
    const div = document.createElement("div");
    div.className = "popWindow";

    const genreData = document.createElement("ul");
    genreData.className = "genre"
    genreData.innerHTML = "";

    for (let i = 0; i < movie.genres.length; i++) {
        const genre = document.createElement("li");
        genre.innerHTML = `${movie.genres[i].name}`

        genreData.appendChild(genre);
    }

    const productionData = document.createElement("ul");
    productionData.className = "production"
    productionData.innerHTML = "";

    for (let i = 0; i < movie.production_companies.length; i++) {
        const company = document.createElement("li");
        company.innerHTML = `<img src="${image}${movie.production_companies[i].logo_path}" style="height: 28px;"></img>`

        productionData.appendChild(company);
    }

    div.innerHTML = `
    <div id="close-button">
        <span onclick="closeWindow()">&#10007;</span>
    </div>
    <div class="data">
        <div id="image">
            <img class="poster" id="${movie.id}" onclick="handleMovieListClick(this)" src="${image}${movie.poster_path}" />
        </div>
        <div id="text">
            <h2>${movie.title}</h2>
            <h4>Overview</h4>
            <p id="overview">${movie.overview}</p>
            <h4>Genres</h4>
            ${genreData.outerHTML}
            <h4>Rating</h4>
            <p>${movie.vote_average}</p>
            <h4>Production Compaines</h4>
            ${productionData.outerHTML}
        </div>
    </div>
    `;
    return div;
}

const updateView = () => {
    if (model.movieData && model.movieData.length > 0) {
        const moviesContainer = document.querySelector(".movies");
        moviesContainer.innerHTML = "";
        model.movieData.forEach((movie) => {
            const movieCard = createCard(movie);
            moviesContainer.appendChild(movieCard);
        });

        const pageView = document.getElementById("page");
        pageView.innerHTML = `${model.currentPage} / ${model.totalPage}`;

        const obj = document.querySelector(".selectPage");
        obj.style.display = 'flex';
        const form = document.getElementById("form");
        form.disabled = false;

        const home = document.getElementById("home");
        home.classList.remove('hover-link');
        home.className = "base-line";

        const likedList = document.getElementById("likedList");
        likedList.classList.remove('base-line');
        likedList.className = "hover-link";
    }
};

const displayLikedList = () => {
    if (model.movieData.length > 0) {
        const moviesContainer = document.querySelector(".movies");
        moviesContainer.innerHTML = "";
        model.movieData.forEach((movie) => {
            const movieCard = createCard(movie);
            moviesContainer.appendChild(movieCard);
        });
    }
    const obj = document.querySelector(".selectPage");
    obj.style.display = 'none';
    const form = document.getElementById("form");
    form.disabled = true;

    const home = document.getElementById("home");
    home.classList.remove('base-line');
    home.className = "hover-link";

    const likedList = document.getElementById("likedList");
    likedList.classList.remove('hover-link');
    likedList.className = "base-line";
};

function updateNextPage() {
    if (pageNum > model.totalPage) {
        return;
    }
    pageNum += 1;
    loadData();
}

function updatePrevPage() {
    if (pageNum > 1) {
        pageNum -= 1;
        loadData();
    }
    return;
}

function saveToLikedMovie(movie) {
    if (model.likedMovie.find(function(id) { return id === parseInt(movie.id); })) {
        model.likedMovie.remove(parseInt(movie.id));
        localStorage.setItem("likedList", JSON.stringify(model.likedMovie));
        movie.innerHTML = `
        <ion-icon name="heart-empty" class="icon-unlock"></ion-icon>
        <ion-icon name="heart" class="icon-lock" style="color: red;"></ion-icon>`
        return;
    }
    model.likedMovie.push(parseInt(movie.id));
    localStorage.setItem("likedList", JSON.stringify(model.likedMovie));
    movie.innerHTML = `
    <ion-icon name="heart-empty" class="icon-lock"></ion-icon>
    <ion-icon name="heart" class="icon-unlock" style="color: red;"></ion-icon>`
    return;
}

function changCategory() {
    pageNum = 1;
    loadData();
    return;
}

function handleMovieListClick(e) {
    const background = document.getElementById('background');
    fetch(`${baseUrl}${e.id}${myKey}&language=en-US`)
        .then((resp) => {
            if (resp.ok) {
                return resp.json();
            } else {
                console.error("error!");
            }
        })
        .then((targetMovie) => {
            background.innerHTML = "";
            background.appendChild(creatWindow(targetMovie));
            background.style.display = "block";
        });
}

function handleLikedListClick() {
    model.movieData = [];
    let fetchPromise = null;
    model.likedMovie.forEach(element => {
        fetchPromise = fetchLikedMovie(element);
    });
    fetchPromise.then(() => {
        displayLikedList();
    });
    return;
}

function closeWindow() {
    const background = document.getElementById('background');
    background.style.display = "none";
    background.innerHTML = "";
}

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

const loadEvent = () => {
    if (JSON.parse(localStorage.getItem("likedList")) != null) {
        model.likedMovie = JSON.parse(localStorage.getItem("likedList"));
    }

    loadData();
    mySelection.addEventListener("change", changCategory);

    const next = document.querySelector(".nextPage");
    const prev = document.querySelector(".prevPage");
    next.addEventListener("click", updateNextPage);
    prev.addEventListener("click", updatePrevPage);

};

loadEvent();