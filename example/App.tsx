import { Component, Vue } from 'vue-property-decorator';
import TestA from '../packages/components/TestA';
import TestB from '../packages/components/TestB/TestB';

@Component({
    components: {
        TestA,
        TestB,
    }
})

export default class App extends Vue {

    protected render() {
        return (
            <div>
                hello <TestA/> <TestB/>
            </div>
        );
    }

}