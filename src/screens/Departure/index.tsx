import {
  LocationAccuracy,
  LocationSubscription,
  useForegroundPermissions,
  watchPositionAsync
} from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { Container, Content, Message } from './styles';

import { useNavigation } from '@react-navigation/native';
import { useUser } from '@realm/react';

import { Loading } from '../../components/Loading';
import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isRegistering, setIsResgistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const [locationForegroundPermission, requestLocationForegroundPermission] = useForegroundPermissions();

  const realm = useRealm();
  const user = useUser();
  const { goBack } = useNavigation();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    try {
      if(!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert('Placa inválida', 'A placa é inválida. Por favor, informa a placa correta.')
      }
  
      if(description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilização do veículo')
      }

      setIsResgistering(false);

      realm.write(() => {
        realm.create('Historic', Historic.generate({
          user_id: user!.id,
          license_plate: licensePlate,
          description,
        }))
      });

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso.');

      goBack();

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não possível registrar a saída do veículo.');
      setIsResgistering(false)
    }
    
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, [])

  useEffect(() => {
    if(!locationForegroundPermission?.granted){
      return
    } 

    let subscription: LocationSubscription;

    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000
    }, (location) => {
      getAddressLocation(location.coords)
      .then(address => {
        console.log(address)
      })
      .finally(() => setIsLoadingLocation(false))
    }).then(response => subscription = response);

    return () => {
      if(subscription) {
        subscription.remove()
      }
    };
  }, [locationForegroundPermission?.granted])

  if(!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title='Saída' />
        <Message>
          Você precisa permitir que o aplicativo tenha acesso a 
          localização para acessar essa funcionalidade. Por favor, acesse as
          configurações do seu dispositivo para conceder a permissão ao aplicativo.
        </Message>
      </Container>
    )
  }

  if(isLoadingLocation) {
    return <Loading />
  }

  return (
    <Container>
      <Header title='Saída' />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label='Placa do veículo'
              placeholder="BRA1234"
              onSubmitEditing={() => {
                descriptionRef.current?.focus()
              }}
              returnKeyType='next'
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label='Finalizade'
              placeholder='Vou utilizar o veículo para...'
              onSubmitEditing={handleDepartureRegister}
              returnKeyType='send'
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button 
              title='Registar Saída'
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}