import {pokeApi} from '../../config/api/pokeApi';
import type {Pokemon} from '../../domain/entities/pokemon';
import { 
    PokeAPIPaginatedResponse, 
    PokeAPIPokemon 
} from '../../infraestructure/interfaces/pokepi.interfaces';
import { PokemonMapper } from '../../infraestructure/mappers/pokemon.mapper';


export const getPokemons = async (page: number, limit: number = 20,): Promise<Pokemon[]> => {
    try {
        const url = `/pokemon?offset=${page * 10}&limit=${limit}`;
        const {data} = await pokeApi.get<PokeAPIPaginatedResponse>(url);

        const pokemonPromises = data.results.map(info => {
        return pokeApi.get<PokeAPIPokemon>(info.url);
        });

        const pokeApiPokemons = await Promise.all(pokemonPromises);
        const pokemonsPromises = pokeApiPokemons.map(item =>
        PokemonMapper.pokeApiPokemonToEntity(item.data),
        );

        console.log(pokemonsPromises[0]);

        return await Promise.all(pokemonsPromises);

    } catch (error) {
        console.log(error);
        throw new Error('Error getting pokemons');
    }
};