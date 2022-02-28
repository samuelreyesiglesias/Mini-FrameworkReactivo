class mfr {
    //dependencias
    deps = new Map();

    constructor(options) {
        this.origen = options.data();
        const self = this;
        //destino
        this.$data = new Proxy(this.origen, {
            get(target, name) {
                if (Reflect.has(target, name)) {
                    self.track(target, name);
                    return Reflect.get(target, name);
                }
                console.warn("No existe el atributo: " + name);
                return "";
                console.log(target, name)
            },
            set(target, name, value) {
                Reflect.set(target, name, value);
                self.trigger(name);
                return false;
            }

        })
    }

    track(target, name) {
        if (!this.deps.has(name)) {
            const effect = () => {
                document.querySelectorAll(`*[m-text=${name}]`).forEach(element => {
                    this.mText(element, target, name);
                });
            }
            this.deps.set(name, effect);
        }
    }

    trigger(name) {
        const effect = this.deps.get(name);
        effect();
    }

    mount() {
        document.querySelectorAll("*[m-text]").forEach(element => {
            this.mText(element, this.$data, element.getAttribute("m-text"));
        });
        document.querySelectorAll("*[m-model]").forEach(element => {
            const name = element.getAttribute("m-model");
            this.mModel(element, this.$data, name);
            element.addEventListener("input", () => {
                Reflect.set(this.$data, name, element.value);
                //this.$data[name] = e.target.value;
            });
        });
    }

    mText(element, target, name) {
        element.innerText = Reflect.get(target, name);
    }

    mModel(element, target, name) {
        element.value = Reflect.get(target, name);
    }
}

var mf = {
    createApp(options) {
        return new mfr(options);
    }
}