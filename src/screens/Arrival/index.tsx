import { useRoute } from '@react-navigation/native';

import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';

import { X } from 'phosphor-react-native';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Header } from '../../components/Header';

import { BSON } from 'realm';
import { useObject } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

type RouteParamProps = {
  id: string;
}

export function Arrival() {

  const route = useRoute();

  const { id } = route.params as RouteParamProps;

  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);

  return (
    <Container>
      <Header title='Chegada' />
      <Content>
        <Label>
          Placa do veículo
        </Label>

        <LicensePlate>
          {historic?.license_plate}
        </LicensePlate>

        <Label>
          Finalidade
        </Label>

        <Description>
          {historic?.description}
        </Description>

        <Footer>
          <ButtonIcon 
            icon={X} 
          />
          
          <Button title='Registrar chegada' />
        </Footer>
      </Content>
    </Container>
  );
}