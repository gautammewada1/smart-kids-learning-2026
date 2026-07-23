import { ScreenType } from '../types';

export interface StoryChoice {
  text: string;
  gujText: string;
  nextPageId: string;
}

export interface StoryPage {
  id: string;
  illustration: string;
  illustrationBg: string;
  text: string;
  gujText: string;
  choices?: StoryChoice[];
  nextPageId?: string;
  imageUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  gujTitle: string;
  emoji: string;
  color: string;
  description: string;
  gujDescription: string;
  pages: StoryPage[];
  startPageId: string;
}

export const STORIES: Story[] = [
  {
    id: 'happy_puppy',
    title: "The Happy Puppy",
    gujTitle: "ખુશ કૂતરો",
    emoji: "🐶",
    color: "bg-[#FFD93D]", // Playful yellow
    description: "Read about a cute puppy finding a red ball!",
    gujDescription: "એક સુંદર લાલ બોલ મેળવનાર કૂતરા વિશે વાંચો!",
    startPageId: 'puppy_page1',
    pages: [
      {
        id: 'puppy_page1',
        illustration: "🐶🔴✨",
        illustrationBg: "bg-rose-100 dark:bg-rose-950/40",
        imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
        text: "The happy puppy sees a red ball.\n\nIt wants to play.",
        gujText: "ખુશ કૂતરાએ લાલ બોલ જોયો.\n\nતે રમવા માંગે છે.",
        choices: [
          {
            text: "Play with the Ball ⚽",
            gujText: "બોલ સાથે રમો ⚽",
            nextPageId: 'puppy_play_ball'
          },
          {
            text: "Run to the Tree 🌳",
            gujText: "ઝાડ તરફ દોડો 🌳",
            nextPageId: 'puppy_run_tree'
          }
        ]
      },
      // Choice 1 Path
      {
        id: 'puppy_play_ball',
        illustration: "🐶⚽💥",
        illustrationBg: "bg-amber-100 dark:bg-amber-950/40",
        imageUrl: "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=600&q=80",
        text: "The puppy kicks the ball.\n\nIt jumps high.",
        gujText: "કૂતરો બોલને લાત મારે છે.\n\nતે ઊંચું કૂદે છે.",
        nextPageId: 'puppy_girl_joins'
      },
      {
        id: 'puppy_girl_joins',
        illustration: "🐶👧✨",
        illustrationBg: "bg-sky-100 dark:bg-sky-950/40",
        imageUrl: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=600&q=80",
        text: "A little girl joins the game.\n\nThey laugh together.",
        gujText: "એક નાની છોકરી રમવામાં જોડાય છે.\n\nબંને હસે છે.",
        nextPageId: 'puppy_happy_finish'
      },
      {
        id: 'puppy_happy_finish',
        illustration: "🐶💖🏆",
        illustrationBg: "bg-emerald-100 dark:bg-emerald-950/40",
        imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80",
        text: "The puppy is very happy.\n\nYou completed the story!",
        gujText: "કૂતરો ખૂબ ખુશ છે.\n\nતમે વાર્તા પૂર્ણ કરી!",
      },
      // Choice 2 Path
      {
        id: 'puppy_run_tree',
        illustration: "🐶🌳🐦",
        illustrationBg: "bg-cyan-100 dark:bg-cyan-950/40",
        imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
        text: "The puppy runs to a big tree.\n\nIt finds a little bird.",
        gujText: "કૂતરો મોટા ઝાડ પાસે દોડે છે.\n\nત્યાં તેને એક નાનું પક્ષી મળે છે.",
        nextPageId: 'puppy_bird_sings'
      },
      {
        id: 'puppy_bird_sings',
        illustration: "🐦🎵✨",
        illustrationBg: "bg-teal-100 dark:bg-teal-950/40",
        imageUrl: "https://images.unsplash.com/photo-1470115636472-8d21172dacd0?auto=format&fit=crop&w=600&q=80",
        text: "The bird sings.\n\nThe puppy listens happily.",
        gujText: "પક્ષી મીઠું ગીત ગાય છે.\n\nકૂતરો ખુશીથી સાંભળે છે.",
        nextPageId: 'puppy_tree_finish'
      },
      {
        id: 'puppy_tree_finish',
        illustration: "🐶🏡✨",
        illustrationBg: "bg-purple-100 dark:bg-purple-950/40",
        imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
        text: "The puppy goes home smiling.\n\nYou completed the story!",
        gujText: "કૂતરો હસતો હસતો ઘરે જાય છે.\n\nતમે વાર્તા પૂર્ણ કરી!",
      }
    ]
  },
  {
    id: 'little_rabbit',
    title: "The Little Rabbit",
    gujTitle: "નાનું સસલું",
    emoji: "🐰",
    color: "bg-[#4D96FF]", // Friendly blue
    description: "Help the rabbit decide whether to eat or share the carrot!",
    gujDescription: "સસલાને ગાજર ખાવા અથવા વહેંચવા માટે મદદ કરો!",
    startPageId: 'rabbit_page1',
    pages: [
      {
        id: 'rabbit_page1',
        illustration: "🐰🥕✨",
        illustrationBg: "bg-amber-100 dark:bg-amber-950/40",
        imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
        text: "A little rabbit finds a carrot.\n\nIt looks delicious.",
        gujText: "એક નાનાં સસલાને ગાજર મળ્યું.\n\nતે ખૂબ સ્વાદિષ્ટ લાગે છે.",
        choices: [
          {
            text: "Eat the Carrot 😋",
            gujText: "ગાજર ખાવો 😋",
            nextPageId: 'rabbit_eat_carrot'
          },
          {
            text: "Share with a Bird 🐦",
            gujText: "પક્ષી સાથે વહેંચો 🐦",
            nextPageId: 'rabbit_share_bird'
          }
        ]
      },
      // Choice 1 Path
      {
        id: 'rabbit_eat_carrot',
        illustration: "🐰🥕🦷",
        illustrationBg: "bg-orange-100 dark:bg-orange-950/40",
        imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=600&q=80",
        text: "The rabbit eats slowly.\n\nCrunch! Crunch!",
        gujText: "સસલું ધીમે ધીમે ગાજર ખાય છે.\n\nકરક! કરક!",
        nextPageId: 'rabbit_drink_water'
      },
      {
        id: 'rabbit_drink_water',
        illustration: "🐰💧✨",
        illustrationBg: "bg-sky-100 dark:bg-sky-950/40",
        imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
        text: "It drinks cool water.",
        gujText: "તે ઠંડું પાણી પીવે છે.",
        nextPageId: 'rabbit_eat_finish'
      },
      {
        id: 'rabbit_eat_finish',
        illustration: "🐰💪🏆",
        illustrationBg: "bg-emerald-100 dark:bg-emerald-950/40",
        imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80",
        text: "The rabbit feels strong.\n\nYou completed the story!",
        gujText: "સસલું તાકાતવર બને છે.\n\nતમે વાર્તા પૂર્ણ કરી!",
      },
      // Choice 2 Path
      {
        id: 'rabbit_share_bird',
        illustration: "🐰🐦🥕",
        illustrationBg: "bg-violet-100 dark:bg-violet-950/40",
        imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&q=80",
        text: "The bird smiles.\n\nThey share the carrot.",
        gujText: "પક્ષી ખુશ થાય છે.\n\nબંને ગાજર વહેંચે છે.",
        nextPageId: 'rabbit_good_friends'
      },
      {
        id: 'rabbit_good_friends',
        illustration: "🐰🤝🐦",
        illustrationBg: "bg-indigo-100 dark:bg-indigo-950/40",
        imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80",
        text: "They become good friends.",
        gujText: "બંને સારા મિત્રો બને છે.",
        nextPageId: 'rabbit_share_finish'
      },
      {
        id: 'rabbit_share_finish',
        illustration: "🐰🐦💖🏆",
        illustrationBg: "bg-fuchsia-100 dark:bg-fuchsia-950/40",
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
        text: "Everyone is happy.\n\nYou completed the story!",
        gujText: "બધા ખુશ છે.\n\nતમે વાર્તા પૂર્ણ કરી!",
      }
    ]
  },
  {
    id: 'little_cat',
    title: "The Little Cat",
    gujTitle: "નાની બિલાડી",
    emoji: "🐱",
    color: "bg-[#6BCB77]", // Vibrant green
    description: "Follow the cat as it chases a butterfly or smells sweet flowers!",
    gujDescription: "પતંગિયા પાછળ દોડતી અથવા ફૂલો સૂંઘતી નાની બિલાડી સાથે જોડાઓ!",
    startPageId: 'cat_page1',
    pages: [
      {
        id: 'cat_page1',
        illustration: "🐱🦋✨",
        illustrationBg: "bg-rose-100 dark:bg-rose-950/40",
        imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
        text: "The little cat sees a butterfly.\n\nIt wants to follow it.",
        gujText: "નાની બિલાડીએ એક પતંગિયું જોયું.\n\nતે તેનો પીછો કરવા માંગે છે.",
        choices: [
          {
            text: "Chase the Butterfly 🦋",
            gujText: "પતંગિયાનો પીછો કરો 🦋",
            nextPageId: 'cat_chase_butterfly'
          },
          {
            text: "Smell the Flowers 🌸",
            gujText: "ફૂલોની સુગંધ લો 🌸",
            nextPageId: 'cat_smell_flowers'
          }
        ]
      },
      // Choice 1 Path
      {
        id: 'cat_chase_butterfly',
        illustration: "🐱🐾🦋",
        illustrationBg: "bg-amber-100 dark:bg-amber-950/40",
        imageUrl: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=600&q=80",
        text: "The butterfly flies slowly.\n\nThe cat runs happily.",
        gujText: "પતંગિયું ધીમે ઉડે છે.\n\nબિલાડી ખુશીથી દોડે છે.",
        nextPageId: 'cat_butterfly_lands'
      },
      {
        id: 'cat_butterfly_lands',
        illustration: "🐱🌸🦋",
        illustrationBg: "bg-emerald-100 dark:bg-emerald-950/40",
        imageUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=600&q=80",
        text: "The butterfly lands on a flower.\n\nThe cat watches quietly.",
        gujText: "પતંગિયું ફૂલ પર બેસે છે.\n\nબિલાડી શાંતિથી જુએ છે.",
        nextPageId: 'cat_chase_finish'
      },
      {
        id: 'cat_chase_finish',
        illustration: "🐱🦋🤝🏆",
        illustrationBg: "bg-purple-100 dark:bg-purple-950/40",
        imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
        text: "The cat learns to be gentle.\n\nYou completed the story!",
        gujText: "બિલાડી નરમાઈથી વર્તવું શીખે છે.\n\nતમે વાર્તા પૂર્ણ કરી!",
      },
      // Choice 2 Path
      {
        id: 'cat_smell_flowers',
        illustration: "🐱💐✨",
        illustrationBg: "bg-pink-100 dark:bg-pink-950/40",
        imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80",
        text: "The flowers smell sweet.\n\nThe cat smiles.",
        gujText: "ફૂલોની સુગંધ ખૂબ મીઠી છે.\n\nબિલાડી ખુશ થાય છે.",
        nextPageId: 'cat_bee_flies'
      },
      {
        id: 'cat_bee_flies',
        illustration: "🐱🐝✨",
        illustrationBg: "bg-amber-100 dark:bg-amber-950/40",
        imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80",
        text: "A bee flies by.\n\nThe cat waves hello.",
        gujText: "એક મધમાખી ઉડીને આવે છે.\n\nબિલાડી તેને હાથ હલાવીને અભિવાદન કરે છે.",
        nextPageId: 'cat_smell_finish'
      },
      {
        id: 'cat_smell_finish',
        illustration: "🐱☀️🌻🏆",
        illustrationBg: "bg-sky-100 dark:bg-sky-950/40",
        imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
        text: "It is a beautiful day.\n\nYou completed the story!",
        gujText: "આજનો દિવસ ખૂબ સુંદર છે.\n\nતમે વાર્તા પૂર્ણ કરી!",
      }
    ]
  }
];
