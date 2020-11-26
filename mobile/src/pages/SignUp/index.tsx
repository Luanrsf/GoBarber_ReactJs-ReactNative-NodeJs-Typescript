import React,{useCallback, useRef} from 'react';
import {Image,KeyboardAvoidingView,Platform,View,ScrollView,TextInput,Alert} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import {useNavigation} from "@react-navigation/native"
import {Form} from "@unform/mobile"
import {FormHandles} from "@unform/core"
import * as Yup from "yup";

import Button from "../../components/button/index"
import Input from "../../components/input/index"

import logoImg from "../../assets/logo.png";
import {Container,Title,BackToSignIn,BackToSignInText} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface SingUpFormData{
    name: string;
    email: string;
    password: string;

}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const navigation = useNavigation();
    const handleSingUp = useCallback(
        async (data: SingUpFormData) => {
          formRef.current?.setErrors({});
          try {
            const schema = Yup.object().shape({
              name: Yup.string().required('Nome obrigatório'),
              email: Yup.string()
                .required('Email obrigatório')
                .email('Digite um email válido'),
              password: Yup.string().min(6, 'No mínimo 6 dígitos'),
            });
            await schema.validate(data, {
              abortEarly: false,
            });
            await api.post('/users', data);
            Alert.alert("Cadastro realizado!","Você já pode fazer seu login no GoBarber!")
            navigation.goBack();


          } catch (error) {
            if (error instanceof Yup.ValidationError) {
              const errors = getValidationErrors(error);
              formRef.current?.setErrors(errors);
            }
            Alert.alert('Erro no cadastro','Ocorreu um erro ao fazer o cadastro, tente novamente.')
          }
        },
        [navigation]);
    return (
    <>
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS=="ios"?"padding":undefined} enabled>
        <ScrollView contentContainerStyle={{flex:1}} keyboardShouldPersistTaps="handled">
    <Container>
        <Image source={logoImg}/>
        <View>
        <Title>Crie sua conta</Title>
        </View>
        <Form ref={formRef} onSubmit={handleSingUp} style={{width: '100%'}}>

        <Input
        autoCapitalize="words"
        name="name"
        icon="user"
        placeholder="Nome"
        returnKeyType="next"
        onSubmitEditing={()=>{
            emailInputRef.current?.focus()
        }}

        />

        <Input
        ref={emailInputRef}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        name="email"
        icon="mail"
        placeholder="E-mail"
        onSubmitEditing={()=>{
            passwordInputRef.current?.focus()
        }}
        />

        <Input
        ref={passwordInputRef}
        secureTextEntry
        name="password"
        icon="lock"
        placeholder="Senha"
        textContentType="newPassword"
        returnKeyType="send"
        onSubmitEditing={()=>{
            formRef.current?.submitForm()
        }}
        />
        <Button onPress={()=>{
            formRef.current?.submitForm()
        }}>Criar</Button>
        </Form>
    </Container>
    </ScrollView>
    </KeyboardAvoidingView>
    <BackToSignIn  onPress={()=>{navigation.goBack()}}>
        <Icon name="arrow-left" size={20} color="#fff"/>
    <BackToSignInText>Voltar para o logon</BackToSignInText>
    </BackToSignIn >
    </>
    )
};
export default SignUp;
