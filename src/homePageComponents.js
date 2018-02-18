import { BaseComponent } from './common';
import { getTopStories, getItem } from './hackerNewsApi';
const HOME_PAGE_TEMPLATE = `
    <ul id='storyList'>
    </ul>
    <button id='loadMoreBtn'>Load More Stories</button>
`;

const ERROR_TEMPLATE = `
    <h1>Sorry, we seem to be experiencing an error :(</h1>
`;

// Component that represents the landing page
export class HomePageComponent extends BaseComponent {
    storyListLocation;      // Holds location for story container
    storyIds;               // Holds array of top story IDs
    topStories;             // Holds story data from API waiting to be rendered
    renderedStories;        // Holds rendered stories

    constructor() {
        super();

        // Initialize values
        this.topStories = [];       
        this.renderedStories = [];
        this.page = 1;

        this.loadHomePage();
    }

    async loadHomePage() {
        let contentLocation = document.getElementById('content');
        try {
            // Failure on await will throw to catch
            this.storyIds = await getTopStories();
            this.replaceRender(HOME_PAGE_TEMPLATE, contentLocation);
    
            // Now that ul and button are available, get storyListLocation and set click handler for loadMore
            this.storyListLocation = document.getElementById('storyList');
            document.getElementById('loadMoreBtn').onclick = async () => {
                this.page++;
                await this.loadStories(this.page);            
            }
    
            await this.loadStories(this.page);
        } catch (err) {
            console.log(err);
            this.replaceRender(ERROR_TEMPLATE, contentLocation);
        }
    }

    // TODO: Implement async pre-loading of next page(s)
    async loadStories(pageNumber) {
        let renderStart = (pageNumber - 1) * 25;
        // If no more to render, get out
        if (renderStart > this.storyIds.length - 1)
            return;
        
        // Cap render at length of storyIds
        let renderEnd = renderStart + 25;
        if (renderEnd > this.storyIds.length)
            renderEnd = this.storyIds.length;

        let renderIds = this.storyIds.slice(renderStart, renderEnd);
        for (let storyId of renderIds) {
            // await each call so they load in order
            // NOTE: If calls vary in consistency, better UX to wait for first batch to load before rendering.
            //       Otherwise, may seem choppy as they render on the page
            try {
                let story = await getItem(storyId);
                this.topStories.push(story);
                this.renderedStories.push(new StoryComponent(story, this.storyListLocation));
            } catch (err) {
                console.log(err);
                // Don't display error if just one story fails
                // TODO: Determine how to handle this error aside from logging
            }
        }
    }
}

// Reusable component for each story on the landing page
class StoryComponent extends BaseComponent {
    constructor(story, storyListLocation) {
        super();
        // Merge values into template
        let storyTemplate = `
            <li>
                <a href=${story.url}>${story.title}</a>
                <p class='clickable' id='${story.id}'>${story.descendants || 0} Comments</p>
            </li>
        `;
        this.appendRender('li', storyTemplate, storyListLocation);

        // Check existence of link before attaching handler due to async loading
        let commentsLink = document.getElementById(`${story.id}`);
        if (commentsLink)
            commentsLink.onclick = () => { this.goToCommentsPage(story); }
    }

    goToCommentsPage(story) {
        let commentState = { story: story };
        window.history.pushState(commentState, null, `/comments?storyId=${story.id}`);
        let popStateEvent = new PopStateEvent('popstate', { state: commentState });
        dispatchEvent(popStateEvent);    
    }
}
