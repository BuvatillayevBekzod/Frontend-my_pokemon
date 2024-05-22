import React, { useState, useEffect } from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import Axios from "axios";

const Main = () => {
    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [pokeDex, setPokeDex] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [pokemonChosen, setPokemonChosen] = useState(false);
    const [pokemonName, setPokemonName] = useState("");
    const [pokemon, setPokemon] = useState({
        name: "",
        species: "",
        img: "",
        hp: "",
        attack: "",
        defense: "",
        type: "",
        weight: "",
        speed: "",
        s_attack: "",
        s_defense: "",
    });
    const searchPokemon = () => {
        Axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(
            (response) => {
                console.log(response);
                setPokemon({
                    name: pokemonName,
                    species: response.data.species.name,
                    img: response.data.sprites.front_default,
                    hp: response.data.stats[0].base_stat,
                    attack: response.data.stats[1].base_stat,
                    defense: response.data.stats[2].base_stat,
                    type: response.data.types[0].type.name,
                    weight: response.data.weight,
                    speed: response.data.stats[5].base_stat,
                    s_defense: response.date.stats[4].base_stat,
                    s_attack: response.data.stats[3].base_stat,
                });
                setPokemonChosen(true);
            }
        );
    };

    const pokeFun = async () => {
        setLoading(true);
        const res = await Axios.get(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemon(res.data.results);
        setLoading(false);
    };

    const getPokemon = async (res) => {
        res.map(async (item) => {
            const result = await Axios.get(item.url);
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
            <div className="container">
                <nav className="navbar">
                    <div className="navbar-search">
                        <input
                            type="text"
                            placeholder="Search by name or ID"
                            onChange={(event) => {
                                setPokemonName(event.target.value);
                            }}
                        />
                        <button onClick={searchPokemon}>send</button>
                    </div>{" "}
                    <div className="DisplaySection">
                        {!pokemonChosen ? (
                            <h1> Please choose a Pokemon</h1>
                        ) : (
                            <>
                                <div className="top">
                                    <h1>{pokemon.name}</h1>
                                    <img src={pokemon.img} />
                                    <div className="group">
                                        <h3>
                                            Name:{" "}
                                            <span>{pokemon.species} </span>
                                        </h3>
                                        <h3>
                                            Type: {" "}<span>{pokemon.type}</span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="base-stat">
                                    <h4>
                                        Hp: <span>{pokemon.hp}</span>{" "}
                                    </h4>
                                    <h4>
                                        Attack: <span>{pokemon.attack}</span>
                                    </h4>
                                    <h4>Special-attack: <span>{pokemon.s_attack}</span></h4>
                                    <h4>
                                        Defense: <span>{pokemon.defense}</span>
                                    </h4>
                                    <h4>Special-defense: <span>{pokemon.s_defense}</span> </h4>
                                    <h4>
                                        Speed: <span>{pokemon.speed}</span>
                                    </h4>
                                    <h4>
                                        Weight: <span>{pokemon.weight}</span>
                                    </h4>
                                </div>
                            </>
                        )}
                    </div>
                </nav>{" "}
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
