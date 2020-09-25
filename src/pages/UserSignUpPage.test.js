import React from 'react';
import { render, fireEvent, waitForDomChange} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {UserSignupPage} from './UserSignupPage';
import { act } from 'react-dom/test-utils';

describe("UserSignUpPage", () => {

    describe('Layout', () => {
        // Tests to ensure that all desired components are present in the UserSignupPage component:
        test('has header of Sign Up', () => {
            const {container} = render(<UserSignupPage />);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent("Sign Up");
        });

        test('has input for displayName', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const displayNameInput = queryByPlaceholderText("Display Name...");
            expect(displayNameInput).toBeInTheDocument(); 
        });

        test('has input for username', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const usernameInput = queryByPlaceholderText("Username...");
            expect(usernameInput).toBeInTheDocument(); 
        });

        test('has input for password', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText("Password...");
            expect(passwordInput).toBeInTheDocument(); 
        });

        test('has input type for password to be password', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText("Password...");
            expect(passwordInput.type).toBe('password'); 
        });

        test('has input for password confirmation', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const confirmInput = queryByPlaceholderText("Confirm Password...");
            expect(confirmInput).toBeInTheDocument(); 
        });

        test('has input type for password confirmation to be password', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const confirmInput = queryByPlaceholderText("Confirm Password...");
            expect(confirmInput.type).toBe('password'); 
        });

        test('has submit button', () => {
            const {container} = render(<UserSignupPage/>);
            const submitButton = container.querySelector('button');
            expect(submitButton).toBeInTheDocument(); 
        });

        test('has submit button with text of Submit', () => {
            const {container} = render(<UserSignupPage/>);
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

        const mockAsyncDelayedSuccess = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve,reject)  => {
                    setTimeout(() => {
                        return resolve({});
                    }, 300);
                });
            })
        }

        const mockAsyncDelayedFailure = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve,reject)  => {
                    setTimeout(() => {
                        return reject({
                            response: {data:{}}
                        });
                    }, 300);
                });
            })
        }

        let button, displayNameInput, usernameInput, passwordInput, confirmInput;

        const setupForSubmit = (props) => {
            const rendered = render(
                <UserSignupPage {...props}/>
            );

            const {container, queryByPlaceholderText} = rendered;

            displayNameInput = queryByPlaceholderText("Display Name...");
            usernameInput = queryByPlaceholderText("Username...");
            passwordInput = queryByPlaceholderText("Password...");
            confirmInput = queryByPlaceholderText("Confirm Password...");

            fireEvent.change(displayNameInput, changeEvent("test-displayName"));
            fireEvent.change(usernameInput, changeEvent("test-username"));
            fireEvent.change(passwordInput, changeEvent("test-password"));
            fireEvent.change(confirmInput, changeEvent("test-password"));

            button = container.querySelector('button');

            return rendered;
        }
        
        // Tests to ensure that state is changed by user input:
        test('user input sets the state.displayName', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const displayNameInput = queryByPlaceholderText("Display Name...");

            fireEvent.change(displayNameInput, changeEvent('test-displayName'));

            expect(displayNameInput).toHaveValue('test-displayName');
        });

        test('user input sets the state.username', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const usernameInput = queryByPlaceholderText("Username...");

            fireEvent.change(usernameInput, changeEvent('test-username'));

            expect(usernameInput).toHaveValue('test-username');
        });

        test('user input sets the state.password', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText("Password...");

            fireEvent.change(passwordInput, changeEvent('test-password'));

            expect(passwordInput).toHaveValue('test-password');
        });

        test('user input sets the state.confirm', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const confirmInput = queryByPlaceholderText("Confirm Password...");

            fireEvent.change(confirmInput, changeEvent('test-password'));

            expect(confirmInput).toHaveValue('test-password');
        });

        test('calls postSignup when the fields are valid and the actions are provided in props', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            };
            setupForSubmit({ actions });
            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        });

        test('does not throw exception when clicking the button when actions are not provided through props', () => {
            setupForSubmit();
            expect(() => fireEvent.click(button)).not.toThrow();
        });

        test('calls post with user body when the fields are valid', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            };
            setupForSubmit({ actions });
            fireEvent.click(button);
            const expectedUserObject = {
                displayName: 'test-displayName',
                username: 'test-username',
                password: 'test-password'
            };
            expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
        });

        test('does not allow user to click submit button when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayedSuccess()
            };
            setupForSubmit({ actions });

            fireEvent.click(button);
            fireEvent.click(button);

            const expectedUserObject = {
                displayName: 'test-displayName',
                username: 'test-username',
                password: 'test-password'
            };
            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        });

        test('diplays spinner when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayedSuccess()
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);

            const spinner = queryByText('Loading...');
            expect(spinner).toBeInTheDocument();
        });

        test('hides spinner after api call finishes successfully', async () => {
            const actions = {
                postSignup: mockAsyncDelayedSuccess()
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitForDomChange();

            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });

        test('hides spinner after api call finishes with error', async () => {
            const actions = {
                postSignup: mockAsyncDelayedFailure()
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitForDomChange();

            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });
    });
});