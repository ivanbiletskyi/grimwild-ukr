import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import MarkdownRenderer from './components/MarkdownRenderer';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/player" element={<PlayerSection />} />
            <Route path="/player/core-mechanic" element={
              <MarkdownRenderer markdownPath="player/1_core_mechanic.md" title="Базова механіка" />
            } />
            <Route path="/player/terms" element={
              <MarkdownRenderer markdownPath="player/2_terms.md" title="Терміни" />
            } />
            <Route path="/player/additions" element={
              <MarkdownRenderer markdownPath="player/3_additions.md" title="Доповнення" />
            } />
            <Route path="/player/character" element={
              <MarkdownRenderer markdownPath="player/4_character.md" title="Персонаж" />
            } />
            <Route path="/player/character-creation" element={<CharacterCreation />} />
            <Route path="/player/paths" element={<PlayerPaths />} />
            
            {/* Individual character path routes */}
            <Route path="/player/paths/bard" element={
              <MarkdownRenderer markdownPath="player/paths/bard.md" title="Шлях Барда" />
            } />
            <Route path="/player/paths/berserker" element={
              <MarkdownRenderer markdownPath="player/paths/berserker.md" title="Шлях Берсерка" />
            } />
            <Route path="/player/paths/cleric" element={
              <MarkdownRenderer markdownPath="player/paths/cleric.md" title="Шлях Клірика" />
            } />
            <Route path="/player/paths/druid" element={
              <MarkdownRenderer markdownPath="player/paths/druid.md" title="Шлях Друїда" />
            } />
            <Route path="/player/paths/fighter" element={
              <MarkdownRenderer markdownPath="player/paths/fighter.md" title="Шлях Бійця" />
            } />
            <Route path="/player/paths/monk" element={
              <MarkdownRenderer markdownPath="player/paths/monk.md" title="Шлях Монаха" />
            } />
            <Route path="/player/paths/paladin" element={
              <MarkdownRenderer markdownPath="player/paths/paladin.md" title="Шлях Паладина" />
            } />
            <Route path="/player/paths/ranger" element={
              <MarkdownRenderer markdownPath="player/paths/ranger.md" title="Шлях Рейнджера" />
            } />
            <Route path="/player/paths/rogue" element={
              <MarkdownRenderer markdownPath="player/paths/rogue.md" title="Шлях Шахрая" />
            } />
            <Route path="/player/paths/sorcerer" element={
              <MarkdownRenderer markdownPath="player/paths/sorcerer.md" title="Шлях Чародія" />
            } />
            <Route path="/player/paths/warlock" element={
              <MarkdownRenderer markdownPath="player/paths/warlock.md" title="Шлях Чаклуна" />
            } />
            <Route path="/player/paths/wizard" element={
              <MarkdownRenderer markdownPath="player/paths/wizard.md" title="Шлях Чарівника" />
            } />
            <Route path="/gm" element={<GMSection />} />
            <Route path="/gm/cheatsheet" element={
              <MarkdownRenderer markdownPath="GM/GM-cheatsheet.md" title="Шпаргалка майстра" />
            } />
            <Route path="/glossary" element={
              <MarkdownRenderer markdownPath="glossary.md" title="Глосарій" />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

const HomePage = () => (
  <div className="home-page">
    <h1>Ласкаво просимо до Grimwild</h1>
    <p>Українська фан-адаптація та переклад tabletop RPG системи Grimwild.</p>
    <div className="home-sections">
      <div className="section-card">
        <h2>🎲 Гравець</h2>
        <p>Правила гри, створення персонажа, класи та шляхи.</p>
        <a href="/player" className="section-link">Переглянути</a>
      </div>
      <div className="section-card">
        <h2>🎭 Майстер</h2>
        <p>Інструменти для ведення ігор, монстри, історії.</p>
        <a href="/gm" className="section-link">Переглянути</a>
      </div>
      <div className="section-card">
        <h2>📚 Глосарій</h2>
        <p>Терміни та визначення гри.</p>
        <a href="/glossary" className="section-link">Переглянути</a>
      </div>
    </div>
  </div>
);

const PlayerSection = () => (
  <div className="section-overview">
    <h1>Секція гравця</h1>
    <div className="section-links">
      <a href="/player/core-mechanic">Базова механіка</a>
      <a href="/player/terms">Терміни</a>
      <a href="/player/additions">Доповнення</a>
      <a href="/player/character">Персонаж</a>
      <a href="/player/character-creation">Створення персонажа</a>
      <a href="/player/paths">Шляхи</a>
    </div>
  </div>
);

const CharacterCreation = () => (
  <div className="sub-section">
    <h1>Створення персонажа</h1>
    <div className="sub-links">
      <MarkdownRenderer markdownPath="player/character_creation/1_character_creation.md" title="Основи створення" />
      <MarkdownRenderer markdownPath="player/character_creation/2_backgrounds.md" title="Передісторії" />
      <MarkdownRenderer markdownPath="player/character_creation/3_heritages.md" title="Спадщини" />
    </div>
  </div>
);

const PlayerPaths = () => {
  const paths = [
    { name: 'Бард', path: 'bard', emoji: '🎵' },
    { name: 'Берсерк', path: 'berserker', emoji: '🪓' },
    { name: 'Клірик', path: 'cleric', emoji: '✝️' },
    { name: 'Друїд', path: 'druid', emoji: '🌿' },
    { name: 'Боєць', path: 'fighter', emoji: '🗡️' },
    { name: 'Монах', path: 'monk', emoji: '🥋' },
    { name: 'Паладин', path: 'paladin', emoji: '🛡️' },
    { name: 'Рейнджер', path: 'ranger', emoji: '🏹' },
    { name: 'Шахрай', path: 'rogue', emoji: '🗝️' },
    { name: 'Чародій', path: 'sorcerer', emoji: '🔮' },
    { name: 'Чаклун', path: 'warlock', emoji: '🕯️' },
    { name: 'Чарівник', path: 'wizard', emoji: '📖' },
  ];

  return (
    <div className="sub-section">
      <h1>Шляхи персонажів</h1>
      <p className="section-description">Оберіть шлях, щоб переглянути деталі</p>
      <div className="paths-grid">
        {paths.map(({ name, path, emoji }) => (
          <a key={path} href={`/player/paths/${path}`} className="path-card-link">
            <div className="path-card-preview">
              <span className="path-emoji">{emoji}</span>
              <h3>{name}</h3>
              <span className="path-arrow">→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const GMSection = () => (
  <div className="section-overview">
    <h1>Секція майстра</h1>
    <div className="section-links">
      <a href="/gm/cheatsheet">Шпаргалка майстра</a>
    </div>
  </div>
);

export default App
