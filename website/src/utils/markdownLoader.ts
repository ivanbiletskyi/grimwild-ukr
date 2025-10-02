// Load markdown files using fetch (much simpler and more reliable)
export const loadMarkdownContent = async (path: string): Promise<string> => {
  try {
    const response = await fetch(`/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    let content = await response.text();
    
    // Fix relative image paths in markdown
    // Extract the directory path from the markdown file path
    const dirPath = path.substring(0, path.lastIndexOf('/'));
    
    // Replace relative image paths with absolute paths
    content = content.replace(
      /!\[([^\]]*)\]\((?!http|\/)(.*?)\)/g,
      (match, altText, imagePath) => {
        // Construct absolute path from root
        const absolutePath = `/${dirPath}/${imagePath}`;
        return `![${altText}](${absolutePath})`;
      }
    );
    
    return content;
  } catch (error) {
    console.error(`Failed to load markdown content: ${path}`, error);
    throw error;
  }
};
