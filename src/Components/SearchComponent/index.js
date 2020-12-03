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
    const [showMetdata, setShowMetadata] = useState({
        "title": "",
        "poster": "",
        "description": "",
        "genres": [] 
    })
    
    const handleSubmit = data => {
        data.preventDefault()
        const inputData = document.getElementById("input_name").value
        setInputName(inputData)
    }

    useEffect(()=> {
        if (inputName !== "") {
            const inputUrl = inputName.split(" ").join("%20")
            fetch(`${RapidURL}?type=get-shows-by-title&title=${inputUrl}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": RapidApi_key,
                    "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
                }
            })
            .then(response => response.json())
            .then((response) => {
                setDisplayResults(false)
                if (response.search_results === 0) {
                    setShowId("")
                    setShowSearchResults([])
                    setDisplayResults(true)
                } else {
                    if (response.search_results > 1) {
                        const exactMatch = response.tv_results.find((show) => { 
                            return show.title.toUpperCase() === inputName.toUpperCase()
                        })
        
                        if (exactMatch === undefined) {
                            setShowId("")
                            setShowSearchResults(response.tv_results.map(result => result.title))
                            setDisplayResults(true) 
                        } else {
                            setShowId(exactMatch.imdb_id)
                        }
                    } else {
                        setShowId(response.tv_results[0].imdb_id)
                    }
                }
            })
            .catch(err => {
                console.error(err);
            });
        }
    },[inputName])

    console.log(showId) //TODO: please remove

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
                setShowMetadata({
                    "title": responseData[0].title,
                    "poster": responseData[0].poster,
                    "description": responseData[1].description.split("").slice(0,330).join(""),
                    "genres": responseData[1].genres
                })
                setDisplayResults(true)
            })
            .catch(err => console.error(err))
        }
    },[showId])

    const renderLogic = showId !== "" ? (
        <SuccessfulResult 
            title={showMetdata.title}
            image={showMetdata.poster}
            description={showMetdata.description}
            genres={showMetdata.genres}
        />
    ):(
        showSearchResults.length === 0 ? (
            <NoResults searched={inputName} />
        ):<MultipleResults results={showSearchResults} />
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