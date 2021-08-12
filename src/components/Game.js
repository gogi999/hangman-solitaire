import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Game.css';
import Header from './Header';
import Figure from './Figure';
import WrongLetters from './WrongLetters';
import Word from './Word';
import Popup from './Popup';
import Notification from './Notification';
import { showNotification as show } from '../helpers';

const Game = () => {
    const [playable, setPlayable] = useState(false);
    const [correctLetters, setCorrectLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [selectedWord, setSelectedWord] = useState('');

    useEffect(() => {
        async function getData() {
            let response = await axios.get(
                'https://random-words-api.vercel.app/word'
            );
            setSelectedWord(response.data[0].word.toLowerCase());
            setPlayable(true);
        }
        return getData();
    }, [playable]);

    useEffect(() => {
        const handleKeydown = (e) => {
            const { key, keyCode } = e;
            if (playable && keyCode >= 65 && keyCode <= 90) {
                const letter = key.toLowerCase();

                if (selectedWord.includes(letter)) {
                    if (!correctLetters.includes(letter)) {
                        setCorrectLetters(currLetters =>
                            [...currLetters, letter]
                        );
                    } else {
                        show(setShowNotification);
                    }
                } else {
                    if (!wrongLetters.includes(letter)) {
                        setWrongLetters(wrongLetters =>
                            [...wrongLetters, letter]
                        );
                    } else {
                        show(setShowNotification);
                    }
                }
            }
        }

        window.addEventListener('keydown', handleKeydown);

        return () =>
            window.removeEventListener('keydown', handleKeydown);
    }, [correctLetters, wrongLetters, playable]);

    const playAgain = () => {
        setPlayable(false);
        setCorrectLetters([]);
        setWrongLetters([]);
    }

    return (
        <>
            <Header />
            <div className="game-container">
                <Figure wrongLetters={wrongLetters} />
                <WrongLetters wrongLetters={wrongLetters} />
                <Word
                    selectedWord={selectedWord}
                    correctLetters={correctLetters}
                />
            </div>
            <Popup
                correctLetters={correctLetters}
                wrongLetters={wrongLetters}
                selectedWord={selectedWord}
                setPlayable={setPlayable}
                playAgain={playAgain}
            />
            <Notification showNotification={showNotification} />
        </>
    );
}

export default Game;
