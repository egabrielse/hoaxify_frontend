import React from 'react';
import { render, fireEvent, waitForDomChange, waitForElement} from '@testing-library/react';
import CustomInput from './CustomInput'

describe('layout', () => {
    test('has input item', () => {
        const {container} = render(<CustomInput/>);
        const input = container.querySelector('input');
        expect(input).toBeInTheDocument();
    });

    test('displays the label provided in props', () => {
        const {queryByText} = render(<CustomInput label="Test-Label"/>);
        const label = queryByText("Test-Label"); 
        expect(label).toBeInTheDocument();
    });

    test('does not displays label when no label is provided in props', () => {
        const {container} = render(<CustomInput/>);
        const label = container.querySelector('label'); 
        expect(label).not.toBeInTheDocument();
    });

    test('has text type when type is not provided in props', () => {
        const {container} = render(<CustomInput/>);
        const input = container.querySelector('input'); 
        expect(input.type).toBe('text');
    });

    test('has password type when password type is provided in props', () => {
        const {container} = render(<CustomInput type='password'/>);
        const input = container.querySelector('input'); 
        expect(input.type).toBe('password');
    });

    test('has value for input when it is provided in props', () => {
        const {container} = render(<CustomInput value="Test-Value"/>);
        const input = container.querySelector('input'); 
        expect(input.value).toBe("Test-Value");
    });

    test('has onChange callback when it is provided in props', () => {
        const onChange = jest.fn();
        const {container} = render(<CustomInput onChange={onChange}/>);
        const input = container.querySelector('input'); 
        fireEvent.change(input, {target: {value: 'new-input'}});
        expect(onChange).toHaveBeenCalledTimes(1);
    });
 
    test('has defualt style when hasError is not provided in props', () => {
        const {container} = render(<CustomInput/>);
        const input = container.querySelector('input'); 
        expect(input.className).toBe('form-control');
    });

    test('has success style when hasError property is false', () => {
        const {container} = render(<CustomInput hasError={false}/>);
        const input = container.querySelector('input'); 
        expect(input.className).toBe('form-control is-valid');
    }); 

    test('has failure style when hasError property is true', () => {
        const {container} = render(<CustomInput hasError={true}/>);
        const input = container.querySelector('input'); 
        expect(input.className).toBe('form-control is-invalid');
    }); 

    test('displays the error text when it is provided', () => {
        const {queryByText} = render(<CustomInput hasError={true} error="Test-Error"/>);
        expect(queryByText("Test-Error")).toBeInTheDocument();
    }); 

    test('does not displays the error text when hasError is not provided', () => {
        const {queryByText} = render(<CustomInput error="Test-Error"/>);
        expect(queryByText("Test-Error")).not.toBeInTheDocument();
    });
 
})
