import React from 'react';
import { render, fireEvent, waitForDomChange, waitForElement} from '@testing-library/react';
import {UserSignupPage} from './UserSignupPage';

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
            fireEvent.change(passwordInput, changeEvent("test-P4ssword"));
            fireEvent.change(confirmInput, changeEvent("test-P4ssword"));

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

            fireEvent.change(passwordInput, changeEvent('test-P4ssword'));

            expect(passwordInput).toHaveValue('test-P4ssword');
        });

        test('user input sets the state.confirm', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const confirmInput = queryByPlaceholderText("Confirm Password...");

            fireEvent.change(confirmInput, changeEvent('test-P4ssword'));

            expect(confirmInput).toHaveValue('test-P4ssword');
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
                password: 'test-P4ssword'
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
                password: 'test-P4ssword'
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

        test('displays validation error for displayName when error is received for the field', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response:{ data: { validationErrors:{ displayName: 'size must be between 4 and 255'}}}
                })
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);
            const errorMessage = await waitForElement(() => queryByText('size must be between 4 and 255'));
            expect(errorMessage).toBeInTheDocument();
        });

        test('displays validation error for username when error is received for the field', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response:{ data: { validationErrors:{ username: 'size must be between 4 and 255'}}}
                })
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);
            const errorMessage = await waitForElement(() => queryByText('size must be between 4 and 255'));
            expect(errorMessage).toBeInTheDocument();
        });

        test('enables the submit button when password and confirm have the same value', () => {
            setupForSubmit();
            expect(button).not.toBeDisabled();
        })

        test('disables the submit button when confirm does not match password', () => {
            setupForSubmit();
            fireEvent.change(confirmInput, changeEvent("new-pass"));
            expect(button).toBeDisabled();
        })

        test('disables the submit button when password does not match confirms', () => {
            setupForSubmit();
            fireEvent.change(passwordInput, changeEvent("new-pass"));
            expect(button).toBeDisabled();
        })

        test('displays error style for confirm password when there is a mismatch', () => {
            const {queryByText} = setupForSubmit();
            fireEvent.change(confirmInput, changeEvent("new-pass"));
            const mismatchWarning = queryByText("Does not match password");
            expect(mismatchWarning).toBeInTheDocument();
        })

        test('displays error style for confirm password when ...', () => {
            const {queryByText} = setupForSubmit();
            fireEvent.change(passwordInput, changeEvent("new-pass"));
            const mismatchWarning = queryByText("Does not match password");
            expect(mismatchWarning).toBeInTheDocument();
        })

        test('hides the validation error when user changes the content of displayName', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response:{ data: { validationErrors:{ displayName: 'size must be between 4 and 255'}}}
                })
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);
            await waitForElement(() => queryByText('size must be between 4 and 255'));
            fireEvent.change(displayNameInput, changeEvent("displayName updated"));
            const errorMessage = queryByText('size must be between 4 and 255');
            expect(errorMessage).not.toBeInTheDocument();
        });

        test('hides the validation error when user changes the content of username', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response:{ data: { validationErrors:{ username: 'size must be between 4 and 255'}}}
                })
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);
            await waitForElement(() => queryByText('size must be between 4 and 255'));
            fireEvent.change(usernameInput, changeEvent("username updated"));
            const errorMessage = queryByText('size must be between 4 and 255');
            expect(errorMessage).not.toBeInTheDocument();
        });

        test('hides the validation error when user changes the content of password', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response:{ data: { validationErrors:{ password: 'size must be between 8 and 255'}}}
                })
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);
            await waitForElement(() => queryByText('size must be between 8 and 255'));
            fireEvent.change(passwordInput, changeEvent("password updated"));
            const errorMessage = queryByText('size must be between 8 and 255');
            expect(errorMessage).not.toBeInTheDocument();
        });

        test('hides the validation error when user changes the content of confirm', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response:{ data: { validationErrors:{ confirm: 'size must be between 4 and 255'}}}
                })
            };
            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);
            await waitForElement(() => queryByText('size must be between 4 and 255'));
            fireEvent.change(confirmInput, changeEvent("confirm password updated"));
            const errorMessage = queryByText('size must be between 4 and 255');
            expect(errorMessage).not.toBeInTheDocument();
        });
    });
});