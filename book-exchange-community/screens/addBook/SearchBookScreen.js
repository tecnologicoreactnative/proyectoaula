import React, {useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import CompInput from "../../components/CompInput";
import CompButton from "../../components/CompButton";
import {searchBooks} from "../../services/ServiceBooks";


export default function SearchBookScreen({navigation}) {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);

    const handleSearch = async () => {
        const results = await searchBooks(query);
        setBooks(results);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searcher}>
                <CompInput placeholder="Ingresa el título o autor" onChangeText={setQuery}/>
                <CompButton text="Buscar Libros" onPress={handleSearch}/>
            </View>
            <View style={styles.list}>
                <FlatList
                    data={books}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => {
                        const {title, authors, imageLinks} = item.volumeInfo;
                        return (
                            <TouchableOpacity style={styles.item}
                                              onPress={() => navigation.navigate('AddBookDetailsScreen', {idBook: item.id})}>
                                <Image source={{uri: imageLinks?.smallThumbnail}} style={styles.image}/>
                                <View style={styles.description}>
                                    <Text style={styles.title}>{title}</Text>
                                    <Text>{authors?.join(', ')}</Text>
                                    <Text>{item.volumeInfo.publishedDate}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    searcher: {
        flex: 1,
        padding: 0,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    list: {
        flex: 5,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.07)',
        padding: 5,
        marginVertical: 5,
        borderRadius: 10,
        width: '80%',
    },
    image: {
        height: 200,
        width: 150,
        margin: 5,

        borderRadius: 5,
        mode: 'cover',
    },
    description: {
        margin: 1,
        padding: 1,
        flexShrink: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    title: {
        fontWeight: '800',
        fontSize: 18,
    },
};
