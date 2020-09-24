import React from 'react';


export class UserSignUpPage extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            displayName:'',
            email:'',
            password:'',
            confirm:'',
        }
    };

    onChangeDisplayName = (event) => {
        const value = event.target.value; 
        this.setState({displayName: value})
    }
    onChangeEmail = (event) => {
        const value = event.target.value; 
        this.setState({email: value})
    }
    onChangePassword = (event) => {
        const value = event.target.value; 
        this.setState({password: value})
    }
    onChangeConfirm = (event) => {
        const value = event.target.value; 
        this.setState({confirm: value})
    }
    onClickSignUp = () => {
        const user = {
            email: this.state.email,
            password: this.state.password,
            displayName: this.state.displayName
        }
        this.props.actions.postSignUp(user);
    }


    render() {
        return(
            <div className='container'>
                <h1 className='text-center'>Sign Up</h1>

                <div className='col-12 mb-3'>
                    <input
                        className='form-control'
                        placeholder='Display Name...'
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                    />
                </div>

                <div className='col-12 mb-3'>
                    <input 
                        className='form-control'
                        placeholder='Email...'
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                    />
                </div>

                <div className='col-12 mb-3'>
                    <input 
                        className='form-control'
                        placeholder='Password...'
                        value={this.state.password}
                        type='password'
                        onChange={this.onChangePassword}
                    />
                </div>

                <div className='col-12 mb-3'>
                    <input 
                        className='form-control'
                        placeholder='Confirm Password...' 
                        value={this.state.confirm}
                        type='password'
                        onChange={this.onChangeConfirm}
                    />
                </div>

                <div className='text-center'>
                    <button className='btn btn-primary' onClick={this.onClickSignUp}>Submit</button>
                </div>  
    
            </div>
        )
    }
}

UserSignUpPage.defaultProps = {
    actions: {
        postSignUp: () => {
            new Promise((resolve, reject) => {
                resolve({});
            })
        }
    }
}