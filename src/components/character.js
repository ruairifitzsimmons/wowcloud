import { getCharacter } from '../utils/api';
import { useEffect, useState } from 'react';

export default function CharacterSearch() {
    //const [realm, setRealm] = useState('');
    //const [characterName, setCharacterName] = useState('');
    const [characterData, setCharacterData] = useState(null);

    useEffect(() => {
        async function searchCharacter() {
            try {
                const response = await getCharacter();
                setCharacterData(response);
            } catch (error) {
                console.error(error);
            }
        }
        searchCharacter();
    });

    return (
        <div>
            <h2>Character Search</h2>
            {characterData && (
                <div>
                    <h3>Character Data</h3>
                    <h1>{characterData.name}</h1>
                </div>
            )}
        </div>
    )
}