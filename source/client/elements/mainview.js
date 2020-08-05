

customElements.define('main-view',class MainView extends HTMLElement 
{
    constructor() 
    {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        fetch("/elements/mainview.html").then( async response => { shadowRoot.innerHTML = await response.text() ; this.update()} ) ;
    }

    update()
    {
        const views = this.shadowRoot.querySelector( 'slot[name="view"]' ).assignedNodes();
        const nav = this.shadowRoot.querySelector( 'nav' );
        nav.innerHTML ="";
        views.forEach(element => {
            //if(element.dataset.name)
            //{
                let btn = document.createElement("button");
                btn.innerHTML = element.dataset.name;
                btn.id = `btn-${element.tagName}`;

                btn.onclick = () => { this.changeActive(element); };
            //}

            nav.appendChild(btn);
            element.style.display = "none";
        });

        if(views.length > 0)
            this.changeActive(views[views.length-1]);
    }

    changeActive(newElement)
    {
        if(this.activeElement) this.shadowRoot.querySelector(`#btn-${this.activeElement.tagName}`).classList.remove('--selected');
        this.shadowRoot.querySelector(`#btn-${newElement.tagName}`).classList.add('--selected');

        if(this.activeElement) this.activeElement.style.display = "none";
        this.activeElement = newElement;
        newElement.style.display = "block";
    }

    connectedCallback() 
    {
        //this.update();
    }
    adoptedCallback() 
    {
        this.update();
    }
});