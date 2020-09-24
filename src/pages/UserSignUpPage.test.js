import React from 'react';
import { render, fireEvent, waitFor, screen, queryByPlaceholderText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {UserSignUpPage} from './UserSignUpPage';
import { act } from 'react-dom/test-utils';

describe("UserSignUpPage", () => {

    describe('Layout', () => {
        // Tests to ensure that all desired components are present in the UserSignUpPage component:
        test('has header of Sign Up', () => {
            const {container} = render(<UserSignUpPage />);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent("Sign Up");
        });

        test('has input for display name', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const displayNameInput = queryByPlaceholderText("Display Name...");
            expect(displayNameInput).toBeInTheDocument(); 
        });

        test('has input for email', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const emailInput = queryByPlaceholderText("Email...");
            expect(emailInput).toBeInTheDocument(); 
        });

        test('has input for password', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const passwordInput = queryByPlaceholderText("Password...");
            expect(passwordInput).toBeInTheDocument(); 
        });

        test('has input type for password to be password', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const passwordInput = queryByPlaceholderText("Password...");
            expect(passwordInput.type).toBe('password'); 
        });

        test('has input for password confirmation', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const confirmInput = queryByPlaceholderText("Confirm Password...");
            expect(confirmInput).toBeInTheDocument(); 
        });

        test('has input type for password confirmation to be password', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const confirmInput = queryByPlaceholderText("Confirm Password...");
            expect(confirmInput.type).toBe('password'); 
        });

        test('has submit button', () => {
            const {container} = render(<UserSignUpPage/>);
            const submitButton = container.querySelector('button');
            expect(submitButton).toBeInTheDocument(); 
        });

        test('has submit button with text of Submit', () => {
            const {container} = render(<UserSignUpPage/>);
            const submitButton = container.querySelector('button');
            expect(submitButton).toHaveTextContent("Submit");
        });
    });



    describe('Interactions', () => {

        // Function to create a generic change event for a given input
        const changeEvent = (content) => {
            return {
                target: {
                    value: content
                }
            }
        }

        let button, displayNameInput, emailInput, passwordInput, confirmInput;

        const setupForSubmit = (props) => {
            const rendered = render(
                <UserSignUpPage {...props}/>
            );

            const {container, queryByPlaceholderText} = rendered;

            displayNameInput = queryByPlaceholderText("Display Name...");
            emailInput = queryByPlaceholderText("Email...");
            passwordInput = queryByPlaceholderText("Password...");
            confirmInput = queryByPlaceholderText("Confirm Password...");

            fireEvent.change(displayNameInput, changeEvent("test-display-name"));
            fireEvent.change(emailInput, changeEvent("test-email"));
            fireEvent.change(passwordInput, changeEvent("test-password"));
            fireEvent.change(confirmInput, changeEvent("test-password"));

            button = container.querySelector('button');
        }
        
        // Tests to ensure that state is changed by user input:
        test('user input sets the state.displayName', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const displayNameInput = queryByPlaceholderText("Display Name...");

            fireEvent.change(displayNameInput, changeEvent('test-display-name'));

            expect(displayNameInput).toHaveValue('test-display-name');
        });

        test('user input sets the state.email', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const emailInput = queryByPlaceholderText("Email...");

            fireEvent.change(emailInput, changeEvent('test-email'));

            expect(emailInput).toHaveValue('test-email');
        });

        test('user input sets the state.password', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const passwordInput = queryByPlaceholderText("Password...");

            fireEvent.change(passwordInput, changeEvent('test-password'));

            expect(passwordInput).toHaveValue('test-password');
        });

        test('user input sets the state.confirm', () => {
            const {queryByPlaceholderText} = render(<UserSignUpPage/>);
            const confirmInput = queryByPlaceholderText("Confirm Password...");

            fireEvent.change(confirmInput, changeEvent('test-password'));

            expect(confirmInput).toHaveValue('test-password');
        });

        test('postSignUp does not throw exception when clicking the button when actions are not provided through props', () => {
            const actions = {
                postSignUp: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({actions});

            fireEvent.click(button);
            expect(() => fireEvent.click(button)).not.toThrow();
        });

        test('postSignUp does not throw exception when clicking the button when actions are not provided through props', () => {
            setupForSubmit();

            fireEvent.click(button);
            expect(() => fireEvent.click(button)).not.toThrow();
        });

        test('postSignUp does not throw exception when clicking the button when actions are not provided through props', () => {
            const actions = {
                postSignUp: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({actions});
            fireEvent.click(button);

            const expectedUserObject = {
                email: 'test-email',
                password: 'test-password',
                displayName: 'test-display-name'
            }

            expect(actions.postSignUp).toHaveBeenCalledWith(expectedUserObject);
        });
    });
});