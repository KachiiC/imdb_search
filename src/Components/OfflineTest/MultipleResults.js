import React from 'react'

const MultipleResults = (props) => {

    const searchResults = props.results

    const listOfresults = searchResults.map((result) => (
            <h1>{result.title}</h1>
        )
    )

    return(
        <div>
            {listOfresults}
        </div>
    )
}

export default MultipleResults