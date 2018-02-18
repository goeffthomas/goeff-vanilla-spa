import { BaseComponent } from './common';
import { getItem } from './hackerNewsApi';
const COMMENTS_PAGE_TEMPLATE = `
    <div id='commentList'>
    </div>
`;

// Component that represents the comments page
export class CommentsPageComponent extends BaseComponent {
    commentListLocation;    // Holds location for story container
    topLevelIds;            // Holds IDs for top level comments

    constructor(story) {
        super();
        this.topLevelIds = story.kids;
        this.renderedComments = [];

        this.loadCommentsPage();
    }

    async loadCommentsPage() {
        this.replaceRender(COMMENTS_PAGE_TEMPLATE, document.getElementById('content'));

        // Now that div is available, get commentListLocation
        this.commentListLocation = document.getElementById('commentList');

        await this.loadComments(this.topLevelIds, this.commentListLocation);
    }

    async loadComments(parentIds, parentLocation) {
        for (let each of parentIds) {
            let comment = await getItem(each);
            new CommentComponent(comment, parentLocation);

            // Use recursion to handle nested comments
            if (comment.kids && comment.kids.length)
                await this.loadComments(comment.kids, document.getElementById(`${comment.id}`))
        }
    }
}

// Reusable component for each comment on the comments page
class CommentComponent extends BaseComponent {
    constructor(comment, commentLocation) {
        super();
        // Merge values into template
        let commentTemplate = `
            <div id=${comment.id}>
                <p>${comment.text}</p>
            </div>
        `;
        this.appendRender('div', commentTemplate, commentLocation);

        // Now that div available, set click handler for collapseChildren
        document.getElementById(`${comment.id}`).onclick = () => {
            this.collapseChildren(comment.id);
        }
    }

    collapseChildren(commentId) {
        // TODO: Collapse children
        console.log(commentId);
    }
}