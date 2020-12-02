import React, { useState} from 'react'
import { useEffect } from 'react'
// Components
import SuccessfulResult from './SuccessfulResult'
import MultipleResults from './MultipleResults'
import NoResults from './NoResults'
import RapidApi_key from 'Api_key/RapidApi_key'
import RapidURL from 'Api_key/RapidURL'

const SearchComponent = () => {
    
    const [inputName, setInputName] = useState("")
    const [showId, setShowId] = useState("")
    const [showSearchResults, setShowSearchResults] = useState([])
    const [displayResults, setDisplayResults] = useState(false)
    const [showTitle, setShowTitle] = useState("")
    const [showPoster, setShowPoster] = useState("")
    const [showDescription, setShowDescription] = useState("")
    const [showGenres, setShowGenres] = useState([])
    
    const handleSubmit = data => {
        data.preventDefault()
        const inputData = document.getElementById("input_name").value
        setInputName(inputData)
    }

    const inputUrl = inputName.split(" ").join("%20")

    useEffect(()=> {
        if (inputName !== "") {
            fetch(`${RapidURL}?type=get-shows-by-title&title=${inputUrl}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": RapidApi_key,
                    "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
                }
            })
            .then(response => response.json())
            .then((responseData) => {
                responseData.search_results === 1 ? setShowId(responseData.tv_results[0].imdb_id):
                (responseData.search_results !== 0 ?  
                    responseData.tv_results.filter((show) => {
                        show.title.toUpperCase() === inputName.toUpperCase() ? 
                        setShowId(show.imdb_id) : setShowId("")
                    }): setShowId("")
                )
                responseData.search_results !== 0 ? 
                setShowSearchResults(responseData.tv_results.map(result => result.title)):
                setShowSearchResults([])
                setDisplayResults(true)
            })
            .catch(err => {
                console.error(err);
            });
        }
    },[inputName,inputUrl])

    console.log(showId)

    useEffect(() => {
        if (showId !== "") {
            Promise.all([
                fetch(`${RapidURL}?imdb=${showId}&type=get-show-images-by-imdb`, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": RapidApi_key,
                        "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
                    }
                }).then(response => response.json()),
                fetch(`${RapidURL}?imdb=${showId}&type=get-show-details`, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": RapidApi_key,
                        "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
                    }
                }).then(response => response.json())
            ])
            .then(responseData => {
                setShowTitle(responseData[0].title)
                setShowPoster(responseData[0].poster)
                setShowDescription(responseData[1].description.split("").slice(0,330).join(""))
                setShowGenres(responseData[1].genres)
            })
            .catch(err => console.error(err))
        }
    },[showId])

    const renderLogic = showId !== "" ? (
        <SuccessfulResult 
            title={showTitle}
            image={showPoster}
            description={showDescription}
            genres={showGenres}
        />
    ):(
        showSearchResults.length === 0 ? (
            <NoResults searched={inputName} />
        ): 
            <MultipleResults results={showSearchResults} />
        )

    return (
        <div>
            <h1>Imdb search</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    id="input_name"
                    className="input_search" 
                />
            </form>
            { displayResults && (
                <div className="components-row">
                    {renderLogic}
                </div>
            )}
        </div>
    );

}

export default SearchComponent