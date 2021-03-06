// Base component that allows all components to render templates
export class BaseComponent {
    // Used to fully replace the HTML at the location with the provided template
    replaceRender(template, location) {
        if (template && location) {
            location.innerHTML = template;
        }
    }

    // Pass in tag to avoid parsing template for tag type and classes (optional)
    appendRender(tag, template, location, classes) {
        if (tag && template && location) {
            let element = document.createElement(tag);
            element.innerHTML = template;
            if (classes && classes.length) 
                element.className = classes.join(' ');
            location.appendChild(element);
        }
    }
}

// Used to make AJAX requests; placed here and exported for use by future APIs
// NOTE: Extension to support other methods besides GET would necessitate
// passing through method, payload, and other configurations. We're only
// doing GETs in this sample, so keeping implementation simple.
export async function makeRequest(url) {
    return new Promise((res, rej) => {
        let ajax = new XMLHttpRequest();
        ajax.open('GET', url);

        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                if (ajax.status >= 200 || ajax.status < 400) // Resolve all successful status codes
                    res(JSON.parse(ajax.response));
                else
                    rej(JSON.parse(ajax.response));
            }
        }

        ajax.send();
    })
}