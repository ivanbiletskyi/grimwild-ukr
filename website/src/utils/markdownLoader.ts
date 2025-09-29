// Load markdown files using fetch (much simpler and more reliable)
export const loadMarkdownContent = async (path: string): Promise<string> => {
  try {
    const response = await fetch(`/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Failed to load markdown content: ${path}`, error);
    throw error;
  }
};
