// Search utilities for markdown documentation

export interface SearchResult {
  path: string;
  title: string;
  excerpt: string;
  context: string; // Context window for precise scroll matching
  matches: number;
}

// Define all searchable markdown files
const SEARCHABLE_FILES = [
  // Player section
  { path: 'player/1_core_mechanic.md', title: 'Базова механіка', category: 'player' },
  { path: 'player/2_terms.md', title: 'Терміни', category: 'player' },
  { path: 'player/3_additions.md', title: 'Доповнення', category: 'player' },
  { path: 'player/4_character.md', title: 'Персонаж', category: 'player' },
  { path: 'player/character_creation/1_character_creation.md', title: 'Основи створення', category: 'player' },
  { path: 'player/character_creation/2_backgrounds.md', title: 'Передісторії', category: 'player' },
  { path: 'player/character_creation/3_heritages.md', title: 'Спадщини', category: 'player' },
  { path: 'player/exploration/1_grimwild.md', title: 'Що таке Grimwild?', category: 'player' },
  { path: 'player/exploration/2_exploration-system.md', title: 'Система дослідження', category: 'player' },
  { path: 'player/exploration/3_region-maps.md', title: 'Мапи регіонів', category: 'player' },
  // Paths
  { path: 'player/paths/bard.md', title: 'Шлях Барда', category: 'paths' },
  { path: 'player/paths/berserker.md', title: 'Шлях Берсерка', category: 'paths' },
  { path: 'player/paths/cleric.md', title: 'Шлях Клірика', category: 'paths' },
  { path: 'player/paths/druid.md', title: 'Шлях Друїда', category: 'paths' },
  { path: 'player/paths/fighter.md', title: 'Шлях Бійця', category: 'paths' },
  { path: 'player/paths/monk.md', title: 'Шлях Монаха', category: 'paths' },
  { path: 'player/paths/paladin.md', title: 'Шлях Паладина', category: 'paths' },
  { path: 'player/paths/ranger.md', title: 'Шлях Рейнджера', category: 'paths' },
  { path: 'player/paths/rogue.md', title: 'Шлях Шахрая', category: 'paths' },
  { path: 'player/paths/sorcerer.md', title: 'Шлях Чародія', category: 'paths' },
  { path: 'player/paths/warlock.md', title: 'Шлях Чаклуна', category: 'paths' },
  { path: 'player/paths/wizard.md', title: 'Шлях Чарівника', category: 'paths' },
  // GM section
  { path: 'GM/GM-cheatsheet.md', title: 'Шпаргалка майстра', category: 'gm' },
  // Glossary
  { path: 'glossary.md', title: 'Глосарій', category: 'glossary' },
];

// Map paths to routes
const PATH_TO_ROUTE: Record<string, string> = {
  'player/1_core_mechanic.md': '/player/core-mechanic',
  'player/2_terms.md': '/player/terms',
  'player/3_additions.md': '/player/additions',
  'player/4_character.md': '/player/character',
  'player/character_creation/1_character_creation.md': '/player/character-creation',
  'player/character_creation/2_backgrounds.md': '/player/character-creation',
  'player/character_creation/3_heritages.md': '/player/character-creation',
  'player/exploration/1_grimwild.md': '/player/exploration',
  'player/exploration/2_exploration-system.md': '/player/exploration',
  'player/exploration/3_region-maps.md': '/player/exploration',
  'player/paths/bard.md': '/player/paths/bard',
  'player/paths/berserker.md': '/player/paths/berserker',
  'player/paths/cleric.md': '/player/paths/cleric',
  'player/paths/druid.md': '/player/paths/druid',
  'player/paths/fighter.md': '/player/paths/fighter',
  'player/paths/monk.md': '/player/paths/monk',
  'player/paths/paladin.md': '/player/paths/paladin',
  'player/paths/ranger.md': '/player/paths/ranger',
  'player/paths/rogue.md': '/player/paths/rogue',
  'player/paths/sorcerer.md': '/player/paths/sorcerer',
  'player/paths/warlock.md': '/player/paths/warlock',
  'player/paths/wizard.md': '/player/paths/wizard',
  'GM/GM-cheatsheet.md': '/gm/cheatsheet',
  'glossary.md': '/glossary',
};

// Cache for loaded markdown content
const contentCache = new Map<string, string>();

// Get the base path for the application
const getBasePath = () => {
  return import.meta.env.PROD ? '/grimwild-ukr' : '';
};

// Load markdown content
async function loadMarkdownContent(path: string): Promise<string> {
  if (contentCache.has(path)) {
    return contentCache.get(path)!;
  }

  try {
    const basePath = getBasePath();
    const response = await fetch(`${basePath}/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    const content = await response.text();
    contentCache.set(path, content);
    return content;
  } catch (error) {
    console.error(`Failed to load markdown content: ${path}`, error);
    return '';
  }
}

// Remove markdown formatting for search
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/[*_~]/g, '') // Remove emphasis markers
    .replace(/>\s+/g, '') // Remove blockquotes
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
}

// Get excerpt around match with position info
function getExcerpt(content: string, query: string, contextChars: number = 150, startFrom: number = 0): { text: string; context: string; nextIndex: number } {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery, startFrom);
  
  if (index === -1) {
    const excerptText = content.substring(0, contextChars) + '...';
    return { text: excerptText, context: '', nextIndex: -1 };
  }

  const start = Math.max(0, index - contextChars / 2);
  const end = Math.min(content.length, index + query.length + contextChars / 2);
  
  let excerpt = content.substring(start, end);
  
  // Get a larger context window (before the match) for precise matching
  const contextStart = Math.max(0, index - 50);
  const contextEnd = Math.min(content.length, index + query.length + 50);
  const context = content.substring(contextStart, contextEnd);
  
  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';
  
  return { text: excerpt, context, nextIndex: index + query.length };
}

// Get all excerpts for a query in content (up to a max number)
function getAllExcerpts(content: string, query: string, maxResults: number = 100): Array<{ text: string; context: string }> {
  const excerpts: Array<{ text: string; context: string }> = [];
  let startFrom = 0;
  
  while (excerpts.length < maxResults) {
    const result = getExcerpt(content, query, 150, startFrom);
    if (result.nextIndex === -1) break;
    
    excerpts.push({ text: result.text, context: result.context });
    startFrom = result.nextIndex;
  }
  
  return excerpts;
}

// Count matches in text
function countMatches(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let count = 0;
  let pos = 0;
  
  while ((pos = lowerText.indexOf(lowerQuery, pos)) !== -1) {
    count++;
    pos += lowerQuery.length;
  }
  
  return count;
}

// Search through all markdown files
export async function searchDocumentation(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchQuery = query.trim();

  // Load all markdown files and search
  const searchPromises = SEARCHABLE_FILES.map(async (file) => {
    const content = await loadMarkdownContent(file.path);
    const strippedContent = stripMarkdown(content);
    
    // Check if query matches in title or content
    const titleMatches = countMatches(file.title, searchQuery);
    const contentMatches = countMatches(strippedContent, searchQuery);
    const totalMatches = titleMatches * 5 + contentMatches; // Weight title matches higher
    
    if (totalMatches > 0) {
      const route = PATH_TO_ROUTE[file.path] || '/';
      
      // Get multiple excerpts if there are multiple matches (max 100 per file)
      const excerpts = getAllExcerpts(strippedContent, searchQuery, 100);
      
      // Create a result for each significant excerpt
      return excerpts.map(({ text, context }, index) => ({
        path: route,
        title: excerpts.length > 1 ? `${file.title} (${index + 1}/${excerpts.length})` : file.title,
        excerpt: text,
        context,
        matches: totalMatches,
      }));
    }
    
    return [];
  });

  const searchResults = await Promise.all(searchPromises);
  
  // Flatten results (since each file can now return multiple results)
  const flatResults = searchResults.flat();
  
  // Filter out empty results and sort by relevance
  const filteredResults = flatResults
    .filter((result): result is SearchResult => result !== null)
    .sort((a, b) => b.matches - a.matches);
  
  return filteredResults;
}

// Clear cache (useful for development)
export function clearSearchCache(): void {
  contentCache.clear();
}

