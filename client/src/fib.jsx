import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const Fib = (props) => {
    const [seenIndexes,setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index,setIndex] = useState(''); 

    const fetchValues = async () => {
        const valuesRes = await axios.get("/api/values/current");
        setValues(valuesRes.data);
    }

    const fetchIndex = async () => {
        const seenIndexesRes = await axios.get("/api/values/all");
        setSeenIndexes(seenIndexesRes.data);
    }

    useEffect(() => {
        fetchValues();
        fetchIndex();
    },[]);

    
    const renderSeenIndex = () => {
        return seenIndexes.map(({number}) => number).join(", ");
    }
    
    const renderValues = () => {
        const entries = [];
        for(let key in values){
            entries.push(
                <div key={key}>
                    For index {key} I calculated {value[key]}
                </div>
            )
        }
        return entries;
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/values', {
            index: index
        });
        setIndex("");
    }

    return <div>
        <form >
            <label>Enter your index: </label>
            <input value={index} onChange={e => setIndex(e.target.value)} name="index" id="index" />
            <input type="submit" value="Submit" />
        </form>

        <h3>Indicies I have seen</h3>
        {renderSeenIndex()}
        <h3>Calculated Value</h3>
        {renderValues()}
    </div>
}

export default Fib;