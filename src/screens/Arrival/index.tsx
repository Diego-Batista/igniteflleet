import { useRoute } from '@react-navigation/native';

import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';

import { X } from 'phosphor-react-native';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Header } from '../../components/Header';

type RouteParamProps = {
  id: string;
}

export function Arrival() {

  const route = useRoute();

  const { id } = route.params as RouteParamProps;


  console.log(id);

  return (
    <Container>
      <Header title='Chegada' />
      <Content>
        <Label>
          Placa do veículo
        </Label>

        <LicensePlate>
          XXX0000
        </LicensePlate>

        <Label>
          Finalidade
        </Label>

        <Description>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa voluptate atque necessitatibus voluptatibus eveniet rerum maiores neque laborum obcaecati eos debitis deleniti tempore veritatis, voluptates modi, optio ullam quasi dolor!
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