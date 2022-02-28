class mfr {
    //dependencias
    deps = new Map();

    constructor(options) {
        //origen de datos
        this.origen = options.data();
        const self = this;
        //destino de datos
        this.$data = new Proxy(this.origen, {
            get(target, name) {
                if (Reflect.has(target, name)) {
                    self.track(target, name);
                    return Reflect.get(target, name);
                }
                console.warn("No existe el atributo: " + name);
                return "";
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
                document.querySelectorAll(`*[m-model=${name}]`).forEach(element => {
                    this.mModel(element, target, name);
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
        document.querySelectorAll("*[m-bind]").forEach(element => {
            const [attr, name] = element.getAttribute("m-bind").match(/(\w+)/g);
            this.mBind(element, this.$data, name, attr);
        });
        document.querySelectorAll("*[m-text]").forEach(element => {
            this.mText(element, this.$data, element.getAttribute("m-text"));
        });
        document.querySelectorAll("*[m-model]").forEach(element => {
            const name = element.getAttribute("m-model");
            this.mModel(element, this.$data, name);
            element.addEventListener("input", () => {
                Reflect.set(this.$data, name, element.value);
            });
        });
    }

    mText(element, target, name) {
        element.innerText = Reflect.get(target, name);
    }

    mModel(element, target, name) {
        element.value = Reflect.get(target, name);
    }

    mBind(element, target, name, attr) {
        element.setAttribute(attr, Reflect.get(target, name));
    }

}

var mf = {
    createApp(options) {
        return new mfr(options);
    }
}