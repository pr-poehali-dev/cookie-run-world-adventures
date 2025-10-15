import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Character = {
  id: string;
  name: string;
  image: string;
  speed: number;
  jump: number;
};

type LevelStats = {
  levelId: number;
  time: number;
  coins: number;
  completed: boolean;
};

type GameScreen = 'menu' | 'character-select' | 'leaderboard' | 'game';

const characters: Character[] = [
  {
    id: 'gingerbrave',
    name: 'GingerBrave',
    image: 'https://cdn.poehali.dev/projects/3ba287e8-95a8-44ef-9a89-ed279a1d00f7/files/79508217-1243-4c5e-974a-3a831a5ee8bf.jpg',
    speed: 5,
    jump: 8,
  },
  {
    id: 'werewolf',
    name: 'Werewolf Cookie',
    image: 'https://cdn.poehali.dev/projects/3ba287e8-95a8-44ef-9a89-ed279a1d00f7/files/7b4b59bd-6aee-4956-ac54-975481bf1d3a.jpg',
    speed: 7,
    jump: 6,
  },
  {
    id: 'wizard',
    name: 'Wizard Cookie',
    image: 'https://cdn.poehali.dev/projects/3ba287e8-95a8-44ef-9a89-ed279a1d00f7/files/9e8f2499-80d7-4078-b452-eb93c0d5d7db.jpg',
    speed: 4,
    jump: 9,
  },
];

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [levelStats, setLevelStats] = useState<LevelStats[]>([
    { levelId: 1, time: 45, coins: 120, completed: true },
    { levelId: 2, time: 52, coins: 98, completed: true },
    { levelId: 3, time: 0, coins: 0, completed: false },
  ]);
  
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 400 });
  const [coins, setCoins] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (screen === 'game') {
      const timer = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === 'game') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' && playerPosition.x < 750) {
          setPlayerPosition((prev) => ({ ...prev, x: prev.x + 20 }));
        }
        if (e.key === 'ArrowLeft' && playerPosition.x > 0) {
          setPlayerPosition((prev) => ({ ...prev, x: prev.x - 20 }));
        }
        if (e.key === ' ' && !isJumping) {
          setIsJumping(true);
          setPlayerPosition((prev) => ({ ...prev, y: prev.y - 100 }));
          setTimeout(() => {
            setPlayerPosition((prev) => ({ ...prev, y: 400 }));
            setIsJumping(false);
          }, 500);
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [screen, playerPosition, isJumping]);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setScreen('game');
    setGameTime(0);
    setCoins(0);
    setPlayerPosition({ x: 50, y: 400 });
  };

  const CloudAnimation = ({ delay = 0, speed = 20 }) => (
    <div
      className="absolute text-white opacity-90 text-4xl"
      style={{
        animation: `float-slow ${speed}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      ☁️
    </div>
  );

  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4EDDC4] to-[#FFB84D] relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-10 left-10 animate-float-slow">
          <CloudAnimation delay={0} speed={18} />
        </div>
        <div className="absolute top-32 right-20 animate-float">
          <CloudAnimation delay={1} speed={22} />
        </div>
        <div className="absolute top-52 left-1/3 animate-float-slow">
          <CloudAnimation delay={2} speed={20} />
        </div>
        <div className="absolute top-20 right-1/4 animate-float">
          <CloudAnimation delay={1.5} speed={24} />
        </div>
        <div className="absolute bottom-32 left-20 animate-float-slow">
          <CloudAnimation delay={3} speed={19} />
        </div>

        <div className="z-10 text-center animate-slide-up">
          <h1 className="font-pixel text-4xl md:text-6xl text-[#FFB84D] mb-4 drop-shadow-[4px_4px_0px_#2C3E50] tracking-wider">
            COOKIE RUN
          </h1>
          <h2 className="font-pixel text-2xl md:text-3xl text-white mb-12 drop-shadow-[3px_3px_0px_#2C3E50]">
            World Adventures
          </h2>

          <div className="flex flex-col gap-6 items-center">
            <Button
              onClick={() => setScreen('character-select')}
              className="font-pixel text-xl px-12 py-8 bg-[#FF6B9D] hover:bg-[#FF85AD] text-white border-4 border-[#2C3E50] shadow-[6px_6px_0px_#2C3E50] hover:shadow-[8px_8px_0px_#2C3E50] hover:translate-y-[-2px] transition-all"
            >
              <Icon name="Play" size={24} className="mr-3" />
              ИГРАТЬ
            </Button>

            <Button
              onClick={() => setScreen('leaderboard')}
              className="font-pixel text-xl px-12 py-8 bg-[#FFB84D] hover:bg-[#FFC870] text-white border-4 border-[#2C3E50] shadow-[6px_6px_0px_#2C3E50] hover:shadow-[8px_8px_0px_#2C3E50] hover:translate-y-[-2px] transition-all"
            >
              <Icon name="Trophy" size={24} className="mr-3" />
              РЕЙТИНГ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'character-select') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#4EDDC4] p-8">
        <Button
          onClick={() => setScreen('menu')}
          className="font-pixel mb-8 bg-[#FF6B9D] hover:bg-[#FF85AD] text-white border-4 border-black"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          НАЗАД
        </Button>

        <h2 className="font-pixel text-3xl text-center text-white mb-12 drop-shadow-[3px_3px_0px_#000]">
          ВЫБЕРИ ПЕРСОНАЖА
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {characters.map((character) => (
            <Card
              key={character.id}
              className="bg-white border-4 border-[#FFB84D] p-6 hover:scale-105 transition-transform cursor-pointer shadow-[8px_8px_0px_#2C3E50]"
              onClick={() => handleCharacterSelect(character)}
            >
              <div className="aspect-square bg-gradient-to-br from-[#FFB84D] to-[#FF6B9D] rounded-lg mb-4 flex items-center justify-center overflow-hidden border-4 border-[#2C3E50]">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-32 h-32 object-contain"
                />
              </div>

              <h3 className="font-pixel text-lg text-center mb-4 text-[#2C3E50]">
                {character.name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-xs text-[#2C3E50]">Скорость:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: character.speed }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-[#FFB84D] border border-[#2C3E50]" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-xs text-[#2C3E50]">Прыжок:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: character.jump }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-[#4EDDC4] border border-[#2C3E50]" />
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full font-pixel bg-[#FF6B9D] hover:bg-[#FF85AD] text-white border-4 border-[#2C3E50] shadow-[4px_4px_0px_#2C3E50]">
                ВЫБРАТЬ
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4EDDC4] to-[#FFB84D] p-8">
        <Button
          onClick={() => setScreen('menu')}
          className="font-pixel mb-8 bg-[#FF6B9D] hover:bg-[#FF85AD] text-white border-4 border-black"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          НАЗАД
        </Button>

        <h2 className="font-pixel text-3xl text-center text-white mb-12 drop-shadow-[3px_3px_0px_#2C3E50]">
          РЕЙТИНГ УРОВНЕЙ
        </h2>

        <div className="max-w-4xl mx-auto space-y-4">
          {levelStats.map((stat) => (
            <Card
              key={stat.levelId}
              className="bg-white border-4 border-[#2C3E50] p-6 shadow-[6px_6px_0px_#2C3E50]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="font-pixel text-2xl text-[#FFB84D] bg-[#2C3E50] w-16 h-16 flex items-center justify-center border-4 border-[#FFB84D]">
                    {stat.levelId}
                  </div>
                  <div>
                    <h3 className="font-pixel text-xl text-[#2C3E50] mb-2">
                      Уровень {stat.levelId}
                    </h3>
                    {stat.completed ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={16} className="text-[#4EDDC4]" />
                          <span className="font-pixel text-sm text-[#2C3E50]">
                            {stat.time} сек
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🪙</span>
                          <span className="font-pixel text-sm text-[#2C3E50]">
                            {stat.coins} монет
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="font-pixel text-sm text-gray-400">
                        Не пройден
                      </span>
                    )}
                  </div>
                </div>
                {stat.completed && (
                  <Icon name="Trophy" size={32} className="text-[#FFB84D]" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'game' && selectedCharacter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4EDDC4] to-[#2C3E50] relative overflow-hidden">
        <div className="absolute top-4 left-4 bg-white/90 border-4 border-[#2C3E50] p-4 rounded font-pixel shadow-[4px_4px_0px_#2C3E50]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={20} className="text-[#FFB84D]" />
              <span className="text-[#2C3E50]">{gameTime}с</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🪙</span>
              <span className="text-[#2C3E50]">{coins}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setScreen('menu')}
          className="absolute top-4 right-4 font-pixel bg-[#FF6B9D] hover:bg-[#FF85AD] text-white border-4 border-black"
        >
          ВЫХОД
        </Button>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#2C3E50] border-t-8 border-[#FFB84D]" />

        <div className="absolute bottom-32 left-0 right-0 h-4 bg-[#FFB84D] border-y-4 border-[#2C3E50]" />

        <div className="absolute bottom-48 left-1/4 w-32 h-4 bg-[#FF6B9D] border-4 border-[#2C3E50]" />
        <div className="absolute bottom-64 right-1/3 w-32 h-4 bg-[#FF6B9D] border-4 border-[#2C3E50]" />
        <div className="absolute bottom-80 left-1/2 w-32 h-4 bg-[#FF6B9D] border-4 border-[#2C3E50]" />

        <div
          className="absolute w-16 h-16 transition-all duration-200"
          style={{
            left: `${playerPosition.x}px`,
            bottom: `${window.innerHeight - playerPosition.y - 64}px`,
          }}
        >
          <img
            src={selectedCharacter.image}
            alt={selectedCharacter.name}
            className="w-full h-full object-contain border-4 border-[#2C3E50] rounded-lg bg-white"
          />
        </div>

        <div className="absolute bottom-1/3 left-1/2 w-8 h-8 text-2xl animate-float">
          🪙
        </div>

        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white/90 border-4 border-[#2C3E50] p-4 rounded font-pixel text-center shadow-[4px_4px_0px_#2C3E50]">
          <p className="text-xs text-[#2C3E50] mb-2">УПРАВЛЕНИЕ:</p>
          <p className="text-xs text-[#2C3E50]">← → - движение</p>
          <p className="text-xs text-[#2C3E50]">ПРОБЕЛ - прыжок</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
