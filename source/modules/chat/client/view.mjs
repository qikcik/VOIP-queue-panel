
const name = "chat-view";
export default name
customElements.define(name,class MainView extends HTMLElement 
{
    constructor() 
    {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
    }

    async aInit(correspondent)
    {
        console.log("HERE");
        let response = await fetch("/modules/chat/client/view.html");
        response = await response.text();
        this.shadowRoot.innerHTML = response;
        
        this.correspondent = correspondent;
    }
    connectedCallback() 
    {

    }

    adoptedCallback() 
    {

    }
});