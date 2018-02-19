import { BaseComponent } from './common';
import { getItem } from './hackerNewsApi';
const COMMENTS_PAGE_TEMPLATE = `
    <div id='commentList'>
    </div>
`;

const NO_COMMENTS_PAGE_TEMPLATE = `
    <h1>This story has no comments yet! :(</h1>
`;

// Component that represents the comments page
export class CommentsPageComponent extends BaseComponent {
    constructor(story) {
        super();
        if (story.kids && story.kids.length)
            this.loadCommentsPage(story.kids);
        else
            this.loadNoCommentsPage();
    }

    async loadCommentsPage(topLevelIds) {
        this.replaceRender(COMMENTS_PAGE_TEMPLATE, document.getElementById('content'));
        await this.loadComments(topLevelIds, document.getElementById('commentList'), true);
    }

    loadNoCommentsPage() {
        this.replaceRender(NO_COMMENTS_PAGE_TEMPLATE, document.getElementById('content'));
    }

    // Pass topLevel boolean to set nesting left-most
    async loadComments(parentIds, parentLocation, topLevel) {
        for (let each of parentIds) {
            try {
                let comment = await getItem(each);
                new CommentComponent(comment, parentLocation, topLevel);
    
                // Use recursion to handle nested comments
                if (comment.kids && comment.kids.length)
                    await this.loadComments(comment.kids, document.getElementById(`${comment.id}`), false)
            } catch (err) {
                // Don't display error if just one branch of comments fails
                // TODO: Determine how to handle this error aside from logging
            }
        }
    }
}

// Reusable component for each comment on the comments page
// NOTE: Can be exported if needed for other components later
class CommentComponent extends BaseComponent {
    constructor(comment, commentLocation, topLevel) {
        super();
        // Merge values into template, all nested comments default to hidden
        let commentTemplate = `
            <p>${comment.text}</p>
            <a id='toggle${comment.id}' class='clickable'>${comment.kids ? comment.kids.length : 0} Comments</a> 
            <div id=${comment.id} class='childContainer hidden'>
            </div>
        `;

        let classes = ['parentComment'];
        if (!topLevel)
            classes.push('childComment');
        this.appendRender('div', commentTemplate, commentLocation, classes);
        document.getElementById(`toggle${comment.id}`).onclick = this.collapseChildren;
    }

    collapseChildren(event) {
        event.stopPropagation();
        let container = event.target.nextElementSibling;
        if (container.classList.contains('hidden'))
            container.classList.remove('hidden');
        else
            container.classList.add('hidden');
    }
}