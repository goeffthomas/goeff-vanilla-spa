import { makeRequest } from  './common';

// Simply passing back the promise so each component can implement its own handling
// NOTE: With basic app, some processing *could* happen here, but more flexible this way for future needs
export async function getTopStories() {
    return makeRequest('https://hacker-news.firebaseio.com/v0/topstories.json');
}

export async function getItem(itemId) {
    return makeRequest(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json`);
}