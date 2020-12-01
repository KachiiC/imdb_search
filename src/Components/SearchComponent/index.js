import React,{useState, useEffect} from 'react'


const SearchComponent = () => {
    
    const [inputName, setInputName] = useState("")
    const [showData, setShowData] = useState({"tv_results": [{ "title": "", "imdb_id": ""}]})
    const [showPoster, setShowPoster] = useState("")
    const [showResults, setShowResults] = useState(false)
    
    const handleSubmit = data => {
        data.preventDefault()
        const inputData = document.getElementById("input_name").value
        setInputName(inputData.split(" ").join("%20"))
    }

    useEffect(()=> {
        if (inputName !== "") {
        fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-shows-by-title&title=${inputName}`, {
            "method": "GET",
            "headers": {
            "x-rapidapi-key": "985371e109mshb5666c0424d5dcfp1b7485jsndf2afe5a3591",
            "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
            }
        })
        .then(response => response.json())
        .then((responseData) => {
            setShowData(responseData)
            setShowResults(true)
        })
        .catch(err => {
            console.error(err);
        });
        }
    },[inputName])

    useEffect(() => {
        fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?imdb=${showData.tv_results[0].imdb_id}&type=get-show-images-by-imdb`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "985371e109mshb5666c0424d5dcfp1b7485jsndf2afe5a3591",
            "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
        }
        })
        .then(response => response.json())
        .then(responseImageData => setShowPoster(responseImageData.poster))
        .catch(err => console.error(err))
    },[showData])


    const showName = showData.tv_results[0].title

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
                <div>
                    <h1>{showName}</h1>
                    <img src={showPoster} alt="show_image"/>
                </div>
            )}
        </div>
    );

}

export default SearchComponent