import config from './config'
import { VueConstructor } from 'vue'

interface compList {
    [componentsName: string]: VueConstructor
}

const components: compList = config
const install = (Vue: VueConstructor): void => {
    Object.keys(components).forEach((name) => Vue.component(name, components[name]))
}

export default {
    install,
    ...components,
}
