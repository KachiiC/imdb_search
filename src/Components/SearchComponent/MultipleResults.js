import React from 'react'

const MultipleResults = (props) => {

    const searchResults = props.results

    const listOfresults = searchResults.sort(() => 0.5 - Math.random()).slice(0,10).map((result, index) => 
        <h2 key={index}>{result}</h2>
    )

    return(
        <div className="multiple-results-container">
            {listOfresults}
        </div>
    )
}

export default MultipleResults