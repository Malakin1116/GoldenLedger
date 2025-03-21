import {
 
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';


export default function LoginPage() {
    return (
        <View style={styles.mainWraper}> 
            <View>
            <Text>Раді тебе вітати!</Text>
            <Text>
            Кожен пухнастик заслуговує на дбайливих господарів.Ми допоможемо тобі
            знайти друга.
            </Text>
        </View>
        <View>
            <TouchableOpacity>
            <Text>Вхід</Text>
            </TouchableOpacity>
            <TouchableOpacity>
            <Text>Реєстрація</Text>
            </TouchableOpacity>
        </View>
        <View>
            <View>
            <TextInput />
            </View>
            <View>
            <TextInput />
            </View>
        </View>
        <TouchableOpacity>
            <Text>Увійти</Text>
        </TouchableOpacity>
      </View>
    )
};