import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function AddBookForm() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');

    const handleTitleChange = (text) => {
        setTitle(text);
    };

    const handleAuthorChange = (text) => {
        setAuthor(text);
    };

    const handleAddBook = () => {
        console.log('Añadiendo libro:', title, author);
    };

    return (
        <View>
            <Text>Añadir libro</Text>
            <TextInput
                placeholder="Título"
                value={title}
                onChangeText={handleTitleChange}
            />
            <TextInput
                placeholder="Autor"
                value={author}
                onChangeText={handleAuthorChange}
            />
            <Button
                title="Añadir libro"
                onPress={handleAddBook}
            />
        </View>
    );
}