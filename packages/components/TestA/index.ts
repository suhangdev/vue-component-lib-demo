import TestA from './TestA'
import { VueConstructor } from 'vue'

TestA['install'] = (Vue: VueConstructor): void => {
    Vue.component(TestA.name, TestA)
}

export default TestA