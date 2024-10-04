import React from 'react'
import "./dashboard.css"
import remove from "./remove.png"
function NoData() {
    return (
        <div className="noInfo">
            <img src={remove}></img>
            Žádné výdaje za toto období
        </div>
    )
}

export default NoData