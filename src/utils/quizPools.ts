import { QuizQuestion } from '../types';

export function getEnglishABCQuestions(): QuizQuestion[] {
  return [
    {
      id: 'abc_1',
      type: 'multiple_choice',
      questionText: 'Which letter comes after A?',
      speakText: 'Which letter comes after A?',
      options: ['B', 'C', 'D', 'E'],
      correctAnswer: 'B',
      emojiHint: '🔤'
    },
    {
      id: 'abc_2',
      type: 'multiple_choice',
      questionText: 'Which letter comes after M?',
      speakText: 'Which letter comes after M?',
      options: ['N', 'O', 'P', 'Q'],
      correctAnswer: 'N',
      emojiHint: '🔤'
    }
  ];
}

export function getEnglishABCLowerQuestions(): QuizQuestion[] {
  return [
    {
      id: 'abc_lower_1',
      type: 'multiple_choice',
      questionText: 'What is the lowercase of A?',
      speakText: 'What is the lowercase of A?',
      options: ['a', 'b', 'c', 'd'],
      correctAnswer: 'a'
    }
  ];
}

export function getEnglishWordsQuestions(): QuizQuestion[] {
  return [
    {
      id: 'words_1',
      type: 'multiple_choice',
      questionText: 'What word starts with A?',
      speakText: 'What word starts with A?',
      options: ['Apple', 'Ball', 'Cat', 'Dog'],
      correctAnswer: 'Apple',
      emojiHint: '🍎'
    }
  ];
}

export function getEnglishNumbersQuestions(): QuizQuestion[] {
  return [
    {
      id: 'num_1',
      type: 'multiple_choice',
      questionText: 'Count the apples: 🍎🍎🍎',
      speakText: 'How many apples are there?',
      options: ['1', '2', '3', '4'],
      correctAnswer: '3'
    }
  ];
}

export function getEnglishSpellingsQuestions(): QuizQuestion[] {
  return [
    {
      id: 'spelling_1',
      type: 'multiple_choice',
      questionText: 'Spell the number 1',
      speakText: 'Spell the number 1',
      options: ['One', 'Two', 'Three', 'Four'],
      correctAnswer: 'One',
      emojiHint: '1️⃣'
    },
    {
      id: 'spelling_2',
      type: 'multiple_choice',
      questionText: 'Spell the number 2',
      speakText: 'Spell the number 2',
      options: ['Two', 'One', 'Ten', 'To'],
      correctAnswer: 'Two',
      emojiHint: '2️⃣'
    },
    {
      id: 'spelling_3',
      type: 'multiple_choice',
      questionText: 'Spell the number 3',
      speakText: 'Spell the number 3',
      options: ['Three', 'Tree', 'Free', 'Thirty'],
      correctAnswer: 'Three',
      emojiHint: '3️⃣'
    },
    {
      id: 'spelling_5',
      type: 'multiple_choice',
      questionText: 'Spell the number 5',
      speakText: 'Spell the number 5',
      options: ['Five', 'Four', 'Six', 'Three'],
      correctAnswer: 'Five',
      emojiHint: '5️⃣'
    },
    {
      id: 'spelling_7',
      type: 'multiple_choice',
      questionText: 'Spell the number 7',
      speakText: 'Spell the number 7',
      options: ['Seven', 'Sever', 'Eleven', 'Six'],
      correctAnswer: 'Seven',
      emojiHint: '7️⃣'
    },
    {
      id: 'spelling_10',
      type: 'multiple_choice',
      questionText: 'Spell the number 10',
      speakText: 'Spell the number 10',
      options: ['Ten', 'Tin', 'Two', 'One'],
      correctAnswer: 'Ten',
      emojiHint: '🔟'
    }
  ];
}

export function getEnglishTablesQuestions(): QuizQuestion[] {
  return [
    {
      id: 'tables_1',
      type: 'multiple_choice',
      questionText: 'What is 2 x 3?',
      speakText: 'What is 2 times 3?',
      options: ['6', '5', '8', '4'],
      correctAnswer: '6'
    }
  ];
}

export function getEnglishVoiceSpellingQuestions(): QuizQuestion[] {
  return [
    {
      id: 'voice_1',
      type: 'voice',
      questionText: 'Speak or spell aloud: "CAT"',
      speakText: 'Speak or spell the word CAT',
      options: ['CAT', 'DOG', 'BAT', 'RAT'],
      correctAnswer: 'CAT',
      emojiHint: '🐱'
    },
    {
      id: 'voice_2',
      type: 'voice',
      questionText: 'Speak or spell aloud: "DOG"',
      speakText: 'Speak or spell the word DOG',
      options: ['DOG', 'CAT', 'PIG', 'FOX'],
      correctAnswer: 'DOG',
      emojiHint: '🐶'
    },
    {
      id: 'voice_3',
      type: 'voice',
      questionText: 'Speak or spell aloud: "APPLE"',
      speakText: 'Speak or spell the word APPLE',
      options: ['APPLE', 'BANANA', 'MANGO', 'ORANGE'],
      correctAnswer: 'APPLE',
      emojiHint: '🍎'
    },
    {
      id: 'voice_4',
      type: 'voice',
      questionText: 'Speak or spell aloud: "BALL"',
      speakText: 'Speak or spell the word BALL',
      options: ['BALL', 'BELL', 'DOLL', 'BULL'],
      correctAnswer: 'BALL',
      emojiHint: '⚽'
    },
    {
      id: 'voice_5',
      type: 'voice',
      questionText: 'Speak or spell aloud: "SUN"',
      speakText: 'Speak or spell the word SUN',
      options: ['SUN', 'SON', 'MOON', 'STAR'],
      correctAnswer: 'SUN',
      emojiHint: '☀️'
    },
    {
      id: 'voice_6',
      type: 'voice',
      questionText: 'Speak or spell aloud: "MOON"',
      speakText: 'Speak or spell the word MOON',
      options: ['MOON', 'SUN', 'STAR', 'SKY'],
      correctAnswer: 'MOON',
      emojiHint: '🌙'
    },
    {
      id: 'voice_7',
      type: 'voice',
      questionText: 'Speak or spell aloud: "FISH"',
      speakText: 'Speak or spell the word FISH',
      options: ['FISH', 'DISH', 'BIRD', 'FROG'],
      correctAnswer: 'FISH',
      emojiHint: '🐟'
    },
    {
      id: 'voice_8',
      type: 'voice',
      questionText: 'Speak or spell aloud: "LION"',
      speakText: 'Speak or spell the word LION',
      options: ['LION', 'TIGER', 'BEAR', 'WOLF'],
      correctAnswer: 'LION',
      emojiHint: '🦁'
    }
  ];
}

export function getEnglishStoriesQuestions(): QuizQuestion[] {
  return [
    {
      id: 'stories_1',
      type: 'multiple_choice',
      questionText: 'Who won the race in the story?',
      speakText: 'Who won the race?',
      options: ['Tortoise', 'Hare', 'Fox', 'Bear'],
      correctAnswer: 'Tortoise'
    }
  ];
}

export function getGujaratiSwarQuestions(): QuizQuestion[] {
  return [
    {
      id: 'guj_swar_1',
      type: 'multiple_choice',
      questionText: 'ગુજરાતી સ્વર કયો છે?',
      speakText: 'ગુજરાતી સ્વર કયો છે?',
      options: ['અ', 'ક', 'ખ', 'ગ'],
      correctAnswer: 'અ'
    }
  ];
}

export function getGujaratiVyanjanQuestions(): QuizQuestion[] {
  return [
    {
      id: 'guj_vyanjan_1',
      type: 'multiple_choice',
      questionText: 'ક પછી કયો મૂળાક્ષર આવે?',
      speakText: 'ક પછી કયો મૂળાક્ષર આવે?',
      options: ['ખ', 'ગ', 'ઘ', 'ચ'],
      correctAnswer: 'ખ'
    }
  ];
}

export function getGujaratiBarakhadiQuestions(): QuizQuestion[] {
  return [
    {
      id: 'guj_barakhadi_1',
      type: 'multiple_choice',
      questionText: 'ક + આ = ?',
      speakText: 'ક વત્તા આ બરાબર શું થાય?',
      options: ['કા', 'કિ', 'કી', 'કુ'],
      correctAnswer: 'કા'
    }
  ];
}

export function getGujaratiNumbersQuestions(): QuizQuestion[] {
  return [
    {
      id: 'guj_num_1',
      type: 'multiple_choice',
      questionText: '૧ + ૧ = ?',
      speakText: 'એક વત્તા એક બરાબર શું થાય?',
      options: ['૨', '૩', '૧', '૪'],
      correctAnswer: '૨'
    }
  ];
}

export function getGujaratiGhadiyaQuestions(): QuizQuestion[] {
  return [
    {
      id: 'guj_ghadiya_1',
      type: 'multiple_choice',
      questionText: '૨ x ૨ = ?',
      speakText: 'બે દુ કેટલા થાય?',
      options: ['૪', '૬', '૨', '૮'],
      correctAnswer: '૪'
    }
  ];
}

export function getGujaratiVoiceSpellingQuestions(): QuizQuestion[] {
  return [
    {
      id: 'guj_voice_1',
      type: 'voice',
      questionText: 'બોલો અથવા સ્પેલિંગ બોલો: "કમળ"',
      speakText: 'માઇકમાં મોટેથી બોલો કમળ',
      options: ['કમળ', 'કાગડો', 'હાથી', 'સિંહ'],
      correctAnswer: 'કમળ',
      emojiHint: '🪷'
    },
    {
      id: 'guj_voice_2',
      type: 'voice',
      questionText: 'બોલો અથવા સ્પેલિંગ બોલો: "હાથી"',
      speakText: 'માઇકમાં મોટેથી બોલો હાથી',
      options: ['હાથી', 'ઘોડો', 'સિંહ', 'વાઘ'],
      correctAnswer: 'હાથી',
      emojiHint: '🐘'
    },
    {
      id: 'guj_voice_3',
      type: 'voice',
      questionText: 'બોલો અથવા સ્પેલિંગ બોલો: "સફરજન"',
      speakText: 'માઇકમાં મોટેથી બોલો સફરજન',
      options: ['સફરજન', 'કેરી', 'કેળું', 'દ્રાક્ષ'],
      correctAnswer: 'સફરજન',
      emojiHint: '🍎'
    },
    {
      id: 'guj_voice_4',
      type: 'voice',
      questionText: 'બોલો અથવા સ્પેલિંગ બોલો: "પતંગ"',
      speakText: 'માઇકમાં મોટેથી બોલો પતંગ',
      options: ['પતંગ', 'ચગડોળ', 'દડો', 'ભમરડો'],
      correctAnswer: 'પતંગ',
      emojiHint: '🪁'
    }
  ];
}

export function getGujaratiStoriesQuestions(): QuizQuestion[] {
  return [
    {
      id: 'guj_story_1',
      type: 'multiple_choice',
      questionText: 'કાગડાએ પાણી પીવા માટે ઘડામાં શું નાખ્યું?',
      speakText: 'કાગડાએ પાણી પીવા માટે ઘડામાં શું નાખ્યું?',
      options: ['કાંકરા', 'પાંદડા', 'કાગળ', 'માટી'],
      correctAnswer: 'કાંકરા'
    }
  ];
}
