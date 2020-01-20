import TestB from './TestB'
import { VueConstructor } from 'vue'

TestB['install'] = (Vue: VueConstructor): void => {
    Vue.component(TestB.name, TestB)
}

export default TestB