import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import MarkdownRenderer from './components/MarkdownRenderer';
import Search from './components/Search';
import './App.css'

// Dynamic folder renderer component for auto-loading MD files from folders
const DynamicFolderRenderer = () => {
  const { folderPath } = useParams<{ folderPath: string }>();
  const location = useLocation();
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFolderContents = async () => {
      // Determine the folder key based on current location
      // For routes like /player/character-creation/*, we need to extract the base path
      const currentPath = location.pathname;
      const basename = import.meta.env.PROD ? '/grimwild-ukr' : '/';
      const pathWithoutBasename = currentPath.replace(basename, '').replace(/^\/|\/$/g, '');
      const folderKey = folderPath ? `${pathWithoutBasename}/${folderPath}` : pathWithoutBasename;

      try {
        setLoading(true);
        setError(null);

      // Fetch the folder index (list of files in the folder)
      // Since we can't directly list directory contents from the browser,
      // we need to maintain a mapping of known folders and their files
      const folderFileMap: Record<string, string[]> = {
          'player/character-creation': [
            'player/character_creation/1_character_creation.md',
            'player/character_creation/2_backgrounds.md',
            'player/character_creation/3_heritages.md'
          ],
          'player/exploration': [
            'player/exploration/1_grimwild.md',
            'player/exploration/2_exploration-system.md',
            'player/exploration/3_region-maps.md'
          ],
          'GM/exploration': [
            'GM/exploration/1_grimwild.md',
            'GM/exploration/2_exploration-system.md',
            'GM/exploration/3_region-maps.md'
          ],
          'GM/monsters_DO_NOT_READ': [
            'GM/monsters_DO_NOT_READ/basilisk.md',
            'GM/monsters_DO_NOT_READ/behir.md',
            'GM/monsters_DO_NOT_READ/golem.md',
            'GM/monsters_DO_NOT_READ/ogre.md',
            'GM/monsters_DO_NOT_READ/custom/goblin-pack.md',
            'GM/monsters_DO_NOT_READ/custom/orc-warband.md'
          ],
          'GM/stories_DO_NOT_READ': [
            'GM/stories_DO_NOT_READ/a-plague-of-goblins.md',
            'GM/stories_DO_NOT_READ/the-fall-of-bastion.md'
          ]
        };

        const folderFiles = folderFileMap[folderKey] || [];

        if (folderFiles.length === 0) {
          setError(`Папка "${folderKey}" не знайдена або не містить файлів.`);
          return;
        }

        setFiles(folderFiles);
      } catch (err) {
        console.error('Error loading folder contents:', err);
        setError(`Помилка завантаження папки: ${folderKey}`);
      } finally {
        setLoading(false);
      }
    };

    loadFolderContents();
  }, [folderPath, location.pathname]);

  if (loading) {
    return (
      <div className="sub-section">
        <div className="loading">Завантаження файлів папки...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sub-section">
        <div className="error-message" style={{ color: 'var(--danger)', padding: '2rem', textAlign: 'center' }}>
          {error}
        </div>
      </div>
    );
  }

  // Generate titles for files based on their paths
  const getFileTitle = (filePath: string): string => {
    const fileName = filePath.split('/').pop()?.replace('.md', '') || '';
    const titleMap: Record<string, string> = {
      '1_character_creation': 'Основи створення',
      '2_backgrounds': 'Передісторії',
      '3_heritages': 'Спадщини',
      '1_grimwild': 'Що таке Grimwild?',
      '2_exploration-system': 'Система дослідження',
      '3_region-maps': 'Мапи регіонів',
      'basilisk': 'Базиліск',
      'behir': 'Бехір',
      'golem': 'Голем',
      'ogre': 'Огр',
      'goblin-pack': 'Зграя гоблінів',
      'orc-warband': 'Загін орків',
      'a-plague-of-goblins': 'Чума гоблінів',
      'the-fall-of-bastion': 'Падіння бастіону',
      'GM-cheatsheet': 'Шпаргалка майстра'
    };

    return titleMap[fileName] || fileName.charAt(0).toUpperCase() + fileName.slice(1);
  };

  return (
    <div className="sub-section">
      <h1>📁 {folderPath?.replace(/\//g, ' → ').replace(/\/$/, '')}</h1>
      <p className="section-description">
        Знайдено файлів: {files.length}
      </p>
      <div className="sub-links">
        {files.map((filePath) => (
          <MarkdownRenderer
            key={filePath}
            markdownPath={filePath}
            title={getFileTitle(filePath)}
          />
        ))}
      </div>
    </div>
  );
};

// Component to handle redirects from 404.html
const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a stored redirect route from 404.html
    const redirectRoute = sessionStorage.getItem('redirectRoute');
    if (redirectRoute) {
      // Clear the stored route
      sessionStorage.removeItem('redirectRoute');
      // Navigate to the intended route
      navigate(redirectRoute, { replace: true });
    }
  }, [navigate]);

  return null; // This component doesn't render anything
};

function App() {
  // Use /grimwild-ukr/ for production (GitHub Pages), / for local development
  const basename = import.meta.env.PROD ? '/grimwild-ukr' : '/';

  return (
    <Router basename={basename}>
      <RedirectHandler />
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/player" element={<PlayerSection />} />

            {/* Dynamic folder routes */}
            <Route path="/player/character-creation/*" element={<DynamicFolderRenderer />} />
            <Route path="/player/exploration/*" element={<DynamicFolderRenderer />} />
            <Route path="/GM/exploration/*" element={<DynamicFolderRenderer />} />
            <Route path="/GM/monsters_DO_NOT_READ/*" element={<DynamicFolderRenderer />} />
            <Route path="/GM/stories_DO_NOT_READ/*" element={<DynamicFolderRenderer />} />

            {/* Individual file routes */}
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
              <MarkdownRenderer markdownPath="player/paths/rogue.md" title="Шлях Пройдисвіта" />
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
            <Route path="/gm/monsters_DO_NOT_READ" element={<MonstersSection />} />
            <Route path="/gm/stories_DO_NOT_READ" element={<StoriesSection />} />

            {/* Monster routes */}
            <Route path="/gm/monsters_DO_NOT_READ/basilisk" element={
              <MarkdownRenderer markdownPath="GM/monsters_DO_NOT_READ/basilisk.md" title="Базиліск" />
            } />
            <Route path="/gm/monsters_DO_NOT_READ/behir" element={
              <MarkdownRenderer markdownPath="GM/monsters_DO_NOT_READ/behir.md" title="Бегір" />
            } />
            <Route path="/gm/monsters_DO_NOT_READ/golem" element={
              <MarkdownRenderer markdownPath="GM/monsters_DO_NOT_READ/golem.md" title="Голем" />
            } />
            <Route path="/gm/monsters_DO_NOT_READ/ogre" element={
              <MarkdownRenderer markdownPath="GM/monsters_DO_NOT_READ/ogre.md" title="Огр" />
            } />
            <Route path="/gm/monsters_DO_NOT_READ/goblin-pack" element={
              <MarkdownRenderer markdownPath="GM/monsters_DO_NOT_READ/custom/goblin-pack.md" title="Зграя гоблінів" />
            } />
            <Route path="/gm/monsters_DO_NOT_READ/orc-warband" element={
              <MarkdownRenderer markdownPath="GM/monsters_DO_NOT_READ/custom/orc-warband.md" title="Загін орків" />
            } />

            {/* Story routes */}
            <Route path="/gm/stories_DO_NOT_READ/plague-of-goblins" element={
              <MarkdownRenderer markdownPath="GM/stories_DO_NOT_READ/a-plague-of-goblins.md" title="Чума гоблінів" />
            } />
            <Route path="/gm/stories_DO_NOT_READ/fall-of-bastion" element={
              <MarkdownRenderer markdownPath="GM/stories_DO_NOT_READ/the-fall-of-bastion.md" title="Падіння бастіону" />
            } />

            <Route path="/glossary" element={
              <MarkdownRenderer markdownPath="glossary.md" title="Глосарій" />
            } />

            {/* Catch all route for 404 */}
            <Route path="*" element={
              <div className="sub-section">
                <div className="error-message" style={{ color: 'var(--danger)', padding: '3rem', textAlign: 'center' }}>
                  <h1>404 - Сторінка не знайдена</h1>
                  <p>Шлях, за яким ви перейшли, не існує або файл не знайдено.</p>
                  <p>Спробуйте повернутися на <Link to="/">головну сторінку</Link>.</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

const HomePage = () => (
  <div className="home-page">
    <h1>Ласкаво просимо до Grimwild</h1>
    <p>Українська фан-адаптація та переклад tabletop RPG системи Grimwild.</p>
    <div className="home-sections">
      <Link to="/player" className="section-card-link">
        <div className="section-card">
          <h2>🎲 Гравець</h2>
          <p>Правила гри, створення персонажа, класи та шляхи.</p>
          <span className="section-link">Переглянути</span>
        </div>
      </Link>
      <Link to="/gm" className="section-card-link">
        <div className="section-card">
          <h2>🎭 Майстер</h2>
          <p>Інструменти для ведення ігор, монстри, історії.</p>
          <span className="section-link">Переглянути</span>
        </div>
      </Link>
      <Link to="/glossary" className="section-card-link">
        <div className="section-card">
          <h2>📚 Глосарій</h2>
          <p>Терміни та визначення гри.</p>
          <span className="section-link">Переглянути</span>
        </div>
      </Link>
    </div>
  </div>
);

const PlayerSection = () => (
  <div className="section-overview">
    <h1>Секція гравця</h1>
    <div className="section-links">
      <Link to="/player/core-mechanic">Базова механіка</Link>
      <Link to="/player/terms">Терміни</Link>
      <Link to="/player/additions">Доповнення</Link>
      <Link to="/player/character">Персонаж</Link>
      <Link to="/player/character-creation/">Створення персонажа</Link>
      <Link to="/player/exploration/">Дослідження</Link>
      <Link to="/player/paths">Шляхи</Link>
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
    { name: 'Пройдисвіт', path: 'rogue', emoji: '🗝️' },
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
          <Link key={path} to={`/player/paths/${path}`} className="path-card-link">
            <div className="path-card-preview">
              <span className="path-emoji">{emoji}</span>
              <h3>{name}</h3>
              <span className="path-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const GMSection = () => (
  <div className="section-overview">
    <h1>Секція майстра</h1>
    <div className="section-links">
      <Link to="/gm/cheatsheet">Шпаргалка майстра</Link>
      <Link to="/gm/monsters_DO_NOT_READ">🚫 Монстри (не читати гравцям)</Link>
      <Link to="/gm/stories_DO_NOT_READ">📖 Історії (не читати гравцям)</Link>
    </div>
  </div>
);

const MonstersSection = () => {
  const monsters = [
    { name: 'Базиліск', path: 'basilisk', emoji: '🐍' },
    { name: 'Бегір', path: 'behir', emoji: '🐉' },
    { name: 'Голем', path: 'golem', emoji: '🗿' },
    { name: 'Огр', path: 'ogre', emoji: '👹' },
    { name: 'Зграя гоблінів', path: 'goblin-pack', emoji: '🗡️' },
    { name: 'Загін орків', path: 'orc-warband', emoji: '🛡️' },
  ];

  return (
    <div className="sub-section">
      <h1>🚫 Монстри (не читати гравцям)</h1>
      <p className="section-description">Описи монстрів для майстра гри</p>
      <div className="paths-grid">
        {monsters.map(({ name, path, emoji }) => (
          <Link key={path} to={`/gm/monsters_DO_NOT_READ/${path}`} className="path-card-link">
            <div className="path-card-preview">
              <span className="path-emoji">{emoji}</span>
              <h3>{name}</h3>
              <span className="path-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const StoriesSection = () => {
  const stories = [
    { name: 'Чума гоблінів', path: 'plague-of-goblins', emoji: '🧌' },
    { name: 'Падіння бастіону', path: 'fall-of-bastion', emoji: '🏰' },
  ];

  return (
    <div className="sub-section">
      <h1>📖 Історії (не читати гравцям)</h1>
      <p className="section-description">Пригодницькі модулі та історії для майстра гри</p>
      <div className="paths-grid">
        {stories.map(({ name, path, emoji }) => (
          <Link key={path} to={`/gm/stories_DO_NOT_READ/${path}`} className="path-card-link">
            <div className="path-card-preview">
              <span className="path-emoji">{emoji}</span>
              <h3>{name}</h3>
              <span className="path-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className="footer">
      {isHomePage ? (
        // Повний футер для головної сторінки
        <>
          <div className="footer-content">
            <div className="footer-section">
              <h3>📜 Ліцензія та авторство</h3>
              <div className="license-info">
                <p>
                  <strong>Оригінальні автори:</strong> J.D. Maxwell, Oddity Press
                </p>
                <p>
                  <strong>Офіційний сайт гри:</strong>{' '}
                  <a href="https://www.odditypress.com/grimwild" target="_blank" rel="noopener noreferrer">
                    odditypress.com/grimwild
                  </a>
                </p>
                <p>
                  <strong>Оригінальна ліцензія:</strong>{' '}
                  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                    Creative Commons Attribution 4.0 International (CC BY 4.0)
                  </a>
                </p>
                <p>
                  <strong>Ліцензія оригінального тексту:</strong>{' '}
                  <a href="https://www.odditypress.com/licensing" target="_blank" rel="noopener noreferrer">
                    odditypress.com/licensing
                  </a>
                </p>
              </div>
            </div>

            <div className="footer-section">
              <h3>⚠️ Важлива інформація</h3>
              <div className="disclaimer">
                <p>
                  Це неофіційна фан-адаптація та переклад окремих частин tabletop RPG системи{' '}
                  <strong>Grimwild</strong> (Free Edition v1.3).
                </p>
                <p>
                  Цей проект <strong>не афілійований та не схвалений</strong> оригінальними авторами.
                </p>
                <p>
                  Деякий вміст було перефразовано, реорганізовано або новостворено для кращого
                  відповідності ігровим уподобанням, мовному потоку або локальному контексту.
                </p>
              </div>
            </div>

            <div className="footer-section">
              <h3>🔗 Посилання</h3>
              <div className="footer-links">
                <a href="https://www.odditypress.com/grimwild" target="_blank" rel="noopener noreferrer">
                  Оригінальна гра Grimwild
                </a>
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                  Ліцензія CC BY 4.0
                </a>
                <a href="https://github.com/ivanbiletskyi/grimwild-ukr" target="_blank" rel="noopener noreferrer">
                  Репозиторій проекту
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              © 2025 Українська фан-адаптація Grimwild.{' '}
              <a href="https://www.odditypress.com/licensing" target="_blank" rel="noopener noreferrer">
                Оригінальна ліцензія CC BY 4.0
              </a>
              {' • '}
              <a href="https://github.com/ivanbiletskyi" target="_blank" rel="noopener noreferrer">
                Ivan Biletskyi
              </a>
            </p>
          </div>
        </>
      ) : (
        // Простий футер для інших сторінок
        <div className="footer-simple">
          <p>
            © 2025 Українська фан-адаптація Grimwild •{' '}
            <a href="https://www.odditypress.com/licensing" target="_blank" rel="noopener noreferrer">
              Оригінальна ліцензія CC BY 4.0
            </a>
          </p>
        </div>
      )}
    </footer>
  );
};

export default App
