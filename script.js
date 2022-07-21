let dataArray = [];
let url;

// ******************
// GET DATA FROM FORM
function getData(form) {
	searchResult = form.movie.value;
	searchResult = searchResult.replace(" ", "+");
	url = `https://www.omdbapi.com/?s=${searchResult}&apikey=8d7ac59d`;

	displayData();
	lazyLoader();
}

// ***************
// FETCH ALL DATA
const getDataMovie = async () => {
	await fetch(url)
		.then((res) => res.json())
		.then((data) => (dataArray = data.Search))
		.catch((error) => console.log(error.message));
};

// DISPLAY ALL DATA
const displayData = async () => {
	await getDataMovie();
	const dataContainer = document.getElementById("display-data");

	dataArray.sort((a, b) => {
		return a.Year - b.Year;
	});

	dataContainer.innerHTML = dataArray
		.map(
			(value) => `
         <div class="movie-element">
            <div class="image-wrapper">         
               <img src="${value.Poster}" > </img> 
            </div>
            <div class="content-wrapper">
               <p class="title-all"> ${value.Title} - <span> ${value.Year}</span> </p>
               <button class="detail-btn" id="${value.imdbID}" onClick="getDetail(${value.imdbID})" > Voir le détail </button>
            </div>
         </div>
   `
		)
		.join(" ");
};

// ***************
// DISPLAY DETAIL DATA
let movieUrl;
let detailArray = [];
const popup = document.getElementById("popup");
const layer = document.getElementById("layer");

function getDetail(id) {
	movieUrl = `https://www.omdbapi.com/?i=${id.id}&apikey=8d7ac59d`;
	showEls();
	displayDataDetail();
}

const getDataMovieDetail = async () => {
	await fetch(movieUrl)
		.then((res) => res.json())
		.then((data) => (detailArray = data))
		.catch((error) => console.log(error.message));
};

const displayDataDetail = async () => {
	await getDataMovieDetail();
	popup.innerHTML = `
      <div class="popup-content">
         <div class="poster-wrapper">
            <img src="${detailArray.Poster}"> </img>      
         </div>
         <div class="pasdenom"> 
            <p class="title-all"> ${detailArray.Title}</p>
            <p class="plot"> ${detailArray.Plot}</p>
         </div>
         <p class="close-btn" onClick="closeBtn()"> X </p>
      </div>
   `;
};

function showEls() {
	popup.style.display = "flex";
	layer.style.display = "flex";
}

function closeBtn() {
	popup.style.display = "none";
	popup.innerHTML = "";
	layer.style.display = "none";
}

//**************** */
// Intersection Observer

let options = {
	threshold: 0.5,
};

let callback = function (entries) {
	entries.forEach((entry) => {
		if (entry.intersectionRatio > 0.5) {
			entry.target.classList.remove("not-visible");
		}
	});
};

const lazyLoader = async () => {
	await displayData();
	//
	let observer = new IntersectionObserver(callback, options);
	let items = document.querySelectorAll(".movie-element");
	items.forEach((item) => {
		item.classList.add("not-visible");
		observer.observe(item);
	});
};
