import React, { useState } from 'react'
// Data
// import TvResults1 from 'Data/TvResults1'
import TvResults2 from 'Data/TvResults2'
import TvResultsImage from 'Data/TvResultsImage'
import TvResultsDetail from 'Data/TvResultsDetail'
// Components
import SuccessfulResult from './SuccessfulResult'
import MultipleResults from './MultipleResults'


const OfflineTest = () => {
    
    // eslint-disable-next-line
    const [showImage, setShowImage] = useState(TvResultsImage.poster)
    // eslint-disable-next-line
    const [showData, setShowData] = useState(TvResults2)
    // eslint-disable-next-line
    const [showDetail, setShowDetail] = useState(TvResultsDetail)

    const showName = showData.tv_results[0].title
    const showDescription = showDetail.description.split("").slice(0,330).join("")
    const showResults = showData.tv_results.map(result => result.title)
    
    const renderLogic = showData.search_results === 1 ? (
        <SuccessfulResult 
            title={showName}
            image={showImage}
            description={showDescription}
            genres={showDetail.genres}
        />
    ) : (
        <div>
            {showResults}
        </div>
    )

    return (
        <div className="components-row">
            {renderLogic}
        </div>
    )
}

export default OfflineTest