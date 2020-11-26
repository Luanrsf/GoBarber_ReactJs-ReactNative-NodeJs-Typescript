import React, { useCallback,useRef } from 'react';
import {Image,KeyboardAvoidingView,Platform,View,ScrollView,TextInput,Alert} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import {useNavigation} from "@react-navigation/native"
import {Form} from "@unform/mobile"
import {FormHandles} from "@unform/core"
import {useAuth} from "../../hooks/auth"
import * as Yup from "yup";

import Button from "../../components/button/index"
import Input from "../../components/input/index"

import logoImg from "../../assets/logo.png";
import {Container,Title,ForgotPassword,ForgotPasswordText,CreateAccontButton,CreateAccontButtonText} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData{
    email:string;
    password:string;
}

const SignIn: React.FC = () => {
    const formRef =useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const navigation =useNavigation();
    const {signIn,user} = useAuth()
    const handleSignIn = useCallback(
        async (data: SignInFormData) => {
          formRef.current?.setErrors({});
          try {
            const schema = Yup.object().shape({
              email: Yup.string()
                .required('Email obrigatório')
                .email('Digite um email válido'),
              password: Yup.string().required('Senha obrigatória'),
            });
            await schema.validate(data, {
              abortEarly: false,
            });
            await signIn({
              email: data.email,
              password: data.password,
            });
          } catch (error) {
            if (error instanceof Yup.ValidationError) {
              const errors = getValidationErrors(error);
              formRef.current?.setErrors(errors);
            }
            Alert.alert('Erro na autenticação','Ocorreu um erro ao fazer login, cheque as credenciais.')
          }
        },[signIn]);

    return (
    <>
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS=="ios"?"padding":undefined} enabled>
        <ScrollView contentContainerStyle={{flex:1}} keyboardShouldPersistTaps="handled">
    <Container>
        <Image source={logoImg}/>
        <View>
        <Title>Faça seu Logon</Title>
        </View>

        <Form ref={formRef} onSubmit={handleSignIn} style={{width: '100%'}}>
        <Input
        name="email"
        icon="mail"
        placeholder="E-mail"
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={()=>{
            passwordInputRef.current?.focus()
        }} />
        <Input
        ref={passwordInputRef}
        name="password"
        icon="lock"
        placeholder="Senha"
        secureTextEntry
        returnKeyType="send"
        onSubmitEditing={()=>{
            formRef.current?.submitForm();
        }}
        />
        <Button onPress={()=>{
            formRef.current?.submitForm();
        }}>Entrar</Button>
        </Form>

        <ForgotPassword onPress={()=>{}}>
            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
        </ForgotPassword>
    </Container>
    </ScrollView>
    </KeyboardAvoidingView>
    <CreateAccontButton onPress={()=>{navigation.navigate("SignUp")}}>
        <Icon name="log-in" size={20} color="#ff9000"/>
    <CreateAccontButtonText>Criar Conta</CreateAccontButtonText>
    </CreateAccontButton>
    </>
    )
};
export default SignIn;
