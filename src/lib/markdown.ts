export async function parseMarkdown(content: string): Promise<string> {
  try {
    const { marked } = await import('marked');

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const result = await marked.parse(content);
    return result;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return content.replace(/\n/g, '<br>');
  }
}
