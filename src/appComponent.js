import { BaseComponent } from './common';
import { HomePageComponent } from './homePageComponents';
import { CommentsPageComponent } from './commentsPageComponent';
const LAYOUT_TEMPLATE = `
    <header>
        <img src='https://news.ycombinator.com/y18.gif' id='logoBtn' class='clickable'/>
        <h3>Hacker News</h3>
    </header>
    <div id='content'></div>
`;

// Top-level component for structure and routing to pages
export class AppComponent extends BaseComponent {
    constructor() {
        super();
        // Handle states
        window.onpopstate = this.handleState;

        // Render layout
        this.replaceRender(LAYOUT_TEMPLATE, document.getElementById('app'));

        // Now that layout is available, set click handler for logo
        document.getElementById('logoBtn').onclick = this.goToHomePage;

        this.goToHomePage();
    }

    handleState(e) {
        if (e.state && e.state.story)
            new CommentsPageComponent(e.state.story);
        else
            new HomePageComponent();
    }

    goToHomePage() {
        window.history.pushState(null, null, '/');
        let popStateEvent = new PopStateEvent('popstate');
        dispatchEvent(popStateEvent);
    }
}