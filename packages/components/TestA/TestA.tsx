import { Component, Vue } from 'vue-property-decorator';
import style from './TestA.module.less'

@Component({
    name: 'TestA',
    components: {
    },
})

export default class TestA extends Vue {

    protected render() {
        return (
            <span class={style.text}>
                TestA
            </span>
        );
    }

}