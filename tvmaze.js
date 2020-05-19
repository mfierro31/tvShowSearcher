// Link to exercise - http://curric.rithmschool.com/springboard/exercises/apis-tvmaze/
// See Springboard version for better solution

/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get('https://api.tvmaze.com/search/shows', { params: { q: query } });
  const showArr = [];

  for (let show of res.data) {
    if (!show.show.image) {
      show.show.image = {
        medium: 'https://tinyurl.com/tv-missing'
      };
    }

    const obj = {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image.medium
    }

    showArr.push(obj);
  }

  return showArr;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card mb-5" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary ep-btn" data-show-id="${show.id}" data-toggle="modal" data-target="#ep-modal">Episodes</button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  let shows = await searchShows(query);

  populateShows(shows);
});

$('body').on('click', '.ep-btn', epBtnClick);
// The .on() jquery method already expects an event parameter to be passed in, so we don't have to
// explicitly write that here

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);

  const epArr = [];

  for (let ep of res.data) {
    const epObj = {
      id: ep.id,
      name: ep.name,
      season: ep.season,
      number: ep.number
    }

    epArr.push(epObj);
  }

  // console.log(epArr);
  return epArr;
}

function populateEpisodes(epArr) {
  const $epList = $('#episodes-list');
  $epList.empty();
  for (let ep of epArr) {
    $(`<li><p>ID#: ${ep.id}</p><p>Name: ${ep.name}</p><p>Season: ${ep.season}</p><p>Number: ${ep.number}</p></li>`).appendTo($epList);
  }
}

async function epBtnClick(event) {
  const $showId = event.target.dataset.showId;
  const $episodesArray = await getEpisodes($showId);
  populateEpisodes($episodesArray);
}