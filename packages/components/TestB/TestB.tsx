import { Component, Vue } from 'vue-property-decorator';
import style from './TestB.module.less'

@Component({
    name: 'TestB',
    components: {
    },
})

export default class TestB extends Vue {

    protected render() {
        return (
            <span class={style.text}>
                TestB
            </span>
        );
    }

}