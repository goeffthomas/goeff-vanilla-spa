import { BaseComponent } from './common';
import { HomePageComponent } from './homePageComponents';
import { CommentsPageComponent } from './commentsPageComponent';
const LAYOUT_TEMPLATE = `
    <header>
        <a id='logoBtn'><img src='https://news.ycombinator.com/y18.gif' /></a>
        <p>HACKER NEWS!</p>
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
        window.history.pushState(null, null, '/home');
        let popStateEvent = new PopStateEvent('popstate');
        dispatchEvent(popStateEvent);
    }
}