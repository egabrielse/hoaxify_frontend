import React from 'react';


export class UserSignupPage extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            displayName:'',
            username:'',
            password:'',
            confirm:'',
            pendingApiCall: false
        }
    };

    onChangeDisplayName = (event) => {
        const value = event.target.value; 
        this.setState({displayName: value})
    }
    onChangeUsername = (event) => {
        const value = event.target.value; 
        this.setState({username: value})
    }
    onChangePassword = (event) => {
        const value = event.target.value; 
        this.setState({password: value})
    }
    onChangeConfirm = (event) => {
        const value = event.target.value; 
        this.setState({confirm: value})
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
        .catch((error) => {
            this.setState({pendingApiCall:false});
        });
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
                        placeholder='Username...'
                        value={this.state.username}
                        onChange={this.onChangeUsername}
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
                    <button
                        className='btn btn-primary'
                        onClick={this.onClickSignup}
                        disabled={this.state.pendingApiCall}
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