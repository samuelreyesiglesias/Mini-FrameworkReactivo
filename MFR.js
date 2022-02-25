class mfr{
    constructor(options){
        this.origen = options.data();

        //destino
        this.$data  = new Proxy(this.origen);
    }

    mount(){
        document.querySelectorAll("*[m-text]").forEach(element => {
            this.mText(element, this.origen, element.getAttribute("m-text"));
        });
        document.querySelectorAll("*[m-model]").forEach(element => {
            this.mText(element, this.origen, element.getAttribute("m-model"));
        });
    }

    mText(element, origen, name){ 
        element.innerText = origen[name];
    }

    mModel(element, origen, name){
        element.value = origen[name];
    }
}

var mf = {
    createApp(options){
        return new mfr(options);
    }
}