import React,{ useState, useEffect } from 'react'
// Components
import SuccessfulResult from './SuccessfulResult'
import MultipleResults from './MultipleResults'
import NoResults from './NoResults'
import RapidApi_key from '../../Api_key/RapidApi_key'

const SearchComponent = () => {

    const RapidURL = "https://movies-tvshows-data-imdb.p.rapidapi.com/"
    
    const [inputName, setInputName] = useState("")
    const [showData, setShowData] = useState({
        "tv_results": [{
                "title": "",
                "imdb_id": "",
            }
        ]
    })
    const [showId, setShowId] = useState("")
    const [showResults, setShowResults] = useState(false)
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
                responseData.search_results === 1 ? setShowId(responseData[0].imdb_id) :
                responseData.tv_results.map((result) => {
                    if (result.title === inputName) {
                        return setShowId(result.imdb_id)
                    }
                })
                setShowData(responseData)
                setShowResults(true)
            })
            .catch(err => {
                console.error(err);
            });
        }
    },[inputName, inputUrl])

    useEffect(() => {
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
            setShowPoster(responseData[0].poster)
            setShowDescription(responseData[1].description.split("").slice(0,330).join(""))
            setShowGenres(responseData[1].genres)
        })
        .catch(err => console.error(err))
    },[showId])

    const showName = showData.tv_results[0].title
    const resultsList = showData.tv_results.map(result => result.title)

    console.log(inputName)
    console.log(showId)

    const renderLogic = showData.search_results !== 1 ? (
        showData.search_results !== 0 ? ( 
            <MultipleResults
                results={resultsList} 
            />
        ) : (
            <NoResults
                searched={inputName}
            />
        )
    ): (
        <SuccessfulResult 
            title={showName}
            image={showPoster}
            description={showDescription}
            genres={showGenres}
        />
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
            { showResults && (
                <div className="components-row">
                    {renderLogic}
                </div>
            )}
        </div>
    );

}

export default SearchComponent