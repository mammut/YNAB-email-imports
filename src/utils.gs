const headRegex = /<head>[^]+<\/head>/ig;
const stripHtmlRegex = /(<([^>]+)>)/ig;

function stripHTML(htmlStr) {
  return htmlStr
    .replace(headRegex, '')
    .replace(stripHtmlRegex, '');
}
