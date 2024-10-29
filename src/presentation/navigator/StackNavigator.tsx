import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screen/home/HomeScreen';
import { PokemonScreen } from '../screen/pokemon/PokemonScreen';
import { SearchScreen } from '../screen/search/SearchScreen';

export type RootStackParamList = {
    HomeScreen: undefined;
    PokemonScreen: { pokemonId: number };
    SearchScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
    return (
        <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="PokemonScreen" component={PokemonScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        </Stack.Navigator>
    );
}