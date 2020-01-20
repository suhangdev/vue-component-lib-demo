import { Component, Vue } from 'vue-property-decorator';
import TestA from '../packages/components/TestA';

@Component({
    components: {
        TestA
    }
})

export default class App extends Vue {

    protected render() {
        return (
            <div>
                hello <TestA/>
            </div>
        );
    }

}