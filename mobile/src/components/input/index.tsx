import React,{useEffect, useRef,useImperativeHandle,forwardRef,useState,useCallback} from "react";
import {TextInputProps} from "react-native";
import {useField} from "@unform/core";

import {Container,TextInput,Icon} from "./styles";

interface InputProps extends TextInputProps{
    name:string;
    icon:string;
}

interface InputValueReferences{
    value:string;
}
interface InputRef{
    focus():void;
}

const Input:React.RefForwardingComponent<InputRef,InputProps>=({name,icon,...rest},ref)=>{
    const InputElementRef = useRef<any>(null)
    const {registerField,defaultValue,fieldName,error} = useField(name);
    const inputValueRef= useRef<InputValueReferences>({value:defaultValue});
    const [isFocused,setIsFocused] = useState(false);
    const [isFilled,setIsFilled] = useState(false);
    const handleInputFocus = useCallback(()=>{setIsFocused(true)},[])
    const handleInputBlur = useCallback(()=>{
        setIsFocused(false)

        setIsFilled(!!inputValueRef.current.value);

    },[])
    useImperativeHandle(ref,()=>({
        focus(){
            InputElementRef.current.focus();

        }
    }))

    useEffect(()=>{
        registerField<string>({
            name:fieldName,
            ref:inputValueRef.current,
            path:"value",
            setValue(ref:any,value){
                inputValueRef.current.value = value;
                InputElementRef.current.setNativeProps({text:value});
            },
            clearValue(){
                inputValueRef.current.value = "";
                InputElementRef.current.clear();

            }

        })
    },[fieldName,registerField])
    return (
        <Container isFocused={isFocused} isErrored={!!error}>
            <Icon name={icon} size={20} color={isFocused || isFilled ? "#ff9000" : "#666360"}/>
            <TextInput ref={InputElementRef}
            placeholderTextColor="#666360"
            {...rest}
            keyboardAppearance="dark"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            defaultValue={defaultValue}
            onChangeText={value =>{
                inputValueRef.current.value=value;

            }}/>
        </Container>
    )
}
export default forwardRef(Input)
