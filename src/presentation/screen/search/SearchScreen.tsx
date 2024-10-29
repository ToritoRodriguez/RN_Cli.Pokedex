import {FlatList, StyleSheet, View} from 'react-native';
import {globalTheme} from '../../../config/theme/global-theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator, TextInput, Text} from 'react-native-paper';
import {PokemonCard} from '../../components/pokemons/PokemonCard';
import {useQuery} from '@tanstack/react-query';
import {useMemo, useState} from 'react';
import {FullScreenLoader} from '../../components/ui/FullScreenLoader';
import { PokeballBg } from '../../components/ui/PokeballBg';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { getPokemonNamesWithId } from '../../../actions/pokemons/get-pokemon-names-with-id';
import { getPokemonsByIds } from '../../../actions/pokemons/get-pokemons-by-ids';

export const SearchScreen = () => {
    const {top} = useSafeAreaInsets();
    const [term, setTerm] = useState('');

    const debouncedValue = useDebouncedValue(term);

    const {isLoading, data: pokemonNameList = []} = useQuery({
        queryKey: ['pokemons', 'all'],
        queryFn: () => getPokemonNamesWithId(),
    });

    const pokemonNameIdList = useMemo(() => {
        // Es un número
        if (!isNaN(Number(debouncedValue))) {
        const pokemon = pokemonNameList.find(
            pokemon => pokemon.id === Number(debouncedValue),
        );
        return pokemon ? [pokemon] : [];
        }

        if (debouncedValue.length === 0) return [];
        if (debouncedValue.length < 3) return [];

        return pokemonNameList.filter(pokemon =>
        pokemon.name.includes(debouncedValue.toLocaleLowerCase()),
        );
    }, [debouncedValue]);

    const {isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
        queryKey: ['pokemons', 'by', pokemonNameIdList],
        queryFn: () =>
        getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <View style={[globalTheme.globalMargin, {paddingTop: top + 10, flex: 1}]}>
        <TextInput
            placeholder="Buscar Pokémon"
            mode="flat"
            autoFocus
            autoCorrect={false}
            onChangeText={setTerm}
            value={term}
        />

        {isLoadingPokemons && <ActivityIndicator style={{paddingTop: 20}} />}

        <FlatList
            data={pokemons}
            keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
            numColumns={2}
            style={{paddingTop: top + 20}}
            renderItem={({item}) => <PokemonCard pokemon={item} />}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={ <View style={{ height: 150 }} />}
        />

        <PokeballBg style={ style.pokeballBg }  />
        </View>
    );
};

const style = StyleSheet.create({
    pokeballBg: {
        position: 'absolute',
        bottom: -50,
        left: -100,
        opacity: 0.5,
        width: 300,
        height: 300,
        zIndex: -1
    }
})