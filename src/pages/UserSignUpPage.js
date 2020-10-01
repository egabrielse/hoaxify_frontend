import React from 'react';
import CustomInput from '../components/CustomInput'


export class UserSignupPage extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            displayName:'',
            username:'',
            password:'',
            confirm:'',
            pendingApiCall: false,
            errors: {},
            passwordsMatch: true,
        }
    };

    onChangeDisplayName = (event) => {
        const value = event.target.value; 
        const errors = {...this.state.errors};
        delete errors.displayName;
        this.setState({displayName: value, errors:errors})
    }
    onChangeUsername = (event) => {
        const value = event.target.value; 
        const errors = {...this.state.errors};
        delete errors.username;
        this.setState({username: value, errors: errors})
    }
    onChangePassword = (event) => {
        const value = event.target.value; 
        const checkForMatch = this.state.confirm === value;
        const errors = {...this.state.errors};
        delete errors.password;
        errors.confirm = checkForMatch ? "" : "Does not match password";
        this.setState({password: value, passwordsMatch: checkForMatch, errors: errors})
    }
    onChangeConfirm = (event) => {
        const value = event.target.value; 
        const checkForMatch = this.state.password === value;
        const errors = {...this.state.errors};
        delete errors.confirm;
        errors.confirm = checkForMatch ? "" : "Does not match password";
        this.setState({confirm: value, passwordsMatch: checkForMatch, errors: errors})
    }
    onClickSignup = () => {
        const user = {
            displayName: this.state.displayName,
            username: this.state.username,
            password: this.state.password,
        }
        this.setState({pendingApiCall:true});
        this.props.actions.postSignup(user)
        .then((response) => {
            this.setState({pendingApiCall:false});
        })
        .catch((apiError) => {
            let errors = {...this.state.errors};

            if (apiError.response.data && apiError.response.data.validationErrors) {
                errors = {...apiError.response.data.validationErrors};
            }

            this.setState({pendingApiCall:false, errors: errors});
        });
    } 


    render() {
        return(
            <div className='container'>
                <h1 className='text-center'>Sign Up</h1>

                <div className='col-12 mb-3'>
                    <CustomInput
                        placeholder='Display Name...'
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                        hasError={this.state.errors.displayName && true}
                        error={this.state.errors.displayName}
                    />
                </div>

                <div className='col-12 mb-3'>
                    <CustomInput 
                        placeholder='Username...'
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        hasError={this.state.errors.username && true}
                        error={this.state.errors.username}
                    />
                </div>

                <div className='col-12 mb-3'>
                    <CustomInput 
                        placeholder='Password...'
                        value={this.state.password}
                        type='password'
                        onChange={this.onChangePassword}
                        hasError={this.state.errors.password && true}
                        error={this.state.errors.password}
                    />
                </div>

                <div className='col-12 mb-3'>
                    <CustomInput 
                        placeholder='Confirm Password...'
                        value={this.state.confirm}
                        type='password'
                        onChange={this.onChangeConfirm}
                        hasError={this.state.errors.confirm && true}
                        error={this.state.errors.confirm}
                    />
                </div>

                <div className='text-center'>
                    <button
                        className='btn btn-primary'
                        onClick={this.onClickSignup}
                        disabled={this.state.pendingApiCall || !this.state.passwordsMatch}
                    >
                        {this.state.pendingApiCall && 
                            (<div className="spinner-border text-light spinner-border-sm mr-sm-1" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>)
                        }
                        Submit
                    </button>
                </div>  
    
            </div>
        )
    }
}

UserSignupPage.defaultProps = {
    actions: {
        postSignup: () => {
            return new Promise((resolve, reject) => {
                resolve({});
            })
        }
    }
}