import React, { useState, useEffect } from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from "axios";
import Navbar from "./Navbar"; // Import the Navbar component

const Main = () => {
    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [pokeDex, setPokeDex] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);

    const pokeFun = async () => {
        setLoading(true);
        const res = await axios.get(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemon(res.data.results);
        setLoading(false);
    };

    const getPokemon = async (res) => {
        res.map(async (item) => {
            const result = await axios.get(item.url);
            setPokeData((state) => {
                state = [...state, result.data];
                state.sort((a, b) => (a.id > b.id ? 1 : -1));
                return state;
            });
        });
    };

    useEffect(() => {
        pokeFun();
    }, [url]);

    // Filter Pokemon based on searchQuery
    const filteredPokemon = pokeData.filter((pokemon) =>
        pokemon.id.toString().includes(searchQuery)
    );

    // Function to handle search button click
    const handleSearch = () => {
        setSearching(true);
    };

    // Function to handle search input change
    const handleSearchInputChange = (value) => {
        setSearchQuery(value);
    };

    return (
        <>
            <Navbar onSearch={handleSearchInputChange} onSearchClick={handleSearch} /> {/* Include the Navbar component */}
            <div className="container">
                <div className="left-content scroll">
                    <Card
                        pokemon={searching ? filteredPokemon : pokeData}
                        loading={loading}
                        infoPokemon={(poke) => setPokeDex(poke)}
                    />
                    <div className="btn-group">
                        {prevUrl && (
                            <button
                                onClick={() => {
                                    setPokeData([]);
                                    setUrl(prevUrl);
                                }}
                            >
                                Previous
                            </button>
                        )}
                        {nextUrl && (
                            <button
                                onClick={() => {
                                    setPokeData([]);
                                    setUrl(nextUrl);
                                }}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
                <div className="right-content">
                    <Pokeinfo data={pokeDex} />
                </div>
            </div>
        </>
    );
};

export default Main;
