import React from "react";
import {Link} from "react-router-dom";

export default () => {
    console.log("other")
    return (
        <div>
            In some other page!
            <Link to="/">Go back Home</Link>
        </div>
    );
}