function extractGitHubURL(prompt :string) {
    const githubRegex = /https?:\/\/github\.com\/[^\s]+/g;
    const matches = prompt.match(githubRegex);
    return matches ? matches[0] : null;
}
export default extractGitHubURL;